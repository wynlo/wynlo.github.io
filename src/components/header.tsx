'use client'

import { Mail, Menu, X } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { LinkedInIcon } from './brand-icons'
import { SectionLink } from './section-link'
import { ThemeLogoIcon } from './theme-logo-icon'
import { ThemeToggle } from './theme-toggle'

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 4)
    update()
    window.addEventListener('scroll', update, { passive: true })
    return () => window.removeEventListener('scroll', update)
  }, [])

  const email = 'wayneloh.qiao.zhang@gmail.com'
  const linkedinUrl = 'https://www.linkedin.com/in/wayneloh'
  const contactHref = email ? `mailto:${email}` : '/#contact'
  return <header className={`sticky top-0 z-40 border-b backdrop-blur-md transition-colors ${mobileMenuOpen ? 'bg-paper' : 'bg-paper/95'} ${scrolled || mobileMenuOpen ? 'border-rule' : 'border-transparent'}`}>
    <div className="container-page flex h-16 items-center justify-between gap-6">
      <Link href="/" className="inline-flex items-center gap-2.5 whitespace-nowrap text-[15px] font-medium">
        <ThemeLogoIcon size={32} />
        Wayne Loh
      </Link>
      <nav className="hidden items-center gap-6 whitespace-nowrap text-[13px] md:flex xl:gap-8">
        <SectionLink className="transition-opacity hover:opacity-50" id="approach">How I work</SectionLink>
        <SectionLink className="transition-opacity hover:opacity-50" id="about">About</SectionLink>
        <Link className="transition-opacity hover:opacity-50" href="/writing">Writing</Link>
        {linkedinUrl && <a className="grid size-9 place-items-center transition-opacity hover:opacity-50" href={linkedinUrl} target="_blank" rel="noreferrer" aria-label="LinkedIn profile"><LinkedInIcon size={18} /></a>}
        <a className="inline-flex h-9 items-center gap-2 rounded-md bg-ink px-4 text-sm font-medium text-paper transition-colors hover:bg-action-hover" href={contactHref}><Mail className="-translate-y-px" aria-hidden="true" size={15} />Get in touch</a>
        <ThemeToggle />
      </nav>
      <div className="mobile-menu md:hidden">
        <button className="relative z-10 grid size-10 cursor-pointer place-items-center" type="button" aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'} aria-expanded={mobileMenuOpen} aria-controls="mobile-navigation" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X aria-hidden="true" size={22} /> : <Menu aria-hidden="true" size={22} />}
        </button>
        <div aria-hidden="true" className={`mobile-menu-backdrop absolute left-0 right-0 top-full z-0 h-dvh bg-paper/60 ${mobileMenuOpen ? 'is-open' : ''}`} onClick={() => setMobileMenuOpen(false)} />
        <div id="mobile-navigation" aria-hidden={!mobileMenuOpen} className={`mobile-menu-panel absolute left-0 right-0 top-full z-0 border-y border-rule bg-paper px-5 py-4 ${mobileMenuOpen ? 'is-open' : ''}`}>
          <nav className="flex flex-col text-[17px]">
            <SectionLink className="border-b border-rule py-3.5 transition-opacity hover:opacity-50" id="approach" onClick={() => setMobileMenuOpen(false)}>How I work</SectionLink>
            <SectionLink className="border-b border-rule py-3.5 transition-opacity hover:opacity-50" id="about" onClick={() => setMobileMenuOpen(false)}>About</SectionLink>
            <Link className="border-b border-rule py-3.5 transition-opacity hover:opacity-50" href="/writing" onClick={() => setMobileMenuOpen(false)}>Writing</Link>
            {linkedinUrl && <a className="flex items-center gap-2.5 border-b border-rule py-3.5 transition-opacity hover:opacity-50" href={linkedinUrl} target="_blank" rel="noreferrer" onClick={() => setMobileMenuOpen(false)}><LinkedInIcon size={19} />LinkedIn</a>}
            <div className="mt-5 flex gap-3"><a className="flex flex-1 items-center justify-center gap-2 rounded-md bg-ink px-4 py-3 text-[15px] font-medium text-paper transition-colors hover:bg-action-hover hover:text-paper" href={contactHref} onClick={() => setMobileMenuOpen(false)}><Mail className="-translate-y-px" aria-hidden="true" size={16} />Get in touch</a><ThemeToggle className="size-auto w-14 shrink-0" /></div>
          </nav>
        </div>
      </div>
    </div>
  </header>
}
