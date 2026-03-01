// src/lib/db/queries/blogs.js
import { query } from '../index.js';

export const BlogQueries = {
  // Get all published blogs with pagination
  async findAll({ page = 1, limit = 10, search = null, countryId = null, activityId = null } = {}) {
    const offset = (page - 1) * limit;
    const params = [];
    const countParams = [];
    
    let countSql = `SELECT COUNT(*) as total FROM blogs WHERE is_published = 1`;
    let dataSql = `
      SELECT id, country_id, activity_id, title, slug, excerpt, 
             featured_image, author, reading_time, published_at, views_count
      FROM blogs 
      WHERE is_published = 1
    `;
    
    // Add country filter
    if (countryId) {
      dataSql += ` AND country_id = ?`;
      countSql += ` AND country_id = ?`;
      params.push(countryId);
      countParams.push(countryId);
    }
    
    // Add activity filter
    if (activityId) {
      dataSql += ` AND activity_id = ?`;
      countSql += ` AND activity_id = ?`;
      params.push(activityId);
      countParams.push(activityId);
    }
    
    // Add search filter
    if (search) {
      dataSql += ` AND (title LIKE ? OR excerpt LIKE ? OR content LIKE ?)`;
      countSql += ` AND (title LIKE ? OR excerpt LIKE ? OR content LIKE ?)`;
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm, searchTerm);
      countParams.push(searchTerm, searchTerm, searchTerm);
    }
    
    dataSql += ` ORDER BY published_at DESC LIMIT ? OFFSET ?`;
    
    // Execute both queries with correct parameters
    const totalResult = await query(countSql, countParams);
    const blogs = await query(dataSql, [...params, limit, offset]);
    
    return {
      blogs,
      pagination: {
        total: totalResult[0]?.total || 0,
        page,
        limit,
        totalPages: Math.ceil((totalResult[0]?.total || 0) / limit)
      }
    };
  },

  // Get blog by slug
  async findBySlug(slug) {
    const sql = `
      SELECT id, country_id, activity_id, title, slug, excerpt, content,
             featured_image, author, reading_time, meta_title, meta_description,
             is_published, published_at, views_count, created_at, updated_at
      FROM blogs 
      WHERE slug = ? AND is_published = 1
    `;
    
    const results = await query(sql, [slug]);
    const blog = results && results.length > 0 ? results[0] : null;
    
    if (blog) {
      // Increment view count
      await this.incrementViews(blog.id);
    }
    
    return blog;
  },

  // Get blog by ID (for admin/edit purposes)
  async findById(id) {
    const sql = `
      SELECT id, country_id, activity_id, title, slug, excerpt, content,
             featured_image, author, reading_time, meta_title, meta_description,
             is_published, published_at, views_count, created_at, updated_at
      FROM blogs 
      WHERE id = ?
    `;
    
    const results = await query(sql, [id]);
    return results && results.length > 0 ? results[0] : null;
  },

  // Get blogs by country (Nepal, Tibet, Bhutan)
  async findByCountry(countryId, { page = 1, limit = 10 } = {}) {
    const offset = (page - 1) * limit;
    
    const sql = `
      SELECT id, country_id, activity_id, title, slug, excerpt,
             featured_image, author, reading_time, published_at, views_count
      FROM blogs 
      WHERE country_id = ? AND is_published = 1
      ORDER BY published_at DESC
      LIMIT ? OFFSET ?
    `;
    
    const countSql = `
      SELECT COUNT(*) as total
      FROM blogs 
      WHERE country_id = ? AND is_published = 1
    `;
    
    const totalResult = await query(countSql, [countryId]);
    const blogs = await query(sql, [countryId, limit, offset]);
    
    return {
      blogs,
      pagination: {
        total: totalResult[0]?.total || 0,
        page,
        limit,
        totalPages: Math.ceil((totalResult[0]?.total || 0) / limit)
      }
    };
  },

  // Get blogs by activity (Trekking, Tours, etc.)
  async findByActivity(activityId, { page = 1, limit = 10 } = {}) {
    const offset = (page - 1) * limit;
    
    const sql = `
      SELECT id, country_id, activity_id, title, slug, excerpt,
             featured_image, author, reading_time, published_at, views_count
      FROM blogs 
      WHERE activity_id = ? AND is_published = 1
      ORDER BY published_at DESC
      LIMIT ? OFFSET ?
    `;
    
    const countSql = `
      SELECT COUNT(*) as total
      FROM blogs 
      WHERE activity_id = ? AND is_published = 1
    `;
    
    const totalResult = await query(countSql, [activityId]);
    const blogs = await query(sql, [activityId, limit, offset]);
    
    return {
      blogs,
      pagination: {
        total: totalResult[0]?.total || 0,
        page,
        limit,
        totalPages: Math.ceil((totalResult[0]?.total || 0) / limit)
      }
    };
  },

  // Get featured blogs
  async getFeatured(limit = 5) {
    const sql = `
      SELECT id, country_id, activity_id, title, slug, excerpt,
             featured_image, author, reading_time, published_at, views_count
      FROM blogs 
      WHERE is_featured = 1
      ORDER BY views_count DESC, published_at DESC
      LIMIT ?
    `;
    
    return await query(sql, [limit]);
  },

  // Get latest blogs
  async getLatest(limit = 5) {
    const sql = `
      SELECT id, country_id, activity_id, title, slug, excerpt,
             featured_image, author, reading_time, published_at, views_count
      FROM blogs 
      WHERE is_published = 1
      ORDER BY published_at DESC
      LIMIT ?
    `;
    
    return await query(sql, [limit]);
  },

  // Get popular blogs (by views)
  async getPopular(limit = 5) {
    const sql = `
      SELECT id, country_id, activity_id, title, slug, excerpt,
             featured_image, author, reading_time, published_at, views_count
      FROM blogs 
      WHERE is_published = 1
      ORDER BY views_count DESC
      LIMIT ?
    `;
    
    return await query(sql, [limit]);
  },

  // Get related blogs (by same country or activity)
  async getRelated(blogId, countryId, activityId, limit = 3) {
    const sql = `
      SELECT id, country_id, activity_id, title, slug, excerpt,
             featured_image, author, reading_time, published_at, views_count
      FROM blogs 
      WHERE id != ? 
        AND is_published = 1 
        AND (country_id = ? OR activity_id = ?)
      ORDER BY 
        CASE 
          WHEN country_id = ? AND activity_id = ? THEN 1
          WHEN country_id = ? THEN 2
          WHEN activity_id = ? THEN 3
          ELSE 4
        END,
        published_at DESC
      LIMIT ?
    `;
    
    return await query(sql, [
      blogId, countryId, activityId, 
      countryId, activityId, 
      countryId, 
      activityId, 
      limit
    ]);
  },

  // Get archive by month/year
  async getArchive() {
    const sql = `
      SELECT 
        YEAR(published_at) as year,
        MONTHNAME(published_at) as month,
        MONTH(published_at) as month_num,
        COUNT(*) as post_count
      FROM blogs
      WHERE is_published = 1
      GROUP BY year, month, month_num
      ORDER BY year DESC, month_num DESC
    `;
    
    return await query(sql);
  },

  // Increment view count
  async incrementViews(id) {
    const sql = `
      UPDATE blogs 
      SET views_count = views_count + 1 
      WHERE id = ?
    `;
    
    return await query(sql, [id]);
  },

  async getBlogWithCategories(blogId) {
    const blog = await this.findById(blogId);
    if (!blog) return null;
    
    const categories = await BlogCategoryQueries.getByBlogId(blogId);
    
    return {
        ...blog,
        categories
    };
  },

  // Get blogs with their categories
  async getBlogsWithCategories({ page = 1, limit = 10 } = {}) {
      const result = await this.findAll({ page, limit });
      
      for (const blog of result.blogs) {
          blog.categories = await BlogCategoryQueries.getByBlogId(blog.id);
      }
      
      return result;
  },

  // Create new blog post
  async create(blogData) {
    const sql = `
      INSERT INTO blogs (
        country_id, activity_id, title, slug, excerpt, content,
        featured_image, author, reading_time, meta_title, meta_description,
        is_published, published_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    const params = [
      blogData.country_id || null,
      blogData.activity_id || null,
      blogData.title,
      blogData.slug,
      blogData.excerpt || null,
      blogData.content,
      blogData.featured_image || null,
      blogData.author || 'Global Nepal Treks',
      blogData.reading_time || 5,
      blogData.meta_title || blogData.title,
      blogData.meta_description || blogData.excerpt || `Read about ${blogData.title}`,
      blogData.is_published ? 1 : 0,
      blogData.is_published ? new Date() : null
    ];
    
    const result = await query(sql, params);
    return { id: result.insertId, ...blogData };
  },

  // Update blog post
  async update(id, blogData) {
    const sets = [];
    const values = [];
    
    const allowedFields = [
      'country_id', 'activity_id', 'title', 'slug', 'excerpt', 'content',
      'featured_image', 'author', 'reading_time', 'meta_title', 'meta_description',
      'is_published', 'published_at'
    ];
    
    allowedFields.forEach(field => {
      if (blogData[field] !== undefined) {
        sets.push(`${field} = ?`);
        values.push(blogData[field]);
      }
    });
    
    if (sets.length === 0) return null;
    
    sets.push('updated_at = NOW()');
    values.push(id);
    
    const sql = `
      UPDATE blogs 
      SET ${sets.join(', ')}
      WHERE id = ?
    `;
    
    await query(sql, values);
    return await this.findById(id);
  },

  // Delete blog post
  async delete(id) {
    const sql = `DELETE FROM blogs WHERE id = ?`;
    return await query(sql, [id]);
  },

  // Soft delete (archive) blog post
  async softDelete(id) {
    const sql = `
      UPDATE blogs 
      SET is_published = 0 
      WHERE id = ?
    `;
    
    return await query(sql, [id]);
  },

  // Publish blog (set is_published to 1 and set published_at)
  async publish(id) {
    const sql = `
      UPDATE blogs 
      SET is_published = 1, published_at = NOW(), updated_at = NOW()
      WHERE id = ?
    `;
    
    return await query(sql, [id]);
  },

  // Unpublish blog (set is_published to 0)
  async unpublish(id) {
    const sql = `
      UPDATE blogs 
      SET is_published = 0, updated_at = NOW()
      WHERE id = ?
    `;
    
    return await query(sql, [id]);
  },

  // Search blogs
  async search(searchTerm, { page = 1, limit = 10 } = {}) {
    const offset = (page - 1) * limit;
    const term = `%${searchTerm}%`;
    
    const sql = `
      SELECT id, country_id, activity_id, title, slug, excerpt,
             featured_image, author, reading_time, published_at, views_count
      FROM blogs 
      WHERE is_published = 1 
        AND (title LIKE ? OR excerpt LIKE ? OR content LIKE ?)
      ORDER BY 
        CASE 
          WHEN title LIKE ? THEN 1
          WHEN excerpt LIKE ? THEN 2
          ELSE 3
        END,
        published_at DESC
      LIMIT ? OFFSET ?
    `;
    
    const countSql = `
      SELECT COUNT(*) as total
      FROM blogs 
      WHERE is_published = 1 
        AND (title LIKE ? OR excerpt LIKE ? OR content LIKE ?)
    `;
    
    const totalResult = await query(countSql, [term, term, term]);
    const blogs = await query(sql, [term, term, term, term, term, term, limit, offset]);
    
    return {
      blogs,
      pagination: {
        total: totalResult[0]?.total || 0,
        page,
        limit,
        totalPages: Math.ceil((totalResult[0]?.total || 0) / limit)
      },
      searchTerm
    };
  },

  // Get blogs by author
  async findByAuthor(author, { page = 1, limit = 10 } = {}) {
    const offset = (page - 1) * limit;
    
    const sql = `
      SELECT id, country_id, activity_id, title, slug, excerpt,
             featured_image, author, reading_time, published_at, views_count
      FROM blogs 
      WHERE author = ? AND is_published = 1
      ORDER BY published_at DESC
      LIMIT ? OFFSET ?
    `;
    
    const countSql = `
      SELECT COUNT(*) as total
      FROM blogs 
      WHERE author = ? AND is_published = 1
    `;
    
    const totalResult = await query(countSql, [author]);
    const blogs = await query(sql, [author, limit, offset]);
    
    return {
      blogs,
      pagination: {
        total: totalResult[0]?.total || 0,
        page,
        limit,
        totalPages: Math.ceil((totalResult[0]?.total || 0) / limit)
      }
    };
  },

  // Get blogs by tag (simulated - if you have tags column)
  async findByTag(tag, { page = 1, limit = 10 } = {}) {
    const offset = (page - 1) * limit;
    const term = `%${tag}%`;
    
    const sql = `
      SELECT id, country_id, activity_id, title, slug, excerpt,
             featured_image, author, reading_time, published_at, views_count
      FROM blogs 
      WHERE is_published = 1 
        AND tags LIKE ?
      ORDER BY published_at DESC
      LIMIT ? OFFSET ?
    `;
    
    const countSql = `
      SELECT COUNT(*) as total
      FROM blogs 
      WHERE is_published = 1 AND tags LIKE ?
    `;
    
    const totalResult = await query(countSql, [term]);
    const blogs = await query(sql, [term, limit, offset]);
    
    return {
      blogs,
      pagination: {
        total: totalResult[0]?.total || 0,
        page,
        limit,
        totalPages: Math.ceil((totalResult[0]?.total || 0) / limit)
      }
    };
  },

  // Get previous and next blog posts for navigation
  async getAdjacentPosts(currentId, publishedAt) {
    // Get previous post (older)
    const prevSql = `
      SELECT id, title, slug
      FROM blogs 
      WHERE is_published = 1 AND published_at < ?
      ORDER BY published_at DESC
      LIMIT 1
    `;
    
    // Get next post (newer)
    const nextSql = `
      SELECT id, title, slug
      FROM blogs 
      WHERE is_published = 1 AND published_at > ?
      ORDER BY published_at ASC
      LIMIT 1
    `;
    
    const prevResult = await query(prevSql, [publishedAt]);
    const nextResult = await query(nextSql, [publishedAt]);
    
    return {
      previous: prevResult && prevResult.length > 0 ? prevResult[0] : null,
      next: nextResult && nextResult.length > 0 ? nextResult[0] : null
    };
  },

  // Bulk update blog status
  async bulkUpdateStatus(ids, isPublished) {
    if (!ids || ids.length === 0) return null;
    
    const placeholders = ids.map(() => '?').join(',');
    const sql = `
      UPDATE blogs 
      SET is_published = ?, updated_at = NOW() 
      WHERE id IN (${placeholders})
    `;
    
    return await query(sql, [isPublished ? 1 : 0, ...ids]);
  },

  // Get blogs for homepage (featured + latest mix)
  async getHomepageBlogs(limit = 3) {
    const sql = `
      (SELECT id, country_id, activity_id, title, slug, excerpt,
              featured_image, author, reading_time, published_at, views_count
       FROM blogs 
       WHERE is_published = 1
       ORDER BY views_count DESC
       LIMIT ?)
      UNION
      (SELECT id, country_id, activity_id, title, slug, excerpt,
              featured_image, author, reading_time, published_at, views_count
       FROM blogs 
       WHERE is_published = 1
       ORDER BY published_at DESC
       LIMIT ?)
      LIMIT ?
    `;
    
    return await query(sql, [limit, limit, limit]);
  },

  // Get blogs for sidebar (popular + recent)
  async getSidebarBlogs(limit = 5) {
    const sql = `
      (SELECT id, country_id, activity_id, title, slug, excerpt,
              featured_image, author, reading_time, published_at, views_count
       FROM blogs 
       WHERE is_published = 1
       ORDER BY views_count DESC
       LIMIT ?)
      UNION
      (SELECT id, country_id, activity_id, title, slug, excerpt,
              featured_image, author, reading_time, published_at, views_count
       FROM blogs 
       WHERE is_published = 1
       ORDER BY published_at DESC
       LIMIT ?)
      LIMIT ?
    `;
    
    return await query(sql, [limit, limit, limit]);
  },

  // Get stats for dashboard
  async getStats() {
    const sql = `
      SELECT 
        COUNT(*) as total_blogs,
        SUM(CASE WHEN is_published = 1 THEN 1 ELSE 0 END) as published_blogs,
        SUM(CASE WHEN is_published = 0 THEN 1 ELSE 0 END) as draft_blogs,
        SUM(views_count) as total_views,
        MAX(views_count) as most_viewed_count,
        AVG(reading_time) as avg_reading_time,
        COUNT(DISTINCT author) as unique_authors,
        COUNT(DISTINCT country_id) as countries_covered,
        COUNT(DISTINCT activity_id) as activities_covered
      FROM blogs
    `;
    
    const stats = await query(sql);
    
    // Get most viewed blog
    const mostViewedSql = `
      SELECT title, slug, views_count
      FROM blogs
      WHERE is_published = 1
      ORDER BY views_count DESC
      LIMIT 1
    `;
    
    const mostViewed = await query(mostViewedSql);
    
    // Get recent activity
    const recentSql = `
      SELECT COUNT(*) as recent_posts
      FROM blogs
      WHERE published_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
        AND is_published = 1
    `;
    
    const recent = await query(recentSql);
    
    return {
      ...(stats[0] || {}),
      most_viewed_blog: mostViewed && mostViewed.length > 0 ? mostViewed[0] : null,
      recent_posts_last_30_days: (recent[0]?.recent_posts) || 0
    };
  }
};