import { HomeAssets } from "../../assets/assets";
import BreadCrumbs from "../BreadCrumbs";

const HeroSection = ({image, heading, subheading, className}) => {
    
    return (
        <section 
            className={`relative h-[90vh] flex flex-col items-center justify-center bg-fixed bg-center bg-cover overflow-hidden ${className}`} 
            style={{backgroundImage: `url(${image})`}}
        >
            <div className="absolute inset-0 bg-linear-to-b from-black/60 via-black/40 to-black/70" />

            <div className="relative z-10 max-w-5xl px-4 mx-auto text-center sm:px-6 lg:px-8">

                <h1 className="mb-6 text-3xl font-bold text-white drop-shadow-2xl sm:text-4xl md:text-5xl lg:text-6xl">
                    {heading}
                </h1>
                <div className="flex justify-center mb-6">
                    <div className="w-20 h-1 rounded-full bg-primary-color" />
                </div>
                
                <p className="max-w-3xl mx-auto text-lg text-gray-200 drop-shadow-lg sm:text-xl md:text-2xl">
                    {subheading}
                </p>
            </div>

            <BreadCrumbs />
            
            <div className="absolute bottom-0 min-w-full">
                <img src={HomeAssets.hero_mountains} alt="wave" className="w-full" />
            </div>
        </section>
    )
}

export default HeroSection;