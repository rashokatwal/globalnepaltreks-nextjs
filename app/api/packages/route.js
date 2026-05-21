// app/api/packages/route.js
import { NextResponse } from 'next/server';
import { PackageQueries } from '@/lib/db/queries/packages.js';
import { AuthMiddleware } from '@/lib/auth/middleware.js';
import { Permissions } from '@/lib/auth/permissions.js';
import { ApiResponse } from '@/lib/utils/response.js';
import { validatePackage } from '@/lib/validators/package.js';
import { slugify } from '@/lib/utils/slugify.js';

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');
        const countryId = searchParams.get('country_id') || searchParams.get('countryId');
        const activityId = searchParams.get('activity_id') || searchParams.get('activityId');
        const difficulty = searchParams.get('difficulty');
        const featured = searchParams.get('featured') === 'true';
        const bestSelling = searchParams.get('best_selling') === 'true';
        const luxury = searchParams.get('luxury') === 'true';
        const adventure = searchParams.get('adventure') === 'true';
        const search = searchParams.get('search');
        const minPrice = searchParams.get('min_price') || searchParams.get('minPrice');
        const maxPrice = searchParams.get('max_price') || searchParams.get('maxPrice');
        const maxDuration = searchParams.get('max_duration') || searchParams.get('duration');
        const sort = searchParams.get('sort') || 'featured';

        if (featured) return ApiResponse.success(await PackageQueries.getFeatured(limit));
        if (bestSelling) return ApiResponse.success(await PackageQueries.getBestSelling(limit));
        if (luxury) return ApiResponse.success(await PackageQueries.getLuxury(limit));
        if (adventure) return ApiResponse.success(await PackageQueries.getAdventure(limit));

        const result = await PackageQueries.findAll({
            page,
            limit,
            countryId: countryId ? parseInt(countryId) : null,
            activityId: activityId ? parseInt(activityId) : null,
            difficulty,
            search,
            minPrice: minPrice ? parseFloat(minPrice) : null,
            maxPrice: maxPrice ? parseFloat(maxPrice) : null,
            maxDuration: maxDuration ? parseInt(maxDuration) : null,
            sort
        });

        return ApiResponse.success({
            packages: result.packages || [],
            pagination: result.pagination || { page, limit, total: 0, totalPages: 0 }
        });

    } catch (error) {
        console.error('Error in GET /api/packages:', error);
        return ApiResponse.error(error.message, 500);
    }
}

export async function POST(request) {
    try {
        const auth = await AuthMiddleware.requireAdmin(request);
        if (auth instanceof NextResponse) return auth;

        const body = await request.json();

        const validation = validatePackage(body);
        if (!validation.isValid) return ApiResponse.validationError(validation.errors);

        const slug = body.slug || slugify(body.title);
        const existing = await PackageQueries.findBySlug(slug);
        if (existing) return ApiResponse.conflict('Package with this slug already exists');

        // ✅ Parse all types correctly before passing to DB
        const packageData = {
            country_id: parseInt(body.country_id),
            activity_id: parseInt(body.activity_id),
            title: body.title,
            slug,
            short_description: body.short_description || null,
            duration_days: parseInt(body.duration_days),
            price: parseFloat(body.price),
            difficulty: body.difficulty || 'moderate',
            max_altitude: body.max_altitude ? parseInt(body.max_altitude) : null,
            group_size_min: parseInt(body.group_size_min) || 1,
            group_size_max: body.group_size_max ? parseInt(body.group_size_max) : null,
            best_season: body.best_season || null,
            overview: body.overview || null,
            highlights: body.highlights || null,
            featured_image: body.featured_image || null,
            gallery: body.gallery || null,
            map_image: body.map_image || null,
            meta_title: body.meta_title || body.title,
            meta_description: body.meta_description || body.short_description || `Book ${body.title} with expert guides.`,
            keywords: body.keywords || null,
            is_featured: body.is_featured ? 1 : 0,
            is_active: body.is_active !== undefined ? (body.is_active ? 1 : 0) : 1,
            is_best_selling: body.is_best_selling ? 1 : 0,
            is_luxury: body.is_luxury ? 1 : 0,
            is_adventure: body.is_adventure ? 1 : 0,
            // Related tables — passed through to create()
            itinerary: body.itinerary || [],
            features: body.features || [],
            faqs: body.faqs || [],
            gallery_images: body.gallery_images || [],
            documents: body.documents || [],
            // ✅ Correct structure for package_dates table
            available_dates: (body.available_dates || []).map(d => ({
                start_date: d.start_date,
                end_date: d.end_date,
                available_slots: parseInt(d.available_slots) || 0,
                total_slots: parseInt(d.total_slots) || 0,
                price_multiplier: d.price_multiplier ? parseFloat(d.price_multiplier) : 1.00,
                is_guaranteed: d.is_guaranteed ? 1 : 0,
                status: d.status || 'available'
            })),
            // ✅ Correct structure for package_essential_info table
            essential_info: body.essential_info || null,
        };

        const newPackage = await PackageQueries.create(packageData);
        return ApiResponse.created(newPackage, 'Package created successfully');

    } catch (error) {
        console.error('Error in POST /api/packages:', error);
        return ApiResponse.error(error.message, 500);
    }
}

export async function PUT(request) {
    try {
        const auth = await AuthMiddleware.requireAdmin(request);
        if (auth instanceof NextResponse) return auth;

        const body = await request.json();

        if (body.action === 'bulk_status' && Array.isArray(body.ids)) {
            if (!body.ids.length) return ApiResponse.error('No package IDs provided', 400);
            const result = await PackageQueries.bulkUpdateStatus(body.ids, body.is_active);
            return ApiResponse.success(result, `Updated ${body.ids.length} packages`);
        }

        return ApiResponse.error('Invalid bulk operation', 400);

    } catch (error) {
        console.error('Error in PUT /api/packages:', error);
        return ApiResponse.error(error.message, 500);
    }
}

export async function DELETE(request) {
    try {
        const auth = await AuthMiddleware.requireAdmin(request);
        if (auth instanceof NextResponse) return auth;

        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');
        const ids = searchParams.get('ids');

        if (id) {
            const pkg = await PackageQueries.findById(parseInt(id));
            if (!pkg) return ApiResponse.notFound('Package not found');
            if (!Permissions.canDelete(auth.user, pkg)) return ApiResponse.forbidden('You do not have permission to delete this package');
            await PackageQueries.softDelete(parseInt(id));
            return ApiResponse.success(null, 'Package archived successfully');
        }

        if (ids) {
            if (auth.user.role !== 'admin') return ApiResponse.forbidden('Admin access required for bulk delete');
            const idArray = ids.split(',').map(id => parseInt(id.trim()));
            if (!idArray.length) return ApiResponse.error('No package IDs provided', 400);
            await PackageQueries.bulkUpdateStatus(idArray, false);
            return ApiResponse.success(null, `Archived ${idArray.length} packages`);
        }

        return ApiResponse.error('Please provide an id or ids parameter', 400);

    } catch (error) {
        console.error('Error in DELETE /api/packages:', error);
        return ApiResponse.error(error.message, 500);
    }
}