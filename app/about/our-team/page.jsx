import Image from "next/image";
import HeroSection from "@/app/components/sections/HeroSection";
import Heading from "@/app/components/ui/Heading";
import { teamAssets } from "@/app/assets/assets";

export const metadata = {
  title: 'Our Team | Expert Himalayan Guides & Local Trekking Staff',
  description: 'Meet the experienced team behind Global Nepal Treks. Government-licensed guides, tour operators, and international coordinators dedicated to your authentic Himalayan adventure.',
  keywords: 'nepal trekking guides, saroj ghimire founder, keshar sherpa guide, deepak lamichane trekking, nabaraj gurung tour operator, himalayan guides nepal',
  openGraph: {
    title: 'Our Team | Global Nepal Treks',
    description: 'Meet our government-licensed guides and international representatives who make your Himalayan journey unforgettable.',
  },
};

const Team = () => {
    // Leadership Team
    const leadershipTeam = [
        {
            name: "Mr. Saroj Ghimire",
            position: "Founder & Director",
            image: teamAssets.saroj_ghimire,
            experience: "Since 2006",
            expertise: "Everest Region, Expedition Planning, Sustainable Tourism",
            languages: "Nepali, English, Hindi",
            description: "Saroj Ghimire is a leading tourism entrepreneur in Nepal and the Founder of Global Nepal Trekking, with active involvement in the tourism industry since 2006. Starting his career as a trekking assistant, he rose to become a top licensed trekking guide in Nepal, securing first rank in 2011. With deep expertise in the Nepal Himalayas, Saroj is known for professional mountain guiding, sustainable tourism, and high-quality trekking services. Fluent in English and experienced with international clients, he promotes eco-friendly trekking, cultural preservation, and responsible adventure tourism.",
            qualification: "Government Licensed Trekking Guide (Rank 1, 2011), NATHAM Certified"
        }
    ];

    // Senior Guides
    const seniorGuides = [
        {
            name: "Keshar Sherpa",
            position: "Senior Mountain Guide",
            image: teamAssets.keshar_sherpa,
            experience: "15+ years",
            expertise: "Everest Region, High Mountain Passes",
            languages: "Sherpa, Nepali, English",
            description: "Keshar Sherpa is an experienced Himalayan trekking guide from the Everest region of Nepal, known for his passion for high-altitude exploration and cultural discovery. As a certified guide from NATHM and a First Aid-trained professional through KEEP Nepal, Keshar specializes in Everest trekking, high mountain passes, and adventure travel. Energetic and knowledgeable, he enjoys uncovering hidden myths, Himalayan legends, and remote destinations.",
            qualification: "NATHM Certified Guide, First Aid Certified (KEEP Nepal)"
        },
        {
            name: "Deepak Lamichane",
            position: "Senior Trekking Guide",
            image: teamAssets.deepak_lamichane,
            experience: "10+ years",
            expertise: "Langtang Region, Annapurna Region",
            languages: "Nepali, English, Hindi",
            description: "Deepak Lamichhane hails from the northern Himalayan region of Nepal and brings over 10 years of professional trekking experience with Global Nepal Treks. Known for his energetic personality and guest-focused service, Deepak consistently delivers unforgettable Himalayan trekking experiences. He specializes in the Langtang region trek and Annapurna trekking routes, where his deep local knowledge ensures safety, comfort, and authentic cultural insight.",
            qualification: "NATHM Certified Trekking Guide"
        }
    ];

    // Tour Operators & Coordinators
    const tourOperators = [
        {
            name: "Nabaraj Gurung",
            nickname: "Little Marodona",
            position: "Tour Operator",
            image: teamAssets.nabaraj_gurung,
            experience: "9+ years",
            expertise: "Nepal Tours, Tibet, Bhutan, Adventure Activities",
            languages: "Nepali, English, Hindi, Multilingual",
            description: "Nabaraj Gurung is an experienced licensed tour and trekking guide in Nepal, offering professional travel services across Nepal, Tibet, and Bhutan. Based in Kathmandu, he brings over 9 years of expertise in Nepal tours, Himalayan trekking, paragliding, rafting, and customized travel itineraries. Trusted by international travelers, Nabaraj is known for reliable coordination, friendly support, and multilingual guiding services.",
            qualification: "Licensed Tour & Trekking Guide"
        }
    ];

    // International Coordinators
    const internationalCoordinators = [
        {
            name: "Dikshya Randhawa",
            position: "French & Mauritius Coordinator",
            image: teamAssets.diksha_randhwa,
            location: "Mauritius",
            languages: "Creole French, English, Hindi",
            experience: "Since 2017",
            description: "Diksha Ramdawa, originally from Mauritius, is a passionate travel enthusiast and cultural ambassador for Nepal, Bhutan, and Tibet tours. Since her first visit to Nepal in 2017, she has developed a deep connection with the country, returning in 2019 with friends on a memorable journey organized by Global Nepal Treks. Fluent in Creole French, English, and Hindi, Diksha supports international travelers by sharing firsthand travel experiences and insights. Actively involved in philanthropy in Nepal, she contributes to orphanages through clothing and food donations.",
            contact: "+230522266",
            email: "diksha.ramdawa@gmail.com"
        },
        {
            name: "Rosita Frei",
            position: "German Reference Coordinator",
            image: teamAssets.rosita_frei,
            location: "Germany / Nepal",
            languages: "German, English",
            experience: "Since 2012",
            description: "Rosita Frei, originally from Tübingen, Germany, has been living in Nepal since 2012, embracing Nepali culture, traditions, and festivals such as Dipawali. Together with her partner, she has explored Nepal extensively with Global Nepal Treks, including the Annapurna Base Camp Trek and Chitwan National Park jungle safari. Fluent in German and English, Rosita supports European travelers seeking authentic Nepal travel experiences, cultural immersion, and responsible tourism.",
            contact: "+49 171 4981507",
            email: "rosita.frei@gmx.net"
        },
        {
            name: "Yaseen",
            position: "US Travel Reference Coordinator",
            image: teamAssets.yaseen,
            location: "USA",
            experience: "2025",
            description: "In 2025, Yaseen traveled to Nepal and experienced the breathtaking Annapurna Base Camp Trek, combining adventure with meaningful impact. Along the journey, he supported the Chepang community, helping local schools and villages through hands-on volunteering. This inspiring trip highlights responsible tourism in Nepal, volunteer trekking programs, and community-based travel experiences. From Himalayan landscapes to cultural exchange, Yaseen's journey reflects the spirit of sustainable tourism and ethical travel in Nepal.",
            contact: "+919 561 9435"
        }
    ];

    return (
        <main>
            <HeroSection 
                image={teamAssets.team_cover.src} 
                heading={"Our Team"} 
                subheading={"Meet the Experts Behind Your Himalayan Adventure"} 
            />

            {/* Introduction */}
            <section className="py-16 bg-white">
                <div className="max-w-5xl mx-auto px-4">
                    <Heading 
                        title={"The Faces of Global Nepal Treks"} 
                        titleClass={"text-center mb-4"} 
                    />
                    <p className="text-md text-gray-600 leading-relaxed">
                        We have a truly <strong>multinational and multicultural team</strong>, providing a captivating combination of Eastern and Western skills. 
                        With upbringing amidst the Himalayas, our guides and porters possess profound insight into the country's culture, religion, and traditions. 
                        Every single one of our guides has undergone rigorous training and obtained an official <strong>Trekking Guide license issued by the Government</strong>, 
                        with exams organized by <strong>TAAN and NATHAM</strong> annually.
                    </p>
                </div>
            </section>

            {/* Founder - Square Image */}
            <section className="py-16 bg-gray-50">
                <div className="max-w-6xl mx-auto px-4">
                    <Heading 
                        title={"Our Founder"} 
                        titleClass={"text-center mb-12"} 
                    />
                    
                    {leadershipTeam.map((leader, index) => (
                        <div key={index} className="border border-primary-color-dark  rounded-xl shadow-sm overflow-hidden max-w-4xl mx-auto">
                            <div className="md:flex items-center">
                                <div className="md:w-1/3 p-6 md:p-8">
                                    <div className="aspect-square rounded-full overflow-hidden mx-auto max-w-62.5">
                                        <Image 
                                            src={leader.image} 
                                            alt={`${leader.name} - Founder of Global Nepal Treks`}
                                            width={400}
                                            height={400}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                </div>
                                <div className="md:w-2/3 p-8">
                                    <h3 className="text-2xl font-bold text-gray-900 mb-1">{leader.name}</h3>
                                    <p className="text-primary-color-dark font-semibold mb-4">{leader.position}</p>
                                    
                                    <div className="grid grid-cols-2 gap-4 mb-4">
                                        <div>
                                            <p className="text-sm text-gray-500">Experience</p>
                                            <p className="font-medium">{leader.experience}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Languages</p>
                                            <p className="font-medium">{leader.languages}</p>
                                        </div>
                                        <div className="col-span-2">
                                            <p className="text-sm text-gray-500">Expertise</p>
                                            <p className="font-medium">{leader.expertise}</p>
                                        </div>
                                    </div>
                                    
                                    <p className="text-gray-600 mb-4 line-clamp-3 font-medium">{leader.description}</p>
                                    <p className="text-sm text-accent-color font-medium">{leader.qualification}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Senior Guides - Square Cards */}
            <section className="py-16 bg-white">
                <div className="max-w-6xl mx-auto px-4">
                    <Heading 
                        title={"Our Senior Guides"} 
                        titleClass={"text-center mb-12"} 
                    />
                    
                    <div className="grid md:grid-cols-2 gap-8">
                        {seniorGuides.map((guide, index) => (
                            <div key={index} className="border border-primary-color-dark  rounded-xl overflow-hidden shadow-sm hover:shadow-md transition">
                                <div className="flex flex-col items-center p-8">
                                    <div className="w-40 h-40 rounded-full overflow-hidden mb-6">
                                        <Image 
                                            src={guide.image} 
                                            alt={`${guide.name} - ${guide.position}`}
                                            width={200}
                                            height={200}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-1 text-center">{guide.name}</h3>
                                    <p className="text-primary-color-dark font-medium mb-3 text-center">{guide.position}</p>
                                    
                                    <div className="flex flex-wrap gap-2 justify-center mb-4">
                                        <span className="bg-accent-color/10 text-accent-color text-xs px-3 py-1 rounded-full">
                                            {guide.experience}
                                        </span>
                                        <span className="bg-gray-200 text-gray-700 text-xs px-3 py-1 rounded-full">
                                            {guide.languages}
                                        </span>
                                    </div>
                                    
                                    <p className="text-gray-600 text-sm font-medium text-center mb-4">{guide.description}</p>
                                    <p className="text-xs font-medium text-accent-color text-center italic">{guide.qualification}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Tour Operator - Square Image */}
            <section className="py-16 bg-dark-section">
                <div className="max-w-6xl mx-auto px-4">
                    <Heading 
                        title={"Our Tour Operator"} 
                        titleClass={"text-center mb-12"} 
                    />
                    
                    {tourOperators.map((operator, index) => (
                        <div key={index} className="rounded-xl border border-primary-color-dark shadow-sm overflow-hidden max-w-4xl mx-auto">
                            <div className="md:flex items-center">
                                <div className="md:w-1/3 p-6 md:p-8">
                                    <div className="aspect-square rounded-full overflow-hidden mx-auto max-w-62.5">
                                        <Image 
                                            src={operator.image} 
                                            alt={`${operator.name} - Tour Operator`}
                                            width={400}
                                            height={400}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                </div>
                                <div className="md:w-2/3 p-8">
                                    <h3 className="text-2xl font-bold text-gray-900 mb-1">{operator.name}</h3>
                                    {operator.nickname && (
                                        <p className="text-primary-color-dark/70 font-medium mb-1">"{operator.nickname}"</p>
                                    )}
                                    <p className="text-primary-color-dark font-semibold mb-4">{operator.position}</p>
                                    
                                    <div className="grid grid-cols-2 gap-4 mb-4">
                                        <div>
                                            <p className="text-sm text-gray-500">Experience</p>
                                            <p className="font-medium">{operator.experience}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Languages</p>
                                            <p className="font-medium">{operator.languages}</p>
                                        </div>
                                        <div className="col-span-2">
                                            <p className="text-sm text-gray-500">Expertise</p>
                                            <p className="font-medium">{operator.expertise}</p>
                                        </div>
                                    </div>
                                    
                                    <p className="text-gray-600 mb-4 font-medium line-clamp-3">{operator.description}</p>
                                    <p className="text-sm text-accent-color font-medium">{operator.qualification}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* International Coordinators - Square Cards */}
            <section className="py-16 bg-white">
                <div className="max-w-6xl mx-auto px-4">
                    <Heading 
                        title={"Our International Coordinators"} 
                        titleClass={"text-center mb-4"}
                        subtitle={"Our global network of representatives ensures you get personalized support in your language and time zone."} 
                        subtitleClass={"text-center"}
                    />
                    <p className="text-center text-gray-600 mb-12 max-w-3xl mx-auto">
                        
                    </p>
                    
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {internationalCoordinators.map((coordinator, index) => (
                            <div key={index} className="border border-primary-color-dark  rounded-xl overflow-hidden shadow-sm hover:shadow-md transition">
                                <div className="p-8">
                                    <div className="w-32 h-32 rounded-full overflow-hidden mx-auto mb-6">
                                        <Image 
                                            src={coordinator.image} 
                                            alt={`${coordinator.name} - ${coordinator.position}`}
                                            width={150}
                                            height={150}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-1 text-center">{coordinator.name}</h3>
                                    <p className="text-primary-color-dark font-medium mb-2 text-center">{coordinator.position}</p>
                                    <p className="text-sm text-accent-color font-medium mb-3 text-center">{coordinator.location}</p>
                                    
                                    <p className="text-sm text-center mb-4 line-clamp-3 font-medium">{coordinator.description}</p>
                                    
                                    <div className="border-t pt-4 mt-4">
                                        <p className="text-sm mb-1 text-center">
                                            <span className="font-semibold">Languages:</span> {coordinator.languages}
                                        </p>
                                        {coordinator.contact && (
                                            <p className="text-sm mb-1 text-center">
                                                <span className="font-semibold">Contact:</span> {coordinator.contact}
                                            </p>
                                        )}
                                        {coordinator.email && (
                                            <p className="text-sm text-center truncate">
                                                <span className="font-semibold">Email:</span> {coordinator.email}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Our Commitment */}
            <section className="py-16 bg-secondary-color text-white">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <Heading 
                        title={"Our Commitment to You"} 
                        titleClass={"text-center text-white mb-6"} 
                    />
                    <p className="text-xl text-white/90 leading-relaxed italic">
                        "Our porter and guide will never leave you alone or mislead you during your trekking period; 
                        as it can be against the law and sorted as a serious crime."
                    </p>
                    <p className="text-white/80 mt-6">
                        Every guide is government-licensed, first-aid trained, and deeply committed to your safety and authentic experience.
                    </p>
                </div>
            </section>
        </main>
    );
};

export default Team;