import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import sharp from 'sharp'
import toIco from 'to-ico'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, '..')
const src = path.join(root, 'public/brand/icon-source.png')

const ICON_BG = { r: 65, g: 96, b: 160, alpha: 1 }

function isLogoPixel(r, g, b, a) {
  if (a < 20) return false
  if (b > 95 && b > r + 15 && g < 170) return true
  if (r > 140 && g > 160 && b > 200) return true
  return false
}

async function croppedSource() {
  const { data, info } = await sharp(src).ensureAlpha().raw().toBuffer({ resolveWithObject: true })
  const { width, height, channels } = info

  const rowCount = new Array(height).fill(0)
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * channels
      if (isLogoPixel(data[i], data[i + 1], data[i + 2], data[i + 3])) rowCount[y]++
    }
  }

  let bestStart = 0
  let bestLen = 0
  let curStart = 0
  let curLen = 0
  const rowThreshold = 120

  for (let y = 0; y < height; y++) {
    if (rowCount[y] > rowThreshold) {
      if (curLen === 0) curStart = y
      curLen++
    } else if (curLen > bestLen) {
      bestLen = curLen
      bestStart = curStart
      curLen = 0
    } else {
      curLen = 0
    }
  }
  if (curLen > bestLen) {
    bestLen = curLen
    bestStart = curStart
  }

  const top = bestStart
  const bottom = bestStart + bestLen - 1

  let minX = width
  let maxX = 0
  for (let y = top; y <= bottom; y++) {
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * channels
      if (isLogoPixel(data[i], data[i + 1], data[i + 2], data[i + 3])) {
        if (x < minX) minX = x
        if (x > maxX) maxX = x
      }
    }
  }

  const pad = Math.max(2, Math.round(Math.max(maxX - minX + 1, bottom - top + 1) * 0.02))
  const left = Math.max(0, minX - pad)
  const extractTop = Math.max(0, top - pad)
  const right = Math.min(width - 1, maxX + pad)
  const extractBottom = Math.min(height - 1, bottom + pad)

  return sharp(src).extract({
    left,
    top: extractTop,
    width: right - left + 1,
    height: extractBottom - extractTop + 1,
  })
}

async function logoOnBlue(pipeline) {
  const { data, info } = await pipeline.ensureAlpha().raw().toBuffer({ resolveWithObject: true })
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i]
    const g = data[i + 1]
    const b = data[i + 2]
    const lum = (r + g + b) / 3
    if (lum < 40 || data[i + 3] < 20) data[i + 3] = 0
  }
  return sharp(data, { raw: info })
}

async function squarePng(pipeline, size) {
  const cleaned = await logoOnBlue(pipeline)
  const meta = await cleaned.metadata()
  const scaledH = Math.max(1, Math.round((meta.height / meta.width) * size))
  const logo = await cleaned.resize(size, scaledH, { fit: 'fill' }).png().toBuffer()
  const top = Math.floor((size - scaledH) / 2)

  return sharp({
    create: {
      width: size,
      height: size,
      channels: 4,
      background: ICON_BG,
    },
  })
    .composite([{ input: logo, top, left: 0 }])
    .png()
    .toBuffer()
}

const base = await croppedSource()

const tabSizes = [16, 32, 48]
const pngBuffers = await Promise.all(tabSizes.map((size) => squarePng(base, size)))
const ico = await toIco(pngBuffers)

fs.writeFileSync(path.join(root, 'app/favicon.ico'), ico)
fs.writeFileSync(path.join(root, 'public/favicon.ico'), ico)

for (const size of [16, 32, 48, 96, 192, 512]) {
  await squarePng(base, size).then((buf) =>
    fs.writeFileSync(path.join(root, `public/icon-${size}.png`), buf)
  )
}

await squarePng(base, 32).then((buf) => fs.writeFileSync(path.join(root, 'app/icon.png'), buf))
await squarePng(base, 180).then((buf) => fs.writeFileSync(path.join(root, 'app/apple-icon.png'), buf))
await squarePng(base, 180).then((buf) => fs.writeFileSync(path.join(root, 'public/apple-touch-icon.png'), buf))

console.log('favicon.ico + icons regenerated (no black bands)')
