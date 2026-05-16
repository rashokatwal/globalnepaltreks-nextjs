// app/blogs/CategoryFilter.js
'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function CategoryFilter({ categories }) {
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get('category');

  return (
    <section className="py-8 bg-white border-y border-gray-100">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-wrap items-center justify-center gap-3">
          <span className="text-gray-700 font-medium">Browse by Topic:</span>
          
          <Link
            href="/blogs"
            className={`px-4 py-2 rounded-full text-sm transition ${
              !currentCategory
                ? 'bg-primary-color-dark text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All Posts
          </Link>
          
          {categories.map((category) => (
            <Link
              key={category.id || category}
              href={`/blogs?category=${encodeURIComponent(
                typeof category === 'string' ? category : category.slug
              )}`}
              className={`px-4 py-2 rounded-full text-sm transition ${
                currentCategory === (typeof category === 'string' ? category : category.slug)
                  ? 'bg-primary-color-dark text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {typeof category === 'string' ? category : category.name}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}