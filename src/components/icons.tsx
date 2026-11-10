// Stroke icons copied from the mock. All decorative (aria-hidden); label the control instead.
import type { SVGProps } from 'react';

type P = SVGProps<SVGSVGElement> & { size?: number };

function Base({ size = 22, strokeWidth = 1.8, children, ...rest }: P & { children: React.ReactNode }) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...rest}
    >
      {children}
    </svg>
  );
}

export const IconHome = (p: P) => (
  <Base {...p}>
    <path d="M3 11l9-8 9 8v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z" />
  </Base>
);
export const IconCalendar = (p: P) => (
  <Base {...p}>
    <rect x="3" y="5" width="18" height="16" rx="2" />
    <path d="M3 10h18M8 3v4M16 3v4" />
  </Base>
);
export const IconNews = (p: P) => (
  <Base {...p}>
    <rect x="4" y="4" width="16" height="16" rx="2" />
    <path d="M8 9h8M8 13h8M8 17h5" />
  </Base>
);
export const IconPeople = (p: P) => (
  <Base {...p}>
    <circle cx="9" cy="8" r="3" />
    <path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6" />
    <circle cx="17" cy="9" r="2.5" />
    <path d="M17 14c2.8 0 5 2.2 5 5" />
  </Base>
);
export const IconPin = (p: P) => (
  <Base {...p}>
    <path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z" />
    <circle cx="12" cy="9.5" r="2.5" />
  </Base>
);
export const IconPerson = (p: P) => (
  <Base {...p}>
    <circle cx="12" cy="8" r="4" />
    <path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8" />
  </Base>
);
export const IconChevronRight = (p: P) => (
  <Base strokeWidth={2} size={16} {...p}>
    <path d="M9 6l6 6-6 6" />
  </Base>
);
export const IconChevronDown = (p: P) => (
  <Base strokeWidth={2} size={20} {...p}>
    <path d="M6 9l6 6 6-6" />
  </Base>
);
export const IconChevronLeft = (p: P) => (
  <Base strokeWidth={2} size={20} {...p}>
    <path d="M15 6l-6 6 6 6" />
  </Base>
);
export const IconSearch = (p: P) => (
  <Base size={18} {...p}>
    <circle cx="11" cy="11" r="7" />
    <path d="M20 20l-3.5-3.5" />
  </Base>
);
export const IconClose = (p: P) => (
  <Base size={18} strokeWidth={2} {...p}>
    <path d="M6 6l12 12M18 6L6 18" />
  </Base>
);
export const IconCamera = (p: P) => (
  <Base {...p}>
    <path d="M4 8h3l2-3h6l2 3h3a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1z" />
    <circle cx="12" cy="13.5" r="3.5" />
  </Base>
);
