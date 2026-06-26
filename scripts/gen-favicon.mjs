import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import sharp from 'sharp'
import toIco from 'to-ico'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, '..')
const src = path.join(root, 'public/brand/icon-source.png')
const bg = { r: 1, g: 1, b: 8, alpha: 1 }

async function squarePng(size) {
  return sharp(src)
    .resize(size, size, { fit: 'contain', background: bg })
    .png()
    .toBuffer()
}

const tabSizes = [16, 32, 48]
const pngBuffers = await Promise.all(tabSizes.map(squarePng))
const ico = await toIco(pngBuffers)

fs.writeFileSync(path.join(root, 'app/favicon.ico'), ico)
fs.writeFileSync(path.join(root, 'public/favicon.ico'), ico)

for (const size of [16, 32, 48, 96, 192, 512]) {
  await sharp(src)
    .resize(size, size, { fit: 'contain', background: bg })
    .png()
    .toFile(path.join(root, `public/icon-${size}.png`))
}

await sharp(src)
  .resize(32, 32, { fit: 'contain', background: bg })
  .png()
  .toFile(path.join(root, 'app/icon.png'))

await sharp(src)
  .resize(180, 180, { fit: 'contain', background: bg })
  .png()
  .toFile(path.join(root, 'app/apple-icon.png'))

await sharp(src)
  .resize(180, 180, { fit: 'contain', background: bg })
  .png()
  .toFile(path.join(root, 'public/apple-touch-icon.png'))

console.log('favicon.ico + icons generated')
