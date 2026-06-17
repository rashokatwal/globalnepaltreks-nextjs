// app/travel-guides/trekking-permits-and-tims/page.js
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPassport,
  faIdCard,
  faMoneyBillWave,
  faUserShield,
  faUsers,
  faClipboardList,
  faExclamationTriangle,
  faCheckCircle,
  faQuestionCircle,
  faRoute,
  faShieldAlt,
  faMountain,
  faPhone,
  faEnvelope
} from '@fortawesome/free-solid-svg-icons';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import HeroSection from '@/app/components/sections/HeroSection';
import Heading from '@/app/components/ui/Heading';
import { travelGuidesAssets } from '@/app/assets/assets';
import Script from 'next/script';

// SEO metadata
export const metadata = {
  title: 'Nepal Trekking Permits & TIMS Card Guide 2026 | Fees & Rules',
  description: 'A complete 2026 guide to Nepal trekking permits, TIMS card rules, national park & conservation area fees, restricted area permits, and the mandatory guide requirement.',
  openGraph: {
    title: 'Nepal Trekking Permits & TIMS Card Guide 2026 | Fees, Rules & Documents',
    description: 'Everything trekkers need to know about Nepal trekking permits in 2026: TIMS card changes, national park entry fees, restricted area permits, and required documents.',
    url: 'https://globalnepaltreks.com/travel-guides/trekking-permits-and-tims',
    type: 'article',
    locale: 'en_US',
    siteName: 'Global Nepal Treks',
    images: [{ url: travelGuidesAssets.trekking_permit_and_tims_cover.src, width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Nepal Trekking Permits & TIMS Card Guide 2026 | Fees, Rules & Documents',
    description: 'Everything trekkers need to know about Nepal trekking permits in 2026: TIMS card changes, entry fees, restricted area permits, and required documents.',
    images: [travelGuidesAssets.trekking_permit_and_tims_cover.src],
  },
  alternates: {
    canonical: 'https://globalnepaltreks.com/travel-guides/trekking-permits-and-tims',
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
    "headline": "Nepal Trekking Permits & TIMS Card Guide 2026 | Fees, Rules & Documents",
    "description": "A complete guide to Nepal trekking permits in 2026, covering national park entry fees, conservation area permits, restricted area permits, TIMS card changes, and the mandatory guide rule.",
    "url": "https://globalnepaltreks.com/travel-guides/trekking-permits-and-tims",
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": "https://globalnepaltreks.com/travel-guides/trekking-permits-and-tims"
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
      "url": travelGuidesAssets.trekking_permit_and_tims_cover.src,
      "width": 1200,
      "height": 630
    },
    "datePublished": "2025-09-01",
    "dateModified": "2026-06-17",
    "articleSection": "Travel Guides",
    "keywords": "nepal trekking permit, TIMS card nepal, sagarmatha national park permit, ACAP permit, restricted area permit nepal, manaslu permit, upper mustang permit",
    "inLanguage": "en-US",
    "about": {
      "@type": "Thing",
      "name": "Nepal Trekking Permits and TIMS Card",
      "description": "Permits, fees and documentation required for trekking in Nepal"
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
        "name": "Trekking Permits and TIMS Card",
        "item": "https://globalnepaltreks.com/travel-guides/trekking-permits-and-tims"
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

// Generate HowTo Schema
function generateHowToSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": "How to Get Your Nepal Trekking Permit",
    "description": "Steps to arrange the correct trekking permits, conservation area fees, and guide assignment for a trek in Nepal.",
    "step": [
      {
        "@type": "HowToStep",
        "name": "Confirm Your Route",
        "text": "Tell us your chosen trekking region so we can identify exactly which national park, conservation area, or restricted area permits apply."
      },
      {
        "@type": "HowToStep",
        "name": "Send Your Documents",
        "text": "Share a scanned copy of your passport and a passport-size photo; restricted regions may require a second passport copy for the immigration office."
      },
      {
        "@type": "HowToStep",
        "name": "We Process the Paperwork",
        "text": "Our Kathmandu office submits your permits and assigns a licensed guide, which is now mandatory on every trekking route in Nepal."
      },
      {
        "@type": "HowToStep",
        "name": "Collect Permits on Arrival",
        "text": "Pick up your printed permits and meet your guide in Kathmandu or Pokhara before heading to the trailhead."
      }
    ],
    "totalTime": "P2D"
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
        "name": "Do I still need a TIMS card for the Everest Base Camp trek?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "No. The Khumbu Pasang Lhamu Rural Municipality now issues its own local entry permit for the Everest region, which has replaced the TIMS card there. You'll still need the Sagarmatha National Park entry permit."
        }
      },
      {
        "@type": "Question",
        "name": "Is solo trekking still allowed in Nepal?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Independent solo trekking without a licensed guide is no longer permitted on Nepal's official trekking routes. A government-registered guide is now a mandatory requirement, even on previously independent trails like Poon Hill and Everest Base Camp."
        }
      },
      {
        "@type": "Question",
        "name": "What documents do I need to arrange my permits?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "A scanned copy of your passport and one or two passport-size photographs are usually sufficient. Restricted areas may require an additional passport copy for the immigration office, which we handle on your behalf."
        }
      },
      {
        "@type": "Question",
        "name": "How far in advance should I arrange my trekking permits?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Standard national park and conservation area permits can usually be issued within a day in Kathmandu or Pokhara. Restricted area permits, such as for Upper Mustang or Manaslu, should be arranged at least a few working days before your trek begins."
        }
      },
      {
        "@type": "Question",
        "name": "Do trekking permit fees change with the season?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes. Several restricted area permits, including Manaslu and the northern Manang region, charge higher weekly fees during the main autumn season from September to November than during the rest of the year."
        }
      }
    ]
  };
}

