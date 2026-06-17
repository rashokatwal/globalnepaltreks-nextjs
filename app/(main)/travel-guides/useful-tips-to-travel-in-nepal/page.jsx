// app/travel-guides/useful-tips-to-travel-in-nepal/page.js
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPrayingHands,
  faShoePrints,
  faCamera,
  faHandshake,
  faWifi,
  faPlug,
  faUtensils,
  faBus,
  faSuitcaseRolling,
  faLanguage,
  faCoins,
  faMoneyBillWave,
  faQuestionCircle,
  faCheckCircle,
  faPhone,
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
  title: 'Useful Tips to Travel in Nepal | Etiquette, Money, Packing Guide',
  description: 'Practical tips for travelling in Nepal: temple etiquette, greetings, money and tipping, staying connected, food and water safety, transport, and what to pack.',
  openGraph: {
    title: 'Useful Tips to Travel in Nepal | Etiquette, Money & Packing Guide',
    description: 'A practical guide to Nepalese customs, money matters, connectivity, food, transport, and packing — everything to make your trip smooth and respectful.',
    url: 'https://globalnepaltreks.com/travel-guides/useful-tips-to-travel-in-nepal',
    type: 'article',
    locale: 'en_US',
    siteName: 'Global Nepal Treks',
    images: [{ url: travelGuidesAssets.useful_tips_to_travel_in_nepal_cover.src, width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Useful Tips to Travel in Nepal | Etiquette, Money & Packing Guide',
    description: 'A practical guide to Nepalese customs, money matters, connectivity, food, transport, and packing for your trip to Nepal.',
    images: [travelGuidesAssets.useful_tips_to_travel_in_nepal_cover.src],
  },
  alternates: {
    canonical: 'https://globalnepaltreks.com/travel-guides/useful-tips-to-travel-in-nepal',
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
    "headline": "Useful Tips to Travel in Nepal | Etiquette, Money & Packing Guide",
    "description": "Practical tips for travelling in Nepal, covering temple etiquette, greetings, money and tipping, connectivity, food and water safety, getting around, and packing.",
    "url": "https://globalnepaltreks.com/travel-guides/useful-tips-to-travel-in-nepal",
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": "https://globalnepaltreks.com/travel-guides/useful-tips-to-travel-in-nepal"
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
      "url": travelGuidesAssets.useful_tips_to_travel_in_nepal_cover.src,
      "width": 1200,
      "height": 630
    },
    "datePublished": "2025-09-10",
    "dateModified": "2026-06-17",
    "articleSection": "Travel Guides",
    "keywords": "nepal travel tips, nepal etiquette, temple etiquette nepal, tipping in nepal, nepal sim card, what to pack for nepal, nepal travel advice",
    "inLanguage": "en-US",
    "about": {
      "@type": "Thing",
      "name": "Travel Tips for Nepal",
      "description": "Practical etiquette, money, connectivity, and packing advice for travelling in Nepal"
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
        "name": "Useful Tips to Travel in Nepal",
        "item": "https://globalnepaltreks.com/travel-guides/useful-tips-to-travel-in-nepal"
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
        "name": "Do I need to remove my shoes at temples in Nepal?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes. Footwear is removed before entering most Hindu temples and Buddhist shrines as a mark of respect. Slip-on sandals make this much easier than lace-up boots."
        }
      },
      {
        "@type": "Question",
        "name": "Is tipping expected in Nepal?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Tipping isn't legally required but is a well-established custom, especially for trekking guides, porters, and drivers. It's not usually expected in small local restaurants the way it is in some Western countries."
        }
      },
      {
        "@type": "Question",
        "name": "Can I use my phone and the internet easily in Nepal?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "A local SIM card from Ncell or Nepal Telecom is cheap and easy to buy in Kathmandu with your passport, and gives reliable 4G coverage in cities and most lower trekking trails. Coverage and Wi-Fi become patchier and slower at higher altitudes."
        }
      },
      {
        "@type": "Question",
        "name": "Is it safe to drink tap water in Nepal?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Tap water is not recommended for drinking. Stick to bottled, boiled, or filtered/treated water, and be cautious with ice and raw salads in more remote areas."
        }
      },
      {
        "@type": "Question",
        "name": "What should I wear when visiting temples or rural villages in Nepal?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Modest clothing that covers the shoulders and knees is appreciated at religious sites and in rural communities. Lightweight, breathable layers work well and respect local customs without sacrificing comfort."
        }
      }
    ]
  };
}

