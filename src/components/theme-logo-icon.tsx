export function ThemeLogoIcon() {
  const icon = `${process.env.NEXT_PUBLIC_BASE_PATH || ''}/robot-icon-white-v2.png`
  return <span
    className="theme-logo -translate-y-0.5"
    style={{ WebkitMaskImage: `url(${icon})`, maskImage: `url(${icon})` }}
    aria-hidden="true"
  />
}
