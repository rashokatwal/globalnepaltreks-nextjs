// app/components/sections/BookingSidebar.jsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faCalendar, 
  faClock, 
  faUsers, 
  faMountain,
  faStar,
  faCheckCircle,
  faShieldAlt,
  faHeadset
} from '@fortawesome/free-solid-svg-icons';

export default function BookingSidebar({ package: pkg, countryName, activityName }) {
  const [selectedDate, setSelectedDate] = useState('');
  const [travelers, setTravelers] = useState(1);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  const handleBooking = () => {
    // Handle booking logic
    window.location.href = `/booking?package=${pkg.slug}&date=${selectedDate}&travelers=${travelers}`;
  };

  const handleInquiry = () => {
    window.location.href = `/contact?package=${pkg.slug}&inquiry=true`;
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
      {/* Price Section */}
      <div className="bg-secondary-color text-white p-6">
        <div className="text-3xl font-bold mb-1">{formatPrice(pkg.price)}</div>
        <div className="text-sm opacity-90">per person</div>
        
        <div className="flex items-center gap-4 mt-4 text-sm">
          <div className="flex items-center gap-1">
            <FontAwesomeIcon icon={faClock} className="w-4 h-4" />
            <span>{pkg.duration_days} Days</span>
          </div>
          <div className="flex items-center gap-1">
            <FontAwesomeIcon icon={faMountain} className="w-4 h-4" />
            <span>{pkg.max_altitude?.toLocaleString()}m</span>
          </div>
        </div>
      </div>

      {/* Booking Form */}
      <div className="p-6">
        {/* Date Selection */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <FontAwesomeIcon icon={faCalendar} className="w-4 h-4 mr-2 text-primary-color-dark" />
            Select Date
          </label>
          <select
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-color-dark"
          >
            <option value="">Choose a date</option>
            {pkg.available_dates?.map((date) => (
              <option key={date.id} value={date.start_date}>
                {new Date(date.start_date).toLocaleDateString()} - {new Date(date.end_date).toLocaleDateString()}
                {date.status === 'limited' ? ' (Limited spots)' : ''}
              </option>
            ))}
          </select>
        </div>

        {/* Travelers */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <FontAwesomeIcon icon={faUsers} className="w-4 h-4 mr-2 text-primary-color-dark" />
            Number of Travelers
          </label>
          <div className="flex items-center">
            <button
              onClick={() => setTravelers(Math.max(1, travelers - 1))}
              className="px-3 py-2 border border-gray-300 rounded-l-lg bg-gray-50 hover:bg-gray-100"
            >
              -
            </button>
            <input
              type="number"
              value={travelers}
              onChange={(e) => setTravelers(Math.max(1, parseInt(e.target.value) || 1))}
              min="1"
              max={pkg.group_size_max || 10}
              className="w-20 px-3 py-2 border-t border-b border-gray-300 text-center focus:outline-none"
            />
            <button
              onClick={() => setTravelers(Math.min(pkg.group_size_max || 10, travelers + 1))}
              className="px-3 py-2 border border-gray-300 rounded-r-lg bg-gray-50 hover:bg-gray-100"
            >
              +
            </button>
          </div>
        </div>

        {/* Total Price */}
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Total Price:</span>
            <span className="text-2xl font-bold text-primary-color-dark">
              {formatPrice(pkg.price * travelers)}
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-1">for {travelers} {travelers === 1 ? 'person' : 'people'}</p>
        </div>

        {/* Action Buttons */}
        <button
          onClick={handleBooking}
          disabled={!selectedDate}
          className="w-full bg-primary-color-dark text-white py-3 rounded-lg font-semibold hover:bg-primary-color transition mb-3 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Book Now
        </button>
        
        <button
          onClick={handleInquiry}
          className="w-full border-2 border-primary-color-dark text-primary-color-dark py-3 rounded-lg font-semibold hover:bg-primary-color-dark hover:text-white transition"
        >
          Send Inquiry
        </button>

        {/* Trust Badges */}
        {/* <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="grid grid-cols-2 gap-3 text-center text-sm">
            <div className="flex flex-col items-center">
              <FontAwesomeIcon icon={faShieldAlt} className="w-5 h-5 text-primary-color-dark mb-2" />
              <span className="text-gray-600">Secure Booking</span>
            </div>
            <div className="flex flex-col items-center">
              <FontAwesomeIcon icon={faHeadset} className="w-5 h-5 text-primary-color-dark mb-2" />
              <span className="text-gray-600">24/7 Support</span>
            </div>
          </div>
        </div> */}

        {/* Key Features */}
        {/* <div className="mt-4 text-sm text-gray-600">
          <div className="flex items-center gap-2 mb-2">
            <FontAwesomeIcon icon={faCheckCircle} className="text-green-600 w-4 h-4" />
            <span>Best Price Guarantee</span>
          </div>
          <div className="flex items-center gap-2 mb-2">
            <FontAwesomeIcon icon={faCheckCircle} className="text-green-600 w-4 h-4" />
            <span>Free Cancellation</span>
          </div>
          <div className="flex items-center gap-2">
            <FontAwesomeIcon icon={faCheckCircle} className="text-green-600 w-4 h-4" />
            <span>Expert Local Guides</span>
          </div>
        </div> */}
      </div>
    </div>
  );
}