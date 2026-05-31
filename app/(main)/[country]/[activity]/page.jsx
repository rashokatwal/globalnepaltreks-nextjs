// app/[country]/[activity]/page.jsx
import { notFound } from 'next/navigation';
import ActivityClient from './ActivityClient';
import { Suspense } from 'react';

// Helper function to generate metadata based on country and activity
async function generateDynamicMetadata(country, activity, countryData, activityData) {
  const activityName = activity?.split('-').map(w => 
    w.charAt(0).toUpperCase() + w.slice(1)
  ).join(' ');
  const countryName = country?.charAt(0).toUpperCase() + country?.slice(1);
  
  // Get country full name and info
  const countryFullName = countryData?.data?.name || countryName;
  const countryDescription = countryData?.data?.description || '';
  
  // Get activity info
  const activityTitle = activityData?.data?.name || activityName;
  const activityDescription = activityData?.data?.description || '';
  
  // Generate meta title (45-60 characters)
  let metaTitle = '';
  if (activityTitle && countryFullName) {
    metaTitle = `${activityTitle} in ${countryFullName} | Global Nepal Treks`;
  } else {
    metaTitle = `${activityName} in ${countryName} | Global Nepal Treks`;
  }
  
  // Truncate title if too long
  if (metaTitle.length > 60) {
    metaTitle = metaTitle.substring(0, 57) + '...';
  }
  
  // Generate meta description (120-151 characters)
  let metaDescription = '';
  
  if (activityTitle.toLowerCase().includes('trek')) {
    metaDescription = `Discover breathtaking ${activityTitle} packages in ${countryFullName}. Expert guides, stunning mountain views, and unforgettable Himalayan adventures. Book your dream trek today!`;
  } else if (activityTitle.toLowerCase().includes('tour')) {
    metaDescription = `Explore the best ${activityTitle} packages in ${countryFullName}. Cultural experiences, scenic landscapes, and professional guides. Start your journey with Global Nepal Treks!`;
  } else {
    metaDescription = `Find the perfect ${activityTitle} packages in ${countryFullName}. Tailored experiences, local expertise, and guaranteed satisfaction. Book your adventure now!`;
  }
  
  // Ensure description is within 120-151 characters
  if (metaDescription.length > 151) {
    metaDescription = metaDescription.substring(0, 148) + '...';
  }
  if (metaDescription.length < 120) {
    metaDescription = metaDescription + ` Experience the best of ${countryFullName} with our expert team.`;
    if (metaDescription.length > 151) {
      metaDescription = metaDescription.substring(0, 148) + '...';
    }
  }
  
  // Generate keywords
  const keywords = [
    `${activityTitle} in ${countryFullName}`,
    `${activityTitle} packages`,
    `${countryFullName} ${activityTitle}`,
    `best ${activityTitle} ${countryFullName}`,
    `${activityTitle} deals`,
    `${countryFullName} adventure`,
    activityTitle,
    countryFullName,
    `${activityTitle} guide`,
    `book ${activityTitle}`
  ].join(', ');
  
  return {
    metaTitle,
    metaDescription,
    keywords,
    countryFullName,
    activityTitle,
    countryDescription,
    activityDescription
  };
}

