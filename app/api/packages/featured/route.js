// app/api/packages/featured/route.js
import { NextResponse } from 'next/server';
import { PackageQueries } from '@/lib/db/queries/packages.js';
import { ApiResponse } from '@/lib/utils/response.js';

// GET /api/packages/featured - Public
export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const limit = parseInt(searchParams.get('limit') || '6');
        
        const packages = await PackageQueries.getFeatured(limit);
        
        return ApiResponse.success(packages);
        
    } catch (error) {
        console.error('Error in GET /api/packages/featured:', error);
        return ApiResponse.error(error.message, 500);
    }
}