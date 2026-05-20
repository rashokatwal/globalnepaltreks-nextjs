'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faTachometerAlt, 
  faUsers, 
  faHiking, 
  faCalendarCheck, 
  faStar, 
  faSignOutAlt, 
  faFilePen,
  faEnvelope,
  faBars,
  faTimes
} from '@fortawesome/free-solid-svg-icons';
import Image from 'next/image';
import { logos } from '@/app/assets/assets';

const Sidebar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => setIsOpen(!isOpen);
  const closeSidebar = () => setIsOpen(false);

  const navItems = [
    { name: 'Dashboard', href: '/admin', icon: faTachometerAlt },
    { name: 'Users', href: '/admin/users', icon: faUsers },
    { name: 'Packages', href: '/admin/packages', icon: faHiking },
    { name: 'Blogs', href: '/admin/blogs', icon: faFilePen },
    { name: 'Bookings', href: '/admin/bookings', icon: faCalendarCheck },
    { name: 'Contacts', href: '/admin/contacts', icon: faEnvelope },
    { name: 'Testimonials', href: '/admin/testimonials', icon: faStar },
  ];

  const handleLogout = async () => {
    try {
      const res = await fetch('/api/auth/logout', { 
        method: 'POST', 
        credentials: 'include' 
      });
      if (res.ok) {
        router.push('/admin/login');
      }
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <>
      {/* Hamburger button (mobile only) */}
      <button
        onClick={toggleSidebar}
        className="fixed top-4 left-4 z-50 p-2 bg-secondary-color text-white rounded-md lg:hidden"
        aria-label="Toggle menu"
      >
        <FontAwesomeIcon icon={isOpen ? faTimes : faBars} className="w-5 h-5" />
      </button>

      {/* Overlay (mobile only) */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar itself */}
      <aside
        className={`fixed top-0 left-0 z-50 w-64 bg-white flex flex-col shadow-sm transition-transform duration-300 h-screen ease-in-out transform lg:relative lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand / Logo */}
        <div className="p-6 border-b border-gray-300">
          <Image
            src={logos.globalnepaltreks_logo}
            alt="Global Nepal Treks Logo"
            className="w-40 h-20 object-contain cursor-pointer"
            onClick={closeSidebar} // optional: close sidebar on logo click (mobile)
          />
          {/* <p className="text-xs text-gray-400 mt-1">Admin Panel</p> */}
        </div>

        {/* Navigation */}
        <nav className="flex-1 text-sm px-4 py-6 space-y-3">
          {navItems.map((item) => {
            const isActive = pathname === item.href || 
                             (item.href !== '/admin' && pathname?.startsWith(item.href));
            
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={closeSidebar} // close sidebar on link click (mobile)
                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 ${
                  isActive
                    ? 'bg-gray-200'
                    : 'text-black/70 hover:bg-gray-300'
                }`}
              >
                <FontAwesomeIcon icon={item.icon} className="w-5 h-5" />
                <span className="font-medium">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-gray-300">
          <button
            onClick={() => {
              handleLogout();
              closeSidebar();
            }}
            className="flex items-center gap-3 cursor-pointer w-full px-4 py-2.5 rounded-lg hover:bg-red-600/20 hover:text-red-600 transition-all duration-200"
          >
            <FontAwesomeIcon icon={faSignOutAlt} className="w-5 h-5" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;