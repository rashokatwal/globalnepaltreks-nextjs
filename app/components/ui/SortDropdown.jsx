// app/components/ui/SortDropdown.js
'use client';

import { useRouter } from 'next/navigation';

export default function SortDropdown({ currentSort, baseUrl }) {
  const router = useRouter();

  const handleSortChange = (e) => {
    const sortValue = e.target.value;
    
    // Get current URL and update sort parameter
    const url = new URL(window.location.href);
    
    if (sortValue === 'featured') {
      url.searchParams.delete('sort');
    } else {
      url.searchParams.set('sort', sortValue);
    }
    
    // Use router.push for client-side navigation
    router.push(url.toString());
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-gray-500">Sort by:</span>
      <select 
        className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-primary-color-dark"
        value={currentSort || 'featured'}
        onChange={handleSortChange}
      >
        <option value="featured">Featured</option>
        <option value="price_asc">Price: Low to High</option>
        <option value="price_desc">Price: High to Low</option>
        <option value="duration_asc">Duration: Short to Long</option>
        <option value="duration_desc">Duration: Long to Short</option>
        <option value="newest">Newest First</option>
      </select>
    </div>
  );
}