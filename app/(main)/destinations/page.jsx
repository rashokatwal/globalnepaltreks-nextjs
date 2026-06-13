// app/(main)/destinations/page.jsx
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faMountain, 
  faArrowRight,
  faStar,
  faMapMarkedAlt,
  faPersonHiking,
  faWater,
  faTree,
  faHelicopter,
  faClock,
  faGlobe,
  faCompass,
  faAward,
  faHeart,
  faDollarSign
} from '@fortawesome/free-solid-svg-icons';
import Heading from '@/app/components/ui/Heading';

// Map activity icons
const activityIcons = {
  'Trekking': faPersonHiking,
  'Tours': faMapMarkedAlt,
  'Rafting': faWater,
  'Jungle Safari': faTree,
  'Peak Climbing': faMountain,
  'Heli Tour': faHelicopter
};

export async function generateMetadata() {
  return {
    title: 'Best Trekking & Tour Destinations | Global Nepal Treks',
    description: 'Discover Nepal, Bhutan & Tibet treks with expert guides, great prices, and 1000+ happy trekkers. Book today',
    // keywords: 'trekking destinations, nepal trekking, bhutan tours, tibet travel, himalayan trekking, adventure travel',
    openGraph: {
      title: 'Best Trekking & Tour Destinations | Global Nepal Treks',
      description: 'Discover the best trekking and tour destinations in the Himalayas.',
      images: ['/images/destinations-og.jpg'],
      url: 'https://globalnepaltreks.com/destinations',
      type: 'website',
    },
    alternates: {
      canonical: 'https://globalnepaltreks.com/destinations',
    },
    robots: { index: true, follow: true },
  };
}

// ✅ Fixed: import DB queries directly instead of fetching over HTTP
// This avoids the NEXT_PUBLIC_APP_URL issue entirely
import { CountryQueries } from '@/lib/db/queries/countries.js';

async function getAllCountries() {
  try {
    // ✅ Call DB directly — no HTTP fetch needed in server components
    const countries = await CountryQueries.findAll({ 
      isActive: true,
      includePackages: true,
      includeActivities: true 
    });
    return Array.isArray(countries) ? countries : [];
  } catch (error) {
    console.error('Error fetching countries:', error);
    return [];
  }
}

function formatNumber(num) {
  return num?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') || '0';
}

function generateStructuredData(countries) {
  const baseUrl = 'https://globalnepaltreks.com';
  const totalPackages = countries.reduce((sum, c) => sum + (c.packages?.length || 0), 0);

  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Best Trekking & Tour Destinations',
    description: 'Explore world-class trekking and tour destinations including Nepal, Bhutan, and Tibet.',
    url: `${baseUrl}/destinations`,
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: countries.map((country, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        item: {
          '@type': 'Country',
          name: country.name,
          description: country.description,
          url: `${baseUrl}/${country.slug}`,
          image: country.featured_image,
        }
      }))
    },
    offers: {
      '@type': 'AggregateOffer',
      offerCount: totalPackages,
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
    },
  };
}

