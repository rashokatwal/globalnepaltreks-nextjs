// app/travel-guides/page.js
import Link from 'next/link';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faMapMarkedAlt, 
  faCalendarAlt, 
  faBookOpen,
  faShieldAlt,
  faPassport,
  faQuestionCircle,
  faPhone,
  faEnvelope
} from '@fortawesome/free-solid-svg-icons';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import HeroSection from '@/app/components/sections/HeroSection';
import Heading from '@/app/components/ui/Heading';
import { travelGuidesAssets } from '../assets/assets';

// Metadata for SEO
export const metadata = {
  title: 'Travel Guides | Expert Tips & Essential Information for Nepal Trekking',
  description: 'Comprehensive travel guides for trekking in Nepal. Learn about trekking gear, protected areas, visa information, and essential tips from our local experts.',
  keywords: 'nepal travel guides, trekking gear, himalayan trekking tips, nepal visa, protected areas nepal, trekking equipment',
  openGraph: {
    title: 'Travel Guides | Expert Tips & Essential Information for Nepal Trekking',
    description: 'Comprehensive travel guides for trekking in Nepal. Learn about trekking gear, protected areas, visa information, and essential tips.',
    url: 'https://globalnepaltreks.com/travel-guides',
    type: 'website',
    images: [{ url: `${travelGuidesAssets.travel_guides_cover.src}`, width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Travel Guides | Expert Tips & Essential Information for Nepal Trekking',
    description: 'Comprehensive travel guides for trekking in Nepal.',
    images: [travelGuidesAssets.travel_guides_cover.src],
  },
  alternates: {
    canonical: 'https://globalnepaltreks.com/travel-guides',
  },
  robots: {
    index: true,
    follow: true,
  },
};

// Sample data – replace with actual data from your CMS or database
const travelGuides = [
  {
    id: 1,
    title: 'Trekking Gear and Equipment',
    slug: 'trekking-gear-and-equipment',
    excerpt: 'Trekking in Nepal varies from easy to hard depending on factors like the trekking region, trekking weather, group or solo, with a guide and assistant, or without them. Trekking in Nepal is a multi-day walk in the mountainous region of Nepal. Since Nepal is a mountainous country with 8 of the world’s highest peaks, proper gear is essential for a safe and comfortable journey.',
    image: travelGuidesAssets.travel_gear_and_equipment_cover,
    publishedAt: '2026-04-08',
    readTime: 8,
  },
  {
    id: 2,
    title: 'Protected Areas and Ecosystems of Nepal',
    slug: 'protected-areas-of-nepal',
    excerpt: 'Protected areas (PAs) have been established for a level of protection of ecosystems, biological processes and species. According to IUCN and UN Environment\'s World Conservation Monitoring Centre, there are 238,563 designated protected areas as of July 2018. Most areas are on land, and collectively they protect a wide range of habitats from the lowland Terai to the high Himalayas.',
    image: travelGuidesAssets.protected_areas_of_nepal_cover,
    publishedAt: '2026-04-15',
    readTime: 6,
  },
  {
    id: 3,
    title: 'Visa Info',
    slug: 'visa-info',
    excerpt: 'Nepal Visa Details: A single-entry visa valid for 15/30/90 days costs US$25/40/100. SAARC countries can get a 30-day visa for free on arrival. Indian passport holders do not need a visa to enter Nepal. Multiple-entry visas are useful if you are planning a side trip to Tibet, Bhutan or India and cost US$20 extra.',
    image: travelGuidesAssets.visa_information_cover,
    publishedAt: '2025-04-16',
    readTime: 4,
  },
];

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export default function TravelGuidesPage() {
  return (
    <main>
      {/* Hero Section */}
      <HeroSection
        image={travelGuidesAssets.travel_guides_cover.src}
        heading="Travel Guides"
        subheading="Essential tips, expert advice, and practical information for your Himalayan adventure"
      />

      {/* Introduction */}
      <section className="py-12 bg-white">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <Heading
            title="Plan Your Journey with Confidence"
            titleClass="text-center mb-4"
          />
          <p className="text-md text-gray-600 leading-relaxed">
            Whether you're a first-time trekker or a seasoned adventurer, our travel guides provide everything you need to know—from packing lists and gear recommendations to visa requirements and insights into Nepal's unique ecosystems. Let our local experts help you prepare for the experience of a lifetime.
          </p>
        </div>
      </section>

      {/* Guides Grid */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {travelGuides.map((guide) => (
              <div
                key={guide.id}
                className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition duration-300 flex flex-col"
              >
                <div className="relative h-56 overflow-hidden">
                  <Image
                    src={guide.image}
                    alt={guide.title}
                    fill
                    className="object-cover hover:scale-105 transition duration-500"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex items-center gap-3 text-sm text-gray-500 mb-3">
                    <span className="flex items-center gap-1">
                      <FontAwesomeIcon icon={faCalendarAlt} className="w-3 h-3" />
                      {formatDate(guide.publishedAt)}
                    </span>
                    <span className="flex items-center gap-1">
                      <FontAwesomeIcon icon={faBookOpen} className="w-3 h-3" />
                      {guide.readTime} min read
                    </span>
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
                    {guide.title}
                  </h2>
                  <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-4">
                    {guide.excerpt}
                  </p>
                  <Link
                    href={`/travel-guides/${guide.slug}`}
                    className="inline-flex items-center gap-2 text-primary-color-dark font-medium hover:underline mt-auto"
                  >
                    Read More
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Additional Guides Highlight – Optional: Show key topics */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <Heading
            title="What You'll Discover in Our Guides"
            titleClass="text-center mb-12"
          />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: faMapMarkedAlt, title: 'Trekking Routes', desc: 'Detailed descriptions of the best trails in Nepal, Tibet & Bhutan.' },
              { icon: faShieldAlt, title: 'Safety Tips', desc: 'Altitude sickness, weather, insurance, and emergency protocols.' },
              { icon: faPassport, title: 'Visa & Permits', desc: 'Up‑to‑date information on entry requirements and trekking permits.' },
              { icon: faQuestionCircle, title: 'FAQs', desc: 'Answers to common questions from first‑time trekkers.' },
            ].map((item, idx) => (
              <div key={idx} className="text-center">
                <div className="w-16 h-16 bg-primary-color-dark/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FontAwesomeIcon icon={item.icon} className="w-8 h-8 text-primary-color-dark" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Need Help Section – Contact info similar to reference site */}
      {/* <section className="py-16 bg-secondary-color text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 font-montserrat">
            Need Help? We're at your service
          </h2>
          <p className="text-lg text-white/90 mb-8">
            Our travel experts are ready to answer your questions and help you plan your perfect Himalayan adventure.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-stretch">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 flex-1">
              <h3 className="text-xl font-semibold mb-2">Trip Planner (Rohit)</h3>
              <Link
                href="https://wa.me/9779845449032"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition"
              >
                <FontAwesomeIcon icon={faWhatsapp} className="w-5 h-5" />
                +977 9845449032
              </Link>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 flex-1">
              <h3 className="text-xl font-semibold mb-2">Operation Manager (Raju)</h3>
              <Link
                href="tel:+61423765587"
                className="inline-flex items-center gap-2 bg-primary-color-dark hover:bg-primary-color text-white px-6 py-3 rounded-lg transition"
              >
                <FontAwesomeIcon icon={faPhone} className="w-5 h-5" />
                +61 423 765 587
              </Link>
            </div>
          </div>
          <div className="mt-8">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 bg-white text-secondary-color px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
            >
              <FontAwesomeIcon icon={faEnvelope} className="w-5 h-5" />
              Send us an email
            </Link>
          </div>
        </div>
      </section> */}

      {/* Structured Data – BreadcrumbList (optional) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://globalnepaltreks.com' },
              { '@type': 'ListItem', position: 2, name: 'Travel Guides', item: 'https://globalnepaltreks.com/travel-guides' },
            ],
          }),
        }}
      />
    </main>
  );
}