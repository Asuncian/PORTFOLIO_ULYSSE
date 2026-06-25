/** URL publique du site (SEO, sitemap, Open Graph, JSON-LD). */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://ulysse-goming-jobert.dev'

export const SITE_NAME = 'Ulysse Goming-Jobert'

export const SITE_EMAIL = 'gomingjobertulysse@gmail.com'
export const SITE_PHONE = '+33645003007'
export const SITE_PHONE_DISPLAY = '06 45 00 30 07'
export const SITE_LINKEDIN = 'https://linkedin.com/in/ulysse-goming-jobert-256251254'

export const SITE_REGION = 'Var, Provence-Alpes-Côte d\'Azur'
export const SITE_GEO_REGION = 'FR-83'

/** Titre principal (balise & Open Graph). */
export const SITE_TITLE =
  'Sites web & automatisation pour PME | Ulysse Goming-Jobert'

/** Meta description (~155 car.) — intention recherche PME / services. */
export const SITE_DESCRIPTION =
  'PME, artisans et services : sites vitrines, automatisations n8n et outils sur mesure. Développeur web freelance dans le Var — du devis à la mise en ligne.'

export const SEO_KEYWORDS = [
  SITE_NAME,
  'développeur web',
  'développeur web freelance',
  'développeur web Var',
  'développeur web Provence',
  'développeur web PACA',
  'développeur web Toulon',
  'développeur freelance France',
  'création site web',
  'création site internet',
  'création site web PME',
  'site vitrine',
  'site vitrine professionnel',
  'site vitrine PME',
  'site web entreprise',
  'site web artisan',
  'refonte site web',
  'site internet sur mesure',
  'automatisation',
  'automatisation entreprise',
  'automatisation PME',
  'automatisation processus',
  'automatisation n8n',
  'workflows n8n',
  'intégration n8n',
  'Make automatisation',
  'CRM sur mesure',
  'outil métier sur mesure',
  'application web sur mesure',
  'digitalisation PME',
  'freelance web Var',
  'prestataire site web Var',
  'développeur Next.js',
  'développeur React',
  'SEO local',
  'déploiement Docker',
  'hébergement VPS',
  'formulaire contact site web',
  'devis site vitrine',
] as const

export const SITE_SERVICES = [
  {
    name: 'Création de site vitrine',
    description:
      'Sites rapides, mobiles et clairs pour présenter votre activité et générer des contacts.',
  },
  {
    name: 'Automatisation de processus',
    description:
      'Workflows n8n ou Make : emails, relances, synchronisation d\'outils et gain de temps au quotidien.',
  },
  {
    name: 'CRM et outils métier sur mesure',
    description:
      'Centralisation clients, devis, facturation et suivi adaptés à votre façon de travailler.',
  },
  {
    name: 'Formulaires et intégrations',
    description:
      'Formulaires de contact, devis ou RDV reliés directement à vos outils (mail, CRM, tableurs).',
  },
  {
    name: 'Hébergement et mise en production',
    description:
      'Déploiement Docker, VPS, HTTPS et maintenance pour un site fiable en production.',
  },
] as const
