/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  async rewrites() {
    return [
      {
        source: '/sitemap',
        destination: '/sitemap-page',
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'globalnepaltreks.com',
        port: '',
        pathname: '/storage/testimonials/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
      },
      {
        protocol: 'http',
        hostname: 'globalnepaltreks.vercel.app',
      },
      {
        protocol: 'https',
        hostname: 'images.pexels.com',
        port: '',
        pathname: '/photos/**',
      },
      // Add other domains you use
    ],
  },
  async redirects() {
    return [
      {
        source: '/blog/:slug*',
        destination: '/blogs',
        permanent: true,
      },
    ];
  }
};

export default nextConfig;
