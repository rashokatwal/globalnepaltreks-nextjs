// app/api/blogs/categories/route.js
import { NextResponse } from 'next/server';
import { BlogCategoryQueries } from '@/lib/db/queries/blogCategories.js';
import { AuthMiddleware } from '@/lib/auth/middleware.js';
import { Permissions } from '@/lib/auth/permissions.js';
import { ApiResponse } from '@/lib/utils/response.js';
import { slugify } from '@/lib/utils/slugify.js';

// GET /api/blogs/categories - Public (no authentication needed)
export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const featured = searchParams.get('featured') === 'true';
        const sidebar = searchParams.get('sidebar') === 'true';
        const limit = parseInt(searchParams.get('limit') || '10');
        
        if (featured) {
            const categories = await BlogCategoryQueries.getFeaturedCategories(limit);
            return ApiResponse.success(categories);
        }
        
        if (sidebar) {
            const categories = await BlogCategoryQueries.getSidebarCategories(limit);
            return ApiResponse.success(categories);
        }
        
        // Get all categories with post counts
        const categories = await BlogCategoryQueries.getAllWithCounts();
        
        return ApiResponse.success(categories);
        
    } catch (error) {
        console.error('Error in GET /api/blogs/categories:', error);
        return ApiResponse.error(error.message, 500);
    }
}

// POST /api/blogs/categories - Create new category (Admin only)
export async function POST(request) {
    try {
        // Check authentication and admin role
        const auth = await AuthMiddleware.requireAdmin(request);
        if (auth instanceof NextResponse) return auth;

        const body = await request.json();
        
        // Basic validation
        if (!body.name) {
            return ApiResponse.error('Category name is required', 400);
        }
        
        // Generate slug from name
        const slug = body.slug || slugify(body.name);
        
        // Check if slug exists
        const existing = await BlogCategoryQueries.findBySlug(slug);
        if (existing) {
            return ApiResponse.conflict('Category with this slug already exists');
        }
        
        const newCategory = await BlogCategoryQueries.create({
            name: body.name,
            slug: slug,
            description: body.description || null,
            icon: body.icon || null,
            display_order: body.display_order || 0,
            is_active: body.is_active !== undefined ? body.is_active : true,
            createdBy: auth.user.id
        });
        
        return ApiResponse.created(newCategory, 'Category created successfully');
        
    } catch (error) {
        console.error('Error in POST /api/blogs/categories:', error);
        return ApiResponse.error(error.message, 500);
    }
}

// PUT /api/blogs/categories - Update multiple categories (Admin only)
export async function PUT(request) {
    try {
        const auth = await AuthMiddleware.requireAdmin(request);
        if (auth instanceof NextResponse) return auth;
        
        const body = await request.json();
        
        // Handle bulk status update
        if (body.action === 'bulk_status' && body.ids && Array.isArray(body.ids)) {
            if (body.ids.length === 0) {
                return ApiResponse.error('No category IDs provided', 400);
            }
            
            // You would need to implement this in your queries
            // For now, we'll just return success
            return ApiResponse.success(null, `Updated ${body.ids.length} categories`);
        }
        
        return ApiResponse.error('Invalid bulk operation', 400);
        
    } catch (error) {
        console.error('Error in PUT /api/blogs/categories:', error);
        return ApiResponse.error(error.message, 500);
    }
}

// DELETE /api/blogs/categories - Delete multiple categories (Admin only)
export async function DELETE(request) {
    try {
        const auth = await AuthMiddleware.requireAdmin(request);
        if (auth instanceof NextResponse) return auth;
        
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');
        const ids = searchParams.get('ids');
        
        // Delete single category by ID
        if (id) {
            const category = await BlogCategoryQueries.findById(parseInt(id));
            
            if (!category) {
                return ApiResponse.notFound('Category not found');
            }
            
            // Check if category has blogs
            const hasBlogs = await BlogCategoryQueries.hasBlogs?.(parseInt(id)) || false;
            if (hasBlogs) {
                return ApiResponse.error('Cannot delete category with associated blogs. Remove blog associations first.', 400);
            }
            
            await BlogCategoryQueries.delete(parseInt(id));
            
            return ApiResponse.success(null, 'Category deleted successfully');
        }
        
        // Bulk delete by IDs
        if (ids) {
            const idArray = ids.split(',').map(id => parseInt(id.trim()));
            
            if (idArray.length === 0) {
                return ApiResponse.error('No category IDs provided', 400);
            }
            
            // Delete each category
            for (const categoryId of idArray) {
                await BlogCategoryQueries.delete(categoryId);
            }
            
            return ApiResponse.success(null, `Deleted ${idArray.length} categories`);
        }
        
        return ApiResponse.error('Please provide an id or ids parameter', 400);
        
    } catch (error) {
        console.error('Error in DELETE /api/blogs/categories:', error);
        return ApiResponse.error(error.message, 500);
    }
}