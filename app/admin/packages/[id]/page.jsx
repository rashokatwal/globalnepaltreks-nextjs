'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowLeft, faSave, faSpinner, faSync, faPlus, faTrash,
  faRoute, faImage, faFileAlt, faCalendarAlt, faInfoCircle,
  faListUl, faCheckCircle, faTimesCircle, faQuestionCircle,
  faMountain, faSearch, faUpload, faTimes, faFilePdf,
  faFileWord, faFileExcel, faFileArchive, faFile
} from '@fortawesome/free-solid-svg-icons';

const TipTapEditor = dynamic(() => import('../../../components/admin/TipTapEditor'), { ssr: false });

// Helper Components (same as before)
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

// Helper function to convert undefined to null for SQL
const toSafeParam = (value) => {
  return value === undefined ? null : value;
};

// Image Upload Component for single images (same as before)
const ImageUpload = ({ currentImage, onImageUpload, onRemove, label, uploadType = 'general', hint }) => {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(currentImage);
  const fileInputRef = useRef(null);

  useEffect(() => {
    setPreview(currentImage);
  }, [currentImage]);

  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('Image must be less than 5MB');
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', uploadType);
    formData.append('category', 'image');

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setPreview(data.url);
        onImageUpload(data.url);
      } else {
        alert(data.error || 'Upload failed');
      }
    } catch (err) {
      alert('Upload failed. Please try again.');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleRemove = () => {
    setPreview(null);
    onRemove();
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
      {hint && <p className="text-xs text-gray-400 -mt-1 mb-2">{hint}</p>}
      <div className="flex items-start gap-4">
        {preview ? (
          <div className="relative w-32 h-32 rounded-lg overflow-hidden border border-gray-200">
            <img src={preview} alt="Preview" className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={handleRemove}
              className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition"
            >
              <FontAwesomeIcon icon={faTimes} className="w-3 h-3" />
            </button>
          </div>
        ) : (
          <div className="w-32 h-32 bg-gray-100 rounded-lg border border-dashed border-gray-300 flex items-center justify-center">
            <FontAwesomeIcon icon={faImage} className="w-8 h-8 text-gray-400" />
          </div>
        )}
        <div className="flex-1">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            accept="image/*"
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium text-gray-700 transition flex items-center gap-2"
          >
            {uploading ? (
              <><FontAwesomeIcon icon={faSpinner} className="w-4 h-4 animate-spin" /> Uploading...</>
            ) : (
              <><FontAwesomeIcon icon={faUpload} className="w-4 h-4" /> {preview ? 'Change Image' : 'Upload Image'}</>
            )}
          </button>
          <p className="text-xs text-gray-400 mt-2">JPG, PNG (max 5MB)</p>
        </div>
      </div>
    </div>
  );
};

