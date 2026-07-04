import { SITE_FAQ } from '@/lib/site'

export default function Faq() {
  return (
    <section id="faq">
      <div className="section-header">
        <p className="section-tag">Questions fréquentes</p>
        <h2 className="section-title">Questions <em>fréquentes</em></h2>
        <p className="section-sub">
          Ce qu&apos;on me demande souvent avant un premier échange.
        </p>
      </div>

      <div className="faq-list motion-stagger">
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
