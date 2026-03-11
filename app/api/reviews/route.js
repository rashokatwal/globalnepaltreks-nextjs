// app/api/reviews/route.js
import { NextResponse } from 'next/server';
import db from '@/lib/db'; // your database connection utility

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const featured = searchParams.get('featured') === 'true';
    const packageId = searchParams.get('packageId');
    const limit = parseInt(searchParams.get('limit') || '10');
    const page = parseInt(searchParams.get('page') || '1');
    const offset = (page - 1) * limit;

    // Build base query
    let query = `
      SELECT 
        id, package_id, reviewer_name, reviewer_country, reviewer_image,
        rating, review_title, review_text, trek_date, group_size,
        is_verified, is_featured, created_at
      FROM package_reviews
      WHERE is_approved = 1
    `;
    const params = [];

    if (featured) {
      query += ` AND is_featured = 1`;
    }

    if (packageId) {
      query += ` AND package_id = ?`;
      params.push(packageId);
    }

    // Order by featured first, then by date
    query += ` ORDER BY is_featured DESC, created_at DESC LIMIT ? OFFSET ?`;
    params.push(limit, offset);

    // Get total count for pagination
    const countQuery = `
      SELECT COUNT(*) as total
      FROM package_reviews
      WHERE is_approved = 1
      ${featured ? 'AND is_featured = 1' : ''}
      ${packageId ? 'AND package_id = ?' : ''}
    `;

    const connection = await db.getConnection();
    const [rows] = await connection.execute(query, params);
    const [countResult] = await connection.execute(
      countQuery,
      packageId ? [packageId] : []
    );
    connection.release();

    const total = countResult[0].total;
    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      success: true,
      data: rows,
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch reviews' },
      { status: 500 }
    );
  }
}