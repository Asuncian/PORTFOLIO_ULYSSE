import type { Metadata } from 'next'
import Link from 'next/link'
import LegalPage, { LegalBlock } from '@/components/LegalPage'
import LegalShell from '@/components/LegalShell'
import {
  LEGAL_DOMAIN,
  LEGAL_EMAIL,
  LEGAL_HOST,
  LEGAL_PHONE,
  LEGAL_PUBLISHER,
  LEGAL_REGION,
  LEGAL_SITE_URL,
} from '@/lib/legal'

export const metadata: Metadata = {
  title: 'Mentions légales',
  description: 'Informations légales du portfolio Ulysse Goming-Jobert.',
  alternates: { canonical: '/mentions-legales' },
  robots: { index: true, follow: true },
}

export default function MentionsLegalesPage() {
  return (
    <LegalShell>
      <LegalPage
        tag="Informations"
        title={<>Les mentions <em>légales</em></>}
        subtitle="Les infos obligatoires sur ce site, sans jargon inutile."
      >
        <LegalBlock title="Qui édite ce site ?">
          <p>
            <strong>{LEGAL_PUBLISHER}</strong>, développeur web et automatisation en {LEGAL_REGION}.
          </p>
          <p>
            Email : <a href={`mailto:${LEGAL_EMAIL}`}>{LEGAL_EMAIL}</a>
            <br />
            Téléphone : <a href="tel:+33645003007">{LEGAL_PHONE}</a>
          </p>
        </LegalBlock>

        <LegalBlock title="Directeur de la publication">
          <p>{LEGAL_PUBLISHER}</p>
        </LegalBlock>

        <LegalBlock title="Nom de domaine">
          <p>
            Le domaine est géré chez {LEGAL_DOMAIN.registrar}, {LEGAL_DOMAIN.address}.
          </p>
        </LegalBlock>

        <LegalBlock title="Hébergement">
          <p>
            Le site tourne sur un {LEGAL_HOST.server.toLowerCase()}.
          </p>
          <p>
            Hébergeur : {LEGAL_HOST.name}, {LEGAL_HOST.address}.
          </p>
        </LegalBlock>

        <LegalBlock title="Propriété intellectuelle">
          <p>
            Les textes, visuels, code et identité graphique de ce portfolio appartiennent à{' '}
            {LEGAL_PUBLISHER}, sauf mention contraire. Merci de ne rien copier sans mon accord écrit
            au préalable.
          </p>
        </LegalBlock>

        <LegalBlock title="Données personnelles">
          <p>
            Pour savoir comment je traite vos données quand vous m&apos;écrivez, consultez la{' '}
            <Link href="/politique-confidentialite">politique de confidentialité</Link>.
          </p>
        </LegalBlock>

        <LegalBlock title="Une question ?">
          <p>
            Pour toute demande liée au site :{' '}
            <a href={`mailto:${LEGAL_EMAIL}`}>{LEGAL_EMAIL}</a>
          </p>
          <p className="legal-muted">{LEGAL_SITE_URL}</p>
        </LegalBlock>
      </LegalPage>
    </LegalShell>
  )
}
