// app/api/countries/route.js
import { NextResponse } from 'next/server';
import { CountryQueries } from '@/lib/db/queries/countries.js';
import { CountryActivityQueries } from '@/lib/db/queries/countryActivities.js';
import { AuthMiddleware } from '@/lib/auth/middleware.js';
import { Permissions } from '@/lib/auth/permissions.js';
import { ApiResponse } from '@/lib/utils/response.js';
import { validateCountry } from '@/lib/validators/country.js';
import { slugify } from '@/lib/utils/slugify.js';

// GET /api/countries - Public (no authentication needed)
export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        
        // Pagination
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');
        const offset = (page - 1) * limit;
        
        // Filters
        const isActive = searchParams.get('is_active') !== 'false';
        const navbar = searchParams.get('navbar') === 'true';
        const withCounts = searchParams.get('with_counts') === 'true';
        const featured = searchParams.get('featured') === 'true';
        const search = searchParams.get('search');
        
        // Handle special queries
        if (navbar) {
            const countries = await CountryQueries.getNavbarCountries();
            return ApiResponse.success(countries);
        }
        
        if (withCounts) {
            const countries = await CountryQueries.getCountriesWithActivityCounts();
            return ApiResponse.success(countries);
        }
        
        if (featured) {
            const countries = await CountryQueries.getCountriesWithFeaturedActivities();
            return ApiResponse.success(countries);
        }
        
        if (search) {
            const countries = await CountryQueries.search(search, { isActive, limit });
            return ApiResponse.success({
                data: countries,
                searchTerm: search
            });
        }
        
        // Default: get all countries with pagination
        const countries = await CountryQueries.findAll({ isActive, limit, offset });
        const allCountries = await CountryQueries.findAll({ isActive });
        const total = allCountries.length;
        
        const response = ApiResponse.success({
            data: countries,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit)
            }
        });
        
        // Cache for 1 hour
        response.headers.set('Cache-Control', 's-maxage=3600, stale-while-revalidate=7200');
        
        return response;
        
    } catch (error) {
        console.error('Error in GET /api/countries:', error);
        return ApiResponse.error(error.message, 500);
    }
}

// POST /api/countries - Create new country (Admin only)
export async function POST(request) {
    try {
        // Check authentication and admin role
        const auth = await AuthMiddleware.requireAdmin(request);
        if (auth instanceof NextResponse) return auth;

        const body = await request.json();
        
        // Validate input
        const validation = validateCountry(body);
        if (!validation.isValid) {
            return ApiResponse.validationError(validation.errors);
        }
        
        // Generate slug from name if not provided
        const slug = body.slug || slugify(body.name);
        
        // Check if slug already exists
        const existing = await CountryQueries.findBySlug(slug);
        if (existing) {
            return ApiResponse.conflict('Country with this slug already exists');
        }
        
        // Create country
        const newCountry = await CountryQueries.create({
            name: body.name,
            slug: slug,
            featured_image: body.featured_image || null,
            description: body.description || null,
            meta_title: body.meta_title || body.name,
            meta_description: body.meta_description || `Explore trekking and tours in ${body.name} with expert local guides.`,
            is_active: body.is_active !== undefined ? body.is_active : true,
            createdBy: auth.user.id
        });
        
        // If activity_ids are provided, associate activities with country
        if (body.activity_ids && Array.isArray(body.activity_ids) && body.activity_ids.length > 0) {
            for (let i = 0; i < body.activity_ids.length; i++) {
                const activityId = body.activity_ids[i];
                const isFeatured = body.featured_activities?.includes(activityId) || false;
                
                await CountryActivityQueries.addActivityToCountry(
                    newCountry.id,
                    activityId,
                    isFeatured,
                    i + 1 // display order
                );
            }
        }
        
        return ApiResponse.created(newCountry, 'Country created successfully');
        
    } catch (error) {
        console.error('Error in POST /api/countries:', error);
        return ApiResponse.error(error.message, 500);
    }
}

// PUT /api/countries - Update multiple countries (Admin only)
export async function PUT(request) {
    try {
        // Check authentication and admin role
        const auth = await AuthMiddleware.requireAdmin(request);
        if (auth instanceof NextResponse) return auth;
        
        const body = await request.json();
        
        // Handle bulk status update
        if (body.action === 'bulk_status' && body.ids && Array.isArray(body.ids)) {
            if (body.ids.length === 0) {
                return ApiResponse.error('No country IDs provided', 400);
            }
            
            const result = await CountryQueries.bulkUpdateStatus(body.ids, body.is_active);
            
            return ApiResponse.success(result, `Updated ${body.ids.length} countries`);
        }
        
        return ApiResponse.error('Invalid bulk operation', 400);
        
    } catch (error) {
        console.error('Error in PUT /api/countries:', error);
        return ApiResponse.error(error.message, 500);
    }
}

// DELETE /api/countries - Delete multiple countries (Admin only)
export async function DELETE(request) {
    try {
        // Check authentication and admin role
        const auth = await AuthMiddleware.requireAdmin(request);
        if (auth instanceof NextResponse) return auth;
        
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');
        const ids = searchParams.get('ids');
        
        // Delete single country by ID
        if (id) {
            const country = await CountryQueries.findById(parseInt(id));
            
            if (!country) {
                return ApiResponse.notFound('Country not found');
            }
            
            // Check permission
            if (!Permissions.canDelete(auth.user, country)) {
                return ApiResponse.forbidden('You do not have permission to delete this country');
            }
            
            // Soft delete (archive)
            await CountryQueries.softDelete(parseInt(id));
            
            return ApiResponse.success(null, 'Country archived successfully');
        }
        
        // Bulk delete by IDs
        if (ids) {
            // Only admin can bulk delete
            if (auth.user.role !== 'admin') {
                return ApiResponse.forbidden('Admin access required for bulk delete');
            }
            
            const idArray = ids.split(',').map(id => parseInt(id.trim()));
            
            if (idArray.length === 0) {
                return ApiResponse.error('No country IDs provided', 400);
            }
            
            await CountryQueries.bulkUpdateStatus(idArray, false);
            
            return ApiResponse.success(null, `Archived ${idArray.length} countries`);
        }
        
        return ApiResponse.error('Please provide an id or ids parameter', 400);
        
    } catch (error) {
        console.error('Error in DELETE /api/countries:', error);
        return ApiResponse.error(error.message, 500);
    }
}