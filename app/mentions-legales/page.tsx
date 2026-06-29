import type { Metadata } from 'next'
import LegalPage from '@/components/LegalPage'
import {
  LEGAL_DOMAIN,
  LEGAL_EMAIL,
  LEGAL_HOST,
  LEGAL_PHONE,
  LEGAL_PUBLISHER,
  LEGAL_REGION,
  LEGAL_SITE_URL,
} from '@/lib/legal'
import { SITE_URL } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Mentions légales',
  description: 'Mentions légales du portfolio Ulysse Goming-Jobert.',
  alternates: { canonical: '/mentions-legales' },
  robots: { index: true, follow: true },
}

export default function MentionsLegalesPage() {
  return (
    <LegalPage title="Mentions légales">
      <section>
        <h2>Éditeur du site</h2>
        <p>
          <strong>{LEGAL_PUBLISHER}</strong>
          <br />
          Développeur web &amp; automatisation — {LEGAL_REGION}, France
          <br />
          Email : <a href={`mailto:${LEGAL_EMAIL}`}>{LEGAL_EMAIL}</a>
          <br />
          Téléphone : <a href="tel:+33645003007">{LEGAL_PHONE}</a>
        </p>
      </section>

      <section>
        <h2>Directeur de la publication</h2>
        <p>{LEGAL_PUBLISHER}</p>
      </section>

      <section>
        <h2>Nom de domaine</h2>
        <p>
          Registrar : {LEGAL_DOMAIN.registrar}
          <br />
          {LEGAL_DOMAIN.address}
        </p>
      </section>

      <section>
        <h2>Hébergement</h2>
        <p>
          {LEGAL_HOST.server}.
          <br />
          Hébergeur : {LEGAL_HOST.name}
          <br />
          {LEGAL_HOST.address}
        </p>
      </section>

      <section>
        <h2>Propriété intellectuelle</h2>
        <p>
          L&apos;ensemble du contenu de ce site (textes, visuels, code, identité graphique) est la
          propriété de {LEGAL_PUBLISHER}, sauf mention contraire. Toute reproduction sans autorisation
          écrite préalable est interdite.
        </p>
      </section>

      <section>
        <h2>Données personnelles</h2>
        <p>
          Les traitements de données personnelles sont décrits dans la{' '}
          <a href="/politique-confidentialite">politique de confidentialité</a>.
        </p>
      </section>

      <section>
        <h2>Contact</h2>
        <p>
          Pour toute question relative au site :{' '}
          <a href={`mailto:${LEGAL_EMAIL}`}>{LEGAL_EMAIL}</a>
        </p>
        <p className="legal-muted">Site : {LEGAL_SITE_URL || SITE_URL}</p>
      </section>
    </LegalPage>
  )
}
