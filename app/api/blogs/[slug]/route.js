// app/api/blogs/[slug]/route.js
import { NextResponse } from 'next/server';
import { BlogQueries } from '@/lib/db/queries/blogs.js';
import { AuthMiddleware } from '@/lib/auth/middleware.js';
import { Permissions } from '@/lib/auth/permissions.js';
import { ApiResponse } from '@/lib/utils/response.js';
import { validateBlog } from '@/lib/validators/blog.js';
import { slugify } from '@/lib/utils/slugify.js';

// GET /api/blogs/[slug] - Public
export async function GET(request, { params }) {
    try {
        const { slug } = await params;
        
        const blog = await BlogQueries.findBySlug(slug);
        
        if (!blog) {
            return ApiResponse.notFound('Blog not found');
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
        
        return ApiResponse.success({
            ...blog,
            related: related || [],
            navigation: adjacent
        });
        
    } catch (error) {
        console.error('Error in GET /api/blogs/[slug]:', error);
        return ApiResponse.error(error.message, 500);
    }
}

// PUT /api/blogs/[slug] - Update blog (Author/Editor/Admin)
export async function PUT(request, { params }) {
    try {
        const auth = await AuthMiddleware.requireAuth(request);
        if (auth instanceof NextResponse) return auth;
        
        const { slug } = await params;
        const body = await request.json();
        
        // Find existing blog
        const existingBlog = await BlogQueries.findBySlug(slug);
        
        if (!existingBlog) {
            return ApiResponse.notFound('Blog not found');
        }
        
        // Check permission - author can edit their own, editors and admins can edit any
        if (!Permissions.canModify(auth.user, existingBlog) && !Permissions.canPublish(auth.user)) {
            return ApiResponse.forbidden('You do not have permission to edit this blog');
        }
        
        // Validate (partial update allowed)
        const validation = validateBlog(body, true);
        if (!validation.isValid) {
            return ApiResponse.validationError(validation.errors);
        }
        
        // Check slug uniqueness if changing slug
        if (body.slug && body.slug !== slug) {
            const slugExists = await BlogQueries.findBySlug(body.slug);
            if (slugExists && slugExists.id !== existingBlog.id) {
                return ApiResponse.conflict('Blog with this slug already exists');
            }
        }
        
        // Recalculate reading time if content changed
        if (body.content) {
            body.reading_time = calculateReadingTime(body.content);
        }
        
        // Update blog
        const updated = await BlogQueries.update(existingBlog.id, body);
        
        return ApiResponse.success(updated, 'Blog updated successfully');
        
    } catch (error) {
        console.error('Error in PUT /api/blogs/[slug]:', error);
        return ApiResponse.error(error.message, 500);
    }
}

// PATCH /api/blogs/[slug] - Partial update (publish/unpublish/toggle featured)
export async function PATCH(request, { params }) {
    try {
        const auth = await AuthMiddleware.requireAuth(request);
        if (auth instanceof NextResponse) return auth;
        
        const { slug } = await params;
        const body = await request.json();
        
        // Find existing blog
        const existingBlog = await BlogQueries.findBySlug(slug);
        
        if (!existingBlog) {
            return ApiResponse.notFound('Blog not found');
        }
        
        // Handle publish action (requires editor/admin)
        if (body.action === 'publish') {
            if (!Permissions.canPublish(auth.user)) {
                return ApiResponse.forbidden('You do not have permission to publish blogs');
            }
            await BlogQueries.publish(existingBlog.id);
            return ApiResponse.success(null, 'Blog published successfully');
        }
        
        // Handle unpublish action (requires editor/admin)
        if (body.action === 'unpublish') {
            if (!Permissions.canPublish(auth.user)) {
                return ApiResponse.forbidden('You do not have permission to unpublish blogs');
            }
            await BlogQueries.unpublish(existingBlog.id);
            return ApiResponse.success(null, 'Blog unpublished successfully');
        }
        
        // Handle toggle featured (admin only)
        if (body.action === 'toggle_featured') {
            if (auth.user.role !== 'admin') {
                return ApiResponse.forbidden('Admin access required to feature blogs');
            }
            
            // Update featured status (you'd need to add this to your queries)
            await BlogQueries.update(existingBlog.id, {
                is_featured: body.value !== undefined ? body.value : !existingBlog.is_featured
            });
            
            return ApiResponse.success(null, 'Featured status updated');
        }
        
        return ApiResponse.error('Invalid action', 400);
        
    } catch (error) {
        console.error('Error in PATCH /api/blogs/[slug]:', error);
        return ApiResponse.error(error.message, 500);
    }
}

// DELETE /api/blogs/[slug] - Delete blog (Admin or Author of their own)
export async function DELETE(request, { params }) {
    try {
        const auth = await AuthMiddleware.requireAuth(request);
        if (auth instanceof NextResponse) return auth;
        
        const { slug } = await params;
        
        // Find existing blog
        const existingBlog = await BlogQueries.findBySlug(slug);
        
        if (!existingBlog) {
            return ApiResponse.notFound('Blog not found');
        }
        
        // Check permission
        if (!Permissions.canDelete(auth.user, existingBlog)) {
            return ApiResponse.forbidden('You do not have permission to delete this blog');
        }
        
        // Soft delete (archive)
        await BlogQueries.softDelete(existingBlog.id);
        
        return ApiResponse.success(null, 'Blog archived successfully');
        
    } catch (error) {
        console.error('Error in DELETE /api/blogs/[slug]:', error);
        return ApiResponse.error(error.message, 500);
    }
}

// Helper function to calculate reading time
function calculateReadingTime(content) {
    const wordsPerMinute = 200;
    const wordCount = content.trim().split(/\s+/).length;
    return Math.ceil(wordCount / wordsPerMinute);
}