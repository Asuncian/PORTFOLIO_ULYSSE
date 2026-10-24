import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, '..')

// Mêmes textes que lib/site.ts (SITE_NAME / SITE_ROLE), sans nouveau contenu.
const site = fs.readFileSync(path.join(root, 'lib/site.ts'), 'utf8')
const read = (name) => site.match(new RegExp(`${name} = '([^']+)'`))[1]
const [first, ...rest] = read('SITE_NAME').split(' ')
const last = rest.join(' ')
const role = read('SITE_ROLE').toUpperCase().replace('&', '&amp;')

/** Image de partage 1200x630 (LinkedIn, X, Facebook), aux couleurs du site. */
const W = 1200
const H = 630
const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
  <defs>
    <radialGradient id="glow" cx="50%" cy="38%" r="60%">
      <stop offset="0%" stop-color="#023495" stop-opacity=".55"/>
      <stop offset="60%" stop-color="#023495" stop-opacity=".12"/>
      <stop offset="100%" stop-color="#010108" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="last" x1="0" x2="1">
      <stop offset="0%" stop-color="#3a6fe0"/>
      <stop offset="100%" stop-color="#9fb9f0"/>
    </linearGradient>
  </defs>
  <rect width="100%" height="100%" fill="#010108"/>
  <rect width="100%" height="100%" fill="url(#glow)"/>
  <g font-family="Inter, 'Segoe UI', Arial, sans-serif" text-anchor="middle">
    <text x="600" y="268" font-size="104" font-weight="800" fill="#eef4ff">${first}</text>
    <text x="600" y="384" font-size="104" font-weight="800" fill="url(#last)">${last}</text>
    <text x="600" y="462" font-size="28" font-weight="600" letter-spacing="7" fill="#9fb9f0">${role}</text>
  </g>
  <rect x="540" y="510" width="120" height="6" rx="3" fill="#023495"/>
</svg>`

const out = path.join(root, 'public/og-image.png')
await sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toFile(out)
console.log(`og-image.png regenerated (${W}x${H})`)
