// app/admin/packages/new/page.jsx (or edit page)

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faArrowLeft, 
  faSave, 
  faSpinner,
  faSync,
  faPlus,
  faTrash
} from '@fortawesome/free-solid-svg-icons';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';

// Menu bar component for TipTap
const MenuBar = ({ editor }) => {
  if (!editor) return null;
  return (
    <div className="border border-gray-300 rounded-t-lg p-2 flex flex-wrap gap-1 bg-gray-50">
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={`px-2 py-1 rounded ${editor.isActive('bold') ? 'bg-gray-300' : 'hover:bg-gray-200'}`}
      >
        Bold
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={`px-2 py-1 rounded ${editor.isActive('italic') ? 'bg-gray-300' : 'hover:bg-gray-200'}`}
      >
        Italic
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={`px-2 py-1 rounded ${editor.isActive('heading', { level: 1 }) ? 'bg-gray-300' : 'hover:bg-gray-200'}`}
      >
        H1
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={`px-2 py-1 rounded ${editor.isActive('heading', { level: 2 }) ? 'bg-gray-300' : 'hover:bg-gray-200'}`}
      >
        H2
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={`px-2 py-1 rounded ${editor.isActive('bulletList') ? 'bg-gray-300' : 'hover:bg-gray-200'}`}
      >
        Bullet List
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={`px-2 py-1 rounded ${editor.isActive('orderedList') ? 'bg-gray-300' : 'hover:bg-gray-200'}`}
      >
        Numbered List
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().setHorizontalRule().run()}
        className="px-2 py-1 rounded hover:bg-gray-200"
      >
        HR
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().undo().run()}
        className="px-2 py-1 rounded hover:bg-gray-200"
      >
        Undo
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().redo().run()}
        className="px-2 py-1 rounded hover:bg-gray-200"
      >
        Redo
      </button>
    </div>
  );
};

