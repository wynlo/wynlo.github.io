import { VoxelScene } from '@/components/voxel-scene'
import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Potatoheads',
  description: 'An independent studio exploring software, products, and distinctive brands.',
}

export default function StudioPage() {
  return <main className="relative overflow-hidden border-b border-rule">
    <div className="container-page grid min-h-[calc(100svh-5rem)] items-center gap-8 py-12 md:min-h-[720px] md:grid-cols-[1fr_.9fr] md:gap-20 md:py-20">
      <div className="order-2 md:order-1">
        <p className="eyebrow text-muted">Independent studio</p>
        <h1 className="display mt-7 text-[clamp(3rem,6vw,5.75rem)]">Potatoheads</h1>
        <p className="mt-7 max-w-lg text-lg leading-8 text-muted">An independent studio exploring software, products, and distinctive brands.</p>
        <p className="mt-9 text-sm font-medium uppercase tracking-[.12em]">Coming soon</p>
        <Link className="text-link mt-12" href="/">Back to wayneloh.dev <span>→</span></Link>
      </div>
      <div className="order-1 h-[46svh] min-h-[340px] overflow-hidden md:order-2 md:h-[68vh] md:max-h-[720px]">
        <VoxelScene variant="potato" label="Irregular voxel potato with a small sprout, two stubby legs, and a pixel face, rendered in 3D" className="h-full w-full" />
      </div>
    </div>
  </main>
}
