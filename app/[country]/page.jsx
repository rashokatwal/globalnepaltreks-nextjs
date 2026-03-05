// app/[country]/page.js
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faMountain, 
  faCalendar, 
  faUsers, 
  faArrowRight,
  faStar,
  faMapMarkedAlt,
  faPersonHiking,
  faWater,
  faTree,
  faHelicopter,
  faMountain as faPeak,
  faClock
} from '@fortawesome/free-solid-svg-icons';
import { blogsAssets } from '@/app/assets/assets';
import Heading from '@/app/components/ui/Heading';
import PackageCard from '@/app/components/cards/PackageCard';

// Map activity icons
const activityIcons = {
  'Trekking': faPersonHiking,
  'Tours': faMapMarkedAlt,
  'Rafting': faWater,
  'Jungle Safari': faTree,
  'Peak Climbing': faPeak,
  'Heli Tour': faHelicopter
};

// Generate metadata for SEO
export async function generateMetadata({ params }) {
  const { country } = await params;
  const countryData = await getCountryData(country);
  
  if (!countryData) {
    return {
      title: 'Country Not Found',
      description: 'The requested country page could not be found.'
    };
  }
  
  const countryName = countryData.name;
  
  return {
    title: countryData.meta_title || `${countryName} Trekking & Tours | Expert Local Guides | Global Nepal Treks`,
    description: countryData.meta_description || `Discover the best trekking and tours in ${countryName} with expert local guides. ✓ 1000+ happy trekkers ✓ Best prices ✓ Customizable itineraries. Book your adventure today!`,
    keywords: `${countryName.toLowerCase()} trekking, ${countryName.toLowerCase()} tours, himalayan trekking, ${countryName.toLowerCase()} travel, ${countryName.toLowerCase()} adventure, everest base camp, annapurna circuit`,
    openGraph: {
      title: `${countryName} Trekking & Tours | Global Nepal Treks`,
      description: countryData.description || `Explore amazing trekking packages in ${countryName} with expert guides.`,
      images: [countryData.featured_image || '/images/country-default.jpg'],
      url: `https://globalnepaltreks.com/${country}`,
      type: 'website',
      siteName: 'Global Nepal Treks',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${countryName} Trekking & Tours | Global Nepal Treks`,
      description: `Discover ${countryName} trekking packages with expert local guides.`,
      images: [countryData.featured_image || '/images/country-default.jpg'],
    },
    alternates: {
      canonical: `https://globalnepaltreks.com/${country}`,
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
  };
}

// Fetch country data
async function getCountryData(countrySlug) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/countries/${countrySlug}?details=true`, {
      next: { revalidate: 3600 }
    });
    
    if (!res.ok) return null;
    
    const data = await res.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching country data:', error);
    return null;
  }
}

// Format number with commas
function formatNumber(num) {
  return num?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") || '0';
}

// Generate JSON-LD structured data
function generateStructuredData(countryData, totalPackages) {
  const baseUrl = 'https://globalnepaltreks.com';
  const countryName = countryData.name;
  const countrySlug = countryData.slug;
  
  return {
    '@context': 'https://schema.org',
    '@type': 'Country',
    name: countryName,
    description: countryData.description,
    url: `${baseUrl}/${countrySlug}`,
    image: countryData.featured_image,
    mainEntityOfPage: {
      '@type': 'CollectionPage',
      name: `${countryName} Trekking & Tours`,
      description: `Discover the best trekking and tours in ${countryName}`,
    },
    hasPart: countryData.activities?.map(activity => ({
      '@type': 'TouristAttraction',
      name: activity.name,
      description: activity.excerpt,
      url: `${baseUrl}/${countrySlug}/${activity.slug}`,
    })),
    offers: {
      '@type': 'AggregateOffer',
      offerCount: totalPackages,
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
    },
  };
}

export default async function CountryPage({ params }) {
  const { country } = await params;
  const countryData = await getCountryData(country);
  
  if (!countryData) {
    notFound();
  }
  
  // Calculate stats
  const totalPackages = countryData.packages?.length || 0;
  const featuredPackages = countryData.packages?.filter(p => p.is_featured === 1)?.length || 0;
  const uniqueActivities = countryData.activities?.length || 0;
  
  // Group packages by activity name
  const packagesByActivity = {};
  
  // Initialize all activities with empty arrays
  if (countryData.activities) {
    countryData.activities.forEach(activity => {
      packagesByActivity[activity.name] = [];
    });
  }
  
  // Group packages by their activity_name
  if (countryData.packages) {
    countryData.packages.forEach(pkg => {
      if (pkg.activity_name) {
        const activityName = pkg.activity_name;
        if (packagesByActivity[activityName]) {
          packagesByActivity[activityName].push(pkg);
        } else {
          // If activity not in the list, create it
          packagesByActivity[activityName] = [pkg];
        }
      }
    });
  }
  
  // Generate structured data
  const structuredData = generateStructuredData(countryData, totalPackages);

  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      {/* BreadcrumbList Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              {
                '@type': 'ListItem',
                position: 1,
                name: 'Home',
                item: 'https://globalnepaltreks.com',
              },
              {
                '@type': 'ListItem',
                position: 2,
                name: countryData.name,
                item: `https://globalnepaltreks.com/${country}`,
              },
            ],
          })
        }}
      />

      <main className="bg-white">
        {/* Hero Section - Full screen image background */}
        <section className="relative min-h-[80vh] bg-gray-900">
          <div 
            className="absolute inset-0 overflow-hidden bg-fixed bg-cover bg-top" 
            style={{ backgroundImage: `url(${countryData.featured_image})` }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent"></div>
          </div>

          {/* Country Title and Quick Info */}
          <div className="absolute bottom-0 left-0 right-0 max-w-7xl mx-auto px-4 pb-16 text-white">
            <div className="flex flex-wrap gap-3 mb-4">
              <span className="bg-primary-color-dark px-3 py-1 rounded-full text-sm font-semibold">
                Country
              </span>
              <span className="bg-accent-color px-3 py-1 rounded-full text-sm font-semibold">
                {countryData.activities?.length || 0} Activities
              </span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-montserrat mb-4 max-w-4xl">
              {countryData.name}
            </h1>
            
            <div className="flex flex-wrap items-center gap-6 text-sm text-gray-200">
              <div className="flex items-center gap-2">
                <FontAwesomeIcon icon={faMountain} className="w-4 h-4" />
                <span>{formatNumber(totalPackages)} Total Packages</span>
              </div>
              <div className="flex items-center gap-2">
                <FontAwesomeIcon icon={faStar} className="w-4 h-4" />
                <span>{featuredPackages} Featured Treks</span>
              </div>
              <div className="flex items-center gap-2">
                <FontAwesomeIcon icon={faUsers} className="w-4 h-4" />
                <span>{uniqueActivities} Activities</span>
              </div>
            </div>
          </div>
        </section>

        {/* Country Description Section */}
        <section className="py-12 bg-white">
        <div className="max-w-5xl mx-auto px-4">
          <p className="text-md text-gray-600 leading-relaxed">
            {countryData.description}
          </p>
        </div>
      </section>

        {/* Activities Overview */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <Heading 
              title={`Popular Activities in ${countryData.name}`} 
              titleClass="text-center mb-4" 
            />
            <p className="text-center text-gray-600 max-w-3xl mx-auto mb-12">
              Choose from our wide range of adventure activities in {countryData.name}
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {countryData.activities?.map((activity) => {
                const activityPackages = packagesByActivity[activity.name] || [];
                const packageCount = activityPackages.length;
                const IconComponent = activityIcons[activity.name] || faPersonHiking;
                
                return (
                  <Link
                    key={activity.id}
                    href={`/${country}/${activity.slug}`}
                    className="group bg-gray-50 rounded-xl p-6 hover:shadow-md transition-all duration-300 hover:-translate-y-1"
                    style={{ borderLeft: `4px solid ${activity.activity_color || '#098B63'}` }}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-12 h-12 rounded-full flex items-center justify-center text-white"
                          style={{ backgroundColor: activity.activity_color || '#098B63' }}
                        >
                          <FontAwesomeIcon icon={IconComponent} className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 group-hover:text-primary-color-dark transition">
                            {activity.name}
                          </h3>
                          <p className="text-sm text-gray-500">{activity.activity_category}</p>
                        </div>
                      </div>
                      <span className="bg-primary-color-dark text-white px-3 py-1 rounded-full text-sm">
                        {packageCount} {packageCount === 1 ? 'Package' : 'Packages'}
                      </span>
                    </div>
                    
                    <p className="text-gray-600 mb-4 line-clamp-2">
                      {activity.excerpt || activity.description}
                    </p>
                    
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Click to explore</span>
                      <FontAwesomeIcon 
                        icon={faArrowRight} 
                        className="w-4 h-4 text-primary-color-dark group-hover:translate-x-2 transition-transform" 
                      />
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* Featured Packages */}
        {featuredPackages > 0 && (
          <section className="py-16 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4">
              <Heading 
                title={`Featured ${countryData.name} Packages`} 
                titleClass="text-center mb-4" 
              />
              <p className="text-center text-gray-600 max-w-3xl mx-auto mb-12">
                Our most popular and highly recommended trekking packages in {countryData.name}
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {countryData.packages
                  ?.filter(pkg => pkg.is_featured === 1)
                  .slice(0, 6)
                  .map((pkg) => {
                    const packageLink = `/${country}/${pkg.activity_slug || 'trekking'}/${pkg.slug}`;

                    return (
                      <PackageCard 
                        key={pkg.id} 
                        packageDetails={{
                          id: pkg.id,
                          title: pkg.title,
                          slug: pkg.slug,
                          country: countryData.name,
                          link: packageLink,
                          image: pkg.featured_image,
                          price: pkg.price,
                          duration: `${pkg.duration_days} Days`,
                          difficulty: pkg.difficulty,
                          short_description: pkg.short_description
                        }} 
                      />
                    );
                  }
                )}
              </div>
              
              {featuredPackages > 6 && (
                <div className="text-center mt-12">
                  <Link
                    href={`/${country}/packages?featured=true`}
                    className="inline-flex items-center gap-2 bg-primary-color-dark text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-color transition group"
                  >
                    View All Featured Packages
                    <FontAwesomeIcon icon={faArrowRight} className="w-4 h-4 group-hover:translate-x-1 transition" />
                  </Link>
                </div>
              )}
            </div>
          </section>
        )}

        {/* All Packages by Activity */}
        {Object.keys(packagesByActivity).length > 0 && (
          <section className="py-16 bg-white">
            <div className="max-w-7xl mx-auto px-4">
              <Heading 
                title={`All Packages in ${countryData.name}`} 
                titleClass="text-center mb-4" 
              />
              <p className="text-center text-gray-600 max-w-3xl mx-auto mb-12">
                Browse our complete collection of trekking and tour packages in {countryData.name}
              </p>
              
              {Object.entries(packagesByActivity).map(([activityName, packages]) => {
                if (packages.length === 0) return null;
                
                // Get activity slug from the first package
                const firstPkg = packages[0];
                const activitySlug = firstPkg?.activity_slug || activityName.toLowerCase().replace(/\s+/g, '-');
                
                return (
                  <div key={activityName} className="mb-16 last:mb-0">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-2xl font-bold text-gray-900">
                        {activityName} in {countryData.name}
                      </h2>
                      <Link
                        href={`/${country}/${activitySlug}`}
                        className="text-primary-color-dark hover:underline flex items-center gap-1"
                      >
                        View All ({packages.length})
                        <FontAwesomeIcon icon={faArrowRight} className="w-3 h-3" />
                      </Link>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                      {packages.slice(0, 3).map((pkg) => {
                        const packageLink = `/${country}/${pkg.activity_slug || activitySlug}/${pkg.slug}`;
                        
                        return (
                          <PackageCard 
                            key={pkg.id} 
                            packageDetails={{
                              id: pkg.id,
                              title: pkg.title,
                              slug: pkg.slug,
                              country: countryData.name,
                              link: packageLink,
                              image: pkg.featured_image,
                              price: pkg.price,
                              duration: `${pkg.duration_days} Days`,
                              difficulty: pkg.difficulty,
                              description: pkg.short_description
                            }} 
                          />
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Blog Posts about this Country */}
        {countryData.blogs && countryData.blogs.length > 0 && (
          <section className="py-16 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4">
              <Heading 
                title={`${countryData.name} Travel Guides & Tips`} 
                titleClass="text-center mb-4" 
              />
              <p className="text-center text-gray-600 max-w-3xl mx-auto mb-12">
                Read our expert guides and travel tips for {countryData.name}
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {countryData.blogs.slice(0, 4).map((blog) => (
                  <Link
                    key={blog.id}
                    href={`/blogs/${blog.slug}`}
                    className="group bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition"
                  >
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={blog.featured_image || blogsAssets.everest_blog}
                        alt={blog.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                        loading="lazy"
                      />
                    </div>
                    <div className="p-4">
                      <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                        <FontAwesomeIcon icon={faCalendar} className="w-3 h-3" />
                        <span>{new Date(blog.published_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}</span>
                      </div>
                      <h3 className="font-semibold text-gray-900 line-clamp-2 group-hover:text-primary-color-dark transition">
                        {blog.title}
                      </h3>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Why Visit Section */}
        <section className="py-16 bg-secondary-color">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 font-montserrat text-white">
              {`Why Choose ${countryData.name} for Your Adventure?`}
            </h2>
            <div className="prose prose-lg mx-auto text-white">
              <p>
                {countryData.name} offers some of the most spectacular trekking and touring experiences in the Himalayas. 
                With {uniqueActivities} different activities available and over {totalPackages} carefully curated packages, 
                there's something for every type of traveler.
              </p>
              <p className="mt-4">
                Our expert local guides are ready to show you the hidden gems of {countryData.name}, 
                ensuring an authentic and unforgettable Himalayan experience.
              </p>
            </div>
            
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href={`/contact?country=${countryData.slug}`}
                className="inline-block bg-primary-color-dark text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-color transition"
              >
                Plan Your {countryData.name} Adventure
              </Link>
              <Link
                href={`/${country}/packages`}
                className="inline-block border-2 border-primary-color-dark text-primary-color-dark px-8 py-3 rounded-lg font-semibold hover:bg-primary-color-dark hover:text-white transition"
              >
                View All Packages
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}