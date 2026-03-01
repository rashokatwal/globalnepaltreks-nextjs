// src/lib/db/queries/users.js
import { query } from '../index.js';
import { HashUtils } from '@/lib/auth/bcrypt.js';

export const UserQueries = {
    // Find user by email
    async findByEmail(email) {
        const sql = `
            SELECT id, name, email, password_hash, role, profile_image, bio, 
                   is_active, last_login, created_at
            FROM users
            WHERE email = ? AND is_active = 1
        `;
        
        const results = await query(sql, [email]);
        return results[0] || null;
    },

    // Find user by ID
    async findById(id) {
        const sql = `
            SELECT id, name, email, role, profile_image, bio, 
                   is_active, last_login, created_at
            FROM users
            WHERE id = ? AND is_active = 1
        `;
        
        const results = await query(sql, [id]);
        return results[0] || null;
    },

    // Create new user
    async create(userData) {
        const passwordHash = await HashUtils.hashPassword(userData.password);
        
        const sql = `
            INSERT INTO users (
                name, email, password_hash, role, profile_image, bio
            ) VALUES (?, ?, ?, ?, ?, ?)
        `;
        
        const params = [
            userData.name,
            userData.email,
            passwordHash,
            userData.role || 'author',
            userData.profile_image || null,
            userData.bio || null
        ];
        
        const result = await query(sql, params);
        return { id: result.insertId, ...userData };
    },

    // Update last login
    async updateLastLogin(id) {
        const sql = `
            UPDATE users 
            SET last_login = NOW() 
            WHERE id = ?
        `;
        
        return await query(sql, [id]);
    },

    // Change password
    async changePassword(id, newPassword) {
        const passwordHash = await HashUtils.hashPassword(newPassword);
        
        const sql = `
            UPDATE users 
            SET password_hash = ? 
            WHERE id = ?
        `;
        
        return await query(sql, [passwordHash, id]);
    },

    // Update user profile
    async updateProfile(id, userData) {
        const sets = [];
        const values = [];
        
        const allowedFields = ['name', 'profile_image', 'bio'];
        
        allowedFields.forEach(field => {
            if (userData[field] !== undefined) {
                sets.push(`${field} = ?`);
                values.push(userData[field]);
            }
        });
        
        if (sets.length === 0) return null;
        
        values.push(id);
        
        const sql = `
            UPDATE users 
            SET ${sets.join(', ')} 
            WHERE id = ?
        `;
        
        await query(sql, values);
        return await this.findById(id);
    },

    // Get all users (admin only)
    async getAllUsers({ page = 1, limit = 10 } = {}) {
        const offset = (page - 1) * limit;
        
        const sql = `
            SELECT id, name, email, role, profile_image, is_active, last_login, created_at
            FROM users
            ORDER BY created_at DESC
            LIMIT ? OFFSET ?
        `;
        
        const countSql = `SELECT COUNT(*) as total FROM users`;
        
        const [totalResult] = await query(countSql);
        const users = await query(sql, [limit, offset]);
        
        return {
            users,
            pagination: {
                total: totalResult?.total || 0,
                page,
                limit,
                totalPages: Math.ceil((totalResult?.total || 0) / limit)
            }
        };
    },

    // Toggle user active status
    async toggleActive(id) {
        const sql = `
            UPDATE users 
            SET is_active = NOT is_active 
            WHERE id = ?
        `;
        
        return await query(sql, [id]);
    },

    // Delete user
    async delete(id) {
        const sql = `DELETE FROM users WHERE id = ?`;
        return await query(sql, [id]);
    }
};