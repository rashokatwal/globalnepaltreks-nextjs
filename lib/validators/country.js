// src/lib/validators/country.js
export function validateCountry(data, isPartial = false) {
    const errors = [];
    
    if (!isPartial || data.name !== undefined) {
        if (!data.name) errors.push('Name is required');
    }
    
    if (data.slug !== undefined && !/^[a-z0-9-]+$/.test(data.slug)) {
        errors.push('Slug can only contain lowercase letters, numbers, and hyphens');
    }
    
    if (data.meta_title !== undefined && data.meta_title.length > 255) {
        errors.push('Meta title must be less than 255 characters');
    }
    
    if (data.meta_description !== undefined && data.meta_description.length > 500) {
        errors.push('Meta description must be less than 500 characters');
    }
    
    return { isValid: errors.length === 0, errors };
}