'use client'

import { Mail, Menu, X } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { LinkedInIcon, PotatoheadsIcon } from './brand-icons'
import { ThemeLogoIcon } from './theme-logo-icon'
import { ThemeToggle } from './theme-toggle'

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const email = process.env.NEXT_PUBLIC_EMAIL || ''
  const linkedinUrl = process.env.NEXT_PUBLIC_LINKEDIN_URL || ''
  const contactHref = email ? `mailto:${email}` : '/#contact'
  return <header className="sticky top-0 z-40 border-b border-rule bg-paper">
    <div className="container-page flex h-20 items-center justify-between md:h-24">
      <Link href="/" className="inline-flex items-center gap-3 text-[15px] font-medium tracking-[.05em]">
        <ThemeLogoIcon />
        wayneloh.dev
      </Link>
      <nav className="hidden items-center gap-9 text-[13px] md:flex">
        <Link className="transition-opacity hover:opacity-50" href="/#approach">How I work</Link>
        <Link className="transition-opacity hover:opacity-50" href="/#about">About</Link>
        <Link className="transition-opacity hover:opacity-50" href="/writing">Writing</Link>
        <Link className="inline-flex items-center gap-2 text-muted transition-colors hover:text-ink" href="/studio"><PotatoheadsIcon size={17} />Potatoheads · Coming soon</Link>
        {linkedinUrl && <a className="grid size-9 place-items-center transition-opacity hover:opacity-50" href={linkedinUrl} target="_blank" rel="noreferrer" aria-label="LinkedIn profile"><LinkedInIcon size={18} /></a>}
        <a className="inline-flex h-10 items-center gap-2 border border-ink px-5 text-ink transition-[color,background-color,border-color,transform] hover:-translate-y-0.5 hover:bg-ink hover:text-paper" href={contactHref}><Mail className="-translate-y-px" aria-hidden="true" size={15} />Get in touch</a>
        <ThemeToggle />
      </nav>
      <div className="mobile-menu md:hidden">
        <button className="relative z-10 grid size-10 cursor-pointer place-items-center" type="button" aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'} aria-expanded={mobileMenuOpen} aria-controls="mobile-navigation" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X aria-hidden="true" size={22} /> : <Menu aria-hidden="true" size={22} />}
        </button>
        <div id="mobile-navigation" aria-hidden={!mobileMenuOpen} className={`mobile-menu-panel absolute left-0 right-0 top-full z-0 border-y border-rule bg-paper px-5 py-4${mobileMenuOpen ? ' is-open' : ''}`}>
          <nav className="flex flex-col text-[17px] tracking-[-.01em]">
            <Link className="border-b border-rule py-3.5 transition-opacity hover:opacity-50" href="/#approach" onClick={() => setMobileMenuOpen(false)}>How I work</Link>
            <Link className="border-b border-rule py-3.5 transition-opacity hover:opacity-50" href="/#about" onClick={() => setMobileMenuOpen(false)}>About</Link>
            <Link className="border-b border-rule py-3.5 transition-opacity hover:opacity-50" href="/writing" onClick={() => setMobileMenuOpen(false)}>Writing</Link>
            <Link className="flex items-center gap-2.5 border-b border-rule py-3.5 text-muted transition-colors hover:text-ink" href="/studio" onClick={() => setMobileMenuOpen(false)}><PotatoheadsIcon size={20} />Potatoheads <span className="ml-auto text-xs tracking-normal">Coming soon</span></Link>
            {linkedinUrl && <a className="flex items-center gap-2.5 border-b border-rule py-3.5 transition-opacity hover:opacity-50" href={linkedinUrl} target="_blank" rel="noreferrer" onClick={() => setMobileMenuOpen(false)}><LinkedInIcon size={19} />LinkedIn</a>}
            <div className="mt-5 flex gap-3"><a className="flex flex-1 items-center justify-center gap-2 bg-ink px-5 py-4 text-sm text-paper transition-[color,background-color,border-color,transform] hover:-translate-y-0.5 hover:bg-action-hover hover:text-paper" href={contactHref} onClick={() => setMobileMenuOpen(false)}><Mail className="-translate-y-px" aria-hidden="true" size={16} />Get in touch</a><ThemeToggle className="size-auto w-14 shrink-0" /></div>
          </nav>
        </div>
      </div>
    </div>
  </header>
}
