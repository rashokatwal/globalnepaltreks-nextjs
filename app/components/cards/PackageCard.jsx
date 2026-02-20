import { faCalendar, faClock } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const PackageCard = ({ packageDetails }) => {
    return (
        <div className="overflow-hidden duration-200 bg-white border border-gray-200 rounded-lg hover:shadow-lg">
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

                <div className="grid grid-cols-2 gap-3 mt-4 sm:grid-cols-3 sm:gap-4">
                    <div>
                        <h5 className="text-xs text-gray-500 sm:text-sm">Starting from</h5>
                        <p className="text-base font-semibold sm:text-lg md:text-xl text-accent-color">
                            US${packageDetails.price}
                        </p>
                    </div>
                    
                    <div className="flex items-center gap-1 text-xs text-gray-500 sm:text-sm sm:gap-2">
                        <FontAwesomeIcon icon={faCalendar} className="text-primary-color-dark" />
                        <span className="whitespace-nowrap">{packageDetails.availability || "All Year"}</span>
                    </div>

                    <div className="flex items-center gap-1 text-xs text-gray-500 sm:text-sm sm:gap-2">
                        <FontAwesomeIcon icon={faClock} className="text-primary-color-dark" />
                        <span>{packageDetails.duration}</span>
                    </div>
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

                <button className="w-full py-2.5 mt-5 text-sm font-semibold tracking-wide text-white transition rounded-md sm:py-3 sm:text-base bg-primary-color-dark hover:bg-primary-color hover:shadow-md">
                    BOOK NOW
                </button>
            </div>
        </div>
    )
}

export default PackageCard;