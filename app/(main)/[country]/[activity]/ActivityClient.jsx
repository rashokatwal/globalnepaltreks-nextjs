// app/[country]/[activity]/ActivityClient.jsx
'use client';

import * as React from 'react';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter, faTimes } from '@fortawesome/free-solid-svg-icons';
import PackageCard from '@/app/components/cards/PackageCard';
import FilterSidebar from '@/app/components/sections/FilterSidebar';
import SortDropdown from '@/app/components/ui/SortDropdown';

export default function ActivityClient({ country, activity, countryId, activityId, filters = {} }) {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterOptions, setFilterOptions] = useState({
    difficulties: [],
    priceRange: { min: 0, max: 10000 },
    durations: []
  });

  const activityName = activity?.split('-').map(word =>
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ') || '';

  const countryName = country?.charAt(0).toUpperCase() + country?.slice(1) || '';

  // Fetch packages when filters or sort change
  useEffect(() => {
    async function fetchPackages() {
      setLoading(true);
      try {
        const params = new URLSearchParams({
          country_id: countryId,
          activity_id: activityId,
          limit: '50'
        });

        if (filters.difficulty) params.append('difficulty', filters.difficulty);
        if (filters.minPrice) params.append('min_price', filters.minPrice);
        if (filters.maxPrice) params.append('max_price', filters.maxPrice);
        if (filters.duration) params.append('max_duration', filters.duration);
        if (filters.sort) params.append('sort', filters.sort);

        const packagesRes = await fetch(`/api/packages?${params.toString()}`, {next: { revalidate: 0 }});
        const packagesData = await packagesRes.json();

        let fetchedPackages = [];
        if (packagesData.success && packagesData.data?.packages) {
          fetchedPackages = packagesData.data.packages;
        }

        setPackages(fetchedPackages);

        // Calculate filter options from results
        const difficulties = [...new Set(fetchedPackages.map(p => p.difficulty))].filter(Boolean);
        const prices = fetchedPackages.map(p => p.price).filter(Boolean);
        const minPrice = prices.length ? Math.min(...prices) : 0;
        const maxPrice = prices.length ? Math.max(...prices) : 10000;
        const durations = [...new Set(fetchedPackages.map(p => p.duration_days))].filter(Boolean).sort((a, b) => a - b);

        setFilterOptions({
          difficulties,
          priceRange: { min: minPrice, max: maxPrice },
          durations
        });

      } catch (error) {
        console.error('Failed to fetch packages:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchPackages();
  }, [countryId, activityId, filters.difficulty, filters.minPrice, filters.maxPrice, filters.duration, filters.sort]);

  if (loading) {
    return (
      <main className="bg-white">
        <section className="h-[80vh] bg-linear-to-t from-black to-secondary-color text-white py-16">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <div className="h-10 bg-white/20 rounded-lg animate-pulse w-96 mx-auto mb-4"></div>
            <div className="h-6 bg-white/20 rounded-lg animate-pulse w-64 mx-auto"></div>
          </div>
        </section>
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-gray-100 rounded-lg h-80 animate-pulse"></div>
              ))}
            </div>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="bg-gray-900">
      {/* Hero Section */}
      <section className="bg-linear-to-t from-black/90 via-black/50 to-transparent h-[80vh] flex items-end text-white py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 font-montserrat">
            {activityName} in {countryName}
          </h1>
          <p className="text-xl max-w-3xl mx-auto opacity-90">
            Discover the best {activityName.toLowerCase()} packages in {countryName}
          </p>
        </div>
      </section>

      {/* Results Count & Active Filters */}
      <section className="py-6 bg-gray-50 border-y border-gray-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <FontAwesomeIcon icon={faFilter} className="text-gray-400 w-4 h-4" />
              <span className="text-gray-600">
                <span className="font-semibold text-gray-900">{packages.length}</span> packages found
              </span>
            </div>

            {/* Active Filters */}
            <div className="flex flex-wrap items-center gap-2">
              {filters.difficulty && (
                <div className="flex items-center gap-1 bg-white px-3 py-1 rounded-full text-sm border border-gray-200">
                  <span className="text-gray-600">Difficulty:</span>
                  <span className="font-medium text-gray-900 capitalize">{filters.difficulty}</span>
                  <Link href={`/${country}/${activity}`} className="ml-1 text-gray-400 hover:text-gray-600">
                    <FontAwesomeIcon icon={faTimes} className="w-3 h-3" />
                  </Link>
                </div>
              )}

              {filters.minPrice && filters.maxPrice && (
                <div className="flex items-center gap-1 bg-white px-3 py-1 rounded-full text-sm border border-gray-200">
                  <span className="text-gray-600">Price:</span>
                  <span className="font-medium text-gray-900">
                    ${filters.minPrice} - ${filters.maxPrice}
                  </span>
                  <Link href={`/${country}/${activity}`} className="ml-1 text-gray-400 hover:text-gray-600">
                    <FontAwesomeIcon icon={faTimes} className="w-3 h-3" />
                  </Link>
                </div>
              )}

              {filters.duration && (
                <div className="flex items-center gap-1 bg-white px-3 py-1 rounded-full text-sm border border-gray-200">
                  <span className="text-gray-600">Max Days:</span>
                  <span className="font-medium text-gray-900">{filters.duration}</span>
                  <Link href={`/${country}/${activity}`} className="ml-1 text-gray-400 hover:text-gray-600">
                    <FontAwesomeIcon icon={faTimes} className="w-3 h-3" />
                  </Link>
                </div>
              )}

              {Object.keys(filters).length > 0 && (
                <Link
                  href={`/${country}/${activity}`}
                  className="text-sm text-primary-color-dark hover:underline ml-2"
                >
                  Clear all filters
                </Link>
              )}
            </div>

            {/* Sort Dropdown */}
            <SortDropdown
              currentSort={filters.sort}
              baseUrl={`/${country}/${activity}`}
            />
          </div>
        </div>
      </section>

      {/* Main Content with Filters */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filter Sidebar */}
            <div className="lg:w-1/4">
              <FilterSidebar
                filterOptions={filterOptions}
                currentFilters={filters}
                baseUrl={`/${country}/${activity}`}
              />
            </div>

            {/* Packages Grid */}
            <div className="lg:w-3/4">
              {packages.length > 0 ? (
                <>
                  <h2 className="text-2xl font-bold mb-8 text-gray-900">
                    Available {activityName} Packages
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {packages.map((pkg) => (
                      <PackageCard
                        key={pkg.id}
                        packageDetails={{
                          id: pkg.id,
                          title: pkg.title,
                          slug: pkg.slug,
                          link: `/${country}/${activity}/${pkg.slug}`,
                          country: countryName,
                          image: pkg.featured_image,
                          price: pkg.price,
                          duration: `${pkg.duration_days} Days`,
                          difficulty: pkg.difficulty,
                          description: pkg.short_description
                        }}
                      />
                    ))}
                  </div>
                </>
              ) : (
                <div className="text-center py-16 bg-gray-50 rounded-lg">
                  <div className="max-w-md mx-auto">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">No Packages Found</h3>
                    <p className="text-gray-600 mb-6">
                      No {activityName.toLowerCase()} packages found in {countryName} matching your criteria.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <Link
                        href={`/${country}/${activity}`}
                        className="bg-primary-color-dark text-white px-6 py-2 rounded-lg hover:bg-primary-color transition"
                      >
                        Clear All Filters
                      </Link>
                      <Link
                        href={`/${country}`}
                        className="border border-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-50 transition"
                      >
                        Back to {countryName}
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}