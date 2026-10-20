import Link from 'next/link'
import { BookOpen, Mail } from 'lucide-react'
import { LinkedInIcon, PotatoheadsIcon } from './brand-icons'
import { ComingSoonTooltip } from './coming-soon-tooltip'

export function Footer() {
  const email = 'wayneloh.qiao.zhang@gmail.com'
  const linkedinUrl = 'https://www.linkedin.com/in/wayneloh'
  const studioUrl = process.env.NEXT_PUBLIC_STUDIO_URL || ''
  const studioName = process.env.NEXT_PUBLIC_STUDIO_NAME || 'Potatoheads'
  return <footer className="border-t border-rule bg-paper">
    <div className="container-page flex flex-col-reverse gap-6 py-8 md:flex-row md:items-center md:justify-between">
      <span className="text-xs text-muted">© {new Date().getFullYear()} Wayne Loh</span>
      <nav className="flex flex-wrap gap-x-8 gap-y-3 text-sm"><Link className="inline-flex items-center gap-2" href="/writing"><BookOpen className="-translate-y-px" aria-hidden="true" size={16} />Writing</Link>{studioUrl ? <a className="inline-flex items-center gap-2 text-muted transition-colors hover:text-ink" href={studioUrl} target="_blank" rel="noreferrer"><PotatoheadsIcon size={24} />{studioName}</a> : <ComingSoonTooltip><span className="inline-flex cursor-default items-center gap-2 text-muted" tabIndex={0}><PotatoheadsIcon size={24} />{studioName}</span></ComingSoonTooltip>}{email && <a className="inline-flex items-center gap-2" href={`mailto:${email}`}><Mail className="-translate-y-px" aria-hidden="true" size={16} />Email</a>}{linkedinUrl && <a className="inline-flex items-center gap-2" href={linkedinUrl} target="_blank" rel="noreferrer"><LinkedInIcon className="-translate-y-px" size={16} />LinkedIn</a>}</nav>
    </div>
  </footer>
}
