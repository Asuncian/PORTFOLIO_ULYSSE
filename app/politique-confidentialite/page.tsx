import type { Metadata } from 'next'
import Link from 'next/link'
import LegalPage, { LegalBlock } from '@/components/LegalPage'
import LegalShell from '@/components/LegalShell'
import {
  DATA_RETENTION_MONTHS,
  LEGAL_DOMAIN,
  LEGAL_EMAIL,
  LEGAL_HOST,
  LEGAL_PUBLISHER,
} from '@/lib/legal'

export const metadata: Metadata = {
  title: 'Politique de confidentialité',
  description: 'Comment Ulysse Goming-Jobert traite vos données quand vous utilisez ce site.',
  alternates: { canonical: '/politique-confidentialite' },
  robots: { index: true, follow: true },
}

export default function PolitiqueConfidentialitePage() {
  return (
    <LegalShell>
      <LegalPage
        tag="Vie privée"
        title={<>Vos données, <em>simplement</em></>}
        subtitle="Ce que je collecte quand vous m'écrivez, pourquoi, et combien de temps je garde."
      >
        <LegalBlock title="Qui est responsable ?">
          <p>
            {LEGAL_PUBLISHER}. Pour toute question :{' '}
            <a href={`mailto:${LEGAL_EMAIL}`}>{LEGAL_EMAIL}</a>.
          </p>
        </LegalBlock>

        <LegalBlock title="Ce que je collecte">
          <p>Quand vous remplissez le formulaire de contact, je reçois :</p>
          <ul>
            <li>votre nom ;</li>
            <li>votre adresse email ;</li>
            <li>le contenu de votre message.</li>
          </ul>
          <p>
            Pour limiter le spam, je peux aussi traiter temporairement votre adresse IP et
            l&apos;horodatage de la requête. Rien d&apos;autre.
          </p>
        </LegalBlock>

        <LegalBlock title="Pourquoi je le fais">
          <ul>
            <li>
              <strong>Vous répondre</strong> : avec votre accord (case à cocher du formulaire) et
              parce que c&apos;est la suite logique de votre demande.
            </li>
            <li>
              <strong>Protéger le site</strong> : limiter les abus, le spam et les envois automatisés.
            </li>
          </ul>
        </LegalBlock>

        <LegalBlock title="Combien de temps je garde vos messages">
          <p>
            Jusqu&apos;à <strong>{DATA_RETENTION_MONTHS} mois</strong> après notre dernier échange,
            sauf obligation légale ou si vous me demandez de les supprimer avant.
          </p>
          <p>
            Les compteurs anti-spam côté serveur sont éphémères : ils ne sont pas archivés
            durablement.
          </p>
        </LegalBlock>

        <LegalBlock title="Qui peut y accéder">
          <p>Seulement les prestataires utiles au fonctionnement du site :</p>
          <ul>
            <li>
              <strong>Gmail / Google (SMTP)</strong> pour envoyer et recevoir vos messages.
            </li>
            <li>
              <strong>Google Fonts</strong> pour charger la police Inter (votre IP peut être transmise
              à Google au chargement).
            </li>
            <li>
              <strong>{LEGAL_HOST.name}</strong> pour l&apos;hébergement ({LEGAL_HOST.server.toLowerCase()}).
            </li>
            <li>
              <strong>{LEGAL_DOMAIN.registrar}</strong> pour la gestion du nom de domaine.
            </li>
          </ul>
          <p>Je ne vends pas vos données. Point.</p>
        </LegalBlock>

        <LegalBlock title="Où sont stockées les données">
          <p>
            Les serveurs Hetzner sont en Union européenne. Google (emails et polices) peut traiter
            des données aux États-Unis, avec les garanties prévues par le RGPD. Infomaniak est en
            Suisse, pays reconnu pour un niveau de protection adéquat.
          </p>
        </LegalBlock>

        <LegalBlock title="Cookies et traceurs">
          <p>
            Pas de pub, pas de Google Analytics, pas de tracking marketing.
          </p>
          <p>
            Google Fonts peut transmettre votre IP quand la police se charge. C&apos;est tout ce
            qu&apos;il y a à signaler de ce côté.
          </p>
        </LegalBlock>

        <LegalBlock title="Vos droits">
          <p>Vous pouvez, à tout moment :</p>
          <ul>
            <li>demander l&apos;accès à vos données ou leur correction ;</li>
            <li>demander leur suppression ;</li>
            <li>vous opposer à certains traitements ou en demander la limitation.</li>
          </ul>
          <p>
            Écrivez-moi à <a href={`mailto:${LEGAL_EMAIL}`}>{LEGAL_EMAIL}</a>. Vous pouvez aussi
            contacter la{' '}
            <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer">CNIL</a> si
            besoin.
          </p>
        </LegalBlock>

        <LegalBlock title="Mise à jour">
          <p>
            Dernière mise à jour : juin 2026. Les{' '}
            <Link href="/mentions-legales">mentions légales</Link> complètent cette page.
          </p>
        </LegalBlock>
      </LegalPage>
    </LegalShell>
  )
}
