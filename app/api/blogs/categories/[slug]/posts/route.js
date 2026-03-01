// app/api/blogs/categories/[slug]/posts/route.js
import { NextResponse } from 'next/server';
import { BlogCategoryQueries } from '@/lib/db/queries/blogCategories.js';
import { ApiResponse } from '@/lib/utils/response.js';

// GET /api/blogs/categories/[slug]/posts - Get blogs in category (Public)
export async function GET(request, { params }) {
    try {
        const { slug } = await params;
        const { searchParams } = new URL(request.url);
        
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');
        
        const result = await BlogCategoryQueries.getBlogsByCategorySlug(slug, { page, limit });
        
        if (!result.category) {
            return ApiResponse.notFound('Category not found');
        }
        
        return ApiResponse.success({
            category: result.category,
            blogs: result.blogs,
            pagination: result.pagination
        });
        
    } catch (error) {
        console.error('Error in GET /api/blogs/categories/[slug]/posts:', error);
        return ApiResponse.error(error.message, 500);
    }
}