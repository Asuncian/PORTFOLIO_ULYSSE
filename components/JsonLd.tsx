import {
  SITE_DESCRIPTION,
  SITE_EMAIL,
  SITE_FAQ,
  SITE_LINKEDIN,
  SITE_NAME,
  SITE_PHONE,
  SITE_REGION,
  SITE_ROLE,
  SITE_URL,
  SEO_KEYWORDS,
} from '@/lib/site'

const personId = `${SITE_URL}/#person`
const websiteId = `${SITE_URL}/#website`
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
      primaryImageOfPage: { '@type': 'ImageObject', url: `${SITE_URL}/icon-512.png` },
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
      alternateName: ['Ulysse Goming Jobert', 'Ulysse Goming-Jobert'],
      jobTitle: SITE_ROLE,
      email: SITE_EMAIL,
      telephone: SITE_PHONE,
      sameAs: [SITE_LINKEDIN],
      knowsAbout: [
        'Automatisation',
        'n8n',
        'Make',
        'agents IA',
        'React',
        'Django',
        'Python',
        'TypeScript',
        'Next.js',
        'Intégration API',
        'Docker',
        'Déploiement VPS',
        'CRM sur mesure',
        'Développement web full-stack',
      ],
      areaServed: [
        { '@type': 'Country', name: 'France' },
        { '@type': 'AdministrativeArea', name: SITE_REGION },
      ],
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
