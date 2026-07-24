import matter from 'gray-matter'
import { readdirSync, readFileSync } from 'node:fs'
import path from 'node:path'

export type Article = {
  title: string
  slug: string
  excerpt: string
  subtitle?: string | null
  category: string
  publishedAt: string
  readingTime: number
  featured?: boolean
  draft?: boolean
  content: string
}

export const articleRedirects: Record<string, string> = {
  'how-id-set-up-agents-md-across-an-organisation': 'managing-agent-skills-across-an-organisation',
  'clean-architecture-makes-coding-agents-more-useful': 'how-clean-architecture-makes-coding-agents-faster-and-more-effective',
  'dependency-injection-makes-clean-architecture-useful-for-agents': 'how-clean-architecture-makes-coding-agents-faster-and-more-effective',
}

const articlesDirectory = path.join(process.cwd(), 'content/articles')

function readArticle(filename: string): Article {
  const source = readFileSync(path.join(articlesDirectory, filename), 'utf8')
  const { data, content } = matter(source)

  return {
    title: String(data.title),
    slug: String(data.slug || filename.replace(/\.md$/, '')),
    excerpt: String(data.excerpt),
    subtitle: data.subtitle ? String(data.subtitle) : null,
    category: String(data.category || 'Writing'),
    publishedAt: new Date(data.publishedAt).toISOString(),
    readingTime: Number(data.readingTime || 1),
    featured: Boolean(data.featured),
    draft: Boolean(data.draft),
    content,
  }
}

export function getArticles(): Article[] {
  return readdirSync(articlesDirectory)
    .filter((filename) => filename.endsWith('.md'))
    .map(readArticle)
    .filter((article) => !article.draft && new Date(article.publishedAt) <= new Date())
    .sort((a, b) => +new Date(b.publishedAt) - +new Date(a.publishedAt))
}

export function getArticle(slug: string) {
  return getArticles().find((article) => article.slug === slug)
}

export function formatDate(value: string) {
  return new Intl.DateTimeFormat('en', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(value))
}
