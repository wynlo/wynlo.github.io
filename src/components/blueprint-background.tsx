'use client'

import { useEffect, useRef } from 'react'

type Block = {
  fromX: number
  fromY: number
  toX: number
  toY: number
  size: number
  phase: number
  route: 'x-first' | 'y-first'
}

const formations = [
  [[2, 2], [3, 2], [4, 2], [4, 3], [4, 4], [5, 4], [6, 4], [6, 5]],
  [[2, 5], [3, 5], [3, 4], [4, 4], [5, 4], [5, 3], [6, 3], [7, 3]],
  [[3, 2], [3, 3], [3, 4], [4, 4], [5, 4], [5, 5], [5, 6], [6, 6]],
] as const

function hexToRgb(value: string) {
  const hex = value.trim().replace('#', '')
  if (hex.length !== 6) return [24, 24, 24]
  return [Number.parseInt(hex.slice(0, 2), 16), Number.parseInt(hex.slice(2, 4), 16), Number.parseInt(hex.slice(4, 6), 16)]
}

function ease(value: number) {
  return value < 0.5 ? 2 * value * value : 1 - Math.pow(-2 * value + 2, 2) / 2
}

export function BlueprintBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const context = canvas?.getContext('2d')
    if (!canvas || !context) return

    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    let reducedMotion = motionQuery.matches
    let width = 0
    let height = 0
    let unit = 44
    let frame = 0
    let cycle = -1
    let ink = [24, 24, 24]
    let blocks: Block[] = []

    const color = (opacity: number) => `rgba(${ink[0]}, ${ink[1]}, ${ink[2]}, ${opacity})`

    const createBlocks = () => {
      const count = width < 640 ? 18 : 34
      const columns = Math.ceil(width / unit)
      const rows = Math.ceil(height / unit)
      blocks = Array.from({ length: count }, (_, index) => {
        const point = formations[0][index % formations[0].length]
        const cluster = index % 3
        const baseX = cluster === 0 ? columns * 0.08 : cluster === 1 ? columns * 0.68 : columns * 0.82
        const baseY = cluster === 0 ? rows * 0.13 : cluster === 1 ? rows * 0.08 : rows * 0.58
        const x = Math.round(baseX + point[0])
        const y = Math.round(baseY + point[1])
        return { fromX: x, fromY: y, toX: x, toY: y, size: index % 7 === 0 ? 0.72 : 0.5, phase: (index % 9) * 0.045, route: index % 2 ? 'x-first' : 'y-first' }
      })
    }

    const retarget = (nextCycle: number) => {
      const columns = Math.ceil(width / unit)
      const rows = Math.ceil(height / unit)
      const formation = formations[nextCycle % formations.length]
      blocks.forEach((block, index) => {
        block.fromX = block.toX
        block.fromY = block.toY
        const point = formation[(index * 3 + nextCycle) % formation.length]
        const cluster = (index + nextCycle) % 3
        const baseX = cluster === 0 ? columns * 0.04 : cluster === 1 ? columns * 0.67 : columns * 0.83
        const baseY = cluster === 0 ? rows * 0.18 : cluster === 1 ? rows * 0.04 : rows * 0.55
        block.toX = Math.max(0, Math.min(columns, Math.round(baseX + point[0])))
        block.toY = Math.max(0, Math.min(rows, Math.round(baseY + point[1])))
        block.route = (index + nextCycle) % 2 ? 'x-first' : 'y-first'
      })
    }

    const drawCube = (x: number, y: number, size: number, opacity: number) => {
      const side = unit * size
      const depth = side * 0.24
      context.fillStyle = color(opacity)
      context.fillRect(x, y, side, side)
      context.beginPath()
      context.moveTo(x, y)
      context.lineTo(x + depth, y - depth)
      context.lineTo(x + side + depth, y - depth)
      context.lineTo(x + side, y)
      context.closePath()
      context.fillStyle = color(opacity * 0.52)
      context.fill()
      context.beginPath()
      context.moveTo(x + side, y)
      context.lineTo(x + side + depth, y - depth)
      context.lineTo(x + side + depth, y + side - depth)
      context.lineTo(x + side, y + side)
      context.closePath()
      context.fillStyle = color(opacity * 0.72)
      context.fill()
    }

    const draw = (time = 0) => {
      context.globalCompositeOperation = 'source-over'
      context.clearRect(0, 0, width, height)

      context.lineWidth = 1
      context.strokeStyle = color(0.055)
      context.beginPath()
      for (let x = 0.5; x < width; x += unit) {
        context.moveTo(x, 0)
        context.lineTo(x, height)
      }
      for (let y = 0.5; y < height; y += unit) {
        context.moveTo(0, y)
        context.lineTo(width, y)
      }
      context.stroke()

      context.strokeStyle = color(0.12)
      for (let x = unit * 2; x < width; x += unit * 4) for (let y = unit * 2; y < height; y += unit * 4) {
        context.beginPath()
        context.moveTo(x - 3, y)
        context.lineTo(x + 3, y)
        context.moveTo(x, y - 3)
        context.lineTo(x, y + 3)
        context.stroke()
      }

      const duration = 5200
      const nextCycle = reducedMotion ? 0 : Math.floor(time / duration)
      if (nextCycle !== cycle) {
        if (cycle >= 0) retarget(nextCycle)
        cycle = nextCycle
      }
      const cycleProgress = reducedMotion ? 1 : (time % duration) / duration

      blocks.forEach((block, index) => {
        const progress = Math.max(0, Math.min(1, (cycleProgress - block.phase) / 0.58))
        const routed = ease(progress)
        let xProgress = routed
        let yProgress = routed
        if (block.route === 'x-first') {
          xProgress = ease(Math.min(1, progress * 2))
          yProgress = ease(Math.max(0, progress * 2 - 1))
        } else {
          yProgress = ease(Math.min(1, progress * 2))
          xProgress = ease(Math.max(0, progress * 2 - 1))
        }
        const x = (block.fromX + (block.toX - block.fromX) * xProgress) * unit
        const y = (block.fromY + (block.toY - block.fromY) * yProgress) * unit
        const pulse = reducedMotion ? 1 : 0.86 + Math.sin(time * 0.0014 + index) * 0.14
        drawCube(x, y, block.size, 0.08 * pulse)
      })

      context.globalCompositeOperation = 'destination-in'
      const layoutFade = width < 768
        ? context.createLinearGradient(0, 0, 0, height)
        : context.createLinearGradient(0, 0, width, 0)
      if (width < 768) {
        layoutFade.addColorStop(0, '#000')
        layoutFade.addColorStop(0.5, '#000')
        layoutFade.addColorStop(0.78, 'transparent')
      } else {
        layoutFade.addColorStop(0, 'transparent')
        layoutFade.addColorStop(0.48, 'transparent')
        layoutFade.addColorStop(0.68, '#000')
        layoutFade.addColorStop(1, '#000')
      }
      context.fillStyle = layoutFade
      context.fillRect(0, 0, width, height)

      if (width >= 768) {
        const edgeFade = context.createLinearGradient(0, 0, 0, height)
        edgeFade.addColorStop(0, 'transparent')
        edgeFade.addColorStop(0.08, '#000')
        edgeFade.addColorStop(0.84, '#000')
        edgeFade.addColorStop(1, 'transparent')
        context.fillStyle = edgeFade
        context.fillRect(0, 0, width, height)
      }
      context.globalCompositeOperation = 'source-over'
    }

    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      const ratio = Math.min(window.devicePixelRatio, 1.5)
      width = rect.width
      height = rect.height
      unit = width < 640 ? 34 : 44
      canvas.width = Math.round(width * ratio)
      canvas.height = Math.round(height * ratio)
      context.setTransform(ratio, 0, 0, ratio, 0, 0)
      ink = hexToRgb(getComputedStyle(canvas).getPropertyValue('--ink'))
      cycle = -1
      createBlocks()
      draw()
    }

    const animate = (time: number) => {
      draw(time)
      frame = requestAnimationFrame(animate)
    }
    const onMotionChange = (event: MediaQueryListEvent) => {
      reducedMotion = event.matches
      cancelAnimationFrame(frame)
      if (reducedMotion) draw()
      else frame = requestAnimationFrame(animate)
    }
    const resizeObserver = new ResizeObserver(resize)
    const themeObserver = new MutationObserver(resize)

    resizeObserver.observe(canvas)
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
    motionQuery.addEventListener('change', onMotionChange)
    resize()
    if (!reducedMotion) frame = requestAnimationFrame(animate)

    return () => {
      cancelAnimationFrame(frame)
      resizeObserver.disconnect()
      themeObserver.disconnect()
      motionQuery.removeEventListener('change', onMotionChange)
    }
  }, [])

  return <canvas ref={canvasRef} className="hero-blueprint absolute inset-0 size-full" aria-hidden="true" />
}
