import { useEffect, useRef, useState } from 'react';

export function useScrollReveal<T extends HTMLElement = HTMLElement>() {
  const ref = useRef<T>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const revealImmediately = () => setIsVisible(true);
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) {
      revealImmediately();
      return;
    }

    try {
      const observer = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) {
          revealImmediately();
          observer.unobserve(entry.target);
        }
      }, { threshold: 0.12, rootMargin: '0px 0px -24px 0px' });
      observer.observe(element);
      return () => observer.disconnect();
    } catch {
      revealImmediately();
    }
    return undefined;
  }, []);

  return { ref, isVisible };
}