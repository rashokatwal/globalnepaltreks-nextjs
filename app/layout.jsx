import { Montserrat } from "next/font/google";
import "./globals.css";
import NavBar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import { homeAssets, logos } from "./assets/assets";
import { GoogleAnalytics, GoogleTagManager } from '@next/third-parties/google'
import { icon } from "@fortawesome/fontawesome-svg-core";

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
    template: "%s | Global Nepal Treks",
  },

  description:
    "Locally based trekking company in Nepal offering Everest Base Camp, Annapurna Circuit, and cultural tours with expert local guides.",

  openGraph: {
    siteName: "Global Nepal Treks",
    locale: "en_US",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
  },
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
      <GoogleTagManager gtmId={process.env.NEXT_PUBLIC_GTM_ID} />
      <body className={`${montserrat.variable} antialiased`}>
        <NavBar />
        {children}
        <Footer />
      </body>
      <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
    </html>
  );
}

