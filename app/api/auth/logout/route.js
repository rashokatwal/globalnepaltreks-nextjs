// src/app/api/auth/logout/route.js
import { NextResponse } from 'next/server';
import { SessionQueries } from '@/lib/db/queries/sessions.js';
import { CookieUtils } from '@/lib/auth/cookies.js';

export async function POST(request) {
    try {
        // Get refresh token from cookie
        const refreshToken = request.cookies.get('refresh_token')?.value;
        
        if (refreshToken) {
            // Delete session
            await SessionQueries.deleteByRefreshToken(refreshToken);
        }
        
        // Create response
        const response = NextResponse.json({
            success: true,
            message: 'Logout successful'
        });
        
        // Clear cookies
        CookieUtils.clearAuthCookies(response);
        
        return response;
        
    } catch (error) {
        console.error('Logout error:', error);
        return NextResponse.json(
            { 
                success: false, 
                error: 'Logout failed',
                message: error.message 
            },
            { status: 500 }
        );
    }
}