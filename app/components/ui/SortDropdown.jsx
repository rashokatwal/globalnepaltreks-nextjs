// app/components/ui/SortDropdown.js
'use client';

import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowDownWideShort } from '@fortawesome/free-solid-svg-icons';

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
    <div className="flex items-center gap-3 bg-white rounded-lg border-2 border-primary-color-dark px-3 py-1.5">
      <FontAwesomeIcon 
        icon={faArrowDownWideShort} 
        className="w-4 h-4 text-primary-color-dark"
      />
      <span className="text-sm text-gray-600 font-medium">Sort By:</span>
      <select 
        className="text-sm border-none bg-transparent focus:outline-none focus:ring-0 text-gray-800 font-medium cursor-pointer"
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