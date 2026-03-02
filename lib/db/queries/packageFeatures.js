// src/lib/db/queries/packageFeatures.js
import { query } from '../index.js';

export const PackageFeatureQueries = {
    // Get all features for a package
    async getByPackageId(packageId) {
        const sql = `
            SELECT * FROM package_features 
            WHERE package_id = ?
            ORDER BY feature_type, sort_order
        `;
        
        return await query(sql, [packageId]);
    },

    // Add feature to package
    async add(packageId, featureData) {
        const sql = `
            INSERT INTO package_features (
                package_id, feature_type, description, sort_order
            ) VALUES (?, ?, ?, ?)
        `;
        
        const result = await query(sql, [
            packageId,
            featureData.feature_type,
            featureData.description,
            featureData.sort_order || 0
        ]);
        
        return { id: result.insertId, ...featureData };
    },

    // Update feature
    async update(id, featureData) {
        const sets = [];
        const values = [];
        
        ['feature_type', 'description', 'sort_order'].forEach(field => {
            if (featureData[field] !== undefined) {
                sets.push(`${field} = ?`);
                values.push(featureData[field]);
            }
        });
        
        if (sets.length === 0) return null;
        
        values.push(id);
        
        const sql = `
            UPDATE package_features 
            SET ${sets.join(', ')}
            WHERE id = ?
        `;
        
        return await query(sql, values);
    },

    // Delete feature
    async delete(id) {
        const sql = `DELETE FROM package_features WHERE id = ?`;
        return await query(sql, [id]);
    },

    // Delete all features for a package
    async deleteByPackageId(packageId) {
        const sql = `DELETE FROM package_features WHERE package_id = ?`;
        return await query(sql, [packageId]);
    },

    // Get features by type (included/excluded/not_suitable)
    async getByType(packageId, type) {
        const sql = `
            SELECT * FROM package_features 
            WHERE package_id = ? AND feature_type = ?
            ORDER BY sort_order
        `;
        
        return await query(sql, [packageId, type]);
    }
};