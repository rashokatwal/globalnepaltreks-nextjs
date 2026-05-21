// src/lib/auth/cookies.js
import { AuthUtils } from "./jwt";

const isProduction = process.env.NODE_ENV === 'production';

export const CookieUtils = {

    setAuthCookies(res, accessToken, refreshToken) {
        // ✅ Fix 1: secure based on NODE_ENV, not a separate env var
        // ✅ Fix 2: sameSite 'lax' instead of 'strict' — 'strict' blocks
        //    cookies on redirects after login (browser won't send it
        //    when navigating from login page to /admin)
        // ✅ Fix 3: maxAge in SECONDS not milliseconds — Next.js cookies.set
        //    uses seconds; your original was 7000x too long and some
        //    browsers reject cookies with maxAge > ~400 days
        // ✅ Fix 4: don't set domain unless explicitly provided and valid —
        //    an undefined domain causes cookies to be silently dropped
        //    in some browsers in production

        const cookieBase = {
            httpOnly: true,
            secure: isProduction,
            sameSite: 'lax',
            path: '/',
            ...(process.env.COOKIE_DOMAIN ? { domain: process.env.COOKIE_DOMAIN } : {}),
        };

        // Access token — 7 days
        res.cookies.set('access_token', accessToken, {
            ...cookieBase,
            maxAge: 60 * 60 * 24 * 7,
        });

        // Refresh token — 30 days
        // ✅ Fix 5: path was '/api/auth/refresh' which means the cookie
        //    is ONLY sent to that one endpoint — your /api/auth/me and
        //    middleware never received it. Changed to '/'
        res.cookies.set('refresh_token', refreshToken, {
            ...cookieBase,
            path: '/',
            maxAge: 60 * 60 * 24 * 30,
        });

        // User info cookie (readable by frontend JS)
        const decoded = AuthUtils.decodeToken(accessToken);
        if (decoded) {
            res.cookies.set('user', JSON.stringify({
                id: decoded.id,
                name: decoded.name,
                email: decoded.email,
                role: decoded.role
            }), {
                ...cookieBase,
                httpOnly: false,  // intentionally readable by JS
                maxAge: 60 * 60 * 24 * 7,
            });
        }
    },

    clearAuthCookies(res) {
        const cookieBase = {
            path: '/',
            expires: new Date(0),
            ...(process.env.COOKIE_DOMAIN ? { domain: process.env.COOKIE_DOMAIN } : {}),
        };

        res.cookies.set('access_token', '', { ...cookieBase, httpOnly: true });
        res.cookies.set('refresh_token', '', { ...cookieBase, httpOnly: true });
        res.cookies.set('user', '', { ...cookieBase, httpOnly: false });
    },

    getTokenFromRequest(req) {
        // Check Authorization header first
        const authHeader = req.headers.get('authorization');
        if (authHeader?.startsWith('Bearer ')) {
            return authHeader.substring(7);
        }

        // Check cookie
        return req.cookies.get('access_token')?.value || null;
    }
};