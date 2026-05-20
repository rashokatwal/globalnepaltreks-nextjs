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
  faDollarSign,
  faMountain,
  faTag
} from '@fortawesome/free-solid-svg-icons';

export default function PackagesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState(null);
  
  const [page, setPage] = useState(parseInt(searchParams.get('page') || '1'));
  const [limit, setLimit] = useState(parseInt(searchParams.get('limit') || '10'));
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const fetchPackages = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(search && { search })
      });
      const res = await fetch(`/api/packages?${queryParams}`);
      if (!res.ok) throw new Error('Failed to fetch packages');
      const data = await res.json();
      setPackages(data.data?.packages || data.data || []);
      setTotal(data.data?.pagination?.total || data.total || 0);
      setTotalPages(data.data?.pagination?.totalPages || Math.ceil((data.total || 0) / limit));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPackages();
  }, [page, limit, search]);

  useEffect(() => {
    const params = new URLSearchParams();
    if (page > 1) params.set('page', page);
    if (limit !== 10) params.set('limit', limit);
    if (search) params.set('search', search);
    router.replace(`/admin/packages?${params.toString()}`, { scroll: false });
  }, [page, limit, search, router]);

  const toggleActive = async (id, currentStatus) => {
    try {
      const res = await fetch(`/api/packages/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_active: !currentStatus }),
      });
      if (!res.ok) throw new Error('Failed to update status');
      fetchPackages();
    } catch (err) {
      alert('Error updating status: ' + err.message);
    }
  };

  const handleDelete = async (id, title) => {
    if (!confirm(`Are you sure you want to delete "${title}"? This action cannot be undone.`)) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/packages/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete');
      fetchPackages();
    } catch (err) {
      alert('Error deleting: ' + err.message);
    } finally {
      setDeletingId(null);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchPackages();
  };

  // Loading state
  if (loading && packages.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-3">
        <FontAwesomeIcon icon={faSpinner} className="w-10 h-10 text-accent-color animate-spin" />
        <span className="text-gray-600 font-medium">Loading packages...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <p className="text-red-600 mb-3">⚠️ {error}</p>
        <button onClick={fetchPackages} className="text-accent-color hover:underline">Try again</button>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 py-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Packages</h1>
        <Link
          href="/admin/packages/new"
          className="bg-primary-color-dark hover:bg-secondary-color text-white px-5 py-2.5 rounded-lg flex items-center gap-2 transition shadow-sm text-sm font-medium"
        >
          <FontAwesomeIcon icon={faPlus} className="w-4 h-4" />
          Add New Package
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
        <form onSubmit={handleSearchSubmit} className="flex gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-72">
            <input
              type="text"
              placeholder="Search by title..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-color focus:border-accent-color outline-none transition"
            />
            <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-3 text-gray-400 w-4 h-4" />
          </div>
          <button type="submit" className="bg-gray-100 hover:bg-accent-color hover:text-white cursor-pointer  px-5 py-2 rounded-lg text-gray-700 transition">
            Search
          </button>
        </form>
        
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-600">Show:</span>
          <select
            value={limit}
            onChange={(e) => { setLimit(parseInt(e.target.value)); setPage(1); }}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:ring-accent-color"
          >
            {[5, 10, 20, 50].map(val => (
              <option key={val} value={val}>{val}</option>
            ))}
          </select>
          <span className="text-sm text-gray-600">per page</span>
        </div>
      </div>

      {/* Desktop Table (hidden on mobile) */}
      <div className="hidden md:block bg-white rounded-xl shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price (USD)</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Difficulty</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {packages.map((pkg) => (
              <tr key={pkg.id} className="hover:bg-gray-50 transition">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{pkg.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{pkg.title}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{pkg.duration_days} days</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${pkg.price}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">{pkg.difficulty}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => toggleActive(pkg.id, pkg.is_active)}
                    className={`flex items-center gap-1.5 text-sm font-medium transition ${
                      pkg.is_active ? 'text-green-600 hover:text-green-800' : 'text-gray-400 hover:text-gray-600'
                    }`}
                  >
                    <FontAwesomeIcon icon={pkg.is_active ? faToggleOn : faToggleOff} className="w-5 h-5" />
                    <span>{pkg.is_active ? 'Active' : 'Inactive'}</span>
                  </button>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <div className="flex gap-4">
                    <Link href={`/admin/packages/${pkg.id}`} className="text-blue-600 hover:text-blue-800 transition">
                      <FontAwesomeIcon icon={faEdit} className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => handleDelete(pkg.id, pkg.title)}
                      disabled={deletingId === pkg.id}
                      className="text-red-500 hover:text-red-700 transition disabled:opacity-50"
                    >
                      {deletingId === pkg.id ? (
                        <FontAwesomeIcon icon={faSpinner} className="w-4 h-4 animate-spin" />
                      ) : (
                        <FontAwesomeIcon icon={faTrash} className="w-4 h-4" />
                      )}
                    </button>
                    <Link href={`/packages/${pkg.slug}`} target="_blank" className="text-gray-500 hover:text-gray-700 transition">
                      <FontAwesomeIcon icon={faEye} className="w-4 h-4" />
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View (visible only on small screens) */}
      <div className="md:hidden space-y-4">
        {packages.map((pkg) => (
          <div key={pkg.id} className="bg-white rounded-xl shadow p-5 border border-gray-100">
            <div className="flex justify-between items-start mb-3">
              <h3 className="font-semibold text-gray-800 text-lg">{pkg.title}</h3>
              <button
                onClick={() => toggleActive(pkg.id, pkg.is_active)}
                className={`text-sm font-medium ${pkg.is_active ? 'text-green-600' : 'text-gray-400'}`}
              >
                <FontAwesomeIcon icon={pkg.is_active ? faToggleOn : faToggleOff} className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-2 text-sm text-gray-600 mb-4">
              <div className="flex items-center gap-2">
                <FontAwesomeIcon icon={faCalendarAlt} className="w-4 h-4 text-gray-400" />
                <span>{pkg.duration_days} days</span>
              </div>
              <div className="flex items-center gap-2">
                <FontAwesomeIcon icon={faDollarSign} className="w-4 h-4 text-gray-400" />
                <span>${pkg.price}</span>
              </div>
              <div className="flex items-center gap-2">
                <FontAwesomeIcon icon={faMountain} className="w-4 h-4 text-gray-400" />
                <span className="capitalize">{pkg.difficulty}</span>
              </div>
              <div className="flex items-center gap-2">
                <FontAwesomeIcon icon={faTag} className="w-4 h-4 text-gray-400" />
                <span>ID: {pkg.id}</span>
              </div>
            </div>
            <div className="flex gap-4 pt-3 border-t border-gray-100">
              <Link href={`/admin/packages/${pkg.id}`} className="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1">
                <FontAwesomeIcon icon={faEdit} className="w-3.5 h-3.5" /> Edit
              </Link>
              <button
                onClick={() => handleDelete(pkg.id, pkg.title)}
                disabled={deletingId === pkg.id}
                className="text-red-500 hover:text-red-700 text-sm flex items-center gap-1 disabled:opacity-50"
              >
                {deletingId === pkg.id ? (
                  <FontAwesomeIcon icon={faSpinner} className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <FontAwesomeIcon icon={faTrash} className="w-3.5 h-3.5" />
                )}
                Delete
              </button>
              <Link href={`/packages/${pkg.slug}`} target="_blank" className="text-gray-500 hover:text-gray-700 text-sm flex items-center gap-1">
                <FontAwesomeIcon icon={faEye} className="w-3.5 h-3.5" /> View
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Empty state */}
      {packages.length === 0 && !loading && (
        <div className="text-center py-12 bg-gray-50 rounded-xl">
          <p className="text-gray-500">No packages found. Try adjusting your search or filters.</p>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-6 pt-4 border-t border-gray-200">
          <div className="text-sm text-gray-500">
            Showing {(page - 1) * limit + 1} to {Math.min(page * limit, total)} of {total} packages
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