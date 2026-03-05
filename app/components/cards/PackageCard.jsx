import { faArrowRight, faCalendar, faClock, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";

const PackageCard = ({ packageDetails }) => {
    return (
        <Link href={packageDetails.link} className="overflow-hidden duration-200 bg-white border border-gray-200 rounded-lg hover:shadow-md">
            <div className="relative h-48 overflow-hidden sm:h-56 md:h-60">
                <img
                    src={packageDetails.image}
                    alt="Mount Kailash Tour"
                    className="object-cover w-full h-full transition-transform duration-300 hover:scale-105"
                    loading="lazy"
                />
            </div>

            <div className="p-4 sm:p-5 md:p-6">
                <p className="text-xs font-semibold tracking-wide uppercase sm:text-sm text-lime-700">
                    {packageDetails.country}
                </p>

                <h3 className="mt-1 text-lg font-bold text-gray-900 sm:text-xl md:text-2xl">
                    {packageDetails.title}
                </h3>

                <div className="flex items-center gap-4 my-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                        <FontAwesomeIcon icon={faClock} className="w-4 h-4 text-primary-color-dark" />
                        {packageDetails.duration}
                    </span>
                </div>

                {/* Price and CTA */}
                <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
                    <div>
                        <span className="text-2xl font-bold text-primary-color-dark">
                            ${packageDetails.price}
                        </span>
                        <span className="text-sm text-gray-500 ml-1">/person</span>
                    </div>
                    <span className="text-primary-color-dark group-hover:translate-x-1 transition-transform">
                        <FontAwesomeIcon icon={faArrowRight} className="w-4 h-4" />
                    </span>
                </div>

                {
                    packageDetails.description && (
                        <div>
                            <div className="h-px my-5 bg-gray-200" />

                            <p className="text-sm leading-relaxed text-gray-600">
                                {packageDetails.description}
                            </p>
                        </div>
                    )
                }
            </div>
        </Link>
    )
}

export default PackageCard;