// app/components/sections/FilterSidebar.js
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faSlidersH, faTimes } from '@fortawesome/free-solid-svg-icons';

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
      <div className="fixed inset-0 bg-white z-50 overflow-y-auto lg:hidden animate-in slide-in-from-right duration-300">
        <div className="sticky top-0 border-b border-gray-200 p-4 flex justify-between items-center">
          <h3 className="text-lg font-bold flex items-center gap-2">
            <FontAwesomeIcon icon={faSlidersH} className="w-4 h-4 text-primary-color-dark" />
            Filters
          </h3>
          <button 
            onClick={() => setMobileFilterOpen(false)}
            className="w-8 h-8 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors"
          >
            <FontAwesomeIcon icon={faTimes} className="w-4 h-4" />
          </button>
        </div>
        
        <div className="p-4">
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
        className="lg:hidden w-full bg-white border border-gray-200 rounded-xl p-3 mb-4 flex items-center justify-center gap-2 hover:border-primary-color-dark hover:shadow-sm transition-all duration-200"
      >
        <FontAwesomeIcon icon={faSlidersH} className="w-4 h-4 text-primary-color-dark" />
        <span className="font-medium text-gray-700">Show Filters</span>
        {Object.keys(currentFilters).length > 0 && (
          <span className="bg-primary-color-dark text-white text-xs px-2 py-0.5 rounded-full ml-1">
            {Object.keys(currentFilters).length}
          </span>
        )}
      </button>

      {/* Desktop Sidebar */}
      <div className="hidden lg:block bg-white border border-gray-200 rounded-xl shadow-sm p-6 sticky top-24">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <FontAwesomeIcon icon={faSlidersH} className="w-4 h-4 text-primary-color-dark" />
            Filters
          </h3>
          {Object.keys(currentFilters).length > 0 && (
            <button
              onClick={clearFilters}
              className="text-sm text-primary-color-dark hover:underline font-medium"
            >
              Clear all
            </button>
          )}
        </div>

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
    <div className="space-y-8">
      {/* Difficulty Filter */}
      {filterOptions.difficulties.length > 0 && (
        <div>
          <h4 className="font-semibold text-gray-800 mb-3">Difficulty</h4>
          <div className="flex flex-wrap gap-2">
            {filterOptions.difficulties.map((difficulty) => {
              const isActive = currentFilters.difficulty === difficulty;
              return (
                <button
                  key={difficulty}
                  onClick={() => updateFilters('difficulty', isActive ? '' : difficulty)}
                  className={`
                    px-3 py-1.5 cursor-pointer rounded-full text-xs font-medium transition-all duration-200
                    ${difficultyColors[difficulty] || 'bg-gray-100 text-gray-800'}
                    ${isActive ? 'ring-2 ring-offset-1 ring-primary-color-dark scale-105' : 'hover:opacity-80'}
                  `}
                >
                  {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Price Range Filter */}
      <div>
        <h4 className="font-semibold text-gray-800 mb-3">Price Range (USD)</h4>
        <div className="space-y-3">
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="text-xs text-gray-500 block mb-1">Min</label>
              <input
                type="number"
                value={priceRange.min}
                onChange={(e) => setPriceRange({ ...priceRange, min: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-primary-color-dark focus:ring-1 focus:ring-primary-color-dark outline-none transition"
                min={filterOptions.priceRange.min}
                max={filterOptions.priceRange.max}
              />
            </div>
            <div className="flex-1">
              <label className="text-xs text-gray-500 block mb-1">Max</label>
              <input
                type="number"
                value={priceRange.max}
                onChange={(e) => setPriceRange({ ...priceRange, max: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-primary-color-dark focus:ring-1 focus:ring-primary-color-dark outline-none transition"
                min={filterOptions.priceRange.min}
                max={filterOptions.priceRange.max}
              />
            </div>
          </div>
          <button
            onClick={applyPriceFilter}
            className="w-full bg-primary-color-dark cursor-pointer text-white py-2.5 rounded-lg text-sm font-medium hover:bg-primary-color transition-colors"
          >
            Apply
          </button>
        </div>
      </div>

      {/* Duration Filter */}
      {filterOptions.durations.length > 0 && (
        <div>
          <h4 className="font-semibold text-gray-800 mb-3">Max Duration</h4>
          <select
            value={currentFilters.duration || ''}
            onChange={(e) => updateFilters('duration', e.target.value)}
            className="w-full px-3 py-2 border cursor-pointer border-gray-200 rounded-lg text-sm focus:border-primary-color-dark focus:ring-1 focus:ring-primary-color-dark outline-none transition bg-white"
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
        <div className="pt-4 border-t border-gray-100">
          <h4 className="font-semibold text-gray-800 mb-2">Active Filters</h4>
          <div className="flex flex-wrap gap-2">
            {Object.entries(currentFilters).map(([key, value]) => (
              value && (
                <div
                  key={key}
                  className="bg-gray-100 px-2 py-1 rounded-full text-xs flex items-center gap-1"
                >
                  <span className="capitalize text-gray-600">{key}:</span>
                  <span className="font-medium text-gray-800">{value}</span>
                  <button
                    onClick={() => updateFilters(key, '')}
                    className="ml-1 text-gray-400 hover:text-gray-600 transition-colors"
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