'use client'

import { useTheme } from 'next-themes'
import { useEffect } from 'react'

export function ThemeFavicon() {
  const { resolvedTheme } = useTheme()

  useEffect(() => {
    if (!resolvedTheme) return

    const href = resolvedTheme === 'dark'
      ? '/robot-icon-white-v2.png?theme=dark-v2'
      : '/robot-icon-light.png?theme=light'
    document.querySelectorAll('link[rel="icon"], link[rel="shortcut icon"]').forEach((icon) => icon.remove())

    const icon = document.createElement('link')
    icon.rel = 'icon'
    icon.type = 'image/png'
    icon.href = href
    document.head.appendChild(icon)

    return () => icon.remove()
  }, [resolvedTheme])

  return null
}
