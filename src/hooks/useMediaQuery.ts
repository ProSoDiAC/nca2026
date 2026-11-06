import { useEffect, useState } from 'react';

/** Tailwind breakpoints used by the layout (keep in sync with tailwind.config.js). */
export const MQ = {
  md: '(min-width: 768px)',
  lg: '(min-width: 1024px)',
} as const;

function query(q: string): boolean {
  return typeof window !== 'undefined' && typeof window.matchMedia === 'function' && window.matchMedia(q).matches;
}

/** Live match of a CSS media query. Reads synchronously on first render, so there is no layout flash. */
export function useMediaQuery(q: string): boolean {
  const [matches, setMatches] = useState(() => query(q));
  useEffect(() => {
    if (typeof window.matchMedia !== 'function') return;
    const mql = window.matchMedia(q);
    const onChange = () => setMatches(mql.matches);
    onChange();
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, [q]);
  return matches;
}
