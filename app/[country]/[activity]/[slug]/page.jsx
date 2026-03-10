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
  faCheckCircle,
  faQuestionCircle,
  faFilePdf,
  faBinoculars,
  faHighlighter,
  faRoute,
  faBoxOpen,
  faPhotoFilm,
  faFileAlt,
  faHouseChimney,
  faUtensils,
  faTimesCircle,
  faArrowLeft
} from '@fortawesome/free-solid-svg-icons';
import PackageDetails from '@/app/components/sections/PackageDetails';
import BookingSidebar from '@/app/components/sections/BookingSidebar';
import PageNavigation from '@/app/components/sections/PageNavigation';
import Image from 'next/image';

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
  
  return {
    title: pkg.meta_title || `${pkg.title} | ${activityName} in ${countryName}`,
    description: pkg.meta_description || pkg.short_description || `Book your ${activityName.toLowerCase()} package in ${countryName} with expert guides.`,
    openGraph: {
      title: pkg.title,
      description: pkg.short_description,
      images: [pkg.featured_image],
      type: 'website',
    },
  };
}

async function getPackage(slug) {
  try {
    // const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const res = await fetch(`/api/packages/${slug}?details=true`);
    
    if (!res.ok) return null;
    const data = await res.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching package:', error);
    return null;
  }
}

// Helper function to calculate average rating
function getAverageRating(reviews) {
  if (!reviews || reviews.length === 0) return 0;
  const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
  return (sum / reviews.length).toFixed(1);
}

// Function to get available sections based on package data
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
    { 
      id: 'documents', 
      label: 'Documents', 
      icon: faFileAlt,
      condition: pkg?.documents && pkg.documents.length > 0
    },
  ];

  return sections.filter(section => section.condition);
};

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
  
  const averageRating = getAverageRating(pkg.reviews);
  const reviewCount = pkg.reviews?.length || 0;

  // Get only the sections that have data
  const availableSections = getAvailableSections(pkg);

  return (
    <main className="bg-white">
      {/* Hero Section with Package Image */}
      <section className="relative min-h-[80vh] bg-gray-900">

        <div className="absolute inset-0 overflow-hidden bg-fixed bg-cover bg-top" style={{backgroundImage: `url(${pkg.featured_image})`}}>

          <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/50 to-transparent"></div>
        </div>

        {/* Package Title and Quick Info */}
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
        </div>
      </section>

      {/* Page Navigation - Only shows available sections */}
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
                  <div className="space-y-4">
                    {pkg.itinerary.map((day) => (
                      <div key={day.id} className="bg-gray-50 rounded-lg p-6">
                        <div className="flex flex-wrap gap-4 mb-4">
                          <span className="bg-primary-color-dark text-white px-4 py-1 rounded-full text-sm font-semibold">
                            Day {day.day_number}
                          </span>
                          {day.altitude && (
                            <span className="text-sm font-semibold text-accent-color">
                              Altitude: {day.altitude}m
                            </span>
                          )}
                          {day.trekking_hours && (
                            <span className="text-sm font-semibold text-accent-color">
                              Trekking: {day.trekking_hours} hrs
                            </span>
                          )}
                        </div>
                        <h3 className="text-xl font-bold mb-2">{day.title}</h3>
                        <p className="text-gray-600 mb-4">{day.description}</p>
                        <div className="flex flex-wrap gap-4 text-sm">
                          {day.accommodation && (
                            <span className="text-gray-500"><FontAwesomeIcon icon={faHouseChimney} className='text-primary-color-dark' /> {day.accommodation}</span>
                          )}
                          {day.meal_info && (
                            <span className="text-gray-500"><FontAwesomeIcon icon={faUtensils} className='text-primary-color-dark' /> {day.meal_info}</span>
                          )}
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
                    Inclusions
                  </h2>
                  <div className="gap-6">
                    {/* Included */}
                    <div className="p-6 rounded-lg">
                      <h3 className="font-semibold text-lg text-green-800 mb-3">Included</h3>
                      <ul className="space-y-2">
                        {pkg.features 
                          .filter(f => f.feature_type === 'included')
                          .map((feature) => (
                            <li key={feature.id} className="flex items-start gap-2">
                              <FontAwesomeIcon icon={faCheckCircle} className="w-4 h-4 mt-1 text-green-700 shrink-0" />
                              <span className="text-sm">{feature.description}</span>
                            </li>
                          ))}
                      </ul>
                    </div>

                    {/* Excluded */}
                    <div className="p-6 rounded-lg">
                      <h3 className="font-semibold text-lg text-red-800 mb-3">Excluded</h3>
                      <ul className="space-y-2">
                        {pkg.features
                          .filter(f => f.feature_type === 'excluded')
                          .map((feature) => (
                            <li key={feature.id} className="flex items-start gap-2">
                              <FontAwesomeIcon icon={faTimesCircle} className="w-4 h-4 mt-1 text-red-800 shrink-0" />
                              <span className="text-sm">{feature.description}</span>
                            </li>
                          ))}
                      </ul>
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
                    {pkg.gallery.slice(0, 6).map((image, index) => (
                      <div key={index} className="relative h-40 rounded-lg overflow-hidden">
                        <img
                          src={image.image_url || image}
                          alt={`${pkg.title} gallery ${index + 1}`}
                          className="w-full h-full object-cover hover:scale-105 transition duration-300"
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

              {/* Documents Section */}
              {pkg.documents && pkg.documents.length > 0 && (
                <section id="documents" className="mb-12 scroll-mt-24">
                  <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                    <FontAwesomeIcon icon={faFileAlt} className="text-primary-color-dark w-6 h-6" />
                    Documents
                  </h2>
                  <div className="grid md:grid-cols-2 gap-4">
                    {pkg.documents.map((doc) => (
                      <a
                        key={doc.id}
                        href={doc.document_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition group"
                      >
                        <div className="w-10 h-10 bg-primary-color-dark/10 rounded-lg flex items-center justify-center">
                          <FontAwesomeIcon icon={faFilePdf} className="w-5 h-5 text-primary-color-dark" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{doc.document_title}</h3>
                          <p className="text-sm text-gray-500 capitalize">{doc.document_type.replace('_', ' ')}</p>
                        </div>
                      </a>
                    ))}
                  </div>
                </section>
              )}
            </div>

            {/* Sidebar - Booking Section */}
            <aside className="lg:w-1/3">
              <div className="sticky top-40">
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
  );
}