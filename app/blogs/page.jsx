// app/blogs/page.js
import Link from "next/link";
import { blogsAssets } from "../assets/assets";
import HeroSection from "@/app/components/sections/HeroSection";
import Heading from "@/app/components/ui/Heading";
import BlogCard from "@/app/components/cards/BlogCard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendar } from "@fortawesome/free-solid-svg-icons";

export const metadata = {
  title: 'Himalayan Trekking Blog | Tips, Guides & Adventure Stories',
  description: 'Expert trekking guides, packing tips, destination insights, and adventure stories from the Himalayas. Plan your perfect Nepal, Tibet, or Bhutan trek with Global Nepal Treks.',
  keywords: 'nepal trekking blog, himalayan trekking tips, everest base camp guide, annapurna trek advice, trekking packing list, nepal travel blog',
  openGraph: {
    title: 'Himalayan Trekking Blog | Global Nepal Treks',
    description: 'Expert guides, packing tips, and adventure stories from the heart of the Himalayas.',
    images: [blogsAssets.blogs_cover.src],
  },
};

// This would typically fetch from your database
async function getBlogPosts() {
  // Simulating database fetch - replace with actual data fetching
  return [
    {
      id: 1,
      title: "Best Time to Trek Everest Base Camp: Seasonal Guide",
      slug: "best-time-to-trek-everest-base-camp",
      image: blogsAssets.everest_blog,
      postedDate: "March 15, 2025",
      category: "Trekking Guides"
    },
    {
      id: 2,
      title: "Everest Base Camp Packing List: What to Bring (2025 Guide)",
      slug: "everest-base-camp-packing-list",
      image: blogsAssets.packing_blog,
      postedDate: "March 10, 2025",
      category: "Packing Tips"
    },
    {
      id: 3,
      title: "Annapurna Circuit vs Everest Base Camp: Which Trek is Right for You?",
      slug: "annapurna-circuit-vs-everest-base-camp",
      image: blogsAssets.annapurna_blog,
      postedDate: "March 5, 2025",
      category: "Destination Guides"
    },
    {
      id: 4,
      title: "Altitude Sickness Prevention: Essential Guide for Himalayan Trekkers",
      slug: "altitude-sickness-prevention-guide",
      image: blogsAssets.altitude_blog,
      postedDate: "February 28, 2025",
      category: "Safety"
    },
    {
      id: 5,
      title: "Upper Mustang Trek: A Journey to the Forbidden Kingdom",
      slug: "upper-mustang-trek-guide",
      image: blogsAssets.mustang_blog,
      postedDate: "February 20, 2025",
      category: "Destination Guides"
    },
    {
      id: 6,
      title: "Tea House Trekking in Nepal: What to Expect",
      slug: "tea-house-trekking-nepal-guide",
      image: blogsAssets.teahouse_blog,
      postedDate: "February 12, 2025",
      category: "Beginner Guides"
    },
    {
      id: 7,
      title: "Trekking in Bhutan: Everything You Need to Know",
      slug: "bhutan-trekking-complete-guide",
      image: blogsAssets.bhutan_blog,
      postedDate: "February 5, 2025",
      category: "Destination Guides"
    },
    {
      id: 8,
      title: "Nepal Travel Budget: How Much Does a Trek Cost?",
      slug: "nepal-trekking-budget-guide",
      image: blogsAssets.budget_blog,
      postedDate: "January 28, 2025",
      category: "Planning"
    },
    {
      id: 9,
      title: "Langtang Valley Trek: The Hidden Gem of Nepal",
      slug: "langtang-valley-trek-guide",
      image: blogsAssets.langtang_blog,
      postedDate: "January 15, 2025",
      category: "Destination Guides"
    },
    {
      id: 10,
      title: "Manaslu Circuit Trek: The Untamed Wilderness",
      slug: "manaslu-circuit-trek-guide",
      image: blogsAssets.manaslu_blog,
      postedDate: "January 8, 2025",
      category: "Destination Guides"
    },
    {
      id: 11,
      title: "Tibet Travel Guide: Everything You Need to Know",
      slug: "tibet-travel-guide",
      image: blogsAssets.tibet_blog,
      postedDate: "December 20, 2024",
      category: "Destination Guides"
    },
    {
      id: 12,
      title: "Nepal Cultural Tours: Beyond the Trekking Trails",
      slug: "nepal-cultural-tours-guide",
      image: blogsAssets.culture_blog,
      postedDate: "December 10, 2024",
      category: "Cultural Guides"
    }
  ];
}

// Get unique categories
async function getCategories() {
  const posts = await getBlogPosts();
  const categories = [...new Set(posts.map(post => post.category))];
  return categories;
}

