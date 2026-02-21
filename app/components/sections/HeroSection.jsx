import { homeAssets } from "@/app/assets/assets";

import BreadCrumbs from "../ui/BreadCrumbs";

const HeroSection = ({image, heading, subheading, className}) => {
    
    return (
        <section 
            className={`relative h-screen flex flex-col items-center justify-center bg-fixed bg-center bg-cover overflow-hidden ${className}`} 
            style={{backgroundImage: `url(${image})`}}
        >
            <div className="absolute inset-0 bg-black/60" />

            <div className="relative z-10 max-w-5xl px-4 mb-5 mx-auto text-center sm:px-6 lg:px-8">

                <h1 className="mb-6 text-3xl font-semibold text-white drop-shadow-2xl md:text-4xl">
                    {heading}
                </h1>
                <div className="flex justify-center mb-6">
                    <div className="w-20 h-1 rounded-full bg-primary-color" />
                </div>
                
                <p className="max-w-3xl mx-auto text-md text-gray-200 drop-shadow-lg md:text-lg">
                    {subheading}
                </p>
            </div>

            <BreadCrumbs />
            
            <div className="absolute bottom-0 min-w-full">
                <img src={homeAssets.hero_mountains.src} alt="wave" className="w-full" />
            </div>
        </section>
    )
}

export default HeroSection;