export default function UsefulTipsToTravelInNepalPage() {
  const articleSchema = generateArticleSchema();
  const breadcrumbSchema = generateBreadcrumbSchema();
  const organizationSchema = generateOrganizationSchema();
  const faqSchema = generateFAQSchema();

  return (
    <main>
      {/* JSON-LD Structured Data */}
      <Script id="article-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <Script id="breadcrumb-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <Script id="organization-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }} />
      <Script id="faq-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      {/* Hero Section */}
      <HeroSection
        image={travelGuidesAssets.useful_tips_to_travel_in_nepal_cover.src}
        heading="Useful Tips to Travel in Nepal"
        subheading="Practical advice for a smooth, respectful, and enjoyable trip"
      />

      {/* Introduction */}
      <section className="py-12 bg-white">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <Heading title="Travelling Nepal With Confidence" titleClass="text-center mb-4" />
          <p className="text-md text-gray-600 leading-relaxed">
            Nepalese people are famously warm and welcoming, and most visitors settle in with little difficulty.
            Even so, a few unfamiliar customs and practical details can catch first‑time travellers off guard.
            The tips below cover the everyday things that make the biggest difference – how to behave respectfully at religious sites, how money and tipping work, staying connected, eating safely, getting around, and what to pack – so you can spend less time figuring things out and more time enjoying the country.
          </p>
        </div>
      </section>

      {/* Religious & Cultural Etiquette */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <Heading title="Religious & Cultural Etiquette" titleClass="text-center mb-4" />
          <p className="text-center text-gray-500 max-w-3xl mx-auto mb-12">
            Religion is woven into daily life in Nepal, and temples, stupas, and shrines appear almost everywhere.
            A little awareness goes a long way.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl p-6 hover:shadow-md transition">
              <div className="w-10 h-10 bg-primary-color-dark/10 rounded-full flex items-center justify-center mb-4">
                <FontAwesomeIcon icon={faShoePrints} className="w-5 h-5 text-primary-color-dark" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Remove Your Shoes</h3>
              <p className="text-sm text-gray-600">Footwear comes off before entering most temples and shrines. Slip‑on sandals are far more convenient than lace‑up boots for this.</p>
            </div>
            <div className="bg-white rounded-xl p-6 hover:shadow-md transition">
              <div className="w-10 h-10 bg-primary-color-dark/10 rounded-full flex items-center justify-center mb-4">
                <FontAwesomeIcon icon={faPrayingHands} className="w-5 h-5 text-primary-color-dark" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Some Sites Restrict Entry</h3>
              <p className="text-sm text-gray-600">A few Hindu temples don't admit non‑Hindus, and leather items aren't allowed inside many temple precincts. Look for posted signs or ask a guide.</p>
            </div>
            <div className="bg-white rounded-xl p-6 hover:shadow-md transition">
              <div className="w-10 h-10 bg-primary-color-dark/10 rounded-full flex items-center justify-center mb-4">
                <FontAwesomeIcon icon={faCamera} className="w-5 h-5 text-primary-color-dark" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Ask Before Photographing</h3>
              <p className="text-sm text-gray-600">Most monuments and stupas can be photographed freely, but it's courteous to ask permission before photographing people, ceremonies, or temple interiors.</p>
            </div>
          </div>
          <div className="mt-8 bg-white rounded-xl p-6">
            <h3 className="font-bold text-gray-900 mb-3">A Few More Customs Worth Knowing</h3>
            <ul className="grid md:grid-cols-2 gap-3 text-sm text-gray-600">
              <li className="flex items-start gap-2"><FontAwesomeIcon icon={faCheckCircle} className="w-4 h-4 text-green-600 mt-1 shrink-0" /><span>Walk clockwise around stupas and mani walls, following the direction locals do.</span></li>
              <li className="flex items-start gap-2"><FontAwesomeIcon icon={faCheckCircle} className="w-4 h-4 text-green-600 mt-1 shrink-0" /><span>Avoid touching offerings, statues, or people on their way to worship.</span></li>
              <li className="flex items-start gap-2"><FontAwesomeIcon icon={faCheckCircle} className="w-4 h-4 text-green-600 mt-1 shrink-0" /><span>Beef is not eaten by Hindus or Buddhists in Nepal; it's best avoided as a topic and on your plate.</span></li>
              <li className="flex items-start gap-2"><FontAwesomeIcon icon={faCheckCircle} className="w-4 h-4 text-green-600 mt-1 shrink-0" /><span>Use your right hand (or both hands) when giving or receiving items, especially money or food.</span></li>
            </ul>
          </div>
        </div>
      </section>

      {/* Greetings & Social Customs */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <FontAwesomeIcon icon={faHandshake} className="w-5 h-5 text-primary-color-dark" />
                Greetings & Daily Manners
              </h2>
              <p className="text-gray-600 mb-4">
                A pressed-palm "Namaste" with a slight bow is the standard greeting and works well in almost any setting.
                Public displays of affection are uncommon and best kept low‑key, and pointing the soles of your feet at people, statues, or food is considered impolite.
              </p>
              <p className="text-gray-600">
                Modest clothing covering the shoulders and knees is appreciated in rural villages and at religious sites, even though Kathmandu and Pokhara's tourist areas are generally relaxed about dress.
              </p>
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <FontAwesomeIcon icon={faLanguage} className="w-5 h-5 text-primary-color-dark" />
                Language
              </h2>
              <p className="text-gray-600">
                Nepali is the official language, but English is widely spoken in the tourism industry, in Kathmandu, Pokhara, and along the main trekking routes.
                Learning a few Nepali phrases – Namaste (hello), Dhanyabad (thank you), and Kati ho? (how much?) – is appreciated and often gets a warm response.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Money & Tipping */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <Heading title="Money, Tipping & Bargaining" titleClass="text-center mb-12" />
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl p-6 hover:shadow-md transition">
              <FontAwesomeIcon icon={faCoins} className="w-8 h-8 text-primary-color-dark mb-3" />
              <h3 className="font-bold text-gray-900 mb-2">Cash Is King</h3>
              <p className="text-sm text-gray-600">ATMs are common in Kathmandu and Pokhara but scarce or unreliable in trekking regions. Carry enough Nepali rupees, including small notes, before heading into the hills.</p>
            </div>
            <div className="bg-white rounded-xl p-6 hover:shadow-md transition">
              <FontAwesomeIcon icon={faMoneyBillWave} className="w-8 h-8 text-primary-color-dark mb-3" />
              <h3 className="font-bold text-gray-900 mb-2">Tipping Is Customary</h3>
              <p className="text-sm text-gray-600">Tipping guides, porters, and drivers is an established part of trekking and touring in Nepal, even though it isn't mandatory. It's less expected in small local diners.</p>
            </div>
            <div className="bg-white rounded-xl p-6 hover:shadow-md transition">
              <FontAwesomeIcon icon={faCoins} className="w-8 h-8 text-primary-color-dark mb-3" />
              <h3 className="font-bold text-gray-900 mb-2">Bargaining in Markets</h3>
              <p className="text-sm text-gray-600">Light bargaining is normal in markets, souvenir shops, and with unmetered taxis. Fixed‑price shops, restaurants, and supermarkets are not negotiable.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Staying Connected */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <FontAwesomeIcon icon={faWifi} className="w-5 h-5 text-primary-color-dark" />
                SIM Cards & Internet
              </h2>
              <p className="text-gray-600">
                A local SIM card from Ncell or Nepal Telecom is inexpensive and quick to set up at the airport or in Thamel with your passport and a photo.
                Coverage is strong in cities and on lower trekking trails, but expect slower data and patchy Wi‑Fi at higher altitudes, where many teahouses charge a small fee for internet access.
              </p>
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <FontAwesomeIcon icon={faPlug} className="w-5 h-5 text-primary-color-dark" />
                Electricity & Power
              </h2>
              <p className="text-gray-600">
                Nepal runs on 220–230V with type C, D, and M plug sockets, so a universal adapter is worth packing.
                Power cuts happen occasionally even in cities, and charging gets limited and sometimes paid for above certain altitudes on a trek, so a power bank is a smart backup.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Food, Water & Transport */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <Heading title="Food, Water & Getting Around" titleClass="text-center mb-12" />
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl p-6 hover:shadow-md transition">
              <FontAwesomeIcon icon={faUtensils} className="w-8 h-8 text-primary-color-dark mb-3" />
              <h3 className="text-lg font-bold text-gray-900 mb-2">Food & Water Safety</h3>
              <p className="text-sm text-gray-600">
                Stick to bottled, boiled, or properly treated water rather than tap water, and be a little cautious with ice, raw salads, and street food in remote areas until your stomach adjusts.
                Vegetarian food is widely available and generally the safer, fresher option on long trekking routes.
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 hover:shadow-md transition">
              <FontAwesomeIcon icon={faBus} className="w-8 h-8 text-primary-color-dark mb-3" />
              <h3 className="text-lg font-bold text-gray-900 mb-2">Transport Realities</h3>
              <p className="text-sm text-gray-600">
                Domestic mountain flights are frequently delayed or cancelled by weather, so build a buffer day into your itinerary if you're flying to or from a trailhead.
                In cities, agree on a taxi fare upfront or insist on the meter, and allow extra time for Kathmandu's traffic.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* What to Pack */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4">
          <Heading title="What to Pack" titleClass="text-center mb-12" />
          <div className="bg-gray-50 rounded-xl p-8">
            <div className="flex items-center gap-3 mb-4">
              <FontAwesomeIcon icon={faSuitcaseRolling} className="w-6 h-6 text-primary-color-dark" />
              <h3 className="font-bold text-gray-900">Quick Packing Checklist</h3>
            </div>
            <ul className="grid md:grid-cols-2 gap-3 text-sm text-gray-600">
              <li className="flex items-start gap-2"><FontAwesomeIcon icon={faCheckCircle} className="w-4 h-4 text-green-600 mt-1 shrink-0" /><span>Lightweight, modest layers that cover shoulders and knees for temples and villages.</span></li>
              <li className="flex items-start gap-2"><FontAwesomeIcon icon={faCheckCircle} className="w-4 h-4 text-green-600 mt-1 shrink-0" /><span>Comfortable walking shoes plus slip‑on sandals for temple visits.</span></li>
              <li className="flex items-start gap-2"><FontAwesomeIcon icon={faCheckCircle} className="w-4 h-4 text-green-600 mt-1 shrink-0" /><span>A universal power adapter and a power bank for charging on the go.</span></li>
              <li className="flex items-start gap-2"><FontAwesomeIcon icon={faCheckCircle} className="w-4 h-4 text-green-600 mt-1 shrink-0" /><span>Sunscreen, sunglasses, and a basic first‑aid kit with any personal medication.</span></li>
              <li className="flex items-start gap-2"><FontAwesomeIcon icon={faCheckCircle} className="w-4 h-4 text-green-600 mt-1 shrink-0" /><span>Small denomination Nepali rupees for markets, temples, and tipping.</span></li>
              <li className="flex items-start gap-2"><FontAwesomeIcon icon={faCheckCircle} className="w-4 h-4 text-green-600 mt-1 shrink-0" /><span>A reusable water bottle, ideally with a filter or purification tablets.</span></li>
            </ul>
            <p className="text-sm text-gray-500 mt-6">
              Heading out on a trek? See our dedicated guide to trekking permits and the TIMS card, and our notes on Nepal's protected areas, for route‑specific preparation.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4">
          <Heading title="Frequently Asked Questions" titleClass="text-center mb-12" />
          <div className="space-y-6">
            {[
              { q: "Do I need to remove my shoes at temples in Nepal?", a: "Yes. Footwear is removed before entering most Hindu temples and Buddhist shrines as a mark of respect. Slip-on sandals make this much easier than lace-up boots." },
              { q: "Is tipping expected in Nepal?", a: "Tipping isn't legally required but is a well-established custom, especially for trekking guides, porters, and drivers. It's not usually expected in small local restaurants the way it is in some Western countries." },
              { q: "Can I use my phone and the internet easily in Nepal?", a: "A local SIM card from Ncell or Nepal Telecom is cheap and easy to buy in Kathmandu with your passport, and gives reliable 4G coverage in cities and most lower trekking trails. Coverage and Wi-Fi become patchier and slower at higher altitudes." },
              { q: "Is it safe to drink tap water in Nepal?", a: "Tap water is not recommended for drinking. Stick to bottled, boiled, or filtered/treated water, and be cautious with ice and raw salads in more remote areas." },
              { q: "What should I wear when visiting temples or rural villages in Nepal?", a: "Modest clothing that covers the shoulders and knees is appreciated at religious sites and in rural communities. Lightweight, breathable layers work well and respect local customs without sacrificing comfort." },
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
            Have More Questions About Travelling in Nepal?
          </h2>
          <p className="text-lg text-white/90 mb-8">
            Our team is happy to share practical, up-to-date advice for your specific trip.
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