// src/app/api/blogs/stats/route.js
import { NextResponse } from 'next/server';
import { BlogQueries } from '@/lib/db/queries/blogs.js';

// GET /api/blogs/stats - Get blog statistics
export async function GET() {
    try {
        const stats = await BlogQueries.getStats();
        
        return NextResponse.json({
            success: true,
            data: stats
        });
        
    } catch (error) {
        console.error('Error in GET /api/blogs/stats:', error);
        return NextResponse.json(
            { 
                success: false, 
                error: 'Failed to fetch statistics',
                message: error.message 
            },
            { status: 500 }
        );
    }
}