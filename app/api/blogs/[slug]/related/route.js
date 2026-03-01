// src/app/api/blogs/[slug]/related/route.js
import { NextResponse } from 'next/server';
import { BlogQueries } from '@/lib/db/queries/blogs.js';

// GET /api/blogs/[slug]/related - Get related blogs
export async function GET(request, { params }) {
    try {
        const { slug } = await params;
        const { searchParams } = new URL(request.url);
        const limit = parseInt(searchParams.get('limit') || '3');
        
        const blog = await BlogQueries.findBySlug(slug);
        
        if (!blog) {
            return NextResponse.json(
                { 
                    success: false, 
                    error: 'Blog not found' 
                },
                { status: 404 }
            );
        }
        
        const related = await BlogQueries.getRelated(
            blog.id, 
            blog.country_id, 
            blog.activity_id, 
            limit
        );
        
        return NextResponse.json({
            success: true,
            data: related || []
        });
        
    } catch (error) {
        console.error('Error in GET /api/blogs/[slug]/related:', error);
        return NextResponse.json(
            { 
                success: false, 
                error: 'Failed to fetch related blogs',
                message: error.message 
            },
            { status: 500 }
        );
    }
}