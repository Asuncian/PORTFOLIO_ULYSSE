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

export const SITE_REGION = 'Occitanie'
export const SITE_GEO_REGION = 'FR-OCC'

/** Disponibilité affichée une fois sur le site (contact, FAQ, stats). */
export const SITE_AVAILABILITY = 'fin octobre 2026'

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
  'Occitanie',
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
    question: 'Quel type de poste vous intéresse ?',
    answer:
      'Un CDI full remote, sur de l\'automatisation, du dev web ou de l\'IA appliquée. Je préfère les équipes où je peux aller du workflow à la prod.',
  },
  {
    question: 'Quelle est votre stack principale ?',
    answer:
      'n8n, Make, React, Python/Django, TypeScript, Docker. Je m\'adapte vite à la stack de l\'équipe si la mission est claire.',
  },
  {
    question: 'Travaillez-vous en remote ?',
    answer:
      'Oui, full remote. Basé en Occitanie, habitué au travail async et aux outils collaboratifs.',
  },
  {
    question: 'Quand seriez-vous disponible ?',
    answer: 'Fin octobre 2026.',
  },
  {
    question: 'Où voir vos réalisations ?',
    answer:
      'La section Projets de ce site : sites vitrines, CRM et outils internes déjà en production.',
  },
] as const
