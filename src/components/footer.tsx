import Link from 'next/link'
import { BookOpen, Mail } from 'lucide-react'
import { LinkedInIcon, PotatoheadsIcon } from './brand-icons'

export function Footer() {
  const email = process.env.NEXT_PUBLIC_EMAIL || ''
  const linkedinUrl = process.env.NEXT_PUBLIC_LINKEDIN_URL || ''
  const studioName = 'Potatoheads'
  return <footer className="border-t border-rule bg-paper">
    <div className="container-page py-12 md:py-16">
      <div className="grid gap-10 md:grid-cols-2 md:items-end">
        <div><p className="font-display max-w-md text-2xl leading-tight tracking-[-.015em] md:text-4xl">Wayne Loh</p><p className="mt-5 text-sm text-muted">Building useful systems and making complex ideas clear.</p></div>
        <nav className="flex flex-wrap gap-x-8 gap-y-3 text-sm md:justify-end"><Link className="inline-flex items-center gap-2" href="/writing"><BookOpen className="-translate-y-px" aria-hidden="true" size={16} />Writing</Link><Link className="inline-flex items-center gap-2 text-muted transition-colors hover:text-ink" href="/studio"><PotatoheadsIcon size={17} />{studioName} · Coming soon</Link>{email && <a className="inline-flex items-center gap-2" href={`mailto:${email}`}><Mail className="-translate-y-px" aria-hidden="true" size={16} />Email</a>}{linkedinUrl && <a className="inline-flex items-center gap-2" href={linkedinUrl} target="_blank" rel="noreferrer"><LinkedInIcon className="-translate-y-px" size={16} />LinkedIn</a>}</nav>
      </div>
      <div className="mt-14 flex justify-between border-t border-rule pt-5 text-[11px] text-muted"><span>Wayne Loh</span><span>© {new Date().getFullYear()}</span></div>
    </div>
  </footer>
}
