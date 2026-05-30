// app/api/packages/[slug]/route.js
import { NextResponse } from 'next/server';
import { PackageQueries } from '@/lib/db/queries/packages.js';
import { AuthMiddleware } from '@/lib/auth/middleware.js';
import { Permissions } from '@/lib/auth/permissions.js';
import { ApiResponse } from '@/lib/utils/response.js';
import { validatePackage } from '@/lib/validators/package.js';

// GET /api/packages/[slug] - Public
export async function GET(request, { params }) {
    try {
        const { slug } = await params;
        const { searchParams } = new URL(request.url);
        const includeDetails = searchParams.get('details') === 'true';
        
        let pkg = await PackageQueries.findBySlug(slug);
        
        if (!pkg && !isNaN(parseInt(slug))) {
            pkg = await PackageQueries.findById(parseInt(slug));
        }
        
        if (!pkg) {
            return ApiResponse.notFound('Package not found');
        }
        
        await PackageQueries.incrementViews(pkg.id);
        
        if (includeDetails) {
            const fullDetails = await PackageQueries.getFullDetails(pkg.id);
            return ApiResponse.success(fullDetails);
        }
        
        return ApiResponse.success(pkg);
        
    } catch (error) {
        console.error('Error in GET /api/packages/[slug]:', error);
        return ApiResponse.error(error.message, 500);
    }
}

// PUT /api/packages/[slug] - Update package (Admin only)
export async function PUT(request, { params }) {
    try {
        const auth = await AuthMiddleware.requireAdmin(request);
        if (auth instanceof NextResponse) return auth;
        
        const { slug } = await params;
        const body = await request.json();
        
        let pkg = await PackageQueries.findBySlug(slug);
        
        if (!pkg && !isNaN(parseInt(slug))) {
            pkg = await PackageQueries.findById(parseInt(slug));
        }
        
        if (!pkg) {
            return ApiResponse.notFound('Package not found');
        }
        
        if (!Permissions.canModify(auth.user, pkg)) {
            return ApiResponse.forbidden('You do not have permission to modify this package');
        }
        
        if (body.slug && body.slug !== pkg.slug) {
            const existing = await PackageQueries.findBySlug(body.slug);
            if (existing && existing.id !== pkg.id) {
                return ApiResponse.conflict('Package with this slug already exists');
            }
        }
        
        // Update main package
        if (Object.keys(body).length > 0) {
            await PackageQueries.update(pkg.id, body);
        }
        
        // ✅ Handle gallery images separately using the new updateGallery method
        if (body.gallery_images !== undefined) {
            console.log('Updating gallery images. Count:', body.gallery_images.length);
            await PackageQueries.updateGallery(pkg.id, body.gallery_images);
        }
        
        // Return the updated full package
        const fullDetails = await PackageQueries.getFullDetails(pkg.id);
        
        return ApiResponse.success(fullDetails, 'Package updated successfully');
        
    } catch (error) {
        console.error('Error in PUT /api/packages/[slug]:', error);
        return ApiResponse.error(error.message, 500);
    }
}

// PATCH /api/packages/[slug] - Partial update (Admin only)
export async function PATCH(request, { params }) {
    try {
        const auth = await AuthMiddleware.requireAdmin(request);
        if (auth instanceof NextResponse) return auth;
        
        const { slug } = await params;
        const body = await request.json();
        
        let pkg = await PackageQueries.findBySlug(slug);
        
        if (!pkg && !isNaN(parseInt(slug))) {
            pkg = await PackageQueries.findById(parseInt(slug));
        }
        
        if (!pkg) {
            return ApiResponse.notFound('Package not found');
        }
        
        if (body.action === 'toggle_featured') {
            const updated = await PackageQueries.update(pkg.id, {
                is_featured: !pkg.is_featured
            });
            return ApiResponse.success(updated, `Package ${updated.is_featured ? 'featured' : 'unfeatured'} successfully`);
        }
        
        if (body.action === 'toggle_active') {
            const updated = await PackageQueries.update(pkg.id, {
                is_active: !pkg.is_active
            });
            return ApiResponse.success(updated, `Package ${updated.is_active ? 'activated' : 'deactivated'} successfully`);
        }
        
        return ApiResponse.error('Invalid action', 400);
        
    } catch (error) {
        console.error('Error in PATCH /api/packages/[slug]:', error);
        return ApiResponse.error(error.message, 500);
    }
}

// DELETE /api/packages/[slug] - Delete package (Admin only)
export async function DELETE(request, { params }) {
    try {
        const auth = await AuthMiddleware.requireAdmin(request);
        if (auth instanceof NextResponse) return auth;
        
        const { slug } = await params;
        
        let pkg = await PackageQueries.findBySlug(slug);
        
        if (!pkg && !isNaN(parseInt(slug))) {
            pkg = await PackageQueries.findById(parseInt(slug));
        }
        
        if (!pkg) {
            return ApiResponse.notFound('Package not found');
        }
        
        if (!Permissions.canDelete(auth.user, pkg)) {
            return ApiResponse.forbidden('You do not have permission to delete this package');
        }
        
        await PackageQueries.softDelete(pkg.id);
        
        return ApiResponse.success(null, 'Package archived successfully');
        
    } catch (error) {
        console.error('Error in DELETE /api/packages/[slug]:', error);
        return ApiResponse.error(error.message, 500);
    }
}