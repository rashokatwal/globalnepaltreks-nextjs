// src/app/api/auth/logout/route.js
import { NextResponse } from 'next/server';
import { SessionQueries } from '@/lib/db/queries/sessions.js';

export async function POST(request) {
    try {
        // Get refresh token from cookie
        const refreshToken = request.cookies.get('refresh_token')?.value;
        
        if (refreshToken) {
            // Delete session from database
            await SessionQueries.deleteByRefreshToken(refreshToken);
        }
        
        // Detect if we are on HTTPS (same logic as login)
        const forwardedProto = request.headers.get('x-forwarded-proto');
        const isHttps = forwardedProto === 'https' || request.nextUrl.protocol === 'https:';
        
        // Create response
        const response = NextResponse.json({
            success: true,
            message: 'Logout successful'
        });
        
        // Clear cookies with identical options to ensure deletion
        const cookieOptions = {
            httpOnly: true,
            secure: isHttps,
            sameSite: 'lax',
            path: '/',
            maxAge: 0,               // Immediately expire
        };
        
        response.cookies.set('access_token', '', cookieOptions);
        response.cookies.set('refresh_token', '', cookieOptions);
        
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