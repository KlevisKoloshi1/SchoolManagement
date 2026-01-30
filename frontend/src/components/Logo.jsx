export function Logo({ size = 40, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* School building icon */}
      <rect x="8" y="16" width="24" height="16" rx="2" fill="currentColor" opacity="0.1" />
      <rect x="10" y="18" width="4" height="4" rx="1" fill="currentColor" opacity="0.6" />
      <rect x="16" y="18" width="4" height="4" rx="1" fill="currentColor" opacity="0.6" />
      <rect x="22" y="18" width="4" height="4" rx="1" fill="currentColor" opacity="0.6" />
      <rect x="10" y="24" width="4" height="4" rx="1" fill="currentColor" opacity="0.6" />
      <rect x="16" y="24" width="4" height="4" rx="1" fill="currentColor" opacity="0.6" />
      <rect x="22" y="24" width="4" height="4" rx="1" fill="currentColor" opacity="0.6" />
      <rect x="16" y="28" width="8" height="4" rx="1" fill="currentColor" />
      {/* Graduation cap */}
      <path
        d="M20 8L12 12L20 16L28 12L20 8Z"
        fill="currentColor"
      />
      <path
        d="M26 14V18C26 18.5523 25.5523 19 25 19H15C14.4477 19 14 18.5523 14 18V14"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  )
}