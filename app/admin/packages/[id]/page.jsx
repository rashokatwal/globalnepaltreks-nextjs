// app/admin/packages/[id]/page.jsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowLeft, faSave, faSpinner, faSync, faPlus, faTrash,
  faRoute, faImage, faFileAlt, faCalendarAlt, faInfoCircle,
  faListUl, faCheckCircle, faTimesCircle, faQuestionCircle,
  faMountain, faSearch
} from '@fortawesome/free-solid-svg-icons';

const TipTapEditor = dynamic(() => import('../../../components/admin/TipTapEditor'), { ssr: false });

// Helper components (identical to new page)
const SectionHeader = ({ icon, title, subtitle }) => (
  <div className="flex items-center gap-3 mb-6">
    <div className="w-9 h-9 bg-gray-900 rounded-xl flex items-center justify-center shrink-0">
      <FontAwesomeIcon icon={icon} className="w-4 h-4 text-white" />
    </div>
    <div>
      <h2 className="text-base font-bold text-gray-900 leading-tight">{title}</h2>
      {subtitle && <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>}
    </div>
  </div>
);

const FormSection = ({ icon, title, subtitle, children, action }) => (
  <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
    <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
      <SectionHeader icon={icon} title={title} subtitle={subtitle} />
      {action && <div className="shrink-0">{action}</div>}
    </div>
    <div className="px-6 py-5">{children}</div>
  </div>
);

