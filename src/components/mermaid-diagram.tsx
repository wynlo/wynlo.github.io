'use client'

import { useTheme } from 'next-themes'
import { useEffect, useId, useState } from 'react'

type Props = { chart: string; caption?: string | null }

export function MermaidDiagram({ chart, caption }: Props) {
  const { resolvedTheme } = useTheme()
  const reactId = useId()
  const [svg, setSvg] = useState('')
  const [failed, setFailed] = useState(false)

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
        const result = await mermaid.render(id, chart)
        if (active) {
          setSvg(result.svg)
          setFailed(false)
        }
      } catch {
        if (active) setFailed(true)
      }
    }

    renderDiagram()
    return () => { active = false }
  }, [chart, reactId, resolvedTheme])

  return <figure className="mermaid-figure">
    {failed
      ? <pre className="mermaid-fallback"><code>{chart}</code></pre>
      : <div className="mermaid-canvas" aria-label={caption || 'Diagram'} role="img" dangerouslySetInnerHTML={{ __html: svg }} />}
    {caption && <figcaption>{caption}</figcaption>}
  </figure>
}
