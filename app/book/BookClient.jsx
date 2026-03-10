// app/book/BookClient.js
"use client";

import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faCalendarAlt,
  faUsers,
  faMapMarkerAlt,
  faMountain,
  faClock,
  faUser,
  faEnvelope,
  faPhone,
  faFlag,
  faCreditCard,
  faShieldAlt,
  faCheckCircle,
  faSpinner,
  faExclamationCircle,
  faCheck,
  faArrowRight
} from "@fortawesome/free-solid-svg-icons";
import { 
  faFacebookF, 
  faInstagram, 
  faWhatsapp,
  faTwitter
} from "@fortawesome/free-brands-svg-icons";
import HeroSection from "@/app/components/sections/HeroSection";
import Heading from "@/app/components/ui/Heading";
import { useState, useEffect, useCallback } from "react";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";

export default function BookClient() {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState({ type: '', message: '' });
  const [isRecaptchaReady, setIsRecaptchaReady] = useState(false);
  
  const { executeRecaptcha } = useGoogleReCaptcha();

  useEffect(() => {
    if (executeRecaptcha) {
      setIsRecaptchaReady(true);
    }
  }, [executeRecaptcha]);

  const [formData, setFormData] = useState({
    // Personal Information
    fullName: '',
    email: '',
    phone: '',
    nationality: '',
    passportNumber: '',
    dateOfBirth: '',
    
    // Trek Details
    trekName: '',
    startDate: '',
    endDate: '',
    numberOfTrekkers: '1',
    accommodationType: 'teahouse',
    mealPlan: 'full-board',
    
    // Requirements
    fitnessLevel: 'intermediate',
    previousExperience: '',
    medicalConditions: '',
    dietaryRequirements: '',
    
    // Emergency Contact
    emergencyName: '',
    emergencyPhone: '',
    emergencyRelationship: '',
    
    // Additional
    specialRequests: '',
    howDidYouHear: '',
    agreeToTerms: false
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleNext = () => {
    // Validate current step before proceeding
    if (step === 1) {
      if (!formData.fullName || !formData.email || !formData.phone || !formData.nationality) {
        setSubmitStatus({ type: 'error', message: 'Please fill in all required fields' });
        setTimeout(() => setSubmitStatus({ type: '', message: '' }), 5000);
        return;
      }
    } else if (step === 2) {
      if (!formData.trekName || !formData.startDate || !formData.endDate) {
        setSubmitStatus({ type: 'error', message: 'Please select trek and dates' });
        setTimeout(() => setSubmitStatus({ type: '', message: '' }), 5000);
        return;
      }
    }
    setStep(prev => prev + 1);
  };

  const handlePrevious = () => {
    setStep(prev => prev - 1);
  };

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    
    // Validate terms agreement
    if (!formData.agreeToTerms) {
      setSubmitStatus({ type: 'error', message: 'You must agree to the terms and conditions' });
      setTimeout(() => setSubmitStatus({ type: '', message: '' }), 5000);
      return;
    }

    if (!isRecaptchaReady || !executeRecaptcha) {
      setSubmitStatus({ type: 'error', message: 'Security verification is still loading. Please wait a moment and try again.' });
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus({ type: '', message: '' });

    try {
      const token = await executeRecaptcha('booking_form');
      
      const response = await fetch('/api/book', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          recaptchaToken: token
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitStatus({ 
          type: 'success', 
          message: 'Booking request submitted successfully! We\'ll contact you within 24 hours to confirm your trek.' 
        });
        // Reset form
        setFormData({
          fullName: '',
          email: '',
          phone: '',
          nationality: '',
          passportNumber: '',
          dateOfBirth: '',
          trekName: '',
          startDate: '',
          endDate: '',
          numberOfTrekkers: '1',
          accommodationType: 'teahouse',
          mealPlan: 'full-board',
          fitnessLevel: 'intermediate',
          previousExperience: '',
          medicalConditions: '',
          dietaryRequirements: '',
          emergencyName: '',
          emergencyPhone: '',
          emergencyRelationship: '',
          specialRequests: '',
          howDidYouHear: '',
          agreeToTerms: false
        });
        setStep(1);
        setTimeout(() => {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 100);
      } else {
        setSubmitStatus({ 
          type: 'error', 
          message: data.message || 'Something went wrong. Please try again.' 
        });
      }
    } catch (error) {
      console.error('Submission error:', error);
      setSubmitStatus({ 
        type: 'error', 
        message: error.message || 'Network error. Please check your connection and try again.' 
      });
    } finally {
      setIsSubmitting(false);
    }
  }, [executeRecaptcha, formData, isRecaptchaReady]);

  const popularTreks = [
    "Everest Base Camp Trek",
    "Annapurna Base Camp Trek",
    "Annapurna Circuit Trek",
    "Langtang Valley Trek",
    "Manaslu Circuit Trek",
    "Upper Mustang Trek",
    "Ghorepani Poon Hill Trek",
    "Kanchenjunga Base Camp Trek"
  ];

  const getMinDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  const calculatePrice = () => {
    // This is a simple price calculator - adjust based on your actual pricing
    const basePrices = {
      "Everest Base Camp Trek": 1200,
      "Annapurna Base Camp Trek": 900,
      "Annapurna Circuit Trek": 1100,
      "Langtang Valley Trek": 800,
      "Manaslu Circuit Trek": 1500,
      "Upper Mustang Trek": 1800,
      "Ghorepani Poon Hill Trek": 600,
      "Kanchenjunga Base Camp Trek": 2200
    };
    
    const basePrice = basePrices[formData.trekName] || 1000;
    const numPeople = parseInt(formData.numberOfTrekkers) || 1;
    const discount = numPeople >= 4 ? 0.1 : 0; // 10% discount for groups of 4+
    
    return basePrice * numPeople * (1 - discount);
  };

  return (
    <main>
      <HeroSection 
        image={"/images/booking-cover.jpg"} 
        heading={"Book Your Himalayan Adventure"} 
        subheading={"Secure your spot on the trek of a lifetime"} 
      />

      {/* reCAPTCHA Badge Note (optional) */}
      <div className="text-xs text-gray-500 text-center py-2 bg-gray-50">
        This site is protected by reCAPTCHA and the Google 
        <a href="https://policies.google.com/privacy" className="text-primary-color-dark hover:underline mx-1" target="_blank" rel="noopener noreferrer">Privacy Policy</a> 
        and 
        <a href="https://policies.google.com/terms" className="text-primary-color-dark hover:underline mx-1" target="_blank" rel="noopener noreferrer">Terms of Service</a> 
        apply. <FontAwesomeIcon icon={faShieldAlt} className="w-3 h-3 inline" />
      </div>

      {/* Introduction */}
      <section className="py-12 bg-white">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <Heading 
            title={"Start Your Booking"} 
            titleClass={"text-center mb-4"} 
          />
          <p className="text-md text-gray-600 leading-relaxed">
            Complete the form below to book your trek. Our team will confirm availability and send you 
            detailed information within <strong>24 hours</strong>. All bookings are secure and protected.
          </p>
        </div>
      </section>

      {/* Progress Steps */}
      <section className="py-8 bg-gray-50 border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex justify-between items-center">
            {[
              { number: 1, label: "Personal Info", icon: faUser },
              { number: 2, label: "Trek Details", icon: faMountain },
              { number: 3, label: "Requirements", icon: faShieldAlt },
              { number: 4, label: "Confirmation", icon: faCheck }
            ].map((s, index) => (
              <div key={s.number} className="flex flex-col items-center relative flex-1">
                {/* Connector Line */}
                {index < 3 && (
                  <div className={`absolute top-5 left-[60%] w-full h-0.5 ${
                    step > s.number ? 'bg-gradient-to-r from-secondary-color via-primary-color-dark to-primary-color-dark' : 'bg-gray-300'
                  } hidden md:block`} />
                )}
                
                {/* Step Circle */}
                <div className={`w-10 h-10 rounded-full flex items-center justify-center z-10 ${
                  step > s.number 
                    ? 'bg-secondary-color text-white' 
                    : step === s.number
                      ? 'bg-primary-color-dark text-white ring-4 ring-primary-color-dark ring-opacity-30'
                      : 'bg-gray-300 text-gray-600'
                }`}>
                  {step > s.number ? (
                    <FontAwesomeIcon icon={faCheck} className="w-4 h-4" />
                  ) : (
                    <span className="text-sm font-bold">{s.number}</span>
                  )}
                </div>
                
                {/* Step Label */}
                <span className={`text-xs md:text-sm mt-2 font-medium ${
                  step >= s.number ? 'text-gray-900' : 'text-gray-400'
                }`}>
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Booking Form */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-xl shadow-sm p-8">
            {/* Status Message */}
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

            {/* reCAPTCHA loading indicator */}
            {!isRecaptchaReady && (
              <div className="mb-4 p-3 bg-blue-50 text-blue-700 rounded-lg flex items-center gap-2">
                <FontAwesomeIcon icon={faSpinner} className="w-4 h-4 animate-spin" />
                Loading security verification...
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {/* Step 1: Personal Information */}
              {step === 1 && (
                <div className="space-y-6">
                  <Heading title={"Personal Information"} titleClass={"mb-6"} />
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="fullName"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-color-dark focus:border-transparent outline-none transition"
                        placeholder="As it appears on passport"
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

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-color-dark focus:border-transparent outline-none transition"
                        placeholder="Include country code"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="nationality" className="block text-sm font-medium text-gray-700 mb-2">
                        Nationality <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="nationality"
                        name="nationality"
                        value={formData.nationality}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-color-dark focus:border-transparent outline-none transition"
                        placeholder="Your country"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="passportNumber" className="block text-sm font-medium text-gray-700 mb-2">
                        Passport Number
                      </label>
                      <input
                        type="text"
                        id="passportNumber"
                        name="passportNumber"
                        value={formData.passportNumber}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-color-dark focus:border-transparent outline-none transition"
                        placeholder="For permit processing"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700 mb-2">
                        Date of Birth
                      </label>
                      <input
                        type="date"
                        id="dateOfBirth"
                        name="dateOfBirth"
                        value={formData.dateOfBirth}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-color-dark focus:border-transparent outline-none transition"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Trek Details */}
              {step === 2 && (
                <div className="space-y-6">
                  <Heading title={"Trek Details"} titleClass={"mb-6"} />
                  
                  <div>
                    <label htmlFor="trekName" className="block text-sm font-medium text-gray-700 mb-2">
                      Select Trek <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="trekName"
                      name="trekName"
                      value={formData.trekName}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-color-dark focus:border-transparent outline-none transition bg-white"
                    >
                      <option value="">Choose a trek...</option>
                      {popularTreks.map(trek => (
                        <option key={trek} value={trek}>{trek}</option>
                      ))}
                      <option value="Custom Trek">Custom Trek / Other</option>
                    </select>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-2">
                        Start Date <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        id="startDate"
                        name="startDate"
                        value={formData.startDate}
                        onChange={handleChange}
                        required
                        min={getMinDate()}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-color-dark focus:border-transparent outline-none transition"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-2">
                        End Date <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        id="endDate"
                        name="endDate"
                        value={formData.endDate}
                        onChange={handleChange}
                        required
                        min={formData.startDate || getMinDate()}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-color-dark focus:border-transparent outline-none transition"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="numberOfTrekkers" className="block text-sm font-medium text-gray-700 mb-2">
                        Number of Trekkers <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        id="numberOfTrekkers"
                        name="numberOfTrekkers"
                        value={formData.numberOfTrekkers}
                        onChange={handleChange}
                        min="1"
                        max="20"
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-color-dark focus:border-transparent outline-none transition"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="accommodationType" className="block text-sm font-medium text-gray-700 mb-2">
                        Accommodation Type
                      </label>
                      <select
                        id="accommodationType"
                        name="accommodationType"
                        value={formData.accommodationType}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-color-dark focus:border-transparent outline-none transition bg-white"
                      >
                        <option value="teahouse">Teahouse (Standard)</option>
                        <option value="luxury-teahouse">Premium Teahouse</option>
                        <option value="camping">Camping (Full Service)</option>
                        <option value="lodge">Mountain Lodge</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="mealPlan" className="block text-sm font-medium text-gray-700 mb-2">
                      Meal Plan
                    </label>
                    <select
                      id="mealPlan"
                      name="mealPlan"
                      value={formData.mealPlan}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-color-dark focus:border-transparent outline-none transition bg-white"
                    >
                      <option value="full-board">Full Board (All meals included)</option>
                      <option value="half-board">Half Board (Breakfast & Dinner)</option>
                      <option value="bed-breakfast">Bed & Breakfast Only</option>
                    </select>
                  </div>

                  {/* Price Estimate */}
                  {formData.trekName && formData.numberOfTrekkers && (
                    <div className="mt-6 p-6 bg-primary-color-dark/5 rounded-lg border border-primary-color-dark/20">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Estimated Price</h3>
                      <p className="text-3xl font-bold text-primary-color-dark">
                        ${calculatePrice().toLocaleString()}
                      </p>
                      <p className="text-sm text-gray-600 mt-2">
                        For {formData.numberOfTrekkers} trekker(s) • Includes permits, accommodation, guides, and porters
                      </p>
                      <p className="text-xs text-gray-500 mt-2">
                        *Final price may vary based on season and specific requirements
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Step 3: Requirements */}
              {step === 3 && (
                <div className="space-y-6">
                  <Heading title={"Requirements & Preferences"} titleClass={"mb-6"} />
                  
                  <div>
                    <label htmlFor="fitnessLevel" className="block text-sm font-medium text-gray-700 mb-2">
                      Fitness Level
                    </label>
                    <select
                      id="fitnessLevel"
                      name="fitnessLevel"
                      value={formData.fitnessLevel}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-color-dark focus:border-transparent outline-none transition bg-white"
                    >
                      <option value="beginner">Beginner - Limited hiking experience</option>
                      <option value="intermediate">Intermediate - Regular hiker</option>
                      <option value="advanced">Advanced - Experienced trekker</option>
                      <option value="expert">Expert - High altitude experience</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="previousExperience" className="block text-sm font-medium text-gray-700 mb-2">
                      Previous Trekking Experience
                    </label>
                    <textarea
                      id="previousExperience"
                      name="previousExperience"
                      value={formData.previousExperience}
                      onChange={handleChange}
                      rows="3"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-color-dark focus:border-transparent outline-none transition resize-none"
                      placeholder="Briefly describe any previous treks or relevant experience..."
                    ></textarea>
                  </div>

                  <div>
                    <label htmlFor="medicalConditions" className="block text-sm font-medium text-gray-700 mb-2">
                      Medical Conditions / Allergies
                    </label>
                    <textarea
                      id="medicalConditions"
                      name="medicalConditions"
                      value={formData.medicalConditions}
                      onChange={handleChange}
                      rows="3"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-color-dark focus:border-transparent outline-none transition resize-none"
                      placeholder="Any medical conditions, allergies, or health concerns we should know about..."
                    ></textarea>
                    <p className="text-xs text-gray-500 mt-1">This information helps us ensure your safety</p>
                  </div>

                  <div>
                    <label htmlFor="dietaryRequirements" className="block text-sm font-medium text-gray-700 mb-2">
                      Dietary Requirements
                    </label>
                    <input
                      type="text"
                      id="dietaryRequirements"
                      name="dietaryRequirements"
                      value={formData.dietaryRequirements}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-color-dark focus:border-transparent outline-none transition"
                      placeholder="Vegetarian, Vegan, Gluten-free, etc."
                    />
                  </div>

                  <div className="border-t border-gray-200 pt-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Emergency Contact</h3>
                    
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="emergencyName" className="block text-sm font-medium text-gray-700 mb-2">
                          Emergency Contact Name
                        </label>
                        <input
                          type="text"
                          id="emergencyName"
                          name="emergencyName"
                          value={formData.emergencyName}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-color-dark focus:border-transparent outline-none transition"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="emergencyPhone" className="block text-sm font-medium text-gray-700 mb-2">
                          Emergency Contact Phone
                        </label>
                        <input
                          type="tel"
                          id="emergencyPhone"
                          name="emergencyPhone"
                          value={formData.emergencyPhone}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-color-dark focus:border-transparent outline-none transition"
                        />
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <label htmlFor="emergencyRelationship" className="block text-sm font-medium text-gray-700 mb-2">
                        Relationship to Emergency Contact
                      </label>
                      <input
                        type="text"
                        id="emergencyRelationship"
                        name="emergencyRelationship"
                        value={formData.emergencyRelationship}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-color-dark focus:border-transparent outline-none transition"
                        placeholder="e.g., Spouse, Parent, Sibling"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 4: Confirmation */}
              {step === 4 && (
                <div className="space-y-6">
                  <Heading title={"Review & Confirm"} titleClass={"mb-6"} />
                  
                  <div className="bg-gray-50 p-6 rounded-lg space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">Booking Summary</h3>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Name:</p>
                        <p className="font-medium">{formData.fullName}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Email:</p>
                        <p className="font-medium">{formData.email}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Phone:</p>
                        <p className="font-medium">{formData.phone}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Nationality:</p>
                        <p className="font-medium">{formData.nationality}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Selected Trek:</p>
                        <p className="font-medium">{formData.trekName}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Duration:</p>
                        <p className="font-medium">
                          {formData.startDate && formData.endDate && 
                            `${new Date(formData.startDate).toLocaleDateString()} - ${new Date(formData.endDate).toLocaleDateString()}`
                          }
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Number of Trekkers:</p>
                        <p className="font-medium">{formData.numberOfTrekkers}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Estimated Price:</p>
                        <p className="font-bold text-primary-color-dark">${calculatePrice().toLocaleString()}</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="specialRequests" className="block text-sm font-medium text-gray-700 mb-2">
                      Special Requests (Optional)
                    </label>
                    <textarea
                      id="specialRequests"
                      name="specialRequests"
                      value={formData.specialRequests}
                      onChange={handleChange}
                      rows="3"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-color-dark focus:border-transparent outline-none transition resize-none"
                      placeholder="Any special requests or additional information..."
                    ></textarea>
                  </div>

                  <div>
                    <label htmlFor="howDidYouHear" className="block text-sm font-medium text-gray-700 mb-2">
                      How did you hear about us?
                    </label>
                    <select
                      id="howDidYouHear"
                      name="howDidYouHear"
                      value={formData.howDidYouHear}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-color-dark focus:border-transparent outline-none transition bg-white"
                    >
                      <option value="">Select an option</option>
                      <option value="google">Google Search</option>
                      <option value="facebook">Facebook</option>
                      <option value="instagram">Instagram</option>
                      <option value="youtube">YouTube</option>
                      <option value="friend">Friend/Family Recommendation</option>
                      <option value="travel-blog">Travel Blog</option>
                      <option value="previous">Previous Customer</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div className="border-t border-gray-200 pt-6">
                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        id="agreeToTerms"
                        name="agreeToTerms"
                        checked={formData.agreeToTerms}
                        onChange={handleChange}
                        className="mt-1 w-4 h-4 text-primary-color-dark border-gray-300 rounded focus:ring-primary-color-dark"
                      />
                      <label htmlFor="agreeToTerms" className="text-sm text-gray-600">
                        I confirm that the information provided is accurate and I agree to the 
                        <Link href="/terms" className="text-primary-color-dark hover:underline mx-1">
                          Terms & Conditions
                        </Link>
                        and
                        <Link href="/privacy" className="text-primary-color-dark hover:underline mx-1">
                          Privacy Policy
                        </Link>
                        . I understand that this is a booking request and will be confirmed by the Global Nepal Treks team.
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
                {step > 1 && (
                  <button
                    type="button"
                    onClick={handlePrevious}
                    className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition"
                  >
                    Previous
                  </button>
                )}
                
                {step < 4 ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="ml-auto px-6 py-3 bg-primary-color-dark text-white rounded-lg font-medium hover:bg-primary-color transition flex items-center gap-2"
                  >
                    Next Step
                    <FontAwesomeIcon icon={faArrowRight} className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isSubmitting || !formData.agreeToTerms || !isRecaptchaReady}
                    className="ml-auto px-8 py-3 bg-primary-color-dark cursor-pointer text-white rounded-lg font-medium hover:bg-primary-color-dark/80 transition flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <FontAwesomeIcon icon={faSpinner} className="w-4 h-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <FontAwesomeIcon icon={faCheckCircle} className="w-4 h-4" />
                        Confirm Booking
                      </>
                    )}
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Why Book With Us */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <Heading 
            title={"Why Book With Us"} 
            titleClass={"text-center mb-12"} 
          />
          
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { icon: faShieldAlt, title: "Secure Booking", desc: "Your information is encrypted and secure" },
              { icon: faCheckCircle, title: "Best Price Guarantee", desc: "We match any legitimate offer" },
              { icon: faUsers, title: "Expert Local Guides", desc: "Licensed, experienced, English-speaking" },
              { icon: faCreditCard, title: "Flexible Payment", desc: "Multiple payment options available" }
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-primary-color-dark/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FontAwesomeIcon icon={item.icon} className="w-8 h-8 text-primary-color-dark" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Treks */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <Heading 
            title={"Popular Treks You Can Book"} 
            titleClass={"text-center mb-8"} 
          />
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {popularTreks.slice(0, 4).map((trek, index) => (
              <div key={index} className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition">
                <div className="w-12 h-12 bg-primary-color-dark/10 rounded-full flex items-center justify-center mb-4">
                  <FontAwesomeIcon icon={faMountain} className="w-6 h-6 text-primary-color-dark" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{trek}</h3>
                <p className="text-sm text-gray-600 mb-4">Duration: 12-16 days</p>
                <button 
                  onClick={() => {
                    setFormData(prev => ({ ...prev, trekName: trek }));
                    setStep(2);
                    window.scrollTo({ top: 400, behavior: 'smooth' });
                  }}
                  className="text-primary-color-dark font-medium hover:underline flex items-center gap-2"
                >
                  Book Now <FontAwesomeIcon icon={faArrowRight} className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <Heading 
            title={"Frequently Asked Questions"} 
            titleClass={"text-center mb-8"} 
          />
          
          <div className="space-y-4">
            {[
              {
                q: "How do I confirm my booking?",
                a: "After submitting this form, our team will contact you within 24 hours to confirm availability and send you a detailed itinerary. A deposit of 20% is required to secure your spot."
              },
              {
                q: "What is your cancellation policy?",
                a: "Cancellations made 60+ days before departure: full refund minus deposit. 30-59 days: 50% refund. Less than 30 days: no refund. We strongly recommend travel insurance."
              },
              {
                q: "Do I need travel insurance?",
                a: "Yes, comprehensive travel insurance covering medical emergencies, evacuation, and trip cancellation is mandatory for all trekkers."
              },
              {
                q: "What's included in the price?",
                a: "All prices include permits, accommodation, meals as per plan, experienced guides, porters, and ground transportation. Flights and personal expenses are not included."
              }
            ].map((faq, index) => (
              <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
                <details className="group">
                  <summary className="flex items-center justify-between p-6 cursor-pointer list-none">
                    <h3 className="text-lg font-semibold text-gray-900">{faq.q}</h3>
                    <FontAwesomeIcon 
                      icon={faArrowRight} 
                      className="w-4 h-4 text-primary-color-dark group-open:rotate-90 transition-transform" 
                    />
                  </summary>
                  <div className="px-6 pb-6">
                    <p className="text-gray-600">{faq.a}</p>
                  </div>
                </details>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Need Help Section */}
      <section className="py-16 bg-secondary-color text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 font-montserrat">
            Need Assistance With Your Booking?
          </h2>
          <p className="text-lg text-white/90 mb-8">
            Our trekking experts are here to assist you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="https://wa.me/9779744258519" 
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 border-2 border-green-600 hover:border-green hover:bg-green-600 text-white px-8 py-4 rounded-lg font-semibold transition shadow-sm"
            >
              <FontAwesomeIcon icon={faWhatsapp} className="w-5 h-5" />
              WhatsApp Us
            </Link>
            <Link 
              href="mailto:info@globalnepaltreks.com"
              className="inline-flex items-center justify-center gap-2 bg-primary-color-dark text-white px-8 py-4 rounded-sm font-semibold hover:bg-primary-color transition shadow-sm"
            >
              <FontAwesomeIcon icon={faEnvelope} className="w-5 h-5" />
              Send Email
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}