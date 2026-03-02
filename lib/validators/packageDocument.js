// src/lib/validators/packageDocument.js
export function validatePackageDocument(data, isPartial = false) {
    const errors = [];
    
    if (!isPartial || data.document_title !== undefined) {
        if (!data.document_title) {
            errors.push('Document title is required');
        } else if (data.document_title.length < 3) {
            errors.push('Document title must be at least 3 characters');
        } else if (data.document_title.length > 255) {
            errors.push('Document title must be less than 255 characters');
        }
    }
    
    if (!isPartial || data.document_url !== undefined) {
        if (!data.document_url) {
            errors.push('Document URL is required');
        } else if (!data.document_url.match(/\.(pdf|doc|docx|xls|xlsx|jpg|jpeg|png)$/i)) {
            errors.push('Document URL must point to a valid document file (PDF, DOC, XLS, or image)');
        }
    }
    
    if (!isPartial || data.document_type !== undefined) {
        if (!data.document_type) {
            errors.push('Document type is required');
        } else if (!['itinerary', 'booking_form', 'info_sheet', 'brochure', 'other'].includes(data.document_type)) {
            errors.push('Document type must be one of: itinerary, booking_form, info_sheet, brochure, other');
        }
    }
    
    if (data.sort_order !== undefined && (isNaN(data.sort_order) || data.sort_order < 0)) {
        errors.push('Sort order must be a positive number');
    }
    
    return { isValid: errors.length === 0, errors };
}

// Validate multiple documents
export function validatePackageDocuments(documents) {
    const errors = [];
    const validDocs = [];
    
    if (!Array.isArray(documents)) {
        errors.push('Documents must be an array');
        return { isValid: false, errors, validDocs: [] };
    }
    
    for (let i = 0; i < documents.length; i++) {
        const doc = documents[i];
        const validation = validatePackageDocument(doc);
        
        if (!validation.isValid) {
            errors.push(`Document at index ${i}: ${validation.errors.join(', ')}`);
        } else {
            validDocs.push(doc);
        }
    }
    
    return {
        isValid: errors.length === 0,
        errors,
        validDocs
    };
}