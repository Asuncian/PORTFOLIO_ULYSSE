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
      'En pratique, je commence par ce qui fait gagner du temps tout de suite : un workflow n8n ou Make pour les relances, les synchros Supabase ou Airtable, les emails planifiés. Dès qu\'il faut une vraie interface ou un outil sur mesure, je bascule sur React, Next.js ou une petite API (Hono, Prisma…). Je m\'adapte à la stack du projet — l\'objectif est de fluidifier l\'organisation, sans empiler d\'outils inutiles.',
  },
  {
    question: 'Vous avez déjà branché des LLM ou des agents sur des processus réels ?',
    answer:
      'Oui, en production. Des chaînes d\'agents n8n pour générer posts et visuels (GPT Image, Airtable, Drive), des relances CRM, des rapports Gmail automatisés… J\'utilise aussi Claude au quotidien : automatisation de tâches, création de skills, production d\'artefacts utiles au projet. Je mets des garde-fous simples pour garantir la fiabilité en conditions réelles.',
  },
  {
    question: 'Quel type de mission vous intéresse dans une agence IA ?',
    answer:
      'Les pipelines d\'automatisation, les sites vitrine, les dashboards, les CRM sur mesure — et tout ce qui touche à Claude : workflows, skills, création d\'artefacts, intégration dans le quotidien de développement. Ce qui m\'attire, c\'est de construire des solutions concrètes et opérationnelles, avec ou sans IA selon le besoin.',
  },
  {
    question: 'Remote, hybride ou sur site ?',
    answer:
      'Le full remote est ma préférence. Hybride si l\'équipe le souhaite. Basé à Reims, je peux me déplacer sur Paris lorsque le contexte le justifie.',
  },
  {
    question: 'Quand êtes-vous disponible ?',
    answer: 'À partir de fin octobre 2026.',
  },
] as const
