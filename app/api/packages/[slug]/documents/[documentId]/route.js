// app/api/packages/[slug]/documents/[documentId]/route.js
import { NextResponse } from 'next/server';
import { PackageQueries } from '@/lib/db/queries/packages.js';
import { PackageDocumentQueries } from '@/lib/db/queries/packageDocuments.js';
import { AuthMiddleware } from '@/lib/auth/middleware.js';
import { ApiResponse } from '@/lib/utils/response.js';
import { validatePackageDocument } from '@/lib/validators/packageDocument.js';

// GET /api/packages/[slug]/documents/[documentId] - Public
export async function GET(request, { params }) {
    try {
        const { slug, documentId } = await params;
        
        // Verify package exists
        const pkg = await PackageQueries.findBySlug(slug);
        if (!pkg) {
            return ApiResponse.notFound('Package not found');
        }
        
        const document = await PackageDocumentQueries.findById(parseInt(documentId));
        
        if (!document) {
            return ApiResponse.notFound('Document not found');
        }
        
        // Verify document belongs to this package
        if (document.package_id !== pkg.id) {
            return ApiResponse.forbidden('Document does not belong to this package');
        }
        
        return ApiResponse.success(document);
        
    } catch (error) {
        console.error('Error in GET /api/packages/[slug]/documents/[documentId]:', error);
        return ApiResponse.error(error.message, 500);
    }
}

// PUT /api/packages/[slug]/documents/[documentId] - Update document (Admin only)
export async function PUT(request, { params }) {
    try {
        const auth = await AuthMiddleware.requireAdmin(request);
        if (auth instanceof NextResponse) return auth;
        
        const { slug, documentId } = await params;
        const body = await request.json();
        
        // Verify package exists
        const pkg = await PackageQueries.findBySlug(slug);
        if (!pkg) {
            return ApiResponse.notFound('Package not found');
        }
        
        const document = await PackageDocumentQueries.findById(parseInt(documentId));
        
        if (!document) {
            return ApiResponse.notFound('Document not found');
        }
        
        // Verify document belongs to this package
        if (document.package_id !== pkg.id) {
            return ApiResponse.forbidden('Document does not belong to this package');
        }
        
        // Validate (partial update allowed)
        const validation = validatePackageDocument(body, true);
        if (!validation.isValid) {
            return ApiResponse.validationError(validation.errors);
        }
        
        // Check title uniqueness if changing
        if (body.document_title && body.document_title !== document.document_title) {
            const exists = await PackageDocumentQueries.exists(pkg.id, body.document_title);
            if (exists) {
                return ApiResponse.conflict('Document with this title already exists for this package');
            }
        }
        
        const updated = await PackageDocumentQueries.update(parseInt(documentId), body);
        
        return ApiResponse.success(updated, 'Document updated successfully');
        
    } catch (error) {
        console.error('Error in PUT /api/packages/[slug]/documents/[documentId]:', error);
        return ApiResponse.error(error.message, 500);
    }
}

// PATCH /api/packages/[slug]/documents/[documentId] - Partial update (Admin only)
export async function PATCH(request, { params }) {
    try {
        const auth = await AuthMiddleware.requireAdmin(request);
        if (auth instanceof NextResponse) return auth;
        
        const { slug, documentId } = await params;
        const body = await request.json();
        
        // Verify package exists
        const pkg = await PackageQueries.findBySlug(slug);
        if (!pkg) {
            return ApiResponse.notFound('Package not found');
        }
        
        const document = await PackageDocumentQueries.findById(parseInt(documentId));
        
        if (!document) {
            return ApiResponse.notFound('Document not found');
        }
        
        // Verify document belongs to this package
        if (document.package_id !== pkg.id) {
            return ApiResponse.forbidden('Document does not belong to this package');
        }
        
        // Handle specific actions
        if (body.action === 'change_type' && body.document_type) {
            const updated = await PackageDocumentQueries.update(parseInt(documentId), {
                document_type: body.document_type
            });
            return ApiResponse.success(updated, 'Document type updated successfully');
        }
        
        return ApiResponse.error('Invalid action', 400);
        
    } catch (error) {
        console.error('Error in PATCH /api/packages/[slug]/documents/[documentId]:', error);
        return ApiResponse.error(error.message, 500);
    }
}

// DELETE /api/packages/[slug]/documents/[documentId] - Delete document (Admin only)
export async function DELETE(request, { params }) {
    try {
        const auth = await AuthMiddleware.requireAdmin(request);
        if (auth instanceof NextResponse) return auth;
        
        const { slug, documentId } = await params;
        
        // Verify package exists
        const pkg = await PackageQueries.findBySlug(slug);
        if (!pkg) {
            return ApiResponse.notFound('Package not found');
        }
        
        const document = await PackageDocumentQueries.findById(parseInt(documentId));
        
        if (!document) {
            return ApiResponse.notFound('Document not found');
        }
        
        // Verify document belongs to this package
        if (document.package_id !== pkg.id) {
            return ApiResponse.forbidden('Document does not belong to this package');
        }
        
        await PackageDocumentQueries.delete(parseInt(documentId));
        
        return ApiResponse.success(null, 'Document deleted successfully');
        
    } catch (error) {
        console.error('Error in DELETE /api/packages/[slug]/documents/[documentId]:', error);
        return ApiResponse.error(error.message, 500);
    }
}