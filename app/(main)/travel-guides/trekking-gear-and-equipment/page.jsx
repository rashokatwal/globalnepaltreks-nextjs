// app/travel-guides/trekking-gears/page.js
import Link from 'next/link';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {  
  faShirt, 
  faShoePrints, 
  faFirstAid, 
  faSoap,
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
  title: 'Nepal Trekking Gear & Equipment | Full Packing Guide',
  description: 'Essential trekking gear for Nepal Himalayas including clothing, equipment, toiletries, and medical supplies for a safe trek.',
  // keywords: 'trekking gears nepal, trekking equipment, packing list for nepal trek, himalayan trekking gear, trekking boots, down jacket, sleeping bag, altitude sickness medicine, trekking poles, nepal trek packing, himalayan trek preparation, trek clothing guide',
  openGraph: {
    title: 'Trekking Gears and Equipments | Complete Packing List for Nepal Trekking',
    description: 'Essential trekking gear for Nepal Himalayas including clothing, equipment, toiletries, and medical supplies for a safe trek.',
    url: 'https://globalnepaltreks.com/travel-guides/trekking-gears',
    type: 'article',
    locale: 'en_US',
    siteName: 'Global Nepal Treks',
    images: [{ url: travelGuidesAssets.travel_gear_and_equipment_cover.src, width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Trekking Gears and Equipments | Complete Packing List for Nepal Trekking',
    description: 'Essential trekking gear and equipment for Nepal Himalayas.',
    images: [travelGuidesAssets.travel_gear_and_equipment_cover.src],
  },
  alternates: {
    canonical: 'https://globalnepaltreks.com/travel-guides/trekking-gears',
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
    "headline": "Trekking Gears and Equipments | Complete Packing List for Nepal Trekking",
    "description": "Essential trekking gear and equipment for Nepal Himalayas: clothing, trekking equipment, toiletries, and medical supplies. Expert packing guide for a safe and comfortable trek.",
    "url": "https://globalnepaltreks.com/travel-guides/trekking-gears",
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": "https://globalnepaltreks.com/travel-guides/trekking-gears"
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
      "url": travelGuidesAssets.travel_gear_and_equipment_cover.src,
      "width": 1200,
      "height": 630
    },
    "datePublished": "2025-04-08",
    "dateModified": "2026-05-31",
    "articleSection": "Travel Guides",
    "keywords": "trekking gears nepal, trekking equipment, packing list, himalayan trekking gear",
    "inLanguage": "en-US",
    "about": {
      "@type": "Thing",
      "name": "Trekking Gear",
      "description": "Essential equipment for trekking in the Himalayas"
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
        "name": "Trekking Gears and Equipments",
        "item": "https://globalnepaltreks.com/travel-guides/trekking-gears"
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

// Generate Checklist Schema
function generateChecklistSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Checklist",
    "name": "Trekking Gear Checklist for Nepal",
    "description": "Complete packing checklist for trekking in the Nepal Himalayas",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Clothing",
        "description": "Down jacket, thermal wear, trekking boots, socks, gloves, hats"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Trekking Gear",
        "description": "Backpack, sleeping bag, trekking poles, head torch, water bottles"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": "Toiletries",
        "description": "Toilet paper, soap, quick-dry towel, toothbrush"
      },
      {
        "@type": "ListItem",
        "position": 4,
        "name": "Medical Supplies",
        "description": "Altitude sickness medicine, sunscreen, pain relievers, first aid kit"
      }
    ],
    "numberOfItems": 4
  };
}

