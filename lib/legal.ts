import {
  SITE_EMAIL,
  SITE_NAME,
  SITE_PHONE_DISPLAY,
  SITE_REGION,
  SITE_ROLE,
  SITE_URL,
} from '@/lib/site'

export const LEGAL_PUBLISHER = SITE_NAME
export const LEGAL_ROLE = SITE_ROLE
export const LEGAL_EMAIL = SITE_EMAIL
export const LEGAL_PHONE = SITE_PHONE_DISPLAY
export const LEGAL_REGION = SITE_REGION
export const LEGAL_SITE_URL = SITE_URL

/** Hébergement applicatif (VPS Hetzner + Dokploy). */
export const LEGAL_HOST = {
  name: 'Hetzner Online GmbH',
  address: 'Industriestr. 25, 91710 Gunzenhausen, Allemagne',
  server: 'VPS CX23, déploiement Docker via Dokploy (reverse proxy intégré)',
} as const

/** Registrar du nom de domaine. */
export const LEGAL_DOMAIN = {
  registrar: 'Infomaniak Network SA',
  address: 'Rue Eugène-Marziano 25, 1227 Genève, Suisse',
} as const

/** Durée de conservation des messages reçus via le formulaire. */
export const DATA_RETENTION_MONTHS = 36
