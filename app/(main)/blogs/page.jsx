// app/blogs/page.js
import { Suspense } from 'react';
import { blogsAssets } from "../../assets/assets";
import HeroSection from "@/app/components/sections/HeroSection";
import Heading from "@/app/components/ui/Heading";
import NewsletterSection from "@/app/components/sections/NewsletterSection";
import BlogPageContent from './page-content';
import Loading from './loading';
import Script from 'next/script';

export const metadata = {
  title: 'Himalayan Trekking Blog | Tips, Guides & Adventure Stories',
  description: 'Expert trekking guides, packing tips, destination insights, and adventure stories from the Himalayas.',
  keywords: 'nepal trekking blog, himalayan trekking tips, everest base camp guide, annapurna circuit blog, langtang valley trekking, nepal travel blog, himalayan adventure stories, trekking gear guide, nepal trekking seasons, travel tips nepal, bhutan trekking blog, tibet travel blog',
  openGraph: {
    title: 'Himalayan Trekking Blog | Expert Guides & Adventure Stories | Global Nepal Treks',
    description: 'Expert trekking guides, packing tips, destination insights, and adventure stories from the Himalayas. Written by experienced Sherpa guides.',
    images: [blogsAssets.blogs_cover?.src || '/images/blog-cover.jpg'],
    type: 'website',
    locale: 'en_US',
    siteName: 'Global Nepal Treks',
    url: 'https://globalnepaltreks.com/blogs',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Himalayan Trekking Blog | Expert Guides & Adventure Stories',
    description: 'Expert trekking guides, packing tips, destination insights, and adventure stories from the Himalayas.',
    images: [blogsAssets.blogs_cover?.src || '/images/blog-cover.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: "https://globalnepaltreks.com/blogs",
  },
};

// Generate Blog List Page Schema
function generateBlogListPageSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Blog",
    "name": "Himalayan Trekking Blog | Tips, Guides & Adventure Stories",
    "description": "Expert trekking guides, packing tips, destination insights, and adventure stories from the Himalayas. Written by experienced Sherpa guides and trekking experts.",
    "url": "https://globalnepaltreks.com/blogs",
    "publisher": {
      "@type": "Organization",
      "name": "Global Nepal Treks",
      "logo": {
        "@type": "ImageObject",
        "url": "https://globalnepaltreks.com/logo.png"
      }
    },
    "author": {
      "@type": "Organization",
      "name": "Global Nepal Treks",
      "url": "https://globalnepaltreks.com"
    },
    "inLanguage": "en",
    "about": {
      "@type": "Thing",
      "name": "Himalayan Trekking",
      "sameAs": [
        "https://en.wikipedia.org/wiki/Trekking",
        "https://en.wikipedia.org/wiki/Himalayas"
      ]
    },
    "keywords": "nepal trekking, himalayan trekking, everest base camp, annapurna circuit, langtang valley, trekking guides, packing tips, himalayan adventure"
  };
}

// Generate BreadcrumbList Schema
function generateBreadcrumbSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://globalnepaltreks.com"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Blog",
        "item": "https://globalnepaltreks.com/blogs"
      }
    ]
  };
}

// Generate Organization Schema
function generateOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    "name": "Global Nepal Treks",
    "alternateName": "Global Nepal Treks Pvt. Ltd.",
    "description": "Government-licensed trekking agency offering authentic Himalayan treks and tours across Nepal, Tibet, and Bhutan.",
    "url": "https://globalnepaltreks.com",
    "logo": "https://globalnepaltreks.com/logo.png",
    "email": "info@globalnepaltreks.com",
    "telephone": "+977-9744258519",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Bikramshila Mahavihar (Bhagawan Bahal), Tham Bahee Road",
      "addressLocality": "Kathmandu",
      "addressCountry": "Nepal",
      "postalCode": "44600"
    },
    "sameAs": [
      "https://www.facebook.com/globalnepaltreks",
      "https://www.instagram.com/globalnepaltreks",
      "https://www.linkedin.com/company/global-nepal-treks"
    ],
    "priceRange": "$$",
    "areaServed": ["Nepal", "Tibet", "Bhutan"]
  };
}

// Generate Search Action Schema (for blog search)
function generateSearchActionSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "url": "https://globalnepaltreks.com",
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": "https://globalnepaltreks.com/blogs?search={search_term_string}"
      },
      "query-input": "required name=search_term_string"
    }
  };
}

export default function BlogsPage() {
  // Generate all schemas
  const blogListPageSchema = generateBlogListPageSchema();
  const breadcrumbSchema = generateBreadcrumbSchema();
  const organizationSchema = generateOrganizationSchema();
  const searchActionSchema = generateSearchActionSchema();

  return (
    <main>
      {/* JSON-LD Structured Data */}
      <Script
        id="blog-list-page-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogListPageSchema) }}
      />
      <Script
        id="breadcrumb-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <Script
        id="organization-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <Script
        id="search-action-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(searchActionSchema) }}
      />
      
      <HeroSection 
        image={blogsAssets.blogs_cover?.src || "/images/blog-cover.jpg"} 
        heading={"Himalayan Trekking Blog"} 
        subheading={"Expert Guides, Packing Tips & Adventure Stories"} 
      />

      {/* Introduction */}
      <section className="py-12 bg-white">
        <div className="max-w-5xl mx-auto px-4">
          <Heading 
            title={"From the Himalayas"} 
            titleClass={"text-center mb-4"} 
          />
          <p className="text-md text-gray-600 leading-relaxed">
            Welcome to the <strong>Global Nepal Treks blog</strong> – your resource for expert trekking advice, 
            destination guides, and stories from the heart of the Himalayas. Written by our experienced 
            <strong> Sherpa guides and trekking experts</strong>, these articles will help you plan the perfect 
            adventure in Nepal, Tibet, and Bhutan.
          </p>
        </div>
      </section>

      {/* Blog Content with Suspense */}
      <Suspense fallback={<Loading />}>
        <BlogPageContent />
      </Suspense>

      {/* Newsletter Section */}
      <NewsletterSection />
    </main>
  );
}