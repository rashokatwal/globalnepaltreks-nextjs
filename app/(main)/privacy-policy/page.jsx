// app/privacy-policy/page.js (or pages/privacy-policy.js)
"use client";

import Link from "next/link";
import HeroSection from "@/app/components/sections/HeroSection";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faCompass, faMapMarkedAlt } from "@fortawesome/free-solid-svg-icons";

export default function PrivacyPolicy() {
    return (
        <main className="bg-white">
            {/* Hero / Page Header */}
            <HeroSection
                image="/images/privacy-policy-hero.jpg"
                heading="Privacy Policy"
                subheading="Your privacy matters. Learn how we protect your information."
            />

            {/* Content Section */}
            <section className="py-12 md:py-16 lg:py-20">
                <div className="max-w-4xl px-4 mx-auto sm:px-6 lg:px-8">
                    <div className="prose prose-lg prose-primary max-w-none">
                        <p className="text-gray-600">
                            At <strong>Global Nepal Treks</strong>, we are committed to protecting your privacy and ensuring the security 
                            of your personal information. This Privacy Policy outlines how we collect, use, disclose, and safeguard your 
                            data when you visit our website or book our trekking and tour services.
                        </p>

                        <h2 className="mt-8 text-2xl font-semibold text-primary-color-dark">Information We Collect</h2>
                        <p>We may collect the following types of information:</p>
                        <ul className="list-disc pl-6 space-y-1">
                            <li><strong>Personal Identification Information:</strong> Name, email address, phone number, passport details, date of birth, nationality, and emergency contact information.</li>
                            <li><strong>Payment Information:</strong> Credit card details, bank account information, and billing addresses (processed securely through third-party payment gateways).</li>
                            <li><strong>Travel Preferences:</strong> Dietary restrictions, medical conditions, fitness levels, and special requests to ensure a safe and enjoyable trek.</li>
                            {/* <li><strong>Technical Data:</strong> IP address, browser type, device information, and browsing behavior on our website (via cookies).</li> */}
                            <li><strong>Communication Records:</strong> Emails, messages, and call logs when you contact us for inquiries or support.</li>
                        </ul>

                        <h2 className="mt-8 text-2xl font-semibold text-primary-color-dark">How We Use Your Information</h2>
                        <p>We use the collected information for the following purposes:</p>
                        <ul className="list-disc pl-6 space-y-1">
                            <li>To process your bookings, payments, and confirmations.</li>
                            <li>To arrange permits, accommodations, transportation, and other trek logistics.</li>
                            <li>To communicate with you about trip updates, itineraries, and safety instructions.</li>
                            <li>To respond to your inquiries, requests, or complaints.</li>
                            <li>To improve our website, services, and customer experience.</li>
                            <li>To comply with legal obligations (e.g., immigration, tax, or permit regulations).</li>
                            <li>To send promotional offers, newsletters, or travel tips (only if you opt in).</li>
                        </ul>

                        <h2 className="mt-8 text-2xl font-semibold text-primary-color-dark">Sharing Your Information</h2>
                        <p>
                            We do not sell, trade, or rent your personal information to third parties. However, we may share your data 
                            with trusted partners to facilitate your trip:
                        </p>
                        <ul className="list-disc pl-6 space-y-1">
                            <li><strong>Local Authorities:</strong> For permits (TIMS, national park entry, restricted area permits) as required by the Government of Nepal.</li>
                            <li><strong>Accommodation & Transport Providers:</strong> Hotels, lodges, airlines, and vehicle operators to arrange your bookings.</li>
                            <li><strong>Emergency Services:</strong> In case of medical or evacuation needs, we share relevant details with rescue coordinators.</li>
                            <li><strong>Payment Processors:</strong> Secure third-party gateways to handle transactions (we do not store full credit card details).</li>
                            <li><strong>Legal Compliance:</strong> If required by law, court order, or government regulation.</li>
                        </ul>
                        <p>
                            All third-party partners are contractually obligated to protect your data and use it only for the intended services.
                        </p>

                        <h2 className="mt-8 text-2xl font-semibold text-primary-color-dark">Data Security</h2>
                        <p>
                            We implement appropriate technical and organizational measures to protect your personal information from 
                            unauthorized access, alteration, disclosure, or destruction. These include:
                        </p>
                        <ul className="list-disc pl-6 space-y-1">
                            <li>SSL encryption for data transmitted on our website.</li>
                            <li>Secure servers with firewalls and access controls.</li>
                            <li>Regular security audits and staff training on data protection.</li>
                            <li>Limited access to personal data (only employees who need it for service delivery).</li>
                        </ul>
                        <p>
                            However, no method of transmission over the Internet or electronic storage is 100% secure. While we strive to 
                            protect your data, we cannot guarantee absolute security.
                        </p>

                        <h2 className="mt-8 text-2xl font-semibold text-primary-color-dark">Cookies and Tracking Technologies</h2>
                        <p>
                            Our website uses cookies to enhance your browsing experience. Cookies are small text files stored on your device 
                            that help us:
                        </p>
                        <ul className="list-disc pl-6 space-y-1">
                            <li>Understand how you use our site (analytics).</li>
                            <li>Remember your preferences and language settings.</li>
                            <li>Serve relevant content and advertisements.</li>
                        </ul>
                        <p>
                            You can disable cookies through your browser settings, but this may affect certain functionalities of our website.
                        </p>

                        <h2 className="mt-8 text-2xl font-semibold text-primary-color-dark">Your Rights</h2>
                        <p>Depending on your location (e.g., under GDPR or similar laws), you may have the following rights:</p>
                        <ul className="list-disc pl-6 space-y-1">
                            <li><strong>Access:</strong> Request a copy of the personal data we hold about you.</li>
                            <li><strong>Correction:</strong> Ask us to correct inaccurate or incomplete information.</li>
                            <li><strong>Deletion:</strong> Request deletion of your data (subject to legal obligations, e.g., permit records).</li>
                            <li><strong>Restriction:</strong> Limit how we use your data.</li>
                            <li><strong>Portability:</strong> Receive your data in a structured, machine-readable format.</li>
                            <li><strong>Objection:</strong> Opt out of marketing communications or certain data processing.</li>
                        </ul>
                        <p>
                            To exercise any of these rights, please contact us at <strong>info@globalnepaltreks.com</strong> or use the 
                            details at the end of this policy.
                        </p>

                        <h2 className="mt-8 text-2xl font-semibold text-primary-color-dark">Third-Party Links</h2>
                        <p>
                            Our website may contain links to external sites (e.g., partner hotels, blogs, social media). We are not 
                            responsible for the privacy practices or content of those third parties. We encourage you to read their 
                            privacy policies before providing any personal information.
                        </p>

                        <h2 className="mt-8 text-2xl font-semibold text-primary-color-dark">Data Retention</h2>
                        <p>
                            We retain your personal information only as long as necessary to fulfill the purposes outlined in this 
                            policy, unless a longer retention period is required by law (e.g., for tax, accounting, or permit records). 
                            Typically, we keep booking data for up to 7 years. After that, we securely delete or anonymize the data.
                        </p>

                        <h2 className="mt-8 text-2xl font-semibold text-primary-color-dark">Children's Privacy</h2>
                        <p>
                            Our services are not directed to individuals under 18 years of age. We do not knowingly collect personal 
                            information from minors. If you are a parent or guardian and believe your child has provided us with data, 
                            please contact us, and we will delete it promptly.
                        </p>

                        <h2 className="mt-8 text-2xl font-semibold text-primary-color-dark">International Data Transfers</h2>
                        <p>
                            As a trekking agency based in Nepal, your information may be processed in Nepal. If you are located outside 
                            Nepal, please be aware that your data will be transferred to and stored in Nepal, which may have different 
                            data protection laws. By using our services, you consent to this transfer.
                        </p>

                        <h2 className="mt-8 text-2xl font-semibold text-primary-color-dark">Changes to This Privacy Policy</h2>
                        <p>
                            We may update this Privacy Policy from time to time to reflect changes in our practices or legal requirements. 
                            The updated version will be posted on this page with the "Last Revised" date. We encourage you to review it 
                            periodically. Your continued use of our services after changes constitutes acceptance of the revised policy.
                        </p>

                        <h2 className="mt-8 text-2xl font-semibold text-primary-color-dark">Contact Us</h2>
                        <p>
                            If you have any questions, concerns, or requests regarding this Privacy Policy or how we handle your data, 
                            please reach out to us:
                        </p>
                        <address className="not-italic mt-2">
                            <strong>Global Nepal Treks</strong><br />
                            Thamel, Kathmandu, Nepal<br />
                            Email: <a href="mailto:info@globalnepaltreks.com" className="text-primary-color-dark">info@globalnepaltreks.com</a><br />
                            Phone: (+977) 9744258519 | (+977) 9821274866<br />
                            Website: <a href="https://www.globalnepaltreks.com" className="text-primary-color-dark">www.globalnepaltreks.com</a>
                        </address>

                        <hr className="my-8 border-gray-300" />

                        <p className="text-sm text-gray-500 italic">
                            By using our website and booking our services, you acknowledge that you have read and understood this 
                            Privacy Policy and consent to the collection, use, and disclosure of your information as described herein.
                        </p>
                    </div>

                    {/* Back to Home link */}
                    <div className="grid grid-cols-3 gap-2 md:gap-4 mx-auto mt-20 max-w-2xl w-full mb-8 px-4">
                        <Link 
                            href="/"
                            className="group bg-white dark:bg-gray-800 rounded-lg p-3 md:p-4 text-center hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
                        >
                            <FontAwesomeIcon 
                            icon={faArrowLeft} 
                            className="text-xl md:text-2xl text-primary-color-dark mb-1 md:mb-2 group-hover:animate-pulse" 
                            />
                            <h3 className="font-semibold text-xs md:text-sm text-gray-800 dark:text-white">Base Camp</h3>
                            <p className="text-xs text-gray-500 hidden sm:block">Home</p>
                        </Link>

                        <Link 
                            href="/destinations"
                            className="group bg-white dark:bg-gray-800 rounded-lg p-3 md:p-4 text-center hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
                        >
                            <FontAwesomeIcon 
                            icon={faMapMarkedAlt} 
                            className="text-xl md:text-2xl text-primary-color-dark mb-1 md:mb-2 group-hover:animate-pulse" 
                            />
                            <h3 className="font-semibold text-xs md:text-sm text-gray-800 dark:text-white">Destinations</h3>
                            <p className="text-xs text-gray-500 hidden sm:block">Find trails</p>
                        </Link>

                        <Link 
                            href="/contact"
                            className="group bg-white dark:bg-gray-800 rounded-lg p-3 md:p-4 text-center hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
                        >
                            <FontAwesomeIcon 
                            icon={faCompass} 
                            className="text-xl md:text-2xl text-primary-color-dark mb-1 md:mb-2 group-hover:animate-pulse" 
                            />
                            <h3 className="font-semibold text-xs md:text-sm text-gray-800 dark:text-white">Get Help</h3>
                            <p className="text-xs text-gray-500 hidden sm:block">Contact us</p>
                        </Link>
                    </div>
                </div>
            </section>
        </main>
    );
}