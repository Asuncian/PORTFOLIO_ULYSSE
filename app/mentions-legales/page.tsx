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
  LEGAL_ROLE,
  LEGAL_SITE_URL,
} from '@/lib/legal'

export const metadata: Metadata = {
  title: 'Mentions légales',
  description: 'Mentions légales de mon portfolio.',
  alternates: { canonical: '/mentions-legales' },
  robots: { index: true, follow: true },
}

export default function MentionsLegalesPage() {
  return (
    <LegalShell>
      <LegalPage
        tag="Informations"
        title={<>Les mentions <em>légales</em></>}
        subtitle="Mon portfolio, où il est hébergé, et comment me joindre si vous avez une question."
      >
        <LegalBlock title="Qui est derrière ce site ?">
          <p>
            Je suis {LEGAL_PUBLISHER}, {LEGAL_ROLE.toLowerCase()} en {LEGAL_REGION}.
          </p>
          <p>
            Vous pouvez me joindre par email à{' '}
            <a href={`mailto:${LEGAL_EMAIL}`}>{LEGAL_EMAIL}</a> ou au{' '}
            <a href="tel:+33645003007">{LEGAL_PHONE}</a>.
          </p>
        </LegalBlock>

        <LegalBlock title="Responsable de la publication">
          <p>Je suis responsable de la publication de mon portfolio.</p>
        </LegalBlock>

        <LegalBlock title="Le nom de domaine">
          <p>
            J&apos;ai enregistré le domaine chez {LEGAL_DOMAIN.registrar}, {LEGAL_DOMAIN.address}.
          </p>
        </LegalBlock>

        <LegalBlock title="L&apos;hébergement">
          <p>
            Je déploie mon portfolio sur un {LEGAL_HOST.server.toLowerCase()}.
          </p>
          <p>
            L&apos;infrastructure est chez {LEGAL_HOST.name}, {LEGAL_HOST.address}.
          </p>
        </LegalBlock>

        <LegalBlock title="Le contenu du site">
          <p>
            Les textes, visuels, code et identité graphique de mon portfolio m&apos;appartiennent,
            sauf mention contraire. Si vous voulez reprendre quelque chose, écrivez-moi avant.
          </p>
        </LegalBlock>

        <LegalBlock title="Vos messages et vos données">
          <p>
            Si vous m&apos;écrivez via le formulaire, j&apos;explique ce que j&apos;en fais sur ma{' '}
            <Link href="/politique-confidentialite">page confidentialité</Link>.
          </p>
        </LegalBlock>

        <LegalBlock title="Une question sur le site ?">
          <p>
            <a href={`mailto:${LEGAL_EMAIL}`}>{LEGAL_EMAIL}</a>
          </p>
          <p className="legal-muted">{LEGAL_SITE_URL}</p>
        </LegalBlock>
      </LegalPage>
    </LegalShell>
  )
}