const Field = ({ label, required, error, children, className = '' }) => (
  <div className={className}>
    {label && (
      <label className="block text-sm font-medium text-gray-700 mb-1.5">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
    )}
    {children}
    {error && <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1"><span>⚠</span>{error}</p>}
  </div>
);

const inputCls = (error) =>
  `w-full px-3.5 py-2.5 border rounded-xl text-sm outline-none transition focus:ring-2 bg-gray-50 focus:bg-white ${
    error ? 'border-red-300 focus:ring-red-200 focus:border-red-400' : 'border-gray-200 focus:ring-gray-900/20 focus:border-gray-400'
  }`;

const AddBtn = ({ onClick, label, color = 'bg-gray-900 hover:bg-gray-700 text-white' }) => (
  <button type="button" onClick={onClick}
    className={`${color} text-xs font-semibold px-3.5 py-2 rounded-lg flex items-center gap-1.5 transition`}>
    <FontAwesomeIcon icon={faPlus} className="w-3 h-3" />{label}
  </button>
);

const RemoveBtn = ({ onClick }) => (
  <button type="button" onClick={onClick}
    className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition shrink-0">
    <FontAwesomeIcon icon={faTrash} className="w-3.5 h-3.5" />
  </button>
);

const EmptyState = ({ text }) => (
  <p className="text-sm text-gray-400 italic py-3 text-center border border-dashed border-gray-200 rounded-xl">{text}</p>
);

export default function EditPackagePage() {
  const router = useRouter();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const [overviewMode, setOverviewMode] = useState('richtext');
  const [countries, setCountries] = useState([]);
  const [activities, setActivities] = useState([]);

  const [formData, setFormData] = useState({
    country_id: '',
    activity_id: '',
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
    itinerary: [],
    features: [],
    faqs: [],
    available_dates: [],
    gallery_images: [],
    documents: [],
    essential_info: {
      trip_code: '', trip_type: '', accommodation_type: '', meal_included: '',
      transportation: '', best_time_description: '', difficulty_description: '',
      fitness_requirements: '', preparation_tips: '', equipment_list: '',
      health_considerations: '', safety_measures: '', permits_required: '',
      permit_cost: '', cultural_etiquette: '', local_customs: ''
    }
  });

  // Load options (countries, activities)
  useEffect(() => {
    async function fetchOptions() {
      try {
        const [cRes, aRes] = await Promise.all([fetch('/api/countries'), fetch('/api/activities')]);
        const cData = await cRes.json();
        const aData = await aRes.json();
        if (cData.success) setCountries(cData.data?.data || cData.data || []);
        if (aData.success) setActivities(aData.data?.data || aData.data || []);
      } catch (err) {
        console.error('Failed to load options:', err);
      }
    }
    fetchOptions();
  }, []);

  // Load package data
  useEffect(() => {
    async function fetchPackage() {
      try {
        const res = await fetch(`/api/packages/${id}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to load package');
        const pkg = data.data || data;
        // Parse available_dates if stored as JSON string
        let availableDates = pkg.available_dates;
        if (typeof availableDates === 'string') {
          try { availableDates = JSON.parse(availableDates); } catch(e) { availableDates = []; }
        }
        // Ensure essential_info is an object
        let essentialInfo = pkg.essential_info;
        if (typeof essentialInfo === 'string') {
          try { essentialInfo = JSON.parse(essentialInfo); } catch(e) { essentialInfo = {}; }
        }
        if (!essentialInfo || typeof essentialInfo !== 'object') essentialInfo = formData.essential_info;
        setFormData({
          ...pkg,
          available_dates: availableDates || [],
          essential_info: essentialInfo,
          // Ensure arrays exist
          itinerary: pkg.itinerary || [],
          features: pkg.features || [],
          faqs: pkg.faqs || [],
          gallery_images: pkg.gallery_images || pkg.gallery || [],
          documents: pkg.documents || []
        });
        setLoading(false);
      } catch (err) {
        console.error(err);
        alert('Failed to load package details');
        router.push('/admin/packages');
      }
    }
    if (id) fetchPackage();
  }, [id, router]);

  const generateSlug = () => {
    if (!formData.title) return;
    const slug = formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    setFormData(prev => ({ ...prev, slug }));
  };

  useEffect(() => {
    if (formData.title && !formData.slug) generateSlug();
  }, [formData.title]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleEssentialInfoChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, essential_info: { ...prev.essential_info, [name]: value } }));
  };

  // Itinerary
  const addItineraryItem = () => setFormData(prev => ({
    ...prev,
    itinerary: [...prev.itinerary, { day_number: prev.itinerary.length + 1, title: '', description: '', altitude: '', trekking_hours: '', distance_km: '', accommodation: '', meal_info: '', day_image: '' }]
  }));
  const updateItineraryItem = (idx, field, value) => {
    const updated = [...formData.itinerary];
    updated[idx][field] = value;
    setFormData(prev => ({ ...prev, itinerary: updated }));
  };
  const removeItineraryItem = (idx) => {
    setFormData(prev => ({
      ...prev,
      itinerary: prev.itinerary.filter((_, i) => i !== idx).map((item, i) => ({ ...item, day_number: i + 1 }))
    }));
  };

  // Features
  const addFeature = (type) => setFormData(prev => ({ ...prev, features: [...prev.features, { feature_type: type, description: '' }] }));
  const updateFeature = (idx, field, value) => { const u = [...formData.features]; u[idx][field] = value; setFormData(prev => ({ ...prev, features: u })); };
  const removeFeature = (idx) => setFormData(prev => ({ ...prev, features: prev.features.filter((_, i) => i !== idx) }));

  // FAQs
  const addFaq = () => setFormData(prev => ({ ...prev, faqs: [...prev.faqs, { question: '', answer: '' }] }));
  const updateFaq = (idx, field, value) => { const u = [...formData.faqs]; u[idx][field] = value; setFormData(prev => ({ ...prev, faqs: u })); };
  const removeFaq = (idx) => setFormData(prev => ({ ...prev, faqs: prev.faqs.filter((_, i) => i !== idx) }));

  // Dates
  const addDate = () => setFormData(prev => ({
    ...prev,
    available_dates: [...prev.available_dates, { start_date: '', end_date: '', available_slots: '', total_slots: '', price_multiplier: '1.00', is_guaranteed: false, status: 'available' }]
  }));
  const updateDate = (idx, field, value) => { const u = [...formData.available_dates]; u[idx][field] = value; setFormData(prev => ({ ...prev, available_dates: u })); };
  const removeDate = (idx) => setFormData(prev => ({ ...prev, available_dates: prev.available_dates.filter((_, i) => i !== idx) }));

  // Gallery
  const addGalleryImage = () => setFormData(prev => ({ ...prev, gallery_images: [...prev.gallery_images, { image_url: '', title: '' }] }));
  const updateGalleryImage = (idx, field, value) => { const u = [...formData.gallery_images]; u[idx][field] = value; setFormData(prev => ({ ...prev, gallery_images: u })); };
  const removeGalleryImage = (idx) => setFormData(prev => ({ ...prev, gallery_images: prev.gallery_images.filter((_, i) => i !== idx) }));

  // Documents
  const addDocument = () => setFormData(prev => ({ ...prev, documents: [...prev.documents, { title: '', file_url: '' }] }));
  const updateDocument = (idx, field, value) => { const u = [...formData.documents]; u[idx][field] = value; setFormData(prev => ({ ...prev, documents: u })); };
  const removeDocument = (idx) => setFormData(prev => ({ ...prev, documents: prev.documents.filter((_, i) => i !== idx) }));

  const validate = () => {
    const e = {};
    if (!formData.title) e.title = 'Title is required';
    if (!formData.slug) e.slug = 'Slug is required';
    if (!formData.country_id) e.country_id = 'Country is required';
    if (!formData.activity_id) e.activity_id = 'Activity is required';
    if (!formData.duration_days) e.duration_days = 'Duration is required';
    if (!formData.price) e.price = 'Price is required';
    if (!formData.overview) e.overview = 'Overview is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) { window.scrollTo({ top: 0, behavior: 'smooth' }); return; }
    setSaving(true);
    try {
      const essentialInfoFilled = Object.values(formData.essential_info).some(v => v !== '');
      const payload = { ...formData, essential_info: essentialInfoFilled ? formData.essential_info : null };
      const res = await fetch(`/api/packages/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        router.push('/admin/packages');
      } else {
        alert(data.error || data.message || 'Failed to update package');
      }
    } catch (err) {
      alert('Something went wrong. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        <span className="ml-3 text-gray-600">Loading package details...</span>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 py-8 max-w-4xl mx-auto">

      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/packages"
          className="w-9 h-9 bg-white border border-gray-200 rounded-xl flex items-center justify-center text-gray-500 hover:text-gray-800 hover:border-gray-300 transition shadow-sm">
          <FontAwesomeIcon icon={faArrowLeft} className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Edit Package</h1>
          <p className="text-sm text-gray-400 mt-0.5">Update package details and related information</p>
        </div>
      </div>

      {/* Error summary */}
      {Object.keys(errors).length > 0 && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
          <p className="text-red-700 font-semibold text-sm mb-2">Please fix these errors before saving:</p>
          <ul className="space-y-0.5">
            {Object.values(errors).map((err, i) => (
              <li key={i} className="text-red-600 text-sm flex items-center gap-1.5">
                <span className="text-red-400">·</span>{err}
              </li>
            ))}
          </ul>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">

        {/* ── BASIC INFO ── (identical to new page) */}
        <FormSection icon={faMountain} title="Basic Information" subtitle="Core details about the package">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Country" required error={errors.country_id}>
              <select name="country_id" value={formData.country_id} onChange={handleChange} className={inputCls(errors.country_id)}>
                <option value="">Select country…</option>
                {countries.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </Field>
            <Field label="Activity" required error={errors.activity_id}>
              <select name="activity_id" value={formData.activity_id} onChange={handleChange} className={inputCls(errors.activity_id)}>
                <option value="">Select activity…</option>
                {activities.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
              </select>
            </Field>
            <Field label="Title" required error={errors.title} className="md:col-span-2">
              <input name="title" value={formData.title} onChange={handleChange} placeholder="e.g. Everest Base Camp Trek" className={inputCls(errors.title)} />
            </Field>
            <Field label="Slug" error={errors.slug} className="md:col-span-2">
              <div className="flex gap-2">
                <input name="slug" value={formData.slug} onChange={handleChange} placeholder="auto-generated-from-title" className={`flex-1 ${inputCls(errors.slug)}`} />
                <button type="button" onClick={generateSlug} className="px-4 bg-gray-100 hover:bg-gray-200 border border-gray-200 rounded-xl transition text-gray-600">
                  <FontAwesomeIcon icon={faSync} className="w-4 h-4" />
                </button>
              </div>
            </Field>
            <Field label="Duration (days)" required error={errors.duration_days}>
              <input type="number" name="duration_days" value={formData.duration_days} onChange={handleChange} min="1" placeholder="14" className={inputCls(errors.duration_days)} />
            </Field>
            <Field label="Price (USD)" required error={errors.price}>
              <input type="number" step="0.01" name="price" value={formData.price} onChange={handleChange} min="0" placeholder="1200" className={inputCls(errors.price)} />
            </Field>
            <Field label="Difficulty">
              <select name="difficulty" value={formData.difficulty} onChange={handleChange} className={inputCls()}>
                <option value="easy">Easy</option>
                <option value="moderate">Moderate</option>
                <option value="challenging">Challenging</option>
                <option value="difficult">Difficult</option>
              </select>
            </Field>
            <Field label="Max Altitude (m)">
              <input type="number" name="max_altitude" value={formData.max_altitude} onChange={handleChange} placeholder="5364" className={inputCls()} />
            </Field>
            <Field label="Group Size Min">
              <input type="number" name="group_size_min" value={formData.group_size_min} onChange={handleChange} min="1" className={inputCls()} />
            </Field>
            <Field label="Group Size Max">
              <input type="number" name="group_size_max" value={formData.group_size_max} onChange={handleChange} min="1" className={inputCls()} />
            </Field>
            <Field label="Best Season" className="md:col-span-2">
              <input name="best_season" value={formData.best_season} onChange={handleChange} placeholder="Spring (Mar–May) & Autumn (Sep–Nov)" className={inputCls()} />
            </Field>
            <Field label="Short Description" className="md:col-span-2">
              <textarea name="short_description" rows={2} value={formData.short_description} onChange={handleChange} placeholder="Brief summary shown on package cards (max 300 characters)" className={inputCls()} />
            </Field>
          </div>
        </FormSection>

        {/* ── OVERVIEW ── */}
        <FormSection icon={faFileAlt} title="Overview" subtitle="Main description displayed on the package page">
          <div className="flex gap-2 mb-4">
            {['richtext', 'html'].map(mode => (
              <button key={mode} type="button" onClick={() => setOverviewMode(mode)}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition ${
                  overviewMode === mode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}>
                {mode === 'richtext' ? 'Rich Text' : 'HTML'}
              </button>
            ))}
          </div>
          {overviewMode === 'richtext' ? (
            <TipTapEditor value={formData.overview} onChange={(html) => setFormData(prev => ({ ...prev, overview: html }))} placeholder="Describe the trek in detail…" />
          ) : (
            <textarea name="overview" rows={10} value={formData.overview} onChange={handleChange} className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl font-mono text-sm bg-gray-50 focus:bg-white focus:ring-2 focus:ring-gray-900/20 focus:border-gray-400 outline-none transition" placeholder="<p>Paste HTML here…</p>" />
          )}
          {errors.overview && <p className="text-red-500 text-xs mt-1.5">⚠ {errors.overview}</p>}
        </FormSection>

        {/* ── HIGHLIGHTS ── */}
        <FormSection icon={faListUl} title="Highlights" subtitle="HTML list of key selling points">
          <textarea name="highlights" rows={4} value={formData.highlights} onChange={handleChange} className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl font-mono text-sm bg-gray-50 focus:bg-white focus:ring-2 focus:ring-gray-900/20 focus:border-gray-400 outline-none transition" placeholder="<ul><li>Trek to Everest Base Camp at 5,364m</li><li>Fly to Lukla</li></ul>" />
        </FormSection>

        {/* ── ITINERARY ── */}
        <FormSection icon={faRoute} title="Itinerary" subtitle={`${formData.itinerary.length} day${formData.itinerary.length !== 1 ? 's' : ''} added`} action={<AddBtn onClick={addItineraryItem} label="Add Day" />}>
          {formData.itinerary.length === 0 ? <EmptyState text="No itinerary days added yet. Click 'Add Day' to start." /> : formData.itinerary.map((item, idx) => (
            <div key={idx} className="mb-4 border border-gray-200 rounded-xl overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b border-gray-200">
                <span className="text-sm font-bold text-gray-700">Day {item.day_number}</span>
                <RemoveBtn onClick={() => removeItineraryItem(idx)} />
              </div>
              <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-3">
                <input placeholder="Day title" value={item.title} onChange={(e) => updateItineraryItem(idx, 'title', e.target.value)} className={`${inputCls()} md:col-span-2`} />
                <textarea placeholder="Description" rows={2} value={item.description} onChange={(e) => updateItineraryItem(idx, 'description', e.target.value)} className={`${inputCls()} md:col-span-2`} />
                <input type="number" placeholder="Altitude (m)" value={item.altitude} onChange={(e) => updateItineraryItem(idx, 'altitude', e.target.value)} className={inputCls()} />
                <input placeholder="Trekking hours (e.g. 5–6)" value={item.trekking_hours} onChange={(e) => updateItineraryItem(idx, 'trekking_hours', e.target.value)} className={inputCls()} />
                <input placeholder="Distance (km)" value={item.distance_km} onChange={(e) => updateItineraryItem(idx, 'distance_km', e.target.value)} className={inputCls()} />
                <input placeholder="Accommodation" value={item.accommodation} onChange={(e) => updateItineraryItem(idx, 'accommodation', e.target.value)} className={inputCls()} />
                <input placeholder="Meal info (e.g. B/L/D)" value={item.meal_info} onChange={(e) => updateItineraryItem(idx, 'meal_info', e.target.value)} className={inputCls()} />
                <input placeholder="Day image URL" value={item.day_image} onChange={(e) => updateItineraryItem(idx, 'day_image', e.target.value)} className={inputCls()} />
              </div>
            </div>
          ))}
        </FormSection>

        {/* ── INCLUDED / EXCLUDED ── */}
        <FormSection
          icon={faCheckCircle}
          title="Included & Excluded"
          subtitle={`${formData.features.length} item${formData.features.length !== 1 ? 's' : ''}`}
          action={
            <div className="flex gap-2">
              <AddBtn onClick={() => addFeature('included')} label="Included" color="bg-emerald-600 hover:bg-emerald-700 text-white" />
              <AddBtn onClick={() => addFeature('excluded')} label="Excluded" color="bg-red-500 hover:bg-red-600 text-white" />
            </div>
          }
        >
          {formData.features.length === 0 ? <EmptyState text="No inclusions or exclusions added yet." /> : (
            <div className="space-y-2">
              {formData.features.map((feat, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${feat.feature_type === 'included' ? 'bg-emerald-100' : 'bg-red-100'}`}>
                    <FontAwesomeIcon icon={feat.feature_type === 'included' ? faCheckCircle : faTimesCircle} className={`w-3.5 h-3.5 ${feat.feature_type === 'included' ? 'text-emerald-600' : 'text-red-500'}`} />
                  </div>
                  <input value={feat.description} onChange={(e) => updateFeature(idx, 'description', e.target.value)} placeholder={feat.feature_type === 'included' ? 'What is included…' : 'What is excluded…'} className={`flex-1 ${inputCls()}`} />
                  <RemoveBtn onClick={() => removeFeature(idx)} />
                </div>
              ))}
            </div>
          )}
        </FormSection>

        {/* ── FAQS ── */}
        <FormSection icon={faQuestionCircle} title="FAQs" subtitle={`${formData.faqs.length} question${formData.faqs.length !== 1 ? 's' : ''}`} action={<AddBtn onClick={addFaq} label="Add FAQ" />}>
          {formData.faqs.length === 0 ? <EmptyState text="No FAQs added yet." /> : formData.faqs.map((faq, idx) => (
            <div key={idx} className="mb-3 border border-gray-200 rounded-xl overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-3 bg-gray-50 border-b border-gray-200">
                <input placeholder="Question" value={faq.question} onChange={(e) => updateFaq(idx, 'question', e.target.value)} className="flex-1 bg-transparent text-sm font-medium text-gray-800 outline-none placeholder:text-gray-400" />
                <RemoveBtn onClick={() => removeFaq(idx)} />
              </div>
              <div className="p-3">
                <textarea placeholder="Answer" rows={2} value={faq.answer} onChange={(e) => updateFaq(idx, 'answer', e.target.value)} className="w-full text-sm bg-transparent outline-none text-gray-700 placeholder:text-gray-400 resize-none" />
              </div>
            </div>
          ))}
        </FormSection>

        {/* ── AVAILABLE DATES ── */}
        <FormSection icon={faCalendarAlt} title="Available Dates" subtitle={`${formData.available_dates.length} date${formData.available_dates.length !== 1 ? 's' : ''} scheduled`} action={<AddBtn onClick={addDate} label="Add Date" />}>
          {formData.available_dates.length === 0 ? <EmptyState text="No departure dates added yet." /> : formData.available_dates.map((date, idx) => (
            <div key={idx} className="mb-3 border border-gray-200 rounded-xl overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b border-gray-200">
                <span className="text-sm font-semibold text-gray-700">Departure {idx + 1}</span>
                <RemoveBtn onClick={() => removeDate(idx)} />
              </div>
              <div className="p-4 grid grid-cols-2 md:grid-cols-4 gap-3">
                <Field label="Start Date"><input type="date" value={date.start_date} onChange={(e) => updateDate(idx, 'start_date', e.target.value)} className={inputCls()} /></Field>
                <Field label="End Date"><input type="date" value={date.end_date} onChange={(e) => updateDate(idx, 'end_date', e.target.value)} className={inputCls()} /></Field>
                <Field label="Total Slots"><input type="number" min="0" value={date.total_slots} onChange={(e) => updateDate(idx, 'total_slots', e.target.value)} className={inputCls()} /></Field>
                <Field label="Available Slots"><input type="number" min="0" value={date.available_slots} onChange={(e) => updateDate(idx, 'available_slots', e.target.value)} className={inputCls()} /></Field>
                <Field label="Price Multiplier"><input type="number" step="0.01" min="0.01" value={date.price_multiplier} onChange={(e) => updateDate(idx, 'price_multiplier', e.target.value)} className={inputCls()} /></Field>
                <Field label="Status"><select value={date.status} onChange={(e) => updateDate(idx, 'status', e.target.value)} className={inputCls()}><option value="available">Available</option><option value="limited">Limited</option><option value="full">Full</option><option value="cancelled">Cancelled</option></select></Field>
                <div className="flex items-end pb-0.5"><label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={date.is_guaranteed} onChange={(e) => updateDate(idx, 'is_guaranteed', e.target.checked)} className="w-4 h-4 rounded accent-gray-900" /><span className="text-sm text-gray-700 font-medium">Guaranteed</span></label></div>
              </div>
            </div>
          ))}
        </FormSection>

        {/* ── GALLERY ── */}
        <FormSection icon={faImage} title="Gallery" subtitle={`${formData.gallery_images.length} image${formData.gallery_images.length !== 1 ? 's' : ''}`} action={<AddBtn onClick={addGalleryImage} label="Add Image" />}>
          {formData.gallery_images.length === 0 ? <EmptyState text="No gallery images added yet." /> : formData.gallery_images.map((img, idx) => (
            <div key={idx} className="flex gap-2 mb-2">
              <input placeholder="Image URL (https://…)" value={img.image_url} onChange={(e) => updateGalleryImage(idx, 'image_url', e.target.value)} className={`flex-1 ${inputCls()}`} />
              <input placeholder="Alt text" value={img.title} onChange={(e) => updateGalleryImage(idx, 'title', e.target.value)} className={`w-40 ${inputCls()}`} />
              <RemoveBtn onClick={() => removeGalleryImage(idx)} />
            </div>
          ))}
        </FormSection>

        {/* ── DOCUMENTS ── */}
        <FormSection icon={faFileAlt} title="Documents" subtitle="PDFs, permits, or other downloadable files" action={<AddBtn onClick={addDocument} label="Add Document" />}>
          {formData.documents.length === 0 ? <EmptyState text="No documents added yet." /> : formData.documents.map((doc, idx) => (
            <div key={idx} className="flex gap-2 mb-2">
              <input placeholder="Document title" value={doc.title} onChange={(e) => updateDocument(idx, 'title', e.target.value)} className={`w-48 ${inputCls()}`} />
              <input placeholder="File URL" value={doc.file_url} onChange={(e) => updateDocument(idx, 'file_url', e.target.value)} className={`flex-1 ${inputCls()}`} />
              <RemoveBtn onClick={() => removeDocument(idx)} />
            </div>
          ))}
        </FormSection>

        {/* ── ESSENTIAL INFO ── */}
        <FormSection icon={faInfoCircle} title="Essential Information" subtitle="Trip details, requirements, and logistical info">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { name: 'trip_code', label: 'Trip Code', placeholder: 'EBC-001', type: 'text' },
              { name: 'trip_type', label: 'Trip Type', placeholder: 'Trekking, Peak Climbing', type: 'text' },
              { name: 'accommodation_type', label: 'Accommodation Type', placeholder: 'Tea House, Lodge, Camping', type: 'text' },
              { name: 'meal_included', label: 'Meals Included', placeholder: 'Breakfast, Lunch, Dinner', type: 'text' },
              { name: 'transportation', label: 'Transportation', placeholder: 'Flight to Lukla, Private car', type: 'text' },
              { name: 'permit_cost', label: 'Permit Cost (USD)', placeholder: '0.00', type: 'number' },
            ].map(({ name, label, placeholder, type }) => (
              <Field key={name} label={label}>
                <input type={type} name={name} value={formData.essential_info[name]} onChange={handleEssentialInfoChange} placeholder={placeholder} step={type === 'number' ? '0.01' : undefined} className={inputCls()} />
              </Field>
            ))}
            {[
              { name: 'best_time_description', label: 'Best Time to Visit' },
              { name: 'difficulty_description', label: 'Difficulty Description' },
              { name: 'fitness_requirements', label: 'Fitness Requirements' },
              { name: 'preparation_tips', label: 'Preparation Tips' },
              { name: 'equipment_list', label: 'Equipment List' },
              { name: 'health_considerations', label: 'Health Considerations' },
              { name: 'safety_measures', label: 'Safety Measures' },
              { name: 'permits_required', label: 'Permits Required' },
              { name: 'cultural_etiquette', label: 'Cultural Etiquette' },
              { name: 'local_customs', label: 'Local Customs' },
            ].map(({ name, label }) => (
              <Field key={name} label={label} className="md:col-span-2">
                <textarea name={name} rows={2} value={formData.essential_info[name]} onChange={handleEssentialInfoChange} className={inputCls()} />
              </Field>
            ))}
          </div>
        </FormSection>

        {/* ── SEO & STATUS ── */}
        <FormSection icon={faSearch} title="SEO & Visibility" subtitle="Search engine metadata and publish settings">
          <div className="space-y-4">
            <Field label="Meta Title"><input name="meta_title" value={formData.meta_title} onChange={handleChange} placeholder="Leave blank to use package title" className={inputCls()} /></Field>
            <Field label="Meta Description"><textarea name="meta_description" rows={2} value={formData.meta_description} onChange={handleChange} placeholder="Max 160 characters" className={inputCls()} /></Field>
            <Field label="Keywords"><input name="keywords" value={formData.keywords} onChange={handleChange} placeholder="everest base camp, nepal trekking, himalaya" className={inputCls()} /></Field>
            <Field label="Featured Image URL"><input name="featured_image" value={formData.featured_image} onChange={handleChange} placeholder="https://…" className={inputCls()} /></Field>
            <Field label="Map Image URL"><input name="map_image" value={formData.map_image || ''} onChange={handleChange} placeholder="https://…" className={inputCls()} /></Field>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2">
              {[
                { name: 'is_active', label: 'Active', color: 'emerald' },
                { name: 'is_featured', label: 'Featured', color: 'blue' },
                { name: 'is_luxury', label: 'Luxury', color: 'purple' },
                { name: 'is_adventure', label: 'Adventure', color: 'orange' },
                { name: 'is_best_selling', label: 'Best Selling', color: 'amber' },
              ].map(({ name, label, color }) => (
                <label key={name} className={`flex items-center gap-2.5 cursor-pointer p-3 rounded-xl border transition ${formData[name] ? `bg-${color}-50 border-${color}-200` : 'bg-gray-50 border-gray-200 hover:border-gray-300'}`}>
                  <input type="checkbox" name={name} checked={formData[name]} onChange={handleChange} className="w-4 h-4 rounded" />
                  <span className={`text-xs font-semibold ${formData[name] ? `text-${color}-700` : 'text-gray-600'}`}>{label}</span>
                </label>
              ))}
            </div>
          </div>
        </FormSection>

        {/* Submit buttons */}
        <div className="flex items-center justify-between pt-2 pb-8">
          <Link href="/admin/packages" className="px-5 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition">Cancel</Link>
          <button type="submit" disabled={saving} className="bg-gray-900 hover:bg-gray-700 disabled:opacity-60 text-white px-7 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2.5 transition shadow-sm">
            {saving ? <><FontAwesomeIcon icon={faSpinner} className="animate-spin w-4 h-4" /> Saving…</> : <><FontAwesomeIcon icon={faSave} className="w-4 h-4" /> Update Package</>}
          </button>
        </div>
      </form>
    </div>
  );
}