// app/contact/page.js
import Image from "next/image";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faMapMarkerAlt, 
  faPhone, 
  faEnvelope, 
  faClock,
  faChevronDown,
  faLocationDot,
  faMessage,
  faPaperPlane,
  faUser,
  faGlobe
} from "@fortawesome/free-solid-svg-icons";
import { 
  faFacebookF, 
  faInstagram, 
  faWhatsapp,
  faTwitter
} from "@fortawesome/free-brands-svg-icons";
import { contactAssets } from "../assets/assets";
import HeroSection from "@/app/components/sections/HeroSection";
import Heading from "@/app/components/ui/Heading";
import ContactForm from "@/app/components/forms/ContactForm";

export const metadata = {
  title: 'Contact Us | Himalayan Trekking Experts',
  description: 'Get in touch with Global Nepal Treks. Our trekking experts are here to answer your questions, customize itineraries, and help plan your dream Himalayan adventure in Nepal, Tibet & Bhutan.',
  keywords: 'contact nepal trekking company, himalayan trekking inquiry, plan everest base camp trek, nepal trekking experts contact, trekking agency kathmandu, bhutan tour inquiry, tibet travel contact',
  openGraph: {
    title: 'Contact Us | Global Nepal Treks',
    description: 'Contact our trekking experts to plan your perfect Himalayan adventure.',
    images: [contactAssets.contact_cover?.src],
  },
};

