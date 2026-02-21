"use client";

import { logos } from "../../assets/assets";
import { faFacebookF, faInstagram, faLinkedin, faWeixin, faWhatsapp, faYoutube } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import Link from "next/link";

const Footer = () => {
    const socialMediaLinks = [
        {
            icon: faFacebookF, url: "https://facebook.com", label: "Facebook"
        },
        {
            icon: faInstagram, url: "https://instagram.com", label: "Instagram"
        },
        {
            icon: faLinkedin, url: "https://linkedin.com", label: "LinkedIn"
        },
        {
            icon: faWhatsapp, url: "https://whatsapp.com", label: "WhatsApp"
        },
        {
            icon: faWeixin, url: "https://wechat.com", label: "WeChat"
        },
        {
            icon: faYoutube, url: "https://youtube.com", label: "Youtube"
        }
    ]

    const footerLinks = [
        {
            name: "About Us",
            link: "/about"
        },
        {
            name: "Blogs",
            link: "/blogs"
        },
        {
            name: "Trekking in Nepal",
            link: "/nepal/trekking"
        },
        {
            name: "Tours in Nepal",
            link: "/nepal/tours"
        },
        {
            name: "Tours in Tibet",
            link: "/tibet/tours"
        },
        {
            name: "Contact Us",
            link: "/contact"
        }
    ]

    return (
        <footer className="w-full px-4 py-10 bg-secondary-color sm:px-6 md:px-10 lg:px-16 xl:px-20">
            <div className="p-4 bg-white rounded-lg shadow-lg sm:p-6 md:p-8 lg:p-10">
                {/* Main Content Grid */}
                <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4 xl:gap-12">
                    {/* Company Info Column */}
                    <div className="space-y-4 text-sm">
                        <div>
                            <p className="text-sm font-bold text-gray-700 sm:text-base">Get In Touch</p>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <p className="text-xs font-medium text-gray-400">Address</p>
                                <p className="text-sm font-semibold text-gray-800">Bikramshila Mahavihar (Bhagawan Bahal) Tham Bahee Road, Kathmandu, Nepal</p>
                            </div>
                            
                            <div>
                                <p className="text-xs font-semibold text-gray-400">Phone</p>
                                <p className="text-sm font-semibold text-gray-800">(+977) 9744258519 | (+977) 9821274866</p>
                            </div>
                            
                            <div>
                                <p className="text-xs font-semibold text-gray-400">Email</p>
                                <p className="text-sm font-semibold text-gray-800">info@globalnepaltreks.com</p>
                            </div>
                        </div>

                        <div>
                            <p className="mb-3 text-sm font-bold text-gray-700">Follow Us</p>
                            <div className="flex flex-wrap items-center gap-2">
                                {socialMediaLinks.map((link, index) => (
                                    <Link 
                                        href={link.url} 
                                        key={index} 
                                        target="_blank"
                                        className="flex items-center justify-center w-8 h-8 text-white duration-300 rounded-full sm:w-9 sm:h-9 hover:scale-110 bg-secondary-color hover:bg-primary-color"
                                        aria-label={link.label}
                                    >
                                        <FontAwesomeIcon icon={link.icon} className="text-xs sm:text-sm" />
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="hidden space-y-4 md:block">
                        <p className="text-sm font-bold text-center text-gray-700 sm:text-base">Volunteer Programs</p>
                        <div className="flex items-center justify-center gap-5 md:block">
                            <Link href={"https://www.pvnnepal.org"} target="_blank" className="block transition-transform hover:scale-105">
                                <Image 
                                    src={logos.pvn_nepal_logo} 
                                    className="w-32 mx-auto sm:w-36 md:w-40" 
                                    alt="PVN Nepal Logo"
                                />
                            </Link>
                            <Link href={"https://www.globalvolunteernepal.org"} target="_blank" className="block transition-transform hover:scale-105">
                                <Image 
                                    src={logos.global_volunteer_nepal_logo} 
                                    className="w-32 mx-auto sm:w-36 md:w-40" 
                                    alt="Global Volunteer Nepal Logo"
                                />
                            </Link>
                        </div>
                    </div>

                    {/* Useful Links Column 1 */}
                    <div>
                        <p className="mb-4 text-sm font-bold text-gray-700 sm:text-base">Useful Links</p>
                        <ul className="space-y-2 text-sm">
                            {footerLinks.map((item, index) => (
                                <li key={index}>
                                    <Link 
                                        href={item.link}
                                        className="inline-block text-gray-600 transition-colors duration-300 hover:text-primary-color hover:pl-1"
                                    >
                                        {item.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Useful Links Column 2 */}
                    <div>
                        <p className="mb-4 text-sm font-bold text-gray-700 sm:text-base">Support & Info</p>
                        <ul className="space-y-2 text-sm">
                            {['FAQs', 'Terms & Conditions', 'Privacy Policy', 'Cancellation Policy', 'Travel Guide', 'Sitemap'].map((item, index) => (
                                <li key={index}>
                                    <Link 
                                        href={`/${item.toLowerCase().replace(/\s+/g, '-')}`}
                                        className="inline-block text-gray-600 transition-colors duration-300 hover:text-primary-color hover:pl-1"
                                    >
                                        {item}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Divider */}
                <div className="w-full h-px my-6 bg-linear-to-r from-transparent via-gray-300 to-transparent md:my-8" />

                {/* Associations Section */}
                <div className="flex flex-col justify-between gap-10 lg:items-center lg:flex-row">
                    <div>
                        <p className="mb-4 text-sm font-bold text-center text-gray-700 sm:text-base md:text-left">We're associated with</p>
                            <div className="flex flex-wrap items-center justify-center gap-4 md:justify-start md:gap-5">
                                <div className="transition-transform hover:scale-110">
                                    <Image src={logos.nepal_government_logo} className="w-10 h-auto sm:w-12 md:w-14" alt="Nepal Government Logo" />
                                </div>
                                <div className="transition-transform hover:scale-110">
                                    <Image src={logos.nma_logo} className="w-10 h-auto sm:w-12 md:w-14" alt="NMA Logo" />
                                </div>
                                <div className="transition-transform hover:scale-110">
                                    <Image src={logos.ntb_logo} className="w-8 h-auto sm:w-10 md:w-12" alt="NTB Logo" />
                                </div>
                                <div className="transition-transform hover:scale-110">
                                    <Image src={logos.taan_logo} className="w-6 h-auto sm:w-7 md:w-8" alt="TAAN Logo" />
                                </div>
                            </div>
                    </div>

                    <div className="space-y-4 md:hidden">
                        <p className="text-sm font-bold text-center text-gray-700 sm:text-base">Volunteer Programs</p>
                        <div className="flex items-center justify-center gap-5 md:block">
                            <Link href={"https://www.pvnnepal.org"} target="_blank" className="block transition-transform hover:scale-105">
                                <Image 
                                    src={logos.pvn_nepal_logo} 
                                    className="w-32 mx-auto sm:w-36 md:w-40" 
                                    alt="PVN Nepal Logo"
                                />
                            </Link>
                            <Link href={"https://www.globalvolunteernepal.org"} target="_blank" className="block transition-transform hover:scale-105">
                                <Image 
                                    src={logos.global_volunteer_nepal_logo} 
                                    className="w-32 mx-auto sm:w-36 md:w-40" 
                                    alt="Global Volunteer Nepal Logo"
                                />
                            </Link>
                        </div>
                    </div>

                    <div>
                        <p className="mb-4 text-sm font-bold text-center text-gray-700 sm:text-base md:text-left">Sign up for Updates & New Deals</p>
                        <div>
                            <form className="flex flex-col gap-2 md:flex-row">
                                <input type="text" placeholder="Full Name" className="px-5 py-2 border border-gray-300 focus:outline-primary-color-dark" />
                                <input type="email" placeholder="Email" className="px-5 py-2 border border-gray-300 focus:outline-primary-color-dark" />
                                <button className="px-5 py-2 text-white bg-primary-color-dark">
                                    Subscribe
                                </button>
                            </form>
                        </div>
                    </div>
                </div>

                {/* Copyright */}
                <div className="mt-6 text-sm text-center text-gray-500">
                    <p>© {new Date().getFullYear()} Global Nepal Treks. All rights reserved.</p>
                </div>
            </div>
        </footer>
    )
}

export default Footer;