// src/lib/db/queries/blogCategories.js
import { query } from '../index.js';

export const BlogCategoryQueries = {
    // Get all categories with post counts
    async getAllWithCounts() {
        const sql = `
            SELECT 
                bc.id,
                bc.name,
                bc.slug,
                bc.description,
                bc.icon,
                bc.display_order,
                COUNT(bpc.blog_id) as post_count
            FROM blog_categories bc
            LEFT JOIN blog_post_categories bpc ON bc.id = bpc.category_id
            LEFT JOIN blogs b ON bpc.blog_id = b.id AND b.is_published = 1
            WHERE bc.is_active = 1
            GROUP BY bc.id, bc.name, bc.slug, bc.description, bc.icon, bc.display_order
            ORDER BY bc.display_order
        `;
        
        return await query(sql);
    },

    // Get category by slug
    async findBySlug(slug) {
        const sql = `
            SELECT id, name, slug, description, icon, display_order
            FROM blog_categories
            WHERE slug = ? AND is_active = 1
        `;
        
        const results = await query(sql, [slug]);
        return results[0] || null;
    },

    // Get category by ID
    async findById(id) {
        const sql = `
            SELECT id, name, slug, description, icon, display_order
            FROM blog_categories
            WHERE id = ? AND is_active = 1
        `;
        
        const results = await query(sql, [id]);
        return results[0] || null;
    },

    // Get blogs by category slug with pagination
    async getBlogsByCategorySlug(categorySlug, { page = 1, limit = 10 } = {}) {
        const offset = (page - 1) * limit;
        
        // First get the category ID
        const category = await this.findBySlug(categorySlug);
        if (!category) {
            return {
                blogs: [],
                category: null,
                pagination: { total: 0, page, limit, totalPages: 0 }
            };
        }
        
        return await this.getBlogsByCategoryId(category.id, { page, limit, category });
    },

    // Get blogs by category ID with pagination
    async getBlogsByCategoryId(categoryId, { page = 1, limit = 10, category = null } = {}) {
        const offset = (page - 1) * limit;
        
        // Get blogs in this category
        const blogsSql = `
            SELECT 
                b.id, b.country_id, b.activity_id, b.title, b.slug, b.excerpt,
                b.featured_image, b.author, b.reading_time, b.published_at, b.views_count,
                c.name as country_name,
                a.name as activity_name
            FROM blogs b
            JOIN blog_post_categories bpc ON b.id = bpc.blog_id
            LEFT JOIN countries c ON b.country_id = c.id
            LEFT JOIN activities a ON b.activity_id = a.id
            WHERE bpc.category_id = ? AND b.is_published = 1
            ORDER BY b.published_at DESC
            LIMIT ? OFFSET ?
        `;
        
        // Get total count for pagination
        const countSql = `
            SELECT COUNT(*) as total
            FROM blogs b
            JOIN blog_post_categories bpc ON b.id = bpc.blog_id
            WHERE bpc.category_id = ? AND b.is_published = 1
        `;
        
        const [totalResult] = await query(countSql, [categoryId]);
        const blogs = await query(blogsSql, [categoryId, limit, offset]);
        
        // Get category info if not provided
        if (!category) {
            category = await this.findById(categoryId);
        }
        
        return {
            blogs,
            category,
            pagination: {
                total: totalResult?.total || 0,
                page,
                limit,
                totalPages: Math.ceil((totalResult?.total || 0) / limit)
            }
        };
    },

    // Get featured categories (with most posts)
    async getFeaturedCategories(limit = 5) {
        const sql = `
            SELECT 
                bc.id,
                bc.name,
                bc.slug,
                bc.description,
                bc.icon,
                bc.display_order,
                COUNT(bpc.blog_id) as post_count
            FROM blog_categories bc
            LEFT JOIN blog_post_categories bpc ON bc.id = bpc.category_id
            LEFT JOIN blogs b ON bpc.blog_id = b.id AND b.is_published = 1
            WHERE bc.is_active = 1
            GROUP BY bc.id, bc.name, bc.slug, bc.description, bc.icon, bc.display_order
            HAVING post_count > 0
            ORDER BY post_count DESC, bc.display_order
            LIMIT ?
        `;
        
        return await query(sql, [limit]);
    },

    // Get categories for sidebar (with post counts)
    async getSidebarCategories(limit = 10) {
        const sql = `
            SELECT 
                bc.id,
                bc.name,
                bc.slug,
                bc.icon,
                COUNT(bpc.blog_id) as post_count
            FROM blog_categories bc
            LEFT JOIN blog_post_categories bpc ON bc.id = bpc.category_id
            LEFT JOIN blogs b ON bpc.blog_id = b.id AND b.is_published = 1
            WHERE bc.is_active = 1
            GROUP BY bc.id, bc.name, bc.slug, bc.icon
            HAVING post_count > 0
            ORDER BY post_count DESC
            LIMIT ?
        `;
        
        return await query(sql, [limit]);
    },

    // Create new category
    async create(categoryData) {
        const sql = `
            INSERT INTO blog_categories (
                name, slug, description, icon, display_order, is_active
            ) VALUES (?, ?, ?, ?, ?, ?)
        `;
        
        const params = [
            categoryData.name,
            categoryData.slug,
            categoryData.description || null,
            categoryData.icon || null,
            categoryData.display_order || 0,
            categoryData.is_active !== undefined ? (categoryData.is_active ? 1 : 0) : 1
        ];
        
        const result = await query(sql, params);
        return { id: result.insertId, ...categoryData };
    },

    // Update category
    async update(id, categoryData) {
        const sets = [];
        const values = [];
        
        const allowedFields = ['name', 'slug', 'description', 'icon', 'display_order', 'is_active'];
        
        allowedFields.forEach(field => {
            if (categoryData[field] !== undefined) {
                sets.push(`${field} = ?`);
                values.push(categoryData[field]);
            }
        });
        
        if (sets.length === 0) return null;
        
        values.push(id);
        
        const sql = `
            UPDATE blog_categories 
            SET ${sets.join(', ')}
            WHERE id = ?
        `;
        
        await query(sql, values);
        return await this.findById(id);
    },

    // Delete category
    async delete(id) {
        // Check if any blogs are using this category
        const checkSql = `SELECT COUNT(*) as count FROM blog_post_categories WHERE category_id = ?`;
        const [result] = await query(checkSql, [id]);
        
        if (result.count > 0) {
            throw new Error('Cannot delete category with existing blog posts. Remove blog associations first.');
        }
        
        const sql = `DELETE FROM blog_categories WHERE id = ?`;
        return await query(sql, [id]);
    },

    // Soft delete (deactivate) category
    async softDelete(id) {
        const sql = `UPDATE blog_categories SET is_active = 0 WHERE id = ?`;
        return await query(sql, [id]);
    },

    // Assign categories to a blog
    async assignToBlog(blogId, categoryIds) {
        // First delete existing assignments
        await query('DELETE FROM blog_post_categories WHERE blog_id = ?', [blogId]);
        
        // Then insert new ones
        if (categoryIds && categoryIds.length > 0) {
            const values = categoryIds.map(id => [blogId, id]);
            const placeholders = categoryIds.map(() => '(?, ?)').join(',');
            const flatValues = values.flat();
            
            const sql = `
                INSERT INTO blog_post_categories (blog_id, category_id)
                VALUES ${placeholders}
            `;
            
            return await query(sql, flatValues);
        }
        
        return { success: true, message: 'No categories assigned' };
    },

    // Get categories for a specific blog
    async getByBlogId(blogId) {
        const sql = `
            SELECT 
                bc.id,
                bc.name,
                bc.slug
            FROM blog_categories bc
            JOIN blog_post_categories bpc ON bc.id = bpc.category_id
            WHERE bpc.blog_id = ?
            ORDER BY bc.display_order
        `;
        
        return await query(sql, [blogId]);
    },

    // Add to src/lib/db/queries/blogCategories.js

    // Find category by ID
    async findById(id) {
        const sql = `SELECT * FROM blog_categories WHERE id = ?`;
        const results = await query(sql, [id]);
        return results[0] || null;
    },

    // Check if category has blogs
    async hasBlogs(categoryId) {
        const sql = `SELECT COUNT(*) as count FROM blog_post_categories WHERE category_id = ?`;
        const results = await query(sql, [categoryId]);
        return results[0]?.count > 0;
    },

    // Update category
    async update(id, categoryData) {
        const sets = [];
        const values = [];
        
        const allowedFields = ['name', 'slug', 'description', 'icon', 'display_order', 'is_active'];
        
        allowedFields.forEach(field => {
            if (categoryData[field] !== undefined) {
                sets.push(`${field} = ?`);
                values.push(categoryData[field]);
            }
        });
        
        if (sets.length === 0) return null;
        
        values.push(id);
        
        const sql = `
            UPDATE blog_categories 
            SET ${sets.join(', ')}
            WHERE id = ?
        `;
        
        await query(sql, values);
        return await findById(id);
    },

    // Delete category
    async delete(id) {
        const sql = `DELETE FROM blog_categories WHERE id = ?`;
        return await query(sql, [id]);
    }
};