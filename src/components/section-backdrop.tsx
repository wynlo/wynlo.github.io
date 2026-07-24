'use client'

import dynamic from 'next/dynamic'
import { useEffect, useRef, useState } from 'react'

export type SectionBackdropVariant = 'idea' | 'work'

const SectionBackdropCanvas = dynamic(() => import('./section-backdrop-canvas'), { ssr: false, loading: () => null })

export function SectionBackdrop({ variant }: { variant: SectionBackdropVariant }) {
  const container = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(false)
  const [hasEntered, setHasEntered] = useState(false)

  useEffect(() => {
    const element = container.current
    if (!element) return
    if (!('IntersectionObserver' in window)) {
      const frame = requestAnimationFrame(() => {
        setActive(true)
        setHasEntered(true)
      })
      return () => cancelAnimationFrame(frame)
    }
    const observer = new IntersectionObserver(([entry]) => {
      setActive(entry.isIntersecting)
      if (entry.isIntersecting) setHasEntered(true)
    }, { rootMargin: '180px' })
    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  return <div ref={container} className="section-backdrop pointer-events-none absolute inset-0 z-0" aria-hidden="true">
    {hasEntered && <SectionBackdropCanvas variant={variant} active={active} />}
  </div>
}