export default function TrekkingPermitsAndTimsPage() {
  const articleSchema = generateArticleSchema();
  const breadcrumbSchema = generateBreadcrumbSchema();
  const organizationSchema = generateOrganizationSchema();
  const howToSchema = generateHowToSchema();
  const faqSchema = generateFAQSchema();

  const nationalParkPermits = [
    {
      name: 'Sagarmatha National Park',
      region: 'Everest Region',
      fee: 'NPR 3,390 (foreigners) / NPR 1,695 (SAARC)',
      note: 'TIMS card no longer required here. A separate Khumbu Pasang Lhamu Rural Municipality entry fee (~NPR 2,000) is also collected at Monjo.'
    },
    {
      name: 'Annapurna Conservation Area (ACAP)',
      region: 'Annapurna Region',
      fee: 'NPR 3,000 (foreigners) / NPR 1,500 (SAARC)',
      note: 'TIMS is being phased out at Annapurna checkpoints, though some still request it as a precaution; we confirm current checkpoint practice before you depart.'
    },
    {
      name: 'Langtang National Park',
      region: 'Langtang Region',
      fee: 'NPR 3,000 (foreigners)',
      note: 'A TIMS card is still recommended for Langtang Valley and Helambu treks.'
    },
    {
      name: 'Manaslu Conservation Area',
      region: 'Gorkha',
      fee: 'NPR 3,000 (foreigners)',
      note: 'Issued together with the Manaslu Restricted Area Permit below; both are required to enter.'
    },
    {
      name: 'Kanchenjunga Conservation Area',
      region: 'Eastern Nepal',
      fee: 'NPR 3,000 (foreigners)',
      note: 'Additional Restricted Area Permit applies for the northern Kanchenjunga sections.'
    },
  ];

  const restrictedAreaPermits = [
    { area: 'Upper Mustang', fee: 'USD 50 per person, per day', minGroup: '2 trekkers', note: 'Must be arranged through a registered agency.' },
    { area: 'Manaslu Restricted Area', fee: 'USD 100/week (Sep–Nov), USD 75/week (Dec–Aug)', minGroup: '2 trekkers', note: 'Extra days are charged per day on top of the weekly rate.' },
    { area: 'Upper Dolpo', fee: 'USD 10/week for first 4 weeks, USD 20/week after', minGroup: 'Group trekkers only', note: 'Among the most remote and least-visited permit areas in Nepal.' },
    { area: 'Kanchenjunga Restricted Sections', fee: 'USD 10/week for first 4 weeks, USD 20/week after', minGroup: 'Group trekkers only', note: 'Covers Olangchung Gola, Lelep, Papung and Yamphudin areas.' },
    { area: 'Nar Phu & Northern Manang', fee: 'USD 90/week (Sep–Nov), USD 75/week (Dec–Aug)', minGroup: 'Group trekkers only', note: 'Often combined with the Annapurna Circuit.' },
    { area: 'Humla (Simikot–Yari)', fee: 'USD 50 for first week, USD 7/day after', minGroup: 'Group trekkers only', note: 'Gateway route toward the Tibet border and Limi Valley.' },
    { area: 'Mugu, Bajhang & Darchula', fee: 'USD 90 for first 7 days, USD 15/day after', minGroup: 'Group trekkers only', note: 'Remote far-western border districts.' },
    { area: 'Rasuwa (Thuman & Timure)', fee: 'USD 10/week', minGroup: 'Group trekkers only', note: 'Borderland extension of the Langtang/Tamang Heritage trails.' },
  ];

  return (
    <main>
      {/* JSON-LD Structured Data */}
      <Script id="article-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <Script id="breadcrumb-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <Script id="organization-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }} />
      <Script id="howto-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }} />
      <Script id="faq-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      {/* Hero Section */}
      <HeroSection
        image={travelGuidesAssets.trekking_permit_and_tims_cover.src}
        heading="Nepal Trekking Permits & TIMS Card"
        subheading="What every trekker needs to know before heading to the trailhead in 2026"
      />

      {/* Introduction */}
      <section className="py-12 bg-white">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <Heading title="Why Permits Matter" titleClass="text-center mb-4" />
          <p className="text-md text-gray-600 leading-relaxed">
            Almost every trekking region in Nepal sits inside a national park, conservation area, or restricted border zone, so a valid entry permit is required before you set foot on the trail.
            The permit system funds conservation work, supports search‑and‑rescue coordination, and helps local authorities track who is trekking where.
            Rules have changed significantly over the past few years – the TIMS card has been phased out in several regions, a licensed guide is now mandatory everywhere, and some restricted areas have revised fees.
            This guide breaks down exactly what applies to your route in 2026.
          </p>
          <p className="text-sm text-gray-400 mt-4">Information last reviewed: June 2026</p>
        </div>
      </section>

      {/* TIMS Card Changes */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <Heading title="What's Changed With the TIMS Card" titleClass="text-center mb-12" />
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">From Paper Card to Local Permits</h2>
              <p className="text-gray-600 mb-4">
                The Trekkers' Information Management System (TIMS) card was originally introduced to keep a central record of trekkers for safety and search‑and‑rescue purposes.
                In the Everest/Khumbu region, the local Khumbu Pasang Lhamu Rural Municipality now issues its own entry permit instead, and the old TIMS card is no longer required there.
              </p>
              <p className="text-gray-600">
                In other regions such as Annapurna, Langtang, and Manaslu, TIMS is being phased out at some checkpoints while still being requested as a precaution at others.
                We confirm the current checkpoint requirements for your specific route before you arrive in Nepal so you're never caught off guard.
              </p>
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Mandatory Guide Requirement</h2>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start gap-2">
                  <FontAwesomeIcon icon={faUserShield} className="w-5 h-5 text-primary-color-dark mt-1 shrink-0" />
                  <span>A government‑licensed guide is now required on every trekking route in Nepal, including previously independent routes like Poon Hill and Everest Base Camp.</span>
                </li>
                <li className="flex items-start gap-2">
                  <FontAwesomeIcon icon={faExclamationTriangle} className="w-5 h-5 text-amber-600 mt-1 shrink-0" />
                  <span>Solo, unguided trekking is no longer permitted on official trekking trails.</span>
                </li>
                <li className="flex items-start gap-2">
                  <FontAwesomeIcon icon={faClipboardList} className="w-5 h-5 text-primary-color-dark mt-1 shrink-0" />
                  <span>Some regions are moving to a digital e‑TIMS system with QR‑code verification at checkpoints.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* National Park & Conservation Area Permits */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <Heading title="National Park & Conservation Area Permits" titleClass="text-center mb-4" />
          <p className="text-center text-gray-500 max-w-3xl mx-auto mb-12">
            Most standard trekking routes require one national park or conservation area entry permit, checked once at the park boundary.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {nationalParkPermits.map((permit) => (
              <div key={permit.name} className="bg-gray-50 rounded-xl p-6 hover:shadow-md transition">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-primary-color-dark/10 rounded-full flex items-center justify-center">
                    <FontAwesomeIcon icon={faMountain} className="w-5 h-5 text-primary-color-dark" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">{permit.name}</h3>
                </div>
                <p className="text-sm text-gray-500 mb-1">{permit.region}</p>
                <p className="text-sm font-semibold text-gray-800 mb-2">{permit.fee}</p>
                <p className="text-sm text-gray-600">{permit.note}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Restricted Area Permits */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <Heading title="Restricted Area Permits (RAP)" titleClass="text-center mb-4" />
          <p className="text-center text-gray-500 max-w-3xl mx-auto mb-10">
            Border and remote regions require an additional Restricted Area Permit on top of the conservation area fee, issued only to group trekkers through a registered agency.
            Fees below are a planning guide – we confirm the exact current rate for your travel dates when you book.
          </p>
          <div className="overflow-x-auto bg-white rounded-xl shadow-sm">
            <table className="w-full text-left text-sm">
              <thead className="bg-primary-color-dark text-white">
                <tr>
                  <th className="px-4 py-3 font-semibold">Region</th>
                  <th className="px-4 py-3 font-semibold">Permit Fee</th>
                  <th className="px-4 py-3 font-semibold">Minimum Group</th>
                  <th className="px-4 py-3 font-semibold">Notes</th>
                </tr>
              </thead>
              <tbody>
                {restrictedAreaPermits.map((row, i) => (
                  <tr key={row.area} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-4 py-3 font-medium text-gray-900">{row.area}</td>
                    <td className="px-4 py-3 text-gray-600">{row.fee}</td>
                    <td className="px-4 py-3 text-gray-600">{row.minGroup}</td>
                    <td className="px-4 py-3 text-gray-600">{row.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Documents Required */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4">
          <Heading title="Documents You'll Need" titleClass="text-center mb-12" />
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-gray-50 rounded-xl p-6 text-center">
              <FontAwesomeIcon icon={faPassport} className="w-8 h-8 text-primary-color-dark mb-3" />
              <h3 className="font-bold text-gray-900 mb-2">Passport Copy</h3>
              <p className="text-sm text-gray-600">A clear scan or photo of your passport's main page; restricted areas may need a second copy.</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-6 text-center">
              <FontAwesomeIcon icon={faIdCard} className="w-8 h-8 text-primary-color-dark mb-3" />
              <h3 className="font-bold text-gray-900 mb-2">Passport-Size Photos</h3>
              <p className="text-sm text-gray-600">One to two recent passport‑style photographs for permit and guide registration.</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-6 text-center">
              <FontAwesomeIcon icon={faMoneyBillWave} className="w-8 h-8 text-primary-color-dark mb-3" />
              <h3 className="font-bold text-gray-900 mb-2">Permit Fees in Cash</h3>
              <p className="text-sm text-gray-600">Most permit offices in Kathmandu and Pokhara only accept Nepali rupees or USD cash.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How We Help */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">How Global Nepal Treks Handles Your Permits</h2>
              <p className="text-gray-600 mb-4">
                Our Kathmandu office processes every permit your route requires, assigns your licensed guide, and keeps a copy of your documents on file in case anything needs reissuing on the trail.
                You simply send us your passport details before arrival and collect everything in person once you land.
              </p>
            </div>
            <div>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start gap-2">
                  <FontAwesomeIcon icon={faCheckCircle} className="w-5 h-5 text-green-600 mt-1 shrink-0" />
                  <span>National park, conservation area, and restricted area permits arranged in advance.</span>
                </li>
                <li className="flex items-start gap-2">
                  <FontAwesomeIcon icon={faCheckCircle} className="w-5 h-5 text-green-600 mt-1 shrink-0" />
                  <span>Licensed guide assigned and briefed on your specific route and dates.</span>
                </li>
                <li className="flex items-start gap-2">
                  <FontAwesomeIcon icon={faCheckCircle} className="w-5 h-5 text-green-600 mt-1 shrink-0" />
                  <span>Printed and digital copies of every permit kept safe for the duration of your trek.</span>
                </li>
                <li className="flex items-start gap-2">
                  <FontAwesomeIcon icon={faCheckCircle} className="w-5 h-5 text-green-600 mt-1 shrink-0" />
                  <span>Real‑time guidance on the latest checkpoint rules for regions still transitioning away from TIMS.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <Heading title="Frequently Asked Questions" titleClass="text-center mb-12" />
          <div className="space-y-6">
            {[
              { q: "Do I still need a TIMS card for the Everest Base Camp trek?", a: "No. The Khumbu Pasang Lhamu Rural Municipality now issues its own local entry permit for the Everest region, which has replaced the TIMS card there. You'll still need the Sagarmatha National Park entry permit." },
              { q: "Is solo trekking still allowed in Nepal?", a: "Independent solo trekking without a licensed guide is no longer permitted on Nepal's official trekking routes. A government-registered guide is now a mandatory requirement, even on previously independent trails like Poon Hill and Everest Base Camp." },
              { q: "What documents do I need to arrange my permits?", a: "A scanned copy of your passport and one or two passport-size photographs are usually sufficient. Restricted areas may require an additional passport copy for the immigration office, which we handle on your behalf." },
              { q: "How far in advance should I arrange my trekking permits?", a: "Standard national park and conservation area permits can usually be issued within a day in Kathmandu or Pokhara. Restricted area permits, such as for Upper Mustang or Manaslu, should be arranged at least a few working days before your trek begins." },
              { q: "Do trekking permit fees change with the season?", a: "Yes. Several restricted area permits, including Manaslu and the northern Manang region, charge higher weekly fees during the main autumn season from September to November than during the rest of the year." },
            ].map((item) => (
              <div key={item.q} className="bg-gray-50 rounded-xl p-6">
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
            Need Help With Your Trekking Permits?
          </h2>
          <p className="text-lg text-white/90 mb-8">
            Our team arranges every permit, TIMS requirement, and licensed guide for your trek — just send us your travel dates.
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