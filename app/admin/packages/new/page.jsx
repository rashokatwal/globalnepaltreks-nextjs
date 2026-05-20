'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faArrowLeft, faSave, faSpinner, faSync, faPlus, faTrash,
  faChevronDown, faChevronUp
} from '@fortawesome/free-solid-svg-icons';

// Dynamically import TipTap to avoid SSR issues
const TipTapEditor = dynamic(() => import('../../../components/admin/TipTapEditor'), { ssr: false });

export default function NewPackagePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [overviewMode, setOverviewMode] = useState('richtext'); // 'richtext' or 'html'

  // Main form state – matches fields in packages table + related arrays
  const [formData, setFormData] = useState({
    country_id: 1,
    activity_id: 1,
    title: '',
    slug: '',
    short_description: '',
    duration_days: '',
    price: '',
    difficulty: 'moderate',
    max_altitude: '',
    group_size_min: 2,
    group_size_max: 10,
    best_season: '',
    overview: '',
    highlights: '',
    featured_image: '',
    map_image: '',
    meta_title: '',
    meta_description: '',
    keywords: '',
    is_featured: false,
    is_active: true,
    is_luxury: false,
    is_adventure: true,
    is_best_selling: false,
    essential_info: '',
    // Related arrays
    itinerary: [],
    features: [],      // { feature_type: 'included'|'excluded', description }
    faqs: [],          // { question, answer }
    available_dates: [], // { start_date, end_date, status, price }
    gallery_images: [],  // { image_url, title }
    documents: [],       // { title, file_url }
  });

  // Generate slug from title
  const generateSlug = () => {
    if (!formData.title) return;
    const slug = formData.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
    setFormData(prev => ({ ...prev, slug }));
  };

  useEffect(() => {
    if (formData.title && !formData.slug) generateSlug();
  }, [formData.title]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  // ------------------- ITINERARY -------------------
  const addItineraryItem = () => {
    setFormData(prev => ({
      ...prev,
      itinerary: [
        ...prev.itinerary,
        {
          day_number: prev.itinerary.length + 1,
          title: '',
          description: '',
          altitude: '',
          trekking_hours: '',
          distance_km: '',
          accommodation: '',
          meal_info: '',
          day_image: ''
        }
      ]
    }));
  };
  const updateItineraryItem = (idx, field, value) => {
    const updated = [...formData.itinerary];
    updated[idx][field] = value;
    if (field === 'day_number') updated[idx].day_number = parseInt(value) || idx + 1;
    setFormData(prev => ({ ...prev, itinerary: updated }));
  };
  const removeItineraryItem = (idx) => {
    const updated = formData.itinerary.filter((_, i) => i !== idx);
    updated.forEach((item, i) => { item.day_number = i + 1; });
    setFormData(prev => ({ ...prev, itinerary: updated }));
  };

  // ------------------- FEATURES (included / excluded) -------------------
  const addFeature = (type) => {
    setFormData(prev => ({
      ...prev,
      features: [...prev.features, { feature_type: type, description: '' }]
    }));
  };
  const updateFeature = (idx, field, value) => {
    const updated = [...formData.features];
    updated[idx][field] = value;
    setFormData(prev => ({ ...prev, features: updated }));
  };
  const removeFeature = (idx) => {
    setFormData(prev => ({ ...prev, features: prev.features.filter((_, i) => i !== idx) }));
  };

  // ------------------- FAQS -------------------
  const addFaq = () => {
    setFormData(prev => ({
      ...prev,
      faqs: [...prev.faqs, { question: '', answer: '' }]
    }));
  };
  const updateFaq = (idx, field, value) => {
    const updated = [...formData.faqs];
    updated[idx][field] = value;
    setFormData(prev => ({ ...prev, faqs: updated }));
  };
  const removeFaq = (idx) => {
    setFormData(prev => ({ ...prev, faqs: prev.faqs.filter((_, i) => i !== idx) }));
  };

  // ------------------- AVAILABLE DATES -------------------
  const addDate = () => {
    setFormData(prev => ({
      ...prev,
      available_dates: [...prev.available_dates, { start_date: '', end_date: '', status: 'available', price: '' }]
    }));
  };
  const updateDate = (idx, field, value) => {
    const updated = [...formData.available_dates];
    updated[idx][field] = value;
    setFormData(prev => ({ ...prev, available_dates: updated }));
  };
  const removeDate = (idx) => {
    setFormData(prev => ({ ...prev, available_dates: prev.available_dates.filter((_, i) => i !== idx) }));
  };

  // ------------------- GALLERY IMAGES -------------------
  const addGalleryImage = () => {
    setFormData(prev => ({
      ...prev,
      gallery_images: [...prev.gallery_images, { image_url: '', title: '' }]
    }));
  };
  const updateGalleryImage = (idx, field, value) => {
    const updated = [...formData.gallery_images];
    updated[idx][field] = value;
    setFormData(prev => ({ ...prev, gallery_images: updated }));
  };
  const removeGalleryImage = (idx) => {
    setFormData(prev => ({ ...prev, gallery_images: prev.gallery_images.filter((_, i) => i !== idx) }));
  };

  // ------------------- DOCUMENTS -------------------
  const addDocument = () => {
    setFormData(prev => ({
      ...prev,
      documents: [...prev.documents, { title: '', file_url: '' }]
    }));
  };
  const updateDocument = (idx, field, value) => {
    const updated = [...formData.documents];
    updated[idx][field] = value;
    setFormData(prev => ({ ...prev, documents: updated }));
  };
  const removeDocument = (idx) => {
    setFormData(prev => ({ ...prev, documents: prev.documents.filter((_, i) => i !== idx) }));
  };

  // ------------------- FORM VALIDATION -------------------
  const validate = () => {
    const newErrors = {};
    if (!formData.title) newErrors.title = 'Title is required';
    if (!formData.slug) newErrors.slug = 'Slug is required';
    if (!formData.duration_days) newErrors.duration_days = 'Duration is required';
    if (!formData.price) newErrors.price = 'Price is required';
    if (!formData.overview) newErrors.overview = 'Overview is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ------------------- SUBMIT -------------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const res = await fetch('/api/packages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        router.push('/admin/packages');
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to create package');
      }
    } catch (err) {
      alert('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="px-4 sm:px-6 py-6 max-w-5xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/admin/packages" className="text-gray-600 hover:text-accent-color">
          <FontAwesomeIcon icon={faArrowLeft} className="w-5 h-5" />
        </Link>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Add New Package</h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow p-6 space-y-8">
        {/* ===== BASIC INFORMATION ===== */}
        <section className="border-b pb-6">
          <h2 className="text-lg font-semibold mb-4">Basic Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Title *</label>
              <input
                name="title"
                value={formData.title}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg ${errors.title ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Slug</label>
              <div className="flex gap-2">
                <input
                  name="slug"
                  value={formData.slug}
                  onChange={handleChange}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                />
                <button type="button" onClick={generateSlug} className="px-3 py-2 bg-gray-100 rounded-lg">
                  <FontAwesomeIcon icon={faSync} />
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Duration (days) *</label>
              <input
                type="number"
                name="duration_days"
                value={formData.duration_days}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Price (USD) *</label>
              <input
                type="number"
                step="0.01"
                name="price"
                value={formData.price}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Difficulty *</label>
              <select
                name="difficulty"
                value={formData.difficulty}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              >
                <option value="easy">Easy</option>
                <option value="moderate">Moderate</option>
                <option value="challenging">Challenging</option>
                <option value="difficult">Difficult</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Max Altitude (m)</label>
              <input
                type="number"
                name="max_altitude"
                value={formData.max_altitude}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Group Size (min – max)</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  name="group_size_min"
                  value={formData.group_size_min}
                  onChange={handleChange}
                  className="w-1/2 px-3 py-2 border border-gray-300 rounded-lg"
                />
                <input
                  type="number"
                  name="group_size_max"
                  value={formData.group_size_max}
                  onChange={handleChange}
                  className="w-1/2 px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Best Season</label>
              <input
                type="text"
                name="best_season"
                value={formData.best_season}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                placeholder="e.g. Spring (Mar–May) & Autumn (Sep–Nov)"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Short Description</label>
              <textarea
                name="short_description"
                rows={2}
                value={formData.short_description}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
          </div>
        </section>

        {/* ===== OVERVIEW (RICH TEXT or HTML) ===== */}
        <section className="border-b pb-6">
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium">Overview (Main Description) *</label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setOverviewMode('richtext')}
                className={`px-3 py-1 text-sm rounded ${overviewMode === 'richtext' ? 'bg-accent-color text-white' : 'bg-gray-200'}`}
              >
                Rich Text
              </button>
              <button
                type="button"
                onClick={() => setOverviewMode('html')}
                className={`px-3 py-1 text-sm rounded ${overviewMode === 'html' ? 'bg-accent-color text-white' : 'bg-gray-200'}`}
              >
                HTML Code
              </button>
            </div>
          </div>
          {overviewMode === 'richtext' ? (
            <TipTapEditor
              value={formData.overview}
              onChange={(html) => setFormData(prev => ({ ...prev, overview: html }))}
              placeholder="Describe the trek in detail – itinerary highlights, cultural experiences, etc."
            />
          ) : (
            <textarea
              name="overview"
              rows={10}
              value={formData.overview}
              onChange={handleChange}
              className="w-full px-3 py-2 border font-mono text-sm rounded-lg"
              placeholder="<p>Paste HTML content here...</p>"
            />
          )}
          {errors.overview && <p className="text-red-500 text-xs mt-1">{errors.overview}</p>}
        </section>

        {/* ===== HIGHLIGHTS (simple HTML) ===== */}
        <section className="border-b pb-6">
          <label className="block text-sm font-medium mb-1">Highlights (HTML list)</label>
          <textarea
            name="highlights"
            rows={4}
            value={formData.highlights}
            onChange={handleChange}
            className="w-full px-3 py-2 border font-mono text-sm rounded-lg"
            placeholder="<ul><li>Highlight 1</li><li>Highlight 2</li></ul>"
          />
        </section>

        {/* ===== ITINERARY ===== */}
        <section className="border-b pb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Itinerary</h2>
            <button type="button" onClick={addItineraryItem} className="text-accent-color text-sm">
              <FontAwesomeIcon icon={faPlus} /> Add Day
            </button>
          </div>
          {formData.itinerary.map((item, idx) => (
            <div key={idx} className="bg-gray-50 p-4 rounded-lg mb-4 border">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-medium">Day {item.day_number}</h3>
                <button type="button" onClick={() => removeItineraryItem(idx)} className="text-red-500">
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Title"
                  value={item.title}
                  onChange={(e) => updateItineraryItem(idx, 'title', e.target.value)}
                  className="px-3 py-1 border rounded"
                />
                <textarea
                  placeholder="Description"
                  rows={2}
                  value={item.description}
                  onChange={(e) => updateItineraryItem(idx, 'description', e.target.value)}
                  className="px-3 py-1 border rounded col-span-2"
                />
                <input
                  type="number"
                  placeholder="Altitude (m)"
                  value={item.altitude}
                  onChange={(e) => updateItineraryItem(idx, 'altitude', e.target.value)}
                  className="px-3 py-1 border rounded"
                />
                <input
                  type="text"
                  placeholder="Trekking hours (e.g. 5-6)"
                  value={item.trekking_hours}
                  onChange={(e) => updateItineraryItem(idx, 'trekking_hours', e.target.value)}
                  className="px-3 py-1 border rounded"
                />
                <input
                  type="text"
                  placeholder="Distance (km)"
                  value={item.distance_km}
                  onChange={(e) => updateItineraryItem(idx, 'distance_km', e.target.value)}
                  className="px-3 py-1 border rounded"
                />
                <input
                  type="text"
                  placeholder="Accommodation"
                  value={item.accommodation}
                  onChange={(e) => updateItineraryItem(idx, 'accommodation', e.target.value)}
                  className="px-3 py-1 border rounded"
                />
                <input
                  type="text"
                  placeholder="Meal info"
                  value={item.meal_info}
                  onChange={(e) => updateItineraryItem(idx, 'meal_info', e.target.value)}
                  className="px-3 py-1 border rounded"
                />
                <input
                  type="text"
                  placeholder="Day image URL"
                  value={item.day_image}
                  onChange={(e) => updateItineraryItem(idx, 'day_image', e.target.value)}
                  className="px-3 py-1 border rounded col-span-2"
                />
              </div>
            </div>
          ))}
        </section>

        {/* ===== FEATURES (Included/Excluded) ===== */}
        <section className="border-b pb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Included / Excluded</h2>
            <div className="flex gap-2">
              <button type="button" onClick={() => addFeature('included')} className="text-green-600 text-sm">
                <FontAwesomeIcon icon={faPlus} /> Add Included
              </button>
              <button type="button" onClick={() => addFeature('excluded')} className="text-red-600 text-sm">
                <FontAwesomeIcon icon={faPlus} /> Add Excluded
              </button>
            </div>
          </div>
          {formData.features.map((feat, idx) => (
            <div key={idx} className="flex gap-2 items-start mb-2">
              <span className={`text-sm font-medium w-24 ${feat.feature_type === 'included' ? 'text-green-600' : 'text-red-600'}`}>
                {feat.feature_type === 'included' ? 'Included' : 'Excluded'}
              </span>
              <input
                type="text"
                value={feat.description}
                onChange={(e) => updateFeature(idx, 'description', e.target.value)}
                className="flex-1 px-3 py-1 border rounded"
                placeholder="Feature description"
              />
              <button type="button" onClick={() => removeFeature(idx)} className="text-red-500">
                <FontAwesomeIcon icon={faTrash} />
              </button>
            </div>
          ))}
        </section>

        {/* ===== FAQS ===== */}
        <section className="border-b pb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">FAQs</h2>
            <button type="button" onClick={addFaq} className="text-accent-color text-sm">
              <FontAwesomeIcon icon={faPlus} /> Add FAQ
            </button>
          </div>
          {formData.faqs.map((faq, idx) => (
            <div key={idx} className="bg-gray-50 p-3 rounded mb-3 border">
              <div className="flex justify-between">
                <input
                  type="text"
                  placeholder="Question"
                  value={faq.question}
                  onChange={(e) => updateFaq(idx, 'question', e.target.value)}
                  className="flex-1 px-3 py-1 border rounded mb-2"
                />
                <button type="button" onClick={() => removeFaq(idx)} className="ml-2 text-red-500">
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </div>
              <textarea
                placeholder="Answer"
                rows={2}
                value={faq.answer}
                onChange={(e) => updateFaq(idx, 'answer', e.target.value)}
                className="w-full px-3 py-1 border rounded"
              />
            </div>
          ))}
        </section>

        {/* ===== ESSENTIAL INFORMATION ===== */}
        <section className="border-b pb-6">
          <label className="block text-sm font-medium mb-1">Essential Information</label>
          <textarea
            name="essential_info"
            rows={4}
            value={formData.essential_info}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            placeholder="Packing list, visa info, insurance requirements, etc."
          />
        </section>

        {/* ===== AVAILABLE DATES ===== */}
        <section className="border-b pb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Available Dates</h2>
            <button type="button" onClick={addDate} className="text-accent-color text-sm">
              <FontAwesomeIcon icon={faPlus} /> Add Date
            </button>
          </div>
          {formData.available_dates.map((date, idx) => (
            <div key={idx} className="flex flex-wrap gap-2 items-center mb-2">
              <input
                type="date"
                value={date.start_date}
                onChange={(e) => updateDate(idx, 'start_date', e.target.value)}
                className="px-2 py-1 border rounded"
              />
              <span>→</span>
              <input
                type="date"
                value={date.end_date}
                onChange={(e) => updateDate(idx, 'end_date', e.target.value)}
                className="px-2 py-1 border rounded"
              />
              <select
                value={date.status}
                onChange={(e) => updateDate(idx, 'status', e.target.value)}
                className="px-2 py-1 border rounded"
              >
                <option value="available">Available</option>
                <option value="limited">Limited</option>
                <option value="full">Full</option>
              </select>
              <input
                type="number"
                placeholder="Price (optional)"
                value={date.price}
                onChange={(e) => updateDate(idx, 'price', e.target.value)}
                className="px-2 py-1 border rounded w-24"
              />
              <button type="button" onClick={() => removeDate(idx)} className="text-red-500">
                <FontAwesomeIcon icon={faTrash} />
              </button>
            </div>
          ))}
        </section>

        {/* ===== GALLERY IMAGES ===== */}
        <section className="border-b pb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Gallery Images</h2>
            <button type="button" onClick={addGalleryImage} className="text-accent-color text-sm">
              <FontAwesomeIcon icon={faPlus} /> Add Image
            </button>
          </div>
          {formData.gallery_images.map((img, idx) => (
            <div key={idx} className="flex gap-2 mb-2">
              <input
                type="text"
                placeholder="Image URL"
                value={img.image_url}
                onChange={(e) => updateGalleryImage(idx, 'image_url', e.target.value)}
                className="flex-1 px-3 py-1 border rounded"
              />
              <input
                type="text"
                placeholder="Title (alt text)"
                value={img.title}
                onChange={(e) => updateGalleryImage(idx, 'title', e.target.value)}
                className="w-40 px-3 py-1 border rounded"
              />
              <button type="button" onClick={() => removeGalleryImage(idx)} className="text-red-500">
                <FontAwesomeIcon icon={faTrash} />
              </button>
            </div>
          ))}
        </section>

        {/* ===== DOCUMENTS ===== */}
        <section className="border-b pb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Documents (PDF, etc.)</h2>
            <button type="button" onClick={addDocument} className="text-accent-color text-sm">
              <FontAwesomeIcon icon={faPlus} /> Add Document
            </button>
          </div>
          {formData.documents.map((doc, idx) => (
            <div key={idx} className="flex gap-2 mb-2">
              <input
                type="text"
                placeholder="Document title"
                value={doc.title}
                onChange={(e) => updateDocument(idx, 'title', e.target.value)}
                className="w-48 px-3 py-1 border rounded"
              />
              <input
                type="text"
                placeholder="File URL"
                value={doc.file_url}
                onChange={(e) => updateDocument(idx, 'file_url', e.target.value)}
                className="flex-1 px-3 py-1 border rounded"
              />
              <button type="button" onClick={() => removeDocument(idx)} className="text-red-500">
                <FontAwesomeIcon icon={faTrash} />
              </button>
            </div>
          ))}
        </section>

        {/* ===== SEO & STATUS ===== */}
        <section>
          <h2 className="text-lg font-semibold mb-4">SEO & Status</h2>
          <div className="space-y-3">
            <input
              type="text"
              name="meta_title"
              value={formData.meta_title}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              placeholder="Meta Title (leave blank to auto-generate from title)"
            />
            <textarea
              name="meta_description"
              rows={2}
              value={formData.meta_description}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              placeholder="Meta Description (max 160 characters)"
            />
            <input
              type="text"
              name="keywords"
              value={formData.keywords}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              placeholder="Keywords (comma separated)"
            />
            <div className="flex flex-wrap gap-4">
              <label className="flex items-center gap-2">
                <input type="checkbox" name="is_active" checked={formData.is_active} onChange={handleChange} /> Active
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" name="is_featured" checked={formData.is_featured} onChange={handleChange} /> Featured
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" name="is_luxury" checked={formData.is_luxury} onChange={handleChange} /> Luxury
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" name="is_adventure" checked={formData.is_adventure} onChange={handleChange} /> Adventure
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" name="is_best_selling" checked={formData.is_best_selling} onChange={handleChange} /> Best Selling
              </label>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Featured Image URL</label>
              <input
                type="text"
                name="featured_image"
                value={formData.featured_image}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                placeholder="https://..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Map Image URL</label>
              <input
                type="text"
                name="map_image"
                value={formData.map_image}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                placeholder="https://..."
              />
            </div>
          </div>
        </section>

        {/* Submit Buttons */}
        <div className="flex justify-end gap-4 pt-4 border-t">
          <Link href="/admin/packages" className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
            Cancel
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-accent-color text-white rounded-lg flex items-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <>
                <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <FontAwesomeIcon icon={faSave} />
                Save Package
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}