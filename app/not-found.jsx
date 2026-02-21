"use client";

import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faMountain, 
  faCompass, 
  faArrowLeft, 
  faMapMarkedAlt, 
  faRoute
} from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";

export default function NotFound() {
  const [mountainHeight, setMountainHeight] = useState("200px");

  // Fun fact rotation
  const trekkingFacts = [
    "Mount Everest grows about 4mm taller every year!",
    "The word 'trek' comes from South African Dutch meaning 'to pull' or 'journey'.",
    "Annapurna I was the first 8000m peak ever climbed.",
    "There are 14 peaks in the world over 8000 meters.",
    "The Himalayas span 5 countries: Nepal, India, Bhutan, China, and Pakistan.",
    "Sherpas can carry up to twice their body weight at high altitudes."
  ];

  const [currentFact, setCurrentFact] = useState(trekkingFacts[0]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFact(prev => {
        const currentIndex = trekkingFacts.indexOf(prev);
        const nextIndex = (currentIndex + 1) % trekkingFacts.length;
        return trekkingFacts[nextIndex];
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Parallax effect on mountain
  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY;
      const newHeight = 200 + scrolled * 0.3;
      setMountainHeight(`${Math.min(newHeight, 400)}px`);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-linear-to-b from-sky-100 to-white dark:from-gray-900 dark:to-gray-800 overflow-hidden relative pt-20 md:pt-24">
      <div className="relative z-10 container mx-auto px-4 py-8 md:py-12 flex flex-col items-center justify-center min-h-[calc(100vh-80px)]">
        
        <div className="relative mb-6 md:mb-8 text-center">
          
          <div className="flex flex-col items-center mt-20 justify-center">
            <div className="relative w-56 md:w-72 lg:w-96 h-36 md:h-44 mb-3">
              <svg 
                viewBox="0 0 400 200" 
                className="w-full h-full"
                style={{ filter: 'drop-shadow(0 10px 8px rgb(0 0 0 / 0.1))' }}
              >
                <polygon 
                  points="50,200 150,50 250,200" 
                  className="fill-gray-400 dark:fill-gray-600"
                  style={{ filter: 'drop-shadow(0 4px 2px rgb(0 0 0 / 0.1))' }}
                />
                <polygon 
                  points="150,200 250,30 350,200" 
                  className="fill-gray-500 dark:fill-gray-500"
                  style={{ filter: 'drop-shadow(0 6px 3px rgb(0 0 0 / 0.15))' }}
                />
                <polygon 
                  points="250,200 330,80 380,200" 
                  className="fill-gray-600 dark:fill-gray-400"
                  style={{ filter: 'drop-shadow(0 8px 4px rgb(0 0 0 / 0.2))' }}
                />
                <circle cx="250" cy="35" r="15" className="fill-white dark:fill-gray-200" />
                <circle cx="330" cy="85" r="10" className="fill-white dark:fill-gray-200" />
                <circle cx="150" cy="55" r="12" className="fill-white dark:fill-gray-200" />
              </svg>
              
            </div>
            <div className="text-7xl md:text-8xl lg:text-9xl font-bold text-gray-800 dark:text-white opacity-10 select-none">
                404
            </div>

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 dark:text-white mb-2 font-montserrat">
              Trail Not Found
            </h1>
            
            <p className="text-base md:text-lg text-gray-600 dark:text-gray-300 max-w-xl text-center px-4">
              Looks like this path doesn't exist on our map. Even the best trekkers sometimes take a wrong turn!
            </p>
          </div>
        </div>

        {/* Fun Fact Card - More Compact */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 md:p-5 mb-6 max-w-md transform hover:scale-105 transition-transform duration-300 mx-4">
          <div className="flex items-start gap-3">
            <div className="bg-primary-color-dark text-white rounded-full p-2 shrink-0">
              <FontAwesomeIcon icon={faMountain} className="w-4 h-4 md:w-5 md:h-5" />
            </div>
            <div>
              <p className="text-xs text-primary-color-dark font-semibold mb-1">
                Trekker's Trivia
              </p>
              <p className="text-sm text-gray-700 dark:text-gray-300 font-medium animate-fade">
                {currentFact}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 md:gap-4 max-w-2xl w-full mb-8 px-4">
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

        <div className="w-full max-w-md px-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search treks, destinations..."
              className="w-full px-4 py-3 pr-10 rounded-full border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-gray-800 dark:text-white focus:outline-none focus:border-primary-color-dark transition-colors"
            />
            <button className="absolute right-1 top-1/2 transform -translate-y-1/2 bg-primary-color-dark text-white p-2 rounded-full h-10 w-10 hover:bg-primary-color transition-colors">
              <FontAwesomeIcon icon={faRoute} className="w-3 h-3" />
            </button>
          </div>
          <p className="text-center text-xs text-gray-500 mt-3">
            Lost? Let's find you the right path
          </p>
        </div>
      </div>
    </div>
  );
}