export default async function BlogsPage() {
  const blogPosts = await getBlogPosts();
  const categories = await getCategories();

  return (
    <main>
      <HeroSection 
        image={blogsAssets.blogs_cover.src} 
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

      {/* Categories Filter */}
      <section className="py-8 bg-white border-y border-gray-100">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-wrap items-center justify-center gap-3">
            <span className="text-gray-700 font-medium">Browse by Topic:</span>
            <Link 
              href="/blogs" 
              className="bg-primary-color-dark text-white px-4 py-2 rounded-full text-sm hover:bg-primary-color transition"
            >
              All Posts
            </Link>
            {categories.map((category) => (
              <Link 
                key={category}
                href={`/blogs/category/${category.toLowerCase().replace(/\s+/g, '-')}`}
                className="bg-gray-100 text-gray-700 px-4 py-2 rounded-full text-sm hover:bg-gray-200 transition"
              >
                {category}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Post - Using your BlogCard style but larger */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <Heading 
            title={"Featured Story"} 
            titleClass={"text-center mb-8"} 
          />
          
          <div className="grid md:grid-cols-2 gap-8 items-center bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="relative h-64 md:h-80 overflow-hidden">
              <img
                src={blogPosts[0].image}
                alt={blogPosts[0].title}
                className="object-cover w-full h-full transition-transform duration-300 hover:scale-105"
                loading="lazy"
              />
            </div>
            <div className="p-6 md:p-8">
              <div className="flex items-center gap-3 mb-3">
                <span className="bg-accent-color text-white text-xs px-3 py-1 rounded-full">
                  {blogPosts[0].category}
                </span>
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <FontAwesomeIcon icon={faCalendar} className="text-primary-color-dark" />
                  <span>{blogPosts[0].postedDate}</span>
                </div>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                <Link href={`/blogs/${blogPosts[0].slug}`} className="hover:text-primary-color-dark transition">
                  {blogPosts[0].title}
                </Link>
              </h2>
              <p className="text-gray-600 mb-6">
                {blogPosts[0].title.includes("Best Time") ? "Complete guide to choosing the perfect season for your Everest Base Camp trek. Spring vs Autumn - pros, cons, weather, crowds, and photography tips." : 
                 blogPosts[0].title.includes("Packing") ? "Complete packing checklist for EBC trek. Gear recommendations, clothing layers, essential items, and what NOT to bring." :
                 "Detailed guide to help you plan your perfect Himalayan adventure."}
              </p>
              <Link 
                href={`/blogs/${blogPosts[0].slug}`}
                className="inline-block bg-primary-color-dark text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-color transition"
              >
                Read Full Article
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Blog Grid - Using your BlogCard component */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <Heading 
            title={"Latest Articles"} 
            titleClass={"text-center mb-10"} 
          />
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {blogPosts.map((post) => (
              <BlogCard key={post.id} blog={post} />
            ))}
          </div>
        </div>
      </section>

      {/* Popular Topics */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <Heading 
            title={"Popular Topics"} 
            titleClass={"text-center mb-8"} 
          />
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link 
              href="/blogs/tag/everest-base-camp"
              className="bg-white p-6 rounded-lg text-center shadow-sm hover:shadow-md transition border border-gray-100"
            >
              <h3 className="font-bold text-gray-900 mb-1">Everest Base Camp</h3>
              <p className="text-sm text-gray-500">12 articles</p>
            </Link>
            <Link 
              href="/blogs/tag/annapurna"
              className="bg-white p-6 rounded-lg text-center shadow-sm hover:shadow-md transition border border-gray-100"
            >
              <h3 className="font-bold text-gray-900 mb-1">Annapurna</h3>
              <p className="text-sm text-gray-500">8 articles</p>
            </Link>
            <Link 
              href="/blogs/tag/packing-tips"
              className="bg-white p-6 rounded-lg text-center shadow-sm hover:shadow-md transition border border-gray-100"
            >
              <h3 className="font-bold text-gray-900 mb-1">Packing Tips</h3>
              <p className="text-sm text-gray-500">6 articles</p>
            </Link>
            <Link 
              href="/blogs/tag/altitude-sickness"
              className="bg-white p-6 rounded-lg text-center shadow-sm hover:shadow-md transition border border-gray-100"
            >
              <h3 className="font-bold text-gray-900 mb-1">Altitude Safety</h3>
              <p className="text-sm text-gray-500">4 articles</p>
            </Link>
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="py-16 bg-secondary-color text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 font-montserrat">
                Never Miss a Story
            </h2>
            <p className="text-white/90 mb-8 text-lg">
                Subscribe to our newsletter and get trekking tips, destination guides, and special offers straight to your inbox.
            </p>
            
            <form className="flex flex-col gap-2 justify-center md:items-center md:flex-row">
                <input type="text" placeholder="Full Name" className="px-5 py-2 border border-gray-300 focus:outline-primary-color-dark" />
                <input type="email" placeholder="Email" className="px-5 py-2 border border-gray-300 focus:outline-primary-color-dark" />
                <button className="px-5 py-2 text-white bg-primary-color-dark">
                    Subscribe
                </button>
            </form>

            <p className="text-white/70 text-sm mt-4">
                We respect your privacy. Unsubscribe anytime.
            </p>
        </div>
      </section>
    </main>
  );
}