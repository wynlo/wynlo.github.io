'use client'

import { motion, useReducedMotion, type Variants } from 'motion/react'

type FadeInSectionProps = {
  children: React.ReactNode
  className?: string
  id?: string
}

export function FadeInSection({ children, className, id }: FadeInSectionProps) {
  const shouldReduceMotion = useReducedMotion()

  return <motion.section
    id={id}
    className={className}
    initial={shouldReduceMotion ? false : 'hidden'}
    whileInView="visible"
    viewport={{ once: true, amount: 0.15 }}
  >
    {children}
  </motion.section>
}

const textVariants: Variants = {
  hidden: { opacity: 0 },
  visible: (order: number = 0) => ({
    opacity: 1,
    transition: { duration: 0.15, delay: order * 0.04, ease: 'easeOut' },
  }),
}

const artworkVariants = textVariants

type FadeInItemProps = {
  children: React.ReactNode
  className?: string
  order?: number
}

export function FadeInItem({ children, className, order = 0 }: FadeInItemProps) {
  return <motion.div className={className} custom={order} variants={textVariants}>
    {children}
  </motion.div>
}

export function FadeInArtwork({ children, className, order = 0 }: FadeInItemProps) {
  return <motion.div className={className} custom={order} variants={artworkVariants}>
    {children}
  </motion.div>
}
