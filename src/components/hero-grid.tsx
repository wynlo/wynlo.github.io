'use client'

import { useEffect, useRef } from 'react'

const spacing = 24
const baseRadius = 1
const maxRadius = 2.4
const baseAlpha = .3
const maxAlpha = .85
const reach = 160
// Dots fade out inside this element's box so they do not show through the artwork.
const clearSelector = '.robot-hero'
const clearPadding = 28

export function HeroGrid() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const context = canvas?.getContext('2d')
    if (!canvas || !context) return

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const target = { x: 0, y: 0, strength: 0 }
    const current = { x: 0, y: 0, strength: 0 }
    let width = 0
    let height = 0
    let frame = 0

    function draw() {
      if (!canvas || !context) return
      const color = getComputedStyle(canvas).color.match(/\d+(\.\d+)?/g)?.slice(0, 3).join(',') ?? '0,0,0'
      context.clearRect(0, 0, width, height)
      context.fillStyle = `rgb(${color})`
      const canvasRect = canvas.getBoundingClientRect()
      const clearRect = canvas.parentElement?.querySelector(clearSelector)?.getBoundingClientRect()
      const clear = clearRect && {
        x: clearRect.left - canvasRect.left + clearRect.width / 2,
        y: clearRect.top - canvasRect.top + clearRect.height / 2,
        rx: clearRect.width / 2 + clearPadding,
        ry: clearRect.height / 2 + clearPadding,
      }
      const offsetX = (width % spacing) / 2
      const offsetY = (height % spacing) / 2
      for (let x = offsetX; x <= width; x += spacing) {
        for (let y = offsetY; y <= height; y += spacing) {
          // 0 at the centre of the clear zone, 1 at its edge and beyond. The last 30% fades.
          const clearDistance = clear ? Math.hypot((x - clear.x) / clear.rx, (y - clear.y) / clear.ry) : 2
          const visibility = Math.min(1, Math.max(0, (clearDistance - .7) / .3))
          if (visibility === 0) continue
          const distance = Math.hypot(x - current.x, y - current.y)
          const falloff = Math.max(0, 1 - distance / reach) ** 2 * current.strength
          context.globalAlpha = (baseAlpha + (maxAlpha - baseAlpha) * falloff) * visibility
          context.beginPath()
          context.arc(x, y, baseRadius + (maxRadius - baseRadius) * falloff, 0, Math.PI * 2)
          context.fill()
        }
      }
    }

    function tick() {
      const ease = reducedMotion ? 1 : .15
      current.x += (target.x - current.x) * ease
      current.y += (target.y - current.y) * ease
      current.strength += (target.strength - current.strength) * ease
      draw()
      const settled = Math.abs(target.x - current.x) < .5 && Math.abs(target.y - current.y) < .5 && Math.abs(target.strength - current.strength) < .01
      frame = settled ? 0 : requestAnimationFrame(tick)
    }

    function start() {
      if (!frame) frame = requestAnimationFrame(tick)
    }

    function resize() {
      if (!canvas || !context) return
      const ratio = window.devicePixelRatio || 1
      width = canvas.clientWidth
      height = canvas.clientHeight
      canvas.width = width * ratio
      canvas.height = height * ratio
      context.setTransform(ratio, 0, 0, ratio, 0, 0)
      draw()
    }

    function move(event: PointerEvent) {
      if (!canvas || event.pointerType !== 'mouse') return
      const rect = canvas.getBoundingClientRect()
      const x = event.clientX - rect.left
      const y = event.clientY - rect.top
      const inside = x >= 0 && y >= 0 && x <= rect.width && y <= rect.height
      if (inside && target.strength === 0) {
        current.x = x
        current.y = y
      }
      target.x = x
      target.y = y
      target.strength = inside ? 1 : 0
      start()
    }

    function leave() {
      target.strength = 0
      start()
    }

    const resizeObserver = new ResizeObserver(resize)
    resizeObserver.observe(canvas)
    // Redraw when the theme class changes so the dots pick up the new colour.
    const themeObserver = new MutationObserver(draw)
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
    window.addEventListener('pointermove', move, { passive: true })
    document.documentElement.addEventListener('pointerleave', leave)

    return () => {
      cancelAnimationFrame(frame)
      resizeObserver.disconnect()
      themeObserver.disconnect()
      window.removeEventListener('pointermove', move)
      document.documentElement.removeEventListener('pointerleave', leave)
    }
  }, [])

  return <canvas ref={canvasRef} aria-hidden="true" className="hero-grid pointer-events-none absolute inset-0 -z-10 h-full w-full text-muted" />
}
