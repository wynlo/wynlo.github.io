import { HeroGrid } from '@/components/hero-grid'
import { ArticleList } from '@/components/article-list'
import { FadeInArtwork, FadeInItem, FadeInSection } from '@/components/fade-in-section'
import { LinkedInIcon } from '@/components/brand-icons'
import { SectionLink } from '@/components/section-link'
import { RobotScene } from '@/components/robot-scene'
import { getArticles } from '@/lib/content'
import { ArrowDown, BookOpen } from 'lucide-react'
import Link from 'next/link'

const approaches = [
  {
    number: '01',
    title: 'Shape',
    variant: 'shape' as const,
    label: 'Robot pointing at a simple diagram on a drawing board',
    body: 'Find the right problem, examine the assumptions, and establish a clear product and brand direction from first principles.',
  },
  {
    number: '02',
    title: 'Build',
    variant: 'build' as const,
    label: 'Robot placing a block on top of a stack of blocks',
    body: 'Build the product, the systems behind it, and the brand around it through pragmatic engineering and focused delivery.',
  },
  {
    number: '03',
    title: 'Connect',
    variant: 'connect' as const,
    label: 'Robot joining two chain links together',
    body: 'Make the product’s value clear through a coherent brand and identity so people understand it, trust it, and remember it.',
  },
]

export default function Home() {
  const articles = getArticles()
  const email = process.env.NEXT_PUBLIC_EMAIL || ''
  const linkedinUrl = process.env.NEXT_PUBLIC_LINKEDIN_URL || ''

  return <>
    <section className="relative isolate overflow-hidden">
      <HeroGrid />
      <div className="container-page relative flex flex-col items-center pb-16 pt-16 text-center md:pb-20 md:pt-24">
        <RobotScene variant="hero" label="Robot waving and holding a tablet" className="mb-8 h-[150px] md:mb-10 md:h-[190px]" />
        <h1 className="display max-w-[780px] text-[clamp(2.65rem,4.8vw,4rem)]" style={{ lineHeight: 1.05 }}>Building products and brands that earn trust.</h1>
        <p className="mt-6 max-w-xl text-base leading-6 text-muted md:text-lg md:leading-7">I bring product thinking, engineering, and brand together to make ideas useful, clear, and memorable.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <SectionLink className="inline-flex items-center gap-2 rounded-md bg-ink px-4 py-2 text-[15px] font-medium text-paper transition-colors hover:bg-action-hover hover:text-paper" id="approach"><ArrowDown className="-translate-y-px" aria-hidden="true" size={16} />How I work</SectionLink>
          <Link className="inline-flex items-center gap-2 rounded-md bg-surface-strong px-4 py-2 text-[15px] font-medium text-ink transition-colors hover:bg-surface-hover" href="/writing"><BookOpen className="-translate-y-px" aria-hidden="true" size={16} />Read my writing</Link>
        </div>
      </div>
    </section>

    <FadeInSection id="approach" className="relative isolate scroll-mt-20 overflow-hidden md:scroll-mt-24">
      <div className="container-page relative z-10 py-20 md:py-24">
        <FadeInItem><p className="eyebrow text-muted">How I work</p></FadeInItem>
        <FadeInItem order={1}><h2 className="mt-4 max-w-[720px] text-3xl leading-[1.1] md:text-5xl">From complexity to clarity.</h2></FadeInItem>
        <div className="mt-12 grid gap-5 md:mt-14 md:grid-cols-3 lg:gap-6">
          {approaches.map((approach, index) => <FadeInItem key={approach.title} order={index + 2}>
            <article className="card flex h-full flex-col p-6 transition-transform duration-200 ease-out hover:-translate-y-1 motion-reduce:transition-none motion-reduce:hover:translate-y-0">
              <div className="flex h-28 items-end">
                <RobotScene variant={approach.variant} label={approach.label} className="h-full max-w-full" />
              </div>
              <div className="mt-8">
                <p className="eyebrow tabular text-muted">Step {approach.number}</p>
                <h3 className="mt-3 text-2xl">{approach.title}</h3>
                <p className="mt-3 text-base leading-6 text-muted">{approach.body}</p>
              </div>
            </article>
          </FadeInItem>)}
        </div>
      </div>
    </FadeInSection>

    <FadeInSection id="about" className="relative isolate scroll-mt-20 overflow-hidden md:scroll-mt-24">
      <div className="container-page relative z-10 grid gap-12 py-20 md:grid-cols-[1.05fr_.95fr] md:items-center md:gap-16 md:py-24">
        <div className="md:py-8">
          <FadeInItem><p className="eyebrow text-muted">Product + brand builder</p></FadeInItem>
          <FadeInItem order={1}><h2 className="mt-6 max-w-[720px] text-3xl leading-[1.1] md:text-5xl">I work where technology, product, brand, and people meet.</h2></FadeInItem>
          <FadeInItem order={2}><p className="mt-7 max-w-xl text-base leading-6 text-muted">I enjoy turning ambiguity into clear decisions, building the product and systems that follow, and shaping a brand people can understand and remember.</p></FadeInItem>
          <FadeInItem order={3}><p className="mt-5 max-w-xl text-base leading-6 text-muted">Strong products need more than sound engineering. They must solve the right problem, express a distinct point of view, and earn the trust of the people who use them.</p></FadeInItem>
        </div>
        <FadeInArtwork className="order-first flex md:order-none md:justify-center" order={1}>
          <RobotScene variant="idea" label="Robot holding a light bulb above its head" className="h-[220px] md:h-[360px]" />
        </FadeInArtwork>
      </div>
    </FadeInSection>

    {articles.length > 0 && <FadeInSection className="bg-surface">
      <div className="container-page py-20 md:py-24">
        <FadeInItem><div className="mb-10 flex flex-col items-start gap-7 lg:flex-row lg:items-end lg:justify-between"><div><p className="eyebrow text-muted">Writing</p><h2 className="mt-5 text-3xl md:text-5xl">Notes on building products, technology, and brands.</h2></div><div className="w-full lg:w-auto"><Link className="text-link shrink-0" href="/writing">View all <span>→</span></Link></div></div></FadeInItem>
        <FadeInItem order={1}><ArticleList items={articles.slice(0, 4)} featured /></FadeInItem>
      </div>
    </FadeInSection>}

    <FadeInSection id="contact" className="relative overflow-hidden text-ink">
      <div className="container-page relative z-10 grid gap-10 py-20 md:grid-cols-[.5fr_1.5fr] md:items-center md:gap-12 md:py-24">
        <FadeInItem className="flex md:justify-center"><RobotScene variant="contact" label="Robot waving and holding an envelope" className="h-[150px] md:h-[220px]" /></FadeInItem>
        <div><FadeInItem order={1}><h2 className="max-w-[720px] text-4xl leading-[1.05] md:text-6xl">Have something interesting in mind?</h2></FadeInItem><FadeInItem order={2}><p className="mt-7 max-w-xl text-base leading-6 text-muted">I’m always open to thoughtful conversations about technology, products, brands, and problems worth solving.</p></FadeInItem><FadeInItem order={3}><div className="mt-9 flex flex-wrap gap-x-8 gap-y-4">{email && <a className="border-b border-ink pb-1 text-sm" href={`mailto:${email}`}>{email} →</a>}{linkedinUrl && <a className="inline-flex items-center gap-2 border-b border-rule pb-1 text-sm transition-colors hover:border-ink" href={linkedinUrl} target="_blank" rel="noreferrer"><LinkedInIcon className="-translate-y-px" size={16} />LinkedIn ↗</a>}</div></FadeInItem></div>
      </div>
    </FadeInSection>
  </>
}
