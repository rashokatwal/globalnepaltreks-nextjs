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
            params.push(parseInt(countryId));
            countParams.push(parseInt(countryId));
        }
        if (activityId) {
            sql += ` AND p.activity_id = ?`;
            countSql += ` AND p.activity_id = ?`;
            params.push(parseInt(activityId));
            countParams.push(parseInt(activityId));
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
            params.push(parseFloat(minPrice));
            countParams.push(parseFloat(minPrice));
        }
        if (maxPrice !== null) {
            sql += ` AND p.price <= ?`;
            countSql += ` AND p.price <= ?`;
            params.push(parseFloat(maxPrice));
            countParams.push(parseFloat(maxPrice));
        }
        if (maxDuration !== null) {
            sql += ` AND p.duration_days <= ?`;
            countSql += ` AND p.duration_days <= ?`;
            params.push(parseInt(maxDuration));
            countParams.push(parseInt(maxDuration));
        }
        if (search) {
            sql += ` AND (p.title LIKE ? OR p.short_description LIKE ? OR p.overview LIKE ?)`;
            countSql += ` AND (p.title LIKE ? OR p.short_description LIKE ? OR p.overview LIKE ?)`;
            const searchTerm = `%${search}%`;
            params.push(searchTerm, searchTerm, searchTerm);
            countParams.push(searchTerm, searchTerm, searchTerm);
        }
        
        switch(sort) {
            case 'price_asc':     sql += ` ORDER BY p.price ASC`; break;
            case 'price_desc':    sql += ` ORDER BY p.price DESC`; break;
            case 'duration_asc':  sql += ` ORDER BY p.duration_days ASC`; break;
            case 'duration_desc': sql += ` ORDER BY p.duration_days DESC`; break;
            case 'newest':        sql += ` ORDER BY p.created_at DESC`; break;
            default:              sql += ` ORDER BY p.is_featured DESC, p.created_at DESC`; break;
        }
        
        sql += ` LIMIT ? OFFSET ?`;
        params.push(parseInt(limit), parseInt(offset));
        
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
        const results = await query(sql, [parseInt(id)]);
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
        return await query(sql, [parseInt(limit)]);
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
        return await query(sql, [parseInt(limit)]);
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
        return await query(sql, [parseInt(limit)]);
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
        return await query(sql, [parseInt(limit)]);
    },

    // ---------- FULL DETAILS (with all related tables) ----------
    async getFullDetails(packageId) {
        const pkg = await this.findById(packageId);
        if (!pkg) return null;
        
        const [itinerary, features, faqs, gallery, documents, dates, essentialInfo] = await Promise.all([
            query('SELECT * FROM package_itinerary WHERE package_id = ? ORDER BY day_number', [parseInt(packageId)]),
            query('SELECT * FROM package_features WHERE package_id = ? ORDER BY feature_type, sort_order', [parseInt(packageId)]),
            query('SELECT * FROM package_faqs WHERE package_id = ? AND is_active = 1 ORDER BY sort_order', [parseInt(packageId)]),
            query('SELECT * FROM package_gallery WHERE package_id = ? ORDER BY sort_order', [parseInt(packageId)]),
            query('SELECT * FROM package_documents WHERE package_id = ? ORDER BY sort_order', [parseInt(packageId)]),
            query('SELECT * FROM package_dates WHERE package_id = ? ORDER BY start_date', [parseInt(packageId)]),
            query('SELECT * FROM package_essential_info WHERE package_id = ? LIMIT 1', [parseInt(packageId)])
        ]);
        
        return {
            ...pkg,
            itinerary: itinerary || [],
            features: features || [],
            faqs: faqs || [],
            gallery: gallery || [],
            documents: documents || [],
            dates: dates || [],
            essential_info: essentialInfo?.[0] || null
        };
    },

    // ---------- CREATE PACKAGE ----------
    // Only inserts columns that exist in the packages table
    async create(packageData) {
        return transaction(async (connection) => {
            const gallery = packageData.gallery
                ? (typeof packageData.gallery === 'string'
                    ? packageData.gallery
                    : JSON.stringify(packageData.gallery))
                : null;

            // ✅ Exactly 25 columns matching your packages table schema
            const sql = `
                INSERT INTO packages (
                    country_id, activity_id, title, slug, short_description,
                    duration_days, price, difficulty, max_altitude,
                    group_size_min, group_size_max, best_season,
                    overview, highlights, featured_image, gallery,
                    map_image, meta_title, meta_description, keywords,
                    is_featured, is_active, is_best_selling, is_luxury, is_adventure
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `;

            // ✅ 25 params, correct types — no toSafeParam conversion
            const params = [
                parseInt(packageData.country_id),
                parseInt(packageData.activity_id),
                packageData.title,
                packageData.slug,
                packageData.short_description || null,
                parseInt(packageData.duration_days),
                parseFloat(packageData.price),
                packageData.difficulty || 'moderate',
                packageData.max_altitude ? parseInt(packageData.max_altitude) : null,
                parseInt(packageData.group_size_min) || 1,
                packageData.group_size_max ? parseInt(packageData.group_size_max) : null,
                packageData.best_season || null,
                packageData.overview || null,
                packageData.highlights || null,
                packageData.featured_image || null,
                gallery,
                packageData.map_image || null,
                packageData.meta_title || packageData.title,
                packageData.meta_description || packageData.short_description || `Book ${packageData.title} with expert guides.`,
                packageData.keywords || null,
                packageData.is_featured ? 1 : 0,
                packageData.is_active !== undefined ? (packageData.is_active ? 1 : 0) : 1,
                packageData.is_best_selling ? 1 : 0,
                packageData.is_luxury ? 1 : 0,
                packageData.is_adventure ? 1 : 0,
            ];

            const result = await connection.execute(sql, params);
            const packageId = result[0].insertId;

            // Related tables
            if (packageData.itinerary?.length)
                await this.addItinerary(packageId, packageData.itinerary, connection);
            if (packageData.features?.length)
                await this.addFeatures(packageId, packageData.features, connection);
            if (packageData.faqs?.length)
                await this.addFAQs(packageId, packageData.faqs, connection);
            if (packageData.gallery_images?.length)
                await this.addGallery(packageId, packageData.gallery_images, connection);
            if (packageData.documents?.length)
                await this.addDocuments(packageId, packageData.documents, connection);

            // ✅ Dates go to package_dates table
            if (packageData.available_dates?.length)
                await this.addDates(packageId, packageData.available_dates, connection);

            // ✅ Essential info goes to package_essential_info table
            if (packageData.essential_info)
                await this.addEssentialInfo(packageId, packageData.essential_info, connection);

            return { id: packageId, ...packageData };
        });
    },

    // ---------- UPDATE PACKAGE ----------
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
                'is_featured', 'is_active', 'is_best_selling', 'is_luxury', 'is_adventure'
            ];

            const intFields = ['country_id', 'activity_id', 'duration_days', 'max_altitude', 'group_size_min', 'group_size_max'];
            const floatFields = ['price'];
            const boolFields = ['is_active', 'is_featured', 'is_best_selling', 'is_luxury', 'is_adventure'];

            allowedFields.forEach(field => {
                if (packageData[field] !== undefined) {
                    sets.push(`${field} = ?`);
                    if (field === 'gallery' && Array.isArray(packageData[field])) {
                        values.push(JSON.stringify(packageData[field]));
                    } else if (boolFields.includes(field)) {
                        values.push(packageData[field] ? 1 : 0);
                    } else if (intFields.includes(field)) {
                        values.push(packageData[field] ? parseInt(packageData[field]) : null);
                    } else if (floatFields.includes(field)) {
                        values.push(packageData[field] ? parseFloat(packageData[field]) : null);
                    } else {
                        values.push(packageData[field]);
                    }
                }
            });

            if (sets.length > 0) {
                values.push(parseInt(id));
                await connection.execute(`UPDATE packages SET ${sets.join(', ')} WHERE id = ?`, values);
            }

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
            if (packageData.available_dates !== undefined)
                await this.addDates(id, packageData.available_dates || [], connection);
            if (packageData.essential_info !== undefined)
                await this.addEssentialInfo(id, packageData.essential_info, connection);

            return await this.findById(id);
        });
    },

    // ---------- RELATED DATA HELPERS ----------
    async addItinerary(packageId, items, connection = null) {
        const conn = connection || { execute: (...args) => query(...args) };
        if (!items?.length) return;
        await conn.execute('DELETE FROM package_itinerary WHERE package_id = ?', [parseInt(packageId)]);
        for (let i = 0; i < items.length; i++) {
            const { day_number, title, description, altitude, trekking_hours, distance_km, accommodation, meal_info, day_image } = items[i];
            await conn.execute(
                `INSERT INTO package_itinerary 
                 (package_id, day_number, title, description, altitude, trekking_hours, distance_km, accommodation, meal_info, day_image)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    parseInt(packageId),
                    parseInt(day_number) || i + 1,
                    title || null,
                    description || null,
                    altitude ? parseInt(altitude) : null,
                    trekking_hours || null,
                    distance_km ? parseFloat(distance_km) : null,
                    accommodation || null,
                    meal_info || null,
                    day_image || null
                ]
            );
        }
    },

    async addFeatures(packageId, features, connection = null) {
        const conn = connection || { execute: (...args) => query(...args) };
        if (!features?.length) return;
        await conn.execute('DELETE FROM package_features WHERE package_id = ?', [parseInt(packageId)]);
        for (let i = 0; i < features.length; i++) {
            const { feature_type, description } = features[i];
            const sort_order = features[i].sort_order !== undefined ? parseInt(features[i].sort_order) : i + 1;
            await conn.execute(
                `INSERT INTO package_features (package_id, feature_type, description, sort_order) VALUES (?, ?, ?, ?)`,
                [parseInt(packageId), feature_type, description, sort_order]
            );
        }
    },

    async addFAQs(packageId, faqs, connection = null) {
        const conn = connection || { execute: (...args) => query(...args) };
        if (!faqs?.length) return;
        await conn.execute('DELETE FROM package_faqs WHERE package_id = ?', [parseInt(packageId)]);
        for (let i = 0; i < faqs.length; i++) {
            const { question, answer } = faqs[i];
            const sort_order = faqs[i].sort_order !== undefined ? parseInt(faqs[i].sort_order) : i + 1;
            await conn.execute(
                `INSERT INTO package_faqs (package_id, question, answer, sort_order, is_active) VALUES (?, ?, ?, ?, 1)`,
                [parseInt(packageId), question, answer, sort_order]
            );
        }
    },

    async addGallery(packageId, images, connection = null) {
        const conn = connection || { execute: (...args) => query(...args) };
        if (!images?.length) return;
        await conn.execute('DELETE FROM package_gallery WHERE package_id = ?', [parseInt(packageId)]);
        for (let i = 0; i < images.length; i++) {
            const { image_url, title } = images[i];
            const sort_order = images[i].sort_order !== undefined ? parseInt(images[i].sort_order) : i + 1;
            await conn.execute(
                `INSERT INTO package_gallery (package_id, image_url, title, sort_order) VALUES (?, ?, ?, ?)`,
                [parseInt(packageId), image_url, title || null, sort_order]
            );
        }
    },

    async addDocuments(packageId, documents, connection = null) {
        const conn = connection || { execute: (...args) => query(...args) };
        if (!documents?.length) return;
        await conn.execute('DELETE FROM package_documents WHERE package_id = ?', [parseInt(packageId)]);
        for (let i = 0; i < documents.length; i++) {
            const { title, file_url } = documents[i];
            const sort_order = documents[i].sort_order !== undefined ? parseInt(documents[i].sort_order) : i + 1;
            await conn.execute(
                `INSERT INTO package_documents (package_id, title, file_url, sort_order) VALUES (?, ?, ?, ?)`,
                [parseInt(packageId), title, file_url, sort_order]
            );
        }
    },

    // ✅ Inserts into package_dates table matching your schema exactly
    async addDates(packageId, dates, connection = null) {
        const conn = connection || { execute: (...args) => query(...args) };
        if (!dates) return;
        await conn.execute('DELETE FROM package_dates WHERE package_id = ?', [parseInt(packageId)]);
        if (!dates.length) return;
        for (const date of dates) {
            await conn.execute(
                `INSERT INTO package_dates 
                 (package_id, start_date, end_date, available_slots, total_slots, price_multiplier, is_guaranteed, status)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    parseInt(packageId),
                    date.start_date,
                    date.end_date,
                    parseInt(date.available_slots) || 0,
                    parseInt(date.total_slots) || 0,
                    date.price_multiplier ? parseFloat(date.price_multiplier) : 1.00,
                    date.is_guaranteed ? 1 : 0,
                    date.status || 'available'
                ]
            );
        }
    },

    // ✅ Inserts into package_essential_info table matching your schema exactly
    async addEssentialInfo(packageId, info, connection = null) {
        const conn = connection || { execute: (...args) => query(...args) };
        if (!info) return;
        // Delete existing first (upsert pattern)
        await conn.execute('DELETE FROM package_essential_info WHERE package_id = ?', [parseInt(packageId)]);
        await conn.execute(
            `INSERT INTO package_essential_info (
                package_id, trip_code, trip_type, accommodation_type, meal_included,
                transportation, best_time_description, difficulty_description,
                fitness_requirements, preparation_tips, equipment_list,
                health_considerations, safety_measures, permits_required,
                permit_cost, cultural_etiquette, local_customs
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                parseInt(packageId),
                info.trip_code || null,
                info.trip_type || null,
                info.accommodation_type || null,
                info.meal_included || null,
                info.transportation || null,
                info.best_time_description || null,
                info.difficulty_description || null,
                info.fitness_requirements || null,
                info.preparation_tips || null,
                info.equipment_list || null,
                info.health_considerations || null,
                info.safety_measures || null,
                info.permits_required || null,
                info.permit_cost ? parseFloat(info.permit_cost) : null,
                info.cultural_etiquette || null,
                info.local_customs || null
            ]
        );
    },

    // ---------- DELETE & UTILITIES ----------
    async softDelete(id) {
        return await query('UPDATE packages SET is_active = 0 WHERE id = ?', [parseInt(id)]);
    },

    async hardDelete(id) {
        return transaction(async (connection) => {
            await connection.execute('DELETE FROM package_itinerary WHERE package_id = ?', [parseInt(id)]);
            await connection.execute('DELETE FROM package_features WHERE package_id = ?', [parseInt(id)]);
            await connection.execute('DELETE FROM package_faqs WHERE package_id = ?', [parseInt(id)]);
            await connection.execute('DELETE FROM package_gallery WHERE package_id = ?', [parseInt(id)]);
            await connection.execute('DELETE FROM package_documents WHERE package_id = ?', [parseInt(id)]);
            await connection.execute('DELETE FROM package_dates WHERE package_id = ?', [parseInt(id)]);
            await connection.execute('DELETE FROM package_essential_info WHERE package_id = ?', [parseInt(id)]);
            await connection.execute('DELETE FROM packages WHERE id = ?', [parseInt(id)]);
            return { success: true };
        });
    },

    async incrementViews(id) {
        return await query('UPDATE packages SET views_count = views_count + 1 WHERE id = ?', [parseInt(id)]);
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
        if (!ids?.length) return null;
        const placeholders = ids.map(() => '?').join(',');
        return await query(
            `UPDATE packages SET is_active = ? WHERE id IN (${placeholders})`,
            [isActive ? 1 : 0, ...ids.map(id => parseInt(id))]
        );
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
        return await query(sql, [
            parseInt(packageId),
            parseInt(countryId), parseInt(activityId),
            parseInt(countryId), parseInt(activityId),
            parseInt(countryId), parseInt(activityId),
            parseInt(limit)
        ]);
    }
};