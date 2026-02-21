"use client";

import Lottie from "lottie-react";
import { walk } from "./assets/assets";
import { useEffect, useState } from "react";

export default function LottieTrekkingLoader() {
  const [isVisible, setIsVisible] = useState(true);
  const [messageIndex, setMessageIndex] = useState(0);

  const messages = [
    "trekking through the himalayas",
    "following ancient paths",
    "touching the clouds",
    "conquering new heights",
    "walking with sherpas",
    "chasing sunrises",
    "finding your trail"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex(prev => (prev + 1) % messages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col items-center justify-center">
      {/* Centered content */}
      <div className="flex flex-col items-center justify-center max-w-md px-6">
        {/* Lottie Animation - Slightly smaller on mobile */}
        <div className="w-48 h-48 md:w-56 md:h-56 mb-6">
          <Lottie 
            animationData={walk}
            loop={true}
            className="w-full h-full"
          />
        </div>

        {/* Simple text that changes */}
        <p className="text-sm text-black font-medium tracking-wide animate-fade">
          {messages[messageIndex]}
        </p>

        {/* Minimal three-dot indicator */}
        <div className="flex gap-1.5 mt-6">
          <div className="w-1 h-1 bg-secondary-color/30 rounded-full animate-pulse" style={{ animationDelay: '0ms' }}></div>
          <div className="w-1 h-1 bg-secondary-color/60 rounded-full animate-pulse" style={{ animationDelay: '150ms' }}></div>
          <div className="w-1 h-1 bg-secondary-color/90 rounded-full animate-pulse" style={{ animationDelay: '300ms' }}></div>
        </div>
      </div>

      {/* Simple fade animation for text */}
      <style jsx>{`
        @keyframes fade {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }
        .animate-fade {
          animation: fade 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}