export default function PackageForm({ existingPackage = null }) {
  const router = useRouter();
  const isEditing = !!existingPackage;
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [overviewMode, setOverviewMode] = useState('richtext'); // 'richtext' or 'html'

  // Initialize TipTap editor
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: 'Write your package overview here...',
      }),
    ],
    content: existingPackage?.overview || '',
    onUpdate: ({ editor }) => {
      setFormData(prev => ({ ...prev, overview: editor.getHTML() }));
    },
  });

  // Form state (same as before, but without react-quill)
  const [formData, setFormData] = useState({
    country_id: 1,
    activity_id: 1,
    title: existingPackage?.title || '',
    slug: existingPackage?.slug || '',
    short_description: existingPackage?.short_description || '',
    duration_days: existingPackage?.duration_days || '',
    price: existingPackage?.price || '',
    difficulty: existingPackage?.difficulty || 'moderate',
    max_altitude: existingPackage?.max_altitude || '',
    group_size_min: existingPackage?.group_size_min || 2,
    group_size_max: existingPackage?.group_size_max || 10,
    best_season: existingPackage?.best_season || '',
    overview: existingPackage?.overview || '',
    highlights: existingPackage?.highlights || '',
    featured_image: existingPackage?.featured_image || '',
    gallery: existingPackage?.gallery || '',
    map_image: existingPackage?.map_image || '',
    meta_title: existingPackage?.meta_title || '',
    meta_description: existingPackage?.meta_description || '',
    keywords: existingPackage?.keywords || '',
    is_featured: existingPackage?.is_featured || false,
    is_active: existingPackage?.is_active !== undefined ? existingPackage.is_active : true,
    is_luxury: existingPackage?.is_luxury || false,
    is_adventure: existingPackage?.is_adventure !== undefined ? existingPackage.is_adventure : true,
    is_best_selling: existingPackage?.is_best_selling || false,
    itinerary: existingPackage?.itinerary || [],
    features: existingPackage?.features || [],
    essential_info: existingPackage?.essential_info || '',
    faqs: existingPackage?.faqs || [],
    available_dates: existingPackage?.available_dates || [],
    gallery_images: existingPackage?.gallery_images || [],
    documents: existingPackage?.documents || [],
  });

  // Update editor content when existingPackage loads
  useEffect(() => {
    if (editor && existingPackage?.overview && editor.getHTML() !== existingPackage.overview) {
      editor.commands.setContent(existingPackage.overview);
    }
  }, [editor, existingPackage]);

  // ... (all helper functions: generateSlug, handleChange, addItineraryItem, etc. remain the same as in previous response)
  // I'll include them below for completeness, but you can reuse from your existing code.

  // Helper to generate slug
  const generateSlug = () => {
    if (!formData.title) return;
    const slug = formData.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
    setFormData(prev => ({ ...prev, slug }));
  };

  useEffect(() => {
    if (formData.title && !formData.slug) {
      generateSlug();
    }
  }, [formData.title]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  // Itinerary functions
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
          day_image: '',
        }
      ]
    }));
  };

  const updateItineraryItem = (index, field, value) => {
    const updated = [...formData.itinerary];
    updated[index][field] = value;
    if (field === 'day_number') updated[index].day_number = parseInt(value);
    setFormData(prev => ({ ...prev, itinerary: updated }));
  };

  const removeItineraryItem = (index) => {
    const updated = formData.itinerary.filter((_, i) => i !== index);
    updated.forEach((item, idx) => { item.day_number = idx + 1; });
    setFormData(prev => ({ ...prev, itinerary: updated }));
  };

  // Features functions
  const addFeature = (type) => {
    setFormData(prev => ({
      ...prev,
      features: [
        ...prev.features,
        { feature_type: type, description: '', sort_order: prev.features.length + 1 }
      ]
    }));
  };

  const updateFeature = (index, field, value) => {
    const updated = [...formData.features];
    updated[index][field] = value;
    setFormData(prev => ({ ...prev, features: updated }));
  };

  const removeFeature = (index) => {
    const updated = formData.features.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, features: updated }));
  };

  // FAQs functions
  const addFaq = () => {
    setFormData(prev => ({
      ...prev,
      faqs: [
        ...prev.faqs,
        { question: '', answer: '', sort_order: prev.faqs.length + 1 }
      ]
    }));
  };

  const updateFaq = (index, field, value) => {
    const updated = [...formData.faqs];
    updated[index][field] = value;
    setFormData(prev => ({ ...prev, faqs: updated }));
  };

  const removeFaq = (index) => {
    const updated = formData.faqs.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, faqs: updated }));
  };

  // Dates functions
  const addDate = () => {
    setFormData(prev => ({
      ...prev,
      available_dates: [
        ...prev.available_dates,
        { start_date: '', end_date: '', status: 'available', price: '' }
      ]
    }));
  };

  const updateDate = (index, field, value) => {
    const updated = [...formData.available_dates];
    updated[index][field] = value;
    setFormData(prev => ({ ...prev, available_dates: updated }));
  };

  const removeDate = (index) => {
    const updated = formData.available_dates.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, available_dates: updated }));
  };

  // Gallery functions
  const addGalleryImage = () => {
    setFormData(prev => ({
      ...prev,
      gallery_images: [...prev.gallery_images, { image_url: '', title: '', sort_order: prev.gallery_images.length + 1 }]
    }));
  };

  const updateGalleryImage = (index, field, value) => {
    const updated = [...formData.gallery_images];
    updated[index][field] = value;
    setFormData(prev => ({ ...prev, gallery_images: updated }));
  };

  const removeGalleryImage = (index) => {
    const updated = formData.gallery_images.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, gallery_images: updated }));
  };

  // Documents functions
  const addDocument = () => {
    setFormData(prev => ({
      ...prev,
      documents: [
        ...prev.documents,
        { title: '', file_url: '', sort_order: prev.documents.length + 1 }
      ]
    }));
  };

  const updateDocument = (index, field, value) => {
    const updated = [...formData.documents];
    updated[index][field] = value;
    setFormData(prev => ({ ...prev, documents: updated }));
  };

  const removeDocument = (index) => {
    const updated = formData.documents.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, documents: updated }));
  };

  // Validation and submit (same as before)
  const validate = () => {
    const newErrors = {};
    if (!formData.title) newErrors.title = 'Title is required';
    if (!formData.slug) newErrors.slug = 'Slug is required';
    if (!formData.duration_days) newErrors.duration_days = 'Duration is required';
    if (!formData.price) newErrors.price = 'Price is required';
    if (!formData.difficulty) newErrors.difficulty = 'Difficulty is required';
    if (!formData.overview) newErrors.overview = 'Overview is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);

    try {
      const payload = {
        ...formData,
        itinerary: formData.itinerary.map((item, idx) => ({ ...item, sort_order: idx + 1 })),
        faqs: formData.faqs.map((faq, idx) => ({ ...faq, sort_order: idx + 1 })),
        features: formData.features.map((feat, idx) => ({ ...feat, sort_order: idx + 1 })),
        available_dates: formData.available_dates,
        gallery_images: formData.gallery_images,
        documents: formData.documents,
      };

      const url = isEditing ? `/api/packages/${existingPackage.id}` : '/api/packages';
      const method = isEditing ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok) {
        router.push('/admin/packages');
      } else {
        alert(data.error || 'Failed to save package');
      }
    } catch (error) {
      alert('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // If editor is not yet initialized, show loading
  if (!editor && overviewMode === 'richtext') {
    return <div className="p-8 text-center">Loading editor...</div>;
  }

  return (
    <div className="px-4 sm:px-6 py-6 max-w-5xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/admin/packages" className="text-gray-600 hover:text-accent-color transition">
          <FontAwesomeIcon icon={faArrowLeft} className="w-5 h-5" />
        </Link>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
          {isEditing ? 'Edit Package' : 'Add New Package'}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow p-6 space-y-8">
        {/* Basic Information (same as before) */}
        <section className="border-b pb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Basic Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg ${errors.title ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  name="slug"
                  value={formData.slug}
                  onChange={handleChange}
                  className={`flex-1 px-3 py-2 border rounded-lg ${errors.slug ? 'border-red-500' : 'border-gray-300'}`}
                />
                <button type="button" onClick={generateSlug} className="px-3 py-2 bg-gray-100 rounded-lg hover:bg-gray-200">
                  <FontAwesomeIcon icon={faSync} />
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Duration (days) *</label>
              <input
                type="number"
                name="duration_days"
                value={formData.duration_days}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price (USD) *</label>
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Difficulty *</label>
              <select name="difficulty" value={formData.difficulty} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                <option value="easy">Easy</option>
                <option value="moderate">Moderate</option>
                <option value="challenging">Challenging</option>
                <option value="difficult">Difficult</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Max Altitude (m)</label>
              <input type="number" name="max_altitude" value={formData.max_altitude} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Group Size (min–max)</label>
              <div className="flex gap-2">
                <input type="number" name="group_size_min" value={formData.group_size_min} onChange={handleChange} className="w-1/2 px-3 py-2 border border-gray-300 rounded-lg" />
                <input type="number" name="group_size_max" value={formData.group_size_max} onChange={handleChange} className="w-1/2 px-3 py-2 border border-gray-300 rounded-lg" />
              </div>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Best Season</label>
              <input type="text" name="best_season" value={formData.best_season} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg" placeholder="e.g. Spring (Mar–May) & Autumn (Sep–Nov)" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Short Description</label>
              <textarea name="short_description" rows={2} value={formData.short_description} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
            </div>
          </div>
        </section>

        {/* Content with TipTap */}
        <section className="border-b pb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Content</h2>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-700">Overview (Main Description) *</label>
                <div className="flex gap-2">
                  <button type="button" onClick={() => setOverviewMode('richtext')} className={`px-3 py-1 text-sm rounded ${overviewMode === 'richtext' ? 'bg-accent-color text-white' : 'bg-gray-200'}`}>Rich Text</button>
                  <button type="button" onClick={() => setOverviewMode('html')} className={`px-3 py-1 text-sm rounded ${overviewMode === 'html' ? 'bg-accent-color text-white' : 'bg-gray-200'}`}>HTML Code</button>
                </div>
              </div>
              {overviewMode === 'richtext' ? (
                <div className="border border-gray-300 rounded-lg overflow-hidden">
                  <MenuBar editor={editor} />
                  <EditorContent editor={editor} className="p-4 min-h-[200px] prose prose-sm max-w-none" />
                </div>
              ) : (
                <textarea
                  name="overview"
                  rows={10}
                  value={formData.overview}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border font-mono text-sm ${errors.overview ? 'border-red-500' : 'border-gray-300'} rounded-lg`}
                  placeholder="<p>Paste HTML content here...</p>"
                />
              )}
              {errors.overview && <p className="text-red-500 text-xs mt-1">{errors.overview}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Highlights (HTML list)</label>
              <textarea name="highlights" rows={4} value={formData.highlights} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg font-mono text-sm" placeholder="<ul><li>Highlight 1</li>...</ul>" />
            </div>
          </div>
        </section>

        {/* Itinerary, Features, FAQs, etc. – same as previous code, just copy the sections from the previous response */}
        {/* To keep this answer concise, I'll note that the rest of the form sections remain identical to the previous version. */}
        {/* You can reuse the itinerary, features, FAQs, dates, gallery, documents, essential info, and SEO sections from the earlier response. */}

        {/* Submit buttons */}
        <div className="flex justify-end gap-4">
          <Link href="/admin/packages" className="px-6 py-2 border rounded-lg">Cancel</Link>
          <button type="submit" disabled={loading} className="px-6 py-2 bg-accent-color text-white rounded-lg flex items-center gap-2">
            {loading ? <><FontAwesomeIcon icon={faSpinner} className="animate-spin" /> Saving...</> : <><FontAwesomeIcon icon={faSave} /> Save Package</>}
          </button>
        </div>
      </form>
    </div>
  );
}