// src/app/api/blogs/categories/route.js
import { NextResponse } from 'next/server';
import { BlogQueries } from '@/lib/db/queries/blogs.js';
import { withErrorHandler } from '@/lib/auth/middleware.js';

// GET /api/blogs/categories - Get all categories with post counts
export async function GET(request) {
  return withErrorHandler(async () => {
    const categories = await BlogQueries.getCategories();
    
    return NextResponse.json({
      success: true,
      data: categories
    });
  });
}