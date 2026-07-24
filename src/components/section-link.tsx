'use client'

import type { MouseEvent, ReactNode } from 'react'

type SectionLinkProps = {
  children: ReactNode
  className?: string
  id: string
  onClick?: () => void
}

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || ''

export function SectionLink({ children, className, id, onClick }: SectionLinkProps) {
  const href = `${basePath}/#${id}`

  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    onClick?.()

    const currentPath = window.location.pathname.replace(/\/$/, '')
    if (currentPath !== basePath) return

    const target = document.getElementById(id)
    if (!target) return

    event.preventDefault()
    const url = new URL(window.location.href)
    url.hash = id
    window.history.replaceState(window.history.state, '', url)
    target.scrollIntoView({
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
      block: 'start',
    })
  }

  return <a className={className} href={href} data-transition-ignore onClick={handleClick}>{children}</a>
}
