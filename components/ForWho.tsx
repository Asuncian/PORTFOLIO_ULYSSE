import ForWhoIcon3D, { type ForWhoIconVariant } from './ForWhoIcon3D'

const targets: { icon: ForWhoIconVariant; title: string; desc: string }[] = [
  {
    icon: 'wellness',
    title: 'Luxe & bien-être',
    desc: 'Des vitrines qui présentent plusieurs activités sans perdre le visiteur en route.',
  },
  {
    icon: 'artisan',
    title: 'Artisans & terrain',
    desc: 'Un site clair, des pages locales, un formulaire pour être contacté facilement, et surtout de la visibilité sur Google.',
  },
  {
    icon: 'local',
    title: 'Services locaux',
    desc: 'Des vitrines faites pour être trouvées rapidement par optimisation du référencement, avec prise de contact facile et optimale.',
  },
  {
    icon: 'saas',
    title: 'Produits web & SaaS',
    desc: 'Des apps en ligne avec abonnements, exports, fonctionnalités adaptées et un parcours utilisateur intuitif pour simplifier les process.',
  },
  {
    icon: 'sport',
    title: 'Clubs & associations',
    desc: 'Des CRM internes pour suivre les partenaires, relancer et facturer, tout dans un seul outil.',
  },
]

export default function ForWho() {
  return (
    <section id="pour-qui">
      <div className="section-header reveal">
        <p className="section-tag">Secteurs</p>
        <h2 className="section-title">Mes secteurs d&apos;<em>intervention</em></h2>
        <p className="section-sub">
          Du bien-être aux artisans, du site vitrine au SaaS avec automatisations de process. Mon objectif reste le même, développer des outils simples qui libèrent du temps au quotidien.
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
