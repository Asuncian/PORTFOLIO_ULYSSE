import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import JsonLd from '@/components/JsonLd'
import {
  SEO_KEYWORDS,
  SITE_DESCRIPTION,
  SITE_GEO_REGION,
  SITE_NAME,
  SITE_REGION,
  SITE_TITLE,
  SITE_URL,
} from '@/lib/site'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
  preload: true,
  fallback: ['system-ui', 'Segoe UI', 'sans-serif'],
})

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_TITLE,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  keywords: [...SEO_KEYWORDS],
  applicationName: SITE_NAME,
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  alternates: {
    canonical: '/',
    languages: { 'fr-FR': '/' },
  },
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: SITE_URL,
    siteName: SITE_NAME,
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },
  category: 'technology',
  other: {
    'geo.region': SITE_GEO_REGION,
    'geo.placename': SITE_REGION,
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={inter.variable}>
      <head>
        <meta name="theme-color" content="#010108" />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
      </head>
      <body>
        <JsonLd />
        {children}
      </body>
    </html>
  )
}
