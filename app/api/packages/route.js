// app/api/packages/route.js
import { NextResponse } from 'next/server';
import { PackageQueries } from '@/lib/db/queries/packages.js';
import { PackageFeatureQueries } from '@/lib/db/queries/packageFeatures.js';
import { PackageDocumentQueries } from '@/lib/db/queries/packageDocuments.js';
import { AuthMiddleware } from '@/lib/auth/middleware.js';
import { Permissions } from '@/lib/auth/permissions.js';
import { ApiResponse } from '@/lib/utils/response.js';
import { validatePackage, validatePackageFeature } from '@/lib/validators/package.js';
import { slugify } from '@/lib/utils/slugify.js';

// GET /api/packages - Public (no authentication needed)
// app/api/packages/route.js - ADD these filters

// GET /api/packages - Public (no authentication needed)
export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        
        // Pagination
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');
        
        // Filters - accept multiple parameter names for flexibility
        const countryId = searchParams.get('country_id') || searchParams.get('countryId') || searchParams.get('country');
        const activityId = searchParams.get('activity_id') || searchParams.get('activityId') || searchParams.get('activity');
        const difficulty = searchParams.get('difficulty');
        const featured = searchParams.get('featured') === 'true';
        const search = searchParams.get('search');
        
        // NEW FILTERS TO ADD
        const minPrice = searchParams.get('min_price') || searchParams.get('minPrice');
        const maxPrice = searchParams.get('max_price') || searchParams.get('maxPrice');
        const maxDuration = searchParams.get('max_duration') || searchParams.get('duration');
        const sort = searchParams.get('sort') || 'featured';
        
        console.log('API Request params:', { 
            countryId, 
            activityId, 
            difficulty, 
            featured, 
            search,
            minPrice,
            maxPrice,
            maxDuration,
            sort,
            page, 
            limit 
        });
        
        // Handle featured
        if (featured) {
            const packages = await PackageQueries.getFeatured(limit);
            return ApiResponse.success(packages);
        }
        
        // Handle search
        if (search) {
            const result = await PackageQueries.search(search, {
                page,
                limit,
                countryId: countryId ? parseInt(countryId) : null,
                activityId: activityId ? parseInt(activityId) : null,
                minPrice: minPrice ? parseInt(minPrice) : null,
                maxPrice: maxPrice ? parseInt(maxPrice) : null,
                maxDuration: maxDuration ? parseInt(maxDuration) : null,
                sort
            });
            return ApiResponse.success({
                packages: result.packages,
                pagination: result.pagination,
                searchTerm: search
            });
        }
        
        // Get all packages with filters
        const result = await PackageQueries.findAll({
            page,
            limit,
            countryId: countryId ? parseInt(countryId) : null,
            activityId: activityId ? parseInt(activityId) : null,
            difficulty,
            search,
            minPrice: minPrice ? parseInt(minPrice) : null,
            maxPrice: maxPrice ? parseInt(maxPrice) : null,
            maxDuration: maxDuration ? parseInt(maxDuration) : null,
            sort
        });
        
        return ApiResponse.success({
            packages: result.packages || [],
            pagination: result.pagination || {
                page,
                limit,
                total: 0,
                totalPages: 0
            }
        });
        
    } catch (error) {
        console.error('Error in GET /api/packages:', error);
        return ApiResponse.error(error.message, 500);
    }
}

