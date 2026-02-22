// src/app/api/blogs/tags/route.js
import { NextResponse } from 'next/server';
import { BlogQueries } from '@/lib/db/queries/blogs.js';
import { withErrorHandler } from '@/lib/auth/middleware.js';

// GET /api/blogs/tags - Get all tags with counts
export async function GET(request) {
  return withErrorHandler(async () => {
    const tags = await BlogQueries.getTags();
    
    return NextResponse.json({
      success: true,
      data: tags
    });
  });
}