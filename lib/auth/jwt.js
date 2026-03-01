// src/lib/auth/jwt.js
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';
const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || '30d';

if (!JWT_SECRET || !JWT_REFRESH_SECRET) {
    throw new Error('JWT secrets must be defined in environment variables');
}

export const AuthUtils = {
    // Generate access token
    generateAccessToken(user) {
        const payload = {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role
        };
        
        return jwt.sign(payload, JWT_SECRET, { 
            expiresIn: JWT_EXPIRES_IN 
        });
    },

    // Generate refresh token
    generateRefreshToken(user) {
        const payload = {
            id: user.id,
            email: user.email
        };
        
        return jwt.sign(payload, JWT_REFRESH_SECRET, { 
            expiresIn: JWT_REFRESH_EXPIRES_IN 
        });
    },

    // Verify access token
    verifyAccessToken(token) {
        try {
            const decoded = jwt.verify(token, JWT_SECRET);
            return { valid: true, decoded };
        } catch (error) {
            return { 
                valid: false, 
                error: error.name === 'TokenExpiredError' ? 'expired' : 'invalid' 
            };
        }
    },

    // Verify refresh token
    verifyRefreshToken(token) {
        try {
            const decoded = jwt.verify(token, JWT_REFRESH_SECRET);
            return { valid: true, decoded };
        } catch (error) {
            return { 
                valid: false, 
                error: error.name === 'TokenExpiredError' ? 'expired' : 'invalid' 
            };
        }
    },

    // Decode token without verification
    decodeToken(token) {
        return jwt.decode(token);
    }
};