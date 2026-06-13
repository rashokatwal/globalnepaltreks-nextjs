// app/(main)/page.jsx (server component)
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faArrowRight,
  faCircleCheck, 
  faClipboardList,
  faLeaf, 
  faMountain, 
  faPersonHiking, 
  faRoute, 
  faSeedling, 
  faShieldAlt, 
  faStar, 
  faStarHalfStroke 
} from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import Image from "next/image";
import PackageCard from "../components/cards/PackageCard";
import Heading from "../components/ui/Heading";
import { homeAssets, logos } from "../assets/assets";
import HomeClientWrapper from "./HomeClientWrapper";

// Generate metadata for SEO
export async function generateMetadata() {
  return {
    title: 'Global Nepal Treks | Best Trekking & Tour Agency in Nepal',
    description: 'Experience authentic Himalayan trekking with expert local guides. Best prices for Everest Base Camp, Annapurna Circuit, and more. Book your adventure today!',
    keywords: 'nepal trekking, everest base camp, annapurna circuit, nepal tour agency, himalayan trekking',
    openGraph: {
      title: 'Global Nepal Treks | Best Trekking & Tour Agency in Nepal',
      description: 'Experience authentic Himalayan trekking with expert local guides.',
      images: [homeAssets.home_cover.src],
      url: 'https://globalnepaltreks.com',
      type: 'website',
    },
  };
}

// Fetch all data on the server
async function getHomepageData() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  
  try {
    // Run all API calls in parallel
    const [
      reviewsRes,
      bestSellingRes,
      featuredRes,
      adventureRes,
      luxuryRes,
      blogsRes
    ] = await Promise.all([
      fetch(`${baseUrl}/api/reviews?limit=10`, { next: { revalidate: 3600 } }),
      fetch(`${baseUrl}/api/packages?limit=4&best_selling=true`, { next: { revalidate: 3600 } }),
      fetch(`${baseUrl}/api/packages?limit=4&featured=true`, { next: { revalidate: 3600 } }),
      fetch(`${baseUrl}/api/packages?limit=4&adventure=true`, { next: { revalidate: 3600 } }),
      fetch(`${baseUrl}/api/packages?limit=4&luxury=true`, { next: { revalidate: 3600 } }),
      fetch(`${baseUrl}/api/blogs?limit=4`, { next: { revalidate: 3600 } })
    ]);

    const [reviewsData, bestSellingData, featuredData, adventureData, luxuryData, blogsData] = await Promise.all([
      reviewsRes.json(),
      bestSellingRes.json(),
      featuredRes.json(),
      adventureRes.json(),
      luxuryRes.json(),
      blogsRes.json()
    ]);

    return {
      reviews: reviewsData.success ? (reviewsData.data || []) : [],
      bestSellingPackages: bestSellingData.success ? (bestSellingData.data || []) : [],
      featuredPackages: featuredData.success ? (featuredData.data || []) : [],
      adventurePackages: adventureData.success ? (adventureData.data || []) : [],
      luxuryPackages: luxuryData.success ? (luxuryData.data || []) : [],
      blogs: blogsData.success ? (blogsData.data?.data || []) : [],
    };
  } catch (error) {
    console.error("Failed to fetch homepage data:", error);
    return {
      reviews: [],
      bestSellingPackages: [],
      featuredPackages: [],
      adventurePackages: [],
      luxuryPackages: [],
      blogs: [],
    };
  }
}

// Static data definitions
const stats = [
  { number: 15, symbol: "+", label: "Years of Experience" },
  { number: 1000, symbol: "+", label: "Successful Treks" },
  { number: 100, symbol: "+", label: "Tour Packages" }
];

