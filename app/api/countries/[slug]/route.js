// app/api/countries/[slug]/route.js
import { NextResponse } from 'next/server';
import { CountryQueries } from '@/lib/db/queries/countries.js';
import { CountryActivityQueries } from '@/lib/db/queries/countryActivities.js';
import { AuthMiddleware } from '@/lib/auth/middleware.js';
import { Permissions } from '@/lib/auth/permissions.js';
import { ApiResponse } from '@/lib/utils/response.js';
import { validateCountry } from '@/lib/validators/country.js';

// GET /api/countries/[slug] - Public
export async function GET(request, { params }) {
    try {
        const { slug } = await params;
        const { searchParams } = new URL(request.url);
        const includeDetails = searchParams.get('details') === 'true';
        
        // Try to find by slug first
        let country = await CountryQueries.findBySlug(slug);
        
        // If not found by slug, try by ID
        if (!country && !isNaN(parseInt(slug))) {
            country = await CountryQueries.findById(parseInt(slug));
        }
        
        if (!country) {
            return ApiResponse.notFound('Country not found');
        }
        
        // If details requested, get full details
        if (includeDetails) {
            // Get packages for this country with activity information
            const packagesSql = `
                SELECT p.id, p.title, p.slug, p.duration_days, p.price, p.difficulty,
                       p.featured_image, p.short_description, p.is_featured,
                       p.activity_id, a.name as activity_name, a.slug as activity_slug
                FROM packages p
                LEFT JOIN activities a ON p.activity_id = a.id
                WHERE p.country_id = ? AND p.is_active = 1
                ORDER BY p.is_featured DESC, p.created_at DESC
            `;
            
            // Get blogs for this country
            const blogsSql = `
                SELECT id, title, slug, excerpt, featured_image,
                       author, reading_time, published_at
                FROM blogs
                WHERE country_id = ? AND is_published = 1
                ORDER BY published_at DESC
                LIMIT 4
            `;
            
            const { query } = await import('@/lib/db/index.js');
            const [packages, blogs] = await Promise.all([
                query(packagesSql, [country.id]),
                query(blogsSql, [country.id])
            ]);
            
            // Get activities with package counts
            const activities = await CountryActivityQueries.getActivitiesByCountry(country.id);
            
            // Add package counts to activities
            const activitiesWithCounts = activities.map(activity => {
                const packageCount = packages.filter(p => p.activity_id === activity.id).length;
                return {
                    ...activity,
                    package_count: packageCount
                };
            });
            
            return ApiResponse.success({
                ...country,
                activities: activitiesWithCounts || [],
                packages: packages || [],
                blogs: blogs || []
            });
        }
        
        // Default: return country with basic activities only
        const activities = await CountryActivityQueries.getActivitiesByCountry(country.id);
        
        return ApiResponse.success({
            ...country,
            activities: activities || []
        });
        
    } catch (error) {
        console.error('Error in GET /api/countries/[slug]:', error);
        return ApiResponse.error(error.message, 500);
    }
}

// PUT /api/countries/[slug] - Update country (Admin only)
export async function PUT(request, { params }) {
    try {
        const auth = await AuthMiddleware.requireAdmin(request);
        if (auth instanceof NextResponse) return auth;
        
        const { slug } = await params;
        const body = await request.json();
        
        // Find the country
        let country = await CountryQueries.findBySlug(slug);
        
        if (!country && !isNaN(parseInt(slug))) {
            country = await CountryQueries.findById(parseInt(slug));
        }
        
        if (!country) {
            return ApiResponse.notFound('Country not found');
        }
        
        // Check permission
        if (!Permissions.canModify(auth.user, country)) {
            return ApiResponse.forbidden('You do not have permission to modify this country');
        }
        
        // Validate
        const validation = validateCountry(body, true);
        if (!validation.isValid) {
            return ApiResponse.validationError(validation.errors);
        }
        
        // Check slug uniqueness if changing slug
        if (body.slug && body.slug !== country.slug) {
            const existing = await CountryQueries.findBySlug(body.slug);
            if (existing && existing.id !== country.id) {
                return ApiResponse.conflict('Country with this slug already exists');
            }
        }
        
        // Update country
        const updatedCountry = await CountryQueries.update(country.id, body);
        
        // Update activity associations if provided
        if (body.activity_ids && Array.isArray(body.activity_ids)) {
            // This would need proper sync logic
            // For now, just log or implement later
        }
        
        return ApiResponse.success(updatedCountry, 'Country updated successfully');
        
    } catch (error) {
        console.error('Error in PUT /api/countries/[slug]:', error);
        return ApiResponse.error(error.message, 500);
    }
}

// PATCH /api/countries/[slug] - Partial update (Admin only)
export async function PATCH(request, { params }) {
    try {
        const auth = await AuthMiddleware.requireAdmin(request);
        if (auth instanceof NextResponse) return auth;
        
        const { slug } = await params;
        const body = await request.json();
        
        // Find the country
        let country = await CountryQueries.findBySlug(slug);
        
        if (!country && !isNaN(parseInt(slug))) {
            country = await CountryQueries.findById(parseInt(slug));
        }
        
        if (!country) {
            return ApiResponse.notFound('Country not found');
        }
        
        // Handle toggle active status
        if (body.action === 'toggle_active') {
            const updated = await CountryQueries.update(country.id, {
                is_active: !country.is_active
            });
            
            return ApiResponse.success(updated, `Country ${updated.is_active ? 'activated' : 'deactivated'} successfully`);
        }
        
        return ApiResponse.error('Invalid action', 400);
        
    } catch (error) {
        console.error('Error in PATCH /api/countries/[slug]:', error);
        return ApiResponse.error(error.message, 500);
    }
}

// DELETE /api/countries/[slug] - Delete country (Admin only)
export async function DELETE(request, { params }) {
    try {
        const auth = await AuthMiddleware.requireAdmin(request);
        if (auth instanceof NextResponse) return auth;
        
        const { slug } = await params;
        
        // Find the country
        let country = await CountryQueries.findBySlug(slug);
        
        if (!country && !isNaN(parseInt(slug))) {
            country = await CountryQueries.findById(parseInt(slug));
        }
        
        if (!country) {
            return ApiResponse.notFound('Country not found');
        }
        
        // Check permission
        if (!Permissions.canDelete(auth.user, country)) {
            return ApiResponse.forbidden('You do not have permission to delete this country');
        }
        
        // Soft delete (archive)
        await CountryQueries.softDelete(country.id);
        
        return ApiResponse.success(null, 'Country archived successfully');
        
    } catch (error) {
        console.error('Error in DELETE /api/countries/[slug]:', error);
        return ApiResponse.error(error.message, 500);
    }
}