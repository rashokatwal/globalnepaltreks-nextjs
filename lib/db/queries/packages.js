// src/lib/db/queries/packages.js
import { query, transaction } from '../index.js';

export const PackageQueries = {
    // ---------- MAIN PACKAGE CRUD ----------
    async findAll({ 
        page = 1, 
        limit = 10, 
        countryId = null, 
        activityId = null, 
        difficulty = null, 
        search = null,
        minPrice = null,
        maxPrice = null,
        maxDuration = null,
        sort = 'featured',
        isActive = true 
    } = {}) {
        const offset = (page - 1) * limit;
        const params = [];
        const countParams = [];
        
        let sql = `
            SELECT p.*, 
                c.name as country_name, c.slug as country_slug,
                a.name as activity_name, a.slug as activity_slug
            FROM packages p
            LEFT JOIN countries c ON p.country_id = c.id
            LEFT JOIN activities a ON p.activity_id = a.id
            WHERE p.is_active = ?
        `;
        
        let countSql = `SELECT COUNT(*) as total FROM packages p WHERE p.is_active = ?`;
        
        params.push(isActive ? 1 : 0);
        countParams.push(isActive ? 1 : 0);
        
        if (countryId) {
            sql += ` AND p.country_id = ?`;
            countSql += ` AND p.country_id = ?`;
            params.push(countryId);
            countParams.push(countryId);
        }
        
        if (activityId) {
            sql += ` AND p.activity_id = ?`;
            countSql += ` AND p.activity_id = ?`;
            params.push(activityId);
            countParams.push(activityId);
        }
        
        if (difficulty) {
            sql += ` AND p.difficulty = ?`;
            countSql += ` AND p.difficulty = ?`;
            params.push(difficulty);
            countParams.push(difficulty);
        }
        
        if (minPrice !== null) {
            sql += ` AND p.price >= ?`;
            countSql += ` AND p.price >= ?`;
            params.push(minPrice);
            countParams.push(minPrice);
        }
        
        if (maxPrice !== null) {
            sql += ` AND p.price <= ?`;
            countSql += ` AND p.price <= ?`;
            params.push(maxPrice);
            countParams.push(maxPrice);
        }
        
        if (maxDuration !== null) {
            sql += ` AND p.duration_days <= ?`;
            countSql += ` AND p.duration_days <= ?`;
            params.push(maxDuration);
            countParams.push(maxDuration);
        }
        
        if (search) {
            sql += ` AND (p.title LIKE ? OR p.short_description LIKE ? OR p.overview LIKE ?)`;
            countSql += ` AND (p.title LIKE ? OR p.short_description LIKE ? OR p.overview LIKE ?)`;
            const searchTerm = `%${search}%`;
            params.push(searchTerm, searchTerm, searchTerm);
            countParams.push(searchTerm, searchTerm, searchTerm);
        }
        
        switch(sort) {
            case 'price_asc': sql += ` ORDER BY p.price ASC`; break;
            case 'price_desc': sql += ` ORDER BY p.price DESC`; break;
            case 'duration_asc': sql += ` ORDER BY p.duration_days ASC`; break;
            case 'duration_desc': sql += ` ORDER BY p.duration_days DESC`; break;
            case 'newest': sql += ` ORDER BY p.created_at DESC`; break;
            default: sql += ` ORDER BY p.is_featured DESC, p.created_at DESC`; break;
        }
        
        sql += ` LIMIT ? OFFSET ?`;
        params.push(limit, offset);
        
        try {
            const [countResult] = await query(countSql, countParams);
            const packages = await query(sql, params);
            return {
                packages: packages || [],
                pagination: {
                    total: countResult?.total || 0,
                    page,
                    limit,
                    totalPages: Math.ceil((countResult?.total || 0) / limit)
                }
            };
        } catch (error) {
            console.error('Error in findAll:', error);
            return { packages: [], pagination: { total: 0, page, limit, totalPages: 0 } };
        }
    },

    async findBySlug(slug) {
        const sql = `
            SELECT p.*, 
                   c.name as country_name, c.slug as country_slug,
                   a.name as activity_name, a.slug as activity_slug
            FROM packages p
            LEFT JOIN countries c ON p.country_id = c.id
            LEFT JOIN activities a ON p.activity_id = a.id
            WHERE p.slug = ? AND p.is_active = 1
        `;
        const results = await query(sql, [slug]);
        return results[0] || null;
    },

    async findById(id) {
        const sql = `
            SELECT p.*, 
                   c.name as country_name, c.slug as country_slug,
                   a.name as activity_name, a.slug as activity_slug
            FROM packages p
            LEFT JOIN countries c ON p.country_id = c.id
            LEFT JOIN activities a ON p.activity_id = a.id
            WHERE p.id = ?
        `;
        const results = await query(sql, [id]);
        return results[0] || null;
    },

    // ---------- HOME PAGE SECTION QUERIES ----------
    async getFeatured(limit = 6) {
        const sql = `
            SELECT p.*, c.name as country_name, c.slug as country_slug,
                   a.name as activity_name, a.slug as activity_slug
            FROM packages p
            LEFT JOIN countries c ON p.country_id = c.id
            LEFT JOIN activities a ON p.activity_id = a.id
            WHERE p.is_active = 1 AND p.is_featured = 1
            ORDER BY p.created_at DESC LIMIT ?
        `;
        return await query(sql, [limit]);
    },

    async getBestSelling(limit = 6) {
        const sql = `
            SELECT p.*, c.name as country_name, c.slug as country_slug,
                   a.name as activity_name, a.slug as activity_slug
            FROM packages p
            LEFT JOIN countries c ON p.country_id = c.id
            LEFT JOIN activities a ON p.activity_id = a.id
            WHERE p.is_active = 1 AND p.is_best_selling = 1
            ORDER BY p.created_at DESC LIMIT ?
        `;
        return await query(sql, [limit]);
    },

    async getLuxury(limit = 6) {
        const sql = `
            SELECT p.*, c.name as country_name, c.slug as country_slug,
                   a.name as activity_name, a.slug as activity_slug
            FROM packages p
            LEFT JOIN countries c ON p.country_id = c.id
            LEFT JOIN activities a ON p.activity_id = a.id
            WHERE p.is_active = 1 AND p.is_luxury = 1
            ORDER BY p.created_at DESC LIMIT ?
        `;
        return await query(sql, [limit]);
    },

    async getAdventure(limit = 6) {
        const sql = `
            SELECT p.*, c.name as country_name, c.slug as country_slug,
                   a.name as activity_name, a.slug as activity_slug
            FROM packages p
            LEFT JOIN countries c ON p.country_id = c.id
            LEFT JOIN activities a ON p.activity_id = a.id
            WHERE p.is_active = 1 AND p.is_adventure = 1
            ORDER BY p.created_at DESC LIMIT ?
        `;
        return await query(sql, [limit]);
    },

    // ---------- FULL DETAILS (with relations) ----------
    async getFullDetails(packageId) {
        const pkg = await this.findById(packageId);
        if (!pkg) return null;
        
        const [itinerary, features, faqs, gallery, documents] = await Promise.all([
            query('SELECT * FROM package_itinerary WHERE package_id = ? ORDER BY day_number', [packageId]),
            query('SELECT * FROM package_features WHERE package_id = ? ORDER BY feature_type, sort_order', [packageId]),
            query('SELECT * FROM package_faqs WHERE package_id = ? AND is_active = 1 ORDER BY sort_order', [packageId]),
            query('SELECT * FROM package_gallery WHERE package_id = ? ORDER BY sort_order', [packageId]),
            query('SELECT * FROM package_documents WHERE package_id = ? ORDER BY sort_order', [packageId])
        ]);
        
        let available_dates = [];
        if (pkg.available_dates) {
            try {
                available_dates = typeof pkg.available_dates === 'string' 
                    ? JSON.parse(pkg.available_dates) 
                    : pkg.available_dates;
            } catch(e) { available_dates = []; }
        }
        
        return {
            ...pkg,
            itinerary: itinerary || [],
            features: features || [],
            faqs: faqs || [],
            gallery: gallery || [],
            documents: documents || [],
            available_dates
        };
    },

    // ---------- CREATE PACKAGE (with relations) ----------
    async create(packageData) {
        return transaction(async (connection) => {
            const toSafeParam = (value) => {
                if (value === null || value === undefined) return null;
                if (typeof value === 'number') return String(value);
                return value;
            };
            
            const gallery = packageData.gallery ? 
                (typeof packageData.gallery === 'string' ? 
                    packageData.gallery : JSON.stringify(packageData.gallery)) : null;
            
            const sql = `
                INSERT INTO packages (
                    country_id, activity_id, title, slug, short_description,
                    duration_days, price, difficulty, max_altitude,
                    group_size_min, group_size_max, best_season,
                    overview, highlights, featured_image, gallery,
                    map_image, meta_title, meta_description, keywords,
                    is_featured, is_active, is_best_selling, is_luxury, is_adventure,
                    essential_info
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `;
            
            const params = [
                toSafeParam(packageData.country_id),
                toSafeParam(packageData.activity_id),
                packageData.title,
                packageData.slug,
                packageData.short_description || null,
                toSafeParam(packageData.duration_days),
                toSafeParam(packageData.price),
                packageData.difficulty || 'moderate',
                toSafeParam(packageData.max_altitude),
                toSafeParam(packageData.group_size_min || 1),
                toSafeParam(packageData.group_size_max),
                packageData.best_season || null,
                packageData.overview || null,
                packageData.highlights || null,
                packageData.featured_image || null,
                gallery,
                packageData.map_image || null,
                packageData.meta_title || packageData.title,
                packageData.meta_description || packageData.short_description || `Book ${packageData.title} with expert guides.`,
                packageData.keywords || null,
                toSafeParam(packageData.is_featured ? 1 : 0),
                toSafeParam(packageData.is_active !== undefined ? (packageData.is_active ? 1 : 0) : 1),
                toSafeParam(packageData.is_best_selling ? 1 : 0),
                toSafeParam(packageData.is_luxury ? 1 : 0),
                toSafeParam(packageData.is_adventure ? 1 : 0),
                packageData.essential_info || null
            ];
            
            const result = await connection.execute(sql, params);
            const packageId = result[0].insertId;
            
            // Insert related data
            if (packageData.itinerary && Array.isArray(packageData.itinerary))
                await this.addItinerary(packageId, packageData.itinerary, connection);
            if (packageData.features && Array.isArray(packageData.features))
                await this.addFeatures(packageId, packageData.features, connection);
            if (packageData.faqs && Array.isArray(packageData.faqs))
                await this.addFAQs(packageId, packageData.faqs, connection);
            if (packageData.gallery_images && Array.isArray(packageData.gallery_images))
                await this.addGallery(packageId, packageData.gallery_images, connection);
            if (packageData.documents && Array.isArray(packageData.documents))
                await this.addDocuments(packageId, packageData.documents, connection);
            if (packageData.available_dates && Array.isArray(packageData.available_dates))
                await connection.execute('UPDATE packages SET available_dates = ? WHERE id = ?', [JSON.stringify(packageData.available_dates), packageId]);
            
            return { id: packageId, ...packageData };
        });
    },

    // ---------- UPDATE PACKAGE (with relations) ----------
    async update(id, packageData) {
        return transaction(async (connection) => {
            const sets = [];
            const values = [];
            
            const allowedFields = [
                'country_id', 'activity_id', 'title', 'slug', 'short_description',
                'duration_days', 'price', 'difficulty', 'max_altitude',
                'group_size_min', 'group_size_max', 'best_season',
                'overview', 'highlights', 'featured_image', 'gallery',
                'map_image', 'meta_title', 'meta_description', 'keywords',
                'is_featured', 'is_active', 'is_best_selling', 'is_luxury', 'is_adventure',
                'essential_info'
            ];
            
            allowedFields.forEach(field => {
                if (packageData[field] !== undefined) {
                    if (field === 'gallery' && Array.isArray(packageData[field])) {
                        sets.push(`${field} = ?`);
                        values.push(JSON.stringify(packageData[field]));
                    } else if (field === 'is_active' || field === 'is_featured' || field === 'is_best_selling' || field === 'is_luxury' || field === 'is_adventure') {
                        sets.push(`${field} = ?`);
                        values.push(packageData[field] ? 1 : 0);
                    } else {
                        sets.push(`${field} = ?`);
                        values.push(packageData[field]);
                    }
                }
            });
            
            if (packageData.available_dates && Array.isArray(packageData.available_dates)) {
                sets.push(`available_dates = ?`);
                values.push(JSON.stringify(packageData.available_dates));
            }
            
            if (sets.length > 0) {
                values.push(id);
                await connection.execute(`UPDATE packages SET ${sets.join(', ')} WHERE id = ?`, values);
            }
            
            // Replace related data if provided
            if (packageData.itinerary !== undefined)
                await this.addItinerary(id, packageData.itinerary || [], connection);
            if (packageData.features !== undefined)
                await this.addFeatures(id, packageData.features || [], connection);
            if (packageData.faqs !== undefined)
                await this.addFAQs(id, packageData.faqs || [], connection);
            if (packageData.gallery_images !== undefined)
                await this.addGallery(id, packageData.gallery_images || [], connection);
            if (packageData.documents !== undefined)
                await this.addDocuments(id, packageData.documents || [], connection);
            
            return await this.findById(id);
        });
    },

    // ---------- HELPER METHODS FOR RELATED DATA (replace strategy) ----------
    async addItinerary(packageId, items, connection = null) {
        const conn = connection || { execute: (...args) => query(...args) };
        if (!items || !Array.isArray(items)) return;
        await conn.execute('DELETE FROM package_itinerary WHERE package_id = ?', [packageId]);
        for (let i = 0; i < items.length; i++) {
            const { day_number, title, description, altitude, trekking_hours, distance_km, accommodation, meal_info, day_image } = items[i];
            await conn.execute(
                `INSERT INTO package_itinerary 
                 (package_id, day_number, title, description, altitude, trekking_hours, distance_km, accommodation, meal_info, day_image)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [packageId, day_number, title, description, altitude, trekking_hours, distance_km, accommodation, meal_info, day_image]
            );
        }
    },

    async addFeatures(packageId, features, connection = null) {
        const conn = connection || { execute: (...args) => query(...args) };
        if (!features || !Array.isArray(features)) return;
        await conn.execute('DELETE FROM package_features WHERE package_id = ?', [packageId]);
        for (let i = 0; i < features.length; i++) {
            const { feature_type, description } = features[i];
            const sort_order = features[i].sort_order !== undefined ? features[i].sort_order : i + 1;
            await conn.execute(
                `INSERT INTO package_features (package_id, feature_type, description, sort_order)
                 VALUES (?, ?, ?, ?)`,
                [packageId, feature_type, description, sort_order]
            );
        }
    },

    async addFAQs(packageId, faqs, connection = null) {
        const conn = connection || { execute: (...args) => query(...args) };
        if (!faqs || !Array.isArray(faqs)) return;
        await conn.execute('DELETE FROM package_faqs WHERE package_id = ?', [packageId]);
        for (let i = 0; i < faqs.length; i++) {
            const { question, answer } = faqs[i];
            const sort_order = faqs[i].sort_order !== undefined ? faqs[i].sort_order : i + 1;
            await conn.execute(
                `INSERT INTO package_faqs (package_id, question, answer, sort_order, is_active)
                 VALUES (?, ?, ?, ?, 1)`,
                [packageId, question, answer, sort_order]
            );
        }
    },

    async addGallery(packageId, images, connection = null) {
        const conn = connection || { execute: (...args) => query(...args) };
        if (!images || !Array.isArray(images)) return;
        await conn.execute('DELETE FROM package_gallery WHERE package_id = ?', [packageId]);
        for (let i = 0; i < images.length; i++) {
            const { image_url, title } = images[i];
            const sort_order = images[i].sort_order !== undefined ? images[i].sort_order : i + 1;
            await conn.execute(
                `INSERT INTO package_gallery (package_id, image_url, title, sort_order)
                 VALUES (?, ?, ?, ?)`,
                [packageId, image_url, title, sort_order]
            );
        }
    },

    async addDocuments(packageId, documents, connection = null) {
        const conn = connection || { execute: (...args) => query(...args) };
        if (!documents || !Array.isArray(documents)) return;
        await conn.execute('DELETE FROM package_documents WHERE package_id = ?', [packageId]);
        for (let i = 0; i < documents.length; i++) {
            const { title, file_url } = documents[i];
            const sort_order = documents[i].sort_order !== undefined ? documents[i].sort_order : i + 1;
            await conn.execute(
                `INSERT INTO package_documents (package_id, title, file_url, sort_order)
                 VALUES (?, ?, ?, ?)`,
                [packageId, title, file_url, sort_order]
            );
        }
    },

    // ---------- DELETE & UTILITIES ----------
    async softDelete(id) {
        return await query('UPDATE packages SET is_active = 0 WHERE id = ?', [id]);
    },

    async hardDelete(id) {
        return transaction(async (connection) => {
            await connection.execute('DELETE FROM package_itinerary WHERE package_id = ?', [id]);
            await connection.execute('DELETE FROM package_features WHERE package_id = ?', [id]);
            await connection.execute('DELETE FROM package_faqs WHERE package_id = ?', [id]);
            await connection.execute('DELETE FROM package_gallery WHERE package_id = ?', [id]);
            await connection.execute('DELETE FROM package_documents WHERE package_id = ?', [id]);
            await connection.execute('DELETE FROM packages WHERE id = ?', [id]);
            return { success: true };
        });
    },

    async incrementViews(id) {
        return await query('UPDATE packages SET views_count = views_count + 1 WHERE id = ?', [id]);
    },

    async getStats() {
        const [stats] = await query(`
            SELECT 
                COUNT(*) as total_packages,
                SUM(CASE WHEN is_active = 1 THEN 1 ELSE 0 END) as active_packages,
                SUM(CASE WHEN is_featured = 1 THEN 1 ELSE 0 END) as featured_packages,
                SUM(CASE WHEN is_best_selling = 1 THEN 1 ELSE 0 END) as best_selling_packages,
                SUM(CASE WHEN is_luxury = 1 THEN 1 ELSE 0 END) as luxury_packages,
                SUM(CASE WHEN is_adventure = 1 THEN 1 ELSE 0 END) as adventure_packages,
                AVG(price) as average_price,
                MIN(price) as min_price,
                MAX(price) as max_price,
                AVG(duration_days) as average_duration,
                COUNT(DISTINCT country_id) as countries_covered,
                COUNT(DISTINCT activity_id) as activities_covered
            FROM packages
        `);
        const [popular] = await query(`
            SELECT title, slug, views_count
            FROM packages WHERE is_active = 1 ORDER BY views_count DESC LIMIT 1
        `);
        return { ...stats, most_popular: popular || null };
    },

    async bulkUpdateStatus(ids, isActive) {
        if (!ids || ids.length === 0) return null;
        const placeholders = ids.map(() => '?').join(',');
        return await query(`UPDATE packages SET is_active = ? WHERE id IN (${placeholders})`, [isActive ? 1 : 0, ...ids]);
    },

    async getRelated(packageId, countryId, activityId, limit = 3) {
        const sql = `
            SELECT p.*, c.name as country_name, c.slug as country_slug,
                   a.name as activity_name, a.slug as activity_slug
            FROM packages p
            LEFT JOIN countries c ON p.country_id = c.id
            LEFT JOIN activities a ON p.activity_id = a.id
            WHERE p.id != ? AND p.is_active = 1
              AND (p.country_id = ? OR p.activity_id = ?)
            ORDER BY 
                CASE 
                    WHEN p.country_id = ? AND p.activity_id = ? THEN 1
                    WHEN p.country_id = ? THEN 2
                    WHEN p.activity_id = ? THEN 3
                    ELSE 4
                END,
                p.created_at DESC
            LIMIT ?
        `;
        return await query(sql, [packageId, countryId, activityId, countryId, activityId, countryId, activityId, limit]);
    }
};