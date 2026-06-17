"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faChevronDown, 
  faMagnifyingGlass,
  faBars, 
  faTimes, 
  faRoute,
  faXmark,
  faChevronRight
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
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [activeMobileDropdown, setActiveMobileDropdown] = useState(null);
    const [activeMobileSubDropdown, setActiveMobileSubDropdown] = useState(null);
    const [isDesktop, setIsDesktop] = useState(false);
    const [isNavSticky, setIsNavSticky] = useState(false);
    const pathname = usePathname();
    const menuRef = useRef(null);
    const timeoutRef = useRef(null);
    const navBarRef = useRef(null);
    const navInnerRef = useRef(null);
    const topHeaderRef = useRef(null);

    const navItems = [
        { 
            name: 'Home', 
            link: '/', 
        },
        {
            // ── DESTINATIONS: Nepal + Tibet + Bhutan combined ──
            name: 'Destinations',
            link: '/destinations',
            isMegaMenuDestinations: true,
            countries: [
                {
                    name: 'Nepal',
                    link: '/nepal',
                    categories: [
                        { 
                            name: 'Trekking', 
                            link: '/nepal/trekking',
                            subItems: [
                                { name: 'Everest Gokyo Trek via Bhasa', link: '/nepal/trekking/everest-gokyo-trek-via-bhasa' },
                                { name: 'Annapurna Circuit Trek', link: '/nepal/trekking/annapurna-circuit-trek' },
                                { name: 'Manaslu Circuit Trek', link: '/nepal/trekking/manaslu-circuit-trek' },
                                { name: 'Langtang Valley Trek', link: '/nepal/trekking/langtang-valley-trek' },
                                { name: 'Upper Mustang Treks', link: '/nepal/trekking/upper-mustang-treks' },
                            ]
                        },
                        { 
                            name: 'Tours', 
                            link: '/nepal/tours',
                            subItems: [
                                { name: 'Kathmandu Valley Tour', link: '/nepal/tours/kathmandu-valley-tour' },
                                { name: 'Kathmandu Pokhara Tour', link: '/nepal/tours/kathmandu-pokhara-tour' },
                                { name: 'Himalayan View Tour', link: '/nepal/tours/himalayan-view-tour' },
                                { name: 'Muktinath Tour', link: '/nepal/tours/muktinath-tour' },
                            ]
                        },
                        { 
                            name: 'Heli Tour', 
                            link: '/nepal/heli-tour',
                            subItems: [
                                { name: 'Everest Helicopter Tour', link: '/nepal/heli-tour/everest-helicopter-tour' },
                                { name: 'Helicopter Tour to Muktinath', link: '/nepal/heli-tour/helicopter-tour-to-muktinath' },
                                { name: 'Langtang Heli Tour', link: '/nepal/heli-tour/langtang-heli-tour' },
                            ]
                        },
                        { 
                            name: 'Jungle Safari', 
                            link: '/nepal/jungle-safari',
                            subItems: [
                                { name: 'Chitwan National Park Tour', link: '/nepal/jungle-safari/chitwan-national-park-tour' },
                                { name: 'Koshi Tappu Wildlife Tour', link: '/nepal/jungle-safari/koshi-tappu-wildlife-tour' },
                            ]
                        },
                        { 
                            name: 'Rafting', 
                            link: '/nepal/rafting',
                            subItems: [
                                { name: 'Trishuli River Rafting', link: '/nepal/rafting/trishuli-river-rafting-in-nepal' },
                            ]
                        },
                        { 
                            name: 'Paragliding', 
                            link: '/nepal/paragliding',
                            subItems: [
                                { name: 'Paragliding in Nepal', link: '/nepal/paragliding/paragliding-in-nepal' },
                            ]
                        },
                        { 
                            name: 'Zip Flying', 
                            link: '/nepal/zip-flyer',
                            subItems: [
                                { name: 'Zip Flying in Pokhara', link: '/nepal/zip-flyer/zip-flyer-in-pokhara' },
                            ]
                        },
                        { 
                            name: 'Ultra Light Flight', 
                            link: '/nepal/ultra-light-flight',
                            subItems: [
                                { name: 'Ultra Light Flight in Pokhara', link: '/nepal/ultra-light-flight/ultra-light-flight-in-pokhara' },
                            ]
                        },
                    ]
                },
                {
                    name: 'Tibet',
                    link: '/tibet',
                    categories: [
                        { 
                            name: 'Mount Kailash Tour', 
                            link: '/tibet/kailash',
                            subItems: [
                                { name: 'Mount Kailash Tour', link: '/tibet/tours/mount-kailash-tour' },
                                { name: 'Tibet Kailash Tour', link: '/tibet/tours/tibet-kailash-tour' },
                            ]
                        },
                        { 
                            name: 'Tibet Tours', 
                            link: '/tibet/tours',
                            subItems: [
                                { name: 'Cultural Tibet Tour', link: '/tibet/tours/cultural-tibet-tour' },
                                { name: 'Tibet Overland Tour', link: '/tibet/tours/tibet-overland-tour' },
                                { name: 'Kunming Lhasa Tour', link: '/tibet/tours/kunming-lhasa-tour' },
                                { name: 'Nepal Lhasa Tour', link: '/tibet/tours/nepal-lhasa-tour' },
                            ]
                        },
                        { 
                            name: 'Trekking', 
                            link: '/tibet/trekking',
                            subItems: [
                                { name: 'Everest Tour Via Tibet', link: '/tibet/trekking/everest-tour-via-tibet' },
                            ]
                        },
                    ]
                },
                {
                    name: 'Bhutan',
                    link: '/bhutan',
                    categories: [
                        { 
                            name: 'Tours', 
                            link: '/bhutan/tours',
                            subItems: [
                                { name: 'Bhutan Dragon Heart Tour', link: '/bhutan/tours/bhutan-dragon_heart-tour' },
                                { name: 'Bhutan Short Tour', link: '/bhutan/tours/bhutan-short-tour' },
                                { name: 'Bhutan Cultural Tour', link: '/bhutan/tours/bhutan-cultural-tour' },
                                { name: 'Classic Bhutan Trek', link: '/bhutan/tours/classic-bhutan-trek' },
                            ]
                        },
                    ]
                },
            ]
        },
        { 
            name: 'Trekking in Nepal', 
            link: '/nepal/trekking',
            items: [
                { 
                    name: 'Everest Region', 
                    link: '',
                    subItems: [
                        { name: 'Everest Short Trek', link: '/nepal/trekking/everest-short-trek' },
                        { name: 'Everest Gokyo Trek via Bhasa', link: '/nepal/trekking/everest-gokyo-trek-via-bhasa' },
                        { name: 'Everest Base Camp Trek', link: '/nepal/trekking/everest-base-camp-trek' },
                        { name: 'Everest Base Camp Yoga Trek', link: '/nepal/trekking/everest-base-camp-yoga-trek' },
                    ]
                },
                { 
                    name: 'Annapurna Region', 
                    link: '',
                    subItems: [
                        { name: 'Annapurna Short Trek', link: '/nepal/trekking/annapurna-short-trek' },
                        { name: 'Annapurna Circuit Trek', link: '/nepal/trekking/annapurna-circuit-trek' },
                        { name: 'Ghorepani Poon Hill Trek', link: '/nepal/trekking/ghorepani-poonhill-trek' },
                        { name: 'Annapurna Base Camp Trek', link: '/nepal/trekking/annapurna-base-camp-trekking' },
                        { name: 'Annapurna Base Camp Yoga Trek', link: '/nepal/trekking/annapurna-base-camp-yoga-trek' },
                        { name: 'Annapurna Royal Trek', link: '/nepal/trekking/annapurna-royal-trek' },
                        { name: 'ABC Helicopter Treks', link: '/nepal/trekking/abc-helicopter-treks' },
                    ]
                },
                { 
                    name: 'Manaslu Region', 
                    link: '',
                    subItems: [
                        { name: 'Manaslu Circuit Trek', link: '/nepal/trekking/manaslu-circuit-trek' },
                        { name: 'Manaslu Tsum Valley Trek', link: '/nepal/trekking/manaslu-tsum-valley-trek' },
                    ]
                },
                { 
                    name: 'Langtang Region', 
                    link: '',
                    subItems: [
                        { name: 'Langtang Village Trek', link: '/nepal/trekking/langtang-village-trek' },
                        { name: 'Langtang Valley Trek', link: '/nepal/trekking/langtang-valley-trek' },
                        { name: 'Langtang Ganja-La Pass Trek', link: '/nepal/trekking/langtang-ganja-la-pass-trek' },
                        { name: 'Langtang Gosaikunda Trek', link: '/nepal/trekking/langtang-gosaikunda-trek' },
                    ]
                },
                { 
                    name: 'Mustang Region', 
                    link: '',
                    subItems: [
                        { name: 'Upper Mustang Treks', link: '/nepal/trekking/upper-mustang-treks' },
                        { name: 'Upper Mustang Trek via Teri La', link: '/nepal/trekking/upper-mustang-trek-via-teri-la' },
                    ]
                },
            ]
        },
        { 
            name: 'Tours in Nepal', 
            link: '/nepal/tours',
            items: [
                { 
                    name: 'Heli Tours', 
                    link: '/nepal/heli-tour',
                    subItems: [
                        { name: 'Langtang Heli Tour', link: '/nepal/heli-tour/langtang-heli-tour' },
                        { name: 'Helicopter Tour to Muktinath', link: '/nepal/heli-tour/helicopter-tour-to-muktinath' },
                        { name: 'Everest Helicopter Tour', link: '/nepal/heli-tour/everest-helicopter-tour' },
                        { name: 'Everest Heli Trek', link: '/nepal/heli-tour/everest-heli-trek' },
                    ]
                },
                { 
                    name: 'City & Cultural Tours', 
                    link: '/nepal/tours',
                    subItems: [
                        { name: 'Kathmandu Valley Tour', link: '/nepal/tours/kathmandu-valley-tour' },
                        { name: 'Kathmandu Pokhara Tour', link: '/nepal/tours/kathmandu-pokhara-tour' },
                        { name: 'Himalayan View Tour', link: '/nepal/tours/himalayan-view-tour' },
                        { name: 'Traditional Hindu Wedding Ceremonies', link: '/nepal/tours/traditional-hindu-wedding-ceremonies' },
                        { name: 'Buddhist Pilgrimage Tours', link: '/nepal/tours/buddhist-pilgrimage-tour-in-nepal' },
                        { name: 'Upper Mustang 4WD Jeep Tour', link: '/nepal/tours/upper-mustang-4wd-jeep-tour' },
                    ]
                },
                { 
                    name: 'Jungle Safari', 
                    link: '/nepal/jungle-safari',
                    subItems: [
                        { name: 'Chitwan National Park Tour', link: '/nepal/jungle-safari/chitwan-national-park-tour' },
                        { name: 'Koshi Tappu Wildlife Tour', link: '/nepal/jungle-safari/koshi-tappu-wildlife-tour' },
                    ]
                },
                { 
                    name: 'Adventure Packages', 
                    link: '',
                    subItems: [
                        { name: 'Paragliding in Nepal', link: '/nepal/paragliding/paragliding-in-nepal' },
                        { name: 'Trishuli River Rafting', link: '/nepal/rafting/trishuli-river-rafting-in-nepal' },
                        { name: 'Bhote Koshi Rafting', link: '/nepal/rafting/bhote-koshi-rafting-with-bungee-jumping' },
                        { name: 'Zip Flying in Pokhara', link: '/nepal/zip-flyer/zip-flyer-in-pokhara' },
                        { name: 'Ultra Light Flight in Pokhara', link: '/nepal/ultra-light-flight/ultra-light-flight-in-pokhara' },
                    ]
                },
            ]
        },
        { 
            name: 'Travel Guides', 
            link: '/travel-guides',
            items: [
                { name: 'Trekking Permit and TIMS', link: '/travel-guides/trekking-permit-and-tims' },
                { name: 'Trekking Gear & Equipment', link: '/travel-guides/trekking-gear-and-equipment' },
                { name: 'Protected Areas of Nepal', link: '/travel-guides/protected-areas-of-nepal' },
                { name: 'Visa Information', link: '/travel-guides/visa-info' },
                { name: 'Useful Tips to Travel in Nepal', link: '/travel-guides/useful-tips-to-travel-in-nepal' },
                { name: 'Tourist Security in Nepal', link: '/travel-guides/tourist-security-in-nepal' },
            ]
        },
        { 
            name: 'About', 
            link: '/about',
            items: [
                { name: 'About Us', link: '/about' },
                { name: 'Our Team', link: '/about/our-team' },
                { name: 'Blogs', link: '/blogs' },
            ]
        },
        { 
            name: 'Contact Us', 
            link: '/contact' 
        }
    ];

    // Helper: regular mega-menu (items with subItems)
    const isMegaMenu = (item) =>
        item.items && item.items.some((i) => i.subItems && i.subItems.length > 0);

    // Country flag/emoji map
    // const countryFlag = { Nepal: '🇳🇵', Tibet: '🏔️', Bhutan: '🇧🇹' };

    // Handle scroll for sticky nav
    useEffect(() => {
        const handleScroll = () => {
            if (navBarRef.current && topHeaderRef.current) {
                const topHeaderHeight = topHeaderRef.current.offsetHeight;
                setIsNavSticky(window.scrollY > topHeaderHeight);
            }
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Handle resize with debounce
    useEffect(() => {
        const checkDesktop = () => {
            setIsDesktop(window.innerWidth > 1024);
            if (window.innerWidth > 1024) setIsMobileMenuOpen(false);
        };
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

    // Body scroll lock for mobile menu
    useEffect(() => {
        document.body.style.overflow = isMobileMenuOpen ? 'hidden' : 'unset';
        return () => { document.body.style.overflow = 'unset'; };
    }, [isMobileMenuOpen]);

    // Close mobile menu on route change
    useEffect(() => {
        setIsMobileMenuOpen(false);
        setActiveMobileDropdown(null);
        setActiveMobileSubDropdown(null);
    }, [pathname]);

    // Cleanup timeouts
    useEffect(() => {
        return () => { if (timeoutRef.current) clearTimeout(timeoutRef.current); };
    }, []);

    const handleMouseEnter = useCallback((itemName) => {
        if (!isDesktop) return;
        if (timeoutRef.current) { clearTimeout(timeoutRef.current); timeoutRef.current = null; }
        setActiveDropdown(itemName);
    }, [isDesktop]);

    const handleMouseLeave = useCallback(() => {
        if (!isDesktop) return;
        timeoutRef.current = setTimeout(() => setActiveDropdown(null), 200);
    }, [isDesktop]);

    const handleDropdownMouseEnter = useCallback((itemName) => {
        if (!isDesktop) return;
        if (timeoutRef.current) { clearTimeout(timeoutRef.current); timeoutRef.current = null; }
        setActiveDropdown(itemName);
    }, [isDesktop]);

    const toggleMobileMenu = useCallback(() => setIsMobileMenuOpen(prev => !prev), []);

    const toggleMobileDropdown = useCallback((itemName) => {
        setActiveMobileDropdown(prev => prev === itemName ? null : itemName);
        setActiveMobileSubDropdown(null);
    }, []);

    const toggleMobileSubDropdown = useCallback((itemName) => {
        setActiveMobileSubDropdown(prev => prev === itemName ? null : itemName);
    }, []);

    const closeAll = useCallback(() => {
        setIsMobileMenuOpen(false);
        setActiveMobileDropdown(null);
        setActiveMobileSubDropdown(null);
    }, []);

    const isActiveLink = (link) => {
        if (link === '/') return pathname === link;
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
                    <div className="flex items-center justify-between w-full mb-0 lg:w-auto">
                        <div className="flex items-center justify-center gap-10">
                            <Link href="/" className="block">
                                <Image
                                    src={logos.globalnepaltreks_logo}
                                    className="h-auto w-30 lg:w-50"
                                    width={200}
                                    height={60}
                                    alt="Global Nepal Treks Logo"
                                    priority
                                />
                            </Link>
                            <div>
                                <p className="font-semibold text-accent-color uppercase underline">
                                    Licence Number: <span className="text-secondary-color">3058</span>
                                </p>
                            </div>
                        </div>
                        <button
                            className="p-2 text-gray-700 rounded-md lg:hidden hover:bg-gray-100"
                            onClick={toggleMobileMenu}
                            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
                            aria-expanded={isMobileMenuOpen}
                        >
                            <FontAwesomeIcon icon={isMobileMenuOpen ? faTimes : faBars} className="w-6 h-6" />
                        </button>
                    </div>

                    <div className="flex-col items-start hidden w-full gap-4 lg:flex lg:flex-row lg:items-center lg:gap-8 lg:w-auto">
                        <Link
                            href="https://www.tripadvisor.com/Attraction_Review-g293890-d17721412-Reviews-Global_Nepal_Treks-Kathmandu_Kathmandu_Valley_Bagmati_Zone_Central_Region.html"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 lg:block"
                        >
                            <Image src={logos.tripadvisor_logo} className="h-auto w-30" width={120} height={40} alt="TripAdvisor Logo" />
                            <p className="font-bold text-[#002B11] text-md lg:text-lg">Global Nepal Treks</p>
                        </Link>

                        <Link href="https://wa.me/+9779744258519" className="flex items-center gap-2 lg:block" target="_blank" rel="noopener noreferrer">
                            <p className="flex items-center gap-2 text-sm font-medium">
                                <FontAwesomeIcon icon={faWhatsapp} className="text-green-500" size="lg" />
                                Talk to an expert
                            </p>
                            <p className="text-sm font-semibold text-secondary-color lg:text-base">(+977) 9744258519</p>
                        </Link>

                        <Link href="/book" className="w-full px-6 py-3 font-medium text-center text-white duration-200 rounded bg-accent-color hover:bg-secondary-color lg:w-auto">
                            Plan Your Trip
                        </Link>
                    </div>
                </div>

                {/* ─────────────────────────────────────────────
                    DESKTOP NAVIGATION BAR
                _____________________________________________ */}
                <div
                    ref={navBarRef}
                    className={`left-0 hidden w-full lg:block transition-all duration-200 ${isNavSticky ? 'fixed top-0' : 'relative -mt-7'}`}
                    style={{ zIndex: 60 }}
                >
                    <div
                        ref={navInnerRef}
                        className="relative flex flex-col items-center justify-between px-4 py-4 mx-2 font-semibold text-white rounded-md shadow-lg lg:flex-row lg:px-10 lg:mx-6 bg-accent-color"
                    >
                        <ul className="flex flex-wrap justify-center w-full gap-4 font-medium lg:justify-start lg:gap-6 lg:w-auto">
                            {navItems.map((item) => (
                                <li
                                    key={item.name}
                                    className={`${item.isMegaMenuDestinations || isMegaMenu(item) ? '' : 'relative'}`}
                                    onMouseEnter={() => (item.items || item.isMegaMenuDestinations) && handleMouseEnter(item.name)}
                                    onMouseLeave={handleMouseLeave}
                                >
                                    <Link
                                        rel="canonical"
                                        href={item.link}
                                        className={`flex items-center gap-1 text-sm whitespace-nowrap hover:opacity-80 transition-opacity ${
                                            isActiveLink(item.link) ? 'font-bold underline underline-offset-4' : ''
                                        }`}
                                    >
                                        {item.name}
                                        {(item.items || item.isMegaMenuDestinations) && (
                                            <FontAwesomeIcon icon={faChevronDown} className="w-2 h-2" />
                                        )}
                                    </Link>

                                    {/* ── DROPDOWN ── */}
                                    {activeDropdown === item.name && (

                                        item.isMegaMenuDestinations ? (
                                            /* ────────────────────────────────────────
                                               DESTINATIONS MEGA MENU
                                               3 country columns, divided by vertical
                                               lines, each with flag + name header,
                                               then category labels + sub-links below
                                            ──────────────────────────────────────── */
                                            <div
                                                className="absolute left-0 right-0 top-full mt-2 bg-white shadow-xl rounded-b-md border-t-2 border-accent-color z-50 overflow-hidden"
                                                onMouseEnter={() => handleDropdownMouseEnter(item.name)}
                                                onMouseLeave={handleMouseLeave}
                                            >
                                                <div className="flex flex-col divide-y divide-gray-100">
                                                    {/* Nepal full-width row */}
                                                    {item.countries.slice(0, 1).map((country) => (
                                                        <div key={country.name} className="px-6 py-5">
                                                            <Link
                                                                href={country.link}
                                                                className="flex items-center gap-2 mb-4 pb-2.5 border-b-2 border-accent-color/25 group"
                                                                onClick={() => setActiveDropdown(null)}
                                                            >
                                                                <span className="text-sm font-extrabold uppercase tracking-widest text-accent-color group-hover:text-secondary-color transition-colors duration-150">
                                                                    {country.name}
                                                                </span>
                                                            </Link>
                                                            <div className="grid grid-cols-5 flex-row gap-4">
                                                                {country.categories.map((category) => (
                                                                    <div key={category.name}>
                                                                        <Link
                                                                            href={category.link}
                                                                            className="block text-xs font-bold uppercase tracking-wider text-accent-color mb-1.5 hover:text-secondary-color transition-colors duration-150"
                                                                            onClick={() => setActiveDropdown(null)}
                                                                        >
                                                                            {category.name}
                                                                        </Link>
                                                                        {category.subItems.map((subItem) => (
                                                                            <Link
                                                                                key={subItem.name}
                                                                                href={subItem.link}
                                                                                className="block py-0.5 text-sm text-gray-600 hover:text-secondary-color hover:translate-x-1 transition-all duration-150"
                                                                                onClick={() => setActiveDropdown(null)}
                                                                            >
                                                                                {subItem.name}
                                                                            </Link>
                                                                        ))}
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    ))}

                                                    {/* Tibet + Bhutan side by side */}
                                                    <div className="flex divide-x divide-gray-100">
                                                        {item.countries.slice(1).map((country) => (
                                                            <div key={country.name} className="flex-1 px-6 py-5">
                                                                <Link
                                                                    href={country.link}
                                                                    className="flex items-center gap-2 mb-4 pb-2.5 border-b-2 border-accent-color/25 group"
                                                                    onClick={() => setActiveDropdown(null)}
                                                                >
                                                                    <span className="text-sm font-extrabold uppercase tracking-widest text-accent-color group-hover:text-secondary-color transition-colors duration-150">
                                                                        {country.name}
                                                                    </span>
                                                                </Link>
                                                                <div className="grid grid-cols-3 gap-4">
                                                                    {country.categories.map((category) => (
                                                                        <div key={category.name}>
                                                                            <Link
                                                                                href={category.link}
                                                                                className="block text-xs font-bold uppercase tracking-wider text-accent-color mb-1.5 hover:text-secondary-color transition-colors duration-150"
                                                                                onClick={() => setActiveDropdown(null)}
                                                                            >
                                                                                {category.name}
                                                                            </Link>
                                                                            {category.subItems.map((subItem) => (
                                                                                <Link
                                                                                    key={subItem.name}
                                                                                    href={subItem.link}
                                                                                    className="block py-0.5 text-sm text-gray-600 hover:text-secondary-color hover:translate-x-1 transition-all duration-150"
                                                                                    onClick={() => setActiveDropdown(null)}
                                                                                >
                                                                                    {subItem.name}
                                                                                </Link>
                                                                            ))}
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>

                                        ) : item.items && isMegaMenu(item) ? (
                                            /* ── REGULAR NAVBAR-WIDTH MEGA MENU ── */
                                            <div
                                                className="absolute left-0 right-0 top-full mt-2 bg-white shadow-xl rounded-b-md border-t-2 border-accent-color z-50"
                                                onMouseEnter={() => handleDropdownMouseEnter(item.name)}
                                                onMouseLeave={handleMouseLeave}
                                            >
                                                <div className="px-10 py-7">
                                                    <div
                                                        className="grid gap-x-8 gap-y-1"
                                                        style={{ gridTemplateColumns: `repeat(${item.items.length}, 1fr)` }}
                                                    >
                                                        {item.items.map((category) => (
                                                            <div key={category.name} className="flex flex-col">
                                                                <Link
                                                                    href={category.link}
                                                                    className="block text-xs font-bold uppercase tracking-widest text-accent-color pb-2 mb-2 border-b-2 border-accent-color/20 hover:text-secondary-color transition-colors"
                                                                    onClick={() => setActiveDropdown(null)}
                                                                >
                                                                    {category.name}
                                                                </Link>
                                                                {category.subItems?.map((subItem) => (
                                                                    <Link
                                                                        key={subItem.name}
                                                                        href={subItem.link}
                                                                        className="block py-1 text-sm text-gray-600 hover:text-secondary-color hover:translate-x-1 transition-all duration-150"
                                                                        onClick={() => setActiveDropdown(null)}
                                                                    >
                                                                        {subItem.name}
                                                                    </Link>
                                                                ))}
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>

                                        ) : item.items ? (
                                            /* ── SIMPLE DROPDOWN ── */
                                            <div
                                                className="absolute top-full left-0 mt-2 bg-white shadow-xl rounded-sm z-50 border border-gray-100"
                                                style={{ width: 'max-content' }}
                                                onMouseEnter={() => handleDropdownMouseEnter(item.name)}
                                                onMouseLeave={handleMouseLeave}
                                            >
                                                <div className="py-2">
                                                    {item.items.map((subItem) => (
                                                        <Link
                                                            rel="canonical"
                                                            key={subItem.name}
                                                            href={subItem.link}
                                                            className="block px-5 py-2.5 text-sm text-gray-700 whitespace-nowrap transition-colors duration-200 hover:bg-secondary-color hover:text-white"
                                                            onClick={() => setActiveDropdown(null)}
                                                        >
                                                            {subItem.name}
                                                        </Link>
                                                    ))}
                                                </div>
                                            </div>
                                        ) : null
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
                                <button className="absolute right-1 top-1/2 transform -translate-y-1/2 cursor-pointer bg-secondary-color-dark text-white p-2 rounded-full h-10 w-10 hover:bg-primary-color transition-colors">
                                    <FontAwesomeIcon icon={faRoute} className="w-3 h-3" />
                                </button>
                            </div>
                            {isSearchOpen && (
                                <FontAwesomeIcon icon={faXmark} className="w-4 h-4 ml-2 duration-200 cursor-pointer hover:opacity-80" onClick={() => setIsSearchOpen(false)} aria-label="Close search" />
                            )}
                            {!isSearchOpen && (
                                <FontAwesomeIcon icon={faMagnifyingGlass} className="ml-2 duration-200 cursor-pointer hover:opacity-80" onClick={() => setIsSearchOpen(true)} aria-label="Open search" />
                            )}
                        </div>
                    </div>
                </div>

                {/* ─────────────────────────────────────────────
                    MOBILE OVERLAY
                _____________________________________________ */}
                {isMobileMenuOpen && (
                    <div
                        className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
                        style={{ top: '140px' }}
                        onClick={closeAll}
                        role="presentation"
                    />
                )}

                {/* ─────────────────────────────────────────────
                    MOBILE NAVIGATION MENU
                _____________________________________________ */}
                <div
                    ref={menuRef}
                    className={`fixed top-0 left-0 w-full h-screen bg-white transform transition-transform duration-300 ease-in-out z-50 lg:hidden ${
                        isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
                    aria-hidden={!isMobileMenuOpen}
                >
                    <div className="h-full overflow-y-auto pb-24">
                        {/* Mobile header */}
                        <div className="flex items-center justify-between w-full p-5">
                            <Link href="/" onClick={closeAll}>
                                <Image src={logos.globalnepaltreks_logo} className="h-auto w-[160px] lg:w-[200px]" width={200} height={60} alt="Global Nepal Treks Logo" />
                            </Link>
                            <button className="p-2 text-gray-700 rounded-md hover:bg-gray-100" onClick={toggleMobileMenu} aria-label="Close menu">
                                <FontAwesomeIcon icon={faTimes} className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Mobile search */}
                        <div className="p-6 border-t border-gray-200">
                            <div className="relative">
                                <input type="text" placeholder="Search treks, destinations..." className="w-full px-4 py-3 pr-10 rounded-full border-2 border-gray-200 bg-white text-sm text-gray-800 focus:outline-none focus:border-primary-color-dark transition-colors" />
                                <button className="absolute right-1 top-1/2 transform -translate-y-1/2 bg-primary-color-dark cursor-pointer text-white p-2 rounded-full h-10 w-10 hover:bg-primary-color transition-colors">
                                    <FontAwesomeIcon icon={faRoute} className="w-3 h-3" />
                                </button>
                            </div>
                        </div>

                        {/* Mobile nav items */}
                        <ul className="py-4">
                            {navItems.map((item) => (
                                <li key={item.name} className="border-b border-gray-100">

                                    {/* ── No dropdown: simple link ── */}
                                    {!item.items && !item.isMegaMenuDestinations ? (
                                        <Link
                                            rel="canonical"
                                            href={item.link}
                                            className={`flex items-center justify-between px-6 py-4 transition-colors duration-200 hover:bg-gray-50 ${isActiveLink(item.link) ? 'text-secondary-color font-bold' : 'text-gray-700'}`}
                                            onClick={closeAll}
                                        >
                                            {item.name}
                                        </Link>

                                    ) : item.isMegaMenuDestinations ? (
                                        /* ── DESTINATIONS mobile: country → category → links ── */
                                        <>
                                            <div
                                                className="flex items-center justify-between px-6 py-4 text-gray-700 cursor-pointer hover:bg-gray-50 transition-colors duration-200"
                                                onClick={() => toggleMobileDropdown(item.name)}
                                                role="button" tabIndex={0}
                                                onKeyPress={(e) => e.key === 'Enter' && toggleMobileDropdown(item.name)}
                                            >
                                                <span className={isActiveLink(item.link) ? 'text-secondary-color font-bold' : ''}>{item.name}</span>
                                                <FontAwesomeIcon icon={faChevronDown} className={`w-3 h-3 transition-transform duration-200 ${activeMobileDropdown === item.name ? 'rotate-180' : ''}`} />
                                            </div>

                                            {activeMobileDropdown === item.name && (
                                                <div className="bg-gray-50">
                                                    {item.countries.map((country) => (
                                                        <div key={country.name}>
                                                            {/* Country toggle */}
                                                            <div
                                                                className="flex items-center justify-between px-8 py-3 cursor-pointer hover:bg-gray-100 transition-colors duration-200"
                                                                onClick={() => toggleMobileSubDropdown(country.name)}
                                                                role="button" tabIndex={0}
                                                                onKeyPress={(e) => e.key === 'Enter' && toggleMobileSubDropdown(country.name)}
                                                            >
                                                                <span className="flex items-center gap-2 text-sm font-bold text-accent-color uppercase tracking-wide">
                                                                    {/* <span>{countryFlag[country.name]}</span> */}
                                                                    {country.name}
                                                                </span>
                                                                <FontAwesomeIcon
                                                                    icon={faChevronDown}
                                                                    className={`w-2.5 h-2.5 text-gray-400 transition-transform duration-200 ${activeMobileSubDropdown === country.name ? 'rotate-180' : ''}`}
                                                                />
                                                            </div>

                                                            {activeMobileSubDropdown === country.name && (
                                                                <div className="bg-white border-l-2 border-accent-color ml-8">
                                                                    <Link
                                                                        href={country.link}
                                                                        className="block px-4 py-2 text-xs font-medium text-accent-color hover:bg-secondary-color hover:text-white transition-colors duration-200"
                                                                        onClick={closeAll}
                                                                    >
                                                                        View All {country.name} →
                                                                    </Link>
                                                                    {country.categories.map((category) => (
                                                                        <div key={category.name}>
                                                                            <p className="px-4 pt-3 pb-1 text-xs font-bold text-accent-color uppercase tracking-wider">
                                                                                {category.name}
                                                                            </p>
                                                                            {category.subItems.map((subItem) => (
                                                                                <Link
                                                                                    key={subItem.name}
                                                                                    href={subItem.link}
                                                                                    className={`block px-4 py-1.5 text-sm transition-colors duration-200 hover:bg-secondary-color hover:text-white ${isActiveLink(subItem.link) ? 'text-secondary-color font-semibold' : 'text-gray-600'}`}
                                                                                    onClick={closeAll}
                                                                                >
                                                                                    {subItem.name}
                                                                                </Link>
                                                                            ))}
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </>

                                    ) : (
                                        /* ── Regular items with dropdown ── */
                                        <>
                                            <div
                                                className="flex items-center justify-between px-6 py-4 text-gray-700 cursor-pointer hover:bg-gray-50 transition-colors duration-200"
                                                onClick={() => toggleMobileDropdown(item.name)}
                                                role="button" tabIndex={0}
                                                onKeyPress={(e) => e.key === 'Enter' && toggleMobileDropdown(item.name)}
                                            >
                                                <span className={isActiveLink(item.link) ? 'text-secondary-color font-bold' : ''}>{item.name}</span>
                                                <FontAwesomeIcon icon={faChevronDown} className={`w-3 h-3 transition-transform duration-200 ${activeMobileDropdown === item.name ? 'rotate-180' : ''}`} />
                                            </div>

                                            {activeMobileDropdown === item.name && (
                                                <div className="bg-gray-50">
                                                    {item.items.map((category) => (
                                                        <div key={category.name}>
                                                            {category.subItems && category.subItems.length > 0 ? (
                                                                <>
                                                                    <div
                                                                        className="flex items-center justify-between px-8 py-3 cursor-pointer hover:bg-gray-100 transition-colors duration-200"
                                                                        onClick={() => toggleMobileSubDropdown(category.name)}
                                                                        role="button" tabIndex={0}
                                                                        onKeyPress={(e) => e.key === 'Enter' && toggleMobileSubDropdown(category.name)}
                                                                    >
                                                                        <span className="text-sm font-semibold text-accent-color uppercase tracking-wide">{category.name}</span>
                                                                        <FontAwesomeIcon
                                                                            icon={faChevronDown}
                                                                            className={`w-2.5 h-2.5 text-gray-400 transition-transform duration-200 ${activeMobileSubDropdown === category.name ? 'rotate-180' : ''}`}
                                                                        />
                                                                    </div>
                                                                    {activeMobileSubDropdown === category.name && (
                                                                        <div className="bg-white border-l-2 border-accent-color ml-8">
                                                                            <Link href={category.link} className="block px-4 py-2 text-xs font-medium text-accent-color hover:bg-secondary-color hover:text-white transition-colors duration-200" onClick={closeAll}>
                                                                                View All {category.name} →
                                                                            </Link>
                                                                            {category.subItems.map((subItem) => (
                                                                                <Link
                                                                                    key={subItem.name}
                                                                                    href={subItem.link}
                                                                                    className={`block px-4 py-2 text-sm transition-colors duration-200 hover:bg-secondary-color hover:text-white ${isActiveLink(subItem.link) ? 'text-secondary-color font-semibold' : 'text-gray-600'}`}
                                                                                    onClick={closeAll}
                                                                                >
                                                                                    {subItem.name}
                                                                                </Link>
                                                                            ))}
                                                                        </div>
                                                                    )}
                                                                </>
                                                            ) : (
                                                                <Link
                                                                    rel="canonical"
                                                                    href={category.link}
                                                                    className={`block px-10 py-3 transition-colors duration-200 hover:bg-secondary-color hover:text-white ${isActiveLink(category.link) ? 'text-secondary-color font-bold' : 'text-gray-600'}`}
                                                                    onClick={closeAll}
                                                                >
                                                                    {category.name}
                                                                </Link>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </>
                                    )}
                                </li>
                            ))}
                        </ul>

                        {/* Mobile footer info */}
                        <div className="flex flex-col gap-5 p-5">
                            <Link href="https://www.tripadvisor.com/Attraction_Review-g293890-d17721412-Reviews-Global_Nepal_Treks-Kathmandu_Kathmandu_Valley_Bagmati_Zone_Central_Region.html" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3">
                                <Image src={logos.tripadvisor_logo} className="h-auto w-30" width={120} height={40} alt="TripAdvisor Logo" />
                                <p className="font-bold text-[#002B11] text-md">Global Nepal Treks</p>
                            </Link>

                            <Link href="https://wa.me/+9779744258519" className="flex items-center gap-2" target="_blank" rel="noopener noreferrer">
                                <p className="flex items-center gap-2 text-sm font-medium">
                                    <FontAwesomeIcon icon={faWhatsapp} className="text-green-500" size="lg" />
                                    Talk to an expert
                                </p>
                                <p className="text-sm font-semibold text-secondary-color">(+977) 9744258519</p>
                            </Link>

                            <Link href="/book-now" className="w-full px-6 py-3 mt-4 font-medium text-center text-white duration-200 rounded bg-accent-color hover:bg-secondary-color" onClick={closeAll}>
                                Plan Your Trip
                            </Link>
                        </div>
                    </div>
                </div>

                {/* ─────────────────────────────────────────────
                    MOBILE BOTTOM BAR
                _____________________________________________ */}
                <div className="fixed bottom-0 left-0 right-0 z-40 px-3 py-2 font-semibold text-white shadow-lg bg-secondary-color/95 backdrop-blur-sm lg:hidden">
                    <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1">
                            <Link href="#" className="p-1.5 rounded-lg hover:bg-white/10" aria-label="Facebook"><FontAwesomeIcon icon={faFacebookF} className="w-4 h-3.5" /></Link>
                            <Link href="#" className="p-1.5 rounded-lg hover:bg-white/10" aria-label="Instagram"><FontAwesomeIcon icon={faInstagram} className="w-3.5 h-3.5" /></Link>
                            <Link href="#" className="p-1.5 rounded-lg hover:bg-white/10" aria-label="LinkedIn"><FontAwesomeIcon icon={faLinkedinIn} className="w-3.5 h-3.5" /></Link>
                            <Link href="#" className="p-1.5 rounded-lg hover:bg-white/10" aria-label="WeChat"><FontAwesomeIcon icon={faWeixin} className="w-3.5 h-3.5" /></Link>
                            <Link href="#" className="p-1.5 rounded-lg hover:bg-white/10" aria-label="YouTube"><FontAwesomeIcon icon={faYoutube} className="w-3.5 h-3.5" /></Link>
                            <Link href="#" className="p-1.5 rounded-lg hover:bg-white/10" aria-label="WhatsApp"><FontAwesomeIcon icon={faWhatsapp} className="w-3.5 h-3.5 text-green-300" /></Link>
                        </div>
                        <Link href="https://www.tripadvisor.com/Attraction_Review-g293890-d17721412-Reviews-Global_Nepal_Treks-Kathmandu_Kathmandu_Valley_Bagmati_Zone_Central_Region.html" target="_blank" rel="noopener noreferrer" className="flex items-center px-2 py-1 transition-colors duration-200 rounded-lg hover:bg-white/10">
                            <Image src={logos.tripadvisor_logo_white} className="w-auto h-full" alt="TripAdvisor" />
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default NavBar;