import type { Metadata } from 'next'
import { ArticleList } from '@/components/article-list'
import { getArticles } from '@/lib/content'

export const metadata: Metadata = { title: 'Writing', description: 'Writing on architecture, engineering, product, brand, work, and the decisions connecting them.' }

export default function WritingPage() {
  const articles = getArticles()
  return <div className="container-page pb-28 pt-16 md:pb-36 md:pt-24">
    <header className="grid gap-10 border-b border-rule pb-16 md:grid-cols-[1.2fr_.8fr] md:pb-24">
      <h1 className="display max-w-4xl text-3xl md:text-5xl">Writing</h1>
      <p className="max-w-md self-end text-base leading-7 text-muted">Notes on architecture, engineering, product, brand, work, and the decisions connecting them.</p>
    </header>
    {articles.length > 0
      ? <section className="pt-16 md:pt-24"><ArticleList items={articles} featured /></section>
      : <section className="pt-16 md:pt-24"><p className="eyebrow text-muted">Coming soon</p><p className="mt-6 max-w-xl text-2xl leading-[1.4] tracking-[.015em] md:text-3xl">Notes on what I’m building, the decisions behind it, and what I’m learning along the way.</p></section>}
  </div>
}
