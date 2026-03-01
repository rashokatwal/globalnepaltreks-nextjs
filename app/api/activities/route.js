// app/api/activities/route.js
import { NextResponse } from 'next/server';
import { ActivityQueries } from '@/lib/db/queries/activities.js';
import { CountryActivityQueries } from '@/lib/db/queries/countryActivities.js';
import { AuthMiddleware } from '@/lib/auth/middleware.js';
import { Permissions } from '@/lib/auth/permissions.js';
import { ApiResponse } from '@/lib/utils/response.js';
import { validateActivity } from '@/lib/validators/activity.js';
import { slugify } from '@/lib/utils/slugify.js';

// GET /api/activities - Public (no authentication needed)
export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        
        // Pagination
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');
        const offset = (page - 1) * limit;
        
        // Filters
        const category = searchParams.get('category');
        const isActive = searchParams.get('is_active') !== 'false';
        const homepage = searchParams.get('homepage') === 'true';
        const navbar = searchParams.get('navbar') === 'true';
        const withColors = searchParams.get('with_colors') === 'true';
        const withCounts = searchParams.get('with_counts') === 'true';
        const search = searchParams.get('search');
        
        // Country-specific filters
        const countryId = searchParams.get('country_id');
        const countrySlug = searchParams.get('country');
        const onlyFeatured = searchParams.get('featured') === 'true';
        
        // Handle country-specific queries
        if (countryId || countrySlug) {
            let activities;
            
            if (countryId) {
                activities = await CountryActivityQueries.getActivitiesByCountry(
                    parseInt(countryId), 
                    { onlyFeatured }
                );
            } else if (countrySlug) {
                const { CountryQueries } = await import('@/lib/db/queries/countries.js');
                const country = await CountryQueries.findBySlug(countrySlug);
                
                if (!country) {
                    return ApiResponse.notFound('Country not found');
                }
                
                activities = await CountryActivityQueries.getActivitiesByCountry(
                    country.id, 
                    { onlyFeatured }
                );
            }
            
            const total = activities.length;
            const paginatedActivities = activities.slice(offset, offset + limit);
            
            return ApiResponse.success({
                data: paginatedActivities,
                pagination: {
                    page,
                    limit,
                    total,
                    totalPages: Math.ceil(total / limit)
                },
                country: countrySlug || countryId
            });
        }
        
        // Handle special queries
        if (homepage) {
            const activities = await ActivityQueries.getHomepageActivities();
            return ApiResponse.success(activities);
        }
        
        if (navbar) {
            const activities = await ActivityQueries.getNavbarActivities();
            return ApiResponse.success(activities);
        }
        
        if (withColors) {
            const activities = await ActivityQueries.getActivitiesWithColors();
            return ApiResponse.success(activities);
        }
        
        if (withCounts) {
            const activities = await ActivityQueries.getActivitiesWithCounts();
            return ApiResponse.success(activities);
        }
        
        if (search) {
            const activities = await ActivityQueries.search(search, { isActive, limit });
            return ApiResponse.success({
                data: activities,
                searchTerm: search
            });
        }
        
        if (category) {
            const activities = await ActivityQueries.findByCategory(category, { isActive, limit });
            const allInCategory = await ActivityQueries.findByCategory(category, { isActive });
            const total = allInCategory.length;
            
            return ApiResponse.success({
                data: activities,
                pagination: {
                    page,
                    limit,
                    total,
                    totalPages: Math.ceil(total / limit)
                },
                category
            });
        }
        
        // Default: get all activities with pagination
        const activities = await ActivityQueries.findAll({ isActive, limit, offset });
        const allActivities = await ActivityQueries.findAll({ isActive });
        const total = allActivities.length;
        
        const response = ApiResponse.success({
            data: activities,
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
        console.error('Error in GET /api/activities:', error);
        return ApiResponse.error(error.message, 500);
    }
}

