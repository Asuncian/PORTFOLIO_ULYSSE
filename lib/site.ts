/** URL publique du site (SEO, sitemap, Open Graph, JSON-LD). */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://ulysse-goming-jobert.dev'

export const SITE_NAME = 'Ulysse Goming-Jobert'

export const SITE_EMAIL = 'gomingjobertulysse@gmail.com'
export const SITE_PHONE = '+33645003007'
export const SITE_PHONE_DISPLAY = '06 45 00 30 07'
export const SITE_LINKEDIN = 'https://linkedin.com/in/ulysse-goming-jobert-256251254'

export const SITE_REGION = 'Occitanie'
export const SITE_GEO_REGION = 'FR-OCC'

/** Google Search Console — balise meta de vérification du domaine. */
export const GOOGLE_SITE_VERIFICATION =
  process.env.GOOGLE_SITE_VERIFICATION ?? 'MJONZxuhd88OQG_R1_aVo0JI_PVnTH6ncVRITkIBxSU'

/** Titre principal (balise & Open Graph). */
export const SITE_TITLE =
  'Site vitrine artisan & PME : plus de clients | Ulysse Goming-Jobert'

/** Meta description (~155 car.) — intention recherche pain PME / artisans. */
export const SITE_DESCRIPTION =
  'Artisan ou PME : peu de clients en ligne ? Site vitrine, SEO local et automatisations pour recevoir des demandes et gagner du temps. Occitanie et France.'

/** Termes prestations, stack et géolocalisation. */
export const SEO_SERVICE_KEYWORDS = [
  SITE_NAME,
  'développeur web',
  'développeur web Occitanie',
  'développeur web & automatisation',
  'création site web',
  'création site internet',
  'création site web PME',
  'site vitrine',
  'site vitrine professionnel',
  'site vitrine PME',
  'site web entreprise',
  'site web artisan',
  'site internet artisan',
  'création site internet artisan',
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
  'CRM artisan',
  'CRM PME',
  'outil métier sur mesure',
  'application web sur mesure',
  'digitalisation PME',
  'digitalisation artisan',
  'prestataire site web Occitanie',
  'développeur Next.js',
  'développeur React',
  'SEO local',
  'référencement local',
  'référencement local artisan',
  'référencement google entreprise',
  'déploiement Docker',
  'hébergement VPS',
  'formulaire contact site web',
  'formulaire devis en ligne',
  'devis site vitrine',
  'devis site internet',
] as const

/**
 * Requêtes « pain » : artisans et PME qui cherchent plus de clients,
 * visibilité Google ou gain de temps au quotidien.
 */
export const SEO_PAIN_KEYWORDS = [
  'avoir plus de clients',
  'trouver plus de clients',
  'trouver des clients artisan',
  'augmenter nombre de clients',
  'développer sa clientèle',
  'développer clientèle artisan',
  'pas assez de clients',
  'comment avoir des clients',
  'comment trouver des clients quand on est artisan',
  'attirer des clients locaux',
  'générer des leads',
  'générer des leads artisan',
  'recevoir plus de devis',
  'plus de demandes de devis',
  'site web pour avoir des clients',
  'site qui ramène des clients',
  'site vitrine qui convertit',
  'site vitrine artisan',
  'site web artisan pas cher',
  'être visible sur google',
  'visibilité google artisan',
  'visibilité sur internet',
  'améliorer visibilité en ligne',
  'présence en ligne entreprise',
  'présence en ligne artisan',
  'apparaître sur google',
  'apparaître sur google maps',
  'fiche google entreprise',
  'site qui ne ramène pas de clients',
  'site internet peu de visites',
  'refonte site pas de visiteurs',
  'améliorer référencement site',
  'SEO local PME',
  'SEO local artisan',
  'automatiser devis',
  'relance client automatique',
  'relance devis automatique',
  'gain de temps administratif',
  'gagner du temps entreprise',
  'moins de paperasse PME',
  'centraliser devis factures',
  'suivi clients centralisé',
  'outil gestion clients PME',
  'prise de rendez-vous en ligne',
  'digitaliser mon activité',
  'prix site vitrine artisan',
  'combien coûte un site vitrine',
  'créateur site vitrine Occitanie',
  'site internet Toulouse',
  'site internet Montpellier',
  'site web Perpignan',
  'site vitrine Nîmes',
] as const

