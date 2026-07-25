'use client'

import dynamic from 'next/dynamic'
import { useEffect, useRef, useState } from 'react'
import type { VoxelVariant } from './voxel-canvas'

const VoxelCanvas = dynamic(() => import('./voxel-canvas'), { ssr: false, loading: () => null })

export function VoxelScene({ variant, label, className }: { variant: VoxelVariant; label: string; className?: string }) {
  const container = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(false)
  const [hasEntered, setHasEntered] = useState(false)
  const [hovered, setHovered] = useState(false)
  const [rotation, setRotation] = useState({ x: 0, y: 0 })
  const drag = useRef<{ x: number; y: number } | null>(null)

  useEffect(() => {
    const element = container.current
    if (!element) return
    if (!('IntersectionObserver' in window)) {
      const frame = requestAnimationFrame(() => {
        setHasEntered(true)
        setActive(true)
      })
      return () => cancelAnimationFrame(frame)
    }
    const observer = new IntersectionObserver(([entry]) => {
      setActive(entry.isIntersecting)
      if (entry.isIntersecting) setHasEntered(true)
      else setHovered(false)
    }, { rootMargin: '120px' })
    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  return <div
    ref={container}
    role="img"
    aria-label={label}
    draggable={false}
    className={`select-none cursor-grab active:cursor-grabbing ${className ?? ''}`}
    style={{ touchAction: 'none', WebkitUserSelect: 'none' }}
    onPointerEnter={() => setHovered(true)}
    onPointerLeave={() => {
      setHovered(false)
    }}
    onPointerDown={(event) => {
      if (!event.isPrimary) return
      event.preventDefault()
      event.currentTarget.setPointerCapture(event.pointerId)
      drag.current = { x: event.clientX, y: event.clientY }
    }}
    onPointerMove={(event) => {
      if (!drag.current) return
      event.preventDefault()
      const deltaX = event.clientX - drag.current.x
      const deltaY = event.clientY - drag.current.y
      drag.current = { x: event.clientX, y: event.clientY }
      setRotation((current) => ({
        x: Math.max(-Math.PI / 3, Math.min(Math.PI / 3, current.x + deltaY * 0.01)),
        y: current.y + deltaX * 0.012,
      }))
    }}
    onPointerUp={(event) => {
      drag.current = null
      if (event.currentTarget.hasPointerCapture(event.pointerId)) {
        event.currentTarget.releasePointerCapture(event.pointerId)
      }
    }}
    onPointerCancel={() => { drag.current = null }}
    onLostPointerCapture={() => { drag.current = null }}
    onDragStart={(event) => event.preventDefault()}
  >
    {hasEntered && <VoxelCanvas variant={variant} active={active} hovered={hovered} rotation={rotation} />}
  </div>
}
