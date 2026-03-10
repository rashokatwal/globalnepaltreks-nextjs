import { Montserrat } from "next/font/google";
import "./globals.css";
import NavBar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import { homeAssets } from "./assets/assets";
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
  description: 'Global Nepal Treks: Locally based trekking company in Nepal offering authentic Everest Base Camp, Annapurna Circuit, and cultural tours. Experience the Himalayas with expert local guides who know the mountains, culture, and people.',
  keywords: 'trekking in nepal, nepal trekking agency, everest base camp trek, annapurna circuit trek, nepal tour operator, himalayan trekking, local guides nepal, nepal travel company, upper mustang trek, poon hill trek',

  openGraph: {
    title: 'Trekking and Tour Agency in Nepal | Global Nepal Treks',
    description: 'Experience Nepal as our home. Authentic Himalayan treks with local experts since 2008.',
    url: 'https://globalnepaltreks.com',
    siteName: 'Global Nepal Treks',
    images: [
      {
        url: homeAssets.home_cover.src,
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
  return (
    <html lang="en">
      <body
        className={`${montserrat.variable} antialiased`}
      >
        <NavBar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
