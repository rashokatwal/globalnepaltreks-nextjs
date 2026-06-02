'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faPlus, 
  faEdit, 
  faTrash, 
  faEye, 
  faSpinner,
  faToggleOn,
  faToggleOff,
  faSearch,
  faChevronLeft,
  faChevronRight,
  faCalendarAlt,
  faUser,
  faTag,
  faFilter
} from '@fortawesome/free-solid-svg-icons';

export default function BlogsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // State
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState(null);
  
  // Pagination & filters
  const [page, setPage] = useState(parseInt(searchParams.get('page') || '1'));
  const [limit, setLimit] = useState(parseInt(searchParams.get('limit') || '10'));
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [status, setStatus] = useState(searchParams.get('status') || 'all');
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // Fetch blogs
  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(search && { search }),
        ...(status !== 'all' && { status })
      });
      const res = await fetch(`/api/blogs?${queryParams}`);
      console.log('Fetch blogs response:', res);
      if (!res.ok) throw new Error('Failed to fetch blogs');
      const data = await res.json();
      setBlogs(data.data.data || data.data || []);
      setTotal(data.data?.pagination?.total || data.total || 0);
      setTotalPages(data.data?.pagination?.totalPages || Math.ceil((data.total || 0) / limit));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, [page, limit, search, status]);

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    if (page > 1) params.set('page', page);
    if (limit !== 10) params.set('limit', limit);
    if (search) params.set('search', search);
    if (status !== 'all') params.set('status', status);
    router.replace(`/admin/blogs?${params.toString()}`, { scroll: false });
  }, [page, limit, search, status, router]);

  // Toggle published status
  const toggleStatus = async (id, currentStatus) => {
    try {
      const res = await fetch(`/api/blogs/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_published: !currentStatus }),
      });
      if (!res.ok) throw new Error('Failed to update status');
      fetchBlogs();
    } catch (err) {
      alert('Error updating status: ' + err.message);
    }
  };

  // Delete blog
  const handleDelete = async (id, title) => {
    if (!confirm(`Are you sure you want to delete "${title}"? This action cannot be undone.`)) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/blogs?id=${id}`, { method: 'DELETE' });
      console.log('Delete response:', res);
      if (!res.ok) throw new Error('Failed to delete');
      fetchBlogs();
    } catch (err) {
      alert('Error deleting: ' + err.message);
    } finally {
      setDeletingId(null);
    }
  };

  // Handle search submit
  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchBlogs();
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'Not published';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Truncate text
  const truncate = (text, maxLength = 60) => {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  if (loading && blogs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-3">
        <FontAwesomeIcon icon={faSpinner} className="w-10 h-10 text-accent-color animate-spin" />
        <span className="text-gray-600 font-medium">Loading blogs...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <p className="text-red-600 mb-3">⚠️ {error}</p>
        <button onClick={fetchBlogs} className="text-accent-color hover:underline">Try again</button>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 py-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Blog Posts</h1>
        <Link
          href="/admin/blogs/new"
          className="bg-accent-color hover:bg-secondary-color text-white px-5 py-2.5 rounded-lg flex items-center gap-2 transition shadow-sm text-sm font-medium"
        >
          <FontAwesomeIcon icon={faPlus} className="w-4 h-4" />
          Write New Blog
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
        <form onSubmit={handleSearch} className="flex gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-80">
            <input
              type="text"
              placeholder="Search by title..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-color focus:border-accent-color outline-none transition"
            />
            <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-3 text-gray-400 w-4 h-4" />
          </div>
          <button type="submit" className="bg-gray-100 hover:bg-gray-200 px-5 py-2 rounded-lg text-gray-700 transition">
            Search
          </button>
        </form>
        
        <div className="flex items-center gap-3">
          <FontAwesomeIcon icon={faFilter} className="text-gray-400 w-4 h-4" />
          <select
            value={status}
            onChange={(e) => { setStatus(e.target.value); setPage(1); }}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:ring-accent-color"
          >
            <option value="all">All Posts</option>
            <option value="published">Published</option>
            <option value="draft">Drafts</option>
          </select>
          
          <span className="text-sm text-gray-400 mx-2">|</span>
          
          <select
            value={limit}
            onChange={(e) => { setLimit(parseInt(e.target.value)); setPage(1); }}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:ring-accent-color"
          >
            <option value="5">5 per page</option>
            <option value="10">10 per page</option>
            <option value="20">20 per page</option>
            <option value="50">50 per page</option>
          </select>
        </div>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block bg-white rounded-xl shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Author</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Published</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {blogs.map((blog) => (
              <tr key={blog.id} className="hover:bg-gray-50 transition">
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-gray-900">{blog.title}</div>
                  <div className="text-xs text-gray-500 mt-1">{truncate(blog.excerpt, 80)}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <FontAwesomeIcon icon={faUser} className="w-3 h-3 text-gray-400" />
                    <span className="text-sm text-gray-700">{blog.author || 'Admin'}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <FontAwesomeIcon icon={faCalendarAlt} className="w-3 h-3 text-gray-400" />
                    <span className="text-sm text-gray-500">{formatDate(blog.published_at)}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => toggleStatus(blog.id, blog.is_published)}
                    className={`flex items-center gap-1.5 text-sm font-medium transition ${
                      blog.is_published ? 'text-green-600 hover:text-green-800' : 'text-gray-400 hover:text-gray-600'
                    }`}
                  >
                    <FontAwesomeIcon icon={blog.is_published ? faToggleOn : faToggleOff} className="w-5 h-5" />
                    <span>{blog.is_published ? 'Published' : 'Draft'}</span>
                  </button>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <div className="flex gap-3">
                    <Link
                      href={`/admin/blogs/${blog.id}`}
                      className="text-blue-600 hover:text-blue-800 transition"
                      title="Edit"
                    >
                      <FontAwesomeIcon icon={faEdit} className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => handleDelete(blog.id, blog.title)}
                      disabled={deletingId === blog.id}
                      className="text-red-500 hover:text-red-700 transition disabled:opacity-50"
                      title="Delete"
                    >
                      {deletingId === blog.id ? (
                        <FontAwesomeIcon icon={faSpinner} className="w-4 h-4 animate-spin" />
                      ) : (
                        <FontAwesomeIcon icon={faTrash} className="w-4 h-4" />
                      )}
                    </button>
                    <Link
                      href={`/blogs/${blog.slug}`}
                      target="_blank"
                      className="text-gray-500 hover:text-gray-700 transition"
                      title="View on site"
                    >
                      <FontAwesomeIcon icon={faEye} className="w-4 h-4" />
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {blogs.length === 0 && !loading && (
          <div className="text-center py-12 bg-gray-50">
            <p className="text-gray-500">No blog posts found. Try adjusting your search or filters.</p>
          </div>
        )}
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-4">
        {blogs.map((blog) => (
          <div key={blog.id} className="bg-white rounded-xl shadow p-5 border border-gray-100">
            <div className="flex justify-between items-start mb-3">
              <h3 className="font-semibold text-gray-800 text-base flex-1">{blog.title}</h3>
              <button
                onClick={() => toggleStatus(blog.id, blog.is_published)}
                className={`text-sm font-medium ${blog.is_published ? 'text-green-600' : 'text-gray-400'}`}
                title={blog.is_published ? 'Published' : 'Draft'}
              >
                <FontAwesomeIcon icon={blog.is_published ? faToggleOn : faToggleOff} className="w-5 h-5" />
              </button>
            </div>
            {blog.excerpt && (
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">{blog.excerpt}</p>
            )}
            <div className="space-y-2 text-sm text-gray-500 mb-4">
              <div className="flex items-center gap-2">
                <FontAwesomeIcon icon={faUser} className="w-3 h-3" />
                <span>{blog.author || 'Admin'}</span>
                <span className="text-gray-300">|</span>
                <FontAwesomeIcon icon={faCalendarAlt} className="w-3 h-3" />
                <span>{formatDate(blog.published_at)}</span>
              </div>
            </div>
            <div className="flex gap-4 pt-3 border-t border-gray-100">
              <Link href={`/admin/blogs/${blog.id}`} className="text-blue-600 text-sm flex items-center gap-1">
                <FontAwesomeIcon icon={faEdit} className="w-3.5 h-3.5" /> Edit
              </Link>
              <button
                onClick={() => handleDelete(blog.id, blog.title)}
                disabled={deletingId === blog.id}
                className="text-red-500 text-sm flex items-center gap-1 disabled:opacity-50"
              >
                {deletingId === blog.id ? (
                  <FontAwesomeIcon icon={faSpinner} className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <FontAwesomeIcon icon={faTrash} className="w-3.5 h-3.5" />
                )}
                Delete
              </button>
              <Link href={`/blogs/${blog.slug}`} target="_blank" className="text-gray-500 text-sm flex items-center gap-1">
                <FontAwesomeIcon icon={faEye} className="w-3.5 h-3.5" /> View
              </Link>
            </div>
          </div>
        ))}
        
        {blogs.length === 0 && !loading && (
          <div className="text-center py-12 bg-gray-50 rounded-xl">
            <p className="text-gray-500">No blog posts found.</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-6 pt-4 border-t border-gray-200">
          <div className="text-sm text-gray-500">
            Showing {(page - 1) * limit + 1} to {Math.min(page * limit, total)} of {total} blogs
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition"
            >
              <FontAwesomeIcon icon={faChevronLeft} className="w-4 h-4" />
            </button>
            <span className="px-4 py-2 text-sm font-medium">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition"
            >
              <FontAwesomeIcon icon={faChevronRight} className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}