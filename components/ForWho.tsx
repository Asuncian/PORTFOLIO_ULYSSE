import ForWhoIcon3D, { type ForWhoIconVariant } from './ForWhoIcon3D'

const targets: { icon: ForWhoIconVariant; title: string; desc: string }[] = [
  {
    icon: 'wellness',
    title: 'Luxe & bien-être',
    desc: 'Sites vitrines multi-activités, parcours clair entre plusieurs offres.',
  },
  {
    icon: 'artisan',
    title: 'Artisans & terrain',
    desc: 'Sites avec pages locales, formulaires de contact, visibilité Google.',
  },
  {
    icon: 'local',
    title: 'Services locaux',
    desc: 'Vitrines orientées demande rapide, zones d\'intervention, contact direct.',
  },
  {
    icon: 'saas',
    title: 'Produits web & SaaS',
    desc: 'Apps en ligne, abonnements, exports, parcours utilisateur.',
  },
  {
    icon: 'sport',
    title: 'Clubs & associations',
    desc: 'CRM interne, suivi partenaires, relances et facturation centralisés.',
  },
]

export default function ForWho() {
  return (
    <section id="pour-qui">
      <div className="section-header reveal">
        <p className="section-tag">Contextes</p>
        <h2 className="section-title">Les secteurs de <em>mes projets</em></h2>
        <p className="section-sub">
          Bien-être, artisans, services locaux, SaaS, sport : des contextes variés, des problèmes concrets.
        </p>
      </div>

      <div className="for-who-grid reveal-grid">
        {targets.map(({ icon, title, desc }) => (
          <div key={title} className={`fw-card fw-card--${icon}`}>
            <div className={`fw-icon fw-icon--${icon}`}>
              <ForWhoIcon3D variant={icon} />
            </div>
            <h3>{title}</h3>
            <p>{desc}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
