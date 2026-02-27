import { useState, useEffect } from 'react';
import { THROTTLE_DELAYS } from '../utils/constants';

export const useScrollProgress = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let rafId = null;
    let lastScrollTime = 0;

    const updateProgress = () => {
      try {
        const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
        const scrollableHeight = scrollHeight - clientHeight;
        
        if (scrollableHeight <= 0) {
          setProgress(0);
          return;
        }
        
        const newProgress = Math.min(100, Math.max(0, (scrollTop / scrollableHeight) * 100));
        setProgress(newProgress);
      } catch {
        setProgress(0);
      }
    };

    const handleScroll = () => {
      const now = Date.now();
      if (now - lastScrollTime < THROTTLE_DELAYS.SCROLL) {
        return;
      }
      
      lastScrollTime = now;
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(updateProgress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll, { passive: true });
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  return progress;
};
