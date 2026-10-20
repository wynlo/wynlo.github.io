'use client'

import { useTheme } from 'next-themes'
import { useEffect } from 'react'

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || ''

export function ThemeFavicon() {
  const { resolvedTheme } = useTheme()

  useEffect(() => {
    if (!resolvedTheme) return

    const href = resolvedTheme === 'dark'
      ? `${basePath}/favicon-dark.png?theme=dark`
      : `${basePath}/favicon-light.png?theme=light`
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