export const SEO_KEYWORDS = [...SEO_SERVICE_KEYWORDS, ...SEO_PAIN_KEYWORDS] as const

export const SITE_SERVICES = [
  {
    name: 'Création de site vitrine',
    description:
      'Sites rapides et mobiles pour présenter votre savoir-faire, rassurer et transformer les visites Google en demandes de devis.',
  },
  {
    name: 'Référencement local (SEO)',
    description:
      'Structure, contenus et pages par zone pour apparaître quand un client cherche un artisan ou un service près de chez lui.',
  },
  {
    name: 'Automatisation de processus',
    description:
      'Workflows n8n ou Make : confirmations, relances et synchronisation d\'outils pour ne plus perdre de clients par oubli.',
  },
  {
    name: 'CRM et outils métier sur mesure',
    description:
      'Centralisation clients, devis et facturation : fini les fichiers éparpillés et les relances oubliées.',
  },
  {
    name: 'Formulaires et intégrations',
    description:
      'Contact, devis ou RDV en ligne reliés à votre mail ou CRM pour répondre vite et convertir plus de prospects.',
  },
  {
    name: 'Hébergement et mise en production',
    description:
      'Déploiement Docker, VPS, HTTPS et maintenance pour un site fiable, rapide et toujours en ligne.',
  },
] as const

/** FAQ visible + schéma JSON-LD — requêtes longue traîne artisans / PME. */
export const SITE_FAQ = [
  {
    question: 'Comment un artisan peut avoir plus de clients avec un site web ?',
    answer:
      'Un site clair rassure avant le premier appel : photos, zones d\'intervention, avis et formulaire de devis. Couplé au référencement local, il vous place sur Google quand quelqu\'un cherche votre métier près de chez lui. Je construis ce parcours de A à Z.',
  },
  {
    question: 'Mon site actuel ne me ramène pas de clients, que faire ?',
    answer:
      'Souvent le blocage vient du message, de la vitesse mobile ou d\'un référencement local absent. On audite ce qui coince, on refond ce qui freine les conversions et on met en place un contact simple (devis, téléphone, RDV).',
  },
  {
    question: 'Le bouche-à-oreille suffit-il ou faut-il un site internet ?',
    answer:
      'Le bouche-à-oreille reste précieux, mais beaucoup de clients comparent en ligne avant d\'appeler. Sans présence claire sur Google, vous perdez des demandes au profit d\'un concurrent mieux visible.',
  },
  {
    question: 'Qu\'est-ce que le SEO local et pourquoi c\'est important pour un artisan ?',
    answer:
      'Le SEO local optimise votre visibilité sur les recherches géolocalisées (« élagage + ville », « location benne + département »). Pages par zone, contenus utiles et technique saine : c\'est ce qui fait apparaître votre activité au bon moment.',
  },
  {
    question: 'Comment automatiser les devis et les relances clients ?',
    answer:
      'Un formulaire de devis relié à vos outils, des emails de confirmation automatiques et des relances programmées évitent les oublis. Je mets en place des workflows n8n ou Make adaptés à votre façon de travailler.',
  },
  {
    question: 'Combien coûte un site vitrine pour artisan ou PME ?',
    answer:
      'Cela dépend du nombre de pages, des intégrations (devis, carte, blog) et du niveau de sur-mesure. Lors du premier échange, je vous propose une fourchette claire et un périmètre précis, sans engagement.',
  },
  {
    question: 'En combien de temps peut-on mettre un site en ligne ?',
    answer:
      'Un site vitrine ciblé peut être en ligne en quelques semaines selon vos contenus et validations. Je vous accompagne du premier échange au déploiement, avec un site rapide, sécurisé et prêt pour Google.',
  },
] as const
