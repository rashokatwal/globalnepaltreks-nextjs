// app/api/blogs/route.js
import { NextResponse } from 'next/server';
import { BlogQueries } from '@/lib/db/queries/blogs.js';
import { AuthMiddleware } from '@/lib/auth/middleware.js';
import { Permissions } from '@/lib/auth/permissions.js';
import { ApiResponse } from '@/lib/utils/response.js';
import { validateBlog } from '@/lib/validators/blog.js';
import { slugify } from '@/lib/utils/slugify.js';

// GET /api/blogs - Public (no authentication needed)
export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        
        // Pagination
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');
        
        // Filters
        const country = searchParams.get('country');
        const activity = searchParams.get('activity');
        const author = searchParams.get('author');
        const search = searchParams.get('search');
        const featured = searchParams.get('featured') === 'true';
        const popular = searchParams.get('popular') === 'true';
        const latest = searchParams.get('latest') === 'true';
        
        // Handle special queries
        if (featured) {
            const blogs = await BlogQueries.getFeatured(limit);
            return ApiResponse.success(blogs);
        }
        
        if (popular) {
            const blogs = await BlogQueries.getPopular(limit);
            return ApiResponse.success(blogs);
        }
        
        if (latest) {
            const blogs = await BlogQueries.getLatest(limit);
            return ApiResponse.success(blogs);
        }
        
        if (country) {
            const result = await BlogQueries.findByCountry(parseInt(country), { page, limit });
            return ApiResponse.success({
                data: result.blogs,
                pagination: result.pagination
            });
        }
        
        if (activity) {
            const result = await BlogQueries.findByActivity(parseInt(activity), { page, limit });
            return ApiResponse.success({
                data: result.blogs,
                pagination: result.pagination
            });
        }
        
        if (author) {
            const result = await BlogQueries.findByAuthor(author, { page, limit });
            return ApiResponse.success({
                data: result.blogs,
                pagination: result.pagination
            });
        }
        
        if (search) {
            const result = await BlogQueries.search(search, { page, limit });
            return ApiResponse.success({
                data: result.blogs,
                pagination: result.pagination,
                searchTerm: result.searchTerm
            });
        }
        
        // Default: get all blogs with pagination
        const result = await BlogQueries.findAll({ 
            page, 
            limit,
            countryId: country ? parseInt(country) : null,
            activityId: activity ? parseInt(activity) : null,
            search 
        });
        
        const response = ApiResponse.success({
            data: result.blogs,
            pagination: result.pagination
        });
        
        // Cache for 1 hour
        response.headers.set('Cache-Control', 's-maxage=3600, stale-while-revalidate=7200');
        
        return response;
        
    } catch (error) {
        console.error('Error in GET /api/blogs:', error);
        return ApiResponse.error(error.message, 500);
    }
}

// POST /api/blogs - Create new blog (Admin/Editor only)
export async function POST(request) {
    try {
        // Check authentication - require auth but not necessarily admin
        const auth = await AuthMiddleware.requireAuth(request);
        if (auth instanceof NextResponse) return auth;

        // Check if user has permission to create blogs
        if (!Permissions.canPublish(auth.user) && auth.user.role !== 'author') {
            return ApiResponse.forbidden('You do not have permission to create blogs');
        }

        const body = await request.json();
        
        // Validate input
        const validation = validateBlog(body);
        if (!validation.isValid) {
            return ApiResponse.validationError(validation.errors);
        }
        
        // Generate slug from title if not provided
        const slug = body.slug || slugify(body.title);
        
        // Check if slug already exists
        const existing = await BlogQueries.findBySlug(slug);
        if (existing) {
            return ApiResponse.conflict('Blog with this slug already exists');
        }
        
        // Calculate reading time if not provided
        const readingTime = body.reading_time || calculateReadingTime(body.content);
        
        // Create blog
        const newBlog = await BlogQueries.create({
            country_id: body.country_id || null,
            activity_id: body.activity_id || null,
            title: body.title,
            slug: slug,
            excerpt: body.excerpt || null,
            content: body.content,
            featured_image: body.featured_image || null,
            author: auth.user.name, // Use authenticated user's name
            reading_time: readingTime,
            meta_title: body.meta_title || body.title,
            meta_description: body.meta_description || body.excerpt || `Read about ${body.title}`,
            is_published: body.is_published ? 1 : 0,
            published_at: body.is_published ? new Date() : null,
            createdBy: auth.user.id
        });
        
        return ApiResponse.created(newBlog, 'Blog created successfully');
        
    } catch (error) {
        console.error('Error in POST /api/blogs:', error);
        return ApiResponse.error(error.message, 500);
    }
}

// PUT /api/blogs - Update multiple blogs (Admin only)
export async function PUT(request) {
    try {
        // Check authentication and admin role
        const auth = await AuthMiddleware.requireAdmin(request);
        if (auth instanceof NextResponse) return auth;
        
        const body = await request.json();
        
        // Handle bulk status update
        if (body.action === 'bulk_status' && body.ids && Array.isArray(body.ids)) {
            if (body.ids.length === 0) {
                return ApiResponse.error('No blog IDs provided', 400);
            }
            
            const result = await BlogQueries.bulkUpdateStatus(body.ids, body.is_published);
            
            return ApiResponse.success(result, `Updated ${body.ids.length} blogs`);
        }
        
        return ApiResponse.error('Invalid bulk operation', 400);
        
    } catch (error) {
        console.error('Error in PUT /api/blogs:', error);
        return ApiResponse.error(error.message, 500);
    }
}

// DELETE /api/blogs - Delete multiple blogs (Admin only)
export async function DELETE(request) {
    try {
        // Check authentication and admin role
        const auth = await AuthMiddleware.requireAdmin(request);
        if (auth instanceof NextResponse) return auth;
        
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');
        const ids = searchParams.get('ids');
        
        // Delete single blog by ID
        if (id) {
            const blog = await BlogQueries.findById(parseInt(id));
            
            if (!blog) {
                return ApiResponse.notFound('Blog not found');
            }
            
            // Check permission
            if (!Permissions.canDelete(auth.user, blog)) {
                return ApiResponse.forbidden('You do not have permission to delete this blog');
            }
            
            // Soft delete (archive)
            await BlogQueries.softDelete(parseInt(id));
            
            return ApiResponse.success(null, 'Blog archived successfully');
        }
        
        // Bulk delete by IDs
        if (ids) {
            // Only admin can bulk delete
            if (auth.user.role !== 'admin') {
                return ApiResponse.forbidden('Admin access required for bulk delete');
            }
            
            const idArray = ids.split(',').map(id => parseInt(id.trim()));
            
            if (idArray.length === 0) {
                return ApiResponse.error('No blog IDs provided', 400);
            }
            
            await BlogQueries.bulkUpdateStatus(idArray, false);
            
            return ApiResponse.success(null, `Archived ${idArray.length} blogs`);
        }
        
        return ApiResponse.error('Please provide an id or ids parameter', 400);
        
    } catch (error) {
        console.error('Error in DELETE /api/blogs:', error);
        return ApiResponse.error(error.message, 500);
    }
}

// Helper function to calculate reading time
function calculateReadingTime(content) {
    const wordsPerMinute = 200;
    const wordCount = content.trim().split(/\s+/).length;
    return Math.ceil(wordCount / wordsPerMinute);
}