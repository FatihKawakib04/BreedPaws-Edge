import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { ReactLenis, useLenis } from 'lenis/react';
import 'lenis/dist/lenis.css';

interface SmoothScrollProps {
  children: React.ReactNode;
}

// Inner component to handle scroll reset on route change
function ScrollReset() {
  const location = useLocation();
  const lenis = useLenis();

  useEffect(() => {
    if (lenis) {
      // Reset scroll position instantly when changing routes
      lenis.scrollTo(0, { immediate: true });
    }
  }, [location.pathname, lenis]);

  return null;
}

export default function SmoothScroll({ children }: SmoothScrollProps) {
  return (
    <ReactLenis root options={{ lerp: 0.1, duration: 1.2, smoothWheel: true }}>
      <ScrollReset />
      {children}
    </ReactLenis>
  );
}
