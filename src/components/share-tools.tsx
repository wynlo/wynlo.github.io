'use client'

import { Check, Copy, Linkedin, Mail } from 'lucide-react'
import { useState } from 'react'

export function ShareTools({ title }: { title: string }) {
  const [copied, setCopied] = useState(false)
  const share = (target: 'linkedin' | 'email') => {
    const url = encodeURIComponent(window.location.href)
    const href = target === 'linkedin' ? `https://www.linkedin.com/sharing/share-offsite/?url=${url}` : `mailto:?subject=${encodeURIComponent(title)}&body=${url}`
    window.open(href, '_blank', 'noopener,noreferrer')
  }
  return <div className="flex gap-2 lg:sticky lg:top-8 lg:flex-col" aria-label="Share article">
    <button className="grid size-9 place-items-center rounded-full border border-rule text-ink transition-colors hover:bg-surface-strong" aria-label="Copy article link" onClick={async () => { await navigator.clipboard.writeText(window.location.href); setCopied(true); setTimeout(() => setCopied(false), 1500) }}>{copied ? <Check size={14} /> : <Copy size={14} />}</button>
    <button className="grid size-9 place-items-center rounded-full border border-rule text-ink transition-colors hover:bg-surface-strong" aria-label="Share on LinkedIn" onClick={() => share('linkedin')}><Linkedin size={14} /></button>
    <button className="grid size-9 place-items-center rounded-full border border-rule text-ink transition-colors hover:bg-surface-strong" aria-label="Share by email" onClick={() => share('email')}><Mail size={14} /></button>
  </div>
}