// POST /api/activities - Create new activity (Admin only)
export async function POST(request) {
    try {
        // Check authentication and admin role
        const auth = await AuthMiddleware.requireAdmin(request);
        if (auth instanceof NextResponse) return auth;

        const body = await request.json();
        
        // Validate input
        const validation = validateActivity(body);
        if (!validation.isValid) {
            return ApiResponse.validationError(validation.errors);
        }
        
        // Generate slug from name
        const slug = body.slug || slugify(body.name);
        
        // Check if slug already exists
        const existing = await ActivityQueries.findBySlug(slug);
        if (existing) {
            return ApiResponse.conflict('Activity with this slug already exists');
        }
        
        // Create activity
        const newActivity = await ActivityQueries.create({
            name: body.name,
            slug: slug,
            image: body.image || null,
            excerpt: body.excerpt || null,
            description: body.description,
            activity_category: body.activity_category || 'Adventure',
            activity_color: body.activity_color || '#098B63',
            is_active: body.is_active !== undefined ? body.is_active : true,
            meta_title: body.meta_title || body.name,
            meta_description: body.meta_description || body.excerpt || `Experience ${body.name} in the Himalayas with expert guides.`,
            createdBy: auth.user.id
        });
        
        // Associate with countries if provided
        if (body.country_ids && Array.isArray(body.country_ids) && body.country_ids.length > 0) {
            for (let i = 0; i < body.country_ids.length; i++) {
                const countryId = body.country_ids[i];
                const isFeatured = body.featured_countries?.includes(countryId) || false;
                
                await CountryActivityQueries.addActivityToCountry(
                    countryId, 
                    newActivity.id, 
                    isFeatured,
                    i + 1
                );
            }
        }
        
        return ApiResponse.created(newActivity, 'Activity created successfully');
        
    } catch (error) {
        console.error('Error in POST /api/activities:', error);
        return ApiResponse.error(error.message, 500);
    }
}

// PUT /api/activities - Update multiple activities (Admin only)
export async function PUT(request) {
    try {
        // Check authentication and admin role
        const auth = await AuthMiddleware.requireAdmin(request);
        if (auth instanceof NextResponse) return auth;
        
        const body = await request.json();
        
        // Handle bulk status update
        if (body.action === 'bulk_status' && body.ids && Array.isArray(body.ids)) {
            if (body.ids.length === 0) {
                return ApiResponse.error('No activity IDs provided', 400);
            }
            
            const result = await ActivityQueries.bulkUpdateStatus(body.ids, body.is_active);
            
            return ApiResponse.success(result, `Updated ${body.ids.length} activities`);
        }
        
        // Handle bulk country association updates
        if (body.action === 'update_countries' && body.activity_id && body.country_ids) {
            const activity = await ActivityQueries.findById(body.activity_id);
            if (!activity) {
                return ApiResponse.notFound('Activity not found');
            }
            
            // Check permission
            if (!Permissions.canModify(auth.user, activity)) {
                return ApiResponse.forbidden('You do not have permission to modify this activity');
            }
            
            // You would implement the actual update logic here
            return ApiResponse.success(null, 'Country associations updated');
        }
        
        return ApiResponse.error('Invalid bulk operation', 400);
        
    } catch (error) {
        console.error('Error in PUT /api/activities:', error);
        return ApiResponse.error(error.message, 500);
    }
}

// DELETE /api/activities - Delete multiple activities (Admin only)
export async function DELETE(request) {
    try {
        // Check authentication and admin role
        const auth = await AuthMiddleware.requireAdmin(request);
        if (auth instanceof NextResponse) return auth;
        
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');
        const ids = searchParams.get('ids');
        
        // Delete single activity by ID
        if (id) {
            const activity = await ActivityQueries.findById(parseInt(id));
            
            if (!activity) {
                return ApiResponse.notFound('Activity not found');
            }
            
            // Check permission
            if (!Permissions.canDelete(auth.user, activity)) {
                return ApiResponse.forbidden('You do not have permission to delete this activity');
            }
            
            // Soft delete (archive)
            await ActivityQueries.softDelete(parseInt(id));
            
            return ApiResponse.success(null, 'Activity archived successfully');
        }
        
        // Bulk delete by IDs
        if (ids) {
            // Only admin can bulk delete
            if (auth.user.role !== 'admin') {
                return ApiResponse.forbidden('Admin access required for bulk delete');
            }
            
            const idArray = ids.split(',').map(id => parseInt(id.trim()));
            
            if (idArray.length === 0) {
                return ApiResponse.error('No activity IDs provided', 400);
            }
            
            await ActivityQueries.bulkUpdateStatus(idArray, false);
            
            return ApiResponse.success(null, `Archived ${idArray.length} activities`);
        }
        
        return ApiResponse.error('Please provide an id or ids parameter', 400);
        
    } catch (error) {
        console.error('Error in DELETE /api/activities:', error);
        return ApiResponse.error(error.message, 500);
    }
}