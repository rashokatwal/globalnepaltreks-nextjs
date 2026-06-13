// app/[country]/[activity]/[slug]/page.js
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {  
  faClock, 
  faUsers, 
  faMountain,
  faStar,
  faMapMarkedAlt,
  faBinoculars,
  faHighlighter,
  faRoute,
  faBoxOpen,
  faPhotoFilm,
  faFileAlt,
  faHouseChimney,
  faUtensils,
  faCheck,
  faXmark,
  faShareNodes,
  faRoad,
  faInfoCircle,
  faTag,
  faBed,
  faCar,
  faUmbrella,
  faCalendarAlt,
  faDollarSign,
  faShieldAlt,
  faHandsHelping,
  faLanguage,
  faFirstAid,
  faQuestionCircle
} from '@fortawesome/free-solid-svg-icons';
import BookingSidebar from '@/app/components/sections/BookingSidebar';
import PageNavigation from '@/app/components/sections/PageNavigation';
import Script from 'next/script';
import ShareButtonsWrapper from '@/app/components/wrappers/ShareButtonsWrapper';

export async function generateMetadata({ params }) {
  const { country, activity, slug } = await params;
  const pkg = await getPackage(slug);
  
  if (!pkg) {
    return {
      title: 'Package Not Found | Global Nepal Treks'
    };
  }
  
  const countryName = country.charAt(0).toUpperCase() + country.slice(1);
  const activityName = activity.split('-').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://globalnepaltreks.com';
  const canonicalUrl = `${baseUrl}/${country}/${activity}/${pkg.slug}`;
  
  return {
    title: pkg.meta_title || `${pkg.title} | ${activityName} in ${countryName} | Global Nepal Treks`,
    description: pkg.meta_description || pkg.short_description || `Book your ${activityName.toLowerCase()} package in ${countryName} with expert guides. Best price guaranteed.`,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: pkg.title,
      description: pkg.short_description,
      images: [pkg.featured_image],
      type: 'website',
      locale: 'en_US',
      siteName: 'Global Nepal Treks',
      url: canonicalUrl,
    },
    twitter: {
      card: 'summary_large_image',
      title: pkg.title,
      description: pkg.short_description,
      images: [pkg.featured_image],
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

async function getPackage(slug) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/packages/${slug}?details=true`, {
      next: { revalidate: 3600 }
    });
    
    if (!res.ok) return null;
    const data = await res.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching package:', error);
    return null;
  }
}

function getAverageRating(reviews) {
  if (!reviews || reviews.length === 0) return 0;
  const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
  return (sum / reviews.length).toFixed(1);
}

const getAvailableSections = (pkg) => {
  const sections = [
    { 
      id: 'overview', 
      label: 'Overview', 
      icon: faBinoculars,
      condition: pkg?.overview || pkg?.short_description
    },
    { 
      id: 'highlights', 
      label: 'Highlights', 
      icon: faHighlighter,
      condition: pkg?.highlights
    },
    { 
      id: 'itinerary', 
      label: 'Itinerary', 
      icon: faRoute,
      condition: pkg?.itinerary && pkg.itinerary.length > 0
    },
    { 
      id: 'features', 
      label: 'Inclusions', 
      icon: faBoxOpen,
      condition: pkg?.features && pkg.features.length > 0
    },
    { 
      id: 'essential_info', 
      label: 'Essential Info', 
      icon: faInfoCircle,
      condition: pkg?.essential_info && Object.values(pkg.essential_info).some(v => v)
    },
    { 
      id: 'map', 
      label: 'Route Map', 
      icon: faMapMarkedAlt,
      condition: pkg?.map_image
    },
    { 
      id: 'gallery', 
      label: 'Gallery', 
      icon: faPhotoFilm,
      condition: pkg?.gallery && pkg.gallery.length > 0
    },
    { 
      id: 'faq', 
      label: 'FAQ', 
      icon: faQuestionCircle,
      condition: pkg?.faqs && pkg.faqs.length > 0
    },
  ];

  return sections.filter(section => section.condition);
};

function generateJsonLd(pkg, countryName, activityName, canonicalUrl) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://globalnepaltreks.com';
  const currentUrl = canonicalUrl || `${baseUrl}/${countryName.toLowerCase()}/${activityName.toLowerCase().replace(/ /g, '-')}/${pkg.slug}`;
  
  const aggregateRating = pkg.reviews && pkg.reviews.length > 0 ? {
    "@type": "AggregateRating",
    "ratingValue": getAverageRating(pkg.reviews),
    "reviewCount": pkg.reviews.length,
    "bestRating": "5",
    "worstRating": "1"
  } : undefined;
  
  const offers = {
    "@type": "Offer",
    "price": parseFloat(pkg.price),
    "priceCurrency": "USD",
    "availability": pkg.is_active ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
    "validFrom": new Date().toISOString().split('T')[0],
    "url": currentUrl
  };
  
  const validUntil = new Date();
  validUntil.setFullYear(validUntil.getFullYear() + 1);
  offers.priceValidUntil = validUntil.toISOString().split('T')[0];
  
  const images = [pkg.featured_image];
  if (pkg.gallery && pkg.gallery.length > 0) {
    images.push(...pkg.gallery.slice(0, 5).map(img => img.image_url || img));
  }
  
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": pkg.title,
    "description": pkg.short_description || pkg.meta_description,
    "image": images,
    "sku": pkg.id.toString(),
    "url": currentUrl,
    "brand": {
      "@type": "Brand",
      "name": "Global Nepal Treks"
    },
    "offers": offers,
    ...(aggregateRating && { aggregateRating }),
    "additionalProperty": [
      {
        "@type": "PropertyValue",
        "name": "Duration",
        "value": `${pkg.duration_days} days`
      },
      {
        "@type": "PropertyValue",
        "name": "Difficulty",
        "value": pkg.difficulty?.charAt(0).toUpperCase() + pkg.difficulty?.slice(1)
      },
      {
        "@type": "PropertyValue",
        "name": "Max Altitude",
        "value": pkg.max_altitude ? `${pkg.max_altitude}m` : "N/A"
      },
      {
        "@type": "PropertyValue",
        "name": "Group Size",
        "value": `${pkg.group_size_min}-${pkg.group_size_max || 'Unlimited'} persons`
      },
      {
        "@type": "PropertyValue",
        "name": "Best Season",
        "value": pkg.best_season || "Spring & Autumn"
      },
      {
        "@type": "PropertyValue",
        "name": "Activity Type",
        "value": activityName
      },
      {
        "@type": "PropertyValue",
        "name": "Country",
        "value": countryName
      }
    ]
  };
  
  return jsonLd;
}

function generateBreadcrumbSchema(pkg, countryName, activityName, canonicalUrl) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://globalnepaltreks.com';
  const currentUrl = canonicalUrl || `${baseUrl}/${countryName.toLowerCase()}/${activityName.toLowerCase().replace(/ /g, '-')}/${pkg.slug}`;
  
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": baseUrl
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": activityName,
        "item": `${baseUrl}/${countryName.toLowerCase()}/${activityName.toLowerCase().replace(/ /g, '-')}`
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": pkg.title,
        "item": currentUrl
      }
    ]
  };
}

export default async function PackagePage({ params }) {
  const { country, activity, slug } = await params;
  const pkg = await getPackage(slug);
  
  if (!pkg) {
    notFound();
  }
  
  const countryName = country.charAt(0).toUpperCase() + country.slice(1);
  const activityName = activity.split('-').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');
  
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://globalnepaltreks.com';
  const canonicalUrl = `${baseUrl}/${country}/${activity}/${pkg.slug}`;
  
  const averageRating = getAverageRating(pkg.reviews);
  const reviewCount = pkg.reviews?.length || 0;
  const availableSections = getAvailableSections(pkg);
  const essentialInfo = pkg.essential_info || {};
  
  const mainJsonLd = generateJsonLd(pkg, countryName, activityName, canonicalUrl);
  const breadcrumbJsonLd = generateBreadcrumbSchema(pkg, countryName, activityName, canonicalUrl);

  return (
    <>
      {/* Canonical URL - Critical for SEO */}
      {/* <link rel="canonical" href={canonicalUrl} /> */}
      
      {/* JSON-LD Structured Data */}
      <Script
        id="main-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(mainJsonLd) }}
      />
      <Script
        id="breadcrumb-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <main className="bg-white">
        {/* Hero Section with Package Image */}
        <section className="relative min-h-[80vh] bg-gray-900">
          <div className="absolute inset-0 overflow-hidden bg-fixed bg-cover bg-top" style={{backgroundImage: `url(${pkg.featured_image})`}}>
            <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/50 to-transparent"></div>
          </div>

          <div className="absolute bottom-0 left-0 right-0 max-w-7xl mx-auto px-4 pb-12 text-white">
            <div className="flex flex-wrap gap-3 mb-4">
              <span className="bg-primary-color-dark px-3 py-1 rounded-full text-sm font-semibold">
                {activityName}
              </span>
              <span className="bg-accent-color px-3 py-1 rounded-full text-sm font-semibold">
                {countryName}
              </span>
              {pkg.difficulty && (
                <span className="bg-secondary-color px-3 py-1 rounded-full text-sm font-semibold capitalize">
                  {pkg.difficulty}
                </span>
              )}
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-montserrat mb-4 max-w-4xl">
              {pkg.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-6 text-sm text-gray-200">
              <div className="flex items-center gap-2">
                <FontAwesomeIcon icon={faClock} className="w-4 h-4" />
                <span>{pkg.duration_days} Days</span>
              </div>
              <div className="flex items-center gap-2">
                <FontAwesomeIcon icon={faMountain} className="w-4 h-4" />
                <span>Max Alt: {pkg.max_altitude?.toLocaleString()}m</span>
              </div>
              <div className="flex items-center gap-2">
                <FontAwesomeIcon icon={faUsers} className="w-4 h-4" />
                <span>Group Size: {pkg.group_size_min}-{pkg.group_size_max}</span>
              </div>
              {reviewCount > 0 && (
                <div className="flex items-center gap-2">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <FontAwesomeIcon
                        key={i}
                        icon={faStar}
                        className={`w-4 h-4 ${i < Math.floor(averageRating) ? 'text-yellow-400' : 'text-gray-400'}`}
                      />
                    ))}
                  </div>
                  <span>({reviewCount} reviews)</span>
                </div>
              )}
            </div>
            <div className='mt-5 flex flex-wrap items-center gap-4'>
              <FontAwesomeIcon icon={faShareNodes} className="hidden sm:block" />
              <span className="text-sm sm:text-base">Share</span>
              <ShareButtonsWrapper shareUrl={canonicalUrl} />
            </div>
          </div>
        </section>

        {/* Page Navigation */}
        {availableSections.length > 0 && (
          <PageNavigation sections={availableSections} />
        )}

        {/* Main Content with Sidebar */}
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Main Content Area */}
              <div className="lg:w-2/3">
                {/* Overview Section */}
                {(pkg.overview || pkg.short_description) && (
                  <section id="overview" className="mb-12 scroll-mt-24">
                    <div className="prose max-w-none text-gray-600">
                      {pkg.overview ? (
                        <div className='package-content' dangerouslySetInnerHTML={{ __html: pkg.overview }} />
                      ) : (
                        <p>{pkg.short_description || 'No overview available.'}</p>
                      )}
                    </div>
                  </section>
                )}

                {/* Highlights Section */}
                {pkg.highlights && (
                  <section id="highlights" className="mb-12 scroll-mt-24">
                    <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                      <FontAwesomeIcon icon={faHighlighter} className="text-primary-color-dark w-6 h-6" />
                      Highlights
                    </h2>
                    <div className="bg-gray-50 p-6 rounded-lg">
                      <div className="whitespace-pre-line text-gray-700">
                        {pkg.highlights}
                      </div>
                    </div>
                  </section>
                )}

                {/* Itinerary Section */}
                {pkg.itinerary && pkg.itinerary.length > 0 && (
                  <section id="itinerary" className="mb-12 scroll-mt-24">
                    <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                      <FontAwesomeIcon icon={faRoute} className="text-primary-color-dark w-6 h-6" />
                      Detailed Itinerary
                    </h2>
                    <div className="space-y-6">
                      {pkg.itinerary.map((day) => (
                        <div key={day.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition">
                          <div className="flex flex-col md:flex-row">
                            {day.day_image && (
                              <div className="md:w-48 lg:w-64 h-48 md:h-auto overflow-hidden bg-gray-100">
                                <img
                                  src={day.day_image}
                                  alt={day.title || `Day ${day.day_number}`}
                                  className="w-full h-full object-cover hover:scale-105 transition duration-300"
                                />
                              </div>
                            )}
                            <div className="flex-1 p-6">
                              <div className="flex flex-wrap gap-3 mb-4">
                                <span className="bg-primary-color-dark text-white px-4 py-1 rounded-full text-sm font-semibold">
                                  Day {day.day_number}
                                </span>
                                {day.altitude && (
                                  <span className="text-sm font-semibold text-accent-color flex items-center gap-1">
                                    <FontAwesomeIcon icon={faMountain} className="w-3 h-3" />
                                    Altitude: {day.altitude}m
                                  </span>
                                )}
                                {day.trekking_hours && (
                                  <span className="text-sm font-semibold text-accent-color flex items-center gap-1">
                                    <FontAwesomeIcon icon={faClock} className="w-3 h-3" />
                                    Trekking: {day.trekking_hours} hrs
                                  </span>
                                )}
                                {day.distance_km && (
                                  <span className="text-sm font-semibold text-accent-color flex items-center gap-1">
                                    <FontAwesomeIcon icon={faRoad} className="w-3 h-3" />
                                    Distance: {day.distance_km} km
                                  </span>
                                )}
                              </div>
                              <h3 className="text-xl font-bold mb-3 text-gray-800">{day.title}</h3>
                              <p className="text-gray-600 leading-relaxed mb-4">{day.description}</p>
                              {(day.accommodation || day.meal_info) && (
                                <div className="flex flex-wrap gap-4 pt-3 border-t border-gray-100">
                                  {day.accommodation && (
                                    <span className="text-sm text-gray-500 flex items-center gap-2">
                                      <FontAwesomeIcon icon={faHouseChimney} className="text-primary-color-dark w-4 h-4" />
                                      {day.accommodation}
                                    </span>
                                  )}
                                  {day.meal_info && (
                                    <span className="text-sm text-gray-500 flex items-center gap-2">
                                      <FontAwesomeIcon icon={faUtensils} className="text-primary-color-dark w-4 h-4" />
                                      {day.meal_info}
                                    </span>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {/* Features Section */}
                {pkg.features && pkg.features.length > 0 && (
                  <section id="features" className="mb-12 scroll-mt-24">
                    <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                      <FontAwesomeIcon icon={faBoxOpen} className="text-primary-color-dark w-6 h-6" />
                      Inclusions & Exclusions
                    </h2>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="p-6 rounded-lg bg-green-50">
                        <h3 className="font-semibold text-lg text-green-800 mb-3 flex items-center gap-2">
                          Included
                        </h3>
                        <ul className="space-y-2">
                          {pkg.features.filter(f => f.feature_type === 'included').map((feature) => (
                            <li key={feature.id} className="flex items-start gap-2">
                              <FontAwesomeIcon icon={faCheck} className="w-4 h-4 mt-1 text-green-700 shrink-0" />
                              <span className="text-sm">{feature.description}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="p-6 rounded-lg bg-red-50">
                        <h3 className="font-semibold text-lg text-red-800 mb-3 flex items-center gap-2">
                          Excluded
                        </h3>
                        <ul className="space-y-2">
                          {pkg.features.filter(f => f.feature_type === 'excluded').map((feature) => (
                            <li key={feature.id} className="flex items-start gap-2">
                              <FontAwesomeIcon icon={faXmark} className="w-4 h-4 mt-1 text-red-800 shrink-0" />
                              <span className="text-sm">{feature.description}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </section>
                )}

                {/* Essential Information Section */}
                {essentialInfo && Object.values(essentialInfo).some(v => v) && (
                  <section id="essential_info" className="mb-12 scroll-mt-24">
                    <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                      <FontAwesomeIcon icon={faInfoCircle} className="text-primary-color-dark w-6 h-6" />
                      Essential Information
                    </h2>
                    <div className="space-y-6">
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {essentialInfo.trip_code && (
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <FontAwesomeIcon icon={faTag} className="w-5 h-5 text-accent-color mb-2" />
                            <p className="text-xs text-gray-500">Trip Code</p>
                            <p className="font-semibold text-gray-800">{essentialInfo.trip_code}</p>
                          </div>
                        )}
                        {essentialInfo.trip_type && (
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <FontAwesomeIcon icon={faRoute} className="w-5 h-5 text-accent-color mb-2" />
                            <p className="text-xs text-gray-500">Trip Type</p>
                            <p className="font-semibold text-gray-800">{essentialInfo.trip_type}</p>
                          </div>
                        )}
                        {essentialInfo.accommodation_type && (
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <FontAwesomeIcon icon={faBed} className="w-5 h-5 text-accent-color mb-2" />
                            <p className="text-xs text-gray-500">Accommodation</p>
                            <p className="font-semibold text-gray-800">{essentialInfo.accommodation_type}</p>
                          </div>
                        )}
                        {essentialInfo.meal_included && (
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <FontAwesomeIcon icon={faUtensils} className="w-5 h-5 text-accent-color mb-2" />
                            <p className="text-xs text-gray-500">Meals</p>
                            <p className="font-semibold text-gray-800">{essentialInfo.meal_included}</p>
                          </div>
                        )}
                        {essentialInfo.transportation && (
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <FontAwesomeIcon icon={faCar} className="w-5 h-5 text-accent-color mb-2" />
                            <p className="text-xs text-gray-500">Transportation</p>
                            <p className="font-semibold text-gray-800">{essentialInfo.transportation}</p>
                          </div>
                        )}
                      </div>

                      <div className="space-y-4">
                        {essentialInfo.best_time_description && (
                          <div className="bg-blue-50 p-5 rounded-lg border-l-4 border-blue-500">
                            <h3 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
                              <FontAwesomeIcon icon={faCalendarAlt} className="w-4 h-4" />
                              Best Time to Visit
                            </h3>
                            <p className="text-gray-700 text-sm">{essentialInfo.best_time_description}</p>
                          </div>
                        )}

                        {essentialInfo.difficulty_description && (
                          <div className="bg-amber-50 p-5 rounded-lg border-l-4 border-amber-500">
                            <h3 className="font-semibold text-amber-800 mb-2 flex items-center gap-2">
                              <FontAwesomeIcon icon={faMountain} className="w-4 h-4" />
                              Difficulty Level
                            </h3>
                            <p className="text-gray-700 text-sm">{essentialInfo.difficulty_description}</p>
                          </div>
                        )}

                        {essentialInfo.fitness_requirements && (
                          <div className="bg-green-50 p-5 rounded-lg border-l-4 border-green-500">
                            <h3 className="font-semibold text-green-800 mb-2 flex items-center gap-2">
                              <FontAwesomeIcon icon={faUsers} className="w-4 h-4" />
                              Fitness Requirements
                            </h3>
                            <div className="text-gray-700 text-sm whitespace-pre-line">{essentialInfo.fitness_requirements}</div>
                          </div>
                        )}

                        {essentialInfo.preparation_tips && (
                          <div className="bg-purple-50 p-5 rounded-lg border-l-4 border-purple-500">
                            <h3 className="font-semibold text-purple-800 mb-2 flex items-center gap-2">
                              <FontAwesomeIcon icon={faUmbrella} className="w-4 h-4" />
                              Preparation Tips
                            </h3>
                            <div className="text-gray-700 text-sm whitespace-pre-line">{essentialInfo.preparation_tips}</div>
                          </div>
                        )}

                        {essentialInfo.equipment_list && (
                          <div className="bg-gray-50 p-5 rounded-lg">
                            <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                              <FontAwesomeIcon icon={faBoxOpen} className="w-4 h-4" />
                              Equipment List
                            </h3>
                            <div className="text-gray-700 text-sm whitespace-pre-line">{essentialInfo.equipment_list}</div>
                          </div>
                        )}

                        {essentialInfo.health_considerations && (
                          <div className="bg-red-50 p-5 rounded-lg border-l-4 border-red-500">
                            <h3 className="font-semibold text-red-800 mb-2 flex items-center gap-2">
                              <FontAwesomeIcon icon={faFirstAid} className="w-4 h-4" />
                              Health Considerations
                            </h3>
                            <div className="text-gray-700 text-sm whitespace-pre-line">{essentialInfo.health_considerations}</div>
                          </div>
                        )}

                        {essentialInfo.safety_measures && (
                          <div className="bg-indigo-50 p-5 rounded-lg border-l-4 border-indigo-500">
                            <h3 className="font-semibold text-indigo-800 mb-2 flex items-center gap-2">
                              <FontAwesomeIcon icon={faShieldAlt} className="w-4 h-4" />
                              Safety Measures
                            </h3>
                            <div className="text-gray-700 text-sm whitespace-pre-line">{essentialInfo.safety_measures}</div>
                          </div>
                        )}

                        {(essentialInfo.permits_required || essentialInfo.permit_cost) && (
                          <div className="bg-teal-50 p-5 rounded-lg border-l-4 border-teal-500">
                            <h3 className="font-semibold text-teal-800 mb-2 flex items-center gap-2">
                              <FontAwesomeIcon icon={faFileAlt} className="w-4 h-4" />
                              Permits Required
                            </h3>
                            {essentialInfo.permits_required && (
                              <div className="text-gray-700 text-sm whitespace-pre-line mb-2">{essentialInfo.permits_required}</div>
                            )}
                            {essentialInfo.permit_cost && (
                              <p className="text-sm font-medium text-teal-700 mt-2">
                                <FontAwesomeIcon icon={faDollarSign} className="w-3 h-3 mr-1" />
                                Permit Cost: ${essentialInfo.permit_cost}
                              </p>
                            )}
                          </div>
                        )}

                        {essentialInfo.cultural_etiquette && (
                          <div className="bg-pink-50 p-5 rounded-lg border-l-4 border-pink-500">
                            <h3 className="font-semibold text-pink-800 mb-2 flex items-center gap-2">
                              <FontAwesomeIcon icon={faHandsHelping} className="w-4 h-4" />
                              Cultural Etiquette
                            </h3>
                            <div className="text-gray-700 text-sm whitespace-pre-line">{essentialInfo.cultural_etiquette}</div>
                          </div>
                        )}

                        {essentialInfo.local_customs && (
                          <div className="bg-orange-50 p-5 rounded-lg border-l-4 border-orange-500">
                            <h3 className="font-semibold text-orange-800 mb-2 flex items-center gap-2">
                              <FontAwesomeIcon icon={faLanguage} className="w-4 h-4" />
                              Local Customs
                            </h3>
                            <div className="text-gray-700 text-sm whitespace-pre-line">{essentialInfo.local_customs}</div>
                          </div>
                        )}
                      </div>
                    </div>
                  </section>
                )}

                {/* Map Section */}
                {pkg.map_image && (
                  <section id="map" className="mb-12 scroll-mt-24">
                    <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                      <FontAwesomeIcon icon={faMapMarkedAlt} className="text-primary-color-dark w-6 h-6" />
                      Route Map
                    </h2>
                    <div className="bg-gray-100 rounded-lg overflow-hidden">
                      <img
                        src={pkg.map_image}
                        alt={`${pkg.title} route map`}
                        className="w-full h-auto"
                        loading="lazy"
                      />
                    </div>
                  </section>
                )}

                {/* Gallery Section */}
                {pkg.gallery && pkg.gallery.length > 0 && (
                  <section id="gallery" className="mb-12 scroll-mt-24">
                    <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                      <FontAwesomeIcon icon={faPhotoFilm} className="text-primary-color-dark w-6 h-6" />
                      Gallery
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {pkg.gallery.slice(0, 9).map((image, index) => (
                        <div key={index} className="relative aspect-square rounded-lg overflow-hidden">
                          <img
                            src={image.image_url || image}
                            alt={`${pkg.title} gallery ${index + 1}`}
                            className="w-full h-full object-cover hover:scale-105 transition duration-300"
                            loading="lazy"
                          />
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {/* FAQ Section */}
                {pkg.faqs && pkg.faqs.length > 0 && (
                  <section id="faq" className="mb-12 scroll-mt-24">
                    <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                      <FontAwesomeIcon icon={faQuestionCircle} className="text-primary-color-dark w-6 h-6" />
                      Frequently Asked Questions
                    </h2>
                    <div className="space-y-4">
                      {pkg.faqs.map((faq) => (
                        <details key={faq.id} className="bg-gray-50 rounded-lg group">
                          <summary className="flex items-center justify-between p-6 cursor-pointer list-none">
                            <h3 className="text-lg font-semibold text-gray-900">{faq.question}</h3>
                            <span className="text-primary-color-dark group-open:rotate-180 transition-transform">
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                              </svg>
                            </span>
                          </summary>
                          <div className="px-6 pb-6">
                            <p className="text-gray-600">{faq.answer}</p>
                          </div>
                        </details>
                      ))}
                    </div>
                  </section>
                )}
              </div>

              {/* Sidebar - Booking Section */}
              <aside className="lg:w-1/3">
                <div className="sticky top-35">
                  <BookingSidebar 
                    package={pkg}
                    countryName={countryName}
                    activityName={activityName}
                  />
                </div>
              </aside>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}