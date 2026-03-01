// src/lib/auth/bcrypt.js
import bcrypt from 'bcryptjs';

const SALT_ROUNDS = parseInt(process.env.BCRYPT_SALT_ROUNDS) || 10;

export const HashUtils = {
    // Hash password
    async hashPassword(password) {
        return await bcrypt.hash(password, SALT_ROUNDS);
    },

    // Compare password with hash
    async comparePassword(password, hash) {
        return await bcrypt.compare(password, hash);
    },

    // Generate random password
    generateRandomPassword(length = 12) {
        const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
        let password = '';
        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * charset.length);
            password += charset[randomIndex];
        }
        return password;
    }
};