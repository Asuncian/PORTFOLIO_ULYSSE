import ForWhoIcon3D, { type ForWhoIconVariant } from './ForWhoIcon3D'

const targets: { icon: ForWhoIconVariant; title: string; desc: string }[] = [
  {
    icon: 'wellness',
    title: 'Luxe & bien-être',
    desc: 'Vitrines soignées pour instituts et marques exigeantes. Identité claire, carte interactive, parcours fluide.',
  },
  {
    icon: 'artisan',
    title: 'Artisans & terrain',
    desc: 'Un site qui montre le travail sur le terrain. SEO local, pages par zone et contact simple pour les pros de votre secteur.',
  },
  {
    icon: 'local',
    title: 'Services locaux',
    desc: 'Site pour un service du quotidien : devis, zones d\'intervention et crédibilité en ligne.',
  },
  {
    icon: 'saas',
    title: 'Produits web & SaaS',
    desc: 'Outils en ligne qui tournent : abonnements, exports PDF, parcours clair. Du prototype à la prod.',
  },
  {
    icon: 'sport',
    title: 'Clubs & associations',
    desc: 'CRM et outils internes pour suivre partenaires, relances et facturation. Tout au même endroit.',
  },
]

export default function ForWho() {
  return (
    <section id="pour-qui">
      <div className="section-header reveal">
        <p className="section-tag">Univers</p>
        <h2 className="section-title">Les secteurs de <em>mes projets</em></h2>
        <p className="section-sub">
          Bien-être, artisans, services locaux, SaaS, sport : les secteurs où j'ai déjà livré.
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
