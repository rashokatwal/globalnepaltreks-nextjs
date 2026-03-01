// src/lib/validators/activity.js
export function validateActivity(data, isPartial = false) {
    const errors = [];
    
    if (!isPartial || data.name !== undefined) {
        if (!data.name) errors.push('Name is required');
        else if (data.name.length < 3) errors.push('Name must be at least 3 characters');
    }
    
    if (!isPartial || data.description !== undefined) {
        if (!data.description) errors.push('Description is required');
    }
    
    if (data.slug !== undefined && !/^[a-z0-9-]+$/.test(data.slug)) {
        errors.push('Slug can only contain lowercase letters, numbers, and hyphens');
    }
    
    if (data.activity_color !== undefined && !/^#[0-9A-F]{6}$/i.test(data.activity_color)) {
        errors.push('Color must be a valid hex code (e.g., #098B63)');
    }
    
    return { isValid: errors.length === 0, errors };
}