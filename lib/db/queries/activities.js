// src/lib/db/queries/activities.js
import { query } from '../index.js';

export const ActivityQueries = {
    // Get all active activities
    async findAll({ isActive = true, limit = null, offset = 0 } = {}) {
        let sql = `
            SELECT id, name, slug, image, excerpt, description, 
                   activity_category, activity_color, is_active,
                   meta_title, meta_description
            FROM activities
            WHERE 1=1
        `;
        
        const params = [];
        
        if (isActive !== null) {
            sql += ` AND is_active = ?`;
            params.push(isActive ? 1 : 0);
        }
        
        sql += ` ORDER BY 
            CASE name
                WHEN 'Trekking' THEN 1
                WHEN 'Tours' THEN 2
                WHEN 'Peak Climbing' THEN 3
                WHEN 'Rafting' THEN 4
                WHEN 'Heli Tour' THEN 5
                WHEN 'Jungle Safari' THEN 6
                ELSE 7
            END`;
        
        if (limit) {
            sql += ` LIMIT ? OFFSET ?`;
            params.push(limit, offset);
        }
        
        return await query(sql, params);
    },

    // Get activity by ID
    async findById(id) {
        const sql = `
            SELECT id, name, slug, image, excerpt, description,
                   activity_category, activity_color, is_active,
                   meta_title, meta_description
            FROM activities
            WHERE id = ?
        `;
        
        const results = await query(sql, [id]);
        return results[0] || null;
    },

    // Get activity by slug
    async findBySlug(slug) {
        const sql = `
            SELECT id, name, slug, image, excerpt, description,
                   activity_category, activity_color, is_active,
                   meta_title, meta_description
            FROM activities
            WHERE slug = ? AND is_active = 1
        `;
        
        const results = await query(sql, [slug]);
        return results[0] || null;
    },

    // Get activities by category
    async findByCategory(category, { isActive = true, limit = null } = {}) {
        let sql = `
            SELECT id, name, slug, image, excerpt, description,
                   activity_category, activity_color, is_active,
                   meta_title, meta_description
            FROM activities
            WHERE activity_category = ?
        `;
        
        const params = [category];
        
        if (isActive !== null) {
            sql += ` AND is_active = ?`;
            params.push(isActive ? 1 : 0);
        }
        
        sql += ` ORDER BY name ASC`;
        
        if (limit) {
            sql += ` LIMIT ?`;
            params.push(limit);
        }
        
        return await query(sql, params);
    },

    // Get featured activities for homepage (based on your navbar)
    async getHomepageActivities() {
        const sql = `
            SELECT id, name, slug, image, excerpt, description,
                   activity_category, activity_color, is_active,
                   meta_title, meta_description
            FROM activities
            WHERE is_active = 1
            ORDER BY 
                CASE name
                    WHEN 'Trekking' THEN 1
                    WHEN 'Tours' THEN 2
                    WHEN 'Rafting' THEN 3
                    WHEN 'Jungle Safari' THEN 4
                    WHEN 'Peak Climbing' THEN 5
                    WHEN 'Heli Tour' THEN 6
                    ELSE 7
                END
            LIMIT 6
        `;
        
        return await query(sql);
    },

    // Get activities with package counts
    async getActivitiesWithCounts() {
        const sql = `
            SELECT 
                a.id, a.name, a.slug, a.image, a.excerpt,
                a.activity_category, a.activity_color,
                COUNT(p.id) as package_count,
                SUM(CASE WHEN p.is_featured = 1 THEN 1 ELSE 0 END) as featured_packages
            FROM activities a
            LEFT JOIN packages p ON a.id = p.activity_id AND p.is_active = 1
            WHERE a.is_active = 1
            GROUP BY a.id
            ORDER BY 
                CASE a.name
                    WHEN 'Trekking' THEN 1
                    WHEN 'Tours' THEN 2
                    WHEN 'Peak Climbing' THEN 3
                    WHEN 'Rafting' THEN 4
                    WHEN 'Heli Tour' THEN 5
                    WHEN 'Jungle Safari' THEN 6
                    ELSE 7
                END
        `;
        
        return await query(sql);
    },

    // Create new activity
    async create(activityData) {
        const sql = `
            INSERT INTO activities (
                name, slug, image, excerpt, description,
                activity_category, activity_color, is_active,
                meta_title, meta_description
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        
        const params = [
            activityData.name,
            activityData.slug,
            activityData.image || null,
            activityData.excerpt || null,
            activityData.description,
            activityData.activity_category,
            activityData.activity_color,
            activityData.is_active !== undefined ? (activityData.is_active ? 1 : 0) : 1,
            activityData.meta_title || activityData.name,
            activityData.meta_description || activityData.excerpt || `Experience ${activityData.name} in the Himalayas with expert guides.`
        ];
        
        const result = await query(sql, params);
        return { id: result.insertId, ...activityData };
    },

    // Update activity
    async update(id, activityData) {
        const sets = [];
        const values = [];
        
        const allowedFields = [
            'name', 'slug', 'image', 'excerpt', 'description',
            'activity_category', 'activity_color', 'is_active',
            'meta_title', 'meta_description'
        ];
        
        allowedFields.forEach(field => {
            if (activityData[field] !== undefined) {
                sets.push(`${field} = ?`);
                values.push(activityData[field]);
            }
        });
        
        if (sets.length === 0) return null;
        
        values.push(id);
        
        const sql = `
            UPDATE activities 
            SET ${sets.join(', ')}
            WHERE id = ?
        `;
        
        await query(sql, values);
        return await this.findById(id);
    },

    // Delete activity (soft delete by setting is_active = 0)
    async softDelete(id) {
        const sql = `
            UPDATE activities 
            SET is_active = 0 
            WHERE id = ?
        `;
        
        return await query(sql, [id]);
    },

    // Permanently delete activity (use with caution)
    async hardDelete(id) {
        // Check if any packages are using this activity
        const checkSql = `SELECT COUNT(*) as count FROM packages WHERE activity_id = ?`;
        const [result] = await query(checkSql, [id]);
        
        if (result.count > 0) {
            throw new Error('Cannot delete activity with existing packages. Archive it instead.');
        }
        
        const sql = `DELETE FROM activities WHERE id = ?`;
        return await query(sql, [id]);
    },

    // Search activities
    async search(searchTerm, { isActive = true, limit = 10 } = {}) {
        const term = `%${searchTerm}%`;
        
        let sql = `
            SELECT id, name, slug, image, excerpt, description,
                   activity_category, activity_color, is_active,
                   meta_title, meta_description
            FROM activities
            WHERE (name LIKE ? OR description LIKE ? OR activity_category LIKE ?)
        `;
        
        const params = [term, term, term];
        
        if (isActive !== null) {
            sql += ` AND is_active = ?`;
            params.push(isActive ? 1 : 0);
        }
        
        sql += ` ORDER BY 
            CASE 
                WHEN name LIKE ? THEN 1
                WHEN description LIKE ? THEN 2
                ELSE 3
            END
            LIMIT ?`;
        
        params.push(term, term, limit);
        
        return await query(sql, params);
    },

    // Get activity categories (unique)
    async getCategories() {
        const sql = `
            SELECT DISTINCT activity_category, 
                   COUNT(*) as activity_count
            FROM activities
            WHERE is_active = 1
            GROUP BY activity_category
            ORDER BY activity_category
        `;
        
        return await query(sql);
    },

    // Get stats for dashboard
    async getStats() {
        const sql = `
            SELECT 
                COUNT(*) as total_activities,
                SUM(CASE WHEN is_active = 1 THEN 1 ELSE 0 END) as active_activities,
                COUNT(DISTINCT activity_category) as total_categories,
                (
                    SELECT COUNT(DISTINCT package_id) 
                    FROM packages 
                    WHERE activity_id IS NOT NULL
                ) as packages_with_activities
            FROM activities
        `;
        
        const [stats] = await query(sql);
        
        // Get most popular activity (by packages)
        const popularSql = `
            SELECT a.name, COUNT(p.id) as package_count
            FROM activities a
            LEFT JOIN packages p ON a.id = p.activity_id
            WHERE a.is_active = 1
            GROUP BY a.id
            ORDER BY package_count DESC
            LIMIT 1
        `;
        
        const [popular] = await query(popularSql);
        
        return {
            ...stats,
            most_popular_activity: popular || null
        };
    },

    // Bulk update activity status
    async bulkUpdateStatus(ids, isActive) {
        if (!ids || ids.length === 0) return null;
        
        const placeholders = ids.map(() => '?').join(',');
        const sql = `
            UPDATE activities 
            SET is_active = ? 
            WHERE id IN (${placeholders})
        `;
        
        return await query(sql, [isActive ? 1 : 0, ...ids]);
    },

    // Get navigation structure (for navbar)
    async getNavbarActivities() {
        const sql = `
            SELECT id, name, slug, activity_category
            FROM activities
            WHERE is_active = 1
            ORDER BY 
                CASE name
                    WHEN 'Trekking' THEN 1
                    WHEN 'Tours' THEN 2
                    WHEN 'Rafting' THEN 3
                    WHEN 'Jungle Safari' THEN 4
                    WHEN 'Peak Climbing' THEN 5
                    WHEN 'Heli Tour' THEN 6
                    ELSE 7
                END
        `;
        
        return await query(sql);
    },

    // Get activities with their colors (for homepage)
    async getActivitiesWithColors() {
        const sql = `
            SELECT id, name, slug, activity_color, image, excerpt
            FROM activities
            WHERE is_active = 1
            ORDER BY 
                CASE name
                    WHEN 'Trekking' THEN 1
                    WHEN 'Tours' THEN 2
                    WHEN 'Rafting' THEN 3
                    WHEN 'Jungle Safari' THEN 4
                    WHEN 'Peak Climbing' THEN 5
                    WHEN 'Heli Tour' THEN 6
                    ELSE 7
                END
        `;
        
        return await query(sql);
    }
};