// app/travel-guides/protected-areas/page.js
import Link from 'next/link';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTree,
  faMountain,
  faWater,
  faLeaf,
  faBird,
  faLandmark,
  faPhone,
  faEnvelope,
  faCheckCircle
} from '@fortawesome/free-solid-svg-icons';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import HeroSection from '@/app/components/sections/HeroSection';
import Heading from '@/app/components/ui/Heading';
import { travelGuidesAssets } from '@/app/assets/assets';
import Script from 'next/script';

// SEO metadata
export const metadata = {
  title: 'Protected Areas and Ecosystems of Nepal | Conservation & Biodiversity Guide',
  description: 'Explore Nepal\'s national parks, wildlife reserves & conservation areas. Discover rich biodiversity, Himalayan ecosystems, and conservation efforts.',
  // keywords: 'protected areas nepal, national parks nepal, chitwan national park, sagarmatha national park, nepal biodiversity, ecosystem conservation, nepal wildlife reserves, annapurna conservation area, nepal protected areas list, himalayan conservation',
  openGraph: {
    title: 'Protected Areas and Ecosystems of Nepal | Conservation & Biodiversity Guide',
    description: 'Explore Nepal\'s national parks, wildlife reserves, and conservation areas. Learn about the rich biodiversity, ecosystems, and conservation efforts in the Himalayas.',
    url: 'https://globalnepaltreks.com/travel-guides/protected-areas',
    type: 'article',
    locale: 'en_US',
    siteName: 'Global Nepal Treks',
    images: [{ url: travelGuidesAssets.protected_areas_of_nepal_cover.src, width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Protected Areas and Ecosystems of Nepal | Conservation & Biodiversity Guide',
    description: 'Explore Nepal\'s national parks, wildlife reserves, and conservation areas. Learn about rich biodiversity and conservation efforts.',
    images: [travelGuidesAssets.protected_areas_of_nepal_cover.src],
  },
  alternates: {
    canonical: 'https://globalnepaltreks.com/travel-guides/protected-areas',
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

// Generate Article Schema
function generateArticleSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "Protected Areas and Ecosystems of Nepal | Conservation & Biodiversity Guide",
    "description": "Explore Nepal's national parks, wildlife reserves, and conservation areas. Learn about the rich biodiversity, ecosystems, and conservation efforts in the Himalayas.",
    "url": "https://globalnepaltreks.com/travel-guides/protected-areas",
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": "https://globalnepaltreks.com/travel-guides/protected-areas"
    },
    "author": {
      "@type": "Organization",
      "name": "Global Nepal Treks",
      "url": "https://globalnepaltreks.com"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Global Nepal Treks",
      "logo": {
        "@type": "ImageObject",
        "url": "https://globalnepaltreks.com/logo.png"
      }
    },
    "image": {
      "@type": "ImageObject",
      "url": travelGuidesAssets.protected_areas_of_nepal_cover.src,
      "width": 1200,
      "height": 630
    },
    "datePublished": "2025-04-15",
    "dateModified": "2026-05-31",
    "articleSection": "Travel Guides",
    "keywords": "protected areas nepal, national parks nepal, biodiversity, conservation, himalayan ecosystem",
    "inLanguage": "en-US",
    "about": {
      "@type": "Thing",
      "name": "Protected Areas of Nepal",
      "description": "National parks, wildlife reserves, and conservation areas in Nepal"
    }
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
        "name": "Travel Guides",
        "item": "https://globalnepaltreks.com/travel-guides"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": "Protected Areas and Ecosystems of Nepal",
        "item": "https://globalnepaltreks.com/travel-guides/protected-areas"
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

// Generate HowTo Schema for visiting protected areas
function generateHowToSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": "How to Visit Protected Areas in Nepal",
    "description": "A guide to visiting Nepal's national parks, wildlife reserves, and conservation areas responsibly.",
    "step": [
      {
        "@type": "HowToStep",
        "name": "Choose Your Destination",
        "text": "Select from Nepal's national parks like Chitwan, Sagarmatha, or Annapurna Conservation Area based on your interests."
      },
      {
        "@type": "HowToStep",
        "name": "Get Necessary Permits",
        "text": "Obtain required entry permits from the Department of National Parks and Wildlife Conservation or local entry points."
      },
      {
        "@type": "HowToStep",
        "name": "Plan Your Visit",
        "text": "Book eco-friendly accommodations, hire licensed guides, and prepare appropriate gear for the terrain."
      },
      {
        "@type": "HowToStep",
        "name": "Follow Conservation Guidelines",
        "text": "Stay on designated trails, don't feed wildlife, and support local conservation efforts."
      }
    ],
    "totalTime": "P3D",
    "estimatedCost": {
      "@type": "MonetaryAmount",
      "currency": "USD",
      "value": "30"
    }
  };
}

export default function ProtectedAreasPage() {
  // Generate all schemas
  const articleSchema = generateArticleSchema();
  const breadcrumbSchema = generateBreadcrumbSchema();
  const organizationSchema = generateOrganizationSchema();
  const howToSchema = generateHowToSchema();

  return (
    <main>
      {/* JSON-LD Structured Data */}
      <Script
        id="article-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
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
        id="howto-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
      />

      {/* Hero Section */}
      <HeroSection
        image={travelGuidesAssets.protected_areas_of_nepal_cover.src}
        heading="Protected Areas and Ecosystems of Nepal"
        subheading="Discover Nepal’s natural heritage and conservation efforts"
      />

      {/* Introduction */}
      <section className="py-12 bg-white">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <Heading title="Guardians of Biodiversity" titleClass="text-center mb-4" />
          <p className="text-md text-gray-600 leading-relaxed">
            Nepal is a biodiversity hotspot, home to an incredible variety of ecosystems ranging from the lush tropical forests of the Terai to the alpine meadows of the high Himalayas.  
            To protect this natural wealth, the country has established an extensive network of protected areas – including national parks, wildlife reserves, conservation areas, and buffer zones.  
            These areas not only safeguard rare species like the Bengal tiger, one‑horned rhinoceros, and snow leopard but also provide vital ecosystem services and support local communities through sustainable tourism.
          </p>
        </div>
      </section>

      {/* Protected Areas Overview */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <Heading title="Nepal’s Protected Area System" titleClass="text-center mb-12" />

          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">What Are Protected Areas?</h2>
              <p className="text-gray-600 mb-4">
                Protected areas (PAs) are designated regions where natural ecosystems, biological processes, and species receive special protection.  
                According to IUCN and UN Environment’s World Conservation Monitoring Centre, there are over 238,000 protected areas worldwide, covering nearly 15% of the Earth’s land surface.  
                In Nepal, PAs cover about 23% of the country – one of the highest percentages in the world.
              </p>
              <p className="text-gray-600">
                These areas are managed under different categories: National Parks, Wildlife Reserves, Conservation Areas, and Hunting Reserves.  
                They serve as sanctuaries for endangered species, sources of clean water, and anchors for community‑based tourism.
              </p>
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Why They Matter</h2>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start gap-2">
                  <FontAwesomeIcon icon={faTree} className="w-5 h-5 text-green-600 mt-1" />
                  <span>Preserve critical habitats for iconic species like tigers, rhinos, and snow leopards.</span>
                </li>
                <li className="flex items-start gap-2">
                  <FontAwesomeIcon icon={faWater} className="w-5 h-5 text-blue-500 mt-1" />
                  <span>Protect watersheds that provide water for millions of people downstream.</span>
                </li>
                <li className="flex items-start gap-2">
                  <FontAwesomeIcon icon={faLandmark} className="w-5 h-5 text-amber-600 mt-1" />
                  <span>Support sustainable tourism, creating jobs and income for local communities.</span>
                </li>
                <li className="flex items-start gap-2">
                  <FontAwesomeIcon icon={faLeaf} className="w-5 h-5 text-green-600 mt-1" />
                  <span>Combat climate change by storing carbon and maintaining ecosystem resilience.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Major Protected Areas */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <Heading title="Key Protected Areas of Nepal" titleClass="text-center mb-12" />

          <div className="space-y-12">
            {/* National Parks */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-2 border-b border-primary-color-dark inline-block">
                National Parks
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                {[
                  { name: 'Sagarmatha National Park', region: 'Everest Region', icon: faMountain, desc: 'UNESCO World Heritage Site, home to Mount Everest, snow leopard, and Himalayan tahr.' },
                  { name: 'Chitwan National Park', region: 'Terai', icon: faTree, desc: 'UNESCO site, famous for one‑horned rhinoceros, Bengal tiger, and elephant safaris.' },
                  { name: 'Langtang National Park', region: 'Central Himalayas', icon: faMountain, desc: 'Protects the Langtang Valley, red pandas, and diverse bird species.' },
                  { name: 'Bardia National Park', region: 'Western Terai', icon: faTree, desc: 'Largest Terai park, excellent for tiger and rhino sightings; less crowded.' },
                  { name: 'Shey Phoksundo National Park', region: 'Dolpo', icon: faWater, desc: 'Nepal’s largest national park, home to the turquoise Shey Phoksundo Lake and snow leopards.' },
                ].map((park) => (
                  <div key={park.name} className="bg-gray-50 rounded-xl p-6 hover:shadow-md transition">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-primary-color-dark/10 rounded-full flex items-center justify-center">
                        <FontAwesomeIcon icon={park.icon} className="w-5 h-5 text-primary-color-dark" />
                      </div>
                      <h3 className="text-lg font-bold text-gray-900">{park.name}</h3>
                    </div>
                    <p className="text-sm text-gray-500 mb-2">{park.region}</p>
                    <p className="text-sm text-gray-600">{park.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Wildlife Reserves */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-2 border-b border-primary-color-dark inline-block">
                Wildlife Reserves
              </h2>
              <div className="grid md:grid-cols-2 gap-6 mt-6">
                {[
                  { name: 'Koshi Tappu Wildlife Reserve', region: 'Eastern Terai', desc: 'Important wetland, home to wild water buffalo and over 400 bird species.' },
                  { name: 'Parsa Wildlife Reserve', region: 'Central Terai', desc: 'Forest habitat for elephants, tigers, and leopards; contiguous with Chitwan.' },
                  { name: 'Suklaphanta Wildlife Reserve', region: 'Far Western Terai', desc: 'Grasslands and sal forests, known for swamp deer and tiger sightings.' },
                ].map((reserve) => (
                  <div key={reserve.name} className="bg-gray-50 rounded-xl p-6 hover:shadow-md transition">
                    <h3 className="text-lg font-bold text-gray-900 mb-2">{reserve.name}</h3>
                    <p className="text-sm text-gray-500 mb-2">{reserve.region}</p>
                    <p className="text-sm text-gray-600">{reserve.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Conservation Areas */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-2 border-b border-primary-color-dark inline-block">
                Conservation Areas
              </h2>
              <div className="grid md:grid-cols-2 gap-6 mt-6">
                {[
                  { name: 'Annapurna Conservation Area', region: 'Central Nepal', desc: 'Nepal’s largest protected area, covering diverse landscapes and home to rich cultural heritage.' },
                  { name: 'Manaslu Conservation Area', region: 'Gorkha', desc: 'Protects the Manaslu region, known for Tibetan Buddhist culture and snow leopard habitat.' },
                  { name: 'Kanchenjunga Conservation Area', region: 'Eastern Nepal', desc: 'Remote wilderness around the world’s third‑highest peak, rich in biodiversity.' },
                  { name: 'Gaurishankar Conservation Area', region: 'Dolakha/Ramechhap', desc: 'Protects forests and wildlife along the Rolwaling Valley.' },
                ].map((area) => (
                  <div key={area.name} className="bg-gray-50 rounded-xl p-6 hover:shadow-md transition">
                    <h3 className="text-lg font-bold text-gray-900 mb-2">{area.name}</h3>
                    <p className="text-sm text-gray-500 mb-2">{area.region}</p>
                    <p className="text-sm text-gray-600">{area.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Ecosystems & Biodiversity */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-2 border-b border-primary-color-dark inline-block">
                Diverse Ecosystems
              </h2>
              <div className="prose prose-lg max-w-none text-gray-600">
                <p>
                  Nepal’s unique geography – from the lowland Terai (60 m) to the highest peak on Earth (8,848 m) – creates a stunning range of ecosystems within just 200 km.  
                  These include:
                </p>
                <ul className="list-disc pl-6 space-y-2 mt-4">
                  <li><strong>Tropical Deciduous Forests</strong> – in the Terai, home to sal trees, rhinos, tigers, and elephants.</li>
                  <li><strong>Subtropical Broadleaf Forests</strong> – in the mid‑hills, with chir pine and rhododendron.</li>
                  <li><strong>Temperate Forests</strong> – oak, maple, and fir forests, habitat for red pandas and Himalayan black bears.</li>
                  <li><strong>Subalpine & Alpine Meadows</strong> – above 3,500 m, with juniper, rhododendron shrubs, and grazing grounds for blue sheep and tahr.</li>
                  <li><strong>Glacial & High‑Altitude Zones</strong> – above 5,000 m, extreme cold, snow leopards, and spectacular mountain views.</li>
                </ul>
                <p className="mt-4">
                  This altitudinal variation supports over 6,500 plant species, 900 bird species, and more than 200 mammal species, making Nepal one of the most biodiverse countries per square kilometer in the world.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Conservation Challenges & Tourism */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Challenges & Conservation Efforts</h2>
              <p className="text-gray-600 mb-4">
                Nepal’s protected areas face pressures from poaching, habitat fragmentation, and climate change.  
                However, dedicated efforts by the Department of National Parks and Wildlife Conservation, local communities, and international partners have led to significant successes:  
                the rhino population in Chitwan has rebounded, tiger numbers have increased, and community‑based anti‑poaching units are active across the Terai.
              </p>
              <p className="text-gray-600">
                Sustainable tourism plays a key role – park entrance fees fund conservation, and eco‑lodges provide alternatives to unsustainable land use.
              </p>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">How Visitors Can Help</h2>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start gap-2">
                  <FontAwesomeIcon icon={faCheckCircle} className="w-5 h-5 text-green-600 mt-1 shrink-0" />
                  <span>Follow park rules and stay on designated trails.</span>
                </li>
                <li className="flex items-start gap-2">
                  <FontAwesomeIcon icon={faCheckCircle} className="w-5 h-5 text-green-600 mt-1 shrink-0" />
                  <span>Support local conservation initiatives by visiting community‑managed buffer zones.</span>
                </li>
                <li className="flex items-start gap-2">
                  <FontAwesomeIcon icon={faCheckCircle} className="w-5 h-5 text-green-600 mt-1 shrink-0" />
                  <span>Never feed wildlife or purchase products made from endangered species.</span>
                </li>
                <li className="flex items-start gap-2">
                  <FontAwesomeIcon icon={faCheckCircle} className="w-5 h-5 text-green-600 mt-1 shrink-0" />
                  <span>Choose eco‑friendly accommodations and responsible tour operators.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Need Help Section */}
      {/* <section className="py-16 bg-secondary-color text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 font-montserrat">
            Need Help? We're at your service
          </h2>
          <p className="text-lg text-white/90 mb-8">
            Our travel experts can help you plan an eco‑friendly visit to Nepal’s protected areas.
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
    </main>
  );
}