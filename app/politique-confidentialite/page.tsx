import type { Metadata } from 'next'
import LegalPage from '@/components/LegalPage'
import {
  DATA_RETENTION_MONTHS,
  LEGAL_DOMAIN,
  LEGAL_EMAIL,
  LEGAL_HOST,
  LEGAL_PUBLISHER,
} from '@/lib/legal'

export const metadata: Metadata = {
  title: 'Politique de confidentialité',
  description: 'Politique de confidentialité et protection des données (RGPD) du portfolio.',
  alternates: { canonical: '/politique-confidentialite' },
  robots: { index: true, follow: true },
}

export default function PolitiqueConfidentialitePage() {
  return (
    <LegalPage title="Politique de confidentialité">
      <p className="legal-lead">
        Cette page décrit comment {LEGAL_PUBLISHER} traite vos données personnelles conformément
        au Règlement général sur la protection des données (RGPD) et à la loi Informatique et
        Libertés.
      </p>

      <section>
        <h2>Responsable du traitement</h2>
        <p>
          {LEGAL_PUBLISHER}
          <br />
          Email : <a href={`mailto:${LEGAL_EMAIL}`}>{LEGAL_EMAIL}</a>
        </p>
      </section>

      <section>
        <h2>Données collectées</h2>
        <p>Via le formulaire de contact, nous collectons uniquement :</p>
        <ul>
          <li>Votre nom</li>
          <li>Votre adresse email</li>
          <li>Le contenu de votre message</li>
        </ul>
        <p>
          Des données techniques minimales (adresse IP, horodatage) peuvent être traitées
          temporairement à des fins de sécurité (limitation du débit, anti-spam).
        </p>
      </section>

      <section>
        <h2>Finalités et base légale</h2>
        <ul>
          <li>
            <strong>Répondre à votre demande</strong> — base légale : votre consentement
            (case à cocher du formulaire) et l&apos;intérêt légitime à traiter votre sollicitation.
          </li>
          <li>
            <strong>Sécurité du site</strong> — base légale : intérêt légitime (prévention des
            abus, spam et attaques).
          </li>
        </ul>
      </section>

      <section>
        <h2>Durée de conservation</h2>
        <p>
          Les messages reçus sont conservés jusqu&apos;à <strong>{DATA_RETENTION_MONTHS} mois</strong>{' '}
          après le dernier échange, sauf obligation légale contraire ou demande de suppression de
          votre part.
        </p>
        <p>
          Les journaux techniques liés à la sécurité (rate limiting) sont conservés de façon
          éphémère en mémoire serveur et ne sont pas archivés de manière permanente.
        </p>
      </section>

      <section>
        <h2>Destinataires et sous-traitants</h2>
        <p>Vos données peuvent être traitées par les prestataires suivants, dans la limite nécessaire :</p>
        <ul>
          <li>
            <strong>Gmail / Google (SMTP)</strong> — envoi et réception des emails du formulaire.
          </li>
          <li>
            <strong>Google Fonts</strong> — chargement de la police Inter (adresse IP transmise à
            Google lors du chargement).
          </li>
          <li>
            <strong>{LEGAL_HOST.name}</strong> — hébergement VPS ({LEGAL_HOST.server}).
          </li>
          <li>
            <strong>{LEGAL_DOMAIN.registrar}</strong> — gestion du nom de domaine.
          </li>
        </ul>
        <p>
          Vos données ne sont ni vendues ni cédées à des fins publicitaires.
        </p>
      </section>

      <section>
        <h2>Transferts hors Union européenne</h2>
        <p>
          Google (SMTP et polices) peut traiter des données aux États-Unis. Hetzner héberge les
          serveurs dans l&apos;Union européenne. Infomaniak est basé en Suisse, pays reconnu par la
          Commission européenne comme offrant un niveau de protection adéquat. Ces transferts
          s&apos;appuient sur les garanties prévues par le RGPD (clauses contractuelles types le
          cas échéant).
        </p>
      </section>

      <section>
        <h2>Cookies et traceurs</h2>
        <p>
          Ce site n&apos;utilise pas de cookies publicitaires ni d&apos;outils de mesure d&apos;audience
          (Google Analytics, etc.).
        </p>
        <p>
          Google Fonts peut transmettre votre adresse IP lors du chargement des polices depuis les
          serveurs Google.
        </p>
      </section>

      <section>
        <h2>Vos droits</h2>
        <p>Conformément au RGPD, vous disposez des droits suivants :</p>
        <ul>
          <li>Droit d&apos;accès et de rectification</li>
          <li>Droit à l&apos;effacement (« droit à l&apos;oubli »)</li>
          <li>Droit d&apos;opposition et de limitation du traitement</li>
          <li>Droit à la portabilité (le cas échéant)</li>
        </ul>
        <p>
          Pour exercer vos droits : <a href={`mailto:${LEGAL_EMAIL}`}>{LEGAL_EMAIL}</a>.
          Vous pouvez également introduire une réclamation auprès de la{' '}
          <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer">CNIL</a>.
        </p>
      </section>

      <section>
        <h2>Mise à jour</h2>
        <p>Dernière mise à jour : juin 2026.</p>
      </section>
    </LegalPage>
  )
}
