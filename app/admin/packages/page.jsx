'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faPlus, faEdit, faTrash, faEye, faSpinner,
  faToggleOn, faToggleOff, faSearch,
  faChevronLeft, faChevronRight,
  faCalendarAlt, faDollarSign, faMountain, faTag,
  faBoxOpen
} from '@fortawesome/free-solid-svg-icons';

const difficultyConfig = {
  easy:        { color: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
  moderate:    { color: 'bg-amber-100 text-amber-700 border-amber-200' },
  challenging: { color: 'bg-orange-100 text-orange-700 border-orange-200' },
  difficult:   { color: 'bg-red-100 text-red-700 border-red-200' },
};

export default function PackagesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState(null);
  const [togglingId, setTogglingId] = useState(null);

  const [page, setPage] = useState(parseInt(searchParams.get('page') || '1'));
  const [limit, setLimit] = useState(parseInt(searchParams.get('limit') || '10'));
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [searchInput, setSearchInput] = useState(searchParams.get('search') || '');
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
      setTotal(data.data?.pagination?.total || 0);
      setTotalPages(data.data?.pagination?.totalPages || Math.ceil((data.data?.pagination?.total || 0) / limit));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPackages(); }, [page, limit, search]);

  useEffect(() => {
    const params = new URLSearchParams();
    if (page > 1) params.set('page', page);
    if (limit !== 10) params.set('limit', limit);
    if (search) params.set('search', search);
    router.replace(`/admin/packages?${params.toString()}`, { scroll: false });
  }, [page, limit, search]);

  const toggleActive = async (id, currentStatus) => {
    setTogglingId(id);
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
    } finally {
      setTogglingId(null);
    }
  };

  const handleDelete = async (id, title) => {
    if (!confirm(`Archive "${title}"? It will no longer appear on the site.`)) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/packages/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete');
      fetchPackages();
    } catch (err) {
      alert('Error: ' + err.message);
    } finally {
      setDeletingId(null);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setSearch(searchInput);
    setPage(1);
  };

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center max-w-md">
          <p className="text-red-600 mb-4 font-medium">⚠️ {error}</p>
          <button onClick={fetchPackages} className="bg-red-600 text-white px-5 py-2 rounded-lg text-sm hover:bg-red-700 transition">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 py-8 max-w-7xl mx-auto">

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">Packages</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {loading ? 'Loading…' : `${total} package${total !== 1 ? 's' : ''} total`}
          </p>
        </div>
        <Link
          href="/admin/packages/new"
          className="bg-gray-900 hover:bg-gray-700 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 transition shadow-sm text-sm font-semibold"
        >
          <FontAwesomeIcon icon={faPlus} className="w-3.5 h-3.5" />
          New Package
        </Link>
      </div>

      {/* ── Filters Bar ── */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 mb-6 flex flex-col sm:flex-row gap-3 shadow-sm">
        <form onSubmit={handleSearchSubmit} className="flex gap-2 flex-1">
          <div className="relative flex-1">
            <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
            <input
              type="text"
              placeholder="Search packages…"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-gray-900 focus:border-gray-900 outline-none transition bg-gray-50"
            />
          </div>
          <button
            type="submit"
            className="bg-gray-900 text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-700 transition shrink-0"
          >
            Search
          </button>
          {search && (
            <button
              type="button"
              onClick={() => { setSearch(''); setSearchInput(''); setPage(1); }}
              className="px-4 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition shrink-0"
            >
              Clear
            </button>
          )}
        </form>
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-sm text-gray-500">Show</span>
          <select
            value={limit}
            onChange={(e) => { setLimit(parseInt(e.target.value)); setPage(1); }}
            className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm bg-gray-50 focus:ring-2 focus:ring-gray-900 outline-none"
          >
            {[5, 10, 20, 50].map(v => <option key={v} value={v}>{v}</option>)}
          </select>
          <span className="text-sm text-gray-500">per page</span>
        </div>
      </div>

      {/* ── Loading skeleton ── */}
      {loading && (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="bg-white border border-gray-100 rounded-xl h-16 animate-pulse" />
          ))}
        </div>
      )}

      {/* ── Desktop Table ── */}
      {!loading && packages.length > 0 && (
        <div className="hidden md:block bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                {['#', 'Package', 'Duration', 'Price', 'Difficulty', 'Status', 'Actions'].map(h => (
                  <th key={h} className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {packages.map((pkg) => (
                <tr key={pkg.id} className="hover:bg-gray-50/80 transition group">
                  <td className="px-5 py-4 text-sm text-gray-400 font-mono">{pkg.id}</td>
                  <td className="px-5 py-4">
                    <div>
                      <p className="text-sm font-semibold text-gray-900 group-hover:text-gray-700">{pkg.title}</p>
                      {pkg.country_name && (
                        <p className="text-xs text-gray-400 mt-0.5">{pkg.country_name} · {pkg.activity_name}</p>
                      )}
                    </div>
                  </td>
                  <td className="px-5 py-4 text-sm text-gray-600">
                    <span className="flex items-center gap-1.5">
                      <FontAwesomeIcon icon={faCalendarAlt} className="w-3.5 h-3.5 text-gray-400" />
                      {pkg.duration_days}d
                    </span>
                  </td>
                  <td className="px-5 py-4 text-sm font-semibold text-gray-800">
                    ${Number(pkg.price).toLocaleString()}
                  </td>
                  <td className="px-5 py-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border capitalize ${difficultyConfig[pkg.difficulty]?.color || 'bg-gray-100 text-gray-600 border-gray-200'}`}>
                      {pkg.difficulty}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <button
                      onClick={() => toggleActive(pkg.id, pkg.is_active)}
                      disabled={togglingId === pkg.id}
                      className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-full border transition ${
                        pkg.is_active
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                          : 'bg-gray-100 text-gray-500 border-gray-200 hover:bg-gray-200'
                      }`}
                    >
                      {togglingId === pkg.id ? (
                        <FontAwesomeIcon icon={faSpinner} className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <FontAwesomeIcon icon={pkg.is_active ? faToggleOn : faToggleOff} className="w-4 h-4" />
                      )}
                      {pkg.is_active ? 'Active' : 'Inactive'}
                    </button>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-1">
                      <Link
                        href={`/admin/packages/${pkg.id}`}
                        className="p-2 rounded-lg text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition"
                        title="Edit"
                      >
                        <FontAwesomeIcon icon={faEdit} className="w-4 h-4" />
                      </Link>
                      <Link
                        href={`/packages/${pkg.slug}`}
                        target="_blank"
                        className="p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition"
                        title="Preview"
                      >
                        <FontAwesomeIcon icon={faEye} className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => handleDelete(pkg.id, pkg.title)}
                        disabled={deletingId === pkg.id}
                        className="p-2 rounded-lg text-gray-500 hover:text-red-600 hover:bg-red-50 transition disabled:opacity-40"
                        title="Archive"
                      >
                        {deletingId === pkg.id
                          ? <FontAwesomeIcon icon={faSpinner} className="w-4 h-4 animate-spin" />
                          : <FontAwesomeIcon icon={faTrash} className="w-4 h-4" />
                        }
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ── Mobile Card View ── */}
      {!loading && packages.length > 0 && (
        <div className="md:hidden space-y-3">
          {packages.map((pkg) => (
            <div key={pkg.id} className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1 pr-3">
                  <h3 className="font-semibold text-gray-900 text-sm leading-snug">{pkg.title}</h3>
                  {pkg.country_name && (
                    <p className="text-xs text-gray-400 mt-0.5">{pkg.country_name}</p>
                  )}
                </div>
                <button
                  onClick={() => toggleActive(pkg.id, pkg.is_active)}
                  className={`text-xs font-semibold px-2.5 py-1 rounded-full border shrink-0 ${
                    pkg.is_active
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : 'bg-gray-100 text-gray-500 border-gray-200'
                  }`}
                >
                  {pkg.is_active ? 'Active' : 'Inactive'}
                </button>
              </div>

              <div className="grid grid-cols-3 gap-2 mb-4">
                <div className="bg-gray-50 rounded-lg p-2 text-center">
                  <p className="text-xs text-gray-400 mb-0.5">Duration</p>
                  <p className="text-sm font-semibold text-gray-800">{pkg.duration_days}d</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-2 text-center">
                  <p className="text-xs text-gray-400 mb-0.5">Price</p>
                  <p className="text-sm font-semibold text-gray-800">${Number(pkg.price).toLocaleString()}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-2 text-center">
                  <p className="text-xs text-gray-400 mb-0.5">Level</p>
                  <p className="text-xs font-semibold text-gray-800 capitalize">{pkg.difficulty}</p>
                </div>
              </div>

              <div className="flex gap-2 pt-3 border-t border-gray-100">
                <Link href={`/admin/packages/${pkg.id}`}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-gray-900 text-white text-xs font-medium rounded-lg hover:bg-gray-700 transition">
                  <FontAwesomeIcon icon={faEdit} className="w-3.5 h-3.5" /> Edit
                </Link>
                <Link href={`/packages/${pkg.slug}`} target="_blank"
                  className="px-3 py-2 border border-gray-200 text-gray-600 text-xs font-medium rounded-lg hover:bg-gray-50 transition">
                  <FontAwesomeIcon icon={faEye} className="w-3.5 h-3.5" />
                </Link>
                <button
                  onClick={() => handleDelete(pkg.id, pkg.title)}
                  disabled={deletingId === pkg.id}
                  className="px-3 py-2 border border-red-100 text-red-500 text-xs rounded-lg hover:bg-red-50 transition disabled:opacity-40"
                >
                  {deletingId === pkg.id
                    ? <FontAwesomeIcon icon={faSpinner} className="w-3.5 h-3.5 animate-spin" />
                    : <FontAwesomeIcon icon={faTrash} className="w-3.5 h-3.5" />
                  }
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Empty State ── */}
      {!loading && packages.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl border border-gray-200 border-dashed">
          <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center mb-4">
            <FontAwesomeIcon icon={faBoxOpen} className="w-7 h-7 text-gray-400" />
          </div>
          <h3 className="text-base font-semibold text-gray-800 mb-1">No packages found</h3>
          <p className="text-sm text-gray-400 mb-5">
            {search ? `No results for "${search}"` : 'Get started by adding your first package'}
          </p>
          {search ? (
            <button
              onClick={() => { setSearch(''); setSearchInput(''); }}
              className="text-sm text-gray-600 border border-gray-200 px-4 py-2 rounded-lg hover:bg-gray-50 transition"
            >
              Clear search
            </button>
          ) : (
            <Link href="/admin/packages/new"
              className="bg-gray-900 text-white text-sm px-5 py-2.5 rounded-lg hover:bg-gray-700 transition flex items-center gap-2">
              <FontAwesomeIcon icon={faPlus} className="w-3.5 h-3.5" /> Add Package
            </Link>
          )}
        </div>
      )}

      {/* ── Pagination ── */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-6 pt-5 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            Showing <span className="font-semibold text-gray-800">{(page - 1) * limit + 1}</span>–<span className="font-semibold text-gray-800">{Math.min(page * limit, total)}</span> of <span className="font-semibold text-gray-800">{total}</span>
          </p>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setPage(1)}
              disabled={page === 1}
              className="px-3 py-2 border border-gray-200 rounded-lg text-xs text-gray-600 disabled:opacity-40 hover:bg-gray-50 transition"
            >
              First
            </button>
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-2 border border-gray-200 rounded-lg disabled:opacity-40 hover:bg-gray-50 transition"
            >
              <FontAwesomeIcon icon={faChevronLeft} className="w-3.5 h-3.5 text-gray-600" />
            </button>
            <span className="px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg">
              {page} / {totalPages}
            </span>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-3 py-2 border border-gray-200 rounded-lg disabled:opacity-40 hover:bg-gray-50 transition"
            >
              <FontAwesomeIcon icon={faChevronRight} className="w-3.5 h-3.5 text-gray-600" />
            </button>
            <button
              onClick={() => setPage(totalPages)}
              disabled={page === totalPages}
              className="px-3 py-2 border border-gray-200 rounded-lg text-xs text-gray-600 disabled:opacity-40 hover:bg-gray-50 transition"
            >
              Last
            </button>
          </div>
        </div>
      )}
    </div>
  );
}