// app/blogs/[slug]/page.js
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faCalendar, 
  faUser, 
  faClock,
  faArrowLeft,
  faArrowRight,
  faTag,
  faEye
} from '@fortawesome/free-solid-svg-icons';
import { blogsAssets } from '@/app/assets/assets';
import BlogCard from '@/app/components/cards/BlogCard';
import Heading from '@/app/components/ui/Heading';
import ShareButtons from '@/app/components/ui/ShareButtons';

// ✅ FIX: Use a reliable base URL that works in all environments
function getBaseUrl() {
  // In production (server-side), prefer NEXT_PUBLIC_APP_URL, fall back to production domain
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL.replace(/\/$/, ''); // strip trailing slash
  }
  // ✅ FIX: Never fall back to localhost in production — use your actual domain
  return 'https://globalnepaltreks.com';
}

// Fetch blog post data
// ✅ Match this exact pattern from your working packages code
async function getBlogPost(slug) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/blogs/${slug}`, {
      next: { revalidate: 0 }
    });

    if (!res.ok) return null;
    const data = await res.json();
    return data.data;
  } catch (error) {
    console.error(`[getBlogPost] Failed for slug "${slug}":`, error);
    return null;
  }
}

// Format date
function formatDate(dateString) {
  if (!dateString) return 'Recent';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

// Calculate reading time if not provided
function getReadingTime(content, providedTime) {
  if (providedTime) return providedTime;

  const wordsPerMinute = 200;
  const wordCount = content?.trim().split(/\s+/).length || 0;
  return Math.ceil(wordCount / wordsPerMinute);
}

// ✅ FIX: generateMetadata must also use a reliable URL — same fix applied here
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = await getBlogPost(slug);

  if (!post) {
    return { title: 'Blog Post Not Found | Global Nepal Treks' };
  }

  const canonicalUrl = `https://globalnepaltreks.com/blogs/${post.slug}`;

  return {
    title: post.meta_title || `${post.title} | Global Nepal Treks Blog`,
    description: post.meta_description || post.excerpt,
    keywords: post.keywords || '',

    // ✅ These were missing — needed for LinkedIn/Facebook sharing
    alternates: {
      canonical: canonicalUrl,
    },

    openGraph: {
      title: post.meta_title || post.title,
      description: post.meta_description || post.excerpt,
      url: canonicalUrl,                          // ✅ LinkedIn reads this
      siteName: 'Global Nepal Treks',
      images: [
        {
          url: post.featured_image?.startsWith('http')
            ? post.featured_image
            : `https://globalnepaltreks.com${post.featured_image}`,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
      type: 'article',
      publishedTime: post.published_at,
      authors: [post.author],
    },

    twitter: {
      card: 'summary_large_image',
      title: post.meta_title || post.title,
      description: post.meta_description || post.excerpt,
      images: [
        post.featured_image?.startsWith('http')
          ? post.featured_image
          : `https://globalnepaltreks.com${post.featured_image}`,
      ],
    },
  };
}

export default async function BlogPostPage({ params }) {
  // ✅ FIX: await params (required in Next.js 15+)
  const { slug } = await params;
  const post = await getBlogPost(slug);

  if (!post) {
    notFound();
  }

  const readingTime = getReadingTime(post.content, post.reading_time);
  const formattedDate = formatDate(post.published_at);

  // ✅ FIX: Always use absolute URL for sharing
  const shareUrl = `https://globalnepaltreks.com/blogs/${post.slug}`;

  return (
    <main className="bg-white">
      {/* Hero Section */}
      <section className="relative min-h-[80vh] bg-gray-900">
        <div
          className="absolute inset-0 overflow-hidden bg-center bg-fixed bg-cover"
          style={{ backgroundImage: `url(${post.featured_image})` }}
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/40 to-transparent" />

        <div className="absolute bottom-0 left-0 right-0 max-w-5xl mx-auto px-4 pb-16 text-white">
          <div className="flex flex-wrap gap-3 mb-4">
            <span className="bg-accent-color px-3 py-1 rounded-full text-xs font-semibold">
              {post.category || post.categories?.[0] || 'Trekking'}
            </span>
            <span className="bg-primary-color-dark px-3 py-1 rounded-full text-xs font-semibold">
              {post.country_name || 'Nepal'}
            </span>
          </div>

          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold font-montserrat mb-4">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-200">
            <span className="flex items-center gap-2">
              <FontAwesomeIcon icon={faUser} className="w-3 h-3" />
              {post.author}
            </span>
            <span className="flex items-center gap-2">
              <FontAwesomeIcon icon={faCalendar} className="w-3 h-3" />
              {formattedDate}
            </span>
            <span className="flex items-center gap-2">
              <FontAwesomeIcon icon={faClock} className="w-3 h-3" />
              {readingTime} min read
            </span>
            <span className="flex items-center gap-2">
              <FontAwesomeIcon icon={faEye} className="w-3 h-3" />
              {post.views_count || 0} views
            </span>
          </div>
        </div>
      </section>

      {/* Breadcrumbs */}
      <section className="py-4 bg-gray-50 border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex items-center gap-2 text-sm">
            <Link href="/" className="text-gray-500 hover:text-primary-color-dark transition">
              Home
            </Link>
            <span className="text-gray-400">/</span>
            <Link href="/blogs" className="text-gray-500 hover:text-primary-color-dark transition">
              Blog
            </Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-900 font-medium truncate">{post.title}</span>
          </div>
        </div>
      </section>

      {/* Blog Content */}
      <section className="py-12 md:py-16">
        <div className="max-w-4xl mx-auto px-4">
          {/* Excerpt */}
          {post.excerpt && (
            <div className="mb-8 p-6 bg-gray-50 border-l-4 border-primary-color-dark rounded-r-lg">
              <p className="text-lg text-gray-700 italic">"{post.excerpt}"</p>
            </div>
          )}

          {/* Main Content */}
          <article className="text-gray-800 leading-relaxed space-y-6">
            {post.content ? (
              <div
                className="blog-content"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
            ) : (
              <p className="text-gray-600">No content available.</p>
            )}
          </article>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="mt-12 pt-8 border-t border-gray-200">
              <div className="flex items-center gap-3 flex-wrap">
                <span className="font-semibold flex items-center gap-2">
                  <FontAwesomeIcon icon={faTag} className="w-4 h-4 text-primary-color-dark" />
                  Tags:
                </span>
                {post.tags.map((tag) => (
                  <Link
                    key={tag}
                    href={`/blogs/tag/${tag.toLowerCase().replace(/\s+/g, '-')}`}
                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-primary-color-dark hover:text-white transition"
                  >
                    {tag}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Share Buttons */}
          <div className="mt-8 pt-8 border-t border-gray-200">
            <h3 className="font-semibold mb-4">Share this article:</h3>
            {/* ✅ FIX: Pass both shareUrl and title so ShareButtons can use them correctly */}
            <ShareButtons shareUrl={shareUrl} title={post.title} />
          </div>
        </div>
      </section>

      {/* Related Posts */}
      {post.related && post.related.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="max-w-6xl mx-auto px-4">
            <Heading title="Related Articles" titleClass="text-center mb-10" />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {post.related.map((relatedPost) => (
                <BlogCard
                  key={relatedPost.id}
                  blog={{
                    id: relatedPost.id,
                    title: relatedPost.title,
                    slug: relatedPost.slug,
                    image: relatedPost.featured_image || blogsAssets.everest_blog,
                    postedDate: formatDate(relatedPost.published_at),
                    category: relatedPost.category || 'Trekking',
                  }}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Navigation */}
      {(post.navigation?.previous || post.navigation?.next) && (
        <section className="py-12 bg-white border-t border-gray-200">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex justify-between items-center">
              {post.navigation?.previous ? (
                <Link
                  href={`/blogs/${post.navigation.previous.slug}`}
                  className="group flex items-center gap-2 text-gray-600 hover:text-primary-color-dark transition max-w-[45%]"
                >
                  <FontAwesomeIcon
                    icon={faArrowLeft}
                    className="w-4 h-4 group-hover:-translate-x-1 transition"
                  />
                  <div>
                    <div className="text-xs text-gray-400 mb-1">Previous Article</div>
                    <div className="font-medium line-clamp-1">{post.navigation.previous.title}</div>
                  </div>
                </Link>
              ) : (
                <div />
              )}

              {post.navigation?.next ? (
                <Link
                  href={`/blogs/${post.navigation.next.slug}`}
                  className="group flex items-center gap-2 text-gray-600 hover:text-primary-color-dark transition text-right max-w-[45%]"
                >
                  <div>
                    <div className="text-xs text-gray-400 mb-1">Next Article</div>
                    <div className="font-medium line-clamp-1">{post.navigation.next.title}</div>
                  </div>
                  <FontAwesomeIcon
                    icon={faArrowRight}
                    className="w-4 h-4 group-hover:translate-x-1 transition"
                  />
                </Link>
              ) : (
                <div />
              )}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}