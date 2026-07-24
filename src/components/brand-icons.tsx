export function PotatoheadsIcon({ size = 18, className = '' }: { size?: number; className?: string }) {
  return <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    className={`shrink-0 fill-none stroke-current ${className}`}
    aria-hidden="true"
  >
    <path d="M15.8 3.1c2.8.9 4.7 3.4 4.7 6.4 0 1.4-.4 2.6-1.1 3.7.1.5.1 1 .1 1.5 0 3.7-3.2 6.3-7.6 6.3-4.7 0-8.4-2.8-8.4-7 0-2.1.9-3.8 2.4-5C6.2 5.5 8.7 3 12 3c1 0 1.9 0 2.7.1.4-.1.7-.1 1.1 0Z" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M9 10.5v.1M15 10.5v.1M9.2 15.2c1.7 1.3 3.9 1.3 5.6 0" strokeWidth="1.7" strokeLinecap="round" />
  </svg>
}

export function LinkedInIcon({ size = 18, className = '' }: { size?: number; className?: string }) {
  return <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    className={`shrink-0 fill-current ${className}`}
    aria-hidden="true"
  >
    <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.34V8.98h3.42v1.57h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.29ZM5.32 7.41a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12Zm1.78 13.04H3.54V8.98H7.1v11.47Z" />
  </svg>
}
