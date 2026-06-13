// app/book/page.js
import GoogleCaptchaWrapper from "@/app/components/wrappers/GoogleCaptchaWrapper";
import BookClient from "./BookClient";

export const metadata = {
  title: 'Book Your Nepal Trek | Himalayan Adventures & Tours',
  description: 'Book your Himalayan trek with Global Nepal Treks. Explore Everest, Annapurna & Langtang with best prices and guaranteed departures.',
  // keywords: 'book nepal trek, everest base camp booking, annapurna circuit reservation, himalayan trek booking, nepal trekking packages, book trek online, trekking agency booking, himalayan adventure booking',
  openGraph: {
    title: 'Book Your Nepal Trek | Himalayan Adventures & Tours',
    description: 'Book your Himalayan trek with Global Nepal Treks. Explore Everest, Annapurna & Langtang with best prices and guaranteed departures.',
    images: [{
      url: '/images/booking-cover.jpg',
      width: 1200,
      height: 630,
      alt: 'Book Your Trek with Global Nepal Treks',
    }],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Book Your Trek | Global Nepal Treks',
    description: 'Book your Himalayan trek with Global Nepal Treks. Explore Everest, Annapurna & Langtang with best prices and guaranteed departures.',
    images: ['/images/booking-cover.jpg'],
  },
  alternates: {
    canonical: 'https://globalnepaltreks.com/book',
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
  other: {
    'application/ld+json': JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Product',
      'name': 'Himalayan Trek Booking',
      'description': 'Book your dream Himalayan trek with Global Nepal Treks',
      'url': 'https://globalnepaltreks.com/book',
      'provider': {
        '@type': 'Organization',
        'name': 'Global Nepal Treks',
        'telephone': '+977 9744258519',
        'email': 'bookings@globalnepaltreks.com',
        'address': {
          '@type': 'PostalAddress',
          'streetAddress': 'Bikramshila Mahavihar (Bhagawan Bahal) Tham Bahee Road',
          'addressLocality': 'Kathmandu',
          'addressCountry': 'NP'
        }
      }
    })
  }
};

export default function BookPage() {
  return (
    <GoogleCaptchaWrapper>
      <BookClient />
    </GoogleCaptchaWrapper>
  );
}