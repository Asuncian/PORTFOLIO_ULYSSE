import { SITE_NAME, SITE_URL, SEO_KEYWORDS } from '@/lib/site'

const schema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Person',
      name: SITE_NAME,
      url: SITE_URL,
      jobTitle: 'Développeur IA & automatisation',
      email: 'gomingjobertulysse@gmail.com',
      telephone: '+33645003007',
      sameAs: ['https://linkedin.com/in/ulysse-goming-jobert-256251254'],
      knowsAbout: [
        'Développement web',
        'Next.js',
        'React',
        'Automatisation n8n',
        'CRM sur mesure',
        'Sites vitrines',
        'SEO local',
        'Docker',
        'Déploiement VPS',
      ],
      areaServed: { '@type': 'AdministrativeArea', name: 'Var, Provence-Alpes-Côte d\'Azur' },
    },
    {
      '@type': 'WebSite',
      name: SITE_NAME,
      url: SITE_URL,
      description:
        'Portfolio de Ulysse Goming-Jobert : sites web, automatisations n8n et outils sur mesure, du Var à la mise en ligne.',
      inLanguage: 'fr-FR',
      keywords: SEO_KEYWORDS.join(', '),
    },
    {
      '@type': 'ProfessionalService',
      name: `${SITE_NAME} — Développement web & automatisation`,
      url: SITE_URL,
      description:
        'Création de sites vitrines, automatisations (n8n, Make), CRM et outils métier. Accompagnement jusqu\'au déploiement.',
      areaServed: 'France',
      serviceType: [
        'Développement web',
        'Automatisation de processus',
        'Création de site vitrine',
        'Outil métier sur mesure',
        'Hébergement et déploiement',
      ],
    },
  ],
}

export default function JsonLd() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
