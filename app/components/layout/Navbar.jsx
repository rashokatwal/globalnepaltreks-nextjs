"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faChevronDown, 
  faMagnifyingGlass,
  faBars, 
  faTimes, 
  faRoute,
  faXmark
} from "@fortawesome/free-solid-svg-icons";
import { 
  faFacebookF, 
  faInstagram, 
  faLinkedinIn, 
  faWeixin, 
  faWhatsapp, 
  faYoutube 
} from "@fortawesome/free-brands-svg-icons";
import { useEffect, useState, useCallback, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { logos } from "@/app/assets/assets";

const NavBar = () => {
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState(null);
    const [closeTimeout, setCloseTimeout] = useState(null);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [activeMobileDropdown, setActiveMobileDropdown] = useState(null);
    const [isDesktop, setIsDesktop] = useState(false);
    const [isNavSticky, setIsNavSticky] = useState(false);
    const pathname = usePathname();
    const menuRef = useRef(null);
    const timeoutRef = useRef(null);
    const navBarRef = useRef(null);
    const topHeaderRef = useRef(null);

    const navItems = [
        { 
            name: 'Home', 
            link: '/', 
        },
        { 
            name: 'About', 
            link: '/about',
            items: [
                {
                    name: "Our Team", link: "/about/our-team"
                }
            ]
        },
        { 
            name: 'Blogs', 
            link: '/blogs'
        },
        { 
            name: 'Nepal', 
            link: '/nepal',
            items: [
                { name: 'Trekking', link: '/nepal/trekking' },
                { name: 'Tours', link: '/nepal/tours' },
                { name: 'Rafting', link: '/nepal/rafting' },
                { name: 'Jungle Safari', link: '/nepal/jungle-safari' },
                { name: 'Peak Climbing', link: '/nepal/peak-climbing' },
                { name: 'Heli Tour', link: '/nepal/heli-tour' },
            ]
        },
        { 
            name: 'Tibet', 
            link: '/tibet',
            items: [
                { name: 'Trekking', link: '/tibet/trekking' },
                { name: 'Tours', link: '/tibet/tours' }
            ]
        },
        { 
            name: 'Bhutan', 
            link: '/bhutan',
            items: [
                { name: 'Tours', link: '/bhutan/tours' },
            ]
        },
        { 
            name: 'Contact Us', 
            link: '/contact' 
        }
    ];

    // Handle scroll effect for sticky navigation
    useEffect(() => {
        const handleScroll = () => {
            if (navBarRef.current && topHeaderRef.current) {
                const topHeaderHeight = topHeaderRef.current.offsetHeight;
                const scrollPosition = window.scrollY;
                
                // Make nav bar sticky when scrolled past the top header
                setIsNavSticky(scrollPosition > topHeaderHeight);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Handle resize with debounce for performance
    useEffect(() => {
        const checkDesktop = () => {
            setIsDesktop(window.innerWidth > 1024);
            if (window.innerWidth > 1024) {
                setIsMobileMenuOpen(false);
            }
        };

        // Initial check
        checkDesktop();

        let timeoutId;
        const handleResize = () => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(checkDesktop, 100);
        };

        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
            clearTimeout(timeoutId);
        };
    }, []);

    // Handle body scroll lock for mobile menu
    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isMobileMenuOpen]);

    // Close mobile menu on route change
    useEffect(() => {
        setIsMobileMenuOpen(false);
        setActiveMobileDropdown(null);
    }, [pathname]);

    // Clean up timeouts on unmount
    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    const handleMouseEnter = useCallback((itemName) => {
        if (!isDesktop) return;
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }
        setActiveDropdown(itemName);
    }, [isDesktop]);

    const handleMouseLeave = useCallback(() => {
        if (!isDesktop) return;
        timeoutRef.current = setTimeout(() => {
            setActiveDropdown(null);
        }, 200);
    }, [isDesktop]);

    const handleDropdownMouseEnter = useCallback((itemName) => {
        if (!isDesktop) return;
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }
        setActiveDropdown(itemName);
    }, [isDesktop]);

    const toggleSearch = useCallback(() => {
        setIsSearchOpen(prev => !prev);
    }, []);

    const toggleMobileMenu = useCallback(() => {
        setIsMobileMenuOpen(prev => !prev);
    }, []);

    const toggleMobileDropdown = useCallback((itemName) => {
        setActiveMobileDropdown(prev => prev === itemName ? null : itemName);
    }, []);

    const closeAll = useCallback(() => {
        setIsMobileMenuOpen(false);
        setActiveMobileDropdown(null);
    }, []);

    // Check if a link is active
    const isActiveLink = (link) => {
        if (link === '/') {
            return pathname === link;
        }
        return pathname?.startsWith(link);
    };

    return (
        <nav className="absolute z-50 w-full flex flex-col-reverse md:flex-col md:px-4 my-0 bg-transparent top lg:px-20">
            {/* Banner */}
            <div className="w-full p-1 my-4 text-xs font-semibold text-center text-white bg-transparent lg:text-sm">
                Walk ancient paths. Touch the clouds. Conquer the Himalayas.
            </div>
            
            <div className="w-full">
                {/* Top Header Section */}
                <div 
                    ref={topHeaderRef}
                    className="relative flex flex-col items-start justify-between w-full px-4 py-4 bg-white md:rounded-md lg:pb-6 lg:flex-row lg:items-center lg:px-5"
                >
                    {/* Logo and Mobile Menu Button */}
                    <div className="flex items-center justify-between w-full mb-0 lg:w-auto">
                        <Link href="/" className="block">
                            <Image 
                                src={logos.globalnepaltreks_logo} 
                                className="h-auto w-[120px] lg:w-[200px]" 
                                width={200}
                                height={60}
                                alt="Global Nepal Treks Logo"
                                priority
                            />
                        </Link>
                        
                        {/* Mobile menu button */}
                        <button
                            className="p-2 text-gray-700 rounded-md lg:hidden hover:bg-gray-100"
                            onClick={toggleMobileMenu}
                            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
                            aria-expanded={isMobileMenuOpen}
                        >
                            <FontAwesomeIcon 
                                icon={isMobileMenuOpen ? faTimes : faBars} 
                                className="w-6 h-6"
                            />
                        </button>
                    </div>

                    {/* Contact Info and CTA */}
                    <div className="flex-col items-start hidden w-full gap-4 lg:flex lg:flex-row lg:items-center lg:gap-8 lg:w-auto">
                        {/* TripAdvisor Section */}
                        <Link 
                            href="https://www.tripadvisor.com/Attraction_Review-g293890-d17721412-Reviews-Global_Nepal_Treks-Kathmandu_Kathmandu_Valley_Bagmati_Zone_Central_Region.html" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 lg:block"
                        >
                            <Image 
                                src={logos.tripadvisor_logo} 
                                className="h-auto w-[120px]" 
                                width={120}
                                height={40}
                                alt="TripAdvisor Logo" 
                            />
                            <p className="font-bold text-[#002B11] text-md lg:text-lg">Global Nepal Treks</p>
                        </Link>
                        
                        {/* WhatsApp Contact */}
                        <Link 
                            href="https://wa.me/+9779744258519" 
                            className="flex items-center gap-2 lg:block" 
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <p className="flex items-center gap-2 text-sm font-medium">
                                <FontAwesomeIcon icon={faWhatsapp} className="text-green-500" size="lg" />
                                Talk to an expert
                            </p>
                            <p className="text-sm font-semibold text-secondary-color lg:text-base">(+977) 9744258519</p>
                        </Link>
                        
                        {/* Book Now Button */}
                        <Link 
                            href="/book"
                            className="w-full px-6 py-3 font-medium text-center text-white duration-200 rounded bg-primary-color-dark hover:bg-secondary-color lg:w-auto"
                        >
                            Book Now
                        </Link>
                    </div>
                </div>
                

                {/* Desktop Navigation Bar - This will stick */}
                <div 
                    ref={navBarRef}
                    className={`left-0 hidden w-full lg:block transition-all duration-200 ${
                        isNavSticky 
                            ? 'fixed top-0' 
                            : 'relative -mt-7'
                    }`}
                    style={{ zIndex: 60 }}
                >
                    <div className="flex flex-col items-center justify-between px-4 py-4 mx-2 font-semibold text-white rounded-md shadow-lg lg:flex-row lg:px-10 lg:mx-6 bg-secondary-color">
                        <ul className="flex flex-wrap justify-center w-full gap-4 font-medium lg:justify-start lg:gap-8 lg:w-auto">
                            {navItems.map((item) => (
                                <li 
                                    key={item.name} 
                                    className="relative"
                                    onMouseEnter={() => item.items && handleMouseEnter(item.name)}
                                    onMouseLeave={handleMouseLeave}
                                >
                                    <div className="flex items-center gap-1 duration-200 cursor-pointer hover:opacity-80">
                                        <Link 
                                            rel="canonical"
                                            href={item.link}
                                            className={`flex items-center gap-1 hover:animate-pulse text-sm lg:text-base whitespace-nowrap ${
                                                isActiveLink(item.link) ? 'font-bold underline underline-offset-4' : ''
                                            }`}
                                        >
                                            {item.name}
                                            {item.items && <FontAwesomeIcon icon={faChevronDown} className="w-2 h-2" />}
                                        </Link>
                                    </div>

                                    {item.items && activeDropdown === item.name && (
                                        <div 
                                            className="absolute top-full left-0 mt-2 bg-white shadow-lg rounded-sm min-w-55 z-50 border border-gray-100"
                                            onMouseEnter={() => handleDropdownMouseEnter(item.name)}
                                            onMouseLeave={handleMouseLeave}
                                        >
                                            <div className="py-2">
                                                {item.items.map((subItem) => (
                                                    <Link
                                                        rel="canonical"
                                                        key={subItem.name}
                                                        href={subItem.link}
                                                        className="block px-4 py-3 text-gray-700 transition-colors duration-200 hover:bg-secondary-color hover:text-white"
                                                        onClick={() => setActiveDropdown(null)}
                                                    >
                                                        {subItem.name}
                                                    </Link>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </li>
                            ))}
                        </ul>
                        
                        {/* Desktop Search */}
                        <div className="items-center hidden mt-4 lg:flex lg:mt-0">

                            <div className={`relative duration-200 overflow-hidden ${isSearchOpen ? 'w-48 lg:w-64' : 'w-0'}`}>
                                <input
                                    type="text"
                                    placeholder="Search treks, destinations..."
                                    className="w-full px-4 py-3 pr-10 rounded-full border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-gray-800 dark:text-white focus:outline-none focus:border-primary-color-dark transition-colors"
                                />
                                <button className="absolute right-1 top-1/2 transform -translate-y-1/2 cursor-pointer bg-primary-color-dark text-white p-2 rounded-full h-10 w-10 hover:bg-primary-color transition-colors">
                                    <FontAwesomeIcon icon={faRoute} className="w-3 h-3" />
                                </button>
                            </div>
                            {isSearchOpen && (
                                <FontAwesomeIcon 
                                    icon={faXmark} 
                                    className="w-4 h-4 ml-2 duration-200 cursor-pointer hover:opacity-80" 
                                    onClick={() => setIsSearchOpen(false)} 
                                    aria-label="Close search"
                                />
                            )}
                            {
                                !isSearchOpen && (
                                    <FontAwesomeIcon 
                                    icon={faMagnifyingGlass} 
                                    className={`ml-2 duration-200 cursor-pointer hover:opacity-80`}
                                    onClick={() => setIsSearchOpen(true)} 
                                    aria-label="Open search"
                                    />
                                )
                            }
                        </div>
                    </div>
                </div>

                {/* Mobile Navigation Overlay */}
                {isMobileMenuOpen && (
                    <div 
                        className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden" 
                        style={{ top: '140px' }} 
                        onClick={closeAll}
                        role="presentation"
                    ></div>
                )}

                {/* Mobile Navigation Menu */}
                <div 
                    ref={menuRef}
                    className={`fixed top-0 left-0 w-full h-screen bg-white transform transition-transform duration-300 ease-in-out z-50 lg:hidden ${
                        isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
                    aria-hidden={!isMobileMenuOpen}
                >
                    <div className="h-full overflow-y-auto">
                        <div className="flex items-center justify-between w-full p-5 mb-0 lg:w-auto">
                            <Link href="/" onClick={closeAll}>
                                <Image 
                                    src={logos.globalnepaltreks_logo} 
                                    className="h-auto w-[160px] lg:w-[200px]" 
                                    width={200}
                                    height={60}
                                    alt="Global Nepal Treks Logo" 
                                />
                            </Link>
                            
                            {/* Close button */}
                            <button
                                className="p-2 text-gray-700 rounded-md lg:hidden hover:bg-gray-100"
                                onClick={toggleMobileMenu}
                                aria-label="Close menu"
                            >
                                <FontAwesomeIcon 
                                    icon={faTimes} 
                                    className="w-6 h-6"
                                />
                            </button>
                        </div>
                        
                        <div className="p-6 border-t border-gray-200">
                            <div className={`relative duration-200 overflow-hidden`}>
                                <input
                                    type="text"
                                    placeholder="Search treks, destinations..."
                                    className="w-full px-4 py-3 pr-10 rounded-full border-2 border-gray-200 dark:border-gray-700 bg-white text-sm text-gray-800 focus:outline-none focus:border-primary-color-dark transition-colors"
                                />
                                <button className="absolute right-1 top-1/2 transform -translate-y-1/2 bg-primary-color-dark cursor-pointer text-white p-2 rounded-full h-10 w-10 hover:bg-primary-color transition-colors">
                                    <FontAwesomeIcon icon={faRoute} className="w-3 h-3" />
                                </button>
                            </div>
                        </div>
                        
                        {/* Mobile Navigation Items */}
                        <ul className="py-4">
                            {navItems.map((item) => (
                                <li key={item.name} className="border-b border-gray-100">
                                    {!item.items ? (
                                        <Link
                                            rel="canonical"
                                            href={item.link}
                                            className={`flex items-center justify-between px-6 py-4 transition-colors duration-200 hover:bg-gray-50 ${
                                                isActiveLink(item.link) ? 'text-secondary-color font-bold' : 'text-gray-700'
                                            }`}
                                            onClick={closeAll}
                                        >
                                            {item.name}
                                        </Link>
                                    ) : (
                                        <>
                                            <div 
                                                className="flex items-center justify-between px-6 py-4 text-gray-700 transition-colors duration-200 cursor-pointer hover:bg-gray-50"
                                                onClick={() => toggleMobileDropdown(item.name)}
                                                role="button"
                                                tabIndex={0}
                                                onKeyPress={(e) => e.key === 'Enter' && toggleMobileDropdown(item.name)}
                                            >
                                                <span>{item.name}</span>
                                                <FontAwesomeIcon 
                                                    icon={faChevronDown} 
                                                    className={`w-3 h-3 transition-transform duration-200 ${
                                                        activeMobileDropdown === item.name ? 'rotate-180' : ''
                                                    }`} 
                                                />
                                            </div>
                                            {activeMobileDropdown === item.name && (
                                                <div className="bg-gray-50">
                                                    {item.items.map((subItem) => (
                                                        <Link
                                                            rel="canonical"
                                                            key={subItem.name}
                                                            href={subItem.link}
                                                            className={`block px-10 py-3 transition-colors duration-200 hover:bg-secondary-color hover:text-white ${
                                                                isActiveLink(subItem.link) ? 'text-secondary-color font-bold' : 'text-gray-600'
                                                            }`}
                                                            onClick={closeAll}
                                                        >
                                                            {subItem.name}
                                                        </Link>
                                                    ))}
                                                </div>
                                            )}
                                        </>
                                    )}
                                </li>
                            ))}
                        </ul>
                        
                        <div className="flex flex-col gap-5 p-5">
                            <Link 
                                href="https://www.tripadvisor.com/Attraction_Review-g293890-d17721412-Reviews-Global_Nepal_Treks-Kathmandu_Kathmandu_Valley_Bagmati_Zone_Central_Region.html" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="flex items-center gap-3 lg:block"
                            >
                                <Image 
                                    src={logos.tripadvisor_logo} 
                                    className="h-auto w-[120px]" 
                                    width={120}
                                    height={40}
                                    alt="TripAdvisor Logo" 
                                />
                                <p className="font-bold text-[#002B11] text-md lg:text-lg">Global Nepal Treks</p>
                            </Link>
                            
                            {/* WhatsApp Contact */}
                            <Link 
                                href="https://wa.me/+9779744258519" 
                                className="flex items-center gap-2 lg:block" 
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <p className="flex items-center gap-2 text-sm font-medium">
                                    <FontAwesomeIcon icon={faWhatsapp} className="text-green-500" size="lg" />
                                    Talk to an expert
                                </p>
                                <p className="text-sm font-semibold text-secondary-color lg:text-base">(+977) 9744258519</p>
                            </Link>
                            
                            <Link 
                                href="/book-now" 
                                className="w-full px-6 py-3 mt-4 font-medium text-center text-white duration-200 rounded bg-primary-color-dark hover:bg-secondary-color"
                                onClick={closeAll}
                            >
                                Book Now
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Mobile Navigation Bar (Fixed at bottom on mobile) */}
                <div className="fixed bottom-0 left-0 right-0 z-40 px-3 py-2 font-semibold text-white shadow-lg bg-secondary-color/95 backdrop-blur-sm lg:hidden">
                    <div className="flex items-center justify-between gap-2">
                        {/* Left: Social Media */}
                        <div className="flex items-center gap-1">
                            <Link href="#" className="p-1.5 rounded-lg hover:bg-white/10" aria-label="Facebook">
                                <FontAwesomeIcon icon={faFacebookF} className="w-4 h-3.5" />
                            </Link>
                            <Link href="#" className="p-1.5 rounded-lg hover:bg-white/10" aria-label="Instagram">
                                <FontAwesomeIcon icon={faInstagram} className="w-3.5 h-3.5" />
                            </Link>
                            <Link href="#" className="p-1.5 rounded-lg hover:bg-white/10" aria-label="LinkedIn">
                                <FontAwesomeIcon icon={faLinkedinIn} className="w-3.5 h-3.5" />
                            </Link>
                            <Link href="#" className="p-1.5 rounded-lg hover:bg-white/10" aria-label="WeChat">
                                <FontAwesomeIcon icon={faWeixin} className="w-3.5 h-3.5" />
                            </Link>
                            <Link href="#" className="p-1.5 rounded-lg hover:bg-white/10" aria-label="YouTube">
                                <FontAwesomeIcon icon={faYoutube} className="w-3.5 h-3.5" />
                            </Link>
                            <Link href="#" className="p-1.5 rounded-lg hover:bg-white/10" aria-label="WhatsApp">
                                <FontAwesomeIcon icon={faWhatsapp} className="w-3.5 h-3.5 text-green-300" />
                            </Link>
                        </div>

                        {/* Center: TripAdvisor */}
                        <Link 
                            href="https://www.tripadvisor.com/Attraction_Review-g293890-d17721412-Reviews-Global_Nepal_Treks-Kathmandu_Kathmandu_Valley_Bagmati_Zone_Central_Region.html" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-center px-2 py-1 transition-colors duration-200 rounded-lg hover:bg-white/10"
                        >
                            <Image 
                                src={logos.tripadvisor_logo_white} 
                                className="w-auto h-full"
                                alt="TripAdvisor" 
                            />
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default NavBar;