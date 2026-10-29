// Copies approved ukiyo art into public/ as alpha masks.
// Each mask is trimmed to its drawing, padded, and its strokes are made thicker,
// so the lines stay visible at the sizes the site uses.
// Usage: node scripts/export-art.mjs
import sharp from 'sharp'

const generated = 'art/generated'

// thicken: extra stroke on each side, as a fraction of the longest side.
const masks = [
  { src: 'robot-logo/cut/helmet-curl.png', out: 'public/robot-logo-helmet.png', square: 512, thicken: 0.012 },
  ...['hero', 'shape', 'build', 'connect', 'idea', 'contact'].map((name) => ({
    src: `scene-${name}/final/scene-${name}.png`, out: `public/illustrations/robot-${name}.png`, thicken: 0.006,
  })),
]

const favicon = { src: 'favicon-robot/cut/favicon-robot.png', square: 256 }

async function alphaMask({ src, square, thicken }) {
  const trimmed = await sharp(`${generated}/${src}`).ensureAlpha().extractChannel('alpha').trim({ threshold: 1 }).toBuffer({ resolveWithObject: true })
  const { width, height } = trimmed.info
  const longest = Math.max(width, height)
  const pad = Math.round(longest * 0.04)
  let alpha = await sharp(trimmed.data).extend({ top: pad, bottom: pad, left: pad, right: pad, background: 'black' }).toBuffer()
  if (thicken) {
    // Blur, then keep every pixel above 10%: this grows each shape by about 1.28 sigma.
    const sigma = (longest * thicken) / 1.28
    alpha = await sharp(alpha).blur(sigma).threshold(26).blur(0.6).toBuffer()
  }
  let image = sharp(alpha)
  if (square) {
    const fit = Math.round(square * 0.94)
    const resized = await image.resize(fit, fit, { fit: 'inside' }).toBuffer()
    image = sharp({ create: { width: square, height: square, channels: 3, background: 'black' } }).composite([{ input: resized, gravity: 'center' }])
  }
  return image.toColourspace('b-w').raw().toBuffer({ resolveWithObject: true })
}

async function write(mask, color, out) {
  const { data, info } = mask
  await sharp({ create: { width: info.width, height: info.height, channels: 3, background: color } })
    .joinChannel(data, { raw: { width: info.width, height: info.height, channels: 1 } })
    .png().toFile(out)
  console.log(`${out} ${info.width}x${info.height} aspect ${(info.width / info.height).toFixed(4)}`)
}

for (const entry of masks) await write(await alphaMask(entry), '#ffffff', entry.out)

const faviconMask = await alphaMask(favicon)
await write(faviconMask, '#1a1a1a', 'public/favicon-light.png')
await write(faviconMask, '#ffffff', 'public/favicon-dark.png')
