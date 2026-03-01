// src/lib/auth/middleware.js
import { NextResponse } from 'next/server';
import { AuthUtils } from './jwt.js';
import { CookieUtils } from './cookies.js';

export const AuthMiddleware = {
    // Verify authentication
    async verifyAuth(request) {
        const token = CookieUtils.getTokenFromRequest(request);
        
        if (!token) {
            return { 
                authenticated: false, 
                error: 'No token provided' 
            };
        }
        
        const result = AuthUtils.verifyAccessToken(token);
        
        if (!result.valid) {
            return { 
                authenticated: false, 
                error: result.error === 'expired' ? 'Token expired' : 'Invalid token' 
            };
        }
        
        return {
            authenticated: true,
            user: result.decoded
        };
    },

    // Require authentication middleware
    async requireAuth(request) {
        const auth = await this.verifyAuth(request);
        
        if (!auth.authenticated) {
            return NextResponse.json(
                { 
                    success: false, 
                    error: 'Authentication required',
                    message: auth.error 
                },
                { status: 401 }
            );
        }
        
        return auth;
    },

    // Require admin role middleware
    async requireAdmin(request) {
        const auth = await this.requireAuth(request);
        
        // If auth returned a NextResponse (error), return it
        if (auth instanceof NextResponse) {
            return auth;
        }
        
        if (auth.user.role !== 'admin') {
            return NextResponse.json(
                { 
                    success: false, 
                    error: 'Admin access required' 
                },
                { status: 403 }
            );
        }
        
        return auth;
    },

    // Require specific role middleware
    async requireRole(request, allowedRoles) {
        const auth = await this.requireAuth(request);
        
        if (auth instanceof NextResponse) {
            return auth;
        }
        
        const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
        
        if (!roles.includes(auth.user.role)) {
            return NextResponse.json(
                { 
                    success: false, 
                    error: `Access denied. Required role: ${roles.join(' or ')}` 
                },
                { status: 403 }
            );
        }
        
        return auth;
    }
};