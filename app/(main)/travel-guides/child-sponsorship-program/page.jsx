// app/travel-guides/child-sponsorship/page.js
import Link from 'next/link';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faHeart,
  faHandHoldingHeart,
  faSchool,
  faAppleAlt,
  faGlobe,
  faUsers,
  faDonate,
  faPhone,
  faEnvelope,
  faCheckCircle,
  faQuestionCircle
} from '@fortawesome/free-solid-svg-icons';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import HeroSection from '@/app/components/sections/HeroSection';
import Heading from '@/app/components/ui/Heading';

// SEO metadata
export const metadata = {
  title: 'Child Sponsorship Program | Support Education in Nepal',
  description: 'Join our child sponsorship program. We donate 5% of profits to support education and nutrition for underprivileged children in rural Nepal. Become a donor or volunteer today.',
  keywords: 'child sponsorship nepal, donate to nepal children, education charity nepal, volunteer nepal, social responsibility',
  openGraph: {
    title: 'Child Sponsorship Program | Support Education in Nepal',
    description: 'Join our child sponsorship program. We donate 5% of profits to support education and nutrition for underprivileged children in rural Nepal.',
    url: 'https://globalnepaltreks.com/travel-guides/child-sponsorship',
    type: 'article',
    images: [{ url: '/images/child-sponsorship-og.jpg', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Child Sponsorship Program | Support Education in Nepal',
    description: 'Join our child sponsorship program. We donate 5% of profits to support education and nutrition for underprivileged children in rural Nepal.',
    images: ['/images/child-sponsorship-og.jpg'],
  },
  alternates: {
    canonical: 'https://globalnepaltreks.com/travel-guides/child-sponsorship',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function ChildSponsorshipPage() {
  return (
    <main>
      {/* Hero Section */}
      <HeroSection
        image="/images/child-sponsorship-hero.jpg"
        heading="Child Sponsorship Program"
        subheading="Bringing hope to the children of rural Nepal"
      />

      {/* Introduction: The Challenge */}
      <section className="py-12 bg-white">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <Heading title="A Reality We Cannot Ignore" titleClass="text-center mb-4" />
          <p className="text-md text-gray-600 leading-relaxed">
            Of the total population of Nepal, over <strong>25%</strong> live below the poverty line.  
            Illiteracy, difficult geography, and limited access to basic services trap many families in a cycle of hardship.  
            Children are the most affected – high malnutrition rates, low school enrollment, and a future that often feels out of reach.
          </p>
          <p className="text-md text-gray-600 leading-relaxed mt-4">
            We believe every child deserves a chance. That’s why we made a promise to give back.
          </p>
        </div>
      </section>

      {/* Our Commitment */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <Heading title="Our Commitment" titleClass="text-left mb-6" />
              <div className="space-y-4 text-gray-600">
                <p>
                  At <strong>Global Nepal Treks</strong>, we have been bringing happiness to our clients through unforgettable Himalayan journeys.  
                  But we don’t want to limit happiness to our guests alone.  
                  As part of our <strong>social responsibility</strong>, we set aside <strong>5% of our total annual benefits</strong> to support underprivileged children in rural Nepal.
                </p>
                <p>
                  Every year, in <strong>May</strong>, we hand over the collected charity directly to children in need.  
                  The funds go toward two essential pillars: <strong>nourishment</strong> and <strong>education</strong>.  
                  We believe that no child should be deprived of a meal or a school desk because of poverty.
                </p>
                <p>
                  Our program focuses on remote villages where government services often fail to reach.  
                  By partnering with local schools and communities, we ensure that every rupee is used where it matters most.
                </p>
              </div>
            </div>
            <div className="bg-white rounded-xl p-8 shadow-sm text-center">
              <FontAwesomeIcon icon={faHeart} className="w-12 h-12 text-primary-color-dark mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-2">5% of Our Benefits</h3>
              <p className="text-gray-600">Donated annually to children’s education & nutrition</p>
              <hr className="my-6" />
              <div className="flex justify-center gap-8">
                <div className="text-center">
                  <FontAwesomeIcon icon={faSchool} className="w-6 h-6 text-primary-color-dark mb-2" />
                  <p className="text-sm text-gray-600">School supplies<br />& fees</p>
                </div>
                <div className="text-center">
                  <FontAwesomeIcon icon={faAppleAlt} className="w-6 h-6 text-primary-color-dark mb-2" />
                  <p className="text-sm text-gray-600">Nutritious<br />meals</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Volunteer Opportunities */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1">
              <div className="bg-gray-50 rounded-xl p-8 shadow-sm text-center">
                <FontAwesomeIcon icon={faUsers} className="w-12 h-12 text-primary-color-dark mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Volunteer With Us</h3>
                <p className="text-gray-600">
                  We welcome volunteers from around the world who want to bring happiness to these children.  
                  Whether you can teach, organize activities, or simply share your time, your presence makes a lasting difference.
                </p>
                <Link
                  href="/contact?subject=Volunteering"
                  className="inline-block mt-6 bg-primary-color-dark text-white px-6 py-2 rounded-lg hover:bg-primary-color transition"
                >
                  Become a Volunteer
                </Link>
              </div>
            </div>
            <div className="order-1 md:order-2">
              <Heading title="Volunteer Opportunities" titleClass="text-left mb-6" />
              <p className="text-gray-600 leading-relaxed">
                Many international travelers are touched by the warmth of Nepal and want to give back.  
                We facilitate volunteering experiences in the communities we support.  
                You can:
              </p>
              <ul className="mt-4 space-y-2 text-gray-600">
                <li className="flex items-start gap-2">
                  <FontAwesomeIcon icon={faCheckCircle} className="w-5 h-5 text-green-600 mt-1 shrink-0" />
                  <span>Teach basic English or assist in local classrooms.</span>
                </li>
                <li className="flex items-start gap-2">
                  <FontAwesomeIcon icon={faCheckCircle} className="w-5 h-5 text-green-600 mt-1 shrink-0" />
                  <span>Organize creative workshops, games, and sports.</span>
                </li>
                <li className="flex items-start gap-2">
                  <FontAwesomeIcon icon={faCheckCircle} className="w-5 h-5 text-green-600 mt-1 shrink-0" />
                  <span>Help with school infrastructure projects.</span>
                </li>
                <li className="flex items-start gap-2">
                  <FontAwesomeIcon icon={faCheckCircle} className="w-5 h-5 text-green-600 mt-1 shrink-0" />
                  <span>Simply spend time and share your culture – smiles are universal.</span>
                </li>
              </ul>
              <p className="mt-4 text-gray-600">
                Our team will assist you with logistics, orientation, and a meaningful placement that matches your skills.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call for Donors */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <Heading title="Become a Donor" titleClass="text-center mb-4" />
          <p className="text-md text-gray-600 leading-relaxed max-w-3xl mx-auto">
            While 5% of our profits make a difference, we know we can do more together.  
            That’s why we invite you to join this beautiful cause.  
            Every contribution – big or small – directly supports a child’s education, health, and future.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-6 justify-center">
            <div className="bg-white rounded-xl p-6 shadow-sm max-w-sm">
              <FontAwesomeIcon icon={faDonate} className="w-10 h-10 text-primary-color-dark mb-3" />
              <h3 className="text-xl font-semibold mb-2">One‑Time Donation</h3>
              <p className="text-gray-600 text-sm">Make a secure online donation. 100% goes to the children.</p>
              <button className="mt-4 bg-primary-color-dark text-white px-5 py-2 rounded-lg hover:bg-primary-color transition w-full">
                Donate Now
              </button>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm max-w-sm">
              <FontAwesomeIcon icon={faHandHoldingHeart} className="w-10 h-10 text-primary-color-dark mb-3" />
              <h3 className="text-xl font-semibold mb-2">Monthly Sponsorship</h3>
              <p className="text-gray-600 text-sm">Support a child regularly and see the impact grow.</p>
              <button className="mt-4 bg-primary-color-dark text-white px-5 py-2 rounded-lg hover:bg-primary-color transition w-full">
                Sponsor a Child
              </button>
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-6">
            For bank transfers or other ways to donate, please contact us directly.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <Heading title="Frequently Asked Questions" titleClass="text-center mb-12" />
          <div className="space-y-4">
            {[
              {
                q: 'How is the money used?',
                a: 'Funds go directly to school fees, uniforms, books, and nutritious meals for children in rural communities. We work with local partners to ensure transparency.',
              },
              {
                q: 'Can I visit the children I support?',
                a: 'Yes! If you sponsor a child, we can arrange a visit during our annual charity handover in May or at other times with prior coordination.',
              },
              {
                q: 'Is my donation tax‑deductible?',
                a: 'We are a registered travel company, not a separate charity. Please check with your local tax advisor. We can provide receipts for your contribution.',
              },
              {
                q: 'How do I know my donation reaches the children?',
                a: 'We share annual reports and photos of the distribution. Sponsors receive updates about the children they support.',
              },
            ].map((faq, idx) => (
              <div key={idx} className="bg-gray-50 rounded-xl p-6 shadow-sm">
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
            For questions about donating, volunteering, or our program, please reach out.
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

      {/* Structured Data – BreadcrumbList */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://globalnepaltreks.com' },
              { '@type': 'ListItem', position: 2, name: 'Travel Guides', item: 'https://globalnepaltreks.com/travel-guides' },
              { '@type': 'ListItem', position: 3, name: 'Child Sponsorship Program', item: 'https://globalnepaltreks.com/travel-guides/child-sponsorship' },
            ],
          }),
        }}
      />
    </main>
  );
}