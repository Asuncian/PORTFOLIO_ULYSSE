import { SITE_FAQ } from '@/lib/site'

export default function Faq() {
  return (
    <section id="faq">
      <div className="section-header reveal">
        <p className="section-tag">Questions fréquentes</p>
        <h2 className="section-title">Vous vous <em>reconnaissez ?</em></h2>
        <p className="section-sub">
          Artisans et PME : les questions qu&apos;on me pose avant un site ou une automatisation.
        </p>
      </div>

      <div className="faq-list reveal-grid">
        {SITE_FAQ.map(({ question, answer }) => (
          <details key={question} className="faq-item">
            <summary>{question}</summary>
            <p>{answer}</p>
          </details>
        ))}
      </div>
    </section>
  )
}
