import { Montserrat } from "next/font/google";
import "./globals.css";
import NavBar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import { homeAssets, logos } from "./assets/assets";
import { GoogleAnalytics } from '@next/third-parties/google'
import { icon } from "@fortawesome/fontawesome-svg-core";

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-montserrat',
})

// app/page.js
export const metadata = {
  title: {
    default: 'Trekking and Tour Agency in Nepal | Global Nepal Treks',
    template: '%s | Global Nepal Treks'
  },
  description: 'Locally based trekking company in Nepal offering Everest Base Camp, Annapurna Circuit, and cultural tours with expert local guides.',
  keywords: 'trekking in nepal, nepal trekking agency, everest base camp trek, annapurna circuit trek, nepal tour operator, himalayan trekking, local guides nepal, nepal travel company, upper mustang trek, poon hill trek',

  openGraph: {
    title: 'Trekking and Tour Agency in Nepal | Global Nepal Treks',
    description: 'Experience Nepal as our home. Authentic Himalayan treks with local experts since 2008.',
    url: 'https://globalnepaltreks.com',
    siteName: 'Global Nepal Treks',
    images: [
      {
        url: logos.globalnepaltreks_logo.src,
        width: 1200,
        height: 630,
        alt: 'Himalayan mountain landscape with trekking route',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  
  twitter: {
    card: 'summary_large_image',
    title: 'Trekking and Tour Agency in Nepal | Global Nepal Treks',
    description: 'Authentic Himalayan treks with local experts. Everest, Annapurna & more.',
    images: [homeAssets.home_cover.src],
  },
  
  alternates: {
    canonical: 'https://globalnepaltreks.com',
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
  // icons: {
  //   icon: '/favicon.png',
  //   shortcut: '/favicon.png',
  //   apple: '/apple-touch-icon.png',
  //   other: {
  //     rel: 'apple-touch-icon',
  //     url: '/apple-touch-icon.png',
  //   }
  // }
};

export default function RootLayout({ children }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TravelAgency", // Changed to TravelAgency for better SEO for trekking
    "name": "Global Nepal Treks",
    "alternateName": "GNT",
    "url": "https://globalnepaltreks.com",
    "logo": "https://globalnepaltreks.com", // Ensure this is a full URL string
    "sameAs": [
      "https://www.facebook.com/GlobalNepalTreks",
      "https://x.com/Sakarsarthak147?t=zcbv2PDB2ZXwAW9-CC3c-w&s=07",
      "https://www.instagram.com/globalnepaltreks",
      "https://www.youtube.com/@GlobalnepalTreks5",
      "https://www.linkedin.com/company/global-nepal-treks-your-travel-partner-in-nepal/",
      "https://pin.it/3izih3qq5"
    ]
  };

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${montserrat.variable} antialiased`}>
        <NavBar />
        {children}
        <Footer />
      </body>
      <GoogleAnalytics gaId="G-3K0DX4GGLT" />
    </html>
  );
}

