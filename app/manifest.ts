import type { MetadataRoute } from 'next'
import { SITE_NAME, SITE_TITLE } from '@/lib/site'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE_TITLE,
    short_name: 'UGJ',
    description: SITE_NAME,
    start_url: '/',
    display: 'standalone',
    background_color: '#010108',
    theme_color: '#010108',
    icons: [
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
    ],
  }
}
