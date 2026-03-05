// app/components/sections/FilterSidebar.js
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faSlidersH } from '@fortawesome/free-solid-svg-icons';

export default function FilterSidebar({ filterOptions, currentFilters, baseUrl }) {
  const router = useRouter();
  const [priceRange, setPriceRange] = useState({
    min: currentFilters.minPrice || filterOptions.priceRange.min,
    max: currentFilters.maxPrice || filterOptions.priceRange.max
  });
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const difficultyColors = {
    easy: 'bg-green-100 text-green-800',
    moderate: 'bg-yellow-100 text-yellow-800',
    challenging: 'bg-orange-100 text-orange-800',
    difficult: 'bg-red-100 text-red-800'
  };

  const updateFilters = (key, value) => {
    const url = new URL(window.location.href);
    
    if (value === '' || value === null || value === undefined) {
      url.searchParams.delete(key);
    } else {
      url.searchParams.set(key, value);
    }
    
    router.push(url.toString());
  };

  const clearFilters = () => {
    router.push(baseUrl);
  };

  const applyPriceFilter = () => {
    updateFilters('minPrice', priceRange.min);
    updateFilters('maxPrice', priceRange.max);
  };

  // Mobile filter toggle
  if (mobileFilterOpen) {
    return (
      <div className="lg:hidden fixed inset-0 bg-white z-50 overflow-y-auto">
        <div className="p-4">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <FontAwesomeIcon icon={faSlidersH} className="w-4 h-4" />
              Filters
            </h3>
            <button 
              onClick={() => setMobileFilterOpen(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>
          
          {/* Mobile filter content - same as desktop but simplified */}
          <FilterContent 
            filterOptions={filterOptions}
            currentFilters={currentFilters}
            difficultyColors={difficultyColors}
            priceRange={priceRange}
            setPriceRange={setPriceRange}
            updateFilters={updateFilters}
            applyPriceFilter={applyPriceFilter}
            clearFilters={clearFilters}
          />
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Mobile Filter Button */}
      <button
        onClick={() => setMobileFilterOpen(true)}
        className="lg:hidden w-full bg-white border border-gray-200 rounded-lg p-3 mb-4 flex items-center justify-center gap-2"
      >
        <FontAwesomeIcon icon={faSlidersH} className="w-4 h-4" />
        Show Filters
      </button>

      {/* Desktop Sidebar */}
      <div className="hidden lg:block bg-white border border-gray-200 rounded-lg p-6 sticky top-24">
        <h3 className="text-lg font-bold mb-6 flex items-center justify-between">
          <span>Filters</span>
          {Object.keys(currentFilters).length > 0 && (
            <button
              onClick={clearFilters}
              className="text-sm text-primary-color-dark hover:underline font-normal"
            >
              Clear all
            </button>
          )}
        </h3>

        <FilterContent 
          filterOptions={filterOptions}
          currentFilters={currentFilters}
          difficultyColors={difficultyColors}
          priceRange={priceRange}
          setPriceRange={setPriceRange}
          updateFilters={updateFilters}
          applyPriceFilter={applyPriceFilter}
        />
      </div>
    </>
  );
}

function FilterContent({ 
  filterOptions, 
  currentFilters, 
  difficultyColors, 
  priceRange, 
  setPriceRange, 
  updateFilters, 
  applyPriceFilter,
  clearFilters 
}) {
  return (
    <div className="space-y-6">
      {/* Difficulty Filter */}
      {filterOptions.difficulties.length > 0 && (
        <div>
          <h4 className="font-semibold mb-3">Difficulty</h4>
          <div className="space-y-2">
            {filterOptions.difficulties.map((difficulty) => (
              <label key={difficulty} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="difficulty"
                  value={difficulty}
                  checked={currentFilters.difficulty === difficulty}
                  onChange={(e) => updateFilters('difficulty', e.target.value)}
                  className="text-primary-color-dark focus:ring-primary-color-dark"
                />
                <span className={`px-2 py-1 rounded-full text-xs ${difficultyColors[difficulty] || 'bg-gray-100 text-gray-800'}`}>
                  {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                </span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Price Range Filter */}
      <div>
        <h4 className="font-semibold mb-3">Price Range</h4>
        <div className="space-y-3">
          <div className="flex gap-2">
            <div className="flex-1">
              <label className="text-xs text-gray-500">Min ($)</label>
              <input
                type="number"
                value={priceRange.min}
                onChange={(e) => setPriceRange({ ...priceRange, min: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                min={filterOptions.priceRange.min}
                max={filterOptions.priceRange.max}
              />
            </div>
            <div className="flex-1">
              <label className="text-xs text-gray-500">Max ($)</label>
              <input
                type="number"
                value={priceRange.max}
                onChange={(e) => setPriceRange({ ...priceRange, max: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                min={filterOptions.priceRange.min}
                max={filterOptions.priceRange.max}
              />
            </div>
          </div>
          <button
            onClick={applyPriceFilter}
            className="w-full bg-primary-color-dark text-white py-2 rounded-lg text-sm hover:bg-primary-color transition"
          >
            Apply Price Range
          </button>
        </div>
      </div>

      {/* Duration Filter */}
      {filterOptions.durations.length > 0 && (
        <div>
          <h4 className="font-semibold mb-3">Max Duration</h4>
          <select
            value={currentFilters.duration || ''}
            onChange={(e) => updateFilters('duration', e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-color-dark"
          >
            <option value="">Any duration</option>
            {filterOptions.durations.map((days) => (
              <option key={days} value={days}>Up to {days} days</option>
            ))}
          </select>
        </div>
      )}

      {/* Active Filters Summary */}
      {Object.keys(currentFilters).length > 0 && (
        <div className="pt-4 border-t">
          <h4 className="font-semibold mb-2">Active Filters</h4>
          <div className="flex flex-wrap gap-2">
            {Object.entries(currentFilters).map(([key, value]) => (
              value && (
                <div
                  key={key}
                  className="bg-gray-100 px-2 py-1 rounded-full text-xs flex items-center gap-1"
                >
                  <span className="capitalize">{key}:</span>
                  <span className="font-medium">{value}</span>
                  <button
                    onClick={() => updateFilters(key, '')}
                    className="ml-1 text-gray-500 hover:text-gray-700"
                  >
                    ×
                  </button>
                </div>
              )
            ))}
          </div>
        </div>
      )}
    </div>
  );
}