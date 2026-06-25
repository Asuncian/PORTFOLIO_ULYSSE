function WellnessIcon() {
  return (
    <svg viewBox="0 0 32 32" fill="none">
      <defs>
        <linearGradient id="fwWell" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#6ea8ff" />
          <stop offset="1" stopColor="#0c2db0" />
        </linearGradient>
      </defs>
      <path d="M16 4 19.2 12.8 28 14l-6.8 5.6L23 28 16 23.2 9 28l1.8-8.4L4 14l8.8-1.2z" fill="url(#fwWell)" opacity=".9" />
      <circle cx="16" cy="15.5" r="3.2" fill="#cfe0ff" opacity=".85" />
      <path d="M16 8v3M16 20v3M8.5 15.5h3M20.5 15.5h3" stroke="#8ab8ff" strokeWidth="1" strokeLinecap="round" opacity=".5" />
    </svg>
  )
}

function ArtisanIcon() {
  return (
    <svg viewBox="0 0 32 32" fill="none">
      <defs>
        <linearGradient id="fwTree" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#4d88ff" />
          <stop offset="1" stopColor="#0c2db0" />
        </linearGradient>
      </defs>
      <path d="M16 3 8 14h5l-2 6h10l-2-6h5z" fill="url(#fwTree)" />
      <path d="M16 20v8" stroke="#8ab8ff" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M11 28h10" stroke="#4d88ff" strokeWidth="1.4" strokeLinecap="round" />
      <circle cx="22" cy="9" r="1.2" fill="#bcd6ff" opacity=".7" />
    </svg>
  )
}

function LocalIcon() {
  return (
    <svg viewBox="0 0 32 32" fill="none">
      <defs>
        <linearGradient id="fwTruck" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#3b78ff" />
          <stop offset="1" stopColor="#0c2db0" />
        </linearGradient>
      </defs>
      <rect x="4" y="12" width="14" height="10" rx="1.5" fill="url(#fwTruck)" />
      <path d="M18 15h5l3 4v3h-8z" fill="#2868ff" />
      <rect x="6" y="14" width="8" height="4" rx=".8" fill="#cfe0ff" opacity=".45" />
      <circle cx="9" cy="24" r="2.2" fill="#0a1f6e" stroke="#4d88ff" strokeWidth="1.2" />
      <circle cx="22" cy="24" r="2.2" fill="#0a1f6e" stroke="#4d88ff" strokeWidth="1.2" />
      <rect x="20" y="8" width="7" height="5" rx="1" fill="#4d88ff" opacity=".55" />
    </svg>
  )
}

function SaasIcon() {
  return (
    <svg viewBox="0 0 32 32" fill="none">
      <defs>
        <linearGradient id="fwSaas" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#4d88ff" />
          <stop offset="1" stopColor="#0c2db0" />
        </linearGradient>
      </defs>
      <rect x="5" y="6" width="22" height="16" rx="2" fill="url(#fwSaas)" />
      <rect x="5" y="6" width="22" height="4.5" rx="2" fill="#2868ff" />
      <circle cx="8" cy="8.2" r=".7" fill="#cfe0ff" opacity=".6" />
      <circle cx="10.5" cy="8.2" r=".7" fill="#cfe0ff" opacity=".4" />
      <rect x="8" y="13" width="10" height="1.4" rx=".7" fill="#cfe0ff" opacity=".7" />
      <rect x="8" y="16.5" width="14" height="1.4" rx=".7" fill="#8ab8ff" opacity=".55" />
      <rect x="8" y="20" width="8" height="1.4" rx=".7" fill="#8ab8ff" opacity=".35" />
      <path d="M11 26h10" stroke="#4d88ff" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M16 22v4" stroke="#4d88ff" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  )
}

function SportIcon() {
  return (
    <svg viewBox="0 0 32 32" fill="none">
      <defs>
        <linearGradient id="fwSport" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#4d88ff" />
          <stop offset="1" stopColor="#0c2db0" />
        </linearGradient>
      </defs>
      <circle cx="16" cy="16" r="9" stroke="#4d88ff" strokeWidth="1.2" fill="url(#fwSport)" opacity=".35" />
      <path d="M16 7v18M7 16h18" stroke="#8ab8ff" strokeWidth="1" opacity=".45" />
      <path d="M9.5 9.5c3 2 4.5 4.2 4.5 6.5s-1.5 4.5-4.5 6.5M22.5 9.5c-3 2-4.5 4.2-4.5 6.5s1.5 4.5 4.5 6.5" stroke="#cfe0ff" strokeWidth="1" opacity=".5" />
      <circle cx="16" cy="16" r="2.2" fill="#bcd6ff" />
    </svg>
  )
}

const targets = [
  {
    Icon: WellnessIcon,
    title: 'Luxe & bien-être',
    desc: 'Vitrines premium pour institutes et marques exigeantes. Identité soignée, carte interactive et parcours immersif.',
  },
  {
    Icon: ArtisanIcon,
    title: 'Artisans & terrain',
    desc: 'Sites qui montrent le vrai travail sur le terrain. SEO local, pages géo et prise de contact simple pour les pros du Var.',
  },
  {
    Icon: LocalIcon,
    title: 'Services locaux',
    desc: 'Faire connaître un service du quotidien mieux qu\'une page Facebook. Devis, zones d\'intervention et crédibilité en ligne.',
  },
  {
    Icon: SaasIcon,
    title: 'Produits web & SaaS',
    desc: 'Outils en ligne qui tournent : abonnements, exports PDF, parcours utilisateur clair. Du prototype à la mise en prod.',
  },
  {
    Icon: SportIcon,
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
          Les mêmes environnements que ceux présentés plus bas : bien-être, artisans, services locaux, SaaS et structures sportives.
        </p>
      </div>

      <div className="for-who-grid reveal-grid">
        {targets.map(({ Icon, title, desc }) => (
          <div key={title} className="fw-card">
            <div className="fw-icon">
              <Icon />
            </div>
            <h3>{title}</h3>
            <p>{desc}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
