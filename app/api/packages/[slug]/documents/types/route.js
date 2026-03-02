// app/api/packages/[slug]/documents/types/route.js
import { NextResponse } from 'next/server';
import { PackageQueries } from '@/lib/db/queries/packages.js';
import { PackageDocumentQueries } from '@/lib/db/queries/packageDocuments.js';
import { ApiResponse } from '@/lib/utils/response.js';

// GET /api/packages/[slug]/documents/types - Public
export async function GET(request, { params }) {
    try {
        const { slug } = await params;
        
        const pkg = await PackageQueries.findBySlug(slug);
        if (!pkg) {
            return ApiResponse.notFound('Package not found');
        }
        
        const summary = await PackageDocumentQueries.getTypesSummary(pkg.id);
        
        return ApiResponse.success(summary);
        
    } catch (error) {
        console.error('Error in GET /api/packages/[slug]/documents/types:', error);
        return ApiResponse.error(error.message, 500);
    }
}