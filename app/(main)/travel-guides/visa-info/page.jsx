// app/travel-guides/visa/page.js
import Link from 'next/link';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPassport,
  faClock,
  faDollarSign,
  faFlag,
  faPlane,
  faQuestionCircle,
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
  title: 'Nepal Visa Information | Entry Requirements, Fees & Application Guide',
  description: 'Complete Nepal tourist visa guide: fees for 15/30/90 days, on-arrival process, multiple-entry options, extension rules & SAARC conditions.',
  // keywords: 'nepal visa, tourist visa nepal, visa on arrival nepal, nepal visa fees, trekking visa, visa for himalayas, nepal entry requirements, nepal visa extension, online visa nepal, nepal immigration, SAARC visa nepal',
  openGraph: {
    title: 'Nepal Visa Information | Entry Requirements, Fees & Application Guide',
    description: 'Complete guide to Nepal tourist visa: fees (15/30/90 days), on‑arrival process, multiple‑entry options, extension rules, and special conditions for SAARC and Indian nationals.',
    url: 'https://globalnepaltreks.com/travel-guides/visa',
    type: 'article',
    locale: 'en_US',
    siteName: 'Global Nepal Treks',
    images: [{ url: travelGuidesAssets.visa_information_cover.src, width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Nepal Visa Information | Entry Requirements, Fees & Application Guide',
    description: 'Complete guide to Nepal tourist visa: fees (15/30/90 days), on‑arrival process, multiple‑entry options.',
    images: [travelGuidesAssets.visa_information_cover.src],
  },
  alternates: {
    canonical: 'https://globalnepaltreks.com/travel-guides/visa',
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
    "headline": "Nepal Visa Information | Entry Requirements, Fees & Application Guide",
    "description": "Complete guide to Nepal tourist visa: fees (15/30/90 days), on‑arrival process, multiple‑entry options, extension rules, and special conditions for SAARC and Indian nationals.",
    "url": "https://globalnepaltreks.com/travel-guides/visa",
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": "https://globalnepaltreks.com/travel-guides/visa"
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
      "url": travelGuidesAssets.visa_information_cover.src,
      "width": 1200,
      "height": 630
    },
    "datePublished": "2025-04-16",
    "dateModified": "2026-05-31",
    "articleSection": "Travel Guides",
    "keywords": "nepal visa, tourist visa, visa on arrival, nepal immigration",
    "inLanguage": "en-US",
    "about": {
      "@type": "Thing",
      "name": "Nepal Visa",
      "description": "Tourist visa requirements and application process for Nepal"
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
        "name": "Visa Information",
        "item": "https://globalnepaltreks.com/travel-guides/visa"
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

// Generate HowTo Schema for visa application steps
function generateHowToSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": "How to Get a Nepal Tourist Visa",
    "description": "Step-by-step guide to obtaining a tourist visa for Nepal on arrival or online.",
    "totalTime": "PT30M",
    "estimatedCost": {
      "@type": "MonetaryAmount",
      "currency": "USD",
      "value": "30"
    },
    "step": [
      {
        "@type": "HowToStep",
        "name": "Fill the Visa Application",
        "text": "Complete the visa application form using the kiosks at the airport or fill it online beforehand.",
        "url": "https://nepaliport.immigration.gov.np"
      },
      {
        "@type": "HowToStep",
        "name": "Pay the Visa Fee",
        "text": "Pay the applicable visa fee at the bank counter. Accepts USD, EUR, GBP, and major credit cards."
      },
      {
        "@type": "HowToStep",
        "name": "Proceed to Immigration",
        "text": "Present your passport, payment receipt, and application form to the immigration officer."
      },
      {
        "@type": "HowToStep",
        "name": "Receive Your Visa",
        "text": "Get your passport stamped and enter Nepal."
      }
    ]
  };
}

export default function VisaInfoPage() {
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
        image={travelGuidesAssets.visa_information_cover.src}
        heading="Nepal Visa Information"
        subheading="Your complete guide to entry requirements and procedures"
      />

      {/* Introduction */}
      <section className="py-12 bg-white">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <Heading title="Visa on Arrival & Online Options" titleClass="text-center mb-4" />
          <p className="text-md text-gray-600 leading-relaxed">
            Nepal offers one of the most straightforward tourist visa systems in the world.  
            Most nationalities can obtain a visa on arrival at Tribhuvan International Airport in Kathmandu or at land border crossings.  
            You can also apply online in advance.  
            Below you'll find all the details you need to plan your entry.
          </p>
        </div>
      </section>

      {/* Visa Details */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Left Column – Fees & Types */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Tourist Visa Fees</h2>
              <div className="space-y-4">
                <div className="bg-white rounded-lg p-5 shadow-sm">
                  <div className="flex items-center gap-3 mb-2">
                    <FontAwesomeIcon icon={faClock} className="w-5 h-5 text-primary-color-dark" />
                    <span className="font-semibold text-gray-900">15 Days</span>
                  </div>
                  <p className="text-3xl font-bold text-primary-color-dark">USD 30</p>
                  <p className="text-sm text-gray-500 mt-1">Single‑entry visa</p>
                </div>
                <div className="bg-white rounded-lg p-5 shadow-sm">
                  <div className="flex items-center gap-3 mb-2">
                    <FontAwesomeIcon icon={faClock} className="w-5 h-5 text-primary-color-dark" />
                    <span className="font-semibold text-gray-900">30 Days</span>
                  </div>
                  <p className="text-3xl font-bold text-primary-color-dark">USD 50</p>
                  <p className="text-sm text-gray-500 mt-1">Single‑entry visa</p>
                </div>
                <div className="bg-white rounded-lg p-5 shadow-sm">
                  <div className="flex items-center gap-3 mb-2">
                    <FontAwesomeIcon icon={faClock} className="w-5 h-5 text-primary-color-dark" />
                    <span className="font-semibold text-gray-900">90 Days</span>
                  </div>
                  <p className="text-3xl font-bold text-primary-color-dark">USD 125</p>
                  <p className="text-sm text-gray-500 mt-1">Single‑entry visa</p>
                </div>
                <div className="bg-white rounded-lg p-5 shadow-sm">
                  <div className="flex items-center gap-3 mb-2">
                    <FontAwesomeIcon icon={faDollarSign} className="w-5 h-5 text-primary-color-dark" />
                    <span className="font-semibold text-gray-900">Multiple‑Entry Visa</span>
                  </div>
                  <p className="text-3xl font-bold text-primary-color-dark">+ USD 20</p>
                  <p className="text-sm text-gray-500 mt-1">
                    Add to any visa if you plan side trips to Tibet, Bhutan, or India.
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column – Special Conditions */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Special Conditions</h2>
              <div className="space-y-6">
                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <div className="flex items-center gap-3 mb-3">
                    <FontAwesomeIcon icon={faFlag} className="w-5 h-5 text-primary-color-dark" />
                    <h3 className="font-semibold text-gray-900">SAARC Nationals</h3>
                  </div>
                  <p className="text-gray-600">
                    Citizens of SAARC countries (Afghanistan, Bangladesh, Bhutan, India, Maldives, Pakistan, Sri Lanka) get a <strong>30‑day visa free of charge</strong> on arrival.
                  </p>
                </div>
                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <div className="flex items-center gap-3 mb-3">
                    <FontAwesomeIcon icon={faFlag} className="w-5 h-5 text-primary-color-dark" />
                    <h3 className="font-semibold text-gray-900">Indian Passport Holders</h3>
                  </div>
                  <p className="text-gray-600">
                    Indian citizens do not need a visa to enter Nepal. They can stay indefinitely with a valid passport or voter ID card.
                  </p>
                </div>
                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <div className="flex items-center gap-3 mb-3">
                    <FontAwesomeIcon icon={faPassport} className="w-5 h-5 text-primary-color-dark" />
                    <h3 className="font-semibold text-gray-900">Online Application</h3>
                  </div>
                  <p className="text-gray-600">
                    You can apply online before arrival to save time. The online form is available at the official <a href="https://nepaliport.immigration.gov.np" target="_blank" rel="noopener noreferrer" className="text-primary-color-dark hover:underline">Nepal Immigration website</a>.  
                    Bring the confirmation printout with you.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* On-Arrival Process */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Visa on Arrival – Step by Step</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-primary-color-dark/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-xl font-bold text-primary-color-dark">1</span>
              </div>
              <p className="font-semibold mb-2">Fill the Form</p>
              <p className="text-sm text-gray-600">Use the kiosks at the airport or fill the online form beforehand.</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-primary-color-dark/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-xl font-bold text-primary-color-dark">2</span>
              </div>
              <p className="font-semibold mb-2">Pay the Fee</p>
              <p className="text-sm text-gray-600">Pay at the bank counter (accepts USD, EUR, GBP, and major credit cards).</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-primary-color-dark/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-xl font-bold text-primary-color-dark">3</span>
              </div>
              <p className="font-semibold mb-2">Receive Visa</p>
              <p className="text-sm text-gray-600">Proceed to immigration, get your passport stamped, and enter Nepal.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4">
          <Heading title="Frequently Asked Questions" titleClass="text-center mb-12" />
          <div className="space-y-4">
            {[
              {
                q: 'Can I extend my visa?',
                a: 'Yes, you can extend your tourist visa at the Department of Immigration in Kathmandu or Pokhara. Extensions cost USD 30 for 15 days (maximum 150 days per visa year).',
              },
              {
                q: 'Do I need a visa for trekking?',
                a: 'The standard tourist visa is sufficient for trekking. No separate trekking visa is required, but you will need trekking permits (TIMS and national park entry fees).',
              },
              {
                q: 'What about children?',
                a: 'Children under 10 years old receive a visa free of charge. Minors must be accompanied by a parent or legal guardian.',
              },
              {
                q: 'Do I need to carry passport photos?',
                a: 'While not mandatory if you use the online form, it’s wise to carry 2 passport‑size photos (for permits and possible backup).',
              },
            ].map((faq, idx) => (
              <div key={idx} className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <FontAwesomeIcon icon={faQuestionCircle} className="w-4 h-4 text-primary-color-dark" />
                  {faq.q}
                </h3>
                <p className="text-gray-600">{faq.a}</p>
              </div>
            ))}
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
            Our travel experts can assist you with visa questions and trip planning.
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