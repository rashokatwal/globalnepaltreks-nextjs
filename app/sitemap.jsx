export default async function sitemap() {
  const baseUrl = 'https://globalnepaltreks.com';
  const treks = await getTreks();
  const blogs = await getBlogs();
  
  return [
    {
      url: baseUrl,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
    },
    
    ...treks.map(trek => ({
      url: `${baseUrl}/nepal/trekking/${trek.slug}`,
      lastModified: trek.updatedAt,
    })),

    ...blogs.map(blog => ({
      url: `${baseUrl}/blogs/${blog.slug}`,
      lastModified: blog.updatedAt,
    })),
  ];
}