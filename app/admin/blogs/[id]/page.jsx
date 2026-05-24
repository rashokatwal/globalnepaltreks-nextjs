'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowLeft, faSave, faSpinner, faSync, faPlus, faTrash,
  faImage, faFileAlt, faSearch, faTag, faEye,
  faCalendarAlt, faUser, faClock, faGlobe, faMountain
} from '@fortawesome/free-solid-svg-icons';

const TipTapEditor = dynamic(() => import('../../../components/admin/TipTapEditor'), { ssr: false });

// ─── Helper Components ────────────────────────────────────────────────────────

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

const Field = ({ label, required, error, hint, children, className = '' }) => (
  <div className={className}>
    {label && (
      <label className="block text-sm font-medium text-gray-700 mb-1.5">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
    )}
    {children}
    {hint && !error && <p className="text-xs text-gray-400 mt-1">{hint}</p>}
    {error && <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1"><span>⚠</span>{error}</p>}
  </div>
);

const inputCls = (error) =>
  `w-full px-3.5 py-2.5 border rounded-xl text-sm outline-none transition focus:ring-2 bg-gray-50 focus:bg-white ${
    error ? 'border-red-300 focus:ring-red-200 focus:border-red-400' : 'border-gray-200 focus:ring-gray-900/20 focus:border-gray-400'
  }`;

const charCount = (str, max) => {
  const len = (str || '').length;
  const over = len > max;
  return (
    <span className={`text-xs ${over ? 'text-red-500 font-medium' : 'text-gray-400'}`}>
      {len}/{max}
    </span>
  );
};

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function EditBlogPage() {
  const router = useRouter();
  const { id } = useParams();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const [contentMode, setContentMode] = useState('richtext');
  const [categories, setCategories] = useState([]);
  const [countries, setCountries] = useState([]);
  const [activities, setActivities] = useState([]);

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    featured_image: '',
    author: 'Global Nepal Treks',
    reading_time: 5,
    meta_title: '',
    meta_description: '',
    keywords: '',
    is_published: false,
    is_featured: false,
    published_at: '',
    category_ids: [],
    country_id: null,
    activity_id: null,
  });

  // ── Fetch blog ──────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!id) return;
    async function fetchBlog() {
      try {
        const res = await fetch(`/api/blogs/${id}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to load blog');
        const blog = data.data || data;
        setFormData({
          title: blog.title || '',
          slug: blog.slug || '',
          excerpt: blog.excerpt || '',
          content: blog.content || '',
          featured_image: blog.featured_image || '',
          author: blog.author || 'Global Nepal Treks',
          reading_time: blog.reading_time || 5,
          meta_title: blog.meta_title || '',
          meta_description: blog.meta_description || '',
          keywords: blog.keywords || '',
          is_published: blog.is_published === 1 || blog.is_published === true,
          is_featured: blog.is_featured === 1 || blog.is_featured === true,
          published_at: blog.published_at ? blog.published_at.split('T')[0] : '',
          category_ids: blog.categories?.map(c => c.id) || [],
          country_id: blog.country_id || null,
          activity_id: blog.activity_id || null,
        });
      } catch (err) {
        console.error(err);
        alert('Failed to load blog post');
        router.push('/admin/blogs');
      } finally {
        setLoading(false);
      }
    }
    fetchBlog();
  }, [id, router]);

  // ── Fetch supporting data ───────────────────────────────────────────────────
  useEffect(() => {
    async function fetchMeta() {
      try {
        const [catRes, countryRes, actRes] = await Promise.all([
          fetch('/api/categories'),
          fetch('/api/countries'),
          fetch('/api/activities'),
        ]);
        const [catData, countryData, actData] = await Promise.all([
          catRes.json(), countryRes.json(), actRes.json()
        ]);
        setCategories(catData.data || catData || []);
        setCountries(countryData.data || countryData || []);
        setActivities(actData.data || actData || []);
      } catch (err) {
        console.error('Failed to load metadata:', err);
      }
    }
    fetchMeta();
  }, []);

  // ── Helpers ─────────────────────────────────────────────────────────────────
  const generateSlug = () => {
    if (!formData.title) return;
    const slug = formData.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
    setFormData(prev => ({ ...prev, slug }));
  };

  const calculateReadingTime = (content) => {
    if (!content) return 1;
    const text = content.replace(/<[^>]*>/g, '');
    const words = text.trim().split(/\s+/).length;
    return Math.max(1, Math.ceil(words / 200));
  };

  const handleContentChange = (html) => {
    setFormData(prev => ({
      ...prev,
      content: html,
      reading_time: calculateReadingTime(html),
    }));
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData(prev => {
      const updated = {
        ...prev,
        [name]: type === 'checkbox' ? checked : value,
      };

      // Auto-populate published_at with today when first publishing
      if (name === 'is_published' && checked && !prev.published_at) {
        updated.published_at = new Date().toISOString().split('T')[0];
      }

      // Clear published_at when unpublishing
      if (name === 'is_published' && !checked) {
        updated.published_at = '';
      }

      return updated;
    });

    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleCategoryChange = (categoryId) => {
    setFormData(prev => ({
      ...prev,
      category_ids: prev.category_ids.includes(categoryId)
        ? prev.category_ids.filter(id => id !== categoryId)
        : [...prev.category_ids, categoryId],
    }));
  };

  // ── Validation ──────────────────────────────────────────────────────────────
  const validate = () => {
    const e = {};
    if (!formData.title.trim()) e.title = 'Title is required';
    if (!formData.slug.trim()) e.slug = 'Slug is required';
    if (!formData.content.trim()) e.content = 'Content is required';
    if (formData.meta_title && formData.meta_title.length > 60)
      e.meta_title = 'Meta title should be 60 characters or fewer';
    if (formData.meta_description && formData.meta_description.length > 160)
      e.meta_description = 'Meta description should be 160 characters or fewer';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  // ── Submit ──────────────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) { window.scrollTo({ top: 0, behavior: 'smooth' }); return; }
    setSaving(true);
    try {
      const payload = {
        title: formData.title.trim(),
        slug: formData.slug.trim(),
        excerpt: formData.excerpt.trim() || null,
        content: formData.content,
        featured_image: formData.featured_image.trim() || null,
        author: formData.author.trim(),
        reading_time: parseInt(formData.reading_time) || calculateReadingTime(formData.content),
        meta_title: formData.meta_title.trim() || formData.title.trim(),
        meta_description: formData.meta_description.trim() || formData.excerpt.trim() || null,
        keywords: formData.keywords.trim() || null,
        // Send integers to match how the API stores them
        is_published: formData.is_published ? 1 : 0,
        is_featured: formData.is_featured ? 1 : 0,
        // Only send published_at when published; otherwise explicitly null
        published_at: formData.is_published && formData.published_at
          ? formData.published_at
          : null,
        category_ids: formData.category_ids,
        country_id: formData.country_id ? parseInt(formData.country_id) : null,
        activity_id: formData.activity_id ? parseInt(formData.activity_id) : null,
      };

      const res = await fetch(`/api/blogs/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        router.push('/admin/blogs');
      } else {
        // Surface field-level errors from API if present
        if (data.errors) {
          setErrors(data.errors);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
          alert(data.error || data.message || 'Failed to update blog');
        }
      }
    } catch (err) {
      alert('Something went wrong. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  // ── Loading ─────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
        <span className="ml-3 text-gray-600">Loading blog post…</span>
      </div>
    );
  }

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="px-4 sm:px-6 py-8 max-w-5xl mx-auto">

      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/blogs"
          className="w-9 h-9 bg-white border border-gray-200 rounded-xl flex items-center justify-center text-gray-500 hover:text-gray-800 hover:border-gray-300 transition shadow-sm">
          <FontAwesomeIcon icon={faArrowLeft} className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Edit Blog Post</h1>
          <p className="text-sm text-gray-400 mt-0.5">Update your blog content and settings</p>
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

        {/* ── BASIC INFORMATION ── */}
        <FormSection icon={faFileAlt} title="Basic Information" subtitle="Core blog details">
          <div className="grid grid-cols-1 gap-4">

            <Field label="Title" required error={errors.title}>
              <input
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter blog title"
                className={inputCls(errors.title)}
              />
            </Field>

            <Field label="Slug" required error={errors.slug}
              hint="Used in the URL — must be unique. Regenerate if you change the title.">
              <div className="flex gap-2">
                <input
                  name="slug"
                  value={formData.slug}
                  onChange={handleChange}
                  placeholder="auto-generated-from-title"
                  className={`flex-1 ${inputCls(errors.slug)}`}
                />
                <button
                  type="button"
                  onClick={generateSlug}
                  title="Regenerate slug from title"
                  className="px-4 bg-gray-100 hover:bg-gray-200 border border-gray-200 rounded-xl transition text-gray-600"
                >
                  <FontAwesomeIcon icon={faSync} className="w-4 h-4" />
                </button>
              </div>
            </Field>

            <Field label="Excerpt" hint="Shown in blog listings and used as fallback meta description.">
              <textarea
                name="excerpt"
                rows={2}
                value={formData.excerpt}
                onChange={handleChange}
                placeholder="Brief summary of the blog post"
                className={inputCls()}
              />
            </Field>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="Author">
                <div className="relative">
                  <FontAwesomeIcon icon={faUser} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    name="author"
                    value={formData.author}
                    onChange={handleChange}
                    className={`${inputCls()} pl-10`}
                  />
                </div>
              </Field>

              <Field label="Reading Time (minutes)" hint="Auto-calculated from content length.">
                <div className="relative">
                  <FontAwesomeIcon icon={faClock} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="number"
                    name="reading_time"
                    value={formData.reading_time}
                    onChange={handleChange}
                    min="1"
                    className={`${inputCls()} pl-10`}
                  />
                </div>
              </Field>
            </div>

            <Field label="Featured Image URL">
              <div className="relative">
                <FontAwesomeIcon icon={faImage} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  name="featured_image"
                  value={formData.featured_image}
                  onChange={handleChange}
                  placeholder="https://example.com/image.jpg"
                  className={`${inputCls()} pl-10`}
                />
              </div>
            </Field>
          </div>
        </FormSection>

        {/* ── ASSOCIATION ── */}
        <FormSection icon={faGlobe} title="Association" subtitle="Link this post to a country or activity">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Country" hint="Enables filtering by destination.">
              <div className="relative">
                <FontAwesomeIcon icon={faGlobe} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <select
                  name="country_id"
                  value={formData.country_id || ''}
                  onChange={handleChange}
                  className={`${inputCls()} pl-10 appearance-none`}
                >
                  <option value="">None</option>
                  {countries.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
            </Field>

            <Field label="Activity" hint="Enables filtering by activity type.">
              <div className="relative">
                <FontAwesomeIcon icon={faMountain} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <select
                  name="activity_id"
                  value={formData.activity_id || ''}
                  onChange={handleChange}
                  className={`${inputCls()} pl-10 appearance-none`}
                >
                  <option value="">None</option>
                  {activities.map(a => (
                    <option key={a.id} value={a.id}>{a.name}</option>
                  ))}
                </select>
              </div>
            </Field>
          </div>
        </FormSection>

        {/* ── CATEGORIES ── */}
        {categories.length > 0 && (
          <FormSection icon={faTag} title="Categories" subtitle="Group your blog for better organization">
            <div className="flex flex-wrap gap-3">
              {categories.map((cat) => (
                <label
                  key={cat.id}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl border cursor-pointer transition select-none ${
                    formData.category_ids.includes(cat.id)
                      ? 'bg-gray-900 border-gray-900 text-white'
                      : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="checkbox"
                    value={cat.id}
                    checked={formData.category_ids.includes(cat.id)}
                    onChange={() => handleCategoryChange(cat.id)}
                    className="hidden"
                  />
                  <span className="text-sm font-medium">{cat.name}</span>
                </label>
              ))}
            </div>
          </FormSection>
        )}

        {/* ── CONTENT ── */}
        <FormSection icon={faFileAlt} title="Content" subtitle="Main blog body" >
          <div className="flex gap-2 mb-4">
            {['richtext', 'html'].map(mode => (
              <button
                key={mode}
                type="button"
                onClick={() => setContentMode(mode)}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition ${
                  contentMode === mode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {mode === 'richtext' ? 'Rich Text' : 'HTML'}
              </button>
            ))}
          </div>
          {contentMode === 'richtext' ? (
            <TipTapEditor
              value={formData.content}
              onChange={handleContentChange}
              placeholder="Write your blog content here..."
            />
          ) : (
            <textarea
              name="content"
              rows={15}
              value={formData.content}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl font-mono text-sm bg-gray-50 focus:bg-white focus:ring-2 focus:ring-gray-900/20 focus:border-gray-400 outline-none transition"
              placeholder="<p>Paste HTML content here…</p>"
            />
          )}
          {errors.content && <p className="text-red-500 text-xs mt-1.5">⚠ {errors.content}</p>}
        </FormSection>

        {/* ── SEO & PUBLISHING ── */}
        <FormSection icon={faSearch} title="SEO & Publishing" subtitle="Search engine metadata and visibility settings">
          <div className="space-y-4">

            <Field label="Meta Title" error={errors.meta_title}
              hint={`Defaults to the blog title if left blank. Recommended: 50–60 characters.`}>
              <div className="relative">
                <input
                  name="meta_title"
                  value={formData.meta_title}
                  onChange={handleChange}
                  placeholder={formData.title || 'Leave blank to use blog title'}
                  maxLength={70}
                  className={inputCls(errors.meta_title)}
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2">
                  {charCount(formData.meta_title, 60)}
                </span>
              </div>
            </Field>

            <Field label="Meta Description" error={errors.meta_description}
              hint="Defaults to excerpt if left blank. Recommended: 150–160 characters.">
              <div className="relative">
                <textarea
                  name="meta_description"
                  rows={2}
                  value={formData.meta_description}
                  onChange={handleChange}
                  placeholder={formData.excerpt || 'Leave blank to use excerpt'}
                  maxLength={180}
                  className={`${inputCls(errors.meta_description)} pr-14`}
                />
                <span className="absolute right-3 top-3">
                  {charCount(formData.meta_description, 160)}
                </span>
              </div>
            </Field>

            <Field label="Keywords" hint="Comma-separated keywords for SEO.">
              <input
                name="keywords"
                value={formData.keywords}
                onChange={handleChange}
                placeholder="nepal, trekking, himalayas, adventure"
                className={inputCls()}
              />
            </Field>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="is_published"
                    checked={formData.is_published}
                    onChange={handleChange}
                    className="w-4 h-4 rounded accent-gray-900"
                  />
                  <span className="text-sm font-medium text-gray-700">Publish this post</span>
                </label>
              </div>

              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="is_featured"
                    checked={formData.is_featured}
                    onChange={handleChange}
                    className="w-4 h-4 rounded accent-gray-900"
                  />
                  <span className="text-sm font-medium text-gray-700">Feature on homepage</span>
                </label>
              </div>
            </div>

            {formData.is_published && (
              <Field label="Publish Date" hint="Leave as today or set a future date to schedule.">
                <div className="relative">
                  <FontAwesomeIcon icon={faCalendarAlt} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="date"
                    name="published_at"
                    value={formData.published_at}
                    onChange={handleChange}
                    className={`${inputCls()} pl-10`}
                  />
                </div>
              </Field>
            )}
          </div>
        </FormSection>

        {/* ── SUBMIT ── */}
        <div className="flex items-center justify-between pt-2 pb-8">
          <Link
            href="/admin/blogs"
            className="px-5 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="bg-gray-900 hover:bg-gray-700 disabled:opacity-60 text-white px-7 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2.5 transition shadow-sm"
          >
            {saving ? (
              <><FontAwesomeIcon icon={faSpinner} className="animate-spin w-4 h-4" /> Saving…</>
            ) : (
              <><FontAwesomeIcon icon={faSave} className="w-4 h-4" /> Update Blog</>
            )}
          </button>
        </div>

      </form>
    </div>
  );
}