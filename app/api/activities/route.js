// src/app/api/activities/route.js
import { NextResponse } from 'next/server';
import { ActivityQueries } from '@/lib/db/queries/activities.js';

// GET /api/activities - Get all activities (public)
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
        
        // Handle special queries
        if (homepage) {
            const activities = await ActivityQueries.getHomepageActivities();
            return NextResponse.json({
                success: true,
                data: activities
            });
        }
        
        if (navbar) {
            const activities = await ActivityQueries.getNavbarActivities();
            return NextResponse.json({
                success: true,
                data: activities
            });
        }
        
        if (withColors) {
            const activities = await ActivityQueries.getActivitiesWithColors();
            return NextResponse.json({
                success: true,
                data: activities
            });
        }
        
        if (withCounts) {
            const activities = await ActivityQueries.getActivitiesWithCounts();
            return NextResponse.json({
                success: true,
                data: activities
            });
        }
        
        if (search) {
            const activities = await ActivityQueries.search(search, { isActive, limit });
            return NextResponse.json({
                success: true,
                data: activities,
                searchTerm: search
            });
        }
        
        if (category) {
            const activities = await ActivityQueries.findByCategory(category, { isActive, limit });
            return NextResponse.json({
                success: true,
                data: activities,
                category
            });
        }
        
        // Default: get all activities with pagination
        const activities = await ActivityQueries.findAll({ 
            isActive, 
            limit, 
            offset 
        });
        
        // Get total count for pagination
        const allActivities = await ActivityQueries.findAll({ isActive });
        const total = allActivities.length;
        
        const response = NextResponse.json({
            success: true,
            data: activities,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit)
            }
        });
        
        // Cache for 1 hour (public routes)
        response.headers.set('Cache-Control', 's-maxage=3600, stale-while-revalidate=7200');
        
        return response;
        
    } catch (error) {
        console.error('Error in GET /api/activities:', error);
        return NextResponse.json(
            { 
                success: false, 
                error: 'Failed to fetch activities',
                message: error.message 
            },
            { status: 500 }
        );
    }
}

// POST /api/activities - Create new activity
export async function POST(request) {
    try {
        const body = await request.json();
        
        // Basic validation
        if (!body.name) {
            return NextResponse.json(
                { 
                    success: false, 
                    error: 'Validation failed',
                    errors: ['Name is required'] 
                },
                { status: 400 }
            );
        }
        
        if (!body.description) {
            return NextResponse.json(
                { 
                    success: false, 
                    error: 'Validation failed',
                    errors: ['Description is required'] 
                },
                { status: 400 }
            );
        }
        
        // Generate slug from name
        const slug = body.slug || body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
        
        // Check if slug already exists
        const existing = await ActivityQueries.findBySlug(slug);
        if (existing) {
            return NextResponse.json(
                { 
                    success: false, 
                    error: 'Activity with this slug already exists' 
                },
                { status: 409 }
            );
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
            meta_description: body.meta_description || body.excerpt || `Experience ${body.name} in the Himalayas with expert guides.`
        });
        
        return NextResponse.json({
            success: true,
            message: 'Activity created successfully',
            data: newActivity
        }, { status: 201 });
        
    } catch (error) {
        console.error('Error in POST /api/activities:', error);
        return NextResponse.json(
            { 
                success: false, 
                error: 'Failed to create activity',
                message: error.message 
            },
            { status: 500 }
        );
    }
}

// PUT /api/activities - Update multiple activities (bulk operation)
export async function PUT(request) {
    try {
        const body = await request.json();
        
        // Handle bulk status update
        if (body.action === 'bulk_status' && body.ids && Array.isArray(body.ids)) {
            if (body.ids.length === 0) {
                return NextResponse.json(
                    { 
                        success: false, 
                        error: 'No activity IDs provided' 
                    },
                    { status: 400 }
                );
            }
            
            const result = await ActivityQueries.bulkUpdateStatus(body.ids, body.is_active);
            
            return NextResponse.json({
                success: true,
                message: `Updated ${body.ids.length} activities`,
                data: result
            });
        }
        
        return NextResponse.json(
            { 
                success: false, 
                error: 'Invalid bulk operation' 
            },
            { status: 400 }
        );
        
    } catch (error) {
        console.error('Error in PUT /api/activities:', error);
        return NextResponse.json(
            { 
                success: false, 
                error: 'Failed to update activities',
                message: error.message 
            },
            { status: 500 }
        );
    }
}

// DELETE /api/activities - Delete multiple activities (bulk operation)
export async function DELETE(request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');
        const ids = searchParams.get('ids');
        
        // Delete single activity by ID
        if (id) {
            const activity = await ActivityQueries.findById(parseInt(id));
            
            if (!activity) {
                return NextResponse.json(
                    { 
                        success: false, 
                        error: 'Activity not found' 
                    },
                    { status: 404 }
                );
            }
            
            // Soft delete (archive)
            await ActivityQueries.softDelete(parseInt(id));
            
            return NextResponse.json({
                success: true,
                message: 'Activity archived successfully'
            });
        }
        
        // Bulk delete by IDs
        if (ids) {
            const idArray = ids.split(',').map(id => parseInt(id.trim()));
            
            if (idArray.length === 0) {
                return NextResponse.json(
                    { 
                        success: false, 
                        error: 'No activity IDs provided' 
                    },
                    { status: 400 }
                );
            }
            
            await ActivityQueries.bulkUpdateStatus(idArray, false);
            
            return NextResponse.json({
                success: true,
                message: `Archived ${idArray.length} activities`
            });
        }
        
        return NextResponse.json(
            { 
                success: false, 
                error: 'Please provide an id or ids parameter' 
            },
            { status: 400 }
        );
        
    } catch (error) {
        console.error('Error in DELETE /api/activities:', error);
        return NextResponse.json(
            { 
                success: false, 
                error: 'Failed to delete activities',
                message: error.message 
            },
            { status: 500 }
        );
    }
}