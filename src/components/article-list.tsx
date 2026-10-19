import type { Article } from '@/lib/content'
import { formatDate } from '@/lib/content'
import Link from 'next/link'
import { CategoryTag } from './category-tag'

export function ArticleList({ items, featured = false }: { items: Article[]; featured?: boolean }) {
  if (!items.length) return null
  if (!featured) return <div>{items.map((article) => <ArticleRow article={article} key={article.slug} />)}</div>

  return <div className="grid gap-5 md:grid-cols-2 lg:gap-6">
    {items.map((article, index) => <ArticleCard article={article} latest={index === 0} key={article.slug} />)}
  </div>
}

function ArticleCard({ article, latest }: { article: Article; latest: boolean }) {
  return <Link href={`/writing/${article.slug}`} className="card group flex h-full flex-col p-6 transition-colors hover:bg-surface md:p-7">
    <div className="flex items-center justify-between gap-4 text-[11px] text-muted">
      <span className="flex items-center gap-2"><CategoryTag category={article.category} />{latest && <span className="font-medium text-ink">Latest</span>}</span>
      <span className="tabular">{formatDate(article.publishedAt)} · {article.readingTime} min</span>
    </div>
    <h3 className="mt-4 max-w-2xl text-lg leading-tight md:text-xl">{article.title}</h3>
    <p className="mt-3 max-w-xl text-sm leading-6 text-muted">{article.excerpt}</p>
  </Link>
}

function ArticleRow({ article }: { article: Article }) {
  return <Link href={`/writing/${article.slug}`} className="group block border-b border-rule py-7">
    <div className="flex items-center justify-between gap-4 text-[11px] text-muted"><CategoryTag category={article.category} /><span className="tabular">{formatDate(article.publishedAt)} · {article.readingTime} min</span></div>
    <h3 className="mt-4 max-w-2xl text-lg leading-tight transition-opacity group-hover:opacity-60 md:text-xl">{article.title}</h3>
    <p className="mt-3 max-w-xl text-sm leading-6 text-muted">{article.excerpt}</p>
  </Link>
}
