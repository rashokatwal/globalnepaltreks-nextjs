// app/api/activities/[slug]/route.js
import { NextResponse } from 'next/server';
import { ActivityQueries } from '@/lib/db/queries/activities.js';
import { AuthMiddleware } from '@/lib/auth/middleware.js';
import { Permissions } from '@/lib/auth/permissions.js';
import { ApiResponse } from '@/lib/utils/response.js';
import { validateActivity } from '@/lib/validators/activity.js';

// GET /api/activities/[slug] - Public
export async function GET(request, { params }) {
    try {
        const { slug } = await params;
        
        let activity = await ActivityQueries.findBySlug(slug);
        
        if (!activity && !isNaN(parseInt(slug))) {
            activity = await ActivityQueries.findById(parseInt(slug));
        }
        
        if (!activity) {
            return ApiResponse.notFound('Activity not found');
        }
        
        return ApiResponse.success(activity);
        
    } catch (error) {
        console.error('Error in GET /api/activities/[slug]:', error);
        return ApiResponse.error(error.message, 500);
    }
}

// PUT /api/activities/[slug] - Update activity (Admin only)
export async function PUT(request, { params }) {
    try {
        const auth = await AuthMiddleware.requireAdmin(request);
        if (auth instanceof NextResponse) return auth;
        
        const { slug } = await params;
        const body = await request.json();
        
        let activity = await ActivityQueries.findBySlug(slug);
        
        if (!activity && !isNaN(parseInt(slug))) {
            activity = await ActivityQueries.findById(parseInt(slug));
        }
        
        if (!activity) {
            return ApiResponse.notFound('Activity not found');
        }
        
        // Check permission
        if (!Permissions.canModify(auth.user, activity)) {
            return ApiResponse.forbidden('You do not have permission to modify this activity');
        }
        
        // Validate
        const validation = validateActivity(body, true);
        if (!validation.isValid) {
            return ApiResponse.validationError(validation.errors);
        }
        
        // Check slug uniqueness if changing
        if (body.slug && body.slug !== activity.slug) {
            const existing = await ActivityQueries.findBySlug(body.slug);
            if (existing && existing.id !== activity.id) {
                return ApiResponse.conflict('Activity with this slug already exists');
            }
        }
        
        const updatedActivity = await ActivityQueries.update(activity.id, body);
        
        return ApiResponse.success(updatedActivity, 'Activity updated successfully');
        
    } catch (error) {
        console.error('Error in PUT /api/activities/[slug]:', error);
        return ApiResponse.error(error.message, 500);
    }
}

// PATCH /api/activities/[slug] - Partial update (Admin only)
export async function PATCH(request, { params }) {
    try {
        const auth = await AuthMiddleware.requireAdmin(request);
        if (auth instanceof NextResponse) return auth;
        
        const { slug } = await params;
        const body = await request.json();
        
        let activity = await ActivityQueries.findBySlug(slug);
        
        if (!activity && !isNaN(parseInt(slug))) {
            activity = await ActivityQueries.findById(parseInt(slug));
        }
        
        if (!activity) {
            return ApiResponse.notFound('Activity not found');
        }
        
        // Handle toggle active status
        if (body.action === 'toggle_active') {
            const updated = await ActivityQueries.update(activity.id, {
                is_active: !activity.is_active
            });
            
            return ApiResponse.success(updated, `Activity ${updated.is_active ? 'activated' : 'deactivated'} successfully`);
        }
        
        return ApiResponse.error('Invalid action', 400);
        
    } catch (error) {
        console.error('Error in PATCH /api/activities/[slug]:', error);
        return ApiResponse.error(error.message, 500);
    }
}

// DELETE /api/activities/[slug] - Delete activity (Admin only)
export async function DELETE(request, { params }) {
    try {
        const auth = await AuthMiddleware.requireAdmin(request);
        if (auth instanceof NextResponse) return auth;
        
        const { slug } = await params;
        
        let activity = await ActivityQueries.findBySlug(slug);
        
        if (!activity && !isNaN(parseInt(slug))) {
            activity = await ActivityQueries.findById(parseInt(slug));
        }
        
        if (!activity) {
            return ApiResponse.notFound('Activity not found');
        }
        
        // Check permission
        if (!Permissions.canDelete(auth.user, activity)) {
            return ApiResponse.forbidden('You do not have permission to delete this activity');
        }
        
        await ActivityQueries.softDelete(activity.id);
        
        return ApiResponse.success(null, 'Activity deleted successfully');
        
    } catch (error) {
        console.error('Error in DELETE /api/activities/[slug]:', error);
        return ApiResponse.error(error.message, 500);
    }
}