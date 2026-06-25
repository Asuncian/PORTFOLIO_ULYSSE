import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
  preload: true,
  fallback: ['system-ui', 'Segoe UI', 'sans-serif'],
})

export const metadata: Metadata = {
  title: 'Ulysse Goming Jobert — Développement web & automatisation',
  description: 'Sites, formulaires, chatbots et automatisations pour l\'hôtellerie, la restauration et les artisans. Des systèmes sobres et fiables.',
  keywords: 'développement web, automatisation, hôtellerie, restauration, artisans, React, Next.js, n8n',
  authors: [{ name: 'Ulysse Goming Jobert' }],
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Ulysse Goming Jobert — Développement web & automatisation',
    description: 'Sites rapides et automatisations sur mesure pour l\'hôtellerie, la restauration et les artisans.',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // The font CSS variable must live on <html> so that `--font` (declared in
    // :root) can resolve `var(--font-inter)`. On <body> it stayed out of :root's
    // scope, `--font` collapsed to an invalid value and the page fell back to
    // the serif default (Times New Roman).
    <html lang="fr" className={inter.variable}>
      <head>
        {/* next/font self-hosts Inter at build time — no Google Fonts requests,
            so no preconnect needed. */}
        <meta name="theme-color" content="#010108" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>{children}</body>
    </html>
  )
}
