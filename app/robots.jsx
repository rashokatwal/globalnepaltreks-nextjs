export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/admin/',
        '/private/',
        '/api/',
        '/assets/',
      ],
    },
    sitemap: 'https://globalnepaltreks.com/sitemap.xml',
  };
}