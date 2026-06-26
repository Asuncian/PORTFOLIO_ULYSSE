import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import sharp from 'sharp'
import toIco from 'to-ico'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, '..')
const src = path.join(root, 'public/brand/icon-source.png')

// Fond bleu proche du bouton UGJ (évite les bandes noires ajoutées au redimensionnement)
const ICON_BG = { r: 65, g: 96, b: 160, alpha: 1 }

async function squarePng(size) {
  return sharp(src)
    .resize(size, size, { fit: 'contain', background: ICON_BG })
    .png()
    .toBuffer()
}

const tabSizes = [16, 32, 48]
const pngBuffers = await Promise.all(tabSizes.map(squarePng))
const ico = await toIco(pngBuffers)

fs.writeFileSync(path.join(root, 'app/favicon.ico'), ico)
fs.writeFileSync(path.join(root, 'public/favicon.ico'), ico)

for (const size of [16, 32, 48, 96, 192, 512]) {
  await squarePng(size).then((buf) =>
    fs.writeFileSync(path.join(root, `public/icon-${size}.png`), buf)
  )
}

await squarePng(32).then((buf) => fs.writeFileSync(path.join(root, 'app/icon.png'), buf))
await squarePng(180).then((buf) => fs.writeFileSync(path.join(root, 'app/apple-icon.png'), buf))
await squarePng(180).then((buf) => fs.writeFileSync(path.join(root, 'public/apple-touch-icon.png'), buf))

console.log('favicon.ico + icons regenerated from icon-source (contain, no crop)')
