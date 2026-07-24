'use client'

import { useEffect, useRef } from 'react'

export function ParticleWave() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const context = canvas.getContext('2d')
    if (!context) return

    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    let reducedMotion = motionQuery.matches
    let visible = false
    let frame = 0
    let width = 0
    let height = 0

    const draw = (time = 0) => {
      context.clearRect(0, 0, width, height)
      const mobile = width < 640
      const columns = mobile ? 23 : 39
      const rows = mobile ? 14 : 22
      const phase = reducedMotion ? 0 : time * 0.00045

      for (let row = 0; row < rows; row++) {
        const depth = row / (rows - 1)
        const perspective = 0.42 + depth * 0.8
        const baseY = height * 0.08 + depth * height * 1.02
        for (let column = 0; column < columns; column++) {
          const across = column / (columns - 1) - 0.5
          const wave = Math.sin(column * 0.46 + phase * 3.2) + Math.sin(row * 0.62 - phase * 2.1)
          const x = width * 0.5 + across * width * 1.35 * perspective
          const y = baseY + wave * (5 + depth * 12) - across * width * 0.07
          const radius = 0.55 + depth * 1.25
          context.beginPath()
          context.arc(x, y, radius, 0, Math.PI * 2)
          context.fillStyle = `rgba(255, 255, 250, ${0.05 + depth * 0.2})`
          context.fill()
        }
      }
    }

    const animate = (time: number) => {
      draw(time)
      if (visible && !reducedMotion) frame = requestAnimationFrame(animate)
    }

    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      const ratio = Math.min(window.devicePixelRatio, 1.5)
      width = rect.width
      height = rect.height
      canvas.width = Math.round(width * ratio)
      canvas.height = Math.round(height * ratio)
      context.setTransform(ratio, 0, 0, ratio, 0, 0)
      draw()
    }

    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      cancelAnimationFrame(frame)
      if (visible) frame = requestAnimationFrame(reducedMotion ? () => draw() : animate)
    })
    const resizeObserver = new ResizeObserver(resize)
    const onMotionChange = (event: MediaQueryListEvent) => {
      reducedMotion = event.matches
      cancelAnimationFrame(frame)
      if (visible) frame = requestAnimationFrame(reducedMotion ? () => draw() : animate)
    }

    resize()
    observer.observe(canvas)
    resizeObserver.observe(canvas)
    motionQuery.addEventListener('change', onMotionChange)
    return () => {
      cancelAnimationFrame(frame)
      observer.disconnect()
      resizeObserver.disconnect()
      motionQuery.removeEventListener('change', onMotionChange)
    }
  }, [])

  return <canvas ref={canvasRef} className="absolute inset-0 size-full opacity-80" aria-hidden="true" />
}
