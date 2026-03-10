// app/blogs/BlogList.js
'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Heading from "@/app/components/ui/Heading";
import BlogCard from "@/app/components/cards/BlogCard";
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

export default function BlogList({ initialBlogs = [] }) {
  const searchParams = useSearchParams();
  const category = searchParams.get('category');
  
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [featuredPost, setFeaturedPost] = useState(null);

  // Initialize from props
  useEffect(() => {
    console.log('Initial blogs received:', initialBlogs);
    const blogsArray = Array.isArray(initialBlogs) ? initialBlogs : [];
    setBlogs(blogsArray);
    setFeaturedPost(blogsArray[0] || null);
  }, [initialBlogs]);

  // Fetch blogs when category changes
  useEffect(() => {
    async function fetchBlogs() {
      setLoading(true);
      try {
        const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
        const url = category 
          ? `${baseUrl}/api/blogs/categories/${encodeURIComponent(category)}/posts?limit=50`
          : `${baseUrl}/api/blogs?limit=50`;
        
        console.log('Fetching from:', url);
        
        const res = await fetch(url);
        const response = await res.json();
        
        console.log('Full API Response:', JSON.stringify(response, null, 2));
        
        // Handle different response structures
        let blogsArray = [];
        
        if (category) {
          // For category filter: response.data.blogs is the array
          blogsArray = response?.data?.blogs || [];
          console.log('Category filter - using response.data.blogs:', blogsArray);
        } else {
          // For all posts: check different possible structures
          if (response?.data && Array.isArray(response.data)) {
            // Structure: { data: [...] }
            blogsArray = response.data;
            console.log('All posts - using response.data (array):', blogsArray);
          } else if (response?.data?.data && Array.isArray(response.data.data)) {
            // Structure: { data: { data: [...] } }
            blogsArray = response.data.data;
            console.log('All posts - using response.data.data:', blogsArray);
          } else if (response?.blogs && Array.isArray(response.blogs)) {
            // Structure: { blogs: [...] }
            blogsArray = response.blogs;
            console.log('All posts - using response.blogs:', blogsArray);
          } else if (Array.isArray(response)) {
            // Structure: [...] (direct array)
            blogsArray = response;
            console.log('All posts - using direct array:', blogsArray);
          }
        }
        
        // Final safety check
        if (!Array.isArray(blogsArray)) {
          console.warn('Expected array but got:', blogsArray);
          blogsArray = [];
        }
        
        console.log('Final blogs array:', blogsArray);
        
        setBlogs(blogsArray);
        setFeaturedPost(blogsArray[0] || null);
      } catch (error) {
        console.error('Error fetching blogs:', error);
        setBlogs([]);
      } finally {
        setLoading(false);
      }
    }

    if (category) {
      fetchBlogs();
    } else {
      // Reset to initial blogs when no category
      console.log('No category, using initial blogs:', initialBlogs);
      const blogsArray = Array.isArray(initialBlogs) ? initialBlogs : [];
      setBlogs(blogsArray);
      setFeaturedPost(blogsArray[0] || null);
    }
  }, [category, initialBlogs]);

  if (loading) {
    return (
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="w-48 h-8 bg-gray-200 rounded-lg animate-pulse mb-10 mx-auto"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-gray-50 rounded-lg overflow-hidden">
                <div className="h-48 bg-gray-200 animate-pulse"></div>
                <div className="p-6 space-y-3">
                  <div className="w-3/4 h-6 bg-gray-200 rounded animate-pulse"></div>
                  <div className="w-full h-4 bg-gray-200 rounded animate-pulse"></div>
                  <div className="w-2/3 h-4 bg-gray-200 rounded animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Safe check before rendering
  const blogsArray = Array.isArray(blogs) ? blogs : [];
  
  if (blogsArray.length === 0) {
    return (
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <Heading 
            title={category ? `${category} Articles` : "Latest Articles"} 
            titleClass={"text-center mb-10"} 
          />
          <p className="text-gray-500">No blog posts found.</p>
        </div>
      </section>
    );
  }

  return (
    <>
      {/* Featured Post */}
      {featuredPost && (
        <section className="py-12 bg-gray-50">
          <div className="max-w-6xl mx-auto px-4">
            <Heading title={"Featured Story"} titleClass={"text-center mb-8"} />
            
            <div className="grid md:grid-cols-2 gap-8 items-center bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="relative h-64 md:h-80 overflow-hidden">
                <img
                  src={featuredPost.featured_image || featuredPost.image || blogsAssets.everest_blog}
                  alt={featuredPost.title}
                  className="object-cover w-full h-full transition-transform duration-300 hover:scale-105"
                  loading="lazy"
                />
              </div>
              <div className="p-6 md:p-8">
                <div className="flex items-center gap-3 mb-3">
                  <span className="bg-accent-color text-white text-xs px-3 py-1 rounded-full">
                    {featuredPost.category || (featuredPost.categories?.[0]) || 'Trekking'}
                  </span>
                  <span className="text-xs text-gray-500">
                    {formatDate(featuredPost.published_at || featuredPost.postedDate)}
                  </span>
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                  <Link href={`/blogs/${featuredPost.slug}`} className="hover:text-primary-color-dark transition">
                    {featuredPost.title}
                  </Link>
                </h2>
                <p className="text-gray-600 mb-6">
                  {featuredPost.excerpt || "Detailed guide to help you plan your perfect Himalayan adventure."}
                </p>
                <Link 
                  href={`/blogs/${featuredPost.slug}`}
                  className="inline-block bg-primary-color-dark text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-color transition"
                >
                  Read Full Article
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Blog Grid */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <Heading 
            title={category ? `${category} Articles` : "Latest Articles"} 
            titleClass={"text-center mb-10"} 
          />
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {blogsArray.map((post) => (
              <BlogCard 
                key={post.id} 
                blog={{
                  id: post.id,
                  title: post.title,
                  slug: post.slug,
                  image: post.featured_image || post.image || blogsAssets.everest_blog,
                  postedDate: formatDate(post.published_at || post.postedDate),
                  category: post.category || (post.categories?.[0]) || 'Trekking'
                }} 
              />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}