// app/travel-guides/tourist-security-in-nepal/page.js
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faShieldAlt,
  faPhone,
  faMapMarkerAlt,
  faUserShield,
  faExclamationTriangle,
  faWallet,
  faIdCard,
  faMoneyBillWave,
  faSuitcaseRolling,
  faHeadset,
  faQuestionCircle,
  faCheckCircle,
  faEnvelope
} from '@fortawesome/free-solid-svg-icons';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import Link from 'next/link';
import HeroSection from '@/app/components/sections/HeroSection';
import Heading from '@/app/components/ui/Heading';
import { travelGuidesAssets } from '@/app/assets/assets';
import Script from 'next/script';

// SEO metadata
export const metadata = {
  title: 'Tourist Security in Nepal | Tourist Police Contacts & Safety Tips',
  description: 'Tourist Police offices and hotline numbers across Nepal, what the Tourist Police do, and practical safety precautions for visitors travelling in Nepal.',
  openGraph: {
    title: 'Tourist Security in Nepal | Tourist Police Contacts & Safety Tips',
    description: "Find Nepal's Tourist Police hotline and station contacts, learn what services they offer, and follow practical safety tips for a secure trip.",
    url: 'https://globalnepaltreks.com/travel-guides/tourist-security-in-nepal',
    type: 'article',
    locale: 'en_US',
    siteName: 'Global Nepal Treks',
    images: [{ url: travelGuidesAssets.tourist_security_in_nepal_cover.src, width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tourist Security in Nepal | Tourist Police Contacts & Safety Tips',
    description: "Find Nepal's Tourist Police hotline and station contacts, learn what services they offer, and follow practical safety tips for a secure trip.",
    images: [travelGuidesAssets.tourist_security_in_nepal_cover.src],
  },
  alternates: {
    canonical: 'https://globalnepaltreks.com/travel-guides/tourist-security-in-nepal',
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
    "headline": "Tourist Security in Nepal | Tourist Police Contacts & Safety Tips",
    "description": "An overview of Nepal's Tourist Police service, their station contacts across the country, and practical safety precautions for travellers.",
    "url": "https://globalnepaltreks.com/travel-guides/tourist-security-in-nepal",
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": "https://globalnepaltreks.com/travel-guides/tourist-security-in-nepal"
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
      "url": travelGuidesAssets.tourist_security_in_nepal_cover.src,
      "width": 1200,
      "height": 630
    },
    "datePublished": "2025-09-15",
    "dateModified": "2026-06-17",
    "articleSection": "Travel Guides",
    "keywords": "tourist police nepal, tourist security nepal, nepal emergency numbers, nepal travel safety, nepal tourist helpline 1144",
    "inLanguage": "en-US",
    "about": {
      "@type": "Thing",
      "name": "Tourist Security in Nepal",
      "description": "Tourist Police services, contacts, and safety precautions for travellers in Nepal"
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
        "name": "Tourist Security in Nepal",
        "item": "https://globalnepaltreks.com/travel-guides/tourist-security-in-nepal"
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

// Generate FAQPage Schema
function generateFAQSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What number do I call for Tourist Police in Nepal?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Dial the toll-free Tourist Police hotline at 1144, or call +977-01-4247041 / +977-9851289444 for the central office at Bhrikutimandap, Kathmandu."
        }
      },
      {
        "@type": "Question",
        "name": "Do Tourist Police officers speak English?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes. Tourist Police officers are trained to communicate in English and other languages so they can assist international visitors directly."
        }
      },
      {
        "@type": "Question",
        "name": "Is Nepal generally safe for tourists?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Nepal is generally considered a safe destination for travellers, with violent crime against tourists being rare. Petty theft and opportunistic pickpocketing in crowded areas like Thamel are the more common, low-level risks."
        }
      },
      {
        "@type": "Question",
        "name": "What should I do if my passport or valuables are stolen in Nepal?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Report the loss to the nearest Tourist Police station or the 1144 hotline immediately, then contact your embassy or consulate to begin replacing your passport."
        }
      },
      {
        "@type": "Question",
        "name": "Are there Tourist Police outside Kathmandu?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes. Beyond the Kathmandu valley, Tourist Police units operate in major destinations such as Pokhara, Chitwan (Sauraha), Lukla, and Syafrubesi, with additional seasonal presence on popular trekking routes."
        }
      }
    ]
  };
}

