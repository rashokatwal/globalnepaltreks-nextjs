// src/lib/utils/errors.js
export class AppError extends Error {
    constructor(message, statusCode = 500) {
        super(message);
        this.statusCode = statusCode;
        this.name = this.constructor.name;
    }
}

export class NotFoundError extends AppError {
    constructor(message = 'Resource not found') {
        super(message, 404);
    }
}

export class ValidationError extends AppError {
    constructor(message = 'Validation failed', errors = []) {
        super(message, 400);
        this.errors = errors;
    }
}

export class AuthenticationError extends AppError {
    constructor(message = 'Authentication required') {
        super(message, 401);
    }
}

export class AuthorizationError extends AppError {
    constructor(message = 'Access denied') {
        super(message, 403);
    }
}

export class ConflictError extends AppError {
    constructor(message = 'Resource already exists') {
        super(message, 409);
    }
}

export function handleError(error) {
    console.error('Error:', error);
    
    if (error instanceof AppError) {
        return {
            message: error.message,
            status: error.statusCode,
            errors: error.errors
        };
    }
    
    if (error.code === 'ER_DUP_ENTRY') {
        return {
            message: 'Duplicate entry, resource already exists',
            status: 409
        };
    }
    
    return {
        message: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error',
        status: 500
    };
}