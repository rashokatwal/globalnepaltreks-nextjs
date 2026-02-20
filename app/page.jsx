"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faArrowRight,
  faChevronLeft, 
  faChevronRight, 
  faCircleCheck, 
  faClipboardList,
  faLeaf, 
  faMagnifyingGlass, 
  faMountain, 
  faPersonHiking, 
  faQuoteLeft, 
  faRoute, 
  faSeedling, 
  faShield, 
  faShieldAlt, 
  faStar, 
  faStarHalfStroke 
} from "@fortawesome/free-solid-svg-icons";
import CountUp from "react-countup";
import Link from "next/link";
import Image from "next/image";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';
import PackageCard from "./components/cards/PackageCard";
import { useRef } from "react";
import BlogCard from "./components/cards/BlogCard";
import { HomeAssets, logos } from "./assets/assets";

const Home = () => {
    const swiperRef = useRef(null);
    
    const stats = [
        { number: 15, symbol: "+", label: "Years of Experience" },
        { number: 1000, symbol: "+", label: "Successful Treks" },
        { number: 100, symbol: "+", label: "Tour Packages" }
    ];

    const differentActivitiesWeOffer = [
        {
            title: "Trekking",
            image: HomeAssets.heli_tours,
            type: "Adventure",
            color: "#098B63",
            description: "Customizable routes, difficulty levels, and schedules tailored to your preferences and fitness level."
        },
        {
            title: "Tours",
            image: HomeAssets.heli_tours,
            type: "Culture",
            color: "#255DD8",
            description: "Immersive cultural experiences with expert guides and authentic local encounters."
        },
        {
            title: "Rafting",
            image: HomeAssets.rafting,
            type: "Extreme",
            color: "#0C87A5",
            description: "Thrilling white water adventures with professional safety equipment and guides."
        },
        {
            title: "Peak Climbing",
            image: HomeAssets.peak_climbing,
            type: "Expert",
            color: "#C86F08",
            description: "Professional guided ascents with specialized equipment and experienced Sherpa teams."
        },
        {
            title: "Heli Tour",
            image: HomeAssets.heli_tours,
            type: "Luxury",
            color: "#852ED3",
            description: "Breathtaking aerial views of the Himalayas with luxury accommodations and services."
        }
    ];

    const packageData = [
        {
            id: 1,
            image: "https://images.pexels.com/photos/2902939/pexels-photo-2902939.jpeg",
            country: "Nepal",
            title: "Annapurna Short Trek",
            price: 1299,
            availability: "All Years",
            duration: "13 Days",
            description: "A scenic Himalayan adventure featuring villages, forests, and iconic mountain views-perfect for limited timeframes."
        },
        {
            id: 2,
            image: "https://images.pexels.com/photos/28625167/pexels-photo-28625167.jpeg",
            country: "Tibet",
            title: "Everest Tour Via Tibet",
            price: 1299,
            availability: "All Years",
            duration: "13 Days",
            description: "A high-altitude journey to Everest's north face with dramatic landscapes, monasteries, and remote Tibetan culture."
        },
        {
            id: 3,
            image: "https://images.pexels.com/photos/10792604/pexels-photo-10792604.jpeg",
            country: "Tibet",
            title: "Mount Kailash Tour",
            price: 1299,
            availability: "All Years",
            duration: "13 Days",
            description: "A sacred pilgrimage route around one of Asia's holiest peaks, blending spirituality, rugged terrain, and breathtaking scenery."
        },
        {
            id: 4,
            image: "https://images.pexels.com/photos/31640266/pexels-photo-31640266.jpeg",
            country: "Bhutan",
            title: "Bhutan Dragon Heart Tour",
            price: 1299,
            availability: "All Years",
            duration: "11 Days",
            description: "Explore Himalayan kingdoms, ancient monasteries, and serene valleys in the land of the Thunder Dragon."
        },
        {
            id: 5,
            image: "https://images.pexels.com/photos/27940580/pexels-photo-27940580.jpeg",
            country: "Nepal",
            title: "Everest Helicopter Tour",
            price: 1299,
            availability: "All Years",
            duration: "4 Days",
            description: "A spectacular flight to Everest with glacier landings and panoramic Himalayan views-perfect for a once-in-a-lifetime experience."
        },
        {
            id: 6,
            image: "https://images.pexels.com/photos/27940580/pexels-photo-27940580.jpeg",
            country: "Nepal",
            title: "Everest Helicopter Tour",
            price: 1299,
            availability: "All Years",
            duration: "4 Days",
            description: "A spectacular flight to Everest with glacier landings and panoramic Himalayan views-perfect for a once-in-a-lifetime experience."
        }
    ];

    const trekkingInNepal = [
        {
            id: 1,
            image: "https://images.pexels.com/photos/2902939/pexels-photo-2902939.jpeg",
            country: "Nepal",
            title: "Annapurna Short Trek",
            price: 1299,
            availability: "All Years",
            duration: "13 Days"
        },
        {
            id: 2,
            image: "https://images.pexels.com/photos/28625167/pexels-photo-28625167.jpeg",
            country: "Tibet",
            title: "Everest Tour Via Tibet",
            price: 1299,
            availability: "All Years",
            duration: "13 Days"
        },
        {
            id: 3,
            image: "https://images.pexels.com/photos/10792604/pexels-photo-10792604.jpeg",
            country: "Tibet",
            title: "Mount Kailash Tour",
            price: 1299,
            availability: "All Years",
            duration: "13 Days"
        }
    ];

    const whyChooseUs = [
        {
            title: "Local Mountain Experts",
            description: "Experienced guides with deep knowledge of Himalayan terrain and culture.",
            icon: faMountain
        },
        {
            title: "Safety & Professional Standards",
            description: "Certified staff, emergency protocols, and high-altitude preparedness.",
            icon: faShieldAlt
        },
        {
            title: "Authentic Trekking Experiences",
            description: "Carefully curated routes beyond typical tourist paths.",
            icon: faPersonHiking
        },
        {
            title: "Personalized Itineraries",
            description: "Trips tailored to your pace, fitness level, and travel goals.",
            icon: faClipboardList
        },
        {
            title: "Responsible Tourism",
            description: "Eco-conscious operations that protect nature and support local communities.",
            icon: faSeedling
        },
        {
            title: "Proven Track Record",
            description: "Hundreds of successful treks and satisfied global clients.",
            icon: faCircleCheck
        },
    ];
    
    return (
        <main>
            {/* Hero Section */}
            <section className="relative">
                <div 
                    className="flex items-center justify-center w-full h-[110vh] bg-fixed bg-center bg-no-repeat bg-cover" 
                    style={{ backgroundImage: `url(${HomeAssets.home_cover.src})` }}
                >
                    <div className="absolute w-full h-full bg-black/50"></div>
                </div>

                <div className="absolute z-10 flex flex-col items-center w-full px-5 transform -translate-x-1/2 -translate-y-1/2 md:mx-0 md:w-fit top-1/2 left-1/2">
                    <h1 className="text-3xl font-semibold text-center text-white md:text-4xl">Discover the World Beyond the Trails</h1>
                    <p className="mt-4 text-center text-white text-md md:text-lg">Unforgettable treks. Untamed landscapes. Life-changing journeys.</p>
                    <div className={`relative duration-200 overflow-hidden w-full my-5`}>
                        <input
                            type="text"
                            placeholder="Search treks, destinations..."
                            className="w-full px-4 py-3 pr-10 rounded-full border-2 bg-white text-sm text-gray-800 focus:outline-none focus:border-primary-color-dark transition-colors"
                        />
                        <button className="absolute cursor-pointer right-1 top-1/2 transform -translate-y-1/2 bg-primary-color-dark text-white p-2 rounded-full h-10 w-10 hover:bg-primary-color transition-colors">
                            <FontAwesomeIcon icon={faRoute} className="w-3 h-3" />
                        </button>
                    </div>
                    <div className="w-full gap-5 md:w-fit md:flex">
                        <Link 
                            href="/destinations" 
                            className="block w-full px-6 py-3 mt-6 text-sm font-medium text-center text-white duration-200 rounded md:w-fit whitespace-nowrap md:text-md bg-primary-color-dark hover:bg-primary-color"
                        >
                            Explore Destinations
                        </Link>

                        <Link 
                            href="/contact" 
                            className="block w-full px-6 py-3 mt-6 text-sm font-medium text-center text-white duration-200 border-2 rounded whitespace-nowrap md:text-md md:w-fit border-primary-color-dark hover:bg-primary-color-dark"
                        >
                            Request Info
                        </Link>
                    </div>
                </div>

                <div className="absolute bottom-0 min-w-full">
                    <Image 
                        src={HomeAssets.hero_mountains.src} 
                        alt="Mountain silhouette" 
                        className="w-full"
                        width={1920}
                        height={200}
                        priority={false}
                    />
                </div>
            </section>

            {/* About Section */}
            <section className="py-10 bg-white">
                <div className="flex flex-col items-center px-5 mx-auto lg:p-10 lg:flex-row max-w-8xl">
                    <div className="flex-1">
                        <Image 
                            src={HomeAssets.home_about_image.src} 
                            className="w-full h-auto" 
                            alt="About Global Nepal Treks"
                            width={600}
                            height={400}
                        />
                    </div>
                    <div className="flex-1">
                        <h1 className="mt-5 font-semibold text-center uppercase text-primary-color-dark text-md md:text-left md:text-2xl">
                           who we are?
                        </h1>
                        <h2 className="mt-2 mb-8 text-3xl font-bold text-center md:text-left md:text-4xl">
                            Trekking and Tour Agency in Nepal
                        </h2>
                        <p className="mt-5 mb-4 text-sm font-medium text-center md:text-left md:text-md">
                            At Global Nepal Treks, we do more than organize trekking itineraries - we invite you to experience Nepal as our home. As a locally based trekking company in Nepal, we specialize in creating authentic, safe, and personalized trekking experiences led by experienced local guides who understand the mountains, the culture, and the people.
                            <br /><br />
                            From the legendary Everest Base Camp Trek, to the remote and culturally rich Upper Mustang Trek, and the scenic trails of the Annapurna Trekking region, every journey is carefully designed to match your pace, interests, and comfort. Whether you are a first-time trekker or an experienced adventurer, we ensure that each trek is well-planned, responsibly operated, and deeply rewarding.
                            <br /><br />
                            Our team takes pride in our local expertise, attention to safety, and genuine hospitality. We believe trekking in Nepal is not just about reaching a destination, but about meaningful connections - with nature, local communities, and fellow travelers. With Global Nepal Treks, you travel with people who care, gaining memories that last a lifetime and experiencing the Himalayas in a way that feels personal, trustworthy, and truly unforgettable.                        
                        </p>
                        <div className="container px-4 py-8 mx-auto md:py-10">
                            <div className="grid grid-cols-2 gap-6 py-6 border-t border-b border-gray-400 md:grid-cols-3 md:gap-8">
                                {stats.map((stat, index) => (
                                    <CountUp 
                                        key={index}
                                        start={stat.label === "Established" ? stat.number : 0} 
                                        end={stat.number} 
                                        duration={2}
                                        delay={index * 0.1}
                                        separator={stat.label === "Established" ? "" : ","}
                                        enableScrollSpy
                                        scrollSpyOnce
                                    >
                                        {({ countUpRef }) => (
                                            <div className="text-center">
                                                <div className="flex items-center justify-center">
                                                    <div className="flex items-baseline gap-1 mb-2">
                                                        <span 
                                                            ref={countUpRef} 
                                                            className="text-2xl font-semibold text-right sm:text-3xl md:text-4xl lg:text-5xl text-primary-color-dark"
                                                        />
                                                        <span className="text-xl font-bold sm:text-2xl md:text-3xl lg:text-4xl text-primary-color-dark">
                                                            {stat.symbol}
                                                        </span>
                                                    </div>
                                                </div>
                                                <p className="text-sm font-semibold sm:text-base md:text-lg lg:text-lg whitespace-nowrap">
                                                    {stat.label}
                                                </p>
                                            </div>
                                        )}
                                    </CountUp>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
                
                <div className="grid px-5 mx-auto mt-10 lg:grid-cols-4 md:grid-cols-2 max-w-8xl gap-x-10 gap-y-5">
                    <div className="p-5 border border-gray-400 rounded-md">
                        <FontAwesomeIcon icon={faPersonHiking} className="text-4xl text-primary-color-dark" />
                        <h3 className="mt-2 font-medium text-md">Custom Trek Planning</h3>
                        <p className="text-sm md:text-md">Tailor routes, difficulty levels, and schedules to your needs.</p>
                    </div>
                    <div className="p-5 border border-gray-400 rounded-md">
                        <FontAwesomeIcon icon={faRoute} className="text-4xl text-primary-color-dark" />
                        <h3 className="mt-2 font-medium text-md">Handpicked Trek Routes</h3>
                        <p className="text-sm md:text-md">From beginner-friendly trails to extreme high-altitude expeditions.</p>
                    </div>
                    <div className="p-5 border border-gray-400 rounded-md">
                        <FontAwesomeIcon icon={faShieldAlt} className="text-4xl text-primary-color-dark" />
                        <h3 className="mt-2 font-medium text-md">Safety First Approach</h3>
                        <p className="text-sm md:text-md">Emergency protocols, oxygen supply, satellite phones, and insurance support.</p>
                    </div>
                    <div className="p-5 border border-gray-400 rounded-md">
                        <FontAwesomeIcon icon={faLeaf} className="text-4xl text-primary-color-dark" />
                        <h3 className="mt-2 font-medium text-md">Eco-Friendly Travel</h3>
                        <p className="text-sm md:text-md">Sustainable and responsible travel practices for all trekkers.</p>
                    </div>
                </div>
            </section>

            {/* Activities Section */}
            <section className="relative bg-fixed bg-center bg-no-repeat bg-cover" style={{ backgroundImage: `url(${HomeAssets.annapurna_background.src})` }}>
                <div className="absolute w-full h-full bg-black/50"></div>
                
                <div className="relative z-10 px-10 py-20">
                    <div>
                        <h1 className="font-semibold text-center uppercase text-primary-color-dark text-md md:text-left md:text-2xl">
                            Adventure Awaits
                        </h1>
                        <h2 className="mt-2 mb-8 text-3xl font-bold text-center text-white md:text-left md:text-4xl">
                            Different Activities we offer
                        </h2>
                    </div>
                    <div className="grid grid-cols-1 gap-6 px-4 mx-auto mt-12 md:px-6 lg:px-8 max-w-8xl sm:grid-cols-2 lg:grid-cols-5">
                        {differentActivitiesWeOffer.map((activity, index) => (
                            <div key={index} className="relative overflow-hidden transition-all duration-300 bg-white rounded-md shadow-lg group hover:shadow-2xl hover:-translate-y-1">
                                <div className="relative h-48 overflow-hidden">
                                    <Image 
                                        src={activity.image} 
                                        alt={`${activity.title} in Nepal`} 
                                        className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
                                        width={300}
                                        height={200}
                                    />
                                    <div className="absolute inset-0 transition-opacity duration-300 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-70"></div>
                                    <div className="absolute bottom-4 left-4">
                                        <span className="inline-flex items-center px-3 py-1 text-xs font-semibold text-white rounded-full backdrop-blur-sm" style={{backgroundColor: activity.color}}>
                                            {activity.type}
                                        </span>
                                    </div>
                                </div>
                                <div className="p-5">
                                    <div className="flex items-center justify-between mb-2">
                                        <h3 className="text-xl font-bold text-gray-900 transition-colors duration-300 group-hover:text-primary-color-dark">{activity.title}</h3>
                                        <svg className="w-5 h-5 transition-opacity duration-300 opacity-0 text-primary-color-dark group-hover:opacity-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                                        </svg>
                                    </div>
                                    <p className="text-sm leading-relaxed text-gray-600">{activity.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Packages Section */}
            <section className="py-10 bg-white">
                <div className="px-4 mx-auto md:max-w-7xl sm:px-6 lg:px-8">
                    <div className="relative z-10 px-10 py-10">
                        <div>
                            <h1 className="font-semibold text-center uppercase text-primary-color-dark text-md md:text-2xl">
                                Explore your Adventure
                            </h1>
                            <h2 className="mt-2 mb-8 text-3xl font-bold text-center md:text-4xl">
                                Awesome Packages For You
                            </h2>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {packageData.map((data, index) => (
                            <PackageCard key={index} packageDetails={data} />
                        ))}
                    </div>
                    <div className="flex justify-center mt-8 sm:mt-12 md:mt-16">
                        <Link 
                            href="/trekking-packages" 
                            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold tracking-wide transition duration-200 rounded-md group sm:text-base text-primary-color-dark hover:text-secondary-color"
                        >
                            See More
                            <FontAwesomeIcon 
                                icon={faArrowRight} 
                                className="transition-transform duration-200 group-hover:translate-x-1" 
                            />
                        </Link>
                    </div>
                </div>
            </section>

            {/* Why Choose Us Section */}
            <section className="pb-24 pt-14 bg-dark-section">
                <div className="mx-auto max-w-7xl">
                    <div className="relative z-10 px-10 py-10">
                        <div>
                            <h1 className="font-semibold text-center uppercase text-primary-color-dark text-md md:text-2xl">
                                Why Choose Us?
                            </h1>
                            <h2 className="mt-2 mb-8 text-3xl font-bold text-center md:text-4xl">
                                Expert Guidance with Thrilling Adventures
                            </h2>
                        </div>
                    </div>

                    <div className="grid gap-6 mx-5 md:grid-cols-2 lg:grid-cols-3">
                        {whyChooseUs.map((point, index) => (
                            <div key={index} className="flex items-center gap-5 p-5 border rounded-md border-primary-color">
                                <div>
                                    <FontAwesomeIcon icon={point.icon} className="text-4xl text-primary-color-dark" />
                                </div>
                                <div>
                                    <h3 className="mb-2 font-semibold text-md">{point.title}</h3>
                                    <p className="text-sm md:text-md">{point.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>  

            {/* CTA Section */}
            <section className="relative bg-fixed bg-center bg-no-repeat bg-cover" style={{ backgroundImage: `url(${HomeAssets.guides_background.src})` }}>
                <div className="absolute w-full h-full bg-black/60"></div>
                <div className="px-4 py-40 mx-auto md:max-w-7xl sm:px-6 lg:px-8">
                    <div className="relative z-10 max-w-3xl">
                        <h1 className="mb-5 text-5xl font-semibold text-white">
                            Enhance your trekking skills with our expert guides
                        </h1>
                        <p className="text-white ">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo.
                        </p>
                        <Link 
                            href="/contact" 
                            className="inline-block w-full px-6 py-3 mt-6 text-sm font-medium text-center text-white duration-200 border-2 rounded whitespace-nowrap md:text-md md:w-fit border-primary-color-dark hover:bg-primary-color-dark"
                        >
                            Request Info
                        </Link>
                    </div>
                </div>
            </section>          

            {/* Nepal Treks Section */}
            <section className="py-10 bg-white">
                <div className="px-4 mx-auto md:max-w-7xl sm:px-6 lg:px-8">
                    <div className="relative z-10 px-10 py-10">
                        <div>
                            <h1 className="font-semibold text-center uppercase text-primary-color-dark text-md md:text-2xl">
                                Adventure Packages in Nepal
                            </h1>
                            <h2 className="mt-2 mb-8 text-3xl font-bold text-center md:text-4xl">
                                Top Destinations for Trekking in Nepal
                            </h2>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {trekkingInNepal.map((destination, index) => (
                            <PackageCard key={index} packageDetails={destination} />
                        ))}
                    </div>
                    <div className="flex justify-center mt-8 sm:mt-12 md:mt-16">
                        <Link 
                            href="/trekking-packages" 
                            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold tracking-wide transition duration-200 rounded-md group sm:text-base text-primary-color-dark hover:text-secondary-color"
                        >
                            See More
                            <FontAwesomeIcon 
                                icon={faArrowRight} 
                                className="transition-transform duration-200 group-hover:translate-x-1" 
                            />
                        </Link>
                    </div>
                </div>
            </section>

            {/* Popular Routes Section */}
            <section className="py-10 bg-white">
                <div className="px-4 mx-auto md:max-w-7xl sm:px-6 lg:px-8">
                    <div className="relative z-10 px-4 py-6 text-center sm:px-6 lg:px-8">
                        <h1 className="text-sm font-semibold uppercase text-primary-color-dark sm:text-base md:text-lg lg:text-xl">
                            Adventure Packages in Nepal
                        </h1>
                        <h2 className="mt-2 mb-6 text-2xl font-bold sm:text-3xl md:text-4xl lg:mb-8">
                            Popular Trekking Routes in Nepal
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {trekkingInNepal.map((destination, index) => (
                            <PackageCard key={index} packageDetails={destination} />
                        ))}
                    </div>

                    <div className="flex justify-center mt-8 sm:mt-12 md:mt-16">
                        <Link 
                            href="/trekking-packages" 
                            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold tracking-wide transition duration-200 rounded-md group sm:text-base text-primary-color-dark hover:text-secondary-color"
                        >
                            See More
                            <FontAwesomeIcon 
                                icon={faArrowRight} 
                                className="transition-transform duration-200 group-hover:translate-x-1" 
                            />
                        </Link>
                    </div>
                </div>
            </section>

            {/* Blog Section */}
            <section className="py-10 bg-dark-section sm:py-12 md:py-16">
                <div className="px-4 mx-auto md:max-w-7xl sm:px-6 lg:px-8">
                    <div className="relative z-10 px-4 py-6 text-center sm:px-6 lg:px-8">
                        <h1 className="text-sm font-semibold uppercase text-primary-color-dark sm:text-base md:text-lg lg:text-xl">
                            From the blogs
                        </h1>
                        <h2 className="mt-2 mb-6 text-2xl font-bold sm:text-3xl md:text-4xl lg:mb-8">
                            Stories, tips, and trekking insights.
                        </h2>
                    </div>
                    <div>
                        <Swiper
                            modules={[Navigation, Autoplay]}
                            spaceBetween={24}
                            slidesPerView={1}
                            centeredSlides={false}
                            loop={true}
                            autoplay={{
                                delay: 3000,
                                disableOnInteraction: false,
                                pauseOnMouseEnter: false,
                            }}
                            navigation={{
                                nextEl: '.swipe-button-next',
                                prevEl: '.swipe-button-prev',
                            }}
                            breakpoints={{
                                640: {
                                    slidesPerView: 1,
                                    centeredSlides: false,
                                    spaceBetween: 16,
                                },
                                768: {
                                    slidesPerView: 2,
                                    centeredSlides: false,
                                    spaceBetween: 20,
                                },
                                1024: {
                                    slidesPerView: 3,
                                    centeredSlides: false,
                                    spaceBetween: 24,
                                },
                                1280: {
                                    slidesPerView: 3,
                                    centeredSlides: true,
                                    spaceBetween: 24,
                                },
                            }}
                            speed={500}
                            grabCursor={true}
                            className="mySwiper"
                            onSwiper={(swiper) => {
                                swiperRef.current = swiper;
                            }}
                        >
                            <SwiperSlide>
                                <BlogCard blog={{image: HomeAssets.heli_tours.src, postedDate: "Feb 11, 2026", title: "Tackling Its Reputation as the 'World's Highest Garbage Dump'"}} />
                            </SwiperSlide>
                            <SwiperSlide>
                                <BlogCard blog={{image: HomeAssets.heli_tours.src, postedDate: "Feb 11, 2026", title: "Tackling Its Reputation as the 'World's Highest Garbage Dump'"}} />
                            </SwiperSlide>
                            <SwiperSlide>
                                <BlogCard blog={{image: HomeAssets.heli_tours.src, postedDate: "Feb 11, 2026", title: "Tackling Its Reputation as the 'World's Highest Garbage Dump'"}} />
                            </SwiperSlide>
                            <SwiperSlide>
                                <BlogCard blog={{image: HomeAssets.heli_tours.src, postedDate: "Feb 11, 2026", title: "Tackling Its Reputation as the 'World's Highest Garbage Dump'"}} />
                            </SwiperSlide>
                            
                            <div className="swipe-button-prev bg-secondary-color absolute top-1/2 transform-[translateY(-50%)] left-0 z-10 h-[50px] w-[50px] ml-2.5 text-white rounded-full flex items-center justify-center cursor-pointer duration-200 hover:bg-primary-color-dark">
                                <FontAwesomeIcon icon={faChevronLeft} />
                            </div>

                            <div className="swipe-button-next bg-secondary-color absolute top-1/2 transform-[translateY(-50%)] right-0 z-10 h-[50px] w-[50px] mr-2.5 text-white rounded-full flex items-center justify-center cursor-pointer duration-200 hover:bg-primary-color-dark">
                                <FontAwesomeIcon icon={faChevronRight} />
                            </div>
                        </Swiper>
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section className="py-10 bg-white sm:py-12 md:py-16">
                <div className="relative flex flex-col items-center px-4 mx-auto max-w-7xl sm:px-6 lg:px-8 md:flex-row">
                    
                    {/* Left Section - Header */}
                    <div className="w-full py-6 my-auto text-center md:w-1/3 md:text-left md:py-10">
                        <h1 className="text-sm font-semibold uppercase text-primary-color-dark sm:text-base md:text-lg lg:text-xl">
                            Testimonial
                        </h1>
                        <h2 className="mt-2 mb-4 text-2xl font-bold sm:text-3xl md:text-4xl lg:mb-6">
                            Feedbacks & Reviews
                        </h2>
                        <div className="flex justify-center gap-1 md:justify-start text-primary-color">
                            <FontAwesomeIcon icon={faStar} />
                            <FontAwesomeIcon icon={faStar} />
                            <FontAwesomeIcon icon={faStar} />
                            <FontAwesomeIcon icon={faStar} />
                            <FontAwesomeIcon icon={faStarHalfStroke} />
                        </div>
                    </div>

                    {/* Vertical Divider with Quote Icon */}
                    <div className="relative flex items-center justify-center w-full my-4 md:w-auto md:my-0 md:mx-8 lg:mx-10">
                        <div className="absolute z-10 flex items-center justify-center w-10 h-10 rounded-full sm:w-12 sm:h-12 md:w-14 md:h-14 bg-primary-color">
                            <FontAwesomeIcon icon={faQuoteLeft} className="text-sm text-white sm:text-base md:text-xl lg:text-2xl" />
                        </div>
                        <div className="w-full h-0.5 md:w-0.5 md:h-32 lg:h-40 bg-gray-400"></div>
                    </div>

                    {/* Right Section - Swiper */}
                    <div className="w-full md:w-2/3">
                        <Swiper
                            modules={[Autoplay]}
                            slidesPerView={1}
                            loop={true}
                            autoplay={{
                                delay: 3000,
                                disableOnInteraction: false,
                            }}
                            pagination={{
                                clickable: true,
                            }}
                            speed={500}
                            grabCursor={true}
                            className="pb-8 mySwiper md:pb-10"
                        >
                            {/* Slide 1 */}
                            <SwiperSlide>
                                <div className="p-4 transition-colors duration-300 bg-white border border-gray-200 rounded-lg sm:p-5 md:p-6 hover:border-primary-color">
                                    <div className="flex flex-col items-center text-center">
                                        <Image 
                                            src="https://globalnepaltreks.com/storage/testimonials/February2024/sergi%2078-cropped.jpg" 
                                            className="object-cover w-16 h-16 mb-3 rounded-full sm:w-20 sm:h-20 md:w-24 md:h-24"
                                            width={96}
                                            height={96}
                                            alt="Sergi Barrantes"
                                        />
                                        <h2 className="mb-2 text-base font-semibold sm:text-lg md:text-xl lg:mb-4">
                                            Sergi Barrantes
                                        </h2>
                                        <p className="text-sm text-gray-700 sm:text-base md:text-lg">
                                            We were really very satisfied with the trekking and the organisation. The guide and porter were very friendly and considerate. I really recommend Global Nepal Treks.
                                        </p>
                                    </div>
                                </div>
                            </SwiperSlide>

                            {/* Slide 2 */}
                            <SwiperSlide>
                                <div className="p-4 transition-colors duration-300 bg-white border border-gray-200 rounded-lg sm:p-5 md:p-6 hover:border-primary-color">
                                    <div className="flex flex-col items-center text-center">
                                        <Image 
                                            src="https://globalnepaltreks.com/storage/testimonials/February2024/sergi%2078-cropped.jpg" 
                                            className="object-cover w-16 h-16 mb-3 rounded-full sm:w-20 sm:h-20 md:w-24 md:h-24"
                                            width={96}
                                            height={96}
                                            alt="Sergi Barrantes"
                                        />
                                        <h2 className="mb-2 text-base font-semibold sm:text-lg md:text-xl lg:mb-4">
                                            Sergi Barrantes
                                        </h2>
                                        <p className="text-sm text-gray-700 sm:text-base md:text-lg">
                                            We were really very satisfied with the trekking and the organisation. The guide and porter were very friendly and considerate. I really recommend Global Nepal Treks.
                                        </p>
                                    </div>
                                </div>
                            </SwiperSlide>
                        </Swiper>
                    </div>
                </div>
                
                {/* Review Platforms */}
                <div className="flex flex-col items-center gap-4 mx-auto my-10 sm:my-12 md:my-16 lg:my-20 sm:flex-row sm:gap-3 md:gap-4 lg:gap-5 w-fit">
                    <p className="text-sm text-center sm:text-base md:text-lg">
                        Read reviews on
                    </p>
                    
                    <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-3 md:gap-4 lg:gap-5">
                        <div>
                            <Link 
                                href="https://www.tripadvisor.com/Attraction_Review-g293890-d17721412-Reviews-Global_Nepal_Treks-Kathmandu_Kathmandu_Valley_Bagmati_Zone_Central_Region.html" 
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <Image 
                                    src={logos.tripadvisor_logo} 
                                    className="h-auto w-[90px] md:w-[100px] lg:w-[120px] transition-transform hover:scale-105" 
                                    width={120}
                                    height={40}
                                    alt="TripAdvisor Logo" 
                                />
                            </Link>
                        </div>
                        
                        <div>
                            <Link 
                                href="https://www.trustpilot.com/review/globalnepaltreks.com" 
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <Image 
                                    src={logos.trustpilot_logo.src} 
                                    className="h-auto w-[80px] md:w-[90px] lg:w-[110px] transition-transform hover:scale-105" 
                                    width={110}
                                    height={40}
                                    alt="TrustPilot Logo" 
                                />
                            </Link>
                        </div>
                        
                        <div>
                            <Link 
                                href="https://share.google/RMUXb8GiXKvMVKJfD" 
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <Image 
                                    src={logos.google_logo.src} 
                                    className="h-auto w-[60px] sm:w-[65px] md:w-[70px] lg:w-[80px] transition-transform hover:scale-105" 
                                    width={80}
                                    height={40}
                                    alt="Google Logo" 
                                />
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}

export default Home;