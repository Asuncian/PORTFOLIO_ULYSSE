import { SITE_FAQ } from '@/lib/site'

export default function Faq() {
  return (
    <section id="faq">
      <div className="section-header">
        <p className="section-tag">Questions fréquentes</p>
        <h2 className="section-title">Questions <em>fréquentes</em></h2>
        <p className="section-sub">
          Avant qu&apos;on échange, voilà les questions qui reviennent le plus.
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
