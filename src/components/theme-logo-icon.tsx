export function ThemeLogoIcon({ className = '-translate-y-0.5', size = 20 }: { className?: string; size?: number }) {
  const icon = `${process.env.NEXT_PUBLIC_BASE_PATH || ''}/robot-logo-helmet.png`
  return <span
    className={`theme-logo ${className}`}
    style={{ width: size, height: size, WebkitMaskImage: `url(${icon})`, maskImage: `url(${icon})` }}
    aria-hidden="true"
  />
}
