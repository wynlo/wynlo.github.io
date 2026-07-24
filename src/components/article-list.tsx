import type { Article } from '@/lib/content'
import { formatDate } from '@/lib/content'
import Link from 'next/link'

export function ArticleList({ items, featured = false }: { items: Article[]; featured?: boolean }) {
  if (!items.length) return null
  if (!featured) return <div>{items.map((article) => <ArticleRow article={article} key={article.slug} />)}</div>

  return <div className="grid gap-x-14 gap-y-6 md:grid-cols-2 lg:gap-x-20">
    {items.map((article, index) => <ArticleCard article={article} latest={index === 0} key={article.slug} />)}
  </div>
}

function ArticleCard({ article, latest }: { article: Article; latest: boolean }) {
  return <Link href={`/writing/${article.slug}`} className="group flex h-full flex-col py-7">
    <div className="flex items-center justify-between gap-4 text-[11px] text-muted">
      <span className="flex items-center gap-3">{article.category}{latest && <span className="bg-ink px-2 py-1 text-[9px] uppercase tracking-[.12em] text-paper">Latest</span>}</span>
      <span>{formatDate(article.publishedAt)} · {article.readingTime} min</span>
    </div>
    <h3 className="mt-4 max-w-2xl text-lg leading-tight tracking-[-.015em] transition-opacity group-hover:opacity-50 md:text-xl">{article.title}</h3>
    <p className="mt-3 max-w-xl text-sm leading-6 text-muted">{article.excerpt}</p>
  </Link>
}

function ArticleRow({ article, bordered = true }: { article: Article; bordered?: boolean }) {
  return <Link href={`/writing/${article.slug}`} className={`group block py-7${bordered ? ' border-b border-rule' : ''}`}>
    <div className="flex justify-between gap-4 text-[11px] text-muted"><span>{article.category}</span><span>{formatDate(article.publishedAt)} · {article.readingTime} min</span></div>
    <h3 className="mt-4 max-w-2xl text-lg leading-tight tracking-[-.015em] transition-opacity group-hover:opacity-50 md:text-xl">{article.title}</h3>
    <p className="mt-3 max-w-xl text-sm leading-6 text-muted">{article.excerpt}</p>
  </Link>
}
