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
  htmlLimitedBots: /.*/,
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
      {
        source: '/blog',
        destination: '/blogs',
        permanent: true,
      },
      {
        source: '/public/:path*',
        destination: '/:path*',
        permanent: true,
      },
      {
        source: '/about-us',
        destination: '/about',
        permanent: true,
      },
      {
        source: '/contact-us',
        destination: '/contact',
        permanent: true,
      },
      {
        source: '/destination/:slug*',
        destination: '/:slug*',
        permanent: true,
      },
      {
        source: '/book-now',
        destination: '/book',
        permanent: true,
      },
      {
        source: '/faqs',
        destination: '/',
        permanent: true,
      },
    ];
  }
};

export default nextConfig;
