// src/lib/db/queries/countries.js
import { query, transaction } from '../index.js';

export const CountryQueries = {
    // Get all active countries
    async findAll({ isActive = true, limit = null, offset = 0 } = {}) {
        let sql = `
            SELECT id, name, slug, featured_image, description,
                   meta_title, meta_description, is_active, created_at
            FROM countries
            WHERE 1=1
        `;
        
        const params = [];
        
        if (isActive !== null) {
            sql += ` AND is_active = ?`;
            params.push(isActive ? 1 : 0);
        }
        
        sql += ` ORDER BY 
            CASE name
                WHEN 'Nepal' THEN 1
                WHEN 'Tibet' THEN 2
                WHEN 'Bhutan' THEN 3
                ELSE 4
            END`;
        
        if (limit) {
            sql += ` LIMIT ? OFFSET ?`;
            params.push(limit, offset);
        }
        
        return await query(sql, params);
    },

    // Get country by ID
    async findById(id) {
        const sql = `
            SELECT id, name, slug, featured_image, description,
                   meta_title, meta_description, is_active, created_at
            FROM countries
            WHERE id = ?
        `;
        
        const results = await query(sql, [id]);
        return results[0] || null;
    },

    // Get country by slug
    async findBySlug(slug) {
        const sql = `
            SELECT id, name, slug, featured_image, description,
                   meta_title, meta_description, is_active, created_at
            FROM countries
            WHERE slug = ? AND is_active = 1
        `;
        
        const results = await query(sql, [slug]);
        return results[0] || null;
    },

    // Get countries for navbar
    async getNavbarCountries() {
        const sql = `
            SELECT id, name, slug
            FROM countries
            WHERE is_active = 1
            ORDER BY 
                CASE name
                    WHEN 'Nepal' THEN 1
                    WHEN 'Tibet' THEN 2
                    WHEN 'Bhutan' THEN 3
                    ELSE 4
                END
        `;
        
        return await query(sql);
    },

    // Get countries with activity counts
    async getCountriesWithActivityCounts() {
        const sql = `
            SELECT 
                c.id, c.name, c.slug, c.featured_image,
                COUNT(DISTINCT ca.activity_id) as activity_count,
                COUNT(DISTINCT p.id) as package_count,
                COUNT(DISTINCT b.id) as blog_count
            FROM countries c
            LEFT JOIN country_activities ca ON c.id = ca.country_id
            LEFT JOIN packages p ON c.id = p.country_id AND p.is_active = 1
            LEFT JOIN blogs b ON c.id = b.country_id AND b.is_published = 1
            WHERE c.is_active = 1
            GROUP BY c.id
            ORDER BY 
                CASE c.name
                    WHEN 'Nepal' THEN 1
                    WHEN 'Tibet' THEN 2
                    WHEN 'Bhutan' THEN 3
                    ELSE 4
                END
        `;
        
        return await query(sql);
    },

    // Get country with full details (including activities)
    async getCountryWithDetails(slug) {
        const country = await this.findBySlug(slug);
        
        if (!country) return null;
        
        // Get activities for this country
        const activitiesSql = `
            SELECT 
                a.id, a.name, a.slug, a.activity_category,
                a.activity_color, a.image, a.excerpt,
                ca.is_featured, ca.display_order
            FROM activities a
            JOIN country_activities ca ON a.id = ca.activity_id
            WHERE ca.country_id = ? AND a.is_active = 1
            ORDER BY ca.display_order
        `;
        
        // Get packages for this country
        const packagesSql = `
            SELECT id, title, slug, duration_days, price, difficulty,
                   featured_image, short_description
            FROM packages
            WHERE country_id = ? AND is_active = 1
            ORDER BY is_featured DESC, created_at DESC
            LIMIT 6
        `;
        
        // Get blogs for this country
        const blogsSql = `
            SELECT id, title, slug, excerpt, featured_image,
                   author, reading_time, published_at
            FROM blogs
            WHERE country_id = ? AND is_published = 1
            ORDER BY published_at DESC
            LIMIT 4
        `;
        
        const [activities, packages, blogs] = await Promise.all([
            query(activitiesSql, [country.id]),
            query(packagesSql, [country.id]),
            query(blogsSql, [country.id])
        ]);
        
        return {
            ...country,
            activities,
            packages,
            blogs
        };
    },

    // Create new country
    async create(countryData) {
        const sql = `
            INSERT INTO countries (
                name, slug, featured_image, description,
                meta_title, meta_description, is_active
            ) VALUES (?, ?, ?, ?, ?, ?, ?)
        `;
        
        const params = [
            countryData.name,
            countryData.slug,
            countryData.featured_image || null,
            countryData.description || null,
            countryData.meta_title || countryData.name,
            countryData.meta_description || `Explore trekking and tours in ${countryData.name} with expert local guides.`,
            countryData.is_active !== undefined ? (countryData.is_active ? 1 : 0) : 1
        ];
        
        const result = await query(sql, params);
        return { id: result.insertId, ...countryData };
    },

    // Update country
    async update(id, countryData) {
        const sets = [];
        const values = [];
        
        const allowedFields = [
            'name', 'slug', 'featured_image', 'description',
            'meta_title', 'meta_description', 'is_active'
        ];
        
        allowedFields.forEach(field => {
            if (countryData[field] !== undefined) {
                sets.push(`${field} = ?`);
                values.push(countryData[field]);
            }
        });
        
        if (sets.length === 0) return null;
        
        values.push(id);
        
        const sql = `
            UPDATE countries 
            SET ${sets.join(', ')}
            WHERE id = ?
        `;
        
        await query(sql, values);
        return await this.findById(id);
    },

    // Soft delete country
    async softDelete(id) {
        const sql = `UPDATE countries SET is_active = 0 WHERE id = ?`;
        return await query(sql, [id]);
    },

    // Permanently delete country (use with caution)
    async hardDelete(id) {
        // Check if any packages are using this country
        const checkPackages = `SELECT COUNT(*) as count FROM packages WHERE country_id = ?`;
        const [packageResult] = await query(checkPackages, [id]);
        
        if (packageResult.count > 0) {
            throw new Error('Cannot delete country with existing packages. Archive it instead.');
        }
        
        // Check if any blogs are using this country
        const checkBlogs = `SELECT COUNT(*) as count FROM blogs WHERE country_id = ?`;
        const [blogResult] = await query(checkBlogs, [id]);
        
        if (blogResult.count > 0) {
            throw new Error('Cannot delete country with existing blogs. Archive it instead.');
        }
        
        const sql = `DELETE FROM countries WHERE id = ?`;
        return await query(sql, [id]);
    },

    // Search countries
    async search(searchTerm, { isActive = true, limit = 10 } = {}) {
        const term = `%${searchTerm}%`;
        
        let sql = `
            SELECT id, name, slug, featured_image, description,
                   meta_title, meta_description, is_active
            FROM countries
            WHERE (name LIKE ? OR description LIKE ?)
        `;
        
        const params = [term, term];
        
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

    // Get stats for dashboard
    async getStats() {
        const sql = `
            SELECT 
                COUNT(*) as total_countries,
                SUM(CASE WHEN is_active = 1 THEN 1 ELSE 0 END) as active_countries,
                (
                    SELECT COUNT(DISTINCT country_id) 
                    FROM packages 
                    WHERE country_id IS NOT NULL
                ) as countries_with_packages,
                (
                    SELECT COUNT(DISTINCT country_id) 
                    FROM blogs 
                    WHERE country_id IS NOT NULL AND is_published = 1
                ) as countries_with_blogs
            FROM countries
        `;
        
        const [stats] = await query(sql);
        
        // Get most popular country (by packages)
        const popularSql = `
            SELECT c.name, COUNT(p.id) as package_count
            FROM countries c
            LEFT JOIN packages p ON c.id = p.country_id
            WHERE c.is_active = 1
            GROUP BY c.id
            ORDER BY package_count DESC
            LIMIT 1
        `;
        
        const [popular] = await query(popularSql);
        
        return {
            ...stats,
            most_popular_country: popular || null
        };
    },

    // Bulk update country status
    async bulkUpdateStatus(ids, isActive) {
        if (!ids || ids.length === 0) return null;
        
        const placeholders = ids.map(() => '?').join(',');
        const sql = `
            UPDATE countries 
            SET is_active = ? 
            WHERE id IN (${placeholders})
        `;
        
        return await query(sql, [isActive ? 1 : 0, ...ids]);
    },

    // Get countries with featured status from country_activities
    async getCountriesWithFeaturedActivities() {
        const sql = `
            SELECT DISTINCT
                c.id, c.name, c.slug, c.featured_image,
                (
                    SELECT COUNT(*) 
                    FROM country_activities ca 
                    WHERE ca.country_id = c.id AND ca.is_featured = 1
                ) as featured_activities_count
            FROM countries c
            WHERE c.is_active = 1
            ORDER BY featured_activities_count DESC, c.name
        `;
        
        return await query(sql);
    }
};