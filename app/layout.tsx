import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import JsonLd from '@/components/JsonLd'
import { SEO_KEYWORDS, SITE_NAME, SITE_URL } from '@/lib/site'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
  preload: true,
  fallback: ['system-ui', 'Segoe UI', 'sans-serif'],
})

const description =
  'Ulysse Goming-Jobert, développeur web et automatisation dans le Var. Sites vitrines, workflows n8n, CRM sur mesure, Next.js/React et déploiement Docker — du besoin terrain à la mise en ligne.'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} | Développeur web & automatisation (Var)`,
    template: `%s | ${SITE_NAME}`,
  },
  description,
  keywords: [...SEO_KEYWORDS],
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: SITE_URL,
    siteName: SITE_NAME,
    title: `${SITE_NAME} | Développeur web & automatisation`,
    description,
  },
  twitter: {
    card: 'summary_large_image',
    title: `${SITE_NAME} | Développeur web & automatisation`,
    description,
  },
  category: 'technology',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={inter.variable}>
      <head>
        <meta name="theme-color" content="#010108" />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta name="geo.region" content="FR-83" />
        <meta name="geo.placename" content="Var, Provence-Alpes-Côte d'Azur" />
      </head>
      <body>
        <JsonLd />
        {children}
      </body>
    </html>
  )
}
