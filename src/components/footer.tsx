import Link from 'next/link'
import { BookOpen, Mail } from 'lucide-react'
import { LinkedInIcon } from './brand-icons'

export function Footer() {
  const email = 'wayneloh.qiao.zhang@gmail.com'
  const linkedinUrl = 'https://www.linkedin.com/in/wayneloh'
  return <footer className="border-t border-rule bg-paper">
    <div className="container-page flex flex-col-reverse gap-6 py-8 md:flex-row md:items-center md:justify-between">
      <span className="text-xs text-muted">© {new Date().getFullYear()} Wayne Loh</span>
      <nav className="flex flex-wrap gap-x-8 gap-y-3 text-sm"><Link className="inline-flex items-center gap-2" href="/writing"><BookOpen className="-translate-y-px" aria-hidden="true" size={16} />Writing</Link>{email && <a className="inline-flex items-center gap-2" href={`mailto:${email}`}><Mail className="-translate-y-px" aria-hidden="true" size={16} />Email</a>}{linkedinUrl && <a className="inline-flex items-center gap-2" href={linkedinUrl} target="_blank" rel="noreferrer"><LinkedInIcon className="-translate-y-px" size={16} />LinkedIn</a>}</nav>
    </div>
  </footer>
}
