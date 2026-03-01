// src/lib/db/queries/countryActivities.js
import { query } from '../index.js';

export const CountryActivityQueries = {
    // Get all activities for a country
    async getActivitiesByCountry(countryId, { onlyFeatured = false } = {}) {
        let sql = `
            SELECT 
                a.id, a.name, a.slug, a.activity_category,
                a.activity_color, a.image, a.excerpt,
                ca.is_featured, ca.display_order
            FROM activities a
            JOIN country_activities ca ON a.id = ca.activity_id
            WHERE ca.country_id = ? AND a.is_active = 1
        `;
        
        if (onlyFeatured) {
            sql += ` AND ca.is_featured = 1`;
        }
        
        sql += ` ORDER BY ca.display_order`;
        
        return await query(sql, [countryId]);
    },
    
    // Get all countries for an activity
    async getCountriesByActivity(activityId) {
        const sql = `
            SELECT 
                c.id, c.name, c.slug, c.featured_image,
                ca.is_featured, ca.display_order
            FROM countries c
            JOIN country_activities ca ON c.id = ca.country_id
            WHERE ca.activity_id = ? AND c.is_active = 1
            ORDER BY ca.display_order
        `;
        
        return await query(sql, [activityId]);
    },
    
    // Add activity to country
    async addActivityToCountry(countryId, activityId, isFeatured = false, displayOrder = 0) {
        const sql = `
            INSERT INTO country_activities 
            (country_id, activity_id, is_featured, display_order)
            VALUES (?, ?, ?, ?)
        `;
        
        return await query(sql, [countryId, activityId, isFeatured, displayOrder]);
    },
    
    // Remove activity from country
    async removeActivityFromCountry(countryId, activityId) {
        const sql = `
            DELETE FROM country_activities 
            WHERE country_id = ? AND activity_id = ?
        `;
        
        return await query(sql, [countryId, activityId]);
    },
    
    // Update activity status in country
    async updateActivityStatus(countryId, activityId, updates) {
        const sets = [];
        const values = [];
        
        if (updates.is_featured !== undefined) {
            sets.push('is_featured = ?');
            values.push(updates.is_featured ? 1 : 0);
        }
        
        if (updates.display_order !== undefined) {
            sets.push('display_order = ?');
            values.push(updates.display_order);
        }
        
        if (sets.length === 0) return null;
        
        values.push(countryId, activityId);
        
        const sql = `
            UPDATE country_activities 
            SET ${sets.join(', ')}
            WHERE country_id = ? AND activity_id = ?
        `;
        
        return await query(sql, values);
    },
    
    // Get featured combinations for homepage
    async getFeaturedCombinations() {
        const sql = `
            SELECT 
                c.name as country_name,
                c.slug as country_slug,
                a.name as activity_name,
                a.slug as activity_slug,
                a.activity_color,
                a.image,
                a.excerpt
            FROM country_activities ca
            JOIN countries c ON ca.country_id = c.id
            JOIN activities a ON ca.activity_id = a.id
            WHERE ca.is_featured = 1 
                AND c.is_active = 1 
                AND a.is_active = 1
            ORDER BY c.name, ca.display_order
        `;
        
        return await query(sql);
    }
};