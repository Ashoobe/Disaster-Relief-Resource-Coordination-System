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

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target;
          const delay = Number(el.dataset.delay) || 0;
          el.style.transitionDelay = delay > 0 ? `${delay}ms` : '';
          el.classList.add('is-visible');
          observer.unobserve(el);
        });
      },
      {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px',
      },
    );

    const observeElement = (el) => {
      if (!el.classList.contains('is-visible')) {
        observer.observe(el);
      }
    };

    const observeAnimatedElements = (root = document) => {
      if (root.nodeType !== Node.ELEMENT_NODE && root !== document) return;
      if (root.matches?.('[data-animate]')) {
        observeElement(root);
      }
      root.querySelectorAll?.('[data-animate]').forEach(observeElement);
    };

    observeAnimatedElements();

    const mutationObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType !== Node.ELEMENT_NODE) return;
          observeAnimatedElements(node);
        });
      });
    });

    mutationObserver.observe(document.body, { childList: true, subtree: true });

    return () => {
      mutationObserver.disconnect();
      observer.disconnect();
    };
  }, deps); // eslint-disable-line react-hooks/exhaustive-deps
};

export default useScrollReveal;
