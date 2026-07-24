import { MermaidDiagram } from '@/components/mermaid-diagram'
import { CodeSample } from '@/components/code-sample'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import type { ReactElement } from 'react'

type Props = { content: string }
type CodeProps = { className?: string; children?: React.ReactNode }
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || ''

function MarkdownImage({ src, alt }: { src?: string | Blob; alt?: string }) {
  const imageSource = typeof src === 'string' && src.startsWith('/') ? `${basePath}${src}` : typeof src === 'string' ? src : undefined
  // Markdown images do not provide the dimensions required by next/image.
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={imageSource} alt={alt || ''} />
}

export function ArticleRichText({ content }: Props) {
  return <ReactMarkdown
    remarkPlugins={[remarkGfm]}
    components={{
      img: MarkdownImage,
      pre: ({ children }) => {
        const code = children as ReactElement<CodeProps>
        const language = code.props.className?.replace('language-', '') || 'text'
        const value = String(code.props.children || '').replace(/\n$/, '')
        return language === 'mermaid'
          ? <MermaidDiagram chart={value} />
          : <CodeSample language={language} code={value} />
      },
    }}
  >{content}</ReactMarkdown>
}
