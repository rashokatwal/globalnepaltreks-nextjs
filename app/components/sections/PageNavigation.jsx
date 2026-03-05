// app/components/sections/PageNavigation.jsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function PageNavigation({ sections }) {
  const [activeSection, setActiveSection] = useState(sections[0]?.id);
  const [isScrolling, setIsScrolling] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (isScrolling) return;
      
      const scrollPosition = window.scrollY + 150;

      for (const section of sections) {
        const element = document.getElementById(section.id);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section.id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [sections, isScrolling]);

  // Manual smooth scroll function
  const smoothScrollTo = (targetPosition, duration = 800) => {
    setIsScrolling(true);
    const startPosition = window.scrollY;
    const distance = targetPosition - startPosition;
    let startTime = null;

    const animation = (currentTime) => {
      if (startTime === null) startTime = currentTime;
      const timeElapsed = currentTime - startTime;
      const progress = Math.min(timeElapsed / duration, 1);
      
      // Easing function for smooth acceleration/deceleration
      const easeInOutCubic = progress < 0.5
        ? 4 * progress * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 3) / 2;
      
      window.scrollTo(0, startPosition + distance * easeInOutCubic);

      if (timeElapsed < duration) {
        requestAnimationFrame(animation);
      } else {
        setIsScrolling(false);
      }
    };

    requestAnimationFrame(animation);
  };

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 150;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - offset;
      
      smoothScrollTo(offsetPosition, 800);
    }
    setActiveSection(sectionId);
  };

  return (
    <nav className="sticky top-20 z-40 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex overflow-x-auto no-scrollbar gap-1">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => scrollToSection(section.id)}
              className={`flex items-center gap-2 px-4 cursor-pointer py-3 font-medium text-md transition whitespace-nowrap border-b-2 ${
                activeSection === section.id
                  ? 'border-primary-color-dark text-primary-color-dark'
                  : 'border-transparent text-gray-500 hover:text-accent-color'
              }`}
            >
              <FontAwesomeIcon icon={section.icon} size='lg' />
              {section.label}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}