// POST /api/packages - Create new package (Admin only)
export async function POST(request) {
    try {
        // Check authentication and admin role
        const auth = await AuthMiddleware.requireAdmin(request);
        if (auth instanceof NextResponse) return auth;

        const body = await request.json();
        
        // Validate package
        const validation = validatePackage(body);
        if (!validation.isValid) {
            return ApiResponse.validationError(validation.errors);
        }
        
        // Generate slug from title if not provided
        const slug = body.slug || slugify(body.title);
        
        // Check if slug already exists
        const existing = await PackageQueries.findBySlug(slug);
        if (existing) {
            return ApiResponse.conflict('Package with this slug already exists');
        }
        
        // Prepare package data
        const packageData = {
            country_id: body.country_id,
            activity_id: body.activity_id,
            title: body.title,
            slug: slug,
            short_description: body.short_description || null,
            duration_days: body.duration_days,
            price: body.price,
            difficulty: body.difficulty || 'moderate',
            max_altitude: body.max_altitude || null,
            group_size_min: body.group_size_min || 1,
            group_size_max: body.group_size_max || null,
            best_season: body.best_season || null,
            overview: body.overview || null,
            highlights: body.highlights || null,
            featured_image: body.featured_image || null,
            gallery: body.gallery || null,
            map_image: body.map_image || null,
            meta_title: body.meta_title || body.title,
            meta_description: body.meta_description || body.short_description || `Book ${body.title} with expert guides.`,
            keywords: body.keywords || null,
            is_featured: body.is_featured || false,
            is_active: body.is_active !== undefined ? body.is_active : true
        };
        
        // Create package
        const newPackage = await PackageQueries.create(packageData);
        
        // Insert itinerary if provided
        if (body.itinerary && Array.isArray(body.itinerary) && body.itinerary.length > 0) {
            for (const item of body.itinerary) {
                await PackageQueries.addItineraryItem(newPackage.id, {
                    ...item,
                    package_id: newPackage.id
                });
            }
        }
        
        // Insert features if provided
        if (body.features && Array.isArray(body.features) && body.features.length > 0) {
            for (const feature of body.features) {
                await PackageFeatureQueries.add(newPackage.id, feature);
            }
        }
        
        // Insert essential info if provided
        if (body.essential_info) {
            await PackageQueries.addEssentialInfo(newPackage.id, body.essential_info);
        }
        
        // Insert FAQs if provided
        if (body.faqs && Array.isArray(body.faqs) && body.faqs.length > 0) {
            for (const faq of body.faqs) {
                await PackageQueries.addFAQ(newPackage.id, faq);
            }
        }
        
        // Insert available dates if provided
        if (body.available_dates && Array.isArray(body.available_dates) && body.available_dates.length > 0) {
            for (const date of body.available_dates) {
                await PackageQueries.addDate(newPackage.id, date);
            }
        }
        
        // Insert gallery images if provided
        if (body.gallery_images && Array.isArray(body.gallery_images) && body.gallery_images.length > 0) {
            for (const image of body.gallery_images) {
                await PackageQueries.addGalleryImage(newPackage.id, image);
            }
        }
        
        // Insert documents if provided
        if (body.documents && Array.isArray(body.documents) && body.documents.length > 0) {
            for (const document of body.documents) {
                await PackageDocumentQueries.add(newPackage.id, document);
            }
        }
        
        return ApiResponse.created(newPackage, 'Package created successfully');
        
    } catch (error) {
        console.error('Error in POST /api/packages:', error);
        return ApiResponse.error(error.message, 500);
    }
}

// PUT /api/packages - Update multiple packages (Admin only)
export async function PUT(request) {
    try {
        // Check authentication and admin role
        const auth = await AuthMiddleware.requireAdmin(request);
        if (auth instanceof NextResponse) return auth;
        
        const body = await request.json();
        
        // Handle bulk status update
        if (body.action === 'bulk_status' && body.ids && Array.isArray(body.ids)) {
            if (body.ids.length === 0) {
                return ApiResponse.error('No package IDs provided', 400);
            }
            
            const result = await PackageQueries.bulkUpdateStatus(body.ids, body.is_active);
            
            return ApiResponse.success(result, `Updated ${body.ids.length} packages`);
        }
        
        return ApiResponse.error('Invalid bulk operation', 400);
        
    } catch (error) {
        console.error('Error in PUT /api/packages:', error);
        return ApiResponse.error(error.message, 500);
    }
}

// DELETE /api/packages - Delete multiple packages (Admin only)
export async function DELETE(request) {
    try {
        // Check authentication and admin role
        const auth = await AuthMiddleware.requireAdmin(request);
        if (auth instanceof NextResponse) return auth;
        
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');
        const ids = searchParams.get('ids');
        
        // Delete single package by ID
        if (id) {
            const pkg = await PackageQueries.findById(parseInt(id));
            
            if (!pkg) {
                return ApiResponse.notFound('Package not found');
            }
            
            // Check permission
            if (!Permissions.canDelete(auth.user, pkg)) {
                return ApiResponse.forbidden('You do not have permission to delete this package');
            }
            
            // Soft delete (archive)
            await PackageQueries.softDelete(parseInt(id));
            
            return ApiResponse.success(null, 'Package archived successfully');
        }
        
        // Bulk delete by IDs
        if (ids) {
            // Only admin can bulk delete
            if (auth.user.role !== 'admin') {
                return ApiResponse.forbidden('Admin access required for bulk delete');
            }
            
            const idArray = ids.split(',').map(id => parseInt(id.trim()));
            
            if (idArray.length === 0) {
                return ApiResponse.error('No package IDs provided', 400);
            }
            
            await PackageQueries.bulkUpdateStatus(idArray, false);
            
            return ApiResponse.success(null, `Archived ${idArray.length} packages`);
        }
        
        return ApiResponse.error('Please provide an id or ids parameter', 400);
        
    } catch (error) {
        console.error('Error in DELETE /api/packages:', error);
        return ApiResponse.error(error.message, 500);
    }
}