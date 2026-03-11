// app/sitemap.js

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://globalnepaltreks.com';

// Helper to create URL‑friendly slugs (if needed as fallback)
const slugify = (str) => {
  if (!str) return '';
  return str.toString().toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-');
};

// Fetch all packages
async function fetchPackages() {
  try {
    const res = await fetch(`${BASE_URL}/api/packages?limit=1000`, {
      next: { revalidate: 3600 } // cache for 1 hour
    });
    const data = await res.json();
    return data.success ? data.data.packages || [] : [];
  } catch (error) {
    console.error('Error fetching packages for sitemap:', error);
    return [];
  }
}

// Fetch all blogs
async function fetchBlogs() {
  try {
    const res = await fetch(`${BASE_URL}/api/blogs?limit=1000`, {
      next: { revalidate: 3600 }
    });
    const data = await res.json();
    return data.success ? data.data.data || [] : [];
  } catch (error) {
    console.error('Error fetching blogs for sitemap:', error);
    return [];
  }
}

export default async function sitemap() {
  // --- 1. Static Pages ---
  const staticPages = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/about/our-team`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/packages`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/blogs`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/book`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    }
  ];

  // --- 2. Fetch dynamic data ---
  const packages = await fetchPackages();
  const blogs = await fetchBlogs();

  // --- 3. Country Pages (from unique countries in packages) ---
  const countryMap = new Map();
  packages.forEach(pkg => {
    if (pkg.country_slug) {
      // Use the most recent update time for the country page
      const existing = countryMap.get(pkg.country_slug);
      const pkgDate = new Date(pkg.updated_at || pkg.created_at);
      if (!existing || pkgDate > existing.lastModified) {
        countryMap.set(pkg.country_slug, {
          slug: pkg.country_slug,
          lastModified: pkgDate,
        });
      }
    }
  });

  const countryUrls = Array.from(countryMap.values()).map(country => ({
    url: `${BASE_URL}/${country.slug}`,
    lastModified: country.lastModified,
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  // --- 4. Country+Activity Pages (unique combinations) ---
  const activityMap = new Map(); // key: `${countrySlug}/${activitySlug}`
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

  // --- 5. Package Pages ---
  const packageUrls = packages.map(pkg => ({
    url: `${BASE_URL}/${pkg.country_slug}/${pkg.activity_slug}/${pkg.slug}`,
    lastModified: new Date(pkg.updated_at || pkg.created_at),
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  // --- 6. Blog Pages ---
  const blogUrls = blogs.map(blog => ({
    url: `${BASE_URL}/blogs/${blog.slug}`,
    lastModified: new Date(blog.published_at || blog.updated_at),
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  // Combine all URLs
  return [
    ...staticPages,
    ...countryUrls,
    ...activityUrls,
    ...packageUrls,
    ...blogUrls,
  ];
}