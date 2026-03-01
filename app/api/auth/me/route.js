// src/app/api/auth/me/route.js
import { NextResponse } from 'next/server';
import { AuthMiddleware } from '@/lib/auth/middleware.js';
import { UserQueries } from '@/lib/db/queries/users.js';

export async function GET(request) {
    try {
        // Require authentication
        const auth = await AuthMiddleware.requireAuth(request);
        
        // If auth returned a NextResponse (error), return it
        if (auth instanceof NextResponse) {
            return auth;
        }
        
        // Get fresh user data from database
        const user = await UserQueries.findById(auth.user.id);
        
        if (!user) {
            return NextResponse.json(
                { 
                    success: false, 
                    error: 'User not found' 
                },
                { status: 404 }
            );
        }
        
        return NextResponse.json({
            success: true,
            user
        });
        
    } catch (error) {
        console.error('Get user error:', error);
        return NextResponse.json(
            { 
                success: false, 
                error: 'Failed to get user',
                message: error.message 
            },
            { status: 500 }
        );
    }
}

// Update user profile
export async function PUT(request) {
    try {
        // Require authentication
        const auth = await AuthMiddleware.requireAuth(request);
        
        if (auth instanceof NextResponse) {
            return auth;
        }
        
        const body = await request.json();
        
        // Update profile
        const updatedUser = await UserQueries.updateProfile(auth.user.id, {
            name: body.name,
            profile_image: body.profile_image,
            bio: body.bio
        });
        
        return NextResponse.json({
            success: true,
            message: 'Profile updated successfully',
            user: updatedUser
        });
        
    } catch (error) {
        console.error('Update profile error:', error);
        return NextResponse.json(
            { 
                success: false, 
                error: 'Failed to update profile',
                message: error.message 
            },
            { status: 500 }
        );
    }
}