export default function TouristSecurityInNepalPage() {
  const articleSchema = generateArticleSchema();
  const breadcrumbSchema = generateBreadcrumbSchema();
  const organizationSchema = generateOrganizationSchema();
  const faqSchema = generateFAQSchema();

  const kathmanduValleyUnits = [
    { name: 'Bhrikutimandap (Head Office)', phone: '9851289445' },
    { name: 'Thamel', phone: '9851289453' },
    { name: 'Basantapur', phone: '9851289454' },
    { name: 'Pashupati', phone: '9851289446' },
    { name: 'Bouddhanath', phone: '9851289451' },
    { name: 'Swayambhu', phone: '9851289452' },
    { name: 'Tribhuvan Airport', phone: '9851289450' },
    { name: 'Patan (Mangal Bazar)', phone: '9851289449' },
    { name: 'Bhaktapur', phone: '9851289448' },
    { name: 'Nagarkot', phone: '9851289447' },
  ];

  const beyondValleyUnits = [
    { area: 'Pokhara, Kaski', note: 'Lakeside and the wider Annapurna gateway region' },
    { area: 'Ghandruk, Dhampus & Birethanti, Kaski', note: 'Popular Annapurna foothill trekking stops' },
    { area: 'Chame, Manang', note: 'Annapurna Circuit trail' },
    { area: 'Lukla, Solukhumbu', note: 'Gateway to the Everest region' },
    { area: 'Sauraha & Patihani, Chitwan', note: 'Chitwan National Park wildlife tourism hub' },
    { area: 'Syafrubesi, Rasuwa', note: 'Langtang and Tamang Heritage trail entry point' },
    { area: 'Kakarvitta, Jhapa', note: 'Eastern Nepal–India border crossing' },
  ];

  return (
    <main>
      {/* JSON-LD Structured Data */}
      <Script id="article-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <Script id="breadcrumb-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <Script id="organization-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }} />
      <Script id="faq-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      {/* Hero Section */}
      <HeroSection
        image={travelGuidesAssets.tourist_security_in_nepal_cover.src}
        heading="Tourist Security in Nepal"
        subheading="Tourist Police contacts and practical safety advice for travellers"
      />

      {/* Introduction */}
      <section className="py-12 bg-white">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <Heading title="A Dedicated Force for Visitor Safety" titleClass="text-center mb-4" />
          <p className="text-md text-gray-600 leading-relaxed">
            Nepal's Tourist Police was established on 26 January 1979 as a special unit of Nepal Police, working under the Ministry of Culture, Tourism and Civil Aviation.
            Officers are trained to communicate in English and other languages, and their sole mandate is keeping visitors safe – registering complaints, investigating incidents, patrolling tourist hubs, and helping travellers navigate problems that arise far from home.
            Their motto says it plainly: "Tourist Police for Tourists' Safety."
          </p>
        </div>
      </section>

      {/* Tourist Police Contacts */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <Heading title="Tourist Police Contacts" titleClass="text-center mb-4" />
          <p className="text-center text-gray-500 max-w-3xl mx-auto mb-10">
            Save these numbers before you travel. The central office sits inside the Nepal Tourism Board premises at Bhrikutimandap, Kathmandu.
          </p>

          <div className="bg-primary-color-dark text-white rounded-xl p-6 mb-10 flex flex-col sm:flex-row items-center justify-center gap-6 text-center sm:text-left">
            <FontAwesomeIcon icon={faHeadset} className="w-10 h-10" />
            <div>
              <p className="font-bold text-lg">Toll-Free Tourist Hotline: 1144</p>
              <p className="text-white/80 text-sm">Central office: +977-01-4247041 · +977-9851289444</p>
            </div>
          </div>

          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <FontAwesomeIcon icon={faMapMarkerAlt} className="w-5 h-5 text-primary-color-dark" />
            Kathmandu Valley Units
          </h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
            {kathmanduValleyUnits.map((unit) => (
              <div key={unit.name} className="bg-white rounded-xl p-5 flex items-center justify-between hover:shadow-md transition">
                <span className="font-medium text-gray-800">{unit.name}</span>
                <span className="text-sm text-primary-color-dark font-semibold flex items-center gap-1">
                  <FontAwesomeIcon icon={faPhone} className="w-3.5 h-3.5" />
                  {unit.phone}
                </span>
              </div>
            ))}
          </div>

          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <FontAwesomeIcon icon={faMapMarkerAlt} className="w-5 h-5 text-primary-color-dark" />
            Beyond the Valley
          </h3>
          <div className="grid sm:grid-cols-2 gap-4">
            {beyondValleyUnits.map((unit) => (
              <div key={unit.area} className="bg-white rounded-xl p-5 hover:shadow-md transition">
                <p className="font-medium text-gray-800 mb-1">{unit.area}</p>
                <p className="text-sm text-gray-500">{unit.note}</p>
              </div>
            ))}
          </div>
          <p className="text-sm text-gray-500 mt-6 text-center">
            Tourist Police units also operate seasonally at other major destinations and trekking checkpoints; the 1144 hotline can always direct you to the nearest one.
          </p>
        </div>
      </section>

      {/* What Tourist Police Do */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <Heading title="What the Tourist Police Do" titleClass="text-center mb-12" />
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-gray-50 rounded-xl p-6 text-center">
              <FontAwesomeIcon icon={faUserShield} className="w-8 h-8 text-primary-color-dark mb-3" />
              <h3 className="font-bold text-gray-900 mb-2">Patrol & Protect</h3>
              <p className="text-sm text-gray-600">Maintain a visible presence in tourist hubs like Thamel, Pokhara Lakeside, and major heritage sites.</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-6 text-center">
              <FontAwesomeIcon icon={faShieldAlt} className="w-8 h-8 text-primary-color-dark mb-3" />
              <h3 className="font-bold text-gray-900 mb-2">Register Complaints</h3>
              <p className="text-sm text-gray-600">Take reports of theft, harassment, or disputes and investigate matters affecting visitors.</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-6 text-center">
              <FontAwesomeIcon icon={faHeadset} className="w-8 h-8 text-primary-color-dark mb-3" />
              <h3 className="font-bold text-gray-900 mb-2">Emergency Response</h3>
              <p className="text-sm text-gray-600">Act as first responders during medical emergencies, treks gone wrong, or natural disasters, liaising with rescue and medical teams.</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-6 text-center">
              <FontAwesomeIcon icon={faEnvelope} className="w-8 h-8 text-primary-color-dark mb-3" />
              <h3 className="font-bold text-gray-900 mb-2">Embassy Liaison</h3>
              <p className="text-sm text-gray-600">Bridge communication between tourists and their embassy or consulate during arrests, illness, or other crises.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Practical Safety Tips */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <Heading title="Practical Safety Tips for Visitors" titleClass="text-center mb-4" />
          <p className="text-center text-gray-500 max-w-3xl mx-auto mb-12">
            Nepal is a generally safe destination, and most incidents involving tourists are opportunistic theft rather than violent crime. These habits make that even less likely.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl p-6 hover:shadow-md transition">
              <FontAwesomeIcon icon={faIdCard} className="w-8 h-8 text-primary-color-dark mb-3" />
              <h3 className="font-bold text-gray-900 mb-2">Book Through Registered Operators</h3>
              <p className="text-sm text-gray-600">Use government-registered travel and trekking agencies, government-registered hotels and lodges, and porters authorized by your agency or hotel.</p>
            </div>
            <div className="bg-white rounded-xl p-6 hover:shadow-md transition">
              <FontAwesomeIcon icon={faMoneyBillWave} className="w-8 h-8 text-primary-color-dark mb-3" />
              <h3 className="font-bold text-gray-900 mb-2">Exchange Money at Authorized Counters</h3>
              <p className="text-sm text-gray-600">Only change foreign currency at licensed banks or exchange counters, and avoid informal street exchanges however good the rate looks.</p>
            </div>
            <div className="bg-white rounded-xl p-6 hover:shadow-md transition">
              <FontAwesomeIcon icon={faWallet} className="w-8 h-8 text-primary-color-dark mb-3" />
              <h3 className="font-bold text-gray-900 mb-2">Carry Your Wallet Securely</h3>
              <p className="text-sm text-gray-600">Avoid back pockets; an inside jacket pocket or a front trouser pocket is much harder for a pickpocket to reach.</p>
            </div>
            <div className="bg-white rounded-xl p-6 hover:shadow-md transition">
              <FontAwesomeIcon icon={faIdCard} className="w-8 h-8 text-primary-color-dark mb-3" />
              <h3 className="font-bold text-gray-900 mb-2">Carry Copies, Not Originals</h3>
              <p className="text-sm text-gray-600">Keep certified copies of your passport and visa on you, and leave the originals and other valuables in your hotel's safe deposit box.</p>
            </div>
            <div className="bg-white rounded-xl p-6 hover:shadow-md transition">
              <FontAwesomeIcon icon={faMoneyBillWave} className="w-8 h-8 text-primary-color-dark mb-3" />
              <h3 className="font-bold text-gray-900 mb-2">Limit How Much Cash You Carry</h3>
              <p className="text-sm text-gray-600">Carry only a reasonable amount of cash for the day, and rely on cards or travellers' cheques for the rest where possible.</p>
            </div>
            <div className="bg-white rounded-xl p-6 hover:shadow-md transition">
              <FontAwesomeIcon icon={faSuitcaseRolling} className="w-8 h-8 text-primary-color-dark mb-3" />
              <h3 className="font-bold text-gray-900 mb-2">Never Leave Bags Unattended</h3>
              <p className="text-sm text-gray-600">Keep luggage and valuables in sight at all times in stations, restaurants, and shared transport; report any loss to the nearest police station immediately.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Other Emergency Numbers */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4">
          <Heading title="Other Useful Emergency Numbers" titleClass="text-center mb-10" />
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-gray-50 rounded-xl p-6 text-center">
              <h3 className="font-bold text-gray-900 mb-1">Nepal Police</h3>
              <p className="text-2xl font-bold text-primary-color-dark">100</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-6 text-center">
              <h3 className="font-bold text-gray-900 mb-1">Ambulance</h3>
              <p className="text-2xl font-bold text-primary-color-dark">102</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-6 text-center">
              <h3 className="font-bold text-gray-900 mb-1">Fire Service</h3>
              <p className="text-2xl font-bold text-primary-color-dark">101</p>
            </div>
          </div>
          <p className="text-sm text-gray-500 text-center mt-6 flex items-center justify-center gap-2">
            <FontAwesomeIcon icon={faExclamationTriangle} className="w-4 h-4 text-amber-600" />
            Save your embassy or consulate's contact details before you arrive in Nepal in case you need consular assistance.
          </p>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4">
          <Heading title="Frequently Asked Questions" titleClass="text-center mb-12" />
          <div className="space-y-6">
            {[
              { q: "What number do I call for Tourist Police in Nepal?", a: "Dial the toll-free Tourist Police hotline at 1144, or call +977-01-4247041 / +977-9851289444 for the central office at Bhrikutimandap, Kathmandu." },
              { q: "Do Tourist Police officers speak English?", a: "Yes. Tourist Police officers are trained to communicate in English and other languages so they can assist international visitors directly." },
              { q: "Is Nepal generally safe for tourists?", a: "Nepal is generally considered a safe destination for travellers, with violent crime against tourists being rare. Petty theft and opportunistic pickpocketing in crowded areas like Thamel are the more common, low-level risks." },
              { q: "What should I do if my passport or valuables are stolen in Nepal?", a: "Report the loss to the nearest Tourist Police station or the 1144 hotline immediately, then contact your embassy or consulate to begin replacing your passport." },
              { q: "Are there Tourist Police outside Kathmandu?", a: "Yes. Beyond the Kathmandu valley, Tourist Police units operate in major destinations such as Pokhara, Chitwan (Sauraha), Lukla, and Syafrubesi, with additional seasonal presence on popular trekking routes." },
            ].map((item) => (
              <div key={item.q} className="bg-white rounded-xl p-6">
                <h3 className="flex items-start gap-2 font-bold text-gray-900 mb-2">
                  <FontAwesomeIcon icon={faQuestionCircle} className="w-5 h-5 text-primary-color-dark mt-1 shrink-0" />
                  {item.q}
                </h3>
                <p className="text-sm text-gray-600 pl-7">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Need Help Section */}
      {/* <section className="py-16 bg-secondary-color text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 font-montserrat">
            Travelling With Us Means Built-In Peace of Mind
          </h2>
          <p className="text-lg text-white/90 mb-8">
            Every trip we arrange uses registered guides, hotels, and porters — talk to us about your itinerary.
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