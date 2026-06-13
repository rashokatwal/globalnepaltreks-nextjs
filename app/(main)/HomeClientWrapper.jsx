"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faChevronLeft, 
  faChevronRight, 
  faQuoteLeft, 
  faStar, 
  faStarHalfStroke,
  faArrowRight
} from "@fortawesome/free-solid-svg-icons";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation } from "swiper/modules";
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';
import Link from "next/link";
import Image from "next/image";
import { useRef } from "react";
import Heading from "../components/ui/Heading";
import BlogCard from "../components/cards/BlogCard";

export default function HomeClientWrapper({ reviews = [], logos = {}, blogs = [], type = "testimonials" }) {
  const swiperRef = useRef(null);

  if (type === "testimonials") {
    // Ensure reviews is an array
    const reviewsArray = Array.isArray(reviews) ? reviews : [];
    
    return (
      <>
        <section className="py-10 bg-white sm:py-12 md:py-16">
          <div className="relative flex flex-col items-center px-4 mx-auto max-w-7xl sm:px-6 lg:px-8 md:flex-row">
            
            <div className="w-full py-6 my-auto text-center md:w-1/3 md:text-left md:py-10">
              <Heading title={"Testimonial"} subtitle={"Feedbacks & Reviews"} />
              <div className="flex justify-center gap-1 md:justify-start text-primary-color">
                <FontAwesomeIcon icon={faStar} />
                <FontAwesomeIcon icon={faStar} />
                <FontAwesomeIcon icon={faStar} />
                <FontAwesomeIcon icon={faStar} />
                <FontAwesomeIcon icon={faStarHalfStroke} />
              </div>
            </div>

            <div className="relative flex items-center justify-center w-full my-4 md:w-auto md:my-0 md:mx-8 lg:mx-10">
              <div className="absolute z-10 flex items-center justify-center w-10 h-10 rounded-full sm:w-12 sm:h-12 md:w-14 md:h-14 bg-accent-color">
                <FontAwesomeIcon icon={faQuoteLeft} className="text-sm text-white sm:text-base md:text-xl lg:text-2xl" />
              </div>
              <div className="w-full h-0.5 md:w-0.5 md:h-32 lg:h-40 bg-gray-400"></div>
            </div>

            <div className="w-full md:w-2/3">
              {reviewsArray.length > 0 ? (
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
                  {reviewsArray.map((review) => (
                    <SwiperSlide key={review.id}>
                      <div className="p-4 transition-colors duration-300 bg-white border border-gray-200 rounded-lg sm:p-5 md:p-6 hover:border-primary-color">
                        <div className="flex flex-col items-center text-center">
                          {review.reviewer_image ? (
                            <Image 
                              src={review.reviewer_image}
                              className="object-cover w-16 h-16 mb-3 rounded-full sm:w-20 sm:h-20 md:w-24 md:h-24"
                              width={96}
                              height={96}
                              alt={review.reviewer_name}
                            />
                          ) : (
                            <div className="flex items-center justify-center w-16 h-16 mb-3 rounded-full sm:w-20 sm:h-20 md:w-24 md:h-24 bg-gray-300 text-gray-600 text-2xl font-bold">
                              {review.reviewer_name?.charAt(0) || '?'}
                            </div>
                          )}
                          <h2 className="mb-2 text-base font-semibold sm:text-lg md:text-xl lg:mb-4">
                            {review.reviewer_name}
                            {review.reviewer_country && <span className="text-sm font-normal text-gray-500">, {review.reviewer_country}</span>}
                          </h2>
                          <p className="text-sm text-gray-700 sm:text-base md:text-lg">
                            {review.review_text?.length > 250 
                              ? `${review.review_text.substring(0, 250)}...` 
                              : review.review_text}
                          </p>
                        </div>
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
              ) : (
                <p className="py-12 text-center text-gray-500">No reviews yet.</p>
              )}
            </div>
          </div>
          
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
                    className="h-auto w-22.5 md:w-25 lg:w-30 transition-transform hover:scale-105" 
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
                    src={logos.trustpilot_logo?.src || logos.trustpilot_logo} 
                    className="h-auto w-[80px] md:w-[90px] lg:w-[110px] transition-transform hover:scale-105" 
                    width={110}
                    height={40}
                    alt="TrustPilot Logo" 
                  />
                </Link>
              </div>
              <div>
                <Link 
                  href="https://share.google/HMk7ORFTwYiAe55zj" 
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Image 
                    src={logos.google_logo?.src || logos.google_logo} 
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
      </>
    );
  }

  if (type === "blogs") {
    // Ensure blogs is an array
    const blogsArray = Array.isArray(blogs) ? blogs : [];
    
    return (
      <section className="py-10 bg-white sm:py-12 md:py-16">
        <div className="px-4 mx-auto md:max-w-7xl sm:px-6 lg:px-8">
          <div className="relative z-10 px-4 py-6 text-center sm:px-6 lg:px-8">
            <Heading title={"From the blogs"} subtitle={"Stories, Tips and Trekking Insights"} titleClass={"text-center"} subtitleClass={"text-center"} />
          </div>
          {blogsArray.length > 0 && (
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
                {blogsArray.map((blog) => (
                  <SwiperSlide key={blog.id}>
                    <BlogCard blog={blog} />
                  </SwiperSlide>
                ))}
                <div className="swipe-button-prev bg-secondary-color absolute top-1/2 transform-[translateY(-50%)] left-0 z-10 h-[50px] w-[50px] ml-2.5 text-white rounded-full flex items-center justify-center cursor-pointer duration-200 hover:bg-primary-color-dark">
                  <FontAwesomeIcon icon={faChevronLeft} />
                </div>
                <div className="swipe-button-next bg-secondary-color absolute top-1/2 transform-[translateY(-50%)] right-0 z-10 h-[50px] w-[50px] mr-2.5 text-white rounded-full flex items-center justify-center cursor-pointer duration-200 hover:bg-primary-color-dark">
                  <FontAwesomeIcon icon={faChevronRight} />
                </div>
              </Swiper>
            </div>
          )}
          <div className="flex justify-center mt-8 sm:mt-12 md:mt-16">
            <Link 
              href="/blogs" 
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold tracking-wide transition duration-200 rounded-md group sm:text-base text-primary-color-dark hover:text-secondary-color"
            >
              More Blogs
              <FontAwesomeIcon 
                icon={faArrowRight} 
                className="transition-transform duration-200 group-hover:translate-x-1" 
              />
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return null;
}