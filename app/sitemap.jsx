// app/sitemap.js
import db from '@/lib/db';

export const dynamic = 'force-dynamic'; // 👈 Add this line

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://globalnepaltreks.com';

export default async function sitemap() {
  console.log('🚀 Generating sitemap...');

  // --- Static pages ---
  const staticPages = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
    { url: `${BASE_URL}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE_URL}/contact`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE_URL}/packages`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE_URL}/blogs`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE_URL}/book`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
  ];

  // --- Fetch packages (same as before) ---
  let packages = [];
  try {
    const [rows] = await db.execute(`
      SELECT 
        p.id, p.slug, p.updated_at, p.created_at,
        c.slug as country_slug,
        a.slug as activity_slug
      FROM packages p
      JOIN countries c ON p.country_id = c.id
      JOIN activities a ON p.activity_id = a.id
      WHERE p.is_active = 1
    `);
    packages = rows;
  } catch (error) {
    console.error('Error fetching packages for sitemap:', error);
  }

  // --- Fetch blogs ---
  let blogs = [];
  try {
    const [rows] = await db.execute(`
      SELECT id, slug, published_at, updated_at
      FROM blogs
      WHERE is_published = 1
    `);
    blogs = rows;
  } catch (error) {
    console.error('Error fetching blogs for sitemap:', error);
  }

  // --- Build URLs (country, activity, package, blog) ---
  const countryMap = new Map();
  packages.forEach(pkg => {
    if (pkg.country_slug) {
      const pkgDate = new Date(pkg.updated_at || pkg.created_at);
      const existing = countryMap.get(pkg.country_slug);
      if (!existing || pkgDate > existing.lastModified) {
        countryMap.set(pkg.country_slug, { slug: pkg.country_slug, lastModified: pkgDate });
      }
    }
  });
  const countryUrls = Array.from(countryMap.values()).map(country => ({
    url: `${BASE_URL}/${country.slug}`,
    lastModified: country.lastModified,
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  const activityMap = new Map();
  packages.forEach(pkg => {
    if (pkg.country_slug && pkg.activity_slug) {
      const key = `${pkg.country_slug}/${pkg.activity_slug}`;
      const pkgDate = new Date(pkg.updated_at || pkg.created_at);
      const existing = activityMap.get(key);
      if (!existing || pkgDate > existing.lastModified) {
        activityMap.set(key, {
          countrySlug: pkg.country_slug,
          activitySlug: pkg.activity_slug,
          lastModified: pkgDate,
        });
      }
    }
  });
  const activityUrls = Array.from(activityMap.values()).map(item => ({
    url: `${BASE_URL}/${item.countrySlug}/${item.activitySlug}`,
    lastModified: item.lastModified,
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  const packageUrls = packages.map(pkg => ({
    url: `${BASE_URL}/${pkg.country_slug}/${pkg.activity_slug}/${pkg.slug}`,
    lastModified: new Date(pkg.updated_at || pkg.created_at),
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  const blogUrls = blogs.map(blog => ({
    url: `${BASE_URL}/blogs/${blog.slug}`,
    lastModified: new Date(blog.published_at || blog.updated_at),
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  return [
    ...staticPages,
    ...countryUrls,
    ...activityUrls,
    ...packageUrls,
    ...blogUrls,
  ];
}