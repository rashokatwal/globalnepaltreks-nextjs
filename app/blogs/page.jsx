// app/blogs/page.js
import { Suspense } from 'react';
import { blogsAssets } from "../assets/assets";
import HeroSection from "@/app/components/sections/HeroSection";
import Heading from "@/app/components/ui/Heading";
import NewsletterSection from "@/app/components/sections/NewsletterSection";
import BlogPageContent from './page-content';
import Loading from './loading';

export const metadata = {
  title: 'Himalayan Trekking Blog | Tips, Guides & Adventure Stories',
  description: 'Expert trekking guides, packing tips, destination insights, and adventure stories from the Himalayas.',
  keywords: 'nepal trekking blog, himalayan trekking tips, everest base camp guide',
  openGraph: {
    title: 'Himalayan Trekking Blog | Global Nepal Treks',
    description: 'Expert guides and adventure stories from the heart of the Himalayas.',
    images: [blogsAssets.blogs_cover?.src || '/images/blog-cover.jpg'],
  },
};

export default function BlogsPage() {
  return (
    <main>
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