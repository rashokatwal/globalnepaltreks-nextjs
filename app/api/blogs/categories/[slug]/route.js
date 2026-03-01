// app/api/blogs/categories/[slug]/route.js
import { NextResponse } from 'next/server';
import { BlogCategoryQueries } from '@/lib/db/queries/blogCategories.js';
import { AuthMiddleware } from '@/lib/auth/middleware.js';
import { Permissions } from '@/lib/auth/permissions.js';
import { ApiResponse } from '@/lib/utils/response.js';
import { slugify } from '@/lib/utils/slugify.js';

// GET /api/blogs/categories/[slug] - Public
export async function GET(request, { params }) {
    try {
        const { slug } = await params;
        
        const category = await BlogCategoryQueries.findBySlug(slug);
        
        if (!category) {
            return ApiResponse.notFound('Category not found');
        }
        
        return ApiResponse.success(category);
        
    } catch (error) {
        console.error('Error in GET /api/blogs/categories/[slug]:', error);
        return ApiResponse.error(error.message, 500);
    }
}

// PUT /api/blogs/categories/[slug] - Update category (Admin only)
export async function PUT(request, { params }) {
    try {
        const auth = await AuthMiddleware.requireAdmin(request);
        if (auth instanceof NextResponse) return auth;
        
        const { slug } = await params;
        const body = await request.json();
        
        const category = await BlogCategoryQueries.findBySlug(slug);
        
        if (!category) {
            return ApiResponse.notFound('Category not found');
        }
        
        // Validate
        if (body.name === '') {
            return ApiResponse.error('Category name cannot be empty', 400);
        }
        
        // Check slug uniqueness if changing
        if (body.slug && body.slug !== slug) {
            const existing = await BlogCategoryQueries.findBySlug(body.slug);
            if (existing && existing.id !== category.id) {
                return ApiResponse.conflict('Category with this slug already exists');
            }
        }
        
        const updated = await BlogCategoryQueries.update(category.id, body);
        
        return ApiResponse.success(updated, 'Category updated successfully');
        
    } catch (error) {
        console.error('Error in PUT /api/blogs/categories/[slug]:', error);
        return ApiResponse.error(error.message, 500);
    }
}

// PATCH /api/blogs/categories/[slug] - Partial update (Admin only)
export async function PATCH(request, { params }) {
    try {
        const auth = await AuthMiddleware.requireAdmin(request);
        if (auth instanceof NextResponse) return auth;
        
        const { slug } = await params;
        const body = await request.json();
        
        const category = await BlogCategoryQueries.findBySlug(slug);
        
        if (!category) {
            return ApiResponse.notFound('Category not found');
        }
        
        // Handle toggle active status
        if (body.action === 'toggle_active') {
            const updated = await BlogCategoryQueries.update(category.id, {
                is_active: !category.is_active
            });
            
            return ApiResponse.success(updated, `Category ${updated.is_active ? 'activated' : 'deactivated'} successfully`);
        }
        
        // Handle reorder
        if (body.action === 'reorder' && body.display_order !== undefined) {
            const updated = await BlogCategoryQueries.update(category.id, {
                display_order: body.display_order
            });
            
            return ApiResponse.success(updated, 'Category order updated');
        }
        
        return ApiResponse.error('Invalid action', 400);
        
    } catch (error) {
        console.error('Error in PATCH /api/blogs/categories/[slug]:', error);
        return ApiResponse.error(error.message, 500);
    }
}

// DELETE /api/blogs/categories/[slug] - Delete category (Admin only)
export async function DELETE(request, { params }) {
    try {
        const auth = await AuthMiddleware.requireAdmin(request);
        if (auth instanceof NextResponse) return auth;
        
        const { slug } = await params;
        
        const category = await BlogCategoryQueries.findBySlug(slug);
        
        if (!category) {
            return ApiResponse.notFound('Category not found');
        }
        
        // Check if category has blogs
        const hasBlogs = await BlogCategoryQueries.hasBlogs?.(category.id) || false;
        if (hasBlogs) {
            return ApiResponse.error('Cannot delete category with associated blogs. Remove blog associations first.', 400);
        }
        
        await BlogCategoryQueries.delete(category.id);
        
        return ApiResponse.success(null, 'Category deleted successfully');
        
    } catch (error) {
        console.error('Error in DELETE /api/blogs/categories/[slug]:', error);
        return ApiResponse.error(error.message, 500);
    }
}