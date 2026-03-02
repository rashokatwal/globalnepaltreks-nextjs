// app/blogs/FeaturedPost.js
import Link from 'next/link';
import { blogsAssets } from "../assets/assets";

function formatDate(dateString) {
  if (!dateString) return 'Recent';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

export default function FeaturedPost({ post }) {
  if (!post) return null;

  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8 font-montserrat">Featured Story</h2>
        
        <div className="grid md:grid-cols-2 gap-8 items-center bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="relative h-64 md:h-80 overflow-hidden">
            <img
              src={post.featured_image || post.image || blogsAssets.everest_blog}
              alt={post.title}
              className="object-cover w-full h-full transition-transform duration-300 hover:scale-105"
              loading="lazy"
            />
          </div>
          <div className="p-6 md:p-8">
            <div className="flex items-center gap-3 mb-3">
              <span className="bg-accent-color text-white text-xs px-3 py-1 rounded-full">
                {post.category || (post.categories?.[0]) || 'Trekking'}
              </span>
              <span className="text-xs text-gray-500">
                {formatDate(post.published_at)}
              </span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              <Link href={`/blogs/${post.slug}`} className="hover:text-primary-color-dark transition">
                {post.title}
              </Link>
            </h2>
            <p className="text-gray-600 mb-6">
              {post.excerpt || "Detailed guide to help you plan your perfect Himalayan adventure."}
            </p>
            <Link 
              href={`/blogs/${post.slug}`}
              className="inline-block bg-primary-color-dark text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-color transition"
            >
              Read Full Article
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}