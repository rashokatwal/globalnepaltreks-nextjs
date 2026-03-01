// src/lib/auth/permissions.js
export const Permissions = {
    canModify(user, resource) {
        if (user.role === 'admin') return true;
        return resource.createdBy === user.id || resource.user_id === user.id;
    },

    canView(user, resource) {
        if (resource.is_published) return true;
        if (!user) return false;
        if (user.role === 'admin') return true;
        return resource.createdBy === user.id || resource.user_id === user.id;
    },

    canPublish(user) {
        return user.role === 'admin' || user.role === 'editor';
    },

    canDelete(user, resource) {
        if (user.role === 'admin') return true;
        return resource.createdBy === user.id;
    },

    getAllowedActions(user) {
        const actions = ['VIEW'];
        
        if (user) {
            actions.push('CREATE');
            if (user.role === 'admin' || user.role === 'editor') {
                actions.push('UPDATE', 'PUBLISH', 'UNPUBLISH');
            }
            if (user.role === 'admin') {
                actions.push('DELETE', 'BULK_DELETE');
            }
        }
        
        return actions;
    },

    hasRole(user, requiredRole) {
        if (!user) return false;
        if (user.role === 'admin') return true;
        return user.role === requiredRole;
    }
};