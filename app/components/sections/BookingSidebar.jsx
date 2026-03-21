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
  faCheckCircle,
  faShieldAlt,
  faHeadset,
  faMinus,
  faPlus,
  faGift
} from '@fortawesome/free-solid-svg-icons';

export default function BookingSidebar({ package: pkg, countryName, activityName }) {
  const [selectedDate, setSelectedDate] = useState('');
  const [travelers, setTravelers] = useState(1);

  // Helper to format price
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  // Discount calculation based on number of travelers
  const getDiscountPercentage = (numTravelers) => {
    if (numTravelers >= 9 && numTravelers <= 10) return 12;
    if (numTravelers >= 5 && numTravelers <= 8) return 8;
    if (numTravelers >= 2 && numTravelers <= 4) return 5;
    return 0;
  };

  const discountPercent = getDiscountPercentage(travelers);
  const originalTotal = pkg.price * travelers;
  const discountAmount = originalTotal * (discountPercent / 100);
  const discountedTotal = originalTotal - discountAmount;

  // Get the earliest possible date (today) for the date picker
  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  const handleBooking = () => {
    if (!selectedDate) return;
    window.location.href = `/booking?package=${pkg.slug}&date=${selectedDate}&travelers=${travelers}`;
  };

  const handleInquiry = () => {
    window.location.href = `/contact?package=${pkg.slug}&inquiry=true`;
  };

  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100">
      {/* Price Section */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white p-6">
        <div className="text-3xl font-bold mb-1">{formatPrice(pkg.price)}</div>
        <div className="text-sm text-gray-300">per person</div>
        
        <div className="flex items-center gap-4 mt-4 text-sm">
          <div className="flex items-center gap-1">
            <FontAwesomeIcon icon={faClock} className="w-4 h-4 text-gray-300" />
            <span>{pkg.duration_days} Days</span>
          </div>
          <div className="flex items-center gap-1">
            <FontAwesomeIcon icon={faMountain} className="w-4 h-4 text-gray-300" />
            <span>{pkg.max_altitude?.toLocaleString()}m</span>
          </div>
        </div>
      </div>

      {/* Booking Form */}
      <div className="p-6 space-y-6">
        {/* Date Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <FontAwesomeIcon icon={faCalendar} className="w-4 h-4 mr-2 text-primary-color-dark" />
            Select Date
          </label>
          <input
            type="date"
            value={selectedDate}
            onChange={handleDateChange}
            min={getMinDate()}
            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-transparent transition"
          />
        </div>

        {/* Travelers */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <FontAwesomeIcon icon={faUsers} className="w-4 h-4 mr-2 text-primary-color-dark" />
            Number of Travelers
          </label>
          <div className="flex items-center">
            <button
              onClick={() => setTravelers(Math.max(1, travelers - 1))}
              className="p-2 border border-gray-200 rounded-l-xl bg-gray-50 hover:bg-gray-100 transition"
            >
              <FontAwesomeIcon icon={faMinus} className="w-3 h-3 text-gray-600" />
            </button>
            <input
              type="number"
              value={travelers}
              onChange={(e) => setTravelers(Math.max(1, parseInt(e.target.value) || 1))}
              min="1"
              max={pkg.group_size_max || 10}
              className="w-16 px-3 py-2 border-t border-b border-gray-200 text-center focus:outline-none"
            />
            <button
              onClick={() => setTravelers(Math.min(pkg.group_size_max || 10, travelers + 1))}
              className="p-2 border border-gray-200 rounded-r-xl bg-gray-50 hover:bg-gray-100 transition"
            >
              <FontAwesomeIcon icon={faPlus} className="w-3 h-3 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Total Price with Discount */}
        <div className="bg-gray-50 rounded-xl p-4 space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Subtotal</span>
            <span className="font-medium">{formatPrice(originalTotal)}</span>
          </div>
          {discountPercent > 0 && (
            <div className="flex justify-between items-center text-accent-color">
              <span className="flex items-center gap-1">
                <FontAwesomeIcon icon={faGift} className="w-3 h-3" />
                Group Discount ({discountPercent}% OFF)
              </span>
              <span>- {formatPrice(discountAmount)}</span>
            </div>
          )}
          <div className="border-t border-gray-200 pt-2 flex justify-between items-center">
            <span className="font-semibold text-gray-900">Total</span>
            <span className="text-xl font-bold text-primary-color-dark">
              {discountPercent > 0 ? formatPrice(discountedTotal) : formatPrice(originalTotal)}
            </span>
          </div>
          <p className="text-xs text-gray-500">
            for {travelers} {travelers === 1 ? 'person' : 'people'}
          </p>
        </div>

        {/* Action Buttons */}
        <button
          onClick={handleBooking}
          disabled={!selectedDate}
          className="w-full cursor-pointer bg-primary-color-dark text-white py-3 rounded-xl font-medium hover:bg-primary-color-dark/90 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Book Now
        </button>
        
        <button
          onClick={handleInquiry}
          className="w-full border cursor-pointer border-primary-color-dark text-primary-color-dark py-3 rounded-xl font-medium hover:bg-primary-color-dark hover:text-white transition"
        >
          Send Inquiry
        </button>
      </div>
    </div>
  );
}