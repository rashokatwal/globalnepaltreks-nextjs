// src/lib/db/queries/packages.js
import { query, transaction } from '../index.js';

export const PackageQueries = {
    // Get all packages with filters
    // In src/lib/db/queries/packages.js

    // src/lib/db/queries/packages.js

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
        
        // Add filters
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
        
        // NEW: Price range filters
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
        
        // NEW: Max duration filter
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
        
        // NEW: Sorting
        switch(sort) {
            case 'price_asc':
                sql += ` ORDER BY p.price ASC`;
                break;
            case 'price_desc':
                sql += ` ORDER BY p.price DESC`;
                break;
            case 'duration_asc':
                sql += ` ORDER BY p.duration_days ASC`;
                break;
            case 'duration_desc':
                sql += ` ORDER BY p.duration_days DESC`;
                break;
            case 'newest':
                sql += ` ORDER BY p.created_at DESC`;
                break;
            case 'featured':
            default:
                sql += ` ORDER BY p.is_featured DESC, p.created_at DESC`;
                break;
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
            return {
                packages: [],
                pagination: {
                    total: 0,
                    page,
                    limit,
                    totalPages: 0
                }
            };
        }
    },

    // Get package by slug
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

    // Get package by ID
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

    // Get packages by country
    async findByCountry(countryId, { page = 1, limit = 10, featured = null } = {}) {
        return await this.findAll({ 
            countryId, 
            page, 
            limit, 
            featured 
        });
    },

    // Get packages by activity
    async findByActivity(activityId, { page = 1, limit = 10, featured = null } = {}) {
        return await this.findAll({ 
            activityId, 
            page, 
            limit, 
            featured 
        });
    },

    // Get featured packages
    async getFeatured(limit = 6) {
        const sql = `
            SELECT p.*, 
                   c.name as country_name, c.slug as country_slug,
                   a.name as activity_name, a.slug as activity_slug
            FROM packages p
            LEFT JOIN countries c ON p.country_id = c.id
            LEFT JOIN activities a ON p.activity_id = a.id
            WHERE p.is_active = 1 AND p.is_featured = 1
            ORDER BY p.created_at DESC
            LIMIT ?
        `;
        
        return await query(sql, [limit]);
    },

    // Get package with full details (itinerary, features, etc.)
    async getFullDetails(packageId) {
        const pkg = await this.findById(packageId);
        
        if (!pkg) return null;
        
        // Get itinerary
        const itinerarySql = `
            SELECT * FROM package_itinerary 
            WHERE package_id = ? 
            ORDER BY day_number
        `;
        
        // Get features (inclusions/exclusions)
        const featuresSql = `
            SELECT * FROM package_features 
            WHERE package_id = ?
            ORDER BY feature_type, sort_order
        `;
        
        // Get essential info
        const essentialInfoSql = `
            SELECT * FROM package_essential_info 
            WHERE package_id = ?
        `;
        
        // Get FAQs
        const faqsSql = `
            SELECT * FROM package_faqs 
            WHERE package_id = ? AND is_active = 1
            ORDER BY sort_order
        `;
        
        // Get available dates
        const datesSql = `
            SELECT * FROM package_dates 
            WHERE package_id = ? AND start_date > NOW() AND status IN ('available', 'limited')
            ORDER BY start_date
            LIMIT 10
        `;
        
        // Get reviews
        const reviewsSql = `
            SELECT * FROM package_reviews 
            WHERE package_id = ? AND is_approved = 1
            ORDER BY created_at DESC
            LIMIT 10
        `;
        
        // Get gallery
        const gallerySql = `
            SELECT * FROM package_gallery 
            WHERE package_id = ?
            ORDER BY sort_order
        `;
        
        const [
            itinerary,
            features,
            essentialInfo,
            faqs,
            dates,
            reviews,
            gallery
        ] = await Promise.all([
            query(itinerarySql, [packageId]),
            query(featuresSql, [packageId]),
            query(essentialInfoSql, [packageId]),
            query(faqsSql, [packageId]),
            query(datesSql, [packageId]),
            query(reviewsSql, [packageId]),
            query(gallerySql, [packageId])
        ]);
        
        return {
            ...pkg,
            itinerary: itinerary || [],
            features: features || [],
            essential_info: essentialInfo[0] || null,
            faqs: faqs || [],
            available_dates: dates || [],
            reviews: reviews || [],
            gallery: gallery || [],
            stats: {
                total_reviews: reviews?.length || 0,
                average_rating: calculateAverageRating(reviews)
            }
        };
    },

    // Search packages
    async search(searchTerm, { 
        page = 1, 
        limit = 10, 
        countryId = null, 
        activityId = null,
        minPrice = null,
        maxPrice = null,
        maxDuration = null,
        sort = 'featured'
    } = {}) {
        return await this.findAll({ 
            search: searchTerm,
            countryId,
            activityId,
            minPrice,
            maxPrice,
            maxDuration,
            sort,
            page, 
            limit 
        });
    },

   // In src/lib/db/queries/packages.js

    async create(packageData) {
        return transaction(async (connection) => {
            // Helper function to convert numbers to strings
            const toSafeParam = (value) => {
                if (value === null || value === undefined) return null;
                if (typeof value === 'number') return String(value);
                return value;
            };
            
            // Stringify JSON fields
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
                    is_featured, is_active
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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
                toSafeParam(packageData.is_active !== undefined ? (packageData.is_active ? 1 : 0) : 1)
            ];
            
            const result = await connection.execute(sql, params);
            const packageId = result[0].insertId;
            
            return { id: packageId, ...packageData };
        });
    },
    // Update package
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
                'is_featured', 'is_active'
            ];
            
            allowedFields.forEach(field => {
                if (packageData[field] !== undefined) {
                    if (field === 'gallery' && Array.isArray(packageData[field])) {
                        sets.push(`${field} = ?`);
                        values.push(JSON.stringify(packageData[field]));
                    } else {
                        sets.push(`${field} = ?`);
                        values.push(packageData[field]);
                    }
                }
            });
            
            if (sets.length === 0) return null;
            
            values.push(id);
            
            const sql = `
                UPDATE packages 
                SET ${sets.join(', ')} 
                WHERE id = ?
            `;
            
            await connection.execute(sql, values);
            return await this.findById(id);
        });
    },

    // Soft delete package
    async softDelete(id) {
        const sql = `UPDATE packages SET is_active = 0 WHERE id = ?`;
        return await query(sql, [id]);
    },

    // Permanently delete package
    async hardDelete(id) {
        return transaction(async (connection) => {
            // Delete related data first (foreign keys will cascade if set up)
            await connection.execute('DELETE FROM package_itinerary WHERE package_id = ?', [id]);
            await connection.execute('DELETE FROM package_features WHERE package_id = ?', [id]);
            await connection.execute('DELETE FROM package_essential_info WHERE package_id = ?', [id]);
            await connection.execute('DELETE FROM package_faqs WHERE package_id = ?', [id]);
            await connection.execute('DELETE FROM package_dates WHERE package_id = ?', [id]);
            await connection.execute('DELETE FROM package_reviews WHERE package_id = ?', [id]);
            await connection.execute('DELETE FROM package_gallery WHERE package_id = ?', [id]);
            
            // Delete package
            const sql = `DELETE FROM packages WHERE id = ?`;
            await connection.execute(sql, [id]);
            
            return { success: true };
        });
    },

    // Get packages stats
    async getStats() {
        const sql = `
            SELECT 
                COUNT(*) as total_packages,
                SUM(CASE WHEN is_active = 1 THEN 1 ELSE 0 END) as active_packages,
                SUM(CASE WHEN is_featured = 1 THEN 1 ELSE 0 END) as featured_packages,
                AVG(price) as average_price,
                MIN(price) as min_price,
                MAX(price) as max_price,
                AVG(duration_days) as average_duration,
                COUNT(DISTINCT country_id) as countries_covered,
                COUNT(DISTINCT activity_id) as activities_covered
            FROM packages
        `;
        
        const [stats] = await query(sql);
        
        // Get most popular package
        const popularSql = `
            SELECT title, slug, views_count
            FROM packages
            WHERE is_active = 1
            ORDER BY views_count DESC
            LIMIT 1
        `;
        
        const [popular] = await query(popularSql);
        
        return {
            ...stats,
            most_popular: popular || null
        };
    },

    // Bulk update status
    async bulkUpdateStatus(ids, isActive) {
        if (!ids || ids.length === 0) return null;
        
        const placeholders = ids.map(() => '?').join(',');
        const sql = `
            UPDATE packages 
            SET is_active = ? 
            WHERE id IN (${placeholders})
        `;
        
        return await query(sql, [isActive ? 1 : 0, ...ids]);
    },

    // Increment view count
    async incrementViews(id) {
        const sql = `UPDATE packages SET views_count = views_count + 1 WHERE id = ?`;
        return await query(sql, [id]);
    },

    // Get related packages
    async getRelated(packageId, countryId, activityId, limit = 3) {
        const sql = `
            SELECT p.*, 
                   c.name as country_name, c.slug as country_slug,
                   a.name as activity_name, a.slug as activity_slug
            FROM packages p
            LEFT JOIN countries c ON p.country_id = c.id
            LEFT JOIN activities a ON p.activity_id = a.id
            WHERE p.id != ? 
                AND p.is_active = 1
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
            packageId, countryId, activityId,
            countryId, activityId,
            countryId,
            activityId,
            limit
        ]);
    }
};

// Helper function to calculate average rating
function calculateAverageRating(reviews) {
    if (!reviews || reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return (sum / reviews.length).toFixed(1);
}