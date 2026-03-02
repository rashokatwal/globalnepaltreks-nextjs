// app/api/packages/stats/route.js
import { NextResponse } from 'next/server';
import { PackageQueries } from '@/lib/db/queries/packages.js';
import { AuthMiddleware } from '@/lib/auth/middleware.js';
import { ApiResponse } from '@/lib/utils/response.js';

// GET /api/packages/stats - Admin only
export async function GET(request) {
    try {
        const auth = await AuthMiddleware.requireAdmin(request);
        if (auth instanceof NextResponse) return auth;
        
        const stats = await PackageQueries.getStats();
        
        return ApiResponse.success(stats);
        
    } catch (error) {
        console.error('Error in GET /api/packages/stats:', error);
        return ApiResponse.error(error.message, 500);
    }
}