/** URL publique du site (SEO, sitemap, Open Graph, JSON-LD). */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://ulysse-goming-jobert.dev'

export const SITE_NAME = 'Ulysse Goming-Jobert'

/** Appellation affichée (hero, titre d'onglet, identité). */
export const SITE_ROLE = 'Développeur IA & Automatisation'

export const SITE_EMAIL = 'gomingjobertulysse@gmail.com'
export const SITE_PHONE = '+33645003007'
export const SITE_PHONE_DISPLAY = '06 45 00 30 07'
export const SITE_LINKEDIN = 'https://linkedin.com/in/ulysse-goming-jobert-256251254'

export const SITE_REGION = 'Reims'
export const SITE_GEO_REGION = 'FR-GES'

/** Disponibilité affichée une fois sur le site (contact, FAQ, stats). */
export const SITE_AVAILABILITY = 'début novembre 2026'

/** Google Search Console : balise meta de vérification du domaine. */
export const GOOGLE_SITE_VERIFICATION =
  process.env.GOOGLE_SITE_VERIFICATION ?? 'Xe4PhmrSulMtv2gTpwhOSBNLy6lVepHCj90mxnVoMHE'

/** Titre principal (balise & Open Graph). */
export const SITE_TITLE =
  'Ulysse Goming-Jobert | Développeur IA & Automatisation'

/** Meta description (~155 car.). */
export const SITE_DESCRIPTION =
  'Développeur IA & automatisation : workflows n8n/Make, apps React, intégrations API et agents IA. Portfolio de projets en production, profil orienté CDI full remote.'

/** Mots-clés SEO : compétences et recrutement. */
export const SEO_KEYWORDS = [
  SITE_NAME,
  'développeur IA',
  'développeur automatisation',
  'CDI remote',
  'full remote France',
  'développeur full stack remote',
  'automatisation n8n',
  'workflows n8n',
  'Make automatisation',
  'agents IA',
  'intégration API',
  'React',
  'Django',
  'Python',
  'TypeScript',
  'Next.js',
  'Docker',
  'déploiement VPS',
  'CRM sur mesure',
  'outil métier',
  'application web',
  'Reims',
  'Paris',
  'Grand Est',
  'développeur React',
  'développeur Python',
  'LLM',
  'intégration LLM',
] as const

/** Domaines d'expertise (JsonLd, pas catalogue prestations). */
export const SITE_SERVICES = [
  {
    name: 'Automatisation & workflows',
    description:
      'Workflows n8n et Make, synchronisation d\'outils, emails et relances automatisées.',
  },
  {
    name: 'Agents & intégrations IA',
    description:
      'Connexion LLM, agents et API pour automatiser des tâches répétitives.',
  },
  {
    name: 'Développement web full-stack',
    description:
      'Apps React/Next.js, backends Python/Django, interfaces claires et performantes.',
  },
  {
    name: 'Outils métier & CRM',
    description:
      'Apps internes, suivi commercial, centralisation de données.',
  },
  {
    name: 'Intégrations & API',
    description:
      'Webhooks, formulaires, connexion entre services (mail, CRM, calendriers).',
  },
  {
    name: 'Déploiement & infra',
    description:
      'Docker, VPS, HTTPS, CI/CD basique, mise en production.',
  },
] as const

/** FAQ visible + schéma JSON-LD. */
export const SITE_FAQ = [
  {
    question: 'Comment vous enchaînez workflows et code sur un projet ?',
    answer:
      'Je commence toujours par identifier le besoin. Ensuite je travaille par lots, je découpe en user stories pour repérer les quick wins et ce qui prendra plus de temps. Les workflows servent à automatiser les process répétitifs, les sites et apps à donner une interface claire. L\'idée, c\'est de comprendre le besoin et d\'adapter la solution, automatiser ce qui peut l\'être et doit l\'être.',
  },
  {
    question: 'Vous avez déjà mis de l\'IA en production ?',
    answer:
      'Oui, à parts égales entre les chaînes n8n et Claude au quotidien. Côté n8n, je branche l\'IA dans des CRM pour garder la main sur l\'activation et les paramètres. Côté Claude, skills et planifications de tâches, avec une approbation humaine pour les actions dangereuses. L\'idée, c\'est que ça tourne tout en gardant le contrôle.',
  },
  {
    question: 'Qu\'est-ce que vous livrez concrètement ?',
    answer:
      'Des pipelines d\'automatisation, des sites vitrine, des dashboards, des CRM, et aussi du Claude (skills, artefacts) quand ça a du sens. Des outils concrets qui tournent, avec ou sans IA selon le besoin.',
  },
  {
    question: 'Vous travaillez en remote ?',
    answer:
      'Full remote de préférence, hybride sur Reims, Paris et alentours. Je suis basé à Reims et ouvert aux déplacements ponctuels partout en France.',
  },
  {
    question: 'Quand êtes-vous disponible ?',
    answer: 'À partir de début novembre 2026.',
  },
] as const
