import Link from "next/link";
import { aboutAssets } from "../assets/assets";
import HeroSection from "../components/sections/HeroSection";
import Heading from "../components/ui/Heading";
import CountUpSection from "../components/sections/CountUpSection";

export const metadata = {
  title: 'About Us | Local Himalayan Trekking Experts Since 2008',
  description: 'Global Nepal Treks: Locally owned trekking company with 15+ years of experience. Meet our expert government-licensed guides and discover authentic Himalayan adventures in Nepal, Tibet & Bhutan.',
  keywords: 'nepal trekking company, himalayan trekking experts, local guides nepal, government licensed trekking guides, everest base camp specialists, responsible tourism nepal',
  openGraph: {
    title: 'About Us | Local Himalayan Trekking Experts Since 2008',
    description: 'Meet our expert local guides and discover why Global Nepal Treks is the trusted choice for authentic Himalayan adventures.',
    images: [aboutAssets.about_us_cover.src],
  },
};

const About = () => {
    const stats = [
        { number: 15, symbol: "+", label: "Years of Experience" },
        { number: 1000, symbol: "+", label: "Successful Treks" },
        { number: 100, symbol: "+", label: "Tour Packages" }
    ];

    return (
        <main>
            <HeroSection 
                heading={"About Global Nepal Treks"} 
                subheading={"Your Trusted Local Partner in the Himalayas"} 
                image={aboutAssets.about_us_cover.src} 
            />

            <section className="py-10 md:py-16">
                <div className="max-w-5xl mx-auto px-4">
                    <Heading 
                        title={"Our Story"} 
                        titleClass={"text-center mb-5"} 
                    />
                    
                    <div className="prose prose-lg mx-auto text-gray-600">
                        <p className="mb-6">
                            We at <Link href="/" className="hover:text-primary-color-dark hover:underline"><strong>Global Nepal Treks</strong></Link> have over <strong>15 years of travel operation experience</strong> across Nepal, Bhutan, and Tibet. We have built a strong network of reliable and trustworthy local partners in each of these Himalayan nations, allowing us to arrange trips uniquely tailored to our clients' needs and preferences.
                        </p>
                        
                        <p className="mb-6">
                            Our mission is to promote <strong>exciting and socially responsible tours and treks</strong>, guaranteeing the best travel experiences across the Himalayas. Whether you dream of standing at Everest Base Camp, exploring the mystical monasteries of Tibet, trekking the remote Upper Mustang, or discovering the "Land of the Thunder Dragon" in Bhutan, we're here to make it happen with <strong>authenticity and care</strong>.
                        </p>
                        
                        <p className="mb-6">
                            What sets us apart is our truly <strong>multinational and multicultural team</strong>, providing a captivating combination of Eastern hospitality and Western understanding. Having grown up amidst the towering peaks of the Himalayas, our guides possess <strong>profound insight into the region's culture, religion, and centuries-old traditions</strong>. They are deeply versed in Nepali culture, history, religions, and art, and always do their best to reveal the genuine heart of our homeland.
                        </p>

                        <h3 className="text-2xl font-bold text-gray-900 mt-10 mb-4 font-montserrat">
                            Government-Licensed & Expertly Trained Guides
                        </h3>
                        
                        <p className="mb-6">
                            <strong>Safety and professionalism are non-negotiable</strong> at Global Nepal Treks. Every single one of our guides has undergone rigorous training and obtained an official <strong>Trekking Guide license issued by the Government of Nepal</strong>. The license exam is organized annually by <strong>TAAN (Trekking Agencies' Association of Nepal)</strong> and <strong>NATHAM (Nepal Academy of Tourism and Hotel Management)</strong>, ensuring only the most qualified individuals earn the right to guide travelers through the Himalayas.
                        </p>
                        
                        <p className="mb-6">
                            Our guides' expertise extends far beyond knowing the trail. They are extensively trained in:
                        </p>
                        
                        <ul className="list-disc pl-6 mb-6 space-y-2">
                            <li><strong>Route expertise</strong> – Intimate knowledge of Everest, Annapurna, Langtang, Manaslu, and remote restricted regions</li>
                            <li><strong>Altitude sickness prevention</strong> – Early recognition and proper acclimatization protocols</li>
                            <li><strong>Emergency first aid</strong> – Wilderness first responder certification</li>
                            <li><strong>Cultural interpretation</strong> – Deep knowledge of local customs, monasteries, and traditions</li>
                            <li><strong>Weather pattern recognition</strong> – Adapting itineraries for safety and optimal views</li>
                        </ul>

                        <h3 className="text-2xl font-bold text-gray-900 mt-10 mb-4 font-montserrat">
                            Our Commitment: You Are Never Alone
                        </h3>
                        
                        <p className="mb-6">
                            <strong>"Our guides and porters will never leave you alone or mislead you during your trekking period."</strong> This is not just a promise - it is our professional and ethical obligation, backed by Nepali law where abandonment of clients is considered a serious offense. When you trek with us, you gain more than a guide - you gain a <strong>guardian, teacher, and friend in the mountains</strong>.
                        </p>
                        
                        <p className="mb-6">
                            Our guides carry <strong>satellite phones, comprehensive first aid kits, pulse oximeters, and emergency oxygen</strong> on all treks. We maintain constant communication with our Kathmandu office, ensuring that support is always just a call away. This commitment to your wellbeing has earned us the trust of hundreds of trekkers who return to trek with us year after year.
                        </p>

                        <h3 className="text-2xl font-bold text-gray-900 mt-10 mb-4 font-montserrat">
                            Why Travelers Choose Global Nepal Treks
                        </h3>
                        
                        <div className="grid md:grid-cols-2 gap-4 my-6">
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h4 className="font-bold text-primary-color-dark mb-2">✓ Local Knowledge</h4>
                                <p className="text-sm">Guides who grew up in the shadow of the Himalayas</p>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h4 className="font-bold text-primary-color-dark mb-2">✓ Safety First</h4>
                                <p className="text-sm">Government-licensed & first-aid trained</p>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h4 className="font-bold text-primary-color-dark mb-2">✓ Authentic Experiences</h4>
                                <p className="text-sm">Hidden trails & genuine cultural encounters</p>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h4 className="font-bold text-primary-color-dark mb-2">✓ Ethical Practices</h4>
                                <p className="text-sm">Fair wages & responsible tourism commitment</p>
                            </div>
                        </div>
                    </div>
                    
                    <CountUpSection stats={stats} />
                </div>
            </section>

            <section className="py-16 bg-secondary-color text-white">
                <div className="max-w-5xl mx-auto px-4 text-center">
                    <p className="text-xl text-white/90 leading-relaxed italic">
                        "With Global Nepal Treks, you don't just trek through the Himalayas - you experience it as we do: as home."
                    </p>
                </div>
            </section>
        </main>
    )
}

export default About;