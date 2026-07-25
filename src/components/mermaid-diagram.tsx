'use client'

import * as Dialog from '@radix-ui/react-dialog'
import { Maximize2, Minus, Plus, Scan, X } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useEffect, useId, useLayoutEffect, useRef, useState } from 'react'
import type { CSSProperties, PointerEvent as ReactPointerEvent } from 'react'

type Props = { chart: string; caption?: string | null }
type Geometry = { viewBoxWidth: number; viewBoxHeight: number; fitScale: number }
type Drag = { pointerId: number; x: number; y: number; left: number; top: number }
type FocusPoint = { x: number; y: number }

export function MermaidDiagram({ chart, caption }: Props) {
  const { resolvedTheme } = useTheme()
  const reactId = useId()
  const [svg, setSvg] = useState('')
  const [expandedSvg, setExpandedSvg] = useState('')
  const [failed, setFailed] = useState(false)
  const [open, setOpen] = useState(false)
  const [zoom, setZoom] = useState(1)
  const [geometry, setGeometry] = useState<Geometry | null>(null)
  const [dragging, setDragging] = useState(false)
  const viewportRef = useRef<HTMLDivElement>(null)
  const diagramRef = useRef<HTMLDivElement>(null)
  const dragRef = useRef<Drag | null>(null)
  const pendingFocusRef = useRef<FocusPoint | null>(null)
  const label = caption || 'Diagram'

  useEffect(() => {
    let active = true

    async function renderDiagram() {
      try {
        const { default: mermaid } = await import('mermaid')
        mermaid.initialize({
          startOnLoad: false,
          securityLevel: 'strict',
          theme: resolvedTheme === 'dark' ? 'dark' : 'neutral',
          fontFamily: 'inherit',
        })
        const id = `mermaid-${reactId.replaceAll(':', '')}`
        const [inlineResult, expandedResult] = await Promise.all([
          mermaid.render(`${id}-inline`, chart),
          mermaid.render(`${id}-expanded`, chart),
        ])
        if (active) {
          setSvg(inlineResult.svg)
          setExpandedSvg(expandedResult.svg)
          setFailed(false)
        }
      } catch {
        if (active) setFailed(true)
      }
    }

    renderDiagram()
    return () => { active = false }
  }, [chart, reactId, resolvedTheme])

  useEffect(() => {
    if (!open) return
    let observer: ResizeObserver | undefined
    const frame = requestAnimationFrame(() => {
      const viewport = viewportRef.current
      const svgElement = diagramRef.current?.querySelector('svg')
      if (!viewport || !svgElement) return
      const measuredViewport = viewport
      const measuredSvg = svgElement

      function measure() {
        const viewBox = measuredSvg.viewBox.baseVal
        const viewBoxWidth = viewBox.width || measuredSvg.getBBox().width
        const viewBoxHeight = viewBox.height || measuredSvg.getBBox().height
        const availableWidth = Math.max(1, measuredViewport.clientWidth - 64)
        const availableHeight = Math.max(1, measuredViewport.clientHeight - 64)

        setGeometry({
          viewBoxWidth,
          viewBoxHeight,
          fitScale: Math.min(availableWidth / viewBoxWidth, availableHeight / viewBoxHeight),
        })
      }

      measure()
      observer = new ResizeObserver(measure)
      observer.observe(measuredViewport)
    })

    return () => {
      cancelAnimationFrame(frame)
      observer?.disconnect()
    }
  }, [expandedSvg, open])

  useLayoutEffect(() => {
    const viewport = viewportRef.current
    const diagram = diagramRef.current
    const focus = pendingFocusRef.current
    if (!viewport || !diagram || !geometry || !focus) return

    const viewportRect = viewport.getBoundingClientRect()
    const diagramRect = diagram.getBoundingClientRect()
    const diagramLeft = diagramRect.left - viewportRect.left + viewport.scrollLeft
    const diagramTop = diagramRect.top - viewportRect.top + viewport.scrollTop

    viewport.scrollLeft = diagramLeft + focus.x * diagramRect.width - viewport.clientWidth / 2
    viewport.scrollTop = diagramTop + focus.y * diagramRect.height - viewport.clientHeight / 2
    pendingFocusRef.current = null
  }, [geometry, zoom])

  function getViewportFocus(): FocusPoint {
    const viewport = viewportRef.current
    const diagram = diagramRef.current
    if (!viewport || !diagram) return { x: 0.5, y: 0.5 }

    const viewportRect = viewport.getBoundingClientRect()
    const diagramRect = diagram.getBoundingClientRect()
    return {
      x: Math.min(1, Math.max(0, (viewportRect.left + viewport.clientWidth / 2 - diagramRect.left) / diagramRect.width)),
      y: Math.min(1, Math.max(0, (viewportRect.top + viewport.clientHeight / 2 - diagramRect.top) / diagramRect.height)),
    }
  }

  function changeZoom(nextZoom: number) {
    pendingFocusRef.current = getViewportFocus()
    setZoom(nextZoom)
  }

  function fitDiagram() {
    pendingFocusRef.current = { x: 0.5, y: 0.5 }
    if (zoom === 1) {
      const viewport = viewportRef.current
      if (viewport) {
        viewport.scrollLeft = (viewport.scrollWidth - viewport.clientWidth) / 2
        viewport.scrollTop = (viewport.scrollHeight - viewport.clientHeight) / 2
      }
      pendingFocusRef.current = null
      return
    }
    setZoom(1)
  }

  function handleOpenChange(nextOpen: boolean) {
    if (nextOpen) {
      setZoom(1)
      setGeometry(null)
      pendingFocusRef.current = { x: 0.5, y: 0.5 }
    }
    setOpen(nextOpen)
  }

  function startPan(event: ReactPointerEvent<HTMLDivElement>) {
    if ((event.pointerType !== 'mouse' && event.pointerType !== 'pen') || event.button !== 0) return
    const viewport = viewportRef.current
    if (!viewport) return

    dragRef.current = {
      pointerId: event.pointerId,
      x: event.clientX,
      y: event.clientY,
      left: viewport.scrollLeft,
      top: viewport.scrollTop,
    }
    viewport.setPointerCapture(event.pointerId)
    setDragging(true)
    event.preventDefault()
  }

  function pan(event: ReactPointerEvent<HTMLDivElement>) {
    const drag = dragRef.current
    const viewport = viewportRef.current
    if (!drag || !viewport || drag.pointerId !== event.pointerId) return
    viewport.scrollLeft = drag.left - (event.clientX - drag.x)
    viewport.scrollTop = drag.top - (event.clientY - drag.y)
    event.preventDefault()
  }

  function stopPan(event: ReactPointerEvent<HTMLDivElement>) {
    if (dragRef.current?.pointerId !== event.pointerId) return
    dragRef.current = null
    setDragging(false)
  }

  const diagramStyle = geometry ? {
    width: geometry.viewBoxWidth * geometry.fitScale * zoom,
    height: geometry.viewBoxHeight * geometry.fitScale * zoom,
  } satisfies CSSProperties : undefined

  return (
    <Dialog.Root open={open} onOpenChange={handleOpenChange}>
      <figure className="mermaid-figure">
        {failed ? (
          <pre className="mermaid-fallback"><code>{chart}</code></pre>
        ) : (
          <div className="mermaid-frame">
            <div
              className="mermaid-canvas"
              aria-label={label}
              role="img"
              dangerouslySetInnerHTML={{ __html: svg }}
            />
            {svg && (
              <Dialog.Trigger asChild>
                <button className="mermaid-expand" type="button" aria-label="Maximize diagram">
                  <Maximize2 aria-hidden="true" size={18} strokeWidth={1.75} />
                </button>
              </Dialog.Trigger>
            )}
          </div>
        )}
        {caption && <figcaption>{caption}</figcaption>}
      </figure>

      <Dialog.Portal>
        <Dialog.Overlay className="mermaid-dialog-overlay" />
        <Dialog.Content className="mermaid-dialog" aria-describedby={undefined}>
          <header className="mermaid-dialog-header">
            <Dialog.Title className="mermaid-dialog-title">{label}</Dialog.Title>
            <div className="mermaid-dialog-actions">
              <div className="mermaid-dialog-zoom-controls" role="group" aria-label="Diagram zoom">
                <button
                  className="mermaid-dialog-action"
                  type="button"
                  aria-label="Zoom out"
                  disabled={zoom <= 0.5}
                  onClick={() => changeZoom(Math.max(0.5, zoom - 0.25))}
                >
                  <Minus aria-hidden="true" size={20} strokeWidth={1.75} />
                </button>
                <span className="mermaid-dialog-zoom" aria-live="polite">{Math.round(zoom * 100)}%</span>
                <button
                  className="mermaid-dialog-action"
                  type="button"
                  aria-label="Zoom in"
                  disabled={zoom >= 4}
                  onClick={() => changeZoom(Math.min(4, zoom + 0.25))}
                >
                  <Plus aria-hidden="true" size={20} strokeWidth={1.75} />
                </button>
              </div>
              <button className="mermaid-dialog-fit" type="button" aria-label="Fit diagram to view" onClick={fitDiagram}>
                <Scan aria-hidden="true" size={19} strokeWidth={1.75} />
              </button>
              <Dialog.Close asChild>
                <button className="mermaid-dialog-close" type="button" aria-label="Close maximized diagram">
                  <X aria-hidden="true" size={20} strokeWidth={1.75} />
                </button>
              </Dialog.Close>
            </div>
          </header>
          <div
            ref={viewportRef}
            className={`mermaid-dialog-canvas${dragging ? ' is-dragging' : ''}`}
            role="region"
            aria-label={`${label} diagram viewport`}
            tabIndex={0}
            onPointerDown={startPan}
            onPointerMove={pan}
            onPointerUp={stopPan}
            onPointerCancel={stopPan}
            onLostPointerCapture={stopPan}
          >
            <div className="mermaid-dialog-stage">
              <div
                ref={diagramRef}
                className="mermaid-dialog-diagram"
                aria-label={label}
                role="img"
                style={diagramStyle}
                dangerouslySetInnerHTML={{ __html: expandedSvg }}
              />
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
