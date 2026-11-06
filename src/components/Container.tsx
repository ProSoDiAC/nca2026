import { forwardRef, type ReactNode } from 'react';

/** Centered page container: full width on phones, max ~1240px on desktop. */
export function Container({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`mx-auto w-full max-w-site px-5 md:px-8 ${className}`}>{children}</div>;
}

/**
 * Bar that sticks below the top of the viewport while the page scrolls (day/room pickers, search).
 * Phones: below the status bar (safe area). Tablet/desktop: below the 64px navigation header.
 */
export const StickyBar = forwardRef<HTMLDivElement, { children: ReactNode; className?: string }>(function StickyBar(
  { children, className = '' },
  ref,
) {
  return (
    <div
      ref={ref}
      className={`sticky top-[env(safe-area-inset-top)] z-30 border-b border-transparent bg-page/95 backdrop-blur-sm md:top-16 ${className}`}
    >
      {children}
    </div>
  );
});
