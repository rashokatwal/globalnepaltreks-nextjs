// src/lib/utils/response.js
import { NextResponse } from 'next/server';

export class ApiResponse {
    static success(data, message = 'Success', status = 200) {
        return NextResponse.json({ success: true, message, data }, { status });
    }

    static created(data, message = 'Created successfully') {
        return this.success(data, message, 201);
    }

    static error(message, status = 400, errors = null) {
        const response = { success: false, error: message };
        if (errors) response.errors = errors;
        return NextResponse.json(response, { status });
    }

    static notFound(message = 'Resource not found') {
        return this.error(message, 404);
    }

    static unauthorized(message = 'Unauthorized') {
        return this.error(message, 401);
    }

    static forbidden(message = 'Forbidden') {
        return this.error(message, 403);
    }

    static validationError(errors) {
        return this.error('Validation failed', 400, errors);
    }

    static conflict(message = 'Resource already exists') {
        return this.error(message, 409);
    }
}