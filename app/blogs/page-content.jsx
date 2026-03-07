// app/blogs/page-content.js
import { Suspense } from 'react';
import CategoryFilter from './CategoryFilter';
import BlogList from './BlogList';

async function getInitialData() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    
    const [blogsRes, categoriesRes] = await Promise.all([
      fetch(`${baseUrl}/api/blogs?limit=50`, {
        next: { revalidate: 0 }
      }),
      fetch(`${baseUrl}/api/blogs/categories`, {
        next: { revalidate: 0 }
      })
    ]);
    
    const blogsData = await blogsRes.json();
    const categoriesData = await categoriesRes.json();
    
    console.log('Initial blogs response:', JSON.stringify(blogsData, null, 2));
    console.log('Categories response:', JSON.stringify(categoriesData, null, 2));
    
    // Extract blogs - check different possible structures
    let initialBlogs = [];
    
    if (blogsData?.data && Array.isArray(blogsData.data)) {
      // Structure: { data: [...] }
      initialBlogs = blogsData.data;
      console.log('Using blogsData.data (array):', initialBlogs.length);
    } else if (blogsData?.data?.data && Array.isArray(blogsData.data.data)) {
      // Structure: { data: { data: [...] } }
      initialBlogs = blogsData.data.data;
      console.log('Using blogsData.data.data:', initialBlogs.length);
    } else if (blogsData?.blogs && Array.isArray(blogsData.blogs)) {
      // Structure: { blogs: [...] }
      initialBlogs = blogsData.blogs;
      console.log('Using blogsData.blogs:', initialBlogs.length);
    } else if (Array.isArray(blogsData)) {
      // Structure: [...] (direct array)
      initialBlogs = blogsData;
      console.log('Using direct array:', initialBlogs.length);
    }
    
    // Extract categories
    let categories = [];
    if (categoriesData?.data && Array.isArray(categoriesData.data)) {
      categories = categoriesData.data;
    } else if (categoriesData && Array.isArray(categoriesData)) {
      categories = categoriesData;
    }
    
    console.log('Final initialBlogs:', initialBlogs.length, 'items');
    
    return {
      initialBlogs,
      categories
    };
  } catch (error) {
    console.error('Error fetching initial data:', error);
    return {
      initialBlogs: [],
      categories: []
    };
  }
}

export default async function BlogPageContent() {
  const { initialBlogs, categories } = await getInitialData();
  
  console.log('Rendering BlogPageContent with:', initialBlogs.length, 'blogs');
  
  return (
    <>
      <CategoryFilter categories={categories} />
      <BlogList initialBlogs={initialBlogs} />
    </>
  );
}