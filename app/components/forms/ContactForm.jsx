// app/components/forms/ContactForm.jsx
"use client";

import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane, faSpinner, faCheckCircle, faExclamationCircle } from '@fortawesome/free-solid-svg-icons';

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    country: '',
    trek: '',
    people: '',
    startDate: '',
    duration: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState({ type: '', message: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus({ type: '', message: '' });

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitStatus({ 
          type: 'success', 
          message: data.message || 'Thank you! Your message has been sent successfully.' 
        });
        setFormData({
          name: '',
          email: '',
          phone: '',
          country: '',
          trek: '',
          people: '',
          startDate: '',
          duration: '',
          message: ''
        });
        
        setTimeout(() => {
          setSubmitStatus({ type: '', message: '' });
        }, 10000);
      } else {
        setSubmitStatus({ 
          type: 'error', 
          message: data.message || 'Something went wrong. Please try again.' 
        });
      }
    } catch (error) {
      setSubmitStatus({ 
        type: 'error', 
        message: 'Network error. Please check your connection and try again.' 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {submitStatus.message && (
        <div className={`mb-6 p-4 rounded-lg flex items-start gap-3 ${
          submitStatus.type === 'success' 
            ? 'bg-green-50 text-green-800 border border-green-200' 
            : 'bg-red-50 text-red-800 border border-red-200'
        }`}>
          {submitStatus.type === 'success' ? (
            <FontAwesomeIcon icon={faCheckCircle} className="w-5 h-5 mt-0.5 shrink-0 text-green-600" />
          ) : (
            <FontAwesomeIcon icon={faExclamationCircle} className="w-5 h-5 mt-0.5 shrink-0 text-red-600" />
          )}
          <p className="text-sm">{submitStatus.message}</p>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
            Full Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-color-dark focus:border-transparent outline-none transition"
            placeholder="Your name"
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            Email Address <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-color-dark focus:border-transparent outline-none transition"
            placeholder="your@email.com"
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
            Phone Number
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-color-dark focus:border-transparent outline-none transition"
            placeholder="Include country code"
          />
        </div>
        <div>
          <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-2">
            Country of Residence
          </label>
          <input
            type="text"
            id="country"
            name="country"
            value={formData.country}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-color-dark focus:border-transparent outline-none transition"
            placeholder="Your country"
          />
        </div>
      </div>

      <div>
        <label htmlFor="trek" className="block text-sm font-medium text-gray-700 mb-2">
          Trek/Tour Interested In
        </label>
        <select
          id="trek"
          name="trek"
          value={formData.trek}
          onChange={handleChange}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-color-dark focus:border-transparent outline-none transition bg-white"
        >
          <option value="">Select a trek or tour</option>
          <option value="Everest Base Camp Trek">Everest Base Camp Trek</option>
          <option value="Annapurna Base Camp Trek">Annapurna Base Camp Trek</option>
          <option value="Annapurna Circuit Trek">Annapurna Circuit Trek</option>
          <option value="Langtang Valley Trek">Langtang Valley Trek</option>
          <option value="Manaslu Circuit Trek">Manaslu Circuit Trek</option>
          <option value="Upper Mustang Trek">Upper Mustang Trek</option>
          <option value="Kanchenjunga Base Camp Trek">Kanchenjunga Base Camp Trek</option>
          <option value="Tibet Tour">Tibet Tour</option>
          <option value="Bhutan Tour">Bhutan Tour</option>
          <option value="Cultural Tour">Cultural Tour</option>
          <option value="Other">Other</option>
        </select>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="people" className="block text-sm font-medium text-gray-700 mb-2">
            Number of People
          </label>
          <input
            type="number"
            id="people"
            name="people"
            value={formData.people}
            onChange={handleChange}
            min="1"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-color-dark focus:border-transparent outline-none transition"
            placeholder="e.g., 2"
          />
        </div>
        <div>
          <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-2">
            Preferred Start Date
          </label>
          <input
            type="date"
            id="startDate"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-color-dark focus:border-transparent outline-none transition"
          />
        </div>
      </div>

      <div>
        <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-2">
          Trek Duration (Days)
        </label>
        <input
          type="number"
          id="duration"
          name="duration"
          value={formData.duration}
          onChange={handleChange}
          min="1"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-color-dark focus:border-transparent outline-none transition"
          placeholder="Number of days"
        />
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
          Your Message <span className="text-red-500">*</span>
        </label>
        <textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          required
          rows="5"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-color-dark focus:border-transparent outline-none transition resize-none"
          placeholder="Tell us about your dream adventure, specific requirements, or any questions you have..."
        ></textarea>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-primary-color-dark text-white py-4 px-6 rounded-lg font-semibold hover:bg-primary-color transition flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {isSubmitting ? (
          <>
            <FontAwesomeIcon icon={faSpinner} className="w-5 h-5 animate-spin" />
            Sending...
          </>
        ) : (
          <>
            <FontAwesomeIcon icon={faPaperPlane} className="w-5 h-5" />
            Send Message
          </>
        )}
      </button>
    </form>
  );
}