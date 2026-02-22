// src/lib/validators/blog.js
export function validateBlog(data, isPartial = false) {
  const errors = [];
  
  // Required fields for creation
  if (!isPartial) {
    if (!data.title) {
      errors.push('Title is required');
    } else if (data.title.length < 5) {
      errors.push('Title must be at least 5 characters');
    } else if (data.title.length > 255) {
      errors.push('Title must be less than 255 characters');
    }
    
    if (!data.content) {
      errors.push('Content is required');
    } else if (data.content.length < 50) {
      errors.push('Content must be at least 50 characters');
    }
  }
  
  // Optional fields validation
  if (data.slug !== undefined) {
    if (!/^[a-z0-9-]+$/.test(data.slug)) {
      errors.push('Slug can only contain lowercase letters, numbers, and hyphens');
    }
  }
  
  if (data.excerpt !== undefined && data.excerpt.length > 300) {
    errors.push('Excerpt must be less than 300 characters');
  }
  
  if (data.reading_time !== undefined && (data.reading_time < 1 || data.reading_time > 60)) {
    errors.push('Reading time must be between 1 and 60 minutes');
  }
  
  if (data.country_id !== undefined && isNaN(parseInt(data.country_id))) {
    errors.push('Country ID must be a valid number');
  }
  
  if (data.activity_id !== undefined && isNaN(parseInt(data.activity_id))) {
    errors.push('Activity ID must be a valid number');
  }
  
  if (data.meta_title !== undefined && data.meta_title.length > 255) {
    errors.push('Meta title must be less than 255 characters');
  }
  
  if (data.meta_description !== undefined && data.meta_description.length > 500) {
    errors.push('Meta description must be less than 500 characters');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}