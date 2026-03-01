// src/app/api/auth/login/route.js
import { NextResponse } from 'next/server';
import { UserQueries } from '@/lib/db/queries/users.js';
import { SessionQueries } from '@/lib/db/queries/sessions.js';
import { HashUtils } from '@/lib/auth/bcrypt.js';
import { CookieUtils } from '@/lib/auth/cookies.js';
import { AuthValidators } from '@/lib/validators/auth.js';
import { AuthUtils } from '@/lib/auth/jwt';

export async function POST(request) {
    try {
        const body = await request.json();
        
        // Validate input
        const validation = AuthValidators.validateLogin(body);
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
        
        // Find user by email
        const user = await UserQueries.findByEmail(body.email);
        
        if (!user) {
            return NextResponse.json(
                { 
                    success: false, 
                    error: 'Invalid email or password' 
                },
                { status: 401 }
            );
        }
        
        // Verify password
        const isValidPassword = await HashUtils.comparePassword(
            body.password, 
            user.password_hash
        );
        
        if (!isValidPassword) {
            return NextResponse.json(
                { 
                    success: false, 
                    error: 'Invalid email or password' 
                },
                { status: 401 }
            );
        }
        
        // Generate tokens
        const accessToken = AuthUtils.generateAccessToken(user);
        const refreshToken = AuthUtils.generateRefreshToken(user);
        
        // Get client info
        const userAgent = request.headers.get('user-agent');
        const ipAddress = request.headers.get('x-forwarded-for') || 
                          request.ip || 
                          'unknown';
        
        // Create session
        await SessionQueries.create(
            user.id, 
            refreshToken, 
            userAgent, 
            ipAddress
        );
        
        // Update last login
        await UserQueries.updateLastLogin(user.id);
        
        // Create response
        const response = NextResponse.json({
            success: true,
            message: 'Login successful',
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                profile_image: user.profile_image
            }
        });
        
        // Set cookies
        CookieUtils.setAuthCookies(response, accessToken, refreshToken);
        
        return response;
        
    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json(
            { 
                success: false, 
                error: 'Login failed',
                message: error.message 
            },
            { status: 500 }
        );
    }
}