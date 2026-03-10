// app/contact/ContactClient.js
"use client";

import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faMapMarkerAlt, 
  faPhone, 
  faEnvelope, 
  faClock,
  faPaperPlane,
  faGlobe,
  faSpinner,
  faCheckCircle,
  faExclamationCircle,
  faShieldAlt
} from "@fortawesome/free-solid-svg-icons";
import { 
  faFacebookF, 
  faInstagram, 
  faWhatsapp,
  faTwitter
} from "@fortawesome/free-brands-svg-icons";
import HeroSection from "@/app/components/sections/HeroSection";
import Heading from "@/app/components/ui/Heading";
import { useState, useCallback, useEffect } from "react";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { contactAssets } from "../assets/assets";

export default function ContactClient() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    country: '',
    subject: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState({ type: '', message: '' });
  const [isRecaptchaReady, setIsRecaptchaReady] = useState(false);
  
  const { executeRecaptcha } = useGoogleReCaptcha();

  // Create an event handler for reCAPTCHA readiness
  useEffect(() => {
    if (executeRecaptcha) {
      setIsRecaptchaReady(true);
    }
  }, [executeRecaptcha]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    
    // Check if reCAPTCHA is ready
    if (!isRecaptchaReady || !executeRecaptcha) {
      setSubmitStatus({ 
        type: 'error', 
        message: 'Security verification is still loading. Please wait a moment and try again.' 
      });
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus({ type: '', message: '' });

    try {
      // Get reCAPTCHA token
      const token = await executeRecaptcha('contact_form');
      
      if (!token) {
        throw new Error('Failed to get reCAPTCHA token');
      }

      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          recaptchaToken: token
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitStatus({ 
          type: 'success', 
          message: data.message || 'Thank you! Your message has been sent successfully. We\'ll get back to you within 24 hours.' 
        });
        setFormData({
          name: '',
          email: '',
          country: '',
          subject: '',
          message: ''
        });
        
        setTimeout(() => {
          setSubmitStatus({ type: '', message: '' });
        }, 10000);
      } else {
        setSubmitStatus({ 
          type: 'error', 
          message: data.message || 'Something went wrong. Please try again.' 
        });
      }
    } catch (error) {
      console.error('Submission error:', error);
      setSubmitStatus({ 
        type: 'error', 
        message: error.message || 'Network error. Please check your connection and try again.' 
      });
    } finally {
      setIsSubmitting(false);
    }
  }, [executeRecaptcha, formData, isRecaptchaReady]);

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

  return (
    <main>
      <HeroSection 
        image={contactAssets.contact_cover?.src || "/images/contact-cover.jpg"} 
        heading={"Contact Global Nepal Treks"} 
        subheading={"Your Gateway to Himalayan Adventure"} 
      />

      {/* reCAPTCHA Badge Note */}
      <div className="text-xs text-gray-500 text-center py-2 bg-gray-50">
        This site is protected by reCAPTCHA and the Google 
        <a href="https://policies.google.com/privacy" className="text-primary-color-dark hover:underline mx-1" target="_blank" rel="noopener noreferrer">Privacy Policy</a> 
        and 
        <a href="https://policies.google.com/terms" className="text-primary-color-dark hover:underline mx-1" target="_blank" rel="noopener noreferrer">Terms of Service</a> 
        apply. <FontAwesomeIcon icon={faShieldAlt} className="w-3 h-3 inline" />
      </div>

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
              
              {/* Status Message */}
              {submitStatus.message && (
                <div className={`mb-6 p-4 rounded-lg flex items-start gap-3 ${
                  submitStatus.type === 'success' 
                    ? 'bg-green-50 text-primary-color-dark border border-primary-color-dark-200' 
                    : 'bg-red-50 text-red-800 border border-red-200'
                }`}>
                  {submitStatus.type === 'success' ? (
                    <FontAwesomeIcon icon={faCheckCircle} className="w-5 h-5 mt-0.5 shrink-0 text-green-600" />
                  ) : (
                    <FontAwesomeIcon icon={faExclamationCircle} className="w-5 h-5 mt-0.5 shrink-0 text-red-600" />
                  )}
                  <p className="text-sm">{submitStatus.message}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-color-dark focus:border-transparent outline-none transition"
                    placeholder="Your full name"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-color-dark focus:border-transparent outline-none transition"
                    placeholder="your@email.com"
                  />
                </div>

                <div>
                  <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-2">
                    Country of Residence
                  </label>
                  <input
                    type="text"
                    id="country"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-color-dark focus:border-transparent outline-none transition"
                    placeholder="Your country"
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                    Subject <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-color-dark focus:border-transparent outline-none transition"
                    placeholder="What is your message about?"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    Your Message <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows="5"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-color-dark focus:border-transparent outline-none transition resize-none"
                    placeholder="Tell us about your dream adventure, specific requirements, or any questions you have..."
                  ></textarea>
                </div>

                {/* Show reCAPTCHA loading state */}
                {!isRecaptchaReady && (
                  <div className="text-sm text-gray-500 flex items-center gap-2">
                    <FontAwesomeIcon icon={faSpinner} className="w-4 h-4 animate-spin" />
                    Loading security verification...
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting || !isRecaptchaReady}
                  className="w-full bg-primary-color-dark text-white py-4 px-6 rounded-lg font-semibold hover:bg-primary-color transition flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <FontAwesomeIcon icon={faSpinner} className="w-5 h-5 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <FontAwesomeIcon icon={faPaperPlane} className="w-5 h-5" />
                      {!isRecaptchaReady ? 'Loading Security...' : 'Send Message'}
                    </>
                  )}
                </button>
              </form>
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
                      <Link href="https://maps.google.com/?q=Thamel+Kathmandu+Nepal" target="_blank" rel="noopener noreferrer" className="text-sm text-primary-color-dark hover:underline">
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
                      <p className="text-sm text-gray-500">Closed on Saturdays</p>
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
                      rel="noopener noreferrer"
                      className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 hover:bg-primary-color-dark hover:text-white transition"
                      aria-label="Follow us on Facebook"
                    >
                      <FontAwesomeIcon icon={faFacebookF} className="w-4 h-4" />
                    </Link>
                    <Link 
                      href="https://instagram.com/globalnepaltreks" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 hover:bg-primary-color-dark hover:text-white transition"
                      aria-label="Follow us on Instagram"
                    >
                      <FontAwesomeIcon icon={faInstagram} className="w-4 h-4" />
                    </Link>
                    <Link 
                      href="https://wa.me/9779744258519" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 hover:bg-primary-color-dark hover:text-white transition"
                      aria-label="Chat with us on WhatsApp"
                    >
                      <FontAwesomeIcon icon={faWhatsapp} className="w-4 h-4" />
                    </Link>
                    <Link 
                      href="https://twitter.com/globalnepaltreks" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 hover:bg-primary-color-dark hover:text-white transition"
                      aria-label="Follow us on Twitter"
                    >
                      <FontAwesomeIcon icon={faTwitter} className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>

              {/* International Representatives */}
              <div className="bg-white rounded-xl hidden shadow-sm p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <span className="w-1 h-8 bg-primary-color-dark rounded-full mr-3"></span>
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
                            <Link href={`tel:${rep.phone.replace(/\s/g, '')}`} className="hover:text-primary-color-dark">
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
              title="Global Nepal Treks Office Location in Kathmandu"
            ></iframe>
          </div>
        </div>
      </section>

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
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 border-2 border-green-600 hover:border-green hover:bg-green-600 text-white px-8 py-4 rounded-lg font-semibold transition shadow-sm"
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