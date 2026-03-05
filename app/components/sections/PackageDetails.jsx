// app/components/sections/PackageDetails.js
'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faCalendar, 
  faClock, 
  faUsers, 
  faMountain,
  faFlag,
  faMapMarkedAlt,
  faCheckCircle,
  faTimesCircle,
  faExclamationTriangle,
  faStar,
  faStarHalfAlt,
  faChevronLeft,
  faChevronRight,
  faDownload,
  faInfoCircle,
  faQuestionCircle,
  faFilePdf
} from '@fortawesome/free-solid-svg-icons';
import Heading from '../ui/Heading';
import PackageCard from '../cards/PackageCard';

export default function PackageDetails({ package: pkg }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedImage, setSelectedImage] = useState(0);
  const [showAllReviews, setShowAllReviews] = useState(false);

  // Tabs configuration
  const tabs = [
    { id: 'overview', label: 'Overview', icon: faInfoCircle },
    { id: 'itinerary', label: 'Itinerary', icon: faCalendar },
    { id: 'features', label: 'Inclusions', icon: faCheckCircle },
    { id: 'essentials', label: 'Essential Info', icon: faFlag },
    { id: 'dates', label: 'Dates & Prices', icon: faClock },
    { id: 'faq', label: 'FAQ', icon: faQuestionCircle },
    { id: 'reviews', label: 'Reviews', icon: faStar },
    { id: 'gallery', label: 'Gallery', icon: faMapMarkedAlt },
    { id: 'documents', label: 'Documents', icon: faFilePdf }
  ];

  // Helper function to format price
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  // Helper function to render difficulty badge
  const DifficultyBadge = ({ difficulty }) => {
    const colors = {
      easy: 'bg-green-100 text-green-800',
      moderate: 'bg-yellow-100 text-yellow-800',
      challenging: 'bg-orange-100 text-orange-800',
      difficult: 'bg-red-100 text-red-800'
    };
    
    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${colors[difficulty] || 'bg-gray-100 text-gray-800'}`}>
        {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
      </span>
    );
  };

  // Helper function to render star ratings
  const StarRating = ({ rating }) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    
    return (
      <div className="flex items-center gap-1">
        {[...Array(fullStars)].map((_, i) => (
          <FontAwesomeIcon key={i} icon={faStar} className="text-yellow-400 w-4 h-4" />
        ))}
        {hasHalfStar && <FontAwesomeIcon icon={faStarHalfAlt} className="text-yellow-400 w-4 h-4" />}
        {[...Array(emptyStars)].map((_, i) => (
          <FontAwesomeIcon key={i} icon={faStar} className="text-gray-300 w-4 h-4" />
        ))}
        <span className="ml-2 text-sm text-gray-600">({rating.toFixed(1)})</span>
      </div>
    );
  };

  // Calculate average rating
  const averageRating = pkg.reviews?.length 
    ? pkg.reviews.reduce((acc, r) => acc + r.rating, 0) / pkg.reviews.length 
    : 0;

  return (
    <div className="bg-white">
      {/* Package Header */}
      <section className="bg-gray-50 py-8 border-b">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-sm text-gray-500 capitalize">{pkg.country_name}</span>
                <span className="text-gray-300">•</span>
                <span className="text-sm text-gray-500">{pkg.activity_name}</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 font-montserrat mb-2">
                {pkg.title}
              </h1>
              {pkg.short_description && (
                <p className="text-lg text-gray-600 max-w-3xl">{pkg.short_description}</p>
              )}
            </div>
            
            <div className="flex flex-col items-end">
              <div className="text-3xl font-bold text-primary-color-dark">
                {formatPrice(pkg.price)}
              </div>
              <p className="text-sm text-gray-500">per person</p>
              <button className="mt-3 bg-primary-color-dark text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-color transition">
                Book Now
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Info Bar */}
      <section className="bg-white border-b py-4">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-wrap gap-6">
            <div className="flex items-center gap-2">
              <FontAwesomeIcon icon={faClock} className="w-5 h-5 text-primary-color-dark" />
              <div>
                <div className="text-sm text-gray-500">Duration</div>
                <div className="font-semibold">{pkg.duration_days} Days</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <FontAwesomeIcon icon={faMountain} className="w-5 h-5 text-primary-color-dark" />
              <div>
                <div className="text-sm text-gray-500">Max Altitude</div>
                <div className="font-semibold">{pkg.max_altitude?.toLocaleString()}m</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <FontAwesomeIcon icon={faUsers} className="w-5 h-5 text-primary-color-dark" />
              <div>
                <div className="text-sm text-gray-500">Group Size</div>
                <div className="font-semibold">{pkg.group_size_min}-{pkg.group_size_max} people</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <DifficultyBadge difficulty={pkg.difficulty} />
            </div>
            {pkg.stats && (
              <div className="flex items-center gap-2 ml-auto">
                <StarRating rating={averageRating} />
                <span className="text-sm text-gray-500">({pkg.reviews?.length || 0} reviews)</span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Tabs Navigation */}
      <section className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex overflow-x-auto no-scrollbar gap-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 font-medium text-sm transition border-b-2 whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-primary-color-dark text-primary-color-dark'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <FontAwesomeIcon icon={tab.icon} className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Tab Content */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="grid md:grid-cols-3 gap-8">
              <div className="md:col-span-2">
                <h2 className="text-2xl font-bold mb-4">Overview</h2>
                <div className="prose max-w-none text-gray-600">
                  {pkg.overview ? (
                    <div dangerouslySetInnerHTML={{ __html: pkg.overview }} />
                  ) : (
                    <p>No overview available.</p>
                  )}
                </div>
                
                {pkg.highlights && (
                  <div className="mt-8">
                    <h3 className="text-xl font-bold mb-4">Highlights</h3>
                    <div className="bg-gray-50 p-6 rounded-lg">
                      <div className="whitespace-pre-line text-gray-700">
                        {pkg.highlights}
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="md:col-span-1">
                <div className="bg-gray-50 p-6 rounded-lg sticky top-24">
                  <h3 className="font-bold mb-4">Trip Facts</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Country:</span>
                      <span className="font-medium capitalize">{pkg.country_name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Activity:</span>
                      <span className="font-medium">{pkg.activity_name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Duration:</span>
                      <span className="font-medium">{pkg.duration_days} days</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Difficulty:</span>
                      <span className="font-medium capitalize">{pkg.difficulty}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Max Altitude:</span>
                      <span className="font-medium">{pkg.max_altitude?.toLocaleString()}m</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Group Size:</span>
                      <span className="font-medium">{pkg.group_size_min}-{pkg.group_size_max}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Best Season:</span>
                      <span className="font-medium">{pkg.best_season}</span>
                    </div>
                    <div className="pt-3 border-t">
                      <div className="flex justify-between font-bold">
                        <span>Price:</span>
                        <span className="text-primary-color-dark">{formatPrice(pkg.price)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Itinerary Tab */}
          {activeTab === 'itinerary' && (
            <div>
              <h2 className="text-2xl font-bold mb-8">Day-by-Day Itinerary</h2>
              {pkg.itinerary && pkg.itinerary.length > 0 ? (
                <div className="space-y-4">
                  {pkg.itinerary.map((day) => (
                    <div key={day.id} className="bg-gray-50 rounded-lg p-6">
                      <div className="flex flex-wrap gap-4 mb-4">
                        <span className="bg-primary-color-dark text-white px-4 py-1 rounded-full text-sm font-semibold">
                          Day {day.day_number}
                        </span>
                        {day.altitude && (
                          <span className="text-sm text-gray-600">
                            Altitude: {day.altitude}m
                          </span>
                        )}
                        {day.trekking_hours && (
                          <span className="text-sm text-gray-600">
                            Trekking: {day.trekking_hours} hrs
                          </span>
                        )}
                        {day.distance_km && (
                          <span className="text-sm text-gray-600">
                            Distance: {day.distance_km}km
                          </span>
                        )}
                      </div>
                      <h3 className="text-xl font-bold mb-2">{day.title}</h3>
                      <p className="text-gray-600 mb-4">{day.description}</p>
                      <div className="flex flex-wrap gap-4 text-sm">
                        {day.accommodation && (
                          <span className="text-gray-500">🏠 {day.accommodation}</span>
                        )}
                        {day.meal_info && (
                          <span className="text-gray-500">🍽️ {day.meal_info}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No itinerary available.</p>
              )}
            </div>
          )}

          {/* Features Tab */}
          {activeTab === 'features' && pkg.features && (
            <div>
              <h2 className="text-2xl font-bold mb-8">What's Included</h2>
              
              {/* Included */}
              {pkg.features.filter(f => f.feature_type === 'included').length > 0 && (
                <div className="mb-8">
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <FontAwesomeIcon icon={faCheckCircle} className="text-green-600" />
                    Included
                  </h3>
                  <div className="grid md:grid-cols-2 gap-3">
                    {pkg.features
                      .filter(f => f.feature_type === 'included')
                      .sort((a, b) => a.sort_order - b.sort_order)
                      .map((feature) => (
                        <div key={feature.id} className="flex items-start gap-2">
                          <FontAwesomeIcon icon={faCheckCircle} className="text-green-600 w-4 h-4 mt-1 flex-shrink-0" />
                          <span className="text-gray-700">{feature.description}</span>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {/* Excluded */}
              {pkg.features.filter(f => f.feature_type === 'excluded').length > 0 && (
                <div className="mb-8">
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <FontAwesomeIcon icon={faTimesCircle} className="text-red-600" />
                    Excluded
                  </h3>
                  <div className="grid md:grid-cols-2 gap-3">
                    {pkg.features
                      .filter(f => f.feature_type === 'excluded')
                      .sort((a, b) => a.sort_order - b.sort_order)
                      .map((feature) => (
                        <div key={feature.id} className="flex items-start gap-2">
                          <FontAwesomeIcon icon={faTimesCircle} className="text-red-600 w-4 h-4 mt-1 flex-shrink-0" />
                          <span className="text-gray-700">{feature.description}</span>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {/* Not Suitable */}
              {pkg.features.filter(f => f.feature_type === 'not_suitable').length > 0 && (
                <div>
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <FontAwesomeIcon icon={faExclamationTriangle} className="text-orange-600" />
                    Not Suitable For
                  </h3>
                  <div className="grid md:grid-cols-2 gap-3">
                    {pkg.features
                      .filter(f => f.feature_type === 'not_suitable')
                      .sort((a, b) => a.sort_order - b.sort_order)
                      .map((feature) => (
                        <div key={feature.id} className="flex items-start gap-2">
                          <FontAwesomeIcon icon={faExclamationTriangle} className="text-orange-600 w-4 h-4 mt-1 flex-shrink-0" />
                          <span className="text-gray-700">{feature.description}</span>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Essential Info Tab */}
          {activeTab === 'essentials' && pkg.essential_info && (
            <div>
              <h2 className="text-2xl font-bold mb-8">Essential Information</h2>
              <div className="bg-gray-50 p-8 rounded-lg">
                <dl className="divide-y">
                  {pkg.essential_info.trip_code && (
                    <div className="py-4 grid md:grid-cols-3 gap-4">
                      <dt className="font-medium">Trip Code:</dt>
                      <dd className="md:col-span-2 text-gray-700">{pkg.essential_info.trip_code}</dd>
                    </div>
                  )}
                  {pkg.essential_info.trip_type && (
                    <div className="py-4 grid md:grid-cols-3 gap-4">
                      <dt className="font-medium">Trip Type:</dt>
                      <dd className="md:col-span-2 text-gray-700">{pkg.essential_info.trip_type}</dd>
                    </div>
                  )}
                  {pkg.essential_info.accommodation_type && (
                    <div className="py-4 grid md:grid-cols-3 gap-4">
                      <dt className="font-medium">Accommodation:</dt>
                      <dd className="md:col-span-2 text-gray-700">{pkg.essential_info.accommodation_type}</dd>
                    </div>
                  )}
                  {pkg.essential_info.meal_included && (
                    <div className="py-4 grid md:grid-cols-3 gap-4">
                      <dt className="font-medium">Meals:</dt>
                      <dd className="md:col-span-2 text-gray-700">{pkg.essential_info.meal_included}</dd>
                    </div>
                  )}
                  {pkg.essential_info.transportation && (
                    <div className="py-4 grid md:grid-cols-3 gap-4">
                      <dt className="font-medium">Transportation:</dt>
                      <dd className="md:col-span-2 text-gray-700">{pkg.essential_info.transportation}</dd>
                    </div>
                  )}
                  {pkg.essential_info.best_time_description && (
                    <div className="py-4 grid md:grid-cols-3 gap-4">
                      <dt className="font-medium">Best Time:</dt>
                      <dd className="md:col-span-2 text-gray-700">{pkg.essential_info.best_time_description}</dd>
                    </div>
                  )}
                  {pkg.essential_info.difficulty_description && (
                    <div className="py-4 grid md:grid-cols-3 gap-4">
                      <dt className="font-medium">Difficulty:</dt>
                      <dd className="md:col-span-2 text-gray-700">{pkg.essential_info.difficulty_description}</dd>
                    </div>
                  )}
                  {pkg.essential_info.fitness_requirements && (
                    <div className="py-4 grid md:grid-cols-3 gap-4">
                      <dt className="font-medium">Fitness Requirements:</dt>
                      <dd className="md:col-span-2 text-gray-700">{pkg.essential_info.fitness_requirements}</dd>
                    </div>
                  )}
                  {pkg.essential_info.equipment_list && (
                    <div className="py-4 grid md:grid-cols-3 gap-4">
                      <dt className="font-medium">Equipment:</dt>
                      <dd className="md:col-span-2 whitespace-pre-line text-gray-700">{pkg.essential_info.equipment_list}</dd>
                    </div>
                  )}
                  {pkg.essential_info.health_considerations && (
                    <div className="py-4 grid md:grid-cols-3 gap-4">
                      <dt className="font-medium">Health:</dt>
                      <dd className="md:col-span-2 text-gray-700">{pkg.essential_info.health_considerations}</dd>
                    </div>
                  )}
                  {pkg.essential_info.safety_measures && (
                    <div className="py-4 grid md:grid-cols-3 gap-4">
                      <dt className="font-medium">Safety:</dt>
                      <dd className="md:col-span-2 text-gray-700">{pkg.essential_info.safety_measures}</dd>
                    </div>
                  )}
                  {pkg.essential_info.permits_required && (
                    <div className="py-4 grid md:grid-cols-3 gap-4">
                      <dt className="font-medium">Permits:</dt>
                      <dd className="md:col-span-2 text-gray-700">{pkg.essential_info.permits_required}</dd>
                    </div>
                  )}
                  {pkg.essential_info.permit_cost && (
                    <div className="py-4 grid md:grid-cols-3 gap-4">
                      <dt className="font-medium">Permit Cost:</dt>
                      <dd className="md:col-span-2 text-gray-700">${pkg.essential_info.permit_cost}</dd>
                    </div>
                  )}
                  {pkg.essential_info.cultural_etiquette && (
                    <div className="py-4 grid md:grid-cols-3 gap-4">
                      <dt className="font-medium">Cultural Etiquette:</dt>
                      <dd className="md:col-span-2 whitespace-pre-line text-gray-700">{pkg.essential_info.cultural_etiquette}</dd>
                    </div>
                  )}
                </dl>
              </div>
            </div>
          )}

          {/* Dates Tab */}
          {activeTab === 'dates' && pkg.available_dates && (
            <div>
              <h2 className="text-2xl font-bold mb-8">Available Dates & Prices</h2>
              {pkg.available_dates.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white border">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Start Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">End Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Availability</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {pkg.available_dates.map((date) => (
                        <tr key={date.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            {new Date(date.start_date).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {new Date(date.end_date).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap font-semibold">
                            {formatPrice(pkg.price * (date.price_multiplier || 1))}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <span className="font-medium">{date.available_slots}</span>
                              <span className="text-gray-500">/{date.total_slots}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              date.status === 'available' ? 'bg-green-100 text-green-800' :
                              date.status === 'limited' ? 'bg-orange-100 text-orange-800' :
                              date.status === 'full' ? 'bg-red-100 text-red-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {date.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <button className="bg-primary-color-dark text-white px-4 py-2 rounded text-sm hover:bg-primary-color transition">
                              Book Now
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-gray-500">No dates available at the moment.</p>
              )}
            </div>
          )}

          {/* FAQ Tab */}
          {activeTab === 'faq' && pkg.faqs && (
            <div>
              <h2 className="text-2xl font-bold mb-8">Frequently Asked Questions</h2>
              {pkg.faqs.length > 0 ? (
                <div className="space-y-4">
                  {pkg.faqs.map((faq) => (
                    <details key={faq.id} className="bg-gray-50 rounded-lg group">
                      <summary className="flex items-center justify-between p-6 cursor-pointer list-none">
                        <h3 className="text-lg font-semibold text-gray-900">{faq.question}</h3>
                        <span className="text-primary-color-dark group-open:rotate-180 transition-transform">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                          </svg>
                        </span>
                      </summary>
                      <div className="px-6 pb-6">
                        <p className="text-gray-600">{faq.answer}</p>
                      </div>
                    </details>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No FAQs available.</p>
              )}
            </div>
          )}

          {/* Reviews Tab */}
          {activeTab === 'reviews' && pkg.reviews && (
            <div>
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold">Customer Reviews</h2>
                {pkg.stats && (
                  <div className="flex items-center gap-4">
                    <StarRating rating={averageRating} />
                    <span className="text-gray-500">Based on {pkg.reviews.length} reviews</span>
                  </div>
                )}
              </div>

              {pkg.reviews.length > 0 ? (
                <>
                  <div className="space-y-6">
                    {(showAllReviews ? pkg.reviews : pkg.reviews.slice(0, 3)).map((review) => (
                      <div key={review.id} className="bg-gray-50 p-6 rounded-lg">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <span className="font-semibold">{review.reviewer_name}</span>
                              {review.reviewer_country && (
                                <span className="text-sm text-gray-500">from {review.reviewer_country}</span>
                              )}
                              {review.is_verified && (
                                <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                                  Verified Trek
                                </span>
                              )}
                            </div>
                            <StarRating rating={review.rating} />
                          </div>
                          {review.trek_date && (
                            <span className="text-sm text-gray-500">
                              Trekked: {new Date(review.trek_date).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                        {review.review_title && (
                          <h4 className="font-semibold mb-2">{review.review_title}</h4>
                        )}
                        <p className="text-gray-600">{review.review_text}</p>
                        {review.review_images && review.review_images.length > 0 && (
                          <div className="flex gap-2 mt-4">
                            {review.review_images.slice(0, 3).map((img, i) => (
                              <img key={i} src={img} alt="Review" className="w-16 h-16 object-cover rounded" />
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {pkg.reviews.length > 3 && !showAllReviews && (
                    <div className="text-center mt-8">
                      <button
                        onClick={() => setShowAllReviews(true)}
                        className="bg-primary-color-dark text-white px-6 py-2 rounded-lg hover:bg-primary-color transition"
                      >
                        Show All {pkg.reviews.length} Reviews
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <p className="text-gray-500">No reviews yet.</p>
              )}
            </div>
          )}

          {/* Gallery Tab */}
          {activeTab === 'gallery' && pkg.gallery && (
            <div>
              <h2 className="text-2xl font-bold mb-8">Photo Gallery</h2>
              {pkg.gallery.length > 0 ? (
                <div>
                  {/* Main Image */}
                  <div className="relative h-96 mb-4 rounded-lg overflow-hidden">
                    <img
                      src={pkg.gallery[selectedImage].image_url || pkg.gallery[selectedImage]}
                      alt={pkg.gallery[selectedImage].title || `Gallery image ${selectedImage + 1}`}
                      className="w-full h-full object-cover"
                    />
                    {pkg.gallery.length > 1 && (
                      <>
                        <button
                          onClick={() => setSelectedImage((prev) => (prev === 0 ? pkg.gallery.length - 1 : prev - 1))}
                          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 w-10 h-10 rounded-full flex items-center justify-center"
                        >
                          <FontAwesomeIcon icon={faChevronLeft} />
                        </button>
                        <button
                          onClick={() => setSelectedImage((prev) => (prev === pkg.gallery.length - 1 ? 0 : prev + 1))}
                          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 w-10 h-10 rounded-full flex items-center justify-center"
                        >
                          <FontAwesomeIcon icon={faChevronRight} />
                        </button>
                      </>
                    )}
                  </div>

                  {/* Thumbnails */}
                  <div className="grid grid-cols-6 gap-2">
                    {pkg.gallery.map((img, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImage(index)}
                        className={`relative h-20 rounded-lg overflow-hidden border-2 ${
                          selectedImage === index ? 'border-primary-color-dark' : 'border-transparent'
                        }`}
                      >
                        <img
                          src={img.image_url || img}
                          alt={img.title || `Thumbnail ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-gray-500">No gallery images available.</p>
              )}
            </div>
          )}

          {/* Documents Tab */}
          {activeTab === 'documents' && pkg.documents && (
            <div>
              <h2 className="text-2xl font-bold mb-8">Documents & Downloads</h2>
              {pkg.documents.length > 0 ? (
                <div className="grid md:grid-cols-2 gap-4">
                  {pkg.documents.map((doc) => (
                    <a
                      key={doc.id}
                      href={doc.document_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition group"
                    >
                      <div className="w-12 h-12 bg-primary-color-dark/10 rounded-lg flex items-center justify-center group-hover:bg-primary-color-dark/20 transition">
                        <FontAwesomeIcon icon={faFilePdf} className="w-6 h-6 text-primary-color-dark" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold">{doc.document_title}</h3>
                        <p className="text-sm text-gray-500 capitalize">{doc.document_type.replace('_', ' ')}</p>
                      </div>
                      <FontAwesomeIcon icon={faDownload} className="w-5 h-5 text-gray-400 group-hover:text-primary-color-dark transition" />
                    </a>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No documents available.</p>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}