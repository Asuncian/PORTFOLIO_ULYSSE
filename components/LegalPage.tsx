import Link from 'next/link'
import type { ReactNode } from 'react'

type Props = {
  title: string
  children: ReactNode
}

export default function LegalPage({ title, children }: Props) {
  return (
    <main className="legal-page">
      <div className="legal-page-inner">
        <Link href="/" className="legal-back">
          ← Retour au portfolio
        </Link>
        <h1 className="legal-title">{title}</h1>
        <article className="legal-prose">{children}</article>
      </div>
    </main>
  )
}