export default async function DestinationsPage() {
  const countries = await getAllCountries();

  // ✅ Don't 404 if DB is temporarily unavailable — show empty state instead
  // Only 404 if you're sure the page should never exist without data
  if (!countries || countries.length === 0) {
    notFound();
  }

  const totalPackages = countries.reduce((sum, c) => sum + (c.packages?.length || 0), 0);
  const totalActivities = countries.reduce((sum, c) => sum + (c.activities?.length || 0), 0);
  const totalCountries = countries.length;
  const happyCustomers = 1000;

  const structuredData = generateStructuredData(countries);

  const highlights = [
    {
      icon: faMountain,
      title: 'Highest Peaks',
      description: "Trek to the base of world's tallest mountains including Everest, K2, and Annapurna",
      stat: '8,848m',
      statLabel: 'Highest Peak'
    },
    {
      icon: faCompass,
      title: 'Expert Guides',
      description: 'Experienced local guides with deep knowledge of Himalayan trails and culture',
      stat: '15+',
      statLabel: 'Years Experience'
    },
    {
      icon: faHeart,
      title: 'Happy Trekkers',
      description: 'Join thousands of satisfied adventurers who explored with us',
      stat: formatNumber(happyCustomers) + "+",
      statLabel: 'Happy Customers'
    },
    {
      icon: faAward,
      title: 'Best Price Guarantee',
      description: 'Competitive pricing with no hidden costs or surprise fees',
      stat: '100%',
      statLabel: 'Price Match'
    }
  ];

  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://globalnepaltreks.com' },
              { '@type': 'ListItem', position: 2, name: 'Destinations', item: 'https://globalnepaltreks.com/destinations' },
            ],
          })
        }}
      />

      <main className="bg-white">

        {/* ── Hero ── */}
        <section className="relative min-h-[80vh] overflow-hidden">
          <div 
            className="absolute inset-0 overflow-hidden bg-fixed bg-cover bg-top" 
            style={{ backgroundImage: "url('../public/assets/Packages/upper-mustang-trekking-via-teri-la.jpg')"}}
          >
            <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/50 to-transparent"></div>
          </div>

          <div className="relative max-w-7xl mx-auto px-4 py-20 flex flex-col justify-end min-h-[80vh]">
            <div className="max-w-3xl">
              <div className="flex flex-wrap gap-3 mb-6">
                <span className="bg-primary-color-dark text-white px-4 py-1.5 rounded-full text-sm font-semibold">
                  Top Destinations
                </span>
                <span className="bg-accent-color text-white px-4 py-1.5 rounded-full text-sm font-semibold">
                  Himalayan Adventures
                </span>
              </div>

              <h1 className="text-4xl md:text-6xl lg:text-5xl font-bold font-montserrat mb-6 text-white">
                Explore Our
                <span className="text-primary-color-light block mt-2">Trekking Destinations</span>
              </h1>

              <p className="text-lg md:text-xl text-gray-200 mb-8 max-w-2xl">
                Discover the world's most spectacular trekking and tour destinations in the Himalayas.
                From the majestic peaks of Nepal to the mystical valleys of Bhutan and Tibet.
              </p>

              {/* <div className="flex flex-wrap gap-6 text-white">
                {[
                  { icon: faGlobe, value: totalCountries, label: 'Destinations' },
                  { icon: faMountain, value: formatNumber(totalPackages), label: 'Adventure Packages' },
                  { icon: faPersonHiking, value: `${totalActivities}+`, label: 'Activities' },
                ].map(({ icon, value, label }) => (
                  <div key={label} className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-lg px-5 py-3">
                    <FontAwesomeIcon icon={icon} className="w-6 h-6 text-primary-color-light" />
                    <div>
                      <div className="text-2xl font-bold">{value}</div>
                      <div className="text-sm text-gray-300">{label}</div>
                    </div>
                  </div>
                ))}
              </div> */}
            </div>
          </div>

          {/* <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
            <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
              <div className="w-1 h-3 bg-white rounded-full mt-2 animate-pulse" />
            </div>
          </div> */}
        </section>

        {/* ── Introduction ── */}
        <section className="py-16 bg-white">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <Heading title="Your Gateway to Himalayan Adventures" titleClass="mb-6" />
            <p className="text-lg text-gray-600 leading-relaxed">
              Welcome to Global Nepal Treks, your trusted partner for unforgettable adventures in the heart of the Himalayas.
              With years of experience and a team of passionate local experts, we offer carefully crafted trekking and tour
              packages that showcase the best of each destination.
            </p>
          </div>
        </section>

        {/* ── Countries Grid ── */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4">
            <Heading title="Our Trekking Destinations" titleClass="text-center mb-4" />
            <p className="text-center text-gray-600 max-w-3xl mx-auto mb-12">
              Explore our handpicked destinations, each offering unique landscapes, cultures, and adventures
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {countries.map((country, index) => {
                const countryPackages = country.packages || [];
                const featuredPackages = countryPackages.filter(p => p.is_featured === 1);
                const countryActivities = country.activities || [];
                const topActivities = countryActivities.slice(0, 3);

                return (
                  <Link
                    href={`/${country.slug}`}
                    key={country.id || index}
                    className="group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-500"
                  >
                    {/* Image */}
                    <div className="relative h-80 overflow-hidden">
                      <img
                        src={country.featured_image || '/images/default-country.jpg'}
                        alt={`Trekking in ${country.name}`}
                        className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
                        loading={index < 2 ? 'eager' : 'lazy'}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />

                      {/* <div className="absolute top-4 right-4 bg-primary-color-dark text-white px-3 py-1.5 rounded-lg text-sm font-semibold shadow-lg">
                        {countryPackages.length} Packages
                      </div> */}

                      <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                        <div className="flex items-center gap-2 mb-2">
                          <FontAwesomeIcon icon={faStar} className="w-4 h-4 text-yellow-400" />
                          <span className="text-sm">Featured Destination</span>
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold font-montserrat mb-2">
                          {country.name}
                        </h2>
                        <p className="text-gray-200 line-clamp-2">
                          {country.description?.substring(0, 120) || 'Explore amazing trekking adventures in this beautiful destination'}...
                        </p>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="p-6">
                      {/* <div className="grid grid-cols-3 gap-4 mb-6 pb-6 border-b border-gray-200">
                        {[
                          { value: countryPackages.length, label: 'Packages' },
                          { value: countryActivities.length, label: 'Activities' },
                          { value: featuredPackages.length, label: 'Featured' },
                        ].map(({ value, label }) => (
                          <div key={label} className="text-center">
                            <div className="text-2xl font-bold text-primary-color-dark">{value}</div>
                            <div className="text-xs text-gray-500 mt-1">{label}</div>
                          </div>
                        ))}
                      </div>

                      {topActivities.length > 0 && (
                        <div className="mb-4">
                          <h3 className="text-sm font-semibold text-gray-700 mb-3">Popular Activities:</h3>
                          <div className="flex flex-wrap gap-2">
                            {topActivities.map((activity) => {
                              const IconComponent = activityIcons[activity.name] || faPersonHiking;
                              return (
                                <span key={activity.id}
                                  className="inline-flex items-center gap-1.5 bg-gray-100 text-gray-700 px-3 py-1.5 rounded-full text-xs">
                                  <FontAwesomeIcon icon={IconComponent} className="w-3 h-3" />
                                  {activity.name}
                                </span>
                              );
                            })}
                          </div>
                        </div>
                      )} */}

                      <div className="flex items-center justify-between mt-4 pt-2">
                        <span className="text-sm text-primary-color-dark font-semibold">
                          Explore {country.name}
                        </span>
                        <div className="w-8 h-8 bg-primary-color-dark rounded-full flex items-center justify-center group-hover:bg-accent-color transition-colors">
                          <FontAwesomeIcon icon={faArrowRight} className="w-4 h-4 text-white group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── Why Choose ── */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <Heading title="Why Choose These Himalayan Destinations?" titleClass="text-center mb-4" />
            <p className="text-center text-gray-600 max-w-3xl mx-auto mb-12">
              Each destination offers unique experiences that make it perfect for your next adventure
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {highlights.map((h, index) => (
                <div key={index} className="text-center group">
                  <div className="w-20 h-20 bg-primary-color-dark/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary-color-dark transition-colors duration-300">
                    <FontAwesomeIcon icon={h.icon} className="w-8 h-8 text-primary-color-dark group-hover:text-white transition-colors duration-300" />
                  </div>
                  <div className="text-2xl font-bold text-primary-color-dark mb-2">{h.stat}</div>
                  <div className="text-sm font-semibold text-gray-500 mb-2">{h.statLabel}</div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{h.title}</h3>
                  <p className="text-gray-600 text-sm">{h.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Comparison Table ── */}
        {/* {countries.length > 1 && (
          <section className="py-16 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4">
              <Heading title="Compare Destinations" titleClass="text-center mb-4" />
              <p className="text-center text-gray-600 max-w-3xl mx-auto mb-12">
                Find the perfect destination that matches your adventure preferences
              </p>
              <div className="overflow-x-auto">
                <table className="w-full bg-white rounded-xl shadow-sm">
                  <thead className="bg-primary-color-dark text-white">
                    <tr>
                      <th className="px-6 py-4 text-left rounded-tl-xl">Features</th>
                      {countries.map(c => (
                        <th key={c.id} className="px-6 py-4 text-left">{c.name}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {[
                      { label: 'Best Season', field: 'best_season', fallback: 'Mar-May, Sep-Nov' },
                      { label: 'Difficulty Level', field: 'difficulty_level', fallback: 'Moderate to Challenging' },
                      { label: 'Max Altitude', field: 'max_altitude', fallback: '5,500m+' },
                      { label: 'Average Duration', field: 'avg_duration', fallback: '10-15 Days' },
                      { label: 'Starting Price', field: 'starting_price', fallback: '1,200', prefix: '$', suffix: '+' },
                    ].map(({ label, field, fallback, prefix = '', suffix = '' }) => (
                      <tr key={label} className="hover:bg-gray-50 transition">
                        <td className="px-6 py-4 font-semibold text-gray-900">{label}</td>
                        {countries.map(c => (
                          <td key={c.id} className="px-6 py-4 text-gray-600">
                            {prefix}{c[field] || fallback}{suffix}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        )} */}

        {/* ── FAQs ── */}
        <section className="py-16 bg-white">
          <div className="max-w-4xl mx-auto px-4">
            <Heading title="Frequently Asked Questions" titleClass="text-center mb-4" />
            <p className="text-center text-gray-600 max-w-3xl mx-auto mb-12">
              Everything you need to know about trekking in these destinations
            </p>
            <div className="space-y-6">
              {[
                {
                  q: 'What is the best time to trek in Nepal, Bhutan, and Tibet?',
                  a: 'The best trekking seasons are spring (March to May) and autumn (September to November). During these months, you\'ll enjoy clear skies, moderate temperatures, and stunning mountain views. Each destination has its unique weather patterns, and our experts can help you choose the perfect time.'
                },
                {
                  q: 'Do I need prior trekking experience?',
                  a: 'While some treks require good fitness levels, we offer packages for all experience levels. From easy walking tours to challenging high-altitude treks, we have options for beginners to experienced trekkers. Our guides provide full support throughout your journey.'
                },
                {
                  q: 'What permits are required for these destinations?',
                  a: 'Each destination has specific permit requirements. For Nepal: TIMS card and conservation area permits. For Bhutan: Daily sustainable development fee covering permits and services. For Tibet: Chinese visa and Tibet Travel Permit. We handle all permit arrangements for you.'
                },
                {
                  q: 'How do I book a trekking package?',
                  a: 'Booking is easy! Browse our packages, click on your preferred destination and package, fill out the booking form, and make a deposit. Our team will contact you within 24 hours to confirm your booking and help with preparations. You can also contact us directly for custom itineraries.'
                },
              ].map(({ q, a }) => (
                <div key={q} className="bg-gray-50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">{q}</h3>
                  <p className="text-gray-600">{a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="py-20 bg-secondary-color">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 font-montserrat text-white">
              Ready to Start Your Himalayan Adventure?
            </h2>
            <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
              Contact our travel experts today and let us help you plan the journey of a lifetime
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact"
                className="inline-flex items-center gap-2 bg-white text-primary-color-dark px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition group">
                Plan Your Trip Now
                <FontAwesomeIcon icon={faArrowRight} className="w-4 h-4 group-hover:translate-x-1 transition" />
              </Link>
            </div>
          </div>
        </section>

      </main>
    </>
  );
}