import Link from 'next/link'
import { BookOpen, Mail } from 'lucide-react'
import { LinkedInIcon, PotatoheadsIcon } from './brand-icons'

export function Footer() {
  const email = process.env.NEXT_PUBLIC_EMAIL || ''
  const linkedinUrl = process.env.NEXT_PUBLIC_LINKEDIN_URL || ''
  const studioUrl = process.env.NEXT_PUBLIC_STUDIO_URL || ''
  const studioName = process.env.NEXT_PUBLIC_STUDIO_NAME || 'Potatoheads'
  return <footer className="border-t border-rule bg-paper">
    <div className="container-page flex flex-col-reverse gap-6 py-8 md:flex-row md:items-center md:justify-between">
      <span className="text-xs text-muted">© {new Date().getFullYear()} Wayne Loh</span>
      <nav className="flex flex-wrap gap-x-8 gap-y-3 text-sm"><Link className="inline-flex items-center gap-2" href="/writing"><BookOpen className="-translate-y-px" aria-hidden="true" size={16} />Writing</Link>{studioUrl ? <a className="inline-flex items-center gap-2 text-muted transition-colors hover:text-ink" href={studioUrl} target="_blank" rel="noreferrer"><PotatoheadsIcon size={17} />{studioName}</a> : <span className="inline-flex items-center gap-2 text-muted"><PotatoheadsIcon size={17} />{studioName} · Coming soon</span>}{email && <a className="inline-flex items-center gap-2" href={`mailto:${email}`}><Mail className="-translate-y-px" aria-hidden="true" size={16} />Email</a>}{linkedinUrl && <a className="inline-flex items-center gap-2" href={linkedinUrl} target="_blank" rel="noreferrer"><LinkedInIcon className="-translate-y-px" size={16} />LinkedIn</a>}</nav>
    </div>
  </footer>
}