const differentActivitiesWeOffer = [
  {
    title: "Trekking",
    image: homeAssets.trekking,
    type: "Adventure",
    color: "#098B63",
    link: "/nepal/trekking",
    description: "Customizable routes, difficulty levels, and schedules tailored to your preferences and fitness level."
  },
  {
    title: "Tours",
    image: homeAssets.tours,
    type: "Culture",
    color: "#255DD8",
    link: "/nepal/tours",
    description: "Immersive cultural experiences with expert guides and authentic local encounters."
  },
  {
    title: "Rafting",
    image: homeAssets.rafting,
    type: "Extreme",
    color: "#0C87A5",
    link: "/nepal/rafting",
    description: "Thrilling white water adventures with professional safety equipment and guides."
  },
  {
    title: "Peak Climbing",
    image: homeAssets.peak_climbing,
    type: "Expert",
    color: "#C86F08",
    link: "/nepal/peak-climbing",
    description: "Professional guided ascents with specialized equipment and experienced Sherpa teams."
  },
  {
    title: "Heli Tour",
    image: homeAssets.heli_tours,
    type: "Luxury",
    color: "#852ED3",
    link: "/nepal/heli-tour",
    description: "Breathtaking aerial views of the Himalayas with luxury accommodations and services."
  }
];

const whyChooseUs = [
  {
    title: "Local Mountain Experts",
    description: "Experienced guides with deep knowledge of Himalayan terrain and culture.",
    icon: faMountain
  },
  {
    title: "Safety & Professional Standards",
    description: "Certified staff, emergency protocols, and high-altitude preparedness.",
    icon: faShieldAlt
  },
  {
    title: "Authentic Trekking Experiences",
    description: "Carefully curated routes beyond typical tourist paths.",
    icon: faPersonHiking
  },
  {
    title: "Personalized Itineraries",
    description: "Trips tailored to your pace, fitness level, and travel goals.",
    icon: faClipboardList
  },
  {
    title: "Responsible Tourism",
    description: "Eco-conscious operations that protect nature and support local communities.",
    icon: faSeedling
  },
  {
    title: "Proven Track Record",
    description: "Hundreds of successful treks and satisfied global clients.",
    icon: faCircleCheck
  },
];

const countries = {
  1: { name: "Nepal", slug: "nepal" },
  2: { name: "Tibet", slug: "tibet" },
  3: { name: "Bhutan", slug: "bhutan" },
};

const activities = {
  1: { name: "Trekking", slug: "trekking" },
  2: { name: "Tours", slug: "tours" },
  3: { name: "Rafting", slug: "rafting" },
  4: { name: "Peak Climbing", slug: "peak-climbing" },
  5: { name: "Heli Tour", slug: "heli-tour" },
  6: { name: "Jungle Safari", slug: "jungle-safari" },
};

// Helper functions
const formatPackageForCard = (pkg) => ({
  id: pkg.id,
  image: pkg.featured_image || "/images/placeholder.jpg",
  country: pkg.country_name || "Nepal",
  title: pkg.title,
  price: Math.round(parseFloat(pkg.price)),
  availability: pkg.best_season || "All Year",
  duration: `${pkg.duration_days} Days`,
  link: `/${countries[pkg.country_id]?.slug || "nepal"}/${activities[pkg.activity_id]?.slug || "trekking"}/${pkg.slug}`,
  description: pkg.short_description || "Experience the Himalayas with our expert guides."
});

const formatBlogForCard = (blog) => ({
  id: blog.id,
  image: blog.featured_image || "/images/placeholder.jpg",
  postedDate: new Date(blog.published_at).toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric', 
    year: 'numeric' 
  }),
  title: blog.title,
  slug: blog.slug
});

