// src/lib/validators/package.js
export function validatePackage(data, isPartial = false) {
    const errors = [];
    
    if (!isPartial || data.title !== undefined) {
        if (!data.title) errors.push('Title is required');
        else if (data.title.length < 5) errors.push('Title must be at least 5 characters');
        else if (data.title.length > 200) errors.push('Title must be less than 200 characters');
    }
    
    if (!isPartial || data.duration_days !== undefined) {
        if (!data.duration_days) errors.push('Duration is required');
        else if (isNaN(data.duration_days) || data.duration_days < 1) {
            errors.push('Duration must be at least 1 day');
        }
    }
    
    if (!isPartial || data.price !== undefined) {
        if (data.price === undefined) errors.push('Price is required');
        else if (isNaN(data.price) || data.price <= 0) {
            errors.push('Price must be a positive number');
        }
    }
    
    if (data.slug !== undefined && !/^[a-z0-9-]+$/.test(data.slug)) {
        errors.push('Slug can only contain lowercase letters, numbers, and hyphens');
    }
    
    if (data.difficulty !== undefined && 
        !['easy', 'moderate', 'challenging', 'difficult'].includes(data.difficulty)) {
        errors.push('Difficulty must be easy, moderate, challenging, or difficult');
    }
    
    if (data.country_id !== undefined && isNaN(parseInt(data.country_id))) {
        errors.push('Country ID must be a valid number');
    }
    
    if (data.activity_id !== undefined && isNaN(parseInt(data.activity_id))) {
        errors.push('Activity ID must be a valid number');
    }
    
    if (data.max_altitude !== undefined && (isNaN(data.max_altitude) || data.max_altitude < 0)) {
        errors.push('Max altitude must be a positive number');
    }
    
    if (data.group_size_min !== undefined && 
        (isNaN(data.group_size_min) || data.group_size_min < 1)) {
        errors.push('Minimum group size must be at least 1');
    }
    
    if (data.group_size_max !== undefined && 
        data.group_size_min !== undefined && 
        data.group_size_max < data.group_size_min) {
        errors.push('Maximum group size cannot be less than minimum group size');
    }
    
    if (data.meta_title !== undefined && data.meta_title.length > 255) {
        errors.push('Meta title must be less than 255 characters');
    }
    
    if (data.meta_description !== undefined && data.meta_description.length > 500) {
        errors.push('Meta description must be less than 500 characters');
    }
    
    if (data.short_description !== undefined && data.short_description.length > 300) {
        errors.push('Short description must be less than 300 characters');
    }
    
    return { isValid: errors.length === 0, errors };
}

// Validate itinerary item
export function validateItineraryItem(data) {
    const errors = [];
    
    if (!data.day_number) errors.push('Day number is required');
    else if (isNaN(data.day_number) || data.day_number < 1) {
        errors.push('Day number must be a positive number');
    }
    
    if (!data.title) errors.push('Title is required');
    
    if (!data.description) errors.push('Description is required');
    
    return { isValid: errors.length === 0, errors };
}

// Validate package feature
export function validatePackageFeature(data) {
    const errors = [];
    
    if (!data.feature_type) errors.push('Feature type is required');
    else if (!['included', 'excluded', 'not_suitable'].includes(data.feature_type)) {
        errors.push('Feature type must be included, excluded, or not_suitable');
    }
    
    if (!data.description) errors.push('Description is required');
    
    return { isValid: errors.length === 0, errors };
}