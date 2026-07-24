type Props = { language: string; code: string; caption?: string | null }

export function CodeSample({ language, code, caption }: Props) {
  return <figure className="code-sample">
    <div className="code-sample-label">{language}</div>
    <pre><code>{code}</code></pre>
    {caption && <figcaption>{caption}</figcaption>}
  </figure>
}
