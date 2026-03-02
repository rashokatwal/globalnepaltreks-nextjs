// app/api/packages/activities/[activityId]/route.js
import { NextResponse } from 'next/server';
import { PackageQueries } from '@/lib/db/queries/packages.js';
import { ActivityQueries } from '@/lib/db/queries/activities.js';
import { ApiResponse } from '@/lib/utils/response.js';

// GET /api/packages/activities/[activityId] - Public
export async function GET(request, { params }) {
    try {
        const { activityId } = await params;
        const { searchParams } = new URL(request.url);
        
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');
        const featured = searchParams.get('featured') === 'true';
        
        // Get activity info
        let activity;
        if (isNaN(parseInt(activityId))) {
            activity = await ActivityQueries.findBySlug(activityId);
        } else {
            activity = await ActivityQueries.findById(parseInt(activityId));
        }
        
        if (!activity) {
            return ApiResponse.notFound('Activity not found');
        }
        
        const result = await PackageQueries.findByActivity(activity.id, {
            page,
            limit,
            featured
        });
        
        return ApiResponse.success({
            activity: {
                id: activity.id,
                name: activity.name,
                slug: activity.slug
            },
            packages: result.packages,
            pagination: result.pagination
        });
        
    } catch (error) {
        console.error('Error in GET /api/packages/activities/[activityId]:', error);
        return ApiResponse.error(error.message, 500);
    }
}