export default function TrekkingGearsPage() {
  // Generate all schemas
  const articleSchema = generateArticleSchema();
  const breadcrumbSchema = generateBreadcrumbSchema();
  const organizationSchema = generateOrganizationSchema();
  const checklistSchema = generateChecklistSchema();

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
        id="checklist-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(checklistSchema) }}
      />

      {/* Hero Section */}
      <HeroSection
        image={travelGuidesAssets.travel_gear_and_equipment_cover.src}
        heading="Trekking Gears and Equipments"
        subheading="Your complete packing guide for a safe and comfortable Himalayan adventure"
      />

      {/* Introduction */}
      <section className="py-12 bg-white">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <Heading title="What You Need to Know Before You Pack" titleClass="text-center mb-4" />
          <p className="text-md text-gray-600 leading-relaxed">
            Trekking in Nepal varies from easy to hard depending on the region, weather, and whether you go solo or with a guide.  
            Since Nepal is home to 8 of the world's 14 highest peaks, multi‑day treks are the norm.  
            A strong mindset and capable leadership are important, but having the right gear makes the journey safe and enjoyable.  
            Below is a detailed list of everything you should consider bringing.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4">
          <div className="space-y-12">
            {/* Clothing Section */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-2 border-b border-primary-color-dark inline-block">
                Clothing
              </h2>
              <div className="grid md:grid-cols-2 gap-6 mt-6">
                {[
                  { title: 'Down Jacket', desc: 'Warm down jacket that can withstand up to -10°C. Essential for high altitudes.' },
                  { title: 'Windproof Thin Jacket', desc: 'For lower altitudes and windy conditions; lightweight and packable.' },
                  { title: 'Trekking/Hiking Boots', desc: 'Sturdy, ankle‑supporting, waterproof boots with good grip. Break them in before the trek.' },
                  { title: 'Inner Thermal Wear', desc: 'Merino wool or synthetic base layers for cold regions.' },
                  { title: 'Socks', desc: 'Multiple pairs of varying thickness; wool or synthetic blend to avoid blisters.' },
                  { title: 'Trekking Tracks', desc: 'Lightweight, quick‑dry trekking pants for flexibility.' },
                  { title: 'Trousers', desc: 'Comfortable, breathable trousers for moderate temperatures.' },
                  { title: 'T‑shirts & Shorts', desc: 'Both long‑sleeved and short‑sleeved, preferably moisture‑wicking.' },
                  { title: 'Muffler Scarf / Balaclava', desc: 'Protects face and neck from cold, dry wind at high altitude.' },
                  { title: 'Caps & Woolen Hats', desc: 'Golf cap for sun protection; woolen hat for warmth.' },
                  { title: 'Gloves', desc: 'Thin gloves for lower altitudes; windproof woolen mittens for higher.' },
                  { title: 'Underwear', desc: 'Carry 5‑6 pairs; synthetic or merino wool for hygiene and comfort.' },
                  { title: 'Sports Bras', desc: 'For female trekkers; supportive and quick‑drying.' },
                ].map((item, idx) => (
                  <div key={idx} className="flex gap-3">
                    <FontAwesomeIcon icon={faShirt} className="w-5 h-5 text-accent-color mt-1 shrink-0" />
                    <div>
                      <h3 className="font-semibold text-gray-900">{item.title}</h3>
                      <p className="text-sm text-gray-600">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Trekking Gear */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-2 border-b border-primary-color-dark inline-block">
                Trekking Gear & Equipment
              </h2>
              <div className="grid md:grid-cols-2 gap-6 mt-6">
                {[
                  { title: 'Gaiters', desc: 'Keeps snow, mud, and stones out of your boots. Especially useful in winter.' },
                  { title: 'Raincoat / Cover Plastic', desc: 'Essential during monsoon; covers both body and backpack.' },
                  { title: 'Backpack', desc: '20L for day‑pack with porter; 50‑70L if carrying everything yourself.' },
                  { title: 'Sleeping Bag', desc: 'Rated for -10°C or lower; teahouse blankets may not be enough.' },
                  { title: 'Trekking Poles', desc: 'Reduces pressure on knees, helps balance on steep or loose terrain.' },
                  { title: 'Head Torch', desc: 'For early morning starts and navigating in the dark; bring spare batteries.' },
                  { title: 'UV Protection Sunglasses', desc: 'Protects eyes from intense sun and snow glare; category 3 or 4 lenses.' },
                  { title: 'Crampons', desc: 'Detachable crampons for icy sections (optional but recommended in winter).' },
                  { title: 'Camera & Accessories', desc: 'Extra batteries, memory cards, small tripod.' },
                  { title: 'Mobile & Power Bank', desc: 'Charge devices; electricity may be scarce at higher altitudes.' },
                  { title: 'Water Bottles', desc: '2‑3 liters capacity; reusable and insulated.' },
                  { title: 'High‑Energy Snacks', desc: 'Dark chocolate, nuts, energy bars for quick energy.' },
                  { title: 'Tents', desc: 'For camping treks; if you plan to stay in tea houses, not needed.' },
                  { title: 'Sleeping Mat', desc: 'Insulated mat for camping or extra comfort in lodges.' },
                ].map((item, idx) => (
                  <div key={idx} className="flex gap-3">
                    <FontAwesomeIcon icon={faShoePrints} className="w-5 h-5 text-primary-color-dark mt-1 shrink-0" />
                    <div>
                      <h3 className="font-semibold text-gray-900">{item.title}</h3>
                      <p className="text-sm text-gray-600">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Toiletries */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-2 border-b border-primary-color-dark inline-block">
                Toiletries
              </h2>
              <div className="grid md:grid-cols-2 gap-6 mt-6">
                {[
                  { title: 'Toilet Paper Rolls', desc: 'Carry your own; biodegradable preferred.' },
                  { title: 'Toothbrush & Toothpaste', desc: 'Travel size.' },
                  { title: 'Soap', desc: 'Biodegradable soap for washing hands and clothes.' },
                  { title: 'Quick‑Dry Towel', desc: 'Lightweight and fast‑drying.' },
                ].map((item, idx) => (
                  <div key={idx} className="flex gap-3">
                    <FontAwesomeIcon icon={faSoap} className="w-5 h-5 text-primary-color-dark mt-1 shrink-0" />
                    <div>
                      <h3 className="font-semibold text-gray-900">{item.title}</h3>
                      <p className="text-sm text-gray-600">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Medical Supplies */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-2 border-b border-primary-color-dark inline-block">
                Medical Supplies
              </h2>
              <div className="grid md:grid-cols-2 gap-6 mt-6">
                {[
                  { title: 'Altitude Sickness Medicines', desc: 'Acetazolamide (Diamox) – consult your doctor before use.' },
                  { title: 'Sunscreen Lotion (SPF 50+)', desc: 'Protects against intense UV rays at high altitude.' },
                  { title: 'Lip Guard / Moisturizer', desc: 'Prevents chapped lips in cold, dry air.' },
                  { title: 'Pain Relief Spray', desc: 'For muscle aches after long trekking days.' },
                  { title: 'Pain Killer Tablets', desc: 'Paracetamol or ibuprofen for headaches and minor pains.' },
                  { title: 'Hand Sanitizer', desc: 'Maintain hygiene when water is scarce.' },
                  { title: 'Antibacterial Powder', desc: 'For minor cuts and bruises.' },
                  { title: 'Insect Repellent Cream', desc: 'Protects against mosquitoes and other insects in lower regions.' },
                ].map((item, idx) => (
                  <div key={idx} className="flex gap-3">
                    <FontAwesomeIcon icon={faFirstAid} className="w-5 h-5 text-red-600 mt-1 shrink-0" />
                    <div>
                      <h3 className="font-semibold text-gray-900">{item.title}</h3>
                      <p className="text-sm text-gray-600">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final Tips */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4">
          <div className="bg-gray-50 rounded-xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Packing Smart for Your Trek</h2>
            <ul className="space-y-2 text-gray-700">
              <li>Rent heavy gear (sleeping bag, down jacket, trekking poles) in Kathmandu to save luggage space.</li>
              <li>Test your boots before the trek to avoid blisters.</li>
              <li>Pack layers – temperatures vary greatly between day and night.</li>
              <li>Carry a reusable water bottle and purification tablets to reduce plastic waste.</li>
              <li>Remember that less is more – you don't need to bring everything from this list; choose based on season and route.</li>
            </ul>
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
            Our trekking experts are here to answer your gear questions and help you prepare.
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