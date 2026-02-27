import { useState, useEffect, useRef, useCallback } from 'react';
import { THROTTLE_DELAYS } from '../utils/constants';

export const useCursorEffect = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const rafIdRef = useRef(null);
  const lastUpdateRef = useRef(0);

  const handleMouseMove = useCallback((e) => {
    const now = Date.now();
    if (now - lastUpdateRef.current < THROTTLE_DELAYS.MOUSE) {
      return;
    }
    
    lastUpdateRef.current = now;
    
    if (rafIdRef.current) {
      cancelAnimationFrame(rafIdRef.current);
    }
    
    rafIdRef.current = requestAnimationFrame(() => {
      setPosition({ x: e.clientX, y: e.clientY });
    });
  }, []);

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', handleMouseMove, { passive: true });
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, [handleMouseMove]);

  return position;
};
