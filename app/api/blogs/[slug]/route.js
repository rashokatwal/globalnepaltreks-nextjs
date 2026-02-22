// src/app/api/blogs/[slug]/route.js
import { NextResponse } from 'next/server';
import { BlogQueries } from '@/lib/db/queries/blogs.js';
import { withErrorHandler, withAdmin } from '@/lib/auth/middleware.js';
import { validateBlog } from '@/lib/validators/blog.js';
import { slugify } from '@/lib/utils/slugify.js';

// GET /api/blogs/[slug] - Get single blog by slug (public)
export async function GET(request, { params }) {
  return withErrorHandler(async () => {
    const { slug } = await params;
    
    const blog = await BlogQueries.findBySlug(slug);
    
    if (!blog) {
      return NextResponse.json(
        { error: 'Blog not found' },
        { status: 404 }
      );
    }
    
    // Get related blogs
    const related = await BlogQueries.getRelated(
      blog.id, 
      blog.country_id, 
      blog.activity_id, 
      3
    );
    
    // Get adjacent posts for navigation
    const adjacent = await BlogQueries.getAdjacentPosts(blog.id, blog.published_at);
    
    const response = NextResponse.json({
      success: true,
      data: {
        ...blog,
        related,
        navigation: adjacent
      }
    });
    
    // Cache for 1 hour
    response.headers.set('Cache-Control', 's-maxage=3600');
    
    return response;
  });
}

// PUT /api/blogs/[slug] - Update blog (admin only)
export async function PUT(request, { params }) {
  return withErrorHandler(async () => {
    // Check authentication and admin role
    const authResult = await withAdmin(request);
    if (authResult) return authResult;
    
    const { slug } = await params;
    const body = await request.json();
    
    // Find existing blog
    const existingBlog = await BlogQueries.findBySlug(slug);
    if (!existingBlog) {
      return NextResponse.json(
        { error: 'Blog not found' },
        { status: 404 }
      );
    }
    
    // Validate input (partial update allowed)
    const validation = validateBlog(body, true);
    if (!validation.isValid) {
      return NextResponse.json(
        { error: 'Validation failed', errors: validation.errors },
        { status: 400 }
      );
    }
    
    // Handle slug change
    if (body.title && !body.slug) {
      body.slug = slugify(body.title);
    }
    
    // Check if new slug conflicts with another blog
    if (body.slug && body.slug !== slug) {
      const slugExists = await BlogQueries.findBySlug(body.slug);
      if (slugExists && slugExists.id !== existingBlog.id) {
        return NextResponse.json(
          { error: 'Blog with this slug already exists' },
          { status: 409 }
        );
      }
    }
    
    // Recalculate reading time if content changed
    if (body.content) {
      body.reading_time = calculateReadingTime(body.content);
    }
    
    // Update blog
    const updated = await BlogQueries.update(existingBlog.id, body);
    
    return NextResponse.json({
      success: true,
      message: 'Blog updated successfully',
      data: updated
    });
  });
}

// PATCH /api/blogs/[slug] - Partial update (admin only)
export async function PATCH(request, { params }) {
  return withErrorHandler(async () => {
    // Check authentication and admin role
    const authResult = await withAdmin(request);
    if (authResult) return authResult;
    
    const { slug } = await params;
    const body = await request.json();
    
    // Find existing blog
    const existingBlog = await BlogQueries.findBySlug(slug);
    if (!existingBlog) {
      return NextResponse.json(
        { error: 'Blog not found' },
        { status: 404 }
      );
    }
    
    // Handle specific actions
    if (body.action === 'publish') {
      await BlogQueries.publish(existingBlog.id);
      return NextResponse.json({
        success: true,
        message: 'Blog published successfully'
      });
    }
    
    if (body.action === 'unpublish') {
      await BlogQueries.unpublish(existingBlog.id);
      return NextResponse.json({
        success: true,
        message: 'Blog unpublished successfully'
      });
    }
    
    if (body.action === 'increment-views') {
      await BlogQueries.incrementViews(existingBlog.id);
      return NextResponse.json({
        success: true,
        message: 'Views incremented'
      });
    }
    
    return NextResponse.json(
      { error: 'Invalid action' },
      { status: 400 }
    );
  });
}

// DELETE /api/blogs/[slug] - Delete blog (admin only)
export async function DELETE(request, { params }) {
  return withErrorHandler(async () => {
    // Check authentication and admin role
    const authResult = await withAdmin(request);
    if (authResult) return authResult;
    
    const { slug } = await params;
    
    // Find existing blog
    const existingBlog = await BlogQueries.findBySlug(slug);
    if (!existingBlog) {
      return NextResponse.json(
        { error: 'Blog not found' },
        { status: 404 }
      );
    }
    
    // Delete blog
    await BlogQueries.delete(existingBlog.id);
    
    return NextResponse.json({
      success: true,
      message: 'Blog deleted successfully'
    });
  });
}

// Helper function to calculate reading time
function calculateReadingTime(content) {
  const wordsPerMinute = 200;
  const wordCount = content.trim().split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
}