import { ArticleList } from '@/components/article-list'
import { BlueprintBackground } from '@/components/blueprint-background'
import { FadeInArtwork, FadeInItem, FadeInSection } from '@/components/fade-in-section'
import { LinkedInIcon } from '@/components/brand-icons'
import { ParticleWave } from '@/components/particle-wave'
import { VoxelScene } from '@/components/voxel-scene'
import { getArticles } from '@/lib/content'
import { ArrowDown, BookOpen, DraftingCompass, PanelsTopLeft, Waypoints } from 'lucide-react'
import Link from 'next/link'

const approaches = [
  {
    number: '01',
    title: 'Shape',
    icon: DraftingCompass,
    body: 'Find the right problem, understand what matters, and establish a clear direction before complexity takes over.',
  },
  {
    number: '02',
    title: 'Build',
    icon: PanelsTopLeft,
    body: 'Design resilient systems and turn them into working software through pragmatic engineering and focused delivery.',
  },
  {
    number: '03',
    title: 'Connect',
    icon: Waypoints,
    body: 'Make complex ideas clear so people can understand the choices, see the value, and move forward with confidence.',
  },
]

export default function Home() {
  const articles = getArticles()
  const email = process.env.NEXT_PUBLIC_EMAIL || ''
  const linkedinUrl = process.env.NEXT_PUBLIC_LINKEDIN_URL || ''

  return <>
    <section className="relative overflow-hidden">
      <BlueprintBackground />
      <div className="container-page relative grid min-h-[calc(100svh-5rem)] items-center gap-10 py-10 md:min-h-[760px] md:grid-cols-[1fr_.9fr] md:gap-20 md:py-16">
      <div className="order-2 md:order-1">
        <h1 className="display max-w-[780px] text-[clamp(2.65rem,4.8vw,4.75rem)]" style={{ lineHeight: 1.12 }}>Building technology that earns trust.</h1>
        <p className="mt-8 max-w-xl text-base leading-7 text-muted md:text-lg md:leading-8">I design and build software that’s useful, clear, and memorable.</p>
        <div className="mt-9 flex flex-wrap gap-4">
          <a className="inline-flex items-center gap-2 bg-ink px-6 py-3.5 text-sm text-paper transition-[color,background-color,border-color,transform] hover:-translate-y-0.5 hover:bg-action-hover hover:text-paper" href="#approach"><ArrowDown className="-translate-y-px" aria-hidden="true" size={16} />How I work</a>
          <Link className="inline-flex items-center gap-2 border border-ink px-6 py-3.5 text-sm text-ink transition-[color,background-color,border-color,transform] hover:-translate-y-0.5 hover:bg-ink hover:text-paper" href="/writing"><BookOpen className="-translate-y-px" aria-hidden="true" size={16} />Read my writing</Link>
        </div>
      </div>
      <div className="order-1 h-[46svh] min-h-[360px] overflow-hidden md:order-2 md:h-[72vh] md:max-h-[780px]">
        <VoxelScene variant="pixel-robot" label="Cute voxel robot with a monitor head, smiling pixel face, antenna, articulated arms, and broad feet, rendered in 3D" className="h-full w-full" />
      </div>
      </div>
    </section>

    <FadeInSection id="approach" className="relative isolate overflow-hidden border-y border-rule">
      <div className="container-page relative z-10 py-24 md:py-36">
        <FadeInItem><p className="eyebrow text-muted">How I work</p></FadeInItem>
        <FadeInItem order={1}><h2 className="mt-6 max-w-3xl text-3xl leading-[1.1] tracking-[-.02em] md:text-5xl">From complexity to clarity.</h2></FadeInItem>
        <div className="mt-16 grid border-l border-t border-rule md:mt-20 md:grid-cols-3">
          {approaches.map((approach, index) => <FadeInItem key={approach.title} order={index + 2} className="border-b border-r border-rule p-7 md:min-h-72 md:p-9">
            <p className="eyebrow text-muted">{approach.number}</p>
            <approach.icon className="mt-10 text-muted" aria-hidden="true" strokeWidth={1.5} size={27} />
            <h3 className="mt-5 text-3xl tracking-[-.03em]">{approach.title}</h3>
            <p className="mt-5 max-w-sm text-base leading-7 text-muted">{approach.body}</p>
          </FadeInItem>)}
        </div>
      </div>
    </FadeInSection>

    <FadeInSection id="about" className="relative isolate overflow-hidden border-y border-rule bg-surface">
      <div className="container-page relative z-10 grid gap-12 py-20 md:grid-cols-[1.05fr_.95fr] md:items-center md:gap-20 md:py-28">
        <div className="md:py-8">
          <FadeInItem><p className="eyebrow text-muted">Working style</p></FadeInItem>
          <FadeInItem order={1}><h2 className="mt-6 max-w-3xl text-3xl leading-[1.1] tracking-[-.02em] md:text-5xl">I work where technology, product, and people meet.</h2></FadeInItem>
          <FadeInItem order={2}><p className="mt-7 max-w-xl text-base leading-7 text-muted">I enjoy turning ambiguity into clear decisions, building what follows, and helping others understand why it matters.</p></FadeInItem>
          <FadeInItem order={3}><p className="mt-5 max-w-xl text-base leading-7 text-muted">Successful software needs more than sound engineering. It must solve the right problem, express its value clearly, and earn the trust of the people who use it.</p></FadeInItem>
        </div>
        <FadeInArtwork className="mobile-portrait-artwork order-first aspect-[4/3] min-h-[320px] overflow-hidden md:order-none md:min-h-0" order={1}>
          <VoxelScene variant="light-bulb" label="Voxel light bulb with a rounded glass shape and stepped screw base, rendered in 3D" className="h-full w-full -translate-x-4 md:translate-x-0" />
        </FadeInArtwork>
      </div>
    </FadeInSection>

    {articles.length > 0 && <FadeInSection className="border-y border-rule bg-surface">
      <div className="container-page py-24 md:py-32">
        <FadeInItem><div className="mb-14 flex flex-col items-start gap-7 lg:flex-row lg:items-end lg:justify-between"><div><p className="eyebrow text-muted">Writing</p><h2 className="mt-5 text-3xl tracking-[-.02em] md:text-5xl">Notes on building and explaining technology.</h2></div><div className="w-full lg:w-auto"><Link className="text-link shrink-0" href="/writing">View all <span>→</span></Link></div></div></FadeInItem>
        <FadeInItem order={1}><ArticleList items={articles.slice(0, 4)} featured /></FadeInItem>
      </div>
    </FadeInSection>}

    <FadeInSection id="contact" className="relative overflow-hidden bg-graphite text-white">
      <ParticleWave />
      <div className="container-page relative z-10 grid gap-12 py-24 md:grid-cols-[.75fr_1.25fr] md:py-36">
        <FadeInItem><p className="eyebrow text-white/55">Contact</p></FadeInItem>
        <div><FadeInItem order={1}><h2 className="max-w-4xl text-4xl leading-[1.05] tracking-[-.025em] md:text-6xl">Working through a complex technical problem?</h2></FadeInItem><FadeInItem order={2}><p className="mt-7 max-w-xl text-base leading-7 text-white/60">I’m always interested in conversations about architecture, engineering, product strategy, and building technology people understand, trust, and adopt.</p></FadeInItem><FadeInItem order={3}><div className="mt-9 flex flex-wrap gap-x-8 gap-y-4">{email && <a className="border-b border-white pb-1 text-sm" href={`mailto:${email}`}>{email} →</a>}{linkedinUrl && <a className="inline-flex items-center gap-2 border-b border-white/40 pb-1 text-sm transition-colors hover:border-white" href={linkedinUrl} target="_blank" rel="noreferrer"><LinkedInIcon className="-translate-y-px" size={16} />LinkedIn ↗</a>}</div></FadeInItem></div>
      </div>
    </FadeInSection>
  </>
}
