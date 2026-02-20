import { faCalendar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const BlogCard = ({blog}) => {
    return (
        <div className="overflow-hidden duration-200 bg-white border border-gray-200 rounded-lg hover:shadow-lg">
            <div className="relative h-48 overflow-hidden sm:h-56 md:h-60">
                <img
                    src={blog.image}
                    alt="Mount Kailash Tour"
                    className="object-cover w-full h-full transition-transform duration-300 hover:scale-105"
                    loading="lazy"
                />
            </div>

            <div className="p-4 sm:p-5 md:p-6">

                <h3 className="mb-5 font-bold text-gray-900 text-md sm:text-lg md:text-xl">
                    {blog.title}
                </h3>

                <div className="flex items-center gap-1 text-xs text-gray-500 sm:text-sm sm:gap-2">
                    <FontAwesomeIcon icon={faCalendar} className="text-primary-color-dark" />
                    <span className="whitespace-nowrap">{blog.postedDate || "All Year"}</span>
                </div>
            </div>
        </div>
    )
}

export default BlogCard;