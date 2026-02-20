import { memo, useLayoutEffect } from "react";
import { useLocation } from "react-router-dom";

const DEFAULT_SCROLL_DELAY = 50; // Reduced from 300ms for better UX
const USE_ANIMATION_FRAME = true;

function ScrollToTop() {
  const { pathname } = useLocation();

  useLayoutEffect(() => {
    const scrollOptions = { top: 0, left: 0, behavior: "auto" };
    const scrollFn = () => window.scrollTo(scrollOptions);
    
    const timer = setTimeout(() => {
      if (USE_ANIMATION_FRAME) {
        requestAnimationFrame(scrollFn);
      } else {
        scrollFn();
      }
    }, DEFAULT_SCROLL_DELAY);

    return () => clearTimeout(timer);
  }, [pathname]);

  return null;
}

export default memo(ScrollToTop);