// src/app/api/auth/refresh/route.js
import { NextResponse } from 'next/server';
import { SessionQueries } from '@/lib/db/queries/sessions.js';
import { AuthUtils } from '@/lib/auth/jwt.js';
import { CookieUtils } from '@/lib/auth/cookies.js';

export async function POST(request) {
    try {
        // Get refresh token from cookie
        const refreshToken = request.cookies.get('refresh_token')?.value;
        
        if (!refreshToken) {
            return NextResponse.json(
                { 
                    success: false, 
                    error: 'No refresh token provided' 
                },
                { status: 401 }
            );
        }
        
        // Verify refresh token
        const result = AuthUtils.verifyRefreshToken(refreshToken);
        
        if (!result.valid) {
            return NextResponse.json(
                { 
                    success: false, 
                    error: result.error === 'expired' ? 'Refresh token expired' : 'Invalid refresh token' 
                },
                { status: 401 }
            );
        }
        
        // Find session
        const session = await SessionQueries.findByRefreshToken(refreshToken);
        
        if (!session) {
            return NextResponse.json(
                { 
                    success: false, 
                    error: 'Session not found' 
                },
                { status: 401 }
            );
        }
        
        // Generate new tokens
        const user = {
            id: session.user_id,
            name: session.name,
            email: session.email,
            role: session.role
        };
        
        const newAccessToken = AuthUtils.generateAccessToken(user);
        const newRefreshToken = AuthUtils.generateRefreshToken(user);
        
        // Delete old session and create new one
        await SessionQueries.deleteByRefreshToken(refreshToken);
        
        const userAgent = request.headers.get('user-agent');
        const ipAddress = request.headers.get('x-forwarded-for') || 
                          request.ip || 
                          'unknown';
        
        await SessionQueries.create(
            user.id,
            newRefreshToken,
            userAgent,
            ipAddress
        );
        
        // Create response
        const response = NextResponse.json({
            success: true,
            message: 'Token refreshed successfully'
        });
        
        // Set new cookies
        CookieUtils.setAuthCookies(response, newAccessToken, newRefreshToken);
        
        return response;
        
    } catch (error) {
        console.error('Refresh token error:', error);
        return NextResponse.json(
            { 
                success: false, 
                error: 'Failed to refresh token',
                message: error.message 
            },
            { status: 500 }
        );
    }
}