import { MermaidDiagram } from '@/components/mermaid-diagram'
import { CodeSample } from '@/components/code-sample'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import type { ReactElement } from 'react'

type Props = { content: string }
type CodeProps = { className?: string; children?: React.ReactNode }

export function ArticleRichText({ content }: Props) {
  return <ReactMarkdown
    remarkPlugins={[remarkGfm]}
    components={{
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
