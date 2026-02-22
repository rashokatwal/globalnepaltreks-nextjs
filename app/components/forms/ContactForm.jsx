// app/components/forms/ContactForm.js
"use client";

import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faUser, 
  faEnvelope, 
  faPhone, 
  faFlag,
  faCalendar,
  faPersonHiking,
  faMessage,
  faPaperPlane,
  faCheckCircle,
  faExclamationCircle
} from "@fortawesome/free-solid-svg-icons";

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    country: "",
    trek: "",
    startDate: "",
    duration: "",
    participants: "1",
    message: ""
  });

  const [status, setStatus] = useState({
    submitted: false,
    submitting: false,
    success: false,
    error: false,
    message: ""
  });

  const trekOptions = [
    "Everest Base Camp Trek",
    "Annapurna Circuit Trek",
    "Annapurna Base Camp Trek",
    "Langtang Valley Trek",
    "Upper Mustang Trek",
    "Manaslu Circuit Trek",
    "Mount Kailash Trek (Tibet)",
    "Druk Path Trek (Bhutan)",
    "Cultural Tours",
    "Peak Climbing",
    "Heli Tour",
    "Custom Itinerary"
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ ...status, submitting: true, error: false, message: "" });

    try {
      const response = await fetch('/api/inquiries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus({
          submitted: true,
          submitting: false,
          success: true,
          error: false,
          message: "Thank you! Your message has been sent. We'll get back to you within 24 hours."
        });
        
        // Reset form
        setFormData({
          name: "",
          email: "",
          phone: "",
          country: "",
          trek: "",
          startDate: "",
          duration: "",
          participants: "1",
          message: ""
        });
      } else {
        setStatus({
          ...status,
          submitting: false,
          success: false,
          error: true,
          message: data.error || "Something went wrong. Please try again."
        });
      }
    } catch (error) {
      setStatus({
        ...status,
        submitting: false,
        success: false,
        error: true,
        message: "Network error. Please check your connection and try again."
      });
    }
  };

  if (status.success) {
    return (
      <div className="text-center py-12">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <FontAwesomeIcon icon={faCheckCircle} className="w-10 h-10 text-green-600" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-4">Message Sent Successfully!</h3>
        <p className="text-gray-600 mb-8">{status.message}</p>
        <button
          onClick={() => setStatus({ submitted: false, submitting: false, success: false, error: false, message: "" })}
          className="bg-primary-color-dark text-white px-6 py-3 rounded-sm font-semibold hover:bg-primary-color transition"
        >
          Send Another Message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Name and Email */}
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Full Name <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FontAwesomeIcon icon={faUser} className="text-gray-400 w-4 h-4" />
            </div>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-primary-color-dark focus:border-transparent"
              placeholder="John Doe"
            />
          </div>
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email Address <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FontAwesomeIcon icon={faEnvelope} className="text-gray-400 w-4 h-4" />
            </div>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-primary-color-dark focus:border-transparent"
              placeholder="john@example.com"
            />
          </div>
        </div>
      </div>

      {/* Phone and Country */}
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
            Phone Number <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FontAwesomeIcon icon={faPhone} className="text-gray-400 w-4 h-4" />
            </div>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-primary-color-dark focus:border-transparent"
              placeholder="+1 234 567 8900"
            />
          </div>
        </div>

        <div>
          <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
            Your Country <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FontAwesomeIcon icon={faFlag} className="text-gray-400 w-4 h-4" />
            </div>
            <input
              type="text"
              id="country"
              name="country"
              required
              value={formData.country}
              onChange={handleChange}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-primary-color-dark focus:border-transparent"
              placeholder="USA, UK, Australia, etc."
            />
          </div>
        </div>
      </div>

      {/* Trek Selection */}
      {/* <div>
        <label htmlFor="trek" className="block text-sm font-medium text-gray-700 mb-1">
          Interested Trek/Package
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FontAwesomeIcon icon={faPersonHiking} className="text-gray-400 w-4 h-4" />
          </div>
          <select
            id="trek"
            name="trek"
            value={formData.trek}
            onChange={handleChange}
            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-color-dark focus:border-transparent appearance-none bg-white"
          >
            <option value="">Select a trek (optional)</option>
            {trekOptions.map((option, index) => (
              <option key={index} value={option}>{option}</option>
            ))}
          </select>
        </div>
      </div> */}

      {/* Travel Details */}
      {/* <div className="grid md:grid-cols-3 gap-4">
        <div>
          <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
            Preferred Start Date
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FontAwesomeIcon icon={faCalendar} className="text-gray-400 w-4 h-4" />
            </div>
            <input
              type="date"
              id="startDate"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-color-dark focus:border-transparent"
            />
          </div>
        </div>

        <div>
          <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-1">
            Duration (Days)
          </label>
          <input
            type="number"
            id="duration"
            name="duration"
            value={formData.duration}
            onChange={handleChange}
            min="1"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-color-dark focus:border-transparent"
            placeholder="14"
          />
        </div>

        <div>
          <label htmlFor="participants" className="block text-sm font-medium text-gray-700 mb-1">
            Participants
          </label>
          <select
            id="participants"
            name="participants"
            value={formData.participants}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-color-dark focus:border-transparent"
          >
            {[1,2,3,4,5,6,7,8,9,10].map(num => (
              <option key={num} value={num}>{num} {num === 1 ? 'Person' : 'People'}</option>
            ))}
          </select>
        </div>
      </div> */}

      {/* Message */}
      <div>
        <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
          Your Message <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <div className="absolute top-3 left-3 pointer-events-none">
            <FontAwesomeIcon icon={faMessage} className="text-gray-400 w-4 h-4" />
          </div>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
            rows="5"
            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-primary-color-dark focus:border-transparent"
            placeholder="Tell us about your dream trek, questions, or special requirements..."
          />
        </div>
      </div>

      {/* Error Message */}
      {status.error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-sm flex items-start gap-3">
          <FontAwesomeIcon icon={faExclamationCircle} className="w-5 h-5 text-red-500 mt-0.5" />
          <p className="text-red-700 text-sm">{status.message}</p>
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={status.submitting}
        className="w-full bg-primary-color-dark text-white py-3 px-6 rounded-sm font-semibold hover:bg-primary-color transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {status.submitting ? (
          <>
            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Sending...
          </>
        ) : (
          <>
            <FontAwesomeIcon icon={faPaperPlane} className="w-4 h-4" />
            Send Message
          </>
        )}
      </button>

      <p className="text-xs text-gray-500 text-center">
        By submitting this form, you agree to our privacy policy and terms of service.
        We'll never share your information with third parties.
      </p>
    </form>
  );
}