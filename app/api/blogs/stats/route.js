// src/app/api/blogs/stats/route.js
import { NextResponse } from 'next/server';
import { BlogQueries } from '@/lib/db/queries/blogs.js';
// import { withErrorHandler, withAdmin } from '@/lib/auth/middleware.js';

// GET /api/blogs/stats - Get blog statistics (admin only)
export async function GET(request) {
  return (async () => {
    // Check authentication and admin role
    const authResult = await withAdmin(request);
    if (authResult) return authResult;
    
    const stats = await BlogQueries.getStats();
    
    return NextResponse.json({
      success: true,
      data: stats
    });
  });
}