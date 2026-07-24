import type { Metadata, Viewport } from 'next'
import './globals.css'
import { Footer } from '@/components/footer'
import { Header } from '@/components/header'
import { ThemeFavicon } from '@/components/theme-favicon'
import { ThemeProvider } from '@/components/theme-provider'
import { InitialPageFade, TransitionProvider } from '@/components/transition-provider'

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3001'),
  title: { default: 'Wayne Loh | Building Technology That Earns Trust', template: '%s | Wayne Loh' },
  description: 'Building technology people understand, trust, and adopt through architecture, engineering, product, and brand thinking.',
  icons: {
    icon: [
      { url: '/robot-icon-light.png', media: '(prefers-color-scheme: light)', type: 'image/png' },
      { url: '/robot-icon-white-v2.png', media: '(prefers-color-scheme: dark)', type: 'image/png' },
    ],
  },
  openGraph: { type: 'website', title: 'Wayne Loh | Building Technology That Earns Trust', description: 'Building technology people understand, trust, and adopt through architecture, engineering, product, and brand thinking.' },
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f7f7f4' },
    { media: '(prefers-color-scheme: dark)', color: '#171716' },
  ],
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" suppressHydrationWarning data-scroll-behavior="smooth"><body><ThemeProvider><ThemeFavicon /><TransitionProvider><Header /><InitialPageFade>{children}</InitialPageFade><Footer /></TransitionProvider></ThemeProvider></body></html>
}
