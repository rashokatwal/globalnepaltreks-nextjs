// src/lib/validators/auth.js
export const AuthValidators = {
    // Validate login input
    validateLogin(data) {
        const errors = [];
        
        if (!data.email) {
            errors.push('Email is required');
        } else if (!/\S+@\S+\.\S+/.test(data.email)) {
            errors.push('Email is invalid');
        }
        
        if (!data.password) {
            errors.push('Password is required');
        } else if (data.password.length < 6) {
            errors.push('Password must be at least 6 characters');
        }
        
        return {
            isValid: errors.length === 0,
            errors
        };
    },

    // Validate register input
    validateRegister(data) {
        const errors = [];
        
        if (!data.name) {
            errors.push('Name is required');
        } else if (data.name.length < 2) {
            errors.push('Name must be at least 2 characters');
        }
        
        if (!data.email) {
            errors.push('Email is required');
        } else if (!/\S+@\S+\.\S+/.test(data.email)) {
            errors.push('Email is invalid');
        }
        
        if (!data.password) {
            errors.push('Password is required');
        } else if (data.password.length < 6) {
            errors.push('Password must be at least 6 characters');
        } else if (!/(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])/.test(data.password)) {
            errors.push('Password must contain at least one uppercase letter, one lowercase letter, and one number');
        }
        
        if (data.password !== data.confirmPassword) {
            errors.push('Passwords do not match');
        }
        
        return {
            isValid: errors.length === 0,
            errors
        };
    },

    // Validate change password
    validateChangePassword(data) {
        const errors = [];
        
        if (!data.currentPassword) {
            errors.push('Current password is required');
        }
        
        if (!data.newPassword) {
            errors.push('New password is required');
        } else if (data.newPassword.length < 6) {
            errors.push('New password must be at least 6 characters');
        } else if (!/(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])/.test(data.newPassword)) {
            errors.push('New password must contain at least one uppercase letter, one lowercase letter, and one number');
        }
        
        if (data.newPassword !== data.confirmPassword) {
            errors.push('Passwords do not match');
        }
        
        if (data.currentPassword === data.newPassword) {
            errors.push('New password must be different from current password');
        }
        
        return {
            isValid: errors.length === 0,
            errors
        };
    },

    // Validate reset password request
    validateResetPasswordRequest(data) {
        const errors = [];
        
        if (!data.email) {
            errors.push('Email is required');
        } else if (!/\S+@\S+\.\S+/.test(data.email)) {
            errors.push('Email is invalid');
        }
        
        return {
            isValid: errors.length === 0,
            errors
        };
    }
};