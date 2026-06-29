import type { Metadata } from 'next'
import Link from 'next/link'
import LegalPage, { LegalBlock } from '@/components/LegalPage'
import LegalShell from '@/components/LegalShell'
import {
  DATA_RETENTION_MONTHS,
  LEGAL_DOMAIN,
  LEGAL_EMAIL,
  LEGAL_HOST,
} from '@/lib/legal'

export const metadata: Metadata = {
  title: 'Politique de confidentialité',
  description: 'Ce que je fais des informations que vous m\'envoyez via le formulaire de mon portfolio.',
  alternates: { canonical: '/politique-confidentialite' },
  robots: { index: true, follow: true },
}

export default function PolitiqueConfidentialitePage() {
  return (
    <LegalShell>
      <LegalPage
        tag="Confidentialité"
        title={<>Quand vous m&apos;<em>écrivez</em></>}
        subtitle="Le formulaire me transmet votre nom, votre email et votre message. Voici ce que j'en fais avec."
      >
        <LegalBlock title="Qui traite vos données ?">
          <p>
            Je reçois et lis les messages envoyés depuis mon portfolio. Pour toute question sur ce
            sujet : <a href={`mailto:${LEGAL_EMAIL}`}>{LEGAL_EMAIL}</a>.
          </p>
        </LegalBlock>

        <LegalBlock title="Qu&apos;est-ce que je reçois ?">
          <p>
            Quand vous remplissez le formulaire de contact, j&apos;ai accès à votre nom, votre
            adresse email et au texte de votre message. Le serveur peut aussi voir votre adresse IP
            le temps de filtrer le spam. Je ne collecte rien d&apos;autre via mon site.
          </p>
        </LegalBlock>

        <LegalBlock title="Pourquoi je m&apos;en sers ?">
          <p>
            Pour vous répondre. Vous cochez une case pour m&apos;y autoriser, et je traite votre
            message dans la foulée. J&apos;ai aussi mis quelques limites techniques pour éviter les
            envois automatiques et les abus.
          </p>
        </LegalBlock>

        <LegalBlock title="Combien de temps je les garde ?">
          <p>
            Je conserve vos messages jusqu&apos;à {DATA_RETENTION_MONTHS} mois après notre dernier
            échange, le temps de reprendre contact si on reparle du même sujet. Vous pouvez me
            demander de les supprimer avant. Les compteurs anti-spam côté serveur ne sont pas gardés
            longtemps.
          </p>
        </LegalBlock>

        <LegalBlock title="Qui intervient en coulisse ?">
          <p>Pour que mon portfolio et le formulaire fonctionnent, j&apos;utilise :</p>
          <ul>
            <li>Gmail (Google) pour envoyer et recevoir vos messages ;</li>
            <li>Google Fonts pour la police du site (Inter) ;</li>
            <li>{LEGAL_HOST.name} pour l&apos;hébergement ({LEGAL_HOST.server.toLowerCase()}) ;</li>
            <li>{LEGAL_DOMAIN.registrar} pour le nom de domaine.</li>
          </ul>
          <p>
            Je ne revends pas vos données et je ne les utilise pas pour de la publicité.
          </p>
        </LegalBlock>

        <LegalBlock title="Où passent vos informations ?">
          <p>
            Mon serveur est hébergé chez Hetzner, en Union européenne. Les emails transitent par
            Gmail, qui peut traiter des données aux États-Unis. Les polices passent par Google.
            Le domaine est géré par Infomaniak, en Suisse. Tout ça dans le cadre des règles RGPD.
          </p>
        </LegalBlock>

        <LegalBlock title="Cookies et traceurs">
          <p>
            Pas de pub, pas de Google Analytics, pas de tracking marketing sur mon portfolio.
          </p>
          <p>
            Google Fonts charge la police depuis leurs serveurs, ce qui peut transmettre votre IP.
            C&apos;est la seule chose à signaler de ce côté.
          </p>
        </LegalBlock>

        <LegalBlock title="Ce que vous pouvez demander">
          <p>
            Vous pouvez me demander de consulter, corriger ou supprimer les informations que vous
            m&apos;avez envoyées. Écrivez-moi à{' '}
            <a href={`mailto:${LEGAL_EMAIL}`}>{LEGAL_EMAIL}</a>. Vous pouvez aussi contacter la{' '}
            <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer">CNIL</a> si
            vous préférez passer par eux.
          </p>
        </LegalBlock>

        <LegalBlock title="Mise à jour">
          <p>
            Dernière mise à jour : juin 2026. Mes{' '}
            <Link href="/mentions-legales">mentions légales</Link> complètent ce texte.
          </p>
        </LegalBlock>
      </LegalPage>
    </LegalShell>
  )
}
