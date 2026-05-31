// app/contact/page.js
import { contactAssets } from "@/app/assets/assets";
import GoogleCaptchaWrapper from "@/app/components/wrappers/GoogleCaptchaWrapper";
import ContactClient from "./ContactClient";
import Script from "next/script";

export const metadata = {
  title: 'Contact Us | Himalayan Trekking Experts - Global Nepal Treks',
  description: 'Reach out to Global Nepal Treks. Our trekking experts customize itineraries and help plan authentic Himalayan adventures in Nepal, Tibet & Bhutan.',
  // keywords: 'contact nepal trekking company, himalayan trekking inquiry, plan everest base camp trek, nepal trekking experts contact, trekking agency kathmandu, bhutan tour inquiry, tibet travel contact, global nepal treks contact, himalayan adventure planner, trekking consultation',
  openGraph: {
    title: 'Contact Us | Himalayan Trekking Experts - Global Nepal Treks',
    description: 'Reach out to Global Nepal Treks. Our trekking experts customize itineraries and help plan authentic Himalayan adventures in Nepal, Tibet & Bhutan.',
    images: [contactAssets.contact_cover?.src],
    type: 'website',
    locale: 'en_US',
    siteName: 'Global Nepal Treks',
    url: 'https://globalnepaltreks.com/contact',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact Us | Himalayan Trekking Experts - Global Nepal Treks',
    description: 'Contact our trekking experts to plan your perfect Himalayan adventure in Nepal, Tibet & Bhutan.',
    images: [contactAssets.contact_cover?.src],
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
  alternates: {
    canonical: "https://globalnepaltreks.com/contact",
  },
};

// Generate ContactPage Schema
function generateContactPageSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "name": "Contact Us | Himalayan Trekking Experts - Global Nepal Treks",
    "description": "Reach out to Global Nepal Treks. Our trekking experts customize itineraries and help plan authentic Himalayan adventures in Nepal, Tibet & Bhutan.",
    "url": "https://globalnepaltreks.com/contact",
    "mainEntity": {
      "@type": "Organization",
      "name": "Global Nepal Treks",
      "url": "https://globalnepaltreks.com",
      "logo": "https://globalnepaltreks.com/logo.png",
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": "+977-9744258519",
        "contactType": "customer service",
        "availableLanguage": ["English", "Nepali", "Hindi", "German", "French"],
        "areaServed": ["Nepal", "Tibet", "Bhutan", "Worldwide"],
        "email": "info@globalnepaltreks.com"
      },
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Bikramshila Mahavihar (Bhagawan Bahal), Tham Bahee Road",
        "addressLocality": "Kathmandu",
        "addressCountry": "Nepal",
        "postalCode": "44600"
      }
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
        "name": "Contact Us",
        "item": "https://globalnepaltreks.com/contact"
      }
    ]
  };
}

// Generate Organization Schema with Contact Info
function generateOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    "name": "Global Nepal Treks",
    "alternateName": "Global Nepal Treks Pvt. Ltd.",
    "description": "Government-licensed trekking agency in Nepal offering authentic Himalayan treks and tours across Nepal, Tibet, and Bhutan.",
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

export default function ContactPage() {
  // Generate all schemas
  const contactPageSchema = generateContactPageSchema();
  const breadcrumbSchema = generateBreadcrumbSchema();
  const organizationSchema = generateOrganizationSchema();

  return (
    <>
      {/* JSON-LD Structured Data */}
      <Script
        id="contact-page-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactPageSchema) }}
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
      
      <GoogleCaptchaWrapper>
        <ContactClient />
      </GoogleCaptchaWrapper>
    </>
  );
}