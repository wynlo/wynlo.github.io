'use client'

import { animate, motion } from 'motion/react'
import { TransitionRouter } from 'next-transition-router'

const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

export function TransitionProvider({ children }: { children: React.ReactNode }) {
  return <TransitionRouter
    auto
    leave={async (next) => {
      const main = document.querySelector('main')
      if (main && !reducedMotion()) await animate(main, { opacity: 0 }, { duration: 0.18, ease: 'easeOut' })
      next()
    }}
    enter={async (next) => {
      const main = document.querySelector('main')
      if (main && !reducedMotion()) {
        main.style.opacity = '0'
        await animate(main, { opacity: 1 }, { duration: 0.28, ease: 'easeOut' })
      }
      next()
    }}
  >
    {children}
  </TransitionRouter>
}

export function InitialPageFade({ children }: { children: React.ReactNode }) {
  return <motion.main
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.5, ease: 'easeOut' }}
  >
    {children}
  </motion.main>
}
