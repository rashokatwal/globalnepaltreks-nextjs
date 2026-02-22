// src/app/api/blogs/archive/route.js
import { NextResponse } from 'next/server';
import { BlogQueries } from '@/lib/db/queries/blogs.js';
import { withErrorHandler } from '@/lib/auth/middleware.js';

// GET /api/blogs/archive - Get archive by month/year
export async function GET(request) {
  return withErrorHandler(async () => {
    const archive = await BlogQueries.getArchive();
    
    return NextResponse.json({
      success: true,
      data: archive
    });
  });
}