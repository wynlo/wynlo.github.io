import { getArticles } from '@/lib/content'

export const dynamic = 'force-static'

const escape = (value: string) => value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')

export function GET() {
  const base = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3001'
  const articles = getArticles()
  const items = articles.map((item) => ({ ...item, path: `/writing/${item.slug}`, description: item.excerpt }))
    .sort((a, b) => +new Date(b.publishedAt) - +new Date(a.publishedAt))
  const xml = `<?xml version="1.0" encoding="UTF-8" ?><rss version="2.0"><channel><title>Wayne Loh</title><link>${base}</link><description>Thoughts on products, brands, work, and life.</description>${items.map((item) => `<item><title>${escape(item.title)}</title><link>${base}${item.path}</link><guid>${base}${item.path}</guid><pubDate>${new Date(item.publishedAt).toUTCString()}</pubDate><description>${escape(item.description)}</description></item>`).join('')}</channel></rss>`
  return new Response(xml, { headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' } })
}
