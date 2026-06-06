// app/blogs/page-content.js
import { Suspense } from 'react';
import CategoryFilter from './CategoryFilter';
import BlogList from './BlogList';

async function getInitialData() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    
    const [blogsRes, categoriesRes] = await Promise.all([
      fetch(`${baseUrl}/api/blogs?limit=100`, {
        next: { revalidate: 3600 }
      }),
      fetch(`${baseUrl}/api/blogs/categories`, {
        next: { revalidate: 3600 }
      })
    ]);
    
    console.log('Blogs Response:', blogsRes);
    const blogsData = await blogsRes.json();
    const categoriesData = await categoriesRes.json();
    
    // Extract blogs - check different possible structures
    let initialBlogs = [];
    
    if (blogsData?.data && Array.isArray(blogsData.data)) {
      // Structure: { data: [...] }
      initialBlogs = blogsData.data;
    } else if (blogsData?.data?.data && Array.isArray(blogsData.data.data)) {
      // Structure: { data: { data: [...] } }
      initialBlogs = blogsData.data.data;
    } else if (blogsData?.blogs && Array.isArray(blogsData.blogs)) {
      // Structure: { blogs: [...] }
      initialBlogs = blogsData.blogs;
    } else if (Array.isArray(blogsData)) {
      // Structure: [...] (direct array)
      initialBlogs = blogsData;
    }
    
    // Extract categories
    let categories = [];
    if (categoriesData?.data && Array.isArray(categoriesData.data)) {
      categories = categoriesData.data;
    } else if (categoriesData && Array.isArray(categoriesData)) {
      categories = categoriesData;
    }
    
    
    return {
      initialBlogs,
      categories
    };
  } catch (error) {
    return {
      initialBlogs: [],
      categories: []
    };
  }
}

export default async function BlogPageContent() {
  const { initialBlogs, categories } = await getInitialData();
  
  
  return (
    <>
      <CategoryFilter categories={categories} />
      <BlogList initialBlogs={initialBlogs} />
    </>
  );
}