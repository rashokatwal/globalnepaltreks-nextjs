// src/app/api/blogs/route.js
import { NextResponse } from 'next/server';
import { BlogQueries } from '@/lib/db/queries/blogs.js';

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    
    const country = searchParams.get('country');
    const activity = searchParams.get('activity');
    const author = searchParams.get('author');
    const search = searchParams.get('search');
    const featured = searchParams.get('featured') === 'true';
    const popular = searchParams.get('popular') === 'true';
    const latest = searchParams.get('latest') === 'true';
    
    if (featured) {
      const blogs = await BlogQueries.getFeatured(limit);
      return NextResponse.json({
        success: true,
        data: blogs
      });
    }
    
    if (popular) {
      const blogs = await BlogQueries.getPopular(limit);
      return NextResponse.json({
        success: true,
        data: blogs
      });
    }
    
    if (latest) {
      const blogs = await BlogQueries.getLatest(limit);
      return NextResponse.json({
        success: true,
        data: blogs
      });
    }
    
    if (country) {
      const result = await BlogQueries.findByCountry(parseInt(country), { page, limit });
      return NextResponse.json({
        success: true,
        data: result.blogs,
        pagination: result.pagination
      });
    }
    
    if (activity) {
      const result = await BlogQueries.findByActivity(parseInt(activity), { page, limit });
      return NextResponse.json({
        success: true,
        data: result.blogs,
        pagination: result.pagination
      });
    }
    
    if (author) {
      const result = await BlogQueries.findByAuthor(author, { page, limit });
      return NextResponse.json({
        success: true,
        data: result.blogs,
        pagination: result.pagination
      });
    }
    
    if (search) {
      const result = await BlogQueries.search(search, { page, limit });
      return NextResponse.json({
        success: true,
        data: result.blogs,
        pagination: result.pagination,
        searchTerm: result.searchTerm
      });
    }
    
    // Default: get all blogs
    const result = await BlogQueries.findAll({});
    
    // Add cache control for public routes
    const response = NextResponse.json({
      success: true,
      data: result.blogs
    });
    
    // response.headers.set('Cache-Control', 's-maxage=60, stale-while-revalidate=120');
    
    return response;
  // });
}

// POST /api/blogs - Create new blog (admin only)
// export async function POST(request) {
//   return withErrorHandler(async () => {
//     // Check authentication and admin role
//     const authResult = await withAdmin(request);
//     if (authResult) return authResult;
    
//     const body = await request.json();
    
//     // Validate input
//     const validation = validateBlog(body);
//     if (!validation.isValid) {
//       return NextResponse.json(
//         { error: 'Validation failed', errors: validation.errors },
//         { status: 400 }
//       );
//     }
    
//     // Generate slug if not provided
//     if (!body.slug) {
//       body.slug = slugify(body.title);
//     }
    
//     // Check if slug already exists
//     const existing = await BlogQueries.findBySlug(body.slug);
//     if (existing) {
//       return NextResponse.json(
//         { error: 'Blog with this slug already exists' },
//         { status: 409 }
//       );
//     }
    
//     // Create blog
//     const newBlog = await BlogQueries.create({
//       ...body,
//       author: body.author || request.user?.name || 'Admin',
//       reading_time: body.reading_time || calculateReadingTime(body.content)
//     });
    
//     return NextResponse.json({
//       success: true,
//       message: 'Blog created successfully',
//       data: newBlog
//     }, { status: 201 });
//   });
// }

// Helper function to calculate reading time
// function calculateReadingTime(content) {
//   const wordsPerMinute = 200;
//   const wordCount = content.trim().split(/\s+/).length;
//   return Math.ceil(wordCount / wordsPerMinute);
// }