'use client'

import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'

export function ThemeToggle({ className = '' }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme()
  const toggleTheme = () => {
    const nextTheme = resolvedTheme === 'dark' ? 'light' : 'dark'
    if (!document.startViewTransition) {
      setTheme(nextTheme)
      return
    }
    document.startViewTransition(() => setTheme(nextTheme))
  }

  return <button
    type="button"
    className={`theme-toggle grid size-10 cursor-pointer place-items-center border border-rule text-ink transition-[color,background-color,border-color,transform] hover:-translate-y-0.5 hover:border-ink hover:bg-ink hover:text-paper ${className}`}
    aria-label="Toggle color theme"
    title="Toggle color theme"
    onClick={toggleTheme}
  >
    <Sun className="theme-toggle-sun" size={16} aria-hidden="true" />
    <Moon className="theme-toggle-moon" size={16} aria-hidden="true" />
  </button>
}
