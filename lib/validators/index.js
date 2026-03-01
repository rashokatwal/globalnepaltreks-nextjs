// src/lib/validators/index.js
import { validateAuth } from './auth.js';
import { validateBlog } from './blog.js';
import { validatePackage } from './package.js';
import { validateActivity } from './activity.js';
import { validateCountry } from './country.js';
import { validateTeam } from './team.js';
import { validateTestimonial } from './testimonial.js';

export const Validators = {
    auth: validateAuth,
    blog: validateBlog,
    package: validatePackage,
    activity: validateActivity,
    country: validateCountry,
    team: validateTeam,
    testimonial: validateTestimonial
};

export function validate(resourceType, data, isPartial = false) {
    const validator = Validators[resourceType];
    if (!validator) {
        throw new Error(`No validator found for resource type: ${resourceType}`);
    }
    return validator(data, isPartial);
}