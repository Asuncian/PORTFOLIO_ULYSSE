import ForWhoIcon3D, { type ForWhoIconVariant } from './ForWhoIcon3D'

const targets: { icon: ForWhoIconVariant; title: string; desc: string }[] = [
  {
    icon: 'wellness',
    title: 'Luxe & bien-être',
    desc: 'Vitrines soignées pour institutes et marques exigeantes. Identité claire, carte interactive, parcours fluide.',
  },
  {
    icon: 'artisan',
    title: 'Artisans & terrain',
    desc: 'Un site qui montre le vrai travail sur le terrain. SEO local, pages par zone et contact simple pour les pros du Var.',
  },
  {
    icon: 'local',
    title: 'Services locaux',
    desc: 'Faire connaître un service du quotidien mieux qu\'une page Facebook. Devis, zones d\'intervention et crédibilité en ligne.',
  },
  {
    icon: 'saas',
    title: 'Produits web & SaaS',
    desc: 'Outils en ligne qui tournent : abonnements, exports PDF, parcours clair. Du prototype jusqu\'à la mise en prod.',
  },
  {
    icon: 'sport',
    title: 'Clubs & associations',
    desc: 'CRM et outils internes pour suivre partenaires, relances et facturation. Moins de tableurs, plus de visibilité.',
  },
]

export default function ForWho() {
  return (
    <section id="pour-qui">
      <div className="section-header reveal">
        <p className="section-tag">Univers</p>
        <h2 className="section-title">Les secteurs de <em>mes projets</em></h2>
        <p className="section-sub">
          Vous les retrouverez plus bas : bien-être, artisans, services locaux, SaaS, sport.
        </p>
      </div>

      <div className="for-who-grid reveal-grid">
        {targets.map(({ icon, title, desc }) => (
          <div key={title} className="fw-card">
            <div className="fw-icon">
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
