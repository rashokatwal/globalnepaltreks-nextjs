// app/[country]/[activity]/ActivityClient.jsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faMapMarkerAlt, 
  faCalendarAlt, 
  faDollarSign, 
  faClock,
  faSearch,
  faFilter,
  faTimes,
  faSpinner,
  faChevronDown,
  faChevronUp,
  faSlidersH,
  faStar,
  faFire,
  faArrowUpWideShort,
  faArrowDownWideShort,
  faClockRotateLeft,
  faTag
} from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';

export default function ActivityClient({ 
  country, 
  activity, 
  countryId, 
  activityId, 
  filters = {},
  countryName = '',
  activityName = '',
  countryDescription = '' 
}) {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, limit: 9, total: 0, totalPages: 0 });
  const [search, setSearch] = useState(filters.search || '');
  const [searchInput, setSearchInput] = useState(filters.search || '');
  const [sort, setSort] = useState(filters.sort || 'featured');
  const [minPrice, setMinPrice] = useState(filters.minPrice || '');
  const [maxPrice, setMaxPrice] = useState(filters.maxPrice || '');
  const [duration, setDuration] = useState(filters.duration || '');
  const [difficulty, setDifficulty] = useState(filters.difficulty || '');
  const [showFilters, setShowFilters] = useState(false);
  const [isFilterBarSticky, setIsFilterBarSticky] = useState(false);
  
  const router = useRouter();
  
  // Track scroll for sticky effect
  useEffect(() => {
    const handleScroll = () => {
      setIsFilterBarSticky(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Get active filters count
  const getActiveFiltersCount = () => {
    let count = 0;
    if (search) count++;
    if (sort !== 'featured') count++;
    if (minPrice) count++;
    if (maxPrice) count++;
    if (duration) count++;
    if (difficulty) count++;
    return count;
  };
  
  const fetchPackages = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        country_id: countryId,
        activity_id: activityId,
        ...(search && { search }),
        ...(sort && sort !== 'featured' && { sort }),
        ...(minPrice && { min_price: minPrice }),
        ...(maxPrice && { max_price: maxPrice }),
        ...(duration && { max_duration: duration }),
        ...(difficulty && { difficulty }),
      });
      
      const res = await fetch(`/api/packages?${queryParams}`);
      const data = await res.json();
      
      if (res.ok) {
        setPackages(data.data?.packages || []);
        setPagination(prev => ({
          ...prev,
          total: data.data?.pagination?.total || 0,
          totalPages: data.data?.pagination?.totalPages || 0,
        }));
      }
    } catch (error) {
      console.error('Error fetching packages:', error);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    if (countryId && activityId) {
      fetchPackages();
    }
  }, [pagination.page, pagination.limit, search, sort, minPrice, maxPrice, duration, difficulty]);
  
  const handleSearch = (e) => {
    e.preventDefault();
    setSearch(searchInput);
    setPagination(prev => ({ ...prev, page: 1 }));
  };
  
  const clearFilters = () => {
    setSearchInput('');
    setSearch('');
    setSort('featured');
    setMinPrice('');
    setMaxPrice('');
    setDuration('');
    setDifficulty('');
    setPagination(prev => ({ ...prev, page: 1 }));
  };
  
  const getDifficultyColor = (difficulty) => {
    const colors = {
      easy: 'bg-emerald-100 text-emerald-800',
      moderate: 'bg-amber-100 text-amber-800',
      challenging: 'bg-orange-100 text-orange-800',
      difficult: 'bg-red-100 text-red-800',
    };
    return colors[difficulty] || 'bg-gray-100 text-gray-800';
  };
  
  const getSortIcon = () => {
    const icons = {
      featured: <FontAwesomeIcon icon={faStar} className="w-3 h-3 text-yellow-500" />,
      price_asc: <FontAwesomeIcon icon={faArrowUpWideShort} className="w-3 h-3" />,
      price_desc: <FontAwesomeIcon icon={faArrowDownWideShort} className="w-3 h-3" />,
      duration_asc: <FontAwesomeIcon icon={faArrowUpWideShort} className="w-3 h-3" />,
      duration_desc: <FontAwesomeIcon icon={faArrowDownWideShort} className="w-3 h-3" />,
      newest: <FontAwesomeIcon icon={faClockRotateLeft} className="w-3 h-3" />,
    };
    return icons[sort] || icons.featured;
  };
  
  const displayCountryName = countryName || (country?.charAt(0).toUpperCase() + country?.slice(1)) || 'Nepal';
  const displayActivityName = activityName || activity?.split('-').map(w => 
    w.charAt(0).toUpperCase() + w.slice(1)
  ).join(' ') || 'Trekking';
  const activeFiltersCount = getActiveFiltersCount();
  
  return (
    <>
      {/* Hero Section */}
      <section className="relative min-h-[80vh] flex items-end bg-black overflow-hidden">
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="relative max-w-7xl mx-auto px-4 py-16 text-white w-full">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-1.5 mb-4">
              <FontAwesomeIcon icon={faMapMarkerAlt} className="w-3 h-3" />
              <span className="text-sm font-medium">{displayCountryName}</span>
              {/* <span className="text-white/50">•</span>
              <FontAwesomeIcon icon={faCalendarAlt} className="w-3 h-3" />
              <span className="text-sm font-medium">Mar-May & Sep-Nov</span> */}
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-montserrat mb-4">
              {displayActivityName} in {displayCountryName}
            </h1>
            <p className="text-lg md:text-xl max-w-2xl mx-auto opacity-90">
              Discover the best {displayActivityName.toLowerCase()} packages in {displayCountryName}
            </p>
          </div>
        </div>
      </section>
      
      {/* Enhanced Sticky Filter Bar */}
      <div className={`sticky top-0 lg:top-20 z-40 transition-all duration-300 ${
        isFilterBarSticky ? 'shadow-sm' : 'shadow-sm'
      }`}>
        {/* Main Filter Bar */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 py-4">
            {/* Top Row - Search and Primary Actions */}
            <div className="flex flex-col lg:flex-row gap-3">
              {/* Search Bar */}
              <form onSubmit={handleSearch} className="flex-1 flex gap-2">
                <div className="relative flex-1 group">
                  <FontAwesomeIcon icon={faSearch} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 group-focus-within:text-accent-color transition-colors" />
                  <input
                    type="text"
                    placeholder={`Search ${displayActivityName.toLowerCase()} packages...`}
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-accent-color/20 focus:border-accent-color outline-none transition bg-gray-50 focus:bg-white"
                  />
                </div>
                <button type="submit" className="bg-accent-color hover:bg-secondary-color text-white px-6 py-3 rounded-xl transition font-medium shadow-sm hover:shadow-md">
                  Search
                </button>
              </form>
              
              {/* Sort Dropdown */}
              <div className="relative">
                <div className="flex items-center gap-2 px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 hover:bg-white transition cursor-pointer group">
                  {getSortIcon()}
                  <select
                    value={sort}
                    onChange={(e) => { setSort(e.target.value); setPagination(prev => ({ ...prev, page: 1 })); }}
                    className="bg-transparent text-sm font-medium text-gray-700 focus:outline-none cursor-pointer pr-6 appearance-none"
                  >
                    <option value="featured">Featured</option>
                    <option value="price_asc">Price: Low to High</option>
                    <option value="price_desc">Price: High to Low</option>
                    <option value="duration_asc">Duration: Short to Long</option>
                    <option value="duration_desc">Duration: Long to Short</option>
                    <option value="newest">Newest First</option>
                  </select>
                  <FontAwesomeIcon icon={faChevronDown} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 w-3 h-3 pointer-events-none" />
                </div>
              </div>
              
              {/* Filter Toggle Button */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center cursor-pointer justify-center gap-2 px-5 py-3 rounded-xl transition font-medium ${
                  showFilters || activeFiltersCount > 0
                    ? 'bg-accent-color text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <FontAwesomeIcon icon={faSlidersH} className="w-4 h-4" />
                <span>Filters</span>
                {activeFiltersCount > 0 && (
                  <span className="ml-1 bg-white text-accent-color text-xs font-bold px-2 py-0.5 rounded-full min-w-[20px] text-center">
                    {activeFiltersCount}
                  </span>
                )}
                <FontAwesomeIcon icon={showFilters ? faChevronUp : faChevronDown} className="w-3 h-3 ml-1" />
              </button>
            </div>
          </div>
        </div>
        
        {/* Expanded Filter Panel */}
        {showFilters && (
          <div className="bg-gray-50 border-b border-gray-200 animate-fadeIn">
            <div className="max-w-7xl mx-auto px-4 py-5">
              {/* Filter Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Difficulty Filter */}
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                    Difficulty Level
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {['easy', 'moderate', 'challenging', 'difficult'].map((level) => (
                      <button
                        key={level}
                        onClick={() => {
                          setDifficulty(difficulty === level ? '' : level);
                          setPagination(prev => ({ ...prev, page: 1 }));
                        }}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium capitalize transition-all ${
                          difficulty === level
                            ? 'bg-accent-color text-white shadow-sm'
                            : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                        }`}
                      >
                        {level}
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* Duration Filter */}
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                    Duration (Days)
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { value: '', label: 'All', icon: null },
                      { value: '7', label: 'Under 7', icon: null },
                      { value: '10', label: '7-10', icon: null },
                      { value: '14', label: '10-14', icon: null },
                      { value: '21', label: '14-21', icon: null },
                    ].map((option) => (
                      <button
                        key={option.value}
                        onClick={() => {
                          setDuration(option.value);
                          setPagination(prev => ({ ...prev, page: 1 }));
                        }}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                          duration === option.value
                            ? 'bg-accent-color text-white shadow-sm'
                            : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* Price Range Filter */}
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                    Price Range (USD)
                  </label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <FontAwesomeIcon icon={faDollarSign} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-3 h-3" />
                      <input
                        type="number"
                        placeholder="Min"
                        value={minPrice}
                        onChange={(e) => setMinPrice(e.target.value)}
                        onBlur={() => setPagination(prev => ({ ...prev, page: 1 }))}
                        className="w-full pl-8 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-accent-color focus:border-accent-color outline-none bg-white"
                      />
                    </div>
                    <span className="text-gray-400 self-center">-</span>
                    <div className="relative flex-1">
                      <FontAwesomeIcon icon={faDollarSign} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-3 h-3" />
                      <input
                        type="number"
                        placeholder="Max"
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(e.target.value)}
                        onBlur={() => setPagination(prev => ({ ...prev, page: 1 }))}
                        className="w-full pl-8 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-accent-color focus:border-accent-color outline-none bg-white"
                      />
                    </div>
                  </div>
                </div>
                
                {/* Actions */}
                <div className="flex items-end">
                  {activeFiltersCount > 0 && (
                    <button
                      onClick={clearFilters}
                      className="flex cursor-pointer items-center justify-center gap-2 w-full px-4 py-2 bg-red-50 text-red-400 rounded-lg hover:bg-red-100 transition text-sm font-medium border border-red-200"
                    >
                      <FontAwesomeIcon icon={faTimes} className="w-3 h-3" />
                      Clear All Filters ({activeFiltersCount})
                    </button>
                  )}
                </div>
              </div>
              
              {/* Active Filter Tags */}
              {activeFiltersCount > 0 && (
                <div className="flex flex-wrap gap-2 mt-5 pt-4 border-t border-gray-200">
                  <span className="text-xs text-gray-500 mr-1">Active filters:</span>
                  {search && (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-blue-50 text-blue-700 rounded-md text-xs border border-blue-200">
                      <FontAwesomeIcon icon={faSearch} className="w-2.5 h-2.5" />
                      "{search}"
                      <button onClick={() => { setSearch(''); setSearchInput(''); setPagination(prev => ({ ...prev, page: 1 })); }} className="ml-1 hover:text-blue-900">
                        <FontAwesomeIcon icon={faTimes} className="w-2 h-2" />
                      </button>
                    </span>
                  )}
                  {difficulty && (
                    <span className="inline-flex items-center cursor-pointer gap-1.5 px-2.5 py-1 bg-purple-50 text-purple-700 rounded-md text-xs border border-purple-200">
                      <FontAwesomeIcon icon={faTag} className="w-2.5 h-2.5" />
                      {difficulty}
                      <button onClick={() => { setDifficulty(''); setPagination(prev => ({ ...prev, page: 1 })); }} className="ml-1 cursor-pointer hover:text-purple-900">
                        <FontAwesomeIcon icon={faTimes} className="w-2 h-2" />
                      </button>
                    </span>
                  )}
                  {duration && (
                    <span className="inline-flex items-center cursor-pointer gap-1.5 px-2.5 py-1 bg-green-50 text-green-700 rounded-md text-xs border border-green-200">
                      <FontAwesomeIcon icon={faClock} className="w-2.5 h-2.5" />
                      {duration === '7' ? 'Under 7 days' : duration === '10' ? '7-10 days' : duration === '14' ? '10-14 days' : '14-21 days'}
                      <button onClick={() => { setDuration(''); setPagination(prev => ({ ...prev, page: 1 })); }} className="ml-1 cursor-pointer hover:text-green-900">
                        <FontAwesomeIcon icon={faTimes} className="w-2 h-2" />
                      </button>
                    </span>
                  )}
                  {(minPrice || maxPrice) && (
                    <span className="inline-flex items-center cursor-pointer gap-1.5 px-2.5 py-1 bg-yellow-50 text-yellow-700 rounded-md text-xs border border-yellow-200">
                      <FontAwesomeIcon icon={faDollarSign} className="w-2.5 h-2.5" />
                      ${minPrice || '0'} - ${maxPrice || '∞'}
                      <button onClick={() => { setMinPrice(''); setMaxPrice(''); setPagination(prev => ({ ...prev, page: 1 })); }} className="ml-1 cursor-pointer hover:text-yellow-900">
                        <FontAwesomeIcon icon={faTimes} className="w-2 h-2" />
                      </button>
                    </span>
                  )}
                  {sort !== 'featured' && (
                    <span className="inline-flex items-center cursor-pointer gap-1.5 px-2.5 py-1 bg-gray-100 text-gray-700 rounded-md text-xs border border-gray-200">
                      {getSortIcon()}
                      Sorted by: {sort === 'price_asc' ? 'Price Low to High' : sort === 'price_desc' ? 'Price High to Low' : sort === 'duration_asc' ? 'Duration Short to Long' : sort === 'duration_desc' ? 'Duration Long to Short' : 'Newest First'}
                      <button onClick={() => { setSort('featured'); setPagination(prev => ({ ...prev, page: 1 })); }} className="ml-1 cursor-pointer hover:text-gray-900">
                        <FontAwesomeIcon icon={faTimes} className="w-2 h-2" />
                      </button>
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      
      {/* Results Count */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">
            Showing <span className="font-semibold text-gray-700">{packages.length}</span> of{' '}
            <span className="font-semibold text-gray-700">{pagination.total}</span> {displayActivityName.toLowerCase()} packages
          </p>
          {!loading && packages.length > 0 && (
            <p className="text-xs text-gray-400">
              Page {pagination.page} of {pagination.totalPages}
            </p>
          )}
        </div>
      </div>
      
      {/* Packages Grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4">
          {loading ? (
            <div className="flex justify-center items-center min-h-[400px]">
              <div className="text-center">
                <div className="w-16 h-16 border-4 border-accent-color border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-500">Loading packages...</p>
              </div>
            </div>
          ) : packages.length === 0 ? (
            <div className="text-center py-16 bg-gray-50 rounded-2xl">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FontAwesomeIcon icon={faSearch} className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">No packages found</h3>
              <p className="text-gray-500">Try adjusting your filters or search criteria</p>
              <button onClick={clearFilters} className="mt-4 text-accent-color hover:underline font-medium">
                Clear all filters
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {packages.map((pkg) => (
                  <Link
                    key={pkg.id}
                    href={`/${country}/${activity}/${pkg.slug}`}
                    className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100 hover:-translate-y-1"
                  >
                    <div className="relative h-52 overflow-hidden">
                      <img
                        src={pkg.featured_image || '/images/placeholder.jpg'}
                        alt={pkg.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                      />
                      {pkg.is_featured && (
                        <span className="absolute top-3 right-3 bg-accent-color text-white text-xs font-semibold px-2 py-1 rounded-full flex items-center gap-1 shadow-sm">
                          <FontAwesomeIcon icon={faStar} className="w-3 h-3" />
                          Featured
                        </span>
                      )}
                      {pkg.is_best_selling && (
                        <span className="absolute top-3 left-3 bg-orange-500 text-white text-xs font-semibold px-2 py-1 rounded-full flex items-center gap-1 shadow-sm">
                          <FontAwesomeIcon icon={faFire} className="w-3 h-3" />
                          Best Seller
                        </span>
                      )}
                    </div>
                    <div className="p-5">
                      <h3 className="font-bold text-lg text-gray-800 mb-2 line-clamp-2 group-hover:text-accent-color transition">
                        {pkg.title}
                      </h3>
                      <div className="flex flex-wrap items-center gap-2 mb-3">
                        <span className="flex items-center gap-1 text-sm text-gray-500">
                          <FontAwesomeIcon icon={faClock} className="w-3 h-3" />
                          {pkg.duration_days} days
                        </span>
                        {pkg.difficulty && (
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getDifficultyColor(pkg.difficulty)}`}>
                            {pkg.difficulty}
                          </span>
                        )}
                      </div>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {pkg.short_description || pkg.overview?.replace(/<[^>]*>/g, '').substring(0, 100)}
                      </p>
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-2xl font-bold text-accent-color">${pkg.price}</span>
                          <span className="text-xs text-gray-500">/ person</span>
                        </div>
                        <span className="text-accent-color group-hover:translate-x-1 transition">
                          View Details →
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
              
              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-10">
                  <button
                    onClick={() => setPagination(prev => ({ ...prev, page: Math.max(1, prev.page - 1) }))}
                    disabled={pagination.page === 1}
                    className="px-4 py-2 cursor-pointer text-white rounded-lg disabled:opacity-50 bg-accent-color hover:bg-secondary-color transition shadow-sm"
                  >
                    Previous
                  </button>
                  <div className="flex gap-1">
                    {[...Array(Math.min(5, pagination.totalPages))].map((_, i) => {
                      let pageNum;
                      if (pagination.totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (pagination.page <= 3) {
                        pageNum = i + 1;
                      } else if (pagination.page >= pagination.totalPages - 2) {
                        pageNum = pagination.totalPages - 4 + i;
                      } else {
                        pageNum = pagination.page - 2 + i;
                      }
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setPagination(prev => ({ ...prev, page: pageNum }))}
                          className={`w-10 h-10 cursor-pointer rounded-lg transition ${
                            pagination.page === pageNum
                              ? 'bg-accent-color text-white shadow-sm'
                              : 'border border-gray-200 text-gray-600 hover:bg-gray-50'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>
                  <button
                    onClick={() => setPagination(prev => ({ ...prev, page: Math.min(prev.totalPages, prev.page + 1) }))}
                    disabled={pagination.page === pagination.totalPages}
                    className="px-4 py-2 cursor-pointer text-white rounded-lg disabled:opacity-50 bg-accent-color hover:bg-secondary-color transition shadow-sm"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </>
  );
}