// app/terms-and-conditions/page.js (or pages/terms-and-conditions.js)
    import Link from "next/link";
import HeroSection from "@/app/components/sections/HeroSection";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faCompass, faMapMarkedAlt } from "@fortawesome/free-solid-svg-icons";

export const metadata = {
  title: 'Terms & Conditions | Global Nepal Treks – Nepal Trekking Agency',
  description: 'Please read the terms and conditions of Global Nepal Treks. Understand our booking policies, cancellations, refunds, and responsibilities for Himalayan treks.',
//   keywords: 'nepal trekking guides, saroj ghimire founder, keshar sherpa guide, deepak lamichane trekking, nabaraj gurung tour operator, himalayan guides nepal',
  openGraph: {
    title: 'Terms & Conditions | Global Nepal Treks – Nepal Trekking Agency',
    description: 'Please read the terms and conditions of Global Nepal Treks. Understand our booking policies, cancellations, refunds, and responsibilities for Himalayan treks.',
  },
  alternates: {
      canonical: "https://globalnepaltreks.com/terms-and-conditions",
  },
};

export default function TermsAndConditions() {
    return (
        <main className="bg-white">
            {/* Hero / Page Header */}
            <HeroSection
                image="/images/child-sponsorship-hero.jpg"
                heading="Terms & Conditions"
                subheading="Please read carefully before booking your adventure with us."
            />

            {/* Content Section */}
            <section className="py-12 md:py-16 lg:py-20">
                <div className="max-w-4xl px-4 mx-auto sm:px-6 lg:px-8">
                    <div className="prose prose-lg prose-primary max-w-none">
                        <p className="text-gray-600">
                            <strong>Global Nepal Treks</strong> is a well‑known Government Registered Trekking Company in Nepal. 
                            We are trustworthy and fully committed to giving you the best service. We accept your bookings under the following 
                            terms and conditions.
                        </p>

                        <h2 className="mt-8 text-2xl font-semibold text-primary-color-dark">Booking & Payment</h2>
                        <p>
                            While making your trip with us, we need a photocopy of your passport and <strong>25% of the total amount</strong>, 
                            a non‑refundable booking deposit is required for every trip booking per person. The rest of the money can be paid 
                            upon arrival at our office. Full payment is required before departure of the trip. For last‑minute bookings 
                            (less than a week before departure), you need to pay the full amount as an advance.
                        </p>

                        <h3 className="mt-6 text-xl font-semibold text-accent-color">Bank Deposit</h3>
                        <p>
                            To make a booking you must send us a completed booking form at least <strong>30 days</strong> prior, with full 
                            payment as detailed below. This will constitute acceptance by you of these Terms and Conditions. All payments 
                            required are per person per trip. Please contact us regarding direct deposit details. A bank service charge may 
                            apply and should be paid at the time of deposit. Regarding credit cards, we only accept <strong>Visa, MasterCard, 
                            and National Card</strong> – a 4% levy will be added for card processing fee.
                        </p>

                        <h3 className="mt-6 text-xl font-semibold text-accent-color">Credit Card Payments</h3>
                        <p>By paying with credit card you need to submit the following documents to our Company:</p>
                        <ul className="list-disc pl-6 space-y-1">
                            <li>A copy of passport</li>
                            <li>A copy of your Credit Card (both sides)</li>
                            <li>A Passport size Photo</li>
                        </ul>
                        <p className="mt-2">
                            In case of failure of on‑time payment as required, Global Nepal Treks will not be compelled to 
                            provide the services as per the booking and agreement made between us.
                        </p>
                        <p>
                            Where possible, we will accept your last‑minute booking <strong>10 days</strong> before departure date, and full 
                            payment is required before departure of the trip.
                        </p>

                        <h2 className="mt-8 text-2xl font-semibold text-primary-color-dark">Reservation Deposit</h2>
                        <p>
                            A deposit of <strong>25% of the total value of the package per person</strong> is required upon booking.
                        </p>

                        <h2 className="mt-8 text-2xl font-semibold text-primary-color-dark">Trip Cancellation & Deposit</h2>
                        <p>
                            Global Nepal Treks designs its policies to protect you from unexpected or unpredictable events that may cause your 
                            trip to be cancelled or delayed. If you need to cancel for any reason, your initial deposit is <strong>good for 
                            life</strong> – it remains securely on file until you are ready to use it. And because your deposit is completely 
                            transferable, you can easily pass it on to anyone of your choosing.
                        </p>
                        <p>
                            Cancellation of a confirmed booking must be made by the client in writing (either written documents or email). 
                            Cancellation shall be valid with approval from the company after receiving the document. The trip shall then be 
                            termed as cancelled, and however there would be applied hotels and flight cancellation charges which will be 
                            deducted from the advance deposit; the remaining amount would go as a lifetime deposit.
                        </p>

                        <h2 className="mt-8 text-2xl font-semibold text-primary-color-dark">Cancellation By Us</h2>
                        <p>
                            A full refund of tour value will be remitted to you, should there be any cancellation due to insufficiency of 
                            group members or other unforeseen circumstances. We may be obliged to cancel your holiday by reasons like war, 
                            riots, civil disturbances, strikes, natural disasters, terrorist activities or threat of such, and closure of 
                            airport. Under such circumstances, we will advise you as soon as possible if we can offer you an alternative 
                            holiday of comparable standard, or make a prompt full refund of all money paid less reasonable expenses. 
                            However, we can be under no other liability to you in such cases.
                        </p>

                        <h2 className="mt-8 text-2xl font-semibold text-primary-color-dark">Refund</h2>
                        <p>
                            <strong>No refund</strong> will be made to any tour member in case of incomplete tour, trek, or expedition due 
                            to whatsoever reasons.
                        </p>

                        <h2 className="mt-8 text-2xl font-semibold text-primary-color-dark">Travel Insurance</h2>
                        <p>
                            You must purchase a comprehensive travel insurance package covering medical, natural calamity, helicopter 
                            evacuation, personal accident, etc. This is strongly suggested to all our clients.
                        </p>

                        <h2 className="mt-8 text-2xl font-semibold text-primary-color-dark">Tour Prices</h2>
                        <p>
                            Global Nepal Treks reserves the right to revise pricing rates on unavoidable circumstances or 
                            on the pressure of various external factors beyond our control, for instance changes in exchange rate, increase 
                            in airfare and other transport costs, hotel rates, and government tax, etc.
                        </p>

                        <h2 className="mt-8 text-2xl font-semibold text-primary-color-dark">During The Tour</h2>
                        <p>
                            The guide who represents Global Nepal Treks has all authority during your tours. If you 
                            commit any unlawful act, you are compelled to leave the tour. <strong>No refund</strong> will be made in such 
                            case.
                        </p>
                        <p>
                            On any account, we are not answerable for any loss or damage of your luggage or property belonging to you, 
                            even when shouldered by porters, ponies, or vehicles. That means your personal possessions and luggage are at 
                            your own risk at all times.
                        </p>

                        <h2 className="mt-8 text-2xl font-semibold text-primary-color-dark">Privacy Issues</h2>
                        <p>
                            We both agree to protect the confidentiality of the mutual company and agree not to discuss the matter with 
                            any other parties other than those directly involved or otherwise until written consent is given by either 
                            company.
                        </p>

                        <h2 className="mt-8 text-2xl font-semibold text-primary-color-dark">Flight Delay</h2>
                        <p>
                            Flights by plane and helicopter are prone to cancellations and delays due to notorious weather in remote areas 
                            and sometimes operational complications, which could happen particularly in the Everest region (Lukla flight), 
                            Annapurna region (Jomsom flight), Dolpa, Simikot, Jumla region, etc. When these flights are considered in the 
                            itinerary, it is also recommended to carry extra money to buy food and accommodations in case of delays. 
                            Global Nepal Treks will consider some expenses, and others you need to pay.
                        </p>

                        <hr className="my-8 border-gray-300" />

                        <p className="text-sm text-gray-500 italic">
                            By booking a trip with Global Nepal Treks, you acknowledge that you have read, understood, 
                            and agreed to all the above Terms and Conditions.
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