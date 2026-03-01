// src/app/api/auth/change-password/route.js
import { NextResponse } from 'next/server';
import { AuthMiddleware } from '@/lib/auth/middleware.js';
import { UserQueries } from '@/lib/db/queries/users.js';
import { HashUtils } from '@/lib/auth/bcrypt.js';
import { AuthValidators } from '@/lib/validators/auth.js';

export async function POST(request) {
    try {
        // Require authentication
        const auth = await AuthMiddleware.requireAuth(request);
        
        if (auth instanceof NextResponse) {
            return auth;
        }
        
        const body = await request.json();
        
        // Validate input
        const validation = AuthValidators.validateChangePassword(body);
        if (!validation.isValid) {
            return NextResponse.json(
                { 
                    success: false, 
                    error: 'Validation failed',
                    errors: validation.errors 
                },
                { status: 400 }
            );
        }
        
        // Get user with password hash
        const user = await UserQueries.findByEmail(auth.user.email);
        
        // Verify current password
        const isValidPassword = await HashUtils.comparePassword(
            body.currentPassword,
            user.password_hash
        );
        
        if (!isValidPassword) {
            return NextResponse.json(
                { 
                    success: false, 
                    error: 'Current password is incorrect' 
                },
                { status: 401 }
            );
        }
        
        // Change password
        await UserQueries.changePassword(auth.user.id, body.newPassword);
        
        return NextResponse.json({
            success: true,
            message: 'Password changed successfully'
        });
        
    } catch (error) {
        console.error('Change password error:', error);
        return NextResponse.json(
            { 
                success: false, 
                error: 'Failed to change password',
                message: error.message 
            },
            { status: 500 }
        );
    }
}