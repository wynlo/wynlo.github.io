import { getArticles } from '@/lib/content'
import type { MetadataRoute } from 'next'

export const dynamic = 'force-static'

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3001'
  const articles = getArticles()
  return [
    ...['', '/writing', '/studio'].map((path) => ({ url: `${base}${path}`, lastModified: new Date() })),
    ...articles.map((item) => ({ url: `${base}/writing/${item.slug}`, lastModified: new Date(item.publishedAt) })),
  ]
}