// Gallery Image Upload Component (same as before)
const GalleryImageUpload = ({ images, onAdd, onRemove, onUpdate, uploadType = 'general' }) => {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('Image must be less than 5MB');
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', uploadType);
    formData.append('category', 'gallery');

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (res.ok && data.success) {
        onAdd(data.url);
      } else {
        alert(data.error || 'Upload failed');
      }
    } catch (err) {
      alert('Upload failed. Please try again.');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <input type="file" ref={fileInputRef} onChange={handleFileSelect} accept="image/*" className="hidden" />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium text-gray-700 transition flex items-center gap-2"
        >
          {uploading ? (
            <><FontAwesomeIcon icon={faSpinner} className="w-4 h-4 animate-spin" /> Uploading...</>
          ) : (
            <><FontAwesomeIcon icon={faPlus} className="w-4 h-4" /> Add Gallery Image</>
          )}
        </button>
      </div>
      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {images.map((img, idx) => (
            <div key={idx} className="relative group">
              <div className="aspect-square rounded-lg overflow-hidden border border-gray-200">
                <img src={img.image_url || img} alt={img.title || `Gallery ${idx + 1}`} className="w-full h-full object-cover" />
              </div>
              <button
                type="button"
                onClick={() => onRemove(idx)}
                className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
              >
                <FontAwesomeIcon icon={faTimes} className="w-3 h-3" />
              </button>
              <input
                type="text"
                placeholder="Alt text"
                value={img.title || ''}
                onChange={(e) => onUpdate(idx, 'title', e.target.value)}
                className="mt-1 w-full px-2 py-1 text-xs border rounded"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Document Upload Component
// Document Upload Component - Updated version
const DocumentUpload = ({ documents, packageSlug, onDocumentChange }) => {
  const [uploading, setUploading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editingTitle, setEditingTitle] = useState('');
  const fileInputRef = useRef(null);

  const getFileIcon = (fileName) => {
    const ext = fileName?.split('.').pop()?.toLowerCase();
    if (ext === 'pdf') return faFilePdf;
    if (['doc', 'docx'].includes(ext)) return faFileWord;
    if (['xls', 'xlsx'].includes(ext)) return faFileExcel;
    if (['zip', 'rar', '7z'].includes(ext)) return faFileArchive;
    return faFile;
  };

  const getFileColor = (fileName) => {
    const ext = fileName?.split('.').pop()?.toLowerCase();
    if (ext === 'pdf') return 'text-red-500';
    if (['doc', 'docx'].includes(ext)) return 'text-blue-500';
    if (['xls', 'xlsx'].includes(ext)) return 'text-green-500';
    return 'text-gray-500';
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return '';
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 20 * 1024 * 1024) {
      alert('File must be less than 20MB');
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', 'packages');
    formData.append('category', 'document');

    try {
      // First upload the file
      const uploadRes = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const uploadData = await uploadRes.json();
      if (!uploadRes.ok || !uploadData.success) {
        alert(uploadData.error || 'Upload failed');
        return;
      }

      // Then create the document record via API
      // IMPORTANT: Use the exact field names expected by validatePackageDocument
      const createRes = await fetch(`/api/packages/${packageSlug}/documents`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          document_title: file.name.replace(/\.[^/.]+$/, ''), // Matches validation
          document_url: uploadData.url,                        // Matches validation
          document_type: 'brochure',                          // Must match enum values
        }),
      });
      const createData = await createRes.json();
      if (createRes.ok && createData.success) {
        onDocumentChange(); // Refresh documents
      } else {
        alert(createData.error || 'Failed to save document');
        console.error('Create document error:', createData);
      }
    } catch (err) {
      console.error('Upload error:', err);
      alert('Upload failed. Please try again.');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const startEdit = (doc) => {
    setEditingId(doc.id);
    setEditingTitle(doc.document_title);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingTitle('');
  };

  const saveTitle = async (docId) => {
    if (!editingTitle.trim()) {
      alert('Document title cannot be empty');
      return;
    }
    try {
      const res = await fetch(`/api/packages/${packageSlug}/documents/${docId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          document_title: editingTitle.trim(),
          document_type: 'brochure' // Include required field
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setEditingId(null);
        setEditingTitle('');
        onDocumentChange();
      } else {
        alert(data.error || 'Failed to update document title');
      }
    } catch (err) {
      console.error('Error updating document:', err);
      alert('Failed to update document title');
    }
  };

  const handleDelete = async (docId) => {
    if (!confirm('Are you sure you want to delete this document?')) return;
    setDeletingId(docId);
    try {
      const res = await fetch(`/api/packages/${packageSlug}/documents/${docId}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        onDocumentChange();
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to delete document');
      }
    } catch (err) {
      console.error('Error deleting document:', err);
      alert('Error deleting document');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          accept=".pdf,.doc,.docx,.xls,.xlsx,.txt,.zip"
          className="hidden"
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium text-gray-700 transition flex items-center gap-2 disabled:opacity-50"
        >
          {uploading ? (
            <><FontAwesomeIcon icon={faSpinner} className="w-4 h-4 animate-spin" /> Uploading...</>
          ) : (
            <><FontAwesomeIcon icon={faUpload} className="w-4 h-4" /> Upload Document</>
          )}
        </button>
        <p className="text-xs text-gray-400 self-center">PDF, DOC, XLS (max 20MB)</p>
      </div>
      {documents.length > 0 && (
        <div className="space-y-2">
          {documents.map((doc) => (
            <div key={doc.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
              <div className="w-10 h-10 bg-white rounded-lg border border-gray-200 flex items-center justify-center">
                <FontAwesomeIcon icon={getFileIcon(doc.document_title)} className={`w-5 h-5 ${getFileColor(doc.document_title)}`} />
              </div>
              <div className="flex-1 min-w-0">
                {editingId === doc.id ? (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={editingTitle}
                      onChange={(e) => setEditingTitle(e.target.value)}
                      className="flex-1 px-2 py-1 text-sm border rounded focus:ring-1 focus:ring-accent-color"
                      autoFocus
                    />
                    <button
                      onClick={() => saveTitle(doc.id)}
                      className="px-2 py-1 text-xs bg-green-500 text-white rounded hover:bg-green-600"
                    >
                      Save
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="px-2 py-1 text-xs bg-gray-500 text-white rounded hover:bg-gray-600"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => startEdit(doc)}
                    className="text-sm font-medium text-gray-800 hover:text-accent-color hover:underline text-left w-full"
                  >
                    {doc.document_title || 'Untitled Document'}
                  </button>
                )}
                {doc.file_size && (
                  <p className="text-xs text-gray-400 mt-0.5">{formatFileSize(doc.file_size)}</p>
                )}
              </div>
              <a
                href={doc.document_url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-gray-500 hover:text-blue-600 transition"
                title="Preview"
              >
                <FontAwesomeIcon icon={faFileAlt} className="w-4 h-4" />
              </a>
              <button
                type="button"
                onClick={() => handleDelete(doc.id)}
                disabled={deletingId === doc.id}
                className="p-2 text-gray-400 hover:text-red-500 transition disabled:opacity-50"
              >
                {deletingId === doc.id ? (
                  <FontAwesomeIcon icon={faSpinner} className="w-4 h-4 animate-spin" />
                ) : (
                  <FontAwesomeIcon icon={faTrash} className="w-4 h-4" />
                )}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default function EditPackagePage() {
  const router = useRouter();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const [overviewMode, setOverviewMode] = useState('richtext');
  const [countries, setCountries] = useState([]);
  const [activities, setActivities] = useState([]);
  const [packageSlug, setPackageSlug] = useState('');

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
    documents: [], // Now stores document objects from API
    essential_info: {
      trip_code: '', trip_type: '', accommodation_type: '', meal_included: '',
      transportation: '', best_time_description: '', difficulty_description: '',
      fitness_requirements: '', preparation_tips: '', equipment_list: '',
      health_considerations: '', safety_measures: '', permits_required: '',
      permit_cost: '', cultural_etiquette: '', local_customs: ''
    }
  });

  // Load options
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
  const fetchPackage = async () => {
    try {
      const res = await fetch(`/api/packages/${id}?details=true`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to load package');
      const pkg = data.data || data;
      
      let availableDates = pkg.available_dates;
      if (typeof availableDates === 'string') {
        try { availableDates = JSON.parse(availableDates); } catch(e) { availableDates = []; }
      }
      
      let essentialInfo = pkg.essential_info;
      if (typeof essentialInfo === 'string') {
        try { essentialInfo = JSON.parse(essentialInfo); } catch(e) { essentialInfo = {}; }
      }
      if (!essentialInfo || typeof essentialInfo !== 'object') essentialInfo = formData.essential_info;
      
      setPackageSlug(pkg.slug);
      
      // Fetch documents separately using the documents API
      let documents = [];
      try {
        const docsRes = await fetch(`/api/packages/${pkg.slug}/documents`);
        const docsData = await docsRes.json();
        if (docsRes.ok && docsData.success) {
          documents = docsData.data || [];
        }
      } catch (err) {
        console.error('Failed to fetch documents:', err);
      }
      
      setFormData({
        ...pkg,
        available_dates: availableDates || [],
        essential_info: essentialInfo,
        itinerary: pkg.itinerary || [],
        features: pkg.features || [],
        faqs: pkg.faqs || [],
        gallery_images: pkg.gallery_images || pkg.gallery || [],
        documents: documents
      });
      setLoading(false);
    } catch (err) {
      console.error(err);
      alert('Failed to load package details');
      router.push('/admin/packages');
    }
  };

  useEffect(() => {
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

  // Image handlers
  const handleFeaturedImageUpload = (url) => {
    setFormData(prev => ({ ...prev, featured_image: url }));
  };

  const handleFeaturedImageRemove = () => {
    setFormData(prev => ({ ...prev, featured_image: '' }));
  };

  const handleMapImageUpload = (url) => {
    setFormData(prev => ({ ...prev, map_image: url }));
  };

  const handleMapImageRemove = () => {
    setFormData(prev => ({ ...prev, map_image: '' }));
  };

  const handleGalleryAdd = (url) => {
    setFormData(prev => ({
      ...prev,
      gallery_images: [...prev.gallery_images, { image_url: url, title: '' }]
    }));
  };

  const handleGalleryRemove = (index) => {
    setFormData(prev => ({
      ...prev,
      gallery_images: prev.gallery_images.filter((_, i) => i !== index)
    }));
  };

  const handleGalleryUpdate = (index, field, value) => {
    const updated = [...formData.gallery_images];
    updated[index][field] = value;
    setFormData(prev => ({ ...prev, gallery_images: updated }));
  };

  // Itinerary handlers
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
  const handleItineraryImageUpload = (idx, url) => {
    updateItineraryItem(idx, 'day_image', url);
  };
  const handleItineraryImageRemove = (idx) => {
    updateItineraryItem(idx, 'day_image', '');
  };

  // Features handlers
  const addFeature = (type) => setFormData(prev => ({ ...prev, features: [...prev.features, { feature_type: type, description: '' }] }));
  const updateFeature = (idx, field, value) => { const u = [...formData.features]; u[idx][field] = value; setFormData(prev => ({ ...prev, features: u })); };
  const removeFeature = (idx) => setFormData(prev => ({ ...prev, features: prev.features.filter((_, i) => i !== idx) }));

  // FAQs handlers
  const addFaq = () => setFormData(prev => ({ ...prev, faqs: [...prev.faqs, { question: '', answer: '' }] }));
  const updateFaq = (idx, field, value) => { const u = [...formData.faqs]; u[idx][field] = value; setFormData(prev => ({ ...prev, faqs: u })); };
  const removeFaq = (idx) => setFormData(prev => ({ ...prev, faqs: prev.faqs.filter((_, i) => i !== idx) }));

  // Dates handlers
  const addDate = () => setFormData(prev => ({
    ...prev,
    available_dates: [...prev.available_dates, { start_date: '', end_date: '', available_slots: '', total_slots: '', price_multiplier: '1.00', is_guaranteed: false, status: 'available' }]
  }));
  const updateDate = (idx, field, value) => { const u = [...formData.available_dates]; u[idx][field] = value; setFormData(prev => ({ ...prev, available_dates: u })); };
  const removeDate = (idx) => setFormData(prev => ({ ...prev, available_dates: prev.available_dates.filter((_, i) => i !== idx) }));

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
      
      const safeValue = (value) => value === undefined ? null : value;
      
      // Prepare gallery images properly - ensure they have the correct structure
      const galleryImages = formData.gallery_images.map((img, index) => ({
        image_url: img.image_url,
        title: img.title || '',
        sort_order: index + 1
      }));
      
      const payload = { 
        ...formData, 
        essential_info: essentialInfoFilled ? formData.essential_info : null,
        country_id: safeValue(formData.country_id ? parseInt(formData.country_id) : null),
        activity_id: safeValue(formData.activity_id ? parseInt(formData.activity_id) : null),
        duration_days: safeValue(formData.duration_days ? parseInt(formData.duration_days) : null),
        price: safeValue(formData.price ? parseFloat(formData.price) : null),
        max_altitude: safeValue(formData.max_altitude ? parseInt(formData.max_altitude) : null),
        group_size_min: safeValue(formData.group_size_min ? parseInt(formData.group_size_min) : 2),
        group_size_max: safeValue(formData.group_size_max ? parseInt(formData.group_size_max) : null),
        // Send gallery_images explicitly with the correct structure
        gallery_images: galleryImages,
        // Don't send documents array in the main payload - they're managed separately
        documents: undefined
      };
      
      console.log('Saving gallery images:', galleryImages); // Debug log
      
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
      console.error('Submit error:', err);
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

        {/* ── BASIC INFO ── (same as before, omitted for brevity) */}
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
                <input placeholder="Day title" value={item.title || ''} onChange={(e) => updateItineraryItem(idx, 'title', e.target.value)} className={`${inputCls()} md:col-span-2`} />
                <textarea placeholder="Description" rows={2} value={item.description || ''} onChange={(e) => updateItineraryItem(idx, 'description', e.target.value)} className={`${inputCls()} md:col-span-2`} />
                <input type="number" placeholder="Altitude (m)" value={item.altitude || ''} onChange={(e) => updateItineraryItem(idx, 'altitude', e.target.value)} className={inputCls()} />
                <input placeholder="Trekking hours (e.g. 5–6)" value={item.trekking_hours || ''} onChange={(e) => updateItineraryItem(idx, 'trekking_hours', e.target.value)} className={inputCls()} />
                <input placeholder="Distance (km)" value={item.distance_km || ''} onChange={(e) => updateItineraryItem(idx, 'distance_km', e.target.value)} className={inputCls()} />
                <input placeholder="Accommodation" value={item.accommodation || ''} onChange={(e) => updateItineraryItem(idx, 'accommodation', e.target.value)} className={inputCls()} />
                <input placeholder="Meal info (e.g. B/L/D)" value={item.meal_info || ''} onChange={(e) => updateItineraryItem(idx, 'meal_info', e.target.value)} className={inputCls()} />
                <div className="md:col-span-2">
                  <ImageUpload
                    currentImage={item.day_image}
                    onImageUpload={(url) => handleItineraryImageUpload(idx, url)}
                    onRemove={() => handleItineraryImageRemove(idx)}
                    label="Day Image"
                    uploadType="packages"
                  />
                </div>
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
        <FormSection icon={faImage} title="Gallery" subtitle={`${formData.gallery_images.length} image${formData.gallery_images.length !== 1 ? 's' : ''}`}>
          <GalleryImageUpload
            images={formData.gallery_images}
            onAdd={handleGalleryAdd}
            onRemove={handleGalleryRemove}
            onUpdate={handleGalleryUpdate}
            uploadType="packages"
          />
        </FormSection>

        {/* ── DOCUMENTS ── */}
        <FormSection icon={faFileAlt} title="Documents" subtitle="PDFs, permits, or other downloadable files">
          <DocumentUpload
            documents={formData.documents}
            packageSlug={packageSlug}
            onDocumentChange={fetchPackage}
          />
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
            
            <ImageUpload
              currentImage={formData.featured_image}
              onImageUpload={handleFeaturedImageUpload}
              onRemove={handleFeaturedImageRemove}
              label="Featured Image"
              uploadType="packages"
              hint="Main image displayed on package cards and detail page"
            />
            
            <ImageUpload
              currentImage={formData.map_image}
              onImageUpload={handleMapImageUpload}
              onRemove={handleMapImageRemove}
              label="Map / Route Image"
              uploadType="packages"
              hint="Trek route map image"
            />
            
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