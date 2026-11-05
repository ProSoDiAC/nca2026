/** The "network of nodes" pattern from the hero (Home) and the featured news card. */
export function HeroNetwork() {
  return (
    <svg aria-hidden="true" viewBox="0 0 390 300" width="390" height="300" className="pointer-events-none absolute right-0 top-0">
      <g stroke="#2F6F8F" strokeWidth="1.2" fill="none">
        <path d="M300 40 L360 100" />
        <path d="M360 100 L320 170" />
        <path d="M320 170 L240 130" />
        <path d="M240 130 L300 40" />
        <path d="M240 130 L170 80" />
        <path d="M170 80 L300 40" />
        <path d="M320 170 L370 250" />
        <path d="M240 130 L260 230" />
        <path d="M260 230 L320 170" />
        <path d="M170 80 L110 150" />
        <path d="M110 150 L240 130" />
      </g>
      <g fill="#5FB3C4">
        <circle cx="360" cy="100" r="4" />
        <circle cx="320" cy="170" r="4" />
        <circle cx="170" cy="80" r="4" />
        <circle cx="370" cy="250" r="4" />
        <circle cx="260" cy="230" r="4" />
        <circle cx="110" cy="150" r="3" />
      </g>
      <g fill="#E8A33D">
        <circle cx="300" cy="40" r="6" />
        <circle cx="240" cy="130" r="6" />
      </g>
    </svg>
  );
}

export function CardNetwork() {
  return (
    <svg aria-hidden="true" viewBox="0 0 200 120" width="200" height="120" className="pointer-events-none absolute right-0 top-0">
      <g stroke="#2F6F8F" strokeWidth="1.2" fill="none">
        <path d="M150 20 L190 60" />
        <path d="M190 60 L160 100" />
        <path d="M160 100 L110 70" />
        <path d="M110 70 L150 20" />
      </g>
      <g fill="#5FB3C4">
        <circle cx="190" cy="60" r="3.5" />
        <circle cx="160" cy="100" r="3.5" />
      </g>
      <g fill="#E8A33D">
        <circle cx="150" cy="20" r="5" />
        <circle cx="110" cy="70" r="5" />
      </g>
    </svg>
  );
}
