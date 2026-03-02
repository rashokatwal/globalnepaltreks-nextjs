// app/api/packages/[slug]/documents/route.js
import { NextResponse } from 'next/server';
import { PackageQueries } from '@/lib/db/queries/packages.js';
import { PackageDocumentQueries } from '@/lib/db/queries/packageDocuments.js';
import { AuthMiddleware } from '@/lib/auth/middleware.js';
import { ApiResponse } from '@/lib/utils/response.js';
import { validatePackageDocument, validatePackageDocuments } from '@/lib/validators/packageDocument.js';

// GET /api/packages/[slug]/documents - Public
export async function GET(request, { params }) {
    try {
        const { slug } = await params;
        
        // Find package by slug
        const pkg = await PackageQueries.findBySlug(slug);
        if (!pkg) {
            return ApiResponse.notFound('Package not found');
        }
        
        const documents = await PackageDocumentQueries.getByPackageId(pkg.id);
        
        return ApiResponse.success(documents);
        
    } catch (error) {
        console.error('Error in GET /api/packages/[slug]/documents:', error);
        return ApiResponse.error(error.message, 500);
    }
}

// POST /api/packages/[slug]/documents - Add document (Admin only)
export async function POST(request, { params }) {
    try {
        // Check authentication and admin role
        const auth = await AuthMiddleware.requireAdmin(request);
        if (auth instanceof NextResponse) return auth;
        
        const { slug } = await params;
        const body = await request.json();
        
        // Find package
        const pkg = await PackageQueries.findBySlug(slug);
        if (!pkg) {
            return ApiResponse.notFound('Package not found');
        }
        
        // Handle bulk add
        if (Array.isArray(body)) {
            const validation = validatePackageDocuments(body);
            if (!validation.isValid) {
                return ApiResponse.validationError(validation.errors);
            }
            
            const documents = await PackageDocumentQueries.bulkAdd(pkg.id, validation.validDocs);
            
            return ApiResponse.created(documents, `${documents.length} documents added successfully`);
        }
        
        // Single document
        const validation = validatePackageDocument(body);
        if (!validation.isValid) {
            return ApiResponse.validationError(validation.errors);
        }
        
        // Check if document with same title exists
        const exists = await PackageDocumentQueries.exists(pkg.id, body.document_title);
        if (exists) {
            return ApiResponse.conflict('Document with this title already exists for this package');
        }
        
        const newDocument = await PackageDocumentQueries.add(pkg.id, body);
        
        return ApiResponse.created(newDocument, 'Document added successfully');
        
    } catch (error) {
        console.error('Error in POST /api/packages/[slug]/documents:', error);
        return ApiResponse.error(error.message, 500);
    }
}

// PUT /api/packages/[slug]/documents - Reorder documents (Admin only)
export async function PUT(request, { params }) {
    try {
        const auth = await AuthMiddleware.requireAdmin(request);
        if (auth instanceof NextResponse) return auth;
        
        const { slug } = await params;
        const body = await request.json();
        
        const pkg = await PackageQueries.findBySlug(slug);
        if (!pkg) {
            return ApiResponse.notFound('Package not found');
        }
        
        // Handle reorder
        if (body.action === 'reorder' && body.document_ids && Array.isArray(body.document_ids)) {
            const result = await PackageDocumentQueries.reorder(pkg.id, body.document_ids);
            return ApiResponse.success(result, 'Documents reordered successfully');
        }
        
        return ApiResponse.error('Invalid action', 400);
        
    } catch (error) {
        console.error('Error in PUT /api/packages/[slug]/documents:', error);
        return ApiResponse.error(error.message, 500);
    }
}

// DELETE /api/packages/[slug]/documents - Delete multiple documents (Admin only)
export async function DELETE(request, { params }) {
    try {
        const auth = await AuthMiddleware.requireAdmin(request);
        if (auth instanceof NextResponse) return auth;
        
        const { slug } = await params;
        const { searchParams } = new URL(request.url);
        const ids = searchParams.get('ids');
        
        const pkg = await PackageQueries.findBySlug(slug);
        if (!pkg) {
            return ApiResponse.notFound('Package not found');
        }
        
        if (!ids) {
            return ApiResponse.error('Please provide document ids parameter', 400);
        }
        
        const idArray = ids.split(',').map(id => parseInt(id.trim()));
        
        if (idArray.length === 0) {
            return ApiResponse.error('No document IDs provided', 400);
        }
        
        // Delete each document
        for (const docId of idArray) {
            await PackageDocumentQueries.delete(docId);
        }
        
        return ApiResponse.success(null, `Deleted ${idArray.length} documents`);
        
    } catch (error) {
        console.error('Error in DELETE /api/packages/[slug]/documents:', error);
        return ApiResponse.error(error.message, 500);
    }
}