export default async function Home() {
  const homepageData = await getHomepageData();
  
  const {
    reviews = [],
    bestSellingPackages = [],
    featuredPackages = [],
    adventurePackages = [],
    luxuryPackages = [],
    blogs = []
  } = homepageData;

  // Format packages for display
  const formattedBestSelling = bestSellingPackages.slice(0, 4).map(formatPackageForCard);
  const formattedFeatured = featuredPackages.slice(0, 4).map(formatPackageForCard);
  const formattedAdventure = adventurePackages.slice(0, 4).map(formatPackageForCard);
  const formattedLuxury = luxuryPackages.slice(0, 4).map(formatPackageForCard);
  const formattedBlogs = blogs.slice(0, 4).map(formatBlogForCard);

  return (
    <main>
      {/* Hero Section */}
      <section className="relative">
        <div 
          className="flex items-center justify-center w-full h-[80vh] bg-fixed bg-top bg-no-repeat bg-cover" 
          style={{ backgroundImage: `url(${homeAssets.home_cover.src})` }}
        >
          <div className="absolute w-full h-full bg-black/20"></div>
        </div>

        <div className="absolute z-10 flex flex-col items-center w-full px-5 transform -translate-x-1/2 -translate-y-1/3 md:translate-y-0 md:mx-0 md:w-fit top-1/2 left-1/2">
          <h1 className="text-3xl font-semibold text-center text-white md:text-4xl">Beyond Travel, Into Relationships.</h1>
          <p className="mt-4 text-center text-white text-md md:text-lg">Hospitality, Authenticity, Connection, Sustainability.</p>
          
          {/* Search form - server component friendly */}
          <form action="/search" method="GET" className="relative duration-200 overflow-hidden w-full my-5">
            <input
              type="text"
              name="q"
              placeholder="Search treks, destinations..."
              className="w-full px-4 py-3 pr-10 rounded-full border-2 bg-white text-sm text-gray-800 focus:outline-none focus:border-primary-color-dark transition-colors"
            />
            <button 
              type="submit"
              className="absolute cursor-pointer right-1 top-1/2 transform -translate-y-1/2 bg-primary-color-dark text-white p-2 rounded-full h-10 w-10 hover:bg-primary-color transition-colors"
            >
              <FontAwesomeIcon icon={faRoute} className="w-3 h-3" />
            </button>
          </form>
          
          <div className="w-full gap-5 md:w-fit md:flex">
            <Link 
              href="/destinations" 
              className="block w-full px-6 py-3 mt-6 text-sm font-medium text-center text-white duration-200 rounded md:w-fit whitespace-nowrap md:text-md bg-primary-color-dark hover:bg-primary-color"
            >
              Explore Destinations
            </Link>

            <Link 
              href="/contact" 
              className="block w-full px-6 py-3 mt-6 text-sm font-medium text-center text-white duration-200 border-2 rounded whitespace-nowrap md:text-md md:w-fit border-primary-color-dark hover:bg-primary-color-dark"
            >
              Request Info
            </Link>
          </div>
        </div>
      </section>

      {/* Feature boxes */}
      <section className="py-5 bg-white">
        <div className="grid px-4 md:px-0 mx-auto mt-5 lg:grid-cols-4 md:grid-cols-2 max-w-7xl gap-x-10 gap-y-5">
          <div className="p-0 flex items-center gap-5">
            <FontAwesomeIcon icon={faPersonHiking} className="text-3xl text-accent-color" />
            <div>
              <h2 className="font-medium text-md">Custom Trek Planning</h2>
              <p className="text-sm md:text-md">Tailor routes, difficulty levels, and schedules to your needs.</p>
            </div>
          </div>
          <div className="p-0 flex items-center gap-5">
            <FontAwesomeIcon icon={faRoute} className="text-3xl text-accent-color" />
            <div>
              <h2 className="font-medium text-md">Handpicked Trek Routes</h2>
              <p className="text-sm md:text-md">From beginner-friendly trails to extreme high-altitude expeditions.</p>
            </div>
          </div>
          <div className="p-0 flex items-center gap-5">
            <FontAwesomeIcon icon={faShieldAlt} className="text-3xl text-accent-color" />
            <div>
              <h2 className="font-medium text-md">Safety First Approach</h2>
              <p className="text-sm md:text-md">Emergency protocols, oxygen supply, satellite phones, and insurance support.</p>
            </div>
          </div>
          <div className="p-0 flex items-center gap-5">
            <FontAwesomeIcon icon={faLeaf} className="text-3xl text-accent-color" />
            <div>
              <h2 className="font-medium text-md">Eco-Friendly Travel</h2>
              <p className="text-sm md:text-md">Sustainable and responsible travel practices for all trekkers.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Best Selling Packages */}
      <section className="px-4 py-10 mx-auto md:max-w-7xl sm:px-4 lg:px-0">
        <div className="relative z-10 py-10">
          <Heading title={"Best Selling Packages"} subtitle={'"Experience the pinnacle of the Himalayas with our top-rated, expert-led trekking adventures."'} titleClass={"text-center"} subtitleClass={"text-center"} />
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {formattedBestSelling.map((pkg) => (
            <PackageCard key={pkg.id} packageDetails={pkg} />
          ))}
        </div>
        <div className="flex justify-center mt-8 sm:mt-12 md:mt-16">
          <Link 
            href="/nepal/trekking" 
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold tracking-wide transition duration-200 rounded-md group sm:text-base text-primary-color-dark hover:text-secondary-color"
          >
            Explore More Packages
            <FontAwesomeIcon 
              icon={faArrowRight} 
              className="transition-transform duration-200 group-hover:translate-x-1" 
            />
          </Link>
        </div>
      </section>

      {/* Featured Packages */}
      <section className="py-10 bg-dark-section">
        <div className="px-4 mx-auto md:max-w-7xl sm:px-4 lg:px-0">
          <div className="relative z-10 px-10 py-10">
            <Heading title={"Featured Packages"} subtitle={'"Peak performance meets total peace of mind - everything you need for the ultimate ascent."'} titleClass={"text-center"} subtitleClass={"text-center"} />
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {formattedFeatured.map((pkg) => (
              <PackageCard key={pkg.id} packageDetails={pkg} />
            ))}
          </div>
          <div className="flex justify-center mt-8 sm:mt-12 md:mt-16">
            <Link 
              href="/nepal/tours" 
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold tracking-wide transition duration-200 rounded-md group sm:text-base text-primary-color-dark hover:text-secondary-color"
            >
              More Destinations
              <FontAwesomeIcon 
                icon={faArrowRight} 
                className="transition-transform duration-200 group-hover:translate-x-1" 
              />
            </Link>
          </div>
        </div>
      </section>

      {/* Luxury Packages */}
      <section className="py-10 bg-white">
        <div className="px-4 mx-auto md:max-w-7xl sm:px-4 lg:px-0">
          <div className="relative z-10 px-10 py-10">
            <Heading title={"Luxury Packages"} subtitle={'"Savor the grandeur of Nepal from the comfort of a curated, premier experience."'} titleClass={"text-center"} subtitleClass={"text-center"} />
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {formattedLuxury.map((pkg) => (
              <PackageCard key={pkg.id} packageDetails={pkg} />
            ))}
          </div>
          <div className="flex justify-center mt-8 sm:mt-12 md:mt-16">
            <Link 
              href="/nepal/tours" 
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold tracking-wide transition duration-200 rounded-md group sm:text-base text-primary-color-dark hover:text-secondary-color"
            >
              More Destinations
              <FontAwesomeIcon 
                icon={faArrowRight} 
                className="transition-transform duration-200 group-hover:translate-x-1" 
              />
            </Link>
          </div>
        </div>
      </section>

      {/* Adventure Packages */}
      <section className="py-10 bg-dark-section">
        <div className="px-4 mx-auto md:max-w-7xl sm:px-4 lg:px-0">
          <div className="relative z-10 px-10 py-10">
            <Heading title={"Adventure Packages"} subtitle={'"Transform every step into a story of courage and discovery"'} titleClass={"text-center"} subtitleClass={"text-center"} />
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {formattedAdventure.map((pkg) => (
              <PackageCard key={pkg.id} packageDetails={pkg} />
            ))}
          </div>
          <div className="flex justify-center mt-8 sm:mt-12 md:mt-16">
            <Link 
              href="/nepal/tours" 
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold tracking-wide transition duration-200 rounded-md group sm:text-base text-primary-color-dark hover:text-secondary-color"
            >
              More Destinations
              <FontAwesomeIcon 
                icon={faArrowRight} 
                className="transition-transform duration-200 group-hover:translate-x-1" 
              />
            </Link>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-0 bg-white">
        <div className="flex flex-col-reverse md:flex-col items-center gap-10 justify-center px-5 mx-auto lg:p-10 lg:flex-row max-w-7xl">
          <div className="flex-1">
            <Heading title={"Who We Are?"} subtitle={"Trekking and Tour Agency in Nepal"} titleClass={"md:text-left text-center"} subtitleClass={"md:text-left text-center"} />
            <p className="mt-5 mb-4 text-sm font-medium text-center md:text-left md:text-md">
              At Global Nepal Treks, we do more than organize trekking itineraries - we invite you to experience Nepal as our home. As a locally based trekking company in Nepal, we specialize in creating authentic, safe, and personalized trekking experiences led by experienced local guides who understand the mountains, the culture, and the people.
              <br /><br />
              From the legendary Everest Base Camp Trek, to the remote and culturally rich Upper Mustang Trek, and the scenic trails of the Annapurna Trekking region, every journey is carefully designed to match your pace, interests, and comfort. Whether you are a first-time trekker or an experienced adventurer, we ensure that each trek is well-planned, responsibly operated, and deeply rewarding.
              <br /><br />
              Our team takes pride in our local expertise, attention to safety, and genuine hospitality. We believe trekking in Nepal is not just about reaching a destination, but about meaningful connections - with nature, local communities, and fellow travelers. With Global Nepal Treks, you travel with people who care, gaining memories that last a lifetime and experiencing the Himalayas in a way that feels personal, trustworthy, and truly unforgettable.                        
            </p>
            <div className="container px-4 py-8 mx-auto md:py-10">
              <div className="grid grid-cols-2 gap-6 py-6 border-t border-b border-gray-400 md:grid-cols-3 md:gap-8">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="flex items-center justify-center">
                      <div className="flex items-baseline gap-1 mb-2">
                        <span className="text-2xl font-semibold text-right sm:text-3xl md:text-4xl lg:text-5xl text-primary-color-dark">
                          {stat.number}
                        </span>
                        <span className="text-xl font-bold sm:text-2xl md:text-3xl lg:text-4xl text-primary-color-dark">
                          {stat.symbol}
                        </span>
                      </div>
                    </div>
                    <p className="text-sm font-semibold sm:text-base md:text-lg lg:text-lg whitespace-nowrap">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="flex-1">
            <Image 
              src={homeAssets.home_about_image.src} 
              className="w-150 h-auto mx-auto" 
              alt="About Global Nepal Treks"
              width={700}
              height={500}
              priority
            />
          </div>
        </div>
      </section>

      {/* Testimonials Section - Using client wrapper for Swiper */}
      <HomeClientWrapper 
        reviews={reviews}
        logos={logos}
        type="testimonials"
      />

      {/* Activities Section */}
      <section className="relative bg-fixed bg-center bg-no-repeat bg-cover" style={{ backgroundImage: `url(${homeAssets.annapurna_background.src})` }}>
        <div className="absolute w-full h-full bg-black/50"></div>
        <div className="relative z-10 px-10 py-20">
          <Heading title={"Adventure Awaits"} subtitle={"Different Activities we offer"} subtitleClass={"text-white"} />
          <div className="grid grid-cols-1 gap-6 px-4 mx-auto mt-12 md:px-6 lg:px-8 max-w-8xl sm:grid-cols-2 lg:grid-cols-5">
            {differentActivitiesWeOffer.map((activity, index) => (
              <Link key={index} href={activity.link} className="relative overflow-hidden transition-all duration-300 bg-white rounded-md shadow-lg group hover:shadow-2xl hover:-translate-y-1">
                <div className="relative h-48 overflow-hidden">
                  <Image 
                    src={activity.image} 
                    alt={`${activity.title} in Nepal`} 
                    className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
                    width={300}
                    height={200}
                    priority
                  />
                  <div className="absolute inset-0 transition-opacity duration-300 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-70"></div>
                  <div className="absolute bottom-4 left-4">
                    <span className="inline-flex items-center px-3 py-1 text-xs font-semibold text-white rounded-full backdrop-blur-sm" style={{backgroundColor: activity.color}}>
                      {activity.type}
                    </span>
                  </div>
                </div>
                <div className="p-5">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-bold text-gray-900 transition-colors duration-300 group-hover:text-primary-color-dark">{activity.title}</h3>
                    <svg className="w-5 h-5 transition-opacity duration-300 opacity-0 text-primary-color-dark group-hover:opacity-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                    </svg>
                  </div>
                  <p className="text-sm leading-relaxed text-gray-600">{activity.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="pb-24 pt-14 bg-white">
        <div className="mx-auto max-w-7xl">
          <div className="relative z-10 px-10 py-10">
            <Heading title={"Why Choose Us?"} subtitle={"Expert Guidance with Thrilling Adventures"} titleClass={"text-center"} subtitleClass={"text-center"} />
          </div>
          <div className="grid gap-6 mx-5 md:grid-cols-2 lg:grid-cols-3">
            {whyChooseUs.map((point, index) => (
              <div key={index} className="flex items-center gap-5 p-5 border rounded-md border-accent-color">
                <div>
                  <FontAwesomeIcon icon={point.icon} className="text-4xl text-primary-color-dark" />
                </div>
                <div>
                  <h3 className="mb-2 font-semibold text-md">{point.title}</h3>
                  <p className="text-sm md:text-md">{point.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>  

      {/* CTA Section */}
      <section className="relative bg-fixed bg-center bg-no-repeat bg-cover" style={{ backgroundImage: `url(${homeAssets.guides_background.src})` }}>
        <div className="absolute w-full h-full bg-black/60"></div>
        <div className="px-4 py-40 mx-auto md:max-w-7xl sm:px-6 lg:px-8">
          <div className="relative z-10 max-w-3xl">
            <h2 className="mb-5 text-5xl font-semibold text-white">
              Enhance your trekking skills with our expert guides
            </h2>
            <p className="text-white ">
              Gain confidence and essential trekking skills through personalized guidance from local experts. Learn the secrets of safe, successful Himalayan adventures.
            </p>
            <Link 
              href="/contact" 
              className="inline-block w-full px-6 py-3 mt-6 text-sm font-medium text-center text-white duration-200 border-2 rounded whitespace-nowrap md:text-md md:w-fit border-primary-color-dark hover:bg-primary-color-dark"
            >
              Request Info
            </Link>
          </div>
        </div>
      </section>          

      {/* Blog Section - Using client wrapper for Swiper */}
      <HomeClientWrapper 
        blogs={formattedBlogs}
        type="blogs"
      />

      {/* Partners Section */}
      <section className="pb-10 pt-10 bg-dark-section">
        <div className="mx-auto max-w-6xl">
          <div className="relative z-10 px-10 py-10">
            <Heading title={"Partners"} titleClass={"text-center text-secondary-color"} />
          </div>
          <div className="w-fit mx-auto grid gap-12 md:gap-10 md:grid-cols-2 lg:grid-cols-4">
            <Link href={"https://www.cooperatingvolunteers.com/"} target="_blank" className="block transition-transform w-fit hover:scale-105">
              <Image 
                src={logos.cooperating_volunteer_logo} 
                className="w-32 mx-auto sm:w-36 md:w-25" 
                alt="Cooperating Volunteer Logo"
              />
            </Link>
            <Link href={"https://www.globalvolunteernepal.org/"} target="_blank" className="block transition-transform w-fit hover:scale-105">
              <Image 
                src={logos.global_volunteer_nepal_logo} 
                className="w-32 mx-auto sm:w-36 md:w-25" 
                alt="Global Volunteer Nepal Logo"
              />
            </Link>
            <Link href={"https://www.aimatravels.com/"} target="_blank" className="block transition-transform w-fit hover:scale-105">
              <Image 
                src={logos.aaima_logo} 
                className="w-32 mx-auto sm:w-36 md:w-25" 
                alt="AAIMA Logo"
              />
            </Link>
            <Link href={"https://www.pvnnepal.org"} target="_blank" className="block transition-transform w-fit hover:scale-105">
              <Image 
                src={logos.pvn_nepal_logo} 
                className="w-32 mx-auto sm:w-36 md:w-25" 
                alt="PVN Nepal Logo"
              />
            </Link>
          </div>
        </div>
      </section>  
    </main>
  );
}