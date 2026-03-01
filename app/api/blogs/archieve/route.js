// src/app/api/blogs/archive/route.js
import { NextResponse } from 'next/server';
import { BlogQueries } from '@/lib/db/queries/blogs.js';

// GET /api/blogs/archive - Get archive by month/year
export async function GET() {
    try {
        const archive = await BlogQueries.getArchive();
        
        return NextResponse.json({
            success: true,
            data: archive
        });
        
    } catch (error) {
        console.error('Error in GET /api/blogs/archive:', error);
        return NextResponse.json(
            { 
                success: false, 
                error: 'Failed to fetch archive',
                message: error.message 
            },
            { status: 500 }
        );
    }
}