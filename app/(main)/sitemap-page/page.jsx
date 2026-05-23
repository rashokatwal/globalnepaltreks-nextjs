// app/sitemap/page.js
import db from '@/lib/db';

export const metadata = {
  title: 'Sitemap | Global Nepal Treks – Nepal Trekking Agency',
  description: 'Explore the full sitemap of Global Nepal Treks. Find all pages for trek itineraries, destinations, booking & travel guides for Nepal, Tibet & Bhutan.',
//   keywords: 'nepal trekking guides, saroj ghimire founder, keshar sherpa guide, deepak lamichane trekking, nabaraj gurung tour operator, himalayan guides nepal',
  openGraph: {
    title: 'Sitemap | Global Nepal Treks – Nepal Trekking Agency',
    description: 'Explore the full sitemap of Global Nepal Treks. Find all pages for trek itineraries, destinations, booking & travel guides for Nepal, Tibet & Bhutan.',
  },
  alternates: {
      canonical: "https://globalnepaltreks.com/sitemap",
  },
};

export const dynamic = 'force-dynamic';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://globalnepaltreks.com';

export default async function SitemapPage() {
  console.log('🚀 Generating HTML sitemap...');

  let packages = [];
  try {
    const [rows] = await db.execute(`
      SELECT 
        p.id, p.slug, p.updated_at, p.created_at, p.title,
        c.slug as country_slug,
        a.slug as activity_slug
      FROM packages p
      JOIN countries c ON p.country_id = c.id
      JOIN activities a ON p.activity_id = a.id
      WHERE p.is_active = 1
    `);
    packages = rows;
  } catch (error) {
    console.error('Error fetching packages:', error);
  }

  let blogs = [];
  try {
    const [rows] = await db.execute(`
      SELECT id, slug, title, published_at, updated_at
      FROM blogs
      WHERE is_published = 1
    `);
    blogs = rows;
  } catch (error) {
    console.error('Error fetching blogs:', error);
  }

  // Group packages
  const countriesMap = new Map();
  packages.forEach(pkg => {
    const { country_slug: countrySlug, activity_slug: activitySlug } = pkg;
    if (!countrySlug) return;

    if (!countriesMap.has(countrySlug)) {
      countriesMap.set(countrySlug, {
        slug: countrySlug,
        activities: new Map(),
      });
    }
    const country = countriesMap.get(countrySlug);
    if (!country.activities.has(activitySlug)) {
      country.activities.set(activitySlug, {
        slug: activitySlug,
        packages: [],
      });
    }
    country.activities.get(activitySlug).packages.push(pkg);
  });

  // Helper to format slug to title case
  const formatTitle = (slug) =>
    slug.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mt-50 mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-primary-color">
            Sitemap
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-3 text-lg">
            Find everything you need – all our pages, destinations, and articles in one place.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {/* Main pages card */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-shadow p-6 border border-gray-100 dark:border-gray-700">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-2 mb-4">
              Main pages
            </h2>
            <ul className="space-y-2">
              {[
                { href: BASE_URL, label: 'Home' },
                { href: `${BASE_URL}/about`, label: 'About' },
                { href: `${BASE_URL}/contact`, label: 'Contact' },
                { href: `${BASE_URL}/packages`, label: 'All packages' },
                { href: `${BASE_URL}/blogs`, label: 'Blog index' },
                { href: `${BASE_URL}/book`, label: 'Book now' },
              ].map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 hover:underline transition-all flex items-center gap-1"
                  >
                    <span>→</span> {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Blog posts card */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-shadow p-6 border border-gray-100 dark:border-gray-700">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-2 mb-4">
              Blog posts
            </h2>
            {blogs.length === 0 ? (
              <p className="text-gray-500 italic">No blog posts yet.</p>
            ) : (
              <ul className="space-y-2 max-h-96 overflow-y-auto pr-2">
                {blogs.map((blog) => (
                  <li key={blog.id}>
                    <a
                      href={`${BASE_URL}/blogs/${blog.slug}`}
                      className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 hover:underline transition-all block py-1"
                    >
                      {blog.title || formatTitle(blog.slug)}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Destinations & packages – spans full width on small screens, but can be a large card */}
        </div>

        {/* Packages section – full width below */}
        <div className="mt-10 bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-2 mb-6">
            Trekking packages
          </h2>
          {countriesMap.size === 0 ? (
            <p className="text-gray-500 italic">No packages available.</p>
          ) : (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {Array.from(countriesMap.entries()).map(([countrySlug, country]) => (
                <div key={countrySlug} className="border-l-4 border-blue-500 pl-4">
                  <h3 className="text-xl font-semibold mb-3">
                    <a
                      href={`${BASE_URL}/${countrySlug}`}
                      className="text-gray-800 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    >
                      {formatTitle(countrySlug)}
                    </a>
                  </h3>
                  <div className="space-y-4">
                    {Array.from(country.activities.entries()).map(([activitySlug, activity]) => (
                      <div key={activitySlug}>
                        <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">
                          <a
                            href={`${BASE_URL}/${countrySlug}/${activitySlug}`}
                            className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                          >
                            {formatTitle(activitySlug)}
                          </a>
                        </h4>
                        <ul className="space-y-1 ml-4">
                          {activity.packages.map((pkg) => (
                            <li key={pkg.id}>
                              <a
                                href={`${BASE_URL}/${countrySlug}/${activitySlug}/${pkg.slug}`}
                                className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:underline"
                              >
                                {pkg.name || formatTitle(pkg.slug)}
                              </a>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer note */}
        <div className="text-center text-sm text-gray-500 dark:text-gray-400 mt-12 pt-6 border-t border-gray-200 dark:border-gray-700">
          This sitemap helps you browse all content. Last updated automatically.
        </div>
      </div>
    </div>
  );
}