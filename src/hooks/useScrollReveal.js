import { useEffect } from 'react';

/**
 * Watches all [data-animate] elements in the document.
 * When they enter the viewport, adds the "is-visible" class so
 * CSS transitions play. Supports an optional [data-delay] attribute
 * (milliseconds) to stagger siblings.
 *
 * Pass an optional deps array to re-run on route changes (e.g. [pathname]).
 * Called globally in ScrollToTop so every page gets animations automatically.
 */
// eslint-disable-next-line react-hooks/exhaustive-deps
const useScrollReveal = (deps = []) => {
  useEffect(() => {
    document.documentElement.classList.add('reveal-active');

    // Skip if the browser doesn't support IntersectionObserver
    if (!('IntersectionObserver' in window)) {
      document.querySelectorAll('[data-animate]').forEach((el) => {
        el.classList.add('is-visible');
      });
      return;
    }

    const elements = Array.from(document.querySelectorAll('[data-animate]:not(.is-visible)'));

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target;
          const delay = Number(el.dataset.delay) || 0;
          if (delay > 0) {
            setTimeout(() => el.classList.add('is-visible'), delay);
          } else {
            el.classList.add('is-visible');
          }
          observer.unobserve(el);
        });
      },
      {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px',
      },
    );

    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, deps); // eslint-disable-line react-hooks/exhaustive-deps
};

export default useScrollReveal;
