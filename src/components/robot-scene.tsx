// Width-to-height ratio of each PNG that scripts/export-art.mjs writes to public/illustrations. Set the height with className.
const aspects = { hero: 558 / 601, shape: 892 / 599, build: 627 / 574, connect: 521 / 594, idea: 589 / 1075, contact: 935 / 1053 }

// Offsets the loops so the two waving robots do not move in sync.
const delays: Record<keyof typeof aspects, string> = { hero: '0s', shape: '-1.2s', build: '-2.4s', connect: '-3.6s', idea: '-0.6s', contact: '-1.8s' }

// Left and right edge of the drawing's bottom row, as a fraction of the image width. The shadow spans this range plus 12% on each side.
const bases: Record<keyof typeof aspects, [number, number]> = {
  hero: [0.25, 0.73], shape: [0.12, 0.87], build: [0.14, 0.93], connect: [0.19, 0.69], idea: [0.25, 0.81], contact: [0.2, 0.64],
}

// The approach cards sit on a surface of their own, so only the standalone scenes get a shadow.
const shadowed = new Set<keyof typeof aspects>(['hero', 'idea', 'contact'])

export type RobotSceneVariant = keyof typeof aspects

export function RobotScene({ variant, label, className = '' }: { variant: RobotSceneVariant; label: string; className?: string }) {
  const image = `url(${process.env.NEXT_PUBLIC_BASE_PATH || ''}/illustrations/robot-${variant}.png)`
  const [left, right] = bases[variant]
  return <div role="img" aria-label={label} className={`relative shrink-0 ${className}`} style={{ aspectRatio: aspects[variant] }}>
    {shadowed.has(variant) && <div
      aria-hidden
      className={`robot-shadow robot-shadow-${variant}`}
      style={{ left: `${(left - 0.12) * 100}%`, right: `${(1 - right - 0.12) * 100}%`, animationDelay: delays[variant] }}
    />}
    <div
      aria-hidden
      className={`robot-float robot-${variant} absolute inset-0 bg-ink`}
      style={{
        animationDelay: delays[variant],
        WebkitMaskImage: image, WebkitMaskSize: 'contain', WebkitMaskRepeat: 'no-repeat', WebkitMaskPosition: 'center',
        maskImage: image, maskSize: 'contain', maskRepeat: 'no-repeat', maskPosition: 'center',
      }}
    />
  </div>
}
