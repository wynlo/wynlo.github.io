import { ShareTools } from '@/components/share-tools'
import { ArticleRichText } from '@/components/article-rich-text'
import { articleRedirects, formatDate, getArticle, getArticles } from '@/lib/content'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

type Props = { params: Promise<{ slug: string }> }
export const dynamicParams = false
export function generateStaticParams() {
  return [...getArticles().map(({ slug }) => slug), ...Object.keys(articleRedirects)].map((slug) => ({ slug }))
}
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const article = getArticle(slug)
  if (article) return { title: article.title, description: article.excerpt }
  const destination = articleRedirects[slug]
  return destination ? { robots: { index: false }, alternates: { canonical: `/writing/${destination}/` } } : {}
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params
  const article = getArticle(slug)
  if (!article) {
    const destination = articleRedirects[slug]
    if (destination) return <RedirectPage destination={`/writing/${destination}/`} />
    notFound()
  }

  return <article>
    <header className="container-page pt-16 md:pt-24">
      <div className="mx-auto max-w-5xl text-center"><p className="eyebrow text-muted">{article.category}</p><h1 className="display mt-6 text-3xl leading-[1.08] sm:text-4xl md:text-5xl lg:text-6xl">{article.title}</h1><p className="mx-auto mt-7 max-w-2xl text-lg leading-8 text-muted">{article.subtitle || article.excerpt}</p><p className="mt-8 text-[11px] text-muted">{formatDate(article.publishedAt)} · {article.readingTime} min read</p></div>
    </header>
    <section className="container-page grid gap-10 py-16 lg:grid-cols-[60px_minmax(0,720px)] lg:justify-center lg:py-24"><ShareTools title={article.title}/><div className="prose-editorial"><ArticleRichText content={article.content} /></div></section>
  </article>
}

function RedirectPage({ destination }: { destination: string }) {
  return <>
    <meta httpEquiv="refresh" content={`0; url=${destination}`} />
    <div className="container-page flex min-h-[65vh] flex-col justify-center py-20">
      <p className="eyebrow text-muted">Article moved</p>
      <a className="text-link mt-8 self-start" href={destination}>Continue to the article <span>→</span></a>
    </div>
  </>
}
