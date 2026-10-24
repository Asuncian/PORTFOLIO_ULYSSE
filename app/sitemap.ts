import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/site'

// No lastModified: a build timestamp changes on every deploy, so Google learns to ignore it.
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: SITE_URL,
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${SITE_URL}/mentions-legales`,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${SITE_URL}/politique-confidentialite`,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ]
}
