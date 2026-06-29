import Link from 'next/link'
import type { ReactNode } from 'react'

type Props = {
  tag: string
  title: ReactNode
  subtitle: string
  children: ReactNode
}

export function LegalBlock({ title, children }: { title: string; children: ReactNode }) {
  return (
    <article className="legal-item">
      <h2 className="legal-item-title">{title}</h2>
      <div className="legal-item-body">{children}</div>
    </article>
  )
}

export default function LegalPage({ tag, title, subtitle, children }: Props) {
  return (
    <section id="legal" className="legal-section">
      <div className="legal-wrap">
        <Link href="/" className="legal-back reveal btn-ghost">
          Retour au portfolio
        </Link>

        <div className="section-header reveal">
          <p className="section-tag">{tag}</p>
          <h1 className="section-title">{title}</h1>
          <p className="section-sub">{subtitle}</p>
        </div>

        <div className="legal-list motion-stagger">{children}</div>
      </div>
    </section>
  )
}