export async function generateMetadata({ params }) {
  const { country, activity } = await params;
  
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const canonicalUrl = `https://globalnepaltreks.com/${country}/${activity}`;
  
  try {
    // Fetch country data
    const countryRes = await fetch(`${baseUrl}/api/countries/${country}`, {
      next: { revalidate: 3600 },
    });
    
    let countryData = null;
    if (countryRes.ok) {
      countryData = await countryRes.json();
    }
    
    // Fetch activity data
    const activityRes = await fetch(`${baseUrl}/api/activities`, {
      next: { revalidate: 3600 },
    });
    
    let activityData = null;
    let foundActivity = null;
    if (activityRes.ok) {
      activityData = await activityRes.json();
      foundActivity = activityData.data?.data?.find(a => a.slug === activity);
    }
    
    const metadata = await generateDynamicMetadata(country, activity, countryData, foundActivity);
    
    return {
      title: metadata.metaTitle,
      description: metadata.metaDescription,
      // keywords: metadata.keywords,
      openGraph: {
        title: metadata.metaTitle,
        description: metadata.metaDescription,
        type: 'website',
        locale: 'en_US',
        siteName: 'Global Nepal Treks',
        url: canonicalUrl,
        images: [
          {
            url: '/images/og-default.jpg',
            width: 1200,
            height: 630,
            alt: `${metadata.activityTitle} in ${metadata.countryFullName}`,
          }
        ],
      },
      twitter: {
        card: 'summary_large_image',
        title: metadata.metaTitle,
        description: metadata.metaDescription,
        images: ['/images/og-default.jpg'],
      },
      alternates: {
        canonical: canonicalUrl,
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
  } catch (error) {
    console.error('Error generating metadata:', error);
    const activityName = activity?.split('-').map(w => 
      w.charAt(0).toUpperCase() + w.slice(1)
    ).join(' ');
    const countryName = country?.charAt(0).toUpperCase() + country?.slice(1);
    
    return {
      title: `${activityName} in ${countryName} | Global Nepal Treks`,
      description: `Discover the best ${activityName} packages in ${countryName}. Book your adventure with Global Nepal Treks today!`,
      alternates: {
        canonical: canonicalUrl,
      },
    };
  }
}

// Generate JSON-LD structured data
function generateJsonLd(countryName, activityName, packages) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://globalnepaltreks.com';
  const currentUrl = `${baseUrl}/${countryName.toLowerCase()}/${activityName.toLowerCase().replace(/ /g, '-')}`;
  
  // Build item list for packages
  const itemListElement = packages?.map((pkg, index) => ({
    "@type": "ListItem",
    "position": index + 1,
    "name": pkg.title,
    "url": `${currentUrl}/${pkg.slug}`,
    "image": pkg.featured_image,
    "description": pkg.short_description
  })) || [];
  
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": `${activityName} in ${countryName}`,
    "description": `Discover the best ${activityName} packages in ${countryName}. Expert guides, stunning landscapes, and unforgettable experiences.`,
    "url": currentUrl,
    "isPartOf": {
      "@type": "WebSite",
      "name": "Global Nepal Treks",
      "url": baseUrl
    },
    "mainEntity": {
      "@type": "ItemList",
      "itemListElement": itemListElement,
      "numberOfItems": packages?.length || 0
    },
    "potentialAction": {
      "@type": "SearchAction",
      "target": `${currentUrl}?search={search_term_string}`,
      "query-input": "required name=search_term_string"
    }
  };
  
  return jsonLd;
}

// Generate BreadcrumbList Schema
function generateBreadcrumbSchema(countryName, activityName) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://globalnepaltreks.com';
  
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": baseUrl
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": countryName,
        "item": `${baseUrl}/${countryName.toLowerCase()}`
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": activityName,
        "item": `${baseUrl}/${countryName.toLowerCase()}/${activityName.toLowerCase().replace(/ /g, '-')}`
      }
    ]
  };
}

export default async function ActivityPage({ params, searchParams }) {
  const { country, activity } = await params;
  const filters = await searchParams;
  
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const countryName = country?.charAt(0).toUpperCase() + country?.slice(1);
  const activityName = activity?.split('-').map(w => 
    w.charAt(0).toUpperCase() + w.slice(1)
  ).join(' ');
  
  // Validate country
  const countryRes = await fetch(`${baseUrl}/api/countries/${country}`, {
    next: { revalidate: 3600 },
    cache: 'no-store'
  });
  
  if (!countryRes.ok) notFound();
  
  const countryData = await countryRes.json();
  const countryId = countryData.data?.id;
  
  if (!countryId) notFound();
  
  // Validate activity
  const activityRes = await fetch(`${baseUrl}/api/activities`, {
    next: { revalidate: 3600 },
    cache: 'no-store'
  });
  
  if (!activityRes.ok) notFound();
  
  const activityData = await activityRes.json();
  const foundActivity = activityData.data?.data?.find(a => a.slug === activity);
  const activityId = foundActivity?.id;
  
  if (!activityId) notFound();
  
  // Fetch packages to generate schema
  const packagesRes = await fetch(`${baseUrl}/api/packages?country_id=${countryId}&activity_id=${activityId}&limit=20`, {
    next: { revalidate: 3600 },
  });
  let packages = [];
  if (packagesRes.ok) {
    const packagesData = await packagesRes.json();
    packages = packagesData.data?.packages || [];
  }
  
  // Generate JSON-LD schemas
  const collectionJsonLd = generateJsonLd(countryName, activityName, packages);
  const breadcrumbJsonLd = generateBreadcrumbSchema(countryName, activityName);
  
  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      
      <ActivityClient
        country={country}
        activity={activity}
        countryId={countryId}
        activityId={activityId}
        filters={filters}
        countryName={countryName}
        activityName={activityName}
        countryDescription={countryData.data?.description}
      />
    </>
  );
}