export default function ContactPage() {
  
  const officeInfo = [
    {
      country: "Nepal (Head Office)",
      address: "Bikramshila Mahavihar (Bhagawan Bahal) Tham Bahee Road, Kathmandu, Nepal",
      phone: "+977 9744258519",
      email: "info@globalnepaltreks.com",
      hours: "Sun-Fri: 9:00 AM - 6:00 PM",
      map: "https://maps.google.com/?q=Thamel+Kathmandu+Nepal"
    },
    {
      country: "International Representatives",
      representatives: [
        {
          name: "Rosita Frei",
          region: "Germany / Europe",
          phone: "+49 171 4981507",
          email: "rosita.frei@gmx.net",
          languages: "German, English"
        },
        {
          name: "Dikshya Randhawa",
          region: "Mauritius / France",
          phone: "+230522266",
          email: "diksha.ramdawa@gmail.com",
          languages: "French, English, Hindi"
        },
        {
          name: "Yaseen",
          region: "USA / North America",
          phone: "+919 561 9435",
          languages: "English"
        }
      ]
    }
  ];

//   const faqs = [
//     {
//       question: "How do I book a trek?",
//       answer: "You can book directly through our website, email us at info@globalnepaltreks.com, or contact us via WhatsApp. We'll respond within 24 hours with availability and details."
//     },
//     {
//       question: "What is the best time to contact you?",
//       answer: "Our office is open Sunday-Friday, 9 AM to 6 PM Nepal Time (UTC+5:45). However, you can email us anytime, and we'll respond within 24 hours."
//     },
//     {
//       question: "Do you offer custom itineraries?",
//       answer: "Yes! We specialize in creating personalized trekking experiences. Contact us with your preferences, and we'll design a custom itinerary just for you."
//     },
//     {
//       question: "Can I talk to previous clients?",
//       answer: "Absolutely. We can connect you with past trekkers from your country who have traveled with us. Just let us know your preference."
//     }
//   ];

  return (
    <main>
      <HeroSection 
        image={contactAssets.contact_cover?.src || "/images/contact-cover.jpg"} 
        heading={"Contact Global Nepal Treks"} 
        subheading={"Your Gateway to Himalayan Adventure"} 
      />

      {/* Introduction */}
      <section className="py-12 bg-white">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <Heading 
            title={"Get in Touch"} 
            titleClass={"text-center mb-4"} 
          />
          <p className="text-md text-gray-600 leading-relaxed">
            Have questions about trekking in Nepal, Tibet, or Bhutan? Our team of <strong>expert local guides</strong> is here to help. 
            Whether you need help choosing the right trek, customizing an itinerary, or have specific questions about your adventure, 
            we're just a message away.
          </p>
        </div>
      </section>

      {/* Contact Form and Info */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Left Column - Contact Form */}
            <div className="bg-white rounded-xl shadow-sm p-8">
              <Heading 
                title={"Send Us a Message"} 
                titleClass={"mb-6"} 
              />
              <ContactForm />
            </div>

            {/* Right Column - Contact Info */}
            <div>
              <Heading 
                title={"Contact Information"} 
                titleClass={"mb-6"} 
              />
              
              {/* Nepal Office */}
              <div className="bg-white rounded-xl shadow-sm p-8 mb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <span className="w-1 h-8 bg-primary-color-dark rounded-full mr-3"></span>
                  Nepal Head Office
                </h3>
                
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <FontAwesomeIcon 
                      icon={faMapMarkerAlt} 
                      className="w-5 h-5 text-primary-color-dark mt-1 shrink-0" 
                    />
                    <div>
                      <p className="font-medium text-gray-900">Address</p>
                      <p className="text-gray-600">Bikramshila Mahavihar (Bhagawan Bahal) Tham Bahee Road, Kathmandu, Nepal</p>
                      <Link href="https://maps.google.com/?q=Thamel+Kathmandu+Nepal" target="_blank" className="text-sm text-primary-color-dark hover:underline">
                        View on Google Maps →
                      </Link>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <FontAwesomeIcon 
                      icon={faPhone} 
                      className="w-5 h-5 text-primary-color-dark mt-1 shrink-0" 
                    />
                    <div>
                      <p className="font-medium text-gray-900">Phone / WhatsApp</p>
                      <Link href="tel:+9779744258519" className="text-gray-600 hover:text-primary-color-dark">
                        +977 9744258519
                      </Link>
                      {/* <p className="text-sm text-gray-500">Available 24/7 for emergencies</p> */}
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <FontAwesomeIcon 
                      icon={faEnvelope} 
                      className="w-5 h-5 text-primary-color-dark mt-1 shrink-0" 
                    />
                    <div>
                      <p className="font-medium text-gray-900">Email</p>
                      <Link href="mailto:info@globalnepaltreks.com" className="text-gray-600 hover:text-primary-color-dark">
                        info@globalnepaltreks.com
                      </Link>
                      {/* <p className="text-sm text-gray-500">We reply within 24 hours</p> */}
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <FontAwesomeIcon 
                      icon={faClock} 
                      className="w-5 h-5 text-primary-color-dark mt-1 shrink-0" 
                    />
                    <div>
                      <p className="font-medium text-gray-900">Office Hours</p>
                      <p className="text-gray-600">Sunday - Friday: 9:00 AM - 6:00 PM (Nepal Time)</p>
                      {/* <p className="text-sm text-gray-500">Closed on Saturdays</p> */}
                    </div>
                  </div>
                </div>

                {/* Social Links */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <p className="font-medium text-gray-900 mb-3">Connect With Us</p>
                  <div className="flex gap-3">
                    <Link 
                      href="https://facebook.com/globalnepaltreks" 
                      target="_blank" 
                      className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 hover:bg-primary-color-dark hover:text-white transition"
                    >
                      <FontAwesomeIcon icon={faFacebookF} className="w-4 h-4" />
                    </Link>
                    <Link 
                      href="https://instagram.com/globalnepaltreks" 
                      target="_blank" 
                      className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 hover:bg-primary-color-dark hover:text-white transition"
                    >
                      <FontAwesomeIcon icon={faInstagram} className="w-4 h-4" />
                    </Link>
                    <Link 
                      href="https://wa.me/9779744258519" 
                      target="_blank" 
                      className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 hover:bg-primary-color-dark hover:text-white transition"
                    >
                      <FontAwesomeIcon icon={faWhatsapp} className="w-4 h-4" />
                    </Link>
                    <Link 
                      href="https://twitter.com/globalnepaltreks" 
                      target="_blank" 
                      className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 hover:bg-primary-color-dark hover:text-white transition"
                    >
                      <FontAwesomeIcon icon={faTwitter} className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>

              {/* International Representatives */}
              <div className="bg-white rounded-xl hidden shadow-sm p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <span className="w-2 h-8 bg-primary-color-dark rounded-full mr-3"></span>
                  International Representatives
                </h3>
                
                <div className="space-y-4">
                  {officeInfo[1].representatives.map((rep, index) => (
                    <div key={index} className="border-b border-gray-100 last:border-0 pb-4 last:pb-0">
                      <p className="font-semibold text-gray-900">{rep.name}</p>
                      <p className="text-sm text-primary-color-dark mb-2 flex items-center gap-1">
                        <FontAwesomeIcon icon={faGlobe} className="w-3 h-3" />
                        {rep.region}
                      </p>
                      <div className="text-sm text-gray-600 space-y-1">
                        {rep.phone && (
                          <p className="flex items-center gap-2">
                            <FontAwesomeIcon icon={faPhone} className="w-3 h-3 text-gray-400" />
                            <Link href={`tel:${rep.phone}`} className="hover:text-primary-color-dark">
                              {rep.phone}
                            </Link>
                          </p>
                        )}
                        {rep.email && (
                          <p className="flex items-center gap-2">
                            <FontAwesomeIcon icon={faEnvelope} className="w-3 h-3 text-gray-400" />
                            <Link href={`mailto:${rep.email}`} className="hover:text-primary-color-dark">
                              {rep.email}
                            </Link>
                          </p>
                        )}
                        {rep.languages && (
                          <p className="flex items-center gap-2">
                            <FontAwesomeIcon icon={faGlobe} className="w-3 h-3 text-gray-400" />
                            <span>{rep.languages}</span>
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <Heading 
            title={"Find Us in Kathmandu"} 
            titleClass={"text-center mb-8"} 
          />
          <div className="rounded-xl overflow-hidden shadow-sm h-96">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3532.9120000000003!2d85.312!3d27.717!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb190000000001%3A0x5b5c5e5e5e5e5e5e!2sThamel%2C%20Kathmandu%2044600%2C%20Nepal!5e0!3m2!1sen!2snp!4v1620000000000!5m2!1sen!2snp"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Global Nepal Treks Office Location"
            ></iframe>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      {/* <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4">
          <Heading 
            title={"Frequently Asked Questions"} 
            titleClass={"text-center mb-8"} 
          />
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm overflow-hidden">
                <details className="group">
                  <summary className="flex items-center justify-between p-6 cursor-pointer list-none">
                    <h3 className="text-lg font-semibold text-gray-900">{faq.question}</h3>
                    <FontAwesomeIcon 
                      icon={faChevronDown} 
                      className="w-4 h-4 text-primary-color-dark group-open:rotate-180 transition-transform" 
                    />
                  </summary>
                  <div className="px-6 pb-6">
                    <p className="text-gray-600">{faq.answer}</p>
                  </div>
                </details>
              </div>
            ))}
          </div>
        </div>
      </section> */}

      {/* CTA Section */}
      <section className="py-16 bg-secondary-color text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 font-montserrat">
            Ready to Start Your Adventure?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Contact us today and let's plan your dream trek in the Himalayas
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="https://wa.me/9779744258519" 
              target="_blank"
              className="inline-flex items-center justify-center gap-2 text-white px-8 py-4 rounded-lg font-semibold border hover:text-green-600 transition shadow-sm"
            >
              <FontAwesomeIcon icon={faWhatsapp} className="w-5 h-5" />
              WhatsApp Us
            </Link>
            <Link 
              href="mailto:info@globalnepaltreks.com"
              className="inline-flex items-center justify-center gap-2 bg-primary-color-dark text-white px-8 py-4 rounded-sm font-semibold hover:bg-primary-color transition shadow-sm"
            >
              <FontAwesomeIcon icon={faEnvelope} className="w-5 h-5" />
              Send Email
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}