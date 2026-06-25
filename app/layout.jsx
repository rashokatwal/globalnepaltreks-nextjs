import { Montserrat } from "next/font/google";
import "@/app/globals.css";
import { GoogleAnalytics, GoogleTagManager } from '@next/third-parties/google'
import { logos } from "./assets/assets";
import Script from "next/script";

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-montserrat',
})

// app/page.js
export const metadata = {
  metadataBase: new URL("https://globalnepaltreks.com"),

  title: {
    default: "Trekking and Tour Agency in Nepal | Global Nepal Treks",
    template: "%s",
  },

  description:
    "Locally based trekking company in Nepal offering Everest Base Camp, Annapurna Circuit, and cultural tours with expert local guides.",

  // keywords: "nepal trekking agency, everest base camp trek, annapurna circuit tour, himalayan trekking, nepal tour operator, local guides nepal, trekking company nepal, cultural tours nepal",

  openGraph: {
    siteName: "Global Nepal Treks",
    locale: "en_US",
    type: "website",
    title: "Global Nepal Treks | Trekking and Tour Agency in Nepal",
    description: "Locally based trekking company in Nepal offering Everest Base Camp, Annapurna Circuit, and cultural tours with expert local guides.",
    url: "https://globalnepaltreks.com",
    images: [
      {
        url: "https://globalnepaltreks.com/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Global Nepal Treks - Himalayan Trekking Experts"
      }
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Global Nepal Treks | Trekking and Tour Agency in Nepal",
    description: "Expert local guides for Everest Base Camp, Annapurna Circuit, and cultural tours in Nepal.",
    images: ["https://globalnepaltreks.com/og-image.jpg"],
  },

  alternates: {
    canonical: "https://globalnepaltreks.com",
    languages: {
      'en-US': 'https://globalnepaltreks.com',
    },
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

  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
    other: {
      'msvalidate.01': process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION,
    },
  },

  category: "Travel",
  authors: [{ name: "Global Nepal Treks" }],
  creator: "Global Nepal Treks",
  publisher: "Global Nepal Treks",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
};

// Generate WebSite Schema
function generateWebSiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Global Nepal Treks",
    "alternateName": "GNT",
    "url": "https://globalnepaltreks.com",
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": "https://globalnepaltreks.com/search?q={search_term_string}"
      },
      "query-input": "required name=search_term_string"
    },
    "description": "Expert local guides offering trekking and tour packages in Nepal, Tibet, and Bhutan.",
    "inLanguage": "en-US"
  };
}

// Generate TravelAgency Schema (enhanced)
function generateTravelAgencySchema() {
  return {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    "name": "Global Nepal Treks",
    "alternateName": "GNT",
    "url": "https://globalnepaltreks.com",
    "logo": logos.globalnepaltreks_logo?.src || "https://globalnepaltreks.com/logo.png",
    "image": "https://globalnepaltreks.com/og-image.jpg",
    "description": "Government-licensed trekking and tour agency offering authentic Himalayan adventures in Nepal, Tibet, and Bhutan. Specializing in Everest Base Camp, Annapurna Circuit, and cultural tours.",
    "email": "info@globalnepaltreks.com",
    "telephone": "+977-9744258519",
    "foundingDate": "2008",
    "foundingLocation": "Kathmandu, Nepal",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Bikramshila Mahavihar (Bhagawan Bahal), Tham Bahee Road",
      "addressLocality": "Kathmandu",
      "addressCountry": "Nepal",
      "postalCode": "44600"
    },
    "sameAs": [
      "https://www.facebook.com/GlobalNepalTreks",
      "https://x.com/Sakarsarthak147?t=zcbv2PDB2ZXwAW9-CC3c-w&s=07",
      "https://www.instagram.com/globalnepaltreks",
      "https://www.youtube.com/@GlobalnepalTreks5",
      "https://www.linkedin.com/company/global-nepal-treks-your-travel-partner-in-nepal/",
      "https://pin.it/3izih3qq5"
    ],
    "priceRange": "$$",
    "knowsLanguage": ["English", "Nepali", "Hindi", "Tibetan"],
    "areaServed": ["Nepal", "Tibet", "Bhutan"],
    "hasMap": "https://maps.google.com/?q=Global+Nepal+Treks+Kathmandu",
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      "opens": "09:00",
      "closes": "18:00"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+977-9744258519",
      "contactType": "customer service",
      "availableLanguage": ["English", "Nepali", "Hindi"],
      "hoursAvailable": {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        "opens": "09:00",
        "closes": "18:00"
      }
    }
  };
}

// Generate LocalBusiness Schema (for better local SEO)
function generateLocalBusinessSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Global Nepal Treks",
    "image": logos.globalnepaltreks_logo?.src || "https://globalnepaltreks.com/logo.png",
    "description": "Government-licensed trekking and tour agency based in Kathmandu, Nepal.",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Bikramshila Mahavihar (Bhagawan Bahal), Tham Bahee Road",
      "addressLocality": "Kathmandu",
      "addressCountry": "Nepal",
      "postalCode": "44600"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "27.7172",
      "longitude": "85.3240"
    },
    "telephone": "+977-9744258519",
    "email": "info@globalnepaltreks.com",
    "priceRange": "$$",
    "openingHours": "Mo-Sa 09:00-18:00"
  };
}

export default function RootLayout({ children }) {
  // Generate all schemas
  const webSiteSchema = generateWebSiteSchema();
  const travelAgencySchema = generateTravelAgencySchema();
  const localBusinessSchema = generateLocalBusinessSchema();

  return (
    <html lang="en">
      <head>
        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(travelAgencySchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
        />
        
        {/* Preconnect for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* Favicon and app icons */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        
        {/* Manifest for PWA */}
        <link rel="manifest" href="/site.webmanifest" />
        
        {/* DNS Prefetch */}
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        {/* <script defer async src='https://cdn.trustindex.io/loader.js?86777d674d4849784336b30abff'></script> */}
      </head>
      <GoogleTagManager gtmId={process.env.NEXT_PUBLIC_GTM_ID} />
      <body className={`${montserrat.variable} antialiased`}>
        {children}
      </body>
      <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
    </html>
  );
}