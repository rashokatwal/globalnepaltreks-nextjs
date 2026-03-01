import { AuthUtils } from "./jwt";

// src/lib/auth/cookies.js
export const CookieUtils = {
    // Set auth cookies
    setAuthCookies(res, accessToken, refreshToken) {
        const isSecure = process.env.COOKIE_SECURE === 'true';
        const domain = process.env.COOKIE_DOMAIN;
        
        // Access token cookie (httpOnly for security)
        res.cookies.set('access_token', accessToken, {
            httpOnly: true,
            secure: isSecure,
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            path: '/',
            domain
        });
        
        // Refresh token cookie (httpOnly for security)
        res.cookies.set('refresh_token', refreshToken, {
            httpOnly: true,
            secure: isSecure,
            sameSite: 'strict',
            maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
            path: '/api/auth/refresh',
            domain
        });
        
        // User info cookie (not httpOnly, accessible to frontend)
        const decoded = AuthUtils.decodeToken(accessToken);
        if (decoded) {
            res.cookies.set('user', JSON.stringify({
                id: decoded.id,
                name: decoded.name,
                email: decoded.email,
                role: decoded.role
            }), {
                httpOnly: false,
                secure: isSecure,
                sameSite: 'strict',
                maxAge: 7 * 24 * 60 * 60 * 1000,
                path: '/',
                domain
            });
        }
    },

    // Clear auth cookies
    clearAuthCookies(res) {
        const domain = process.env.COOKIE_DOMAIN;
        
        res.cookies.set('access_token', '', {
            httpOnly: true,
            expires: new Date(0),
            path: '/',
            domain
        });
        
        res.cookies.set('refresh_token', '', {
            httpOnly: true,
            expires: new Date(0),
            path: '/api/auth/refresh',
            domain
        });
        
        res.cookies.set('user', '', {
            httpOnly: false,
            expires: new Date(0),
            path: '/',
            domain
        });
    },

    // Get token from request
    getTokenFromRequest(req) {
        // Check Authorization header first
        const authHeader = req.headers.get('authorization');
        if (authHeader && authHeader.startsWith('Bearer ')) {
            return authHeader.substring(7);
        }
        
        // Check cookies next
        const cookieToken = req.cookies.get('access_token')?.value;
        if (cookieToken) {
            return cookieToken;
        }
        
        return null;
    }
};