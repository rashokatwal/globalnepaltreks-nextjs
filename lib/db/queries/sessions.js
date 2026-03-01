// src/lib/db/queries/sessions.js
import { query } from '../index.js';

export const SessionQueries = {
    // Create session
    async create(userId, refreshToken, userAgent, ipAddress) {
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 30); // 30 days
        
        const sql = `
            INSERT INTO sessions (
                user_id, refresh_token, user_agent, ip_address, expires_at
            ) VALUES (?, ?, ?, ?, ?)
        `;
        
        const params = [
            userId,
            refreshToken,
            userAgent || null,
            ipAddress || null,
            expiresAt
        ];
        
        const result = await query(sql, params);
        return { id: result.insertId, userId, refreshToken };
    },

    // Find session by refresh token
    async findByRefreshToken(refreshToken) {
        const sql = `
            SELECT s.*, u.name, u.email, u.role
            FROM sessions s
            JOIN users u ON s.user_id = u.id
            WHERE s.refresh_token = ? AND s.expires_at > NOW()
        `;
        
        const results = await query(sql, [refreshToken]);
        return results[0] || null;
    },

    // Delete session (logout)
    async deleteByRefreshToken(refreshToken) {
        const sql = `DELETE FROM sessions WHERE refresh_token = ?`;
        return await query(sql, [refreshToken]);
    },

    // Delete all user sessions (logout from all devices)
    async deleteAllUserSessions(userId) {
        const sql = `DELETE FROM sessions WHERE user_id = ?`;
        return await query(sql, [userId]);
    },

    // Clean expired sessions
    async cleanExpired() {
        const sql = `DELETE FROM sessions WHERE expires_at < NOW()`;
        return await query(sql);
    }
};