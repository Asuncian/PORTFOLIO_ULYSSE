import {
  SITE_DESCRIPTION,
  SITE_EMAIL,
  SITE_FAQ,
  SITE_LINKEDIN,
  SITE_NAME,
  SITE_PHONE,
  SITE_REGION,
  SITE_ROLE,
  SITE_SERVICES,
  SITE_URL,
  SEO_KEYWORDS,
} from '@/lib/site'

const personId = `${SITE_URL}/#person`
const websiteId = `${SITE_URL}/#website`
const businessId = `${SITE_URL}/#business`
const faqId = `${SITE_URL}/#faq`

const schema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebPage',
      '@id': SITE_URL,
      url: SITE_URL,
      name: SITE_NAME,
      description: SITE_DESCRIPTION,
      inLanguage: 'fr-FR',
      isPartOf: { '@id': websiteId },
      about: { '@id': personId },
      primaryImageOfPage: { '@type': 'ImageObject', url: `${SITE_URL}/logo-bloom-yourself.png` },
    },
    {
      '@type': 'WebSite',
      '@id': websiteId,
      name: SITE_NAME,
      url: SITE_URL,
      description: SITE_DESCRIPTION,
      inLanguage: 'fr-FR',
      publisher: { '@id': personId },
      keywords: SEO_KEYWORDS.join(', '),
    },
    {
      '@type': 'Person',
      '@id': personId,
      name: SITE_NAME,
      url: SITE_URL,
      jobTitle: SITE_ROLE,
      email: SITE_EMAIL,
      telephone: SITE_PHONE,
      sameAs: [SITE_LINKEDIN],
      knowsAbout: [
        'Intelligence artificielle',
        'Automatisation IA',
        'Intégrations LLM',
        'Développement web',
        'Sites vitrines pour artisans et PME',
        'Référencement local',
        'Génération de leads pour artisans',
        'Automatisation n8n',
        'CRM sur mesure',
        'Formulaires de devis en ligne',
        'Next.js',
        'React',
        'SEO local',
        'Docker',
        'Déploiement VPS',
      ],
      areaServed: [
        { '@type': 'Country', name: 'France' },
        { '@type': 'AdministrativeArea', name: SITE_REGION },
      ],
    },
    {
      '@type': 'ProfessionalService',
      '@id': businessId,
      name: `${SITE_NAME} | Développement IA & Automatisation`,
      url: SITE_URL,
      description: SITE_DESCRIPTION,
      email: SITE_EMAIL,
      telephone: SITE_PHONE,
      priceRange: '€€',
      founder: { '@id': personId },
      areaServed: [
        { '@type': 'Country', name: 'France' },
        { '@type': 'AdministrativeArea', name: SITE_REGION },
      ],
      serviceType: SITE_SERVICES.map((s) => s.name),
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: 'Services IA, web & automatisation pour artisans et PME',
        itemListElement: SITE_SERVICES.map((service, i) => ({
          '@type': 'Offer',
          position: i + 1,
          itemOffered: {
            '@type': 'Service',
            name: service.name,
            description: service.description,
            provider: { '@id': businessId },
            areaServed: { '@type': 'Country', name: 'France' },
          },
        })),
      },
    },
    {
      '@type': 'FAQPage',
      '@id': faqId,
      url: `${SITE_URL}/#faq`,
      inLanguage: 'fr-FR',
      isPartOf: { '@id': websiteId },
      mainEntity: SITE_FAQ.map(({ question, answer }) => ({
        '@type': 'Question',
        name: question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: answer,
        },
      })),
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
