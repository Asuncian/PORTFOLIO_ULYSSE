function HotelIcon() {
  return (
    <svg viewBox="0 0 32 32" fill="none">
      <defs>
        <linearGradient id="fwHotel" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#3b78ff" />
          <stop offset="1" stopColor="#0c2db0" />
        </linearGradient>
      </defs>
      <rect x="6" y="10" width="20" height="19" rx="2" fill="url(#fwHotel)" />
      <rect x="4.5" y="8" width="23" height="3.2" rx="1.4" fill="#4d88ff" />
      <line x1="16" y1="4.8" x2="16" y2="8" stroke="#4d88ff" strokeWidth="1.1" strokeLinecap="round" />
      <circle cx="16" cy="4" r="1.5" fill="#bcd6ff" />
      <g fill="#cfe0ff">
        <rect x="9" y="14" width="3.4" height="3" rx=".6" />
        <rect x="14.3" y="14" width="3.4" height="3" rx=".6" opacity=".7" />
        <rect x="19.6" y="14" width="3.4" height="3" rx=".6" opacity=".45" />
        <rect x="9" y="19" width="3.4" height="3" rx=".6" opacity=".5" />
        <rect x="14.3" y="19" width="3.4" height="3" rx=".6" />
        <rect x="19.6" y="19" width="3.4" height="3" rx=".6" opacity=".7" />
      </g>
      <path d="M13.2 29v-3.4a2.8 2.8 0 015.6 0V29z" fill="#0a1f6e" />
      <circle cx="17.5" cy="27.2" r=".55" fill="#bcd6ff" />
    </svg>
  )
}

function RestaurantIcon() {
  return (
    <svg viewBox="0 0 32 32" fill="none">
      <defs>
        <radialGradient id="fwPlate" cx="50%" cy="42%" r="60%">
          <stop offset="0" stopColor="#2868ff" stopOpacity=".30" />
          <stop offset="1" stopColor="#0a2eb8" stopOpacity=".05" />
        </radialGradient>
      </defs>
      <circle cx="16" cy="16" r="12" fill="url(#fwPlate)" />
      <circle cx="16" cy="16" r="12" stroke="#4d88ff" strokeWidth=".9" opacity=".55" />
      <circle cx="16" cy="16" r="7.6" stroke="#8ab8ff" strokeWidth=".7" opacity=".35" />
      <g stroke="#cfe0ff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10 6.5v4.2a2.4 2.4 0 002.4 2.4h.2a2.4 2.4 0 002.4-2.4V6.5" />
        <line x1="12.5" y1="6.5" x2="12.5" y2="10.5" />
        <line x1="12.6" y1="13.1" x2="12.6" y2="25.5" />
        <path d="M21 6.5c1.7 1.5 1.9 4.3 1.4 6.6-.3 1.4-1.4 1.9-1.4 1.9" />
        <line x1="21" y1="15" x2="21" y2="25.5" />
      </g>
    </svg>
  )
}

function HouseIcon() {
  return (
    <svg viewBox="0 0 32 32" fill="none">
      <defs>
        <linearGradient id="fwHouse" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#3b78ff" />
          <stop offset="1" stopColor="#0c2db0" />
        </linearGradient>
      </defs>
      <path d="M16 4 4 13.5h24z" fill="#4d88ff" />
      <path d="M6.5 13.5h19V29h-19z" fill="url(#fwHouse)" />
      <rect x="20" y="6.5" width="2.6" height="4" rx=".5" fill="#4d88ff" />
      <path d="M23.5 5.6c1.2.3 1.2 1.5 2.4 1.8" stroke="#8ab8ff" strokeWidth="1" strokeLinecap="round" opacity=".6" />
      <rect x="9.5" y="17" width="4" height="4" rx=".7" fill="#cfe0ff" opacity=".8" />
      <rect x="18.5" y="17" width="4" height="4" rx=".7" fill="#cfe0ff" opacity=".55" />
      <path d="M13.6 29v-4.4a2.4 2.4 0 014.8 0V29z" fill="#0a1f6e" />
      <circle cx="17.4" cy="26.4" r=".5" fill="#bcd6ff" />
    </svg>
  )
}

function CalendarIcon() {
  return (
    <svg viewBox="0 0 32 32" fill="none">
      <defs>
        <linearGradient id="fwCal" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1e40af" />
          <stop offset="1" stopColor="#0a2486" />
        </linearGradient>
      </defs>
      <rect x="4" y="7" width="24" height="22" rx="2.5" fill="url(#fwCal)" />
      <rect x="4" y="7" width="24" height="7" rx="2.5" fill="#2868ff" />
      <rect x="4" y="11.5" width="24" height="2.5" fill="#2868ff" />
      <rect x="10" y="4.5" width="2.8" height="5" rx="1.2" fill="#8ab8ff" />
      <rect x="19.2" y="4.5" width="2.8" height="5" rx="1.2" fill="#8ab8ff" />
      <g fill="#4d88ff">
        <rect x="8" y="18" width="3.4" height="3.4" rx=".7" opacity=".55" />
        <rect x="14.3" y="18" width="3.4" height="3.4" rx=".7" opacity=".75" />
        <rect x="20.6" y="18" width="3.4" height="3.4" rx=".7" opacity=".4" />
        <rect x="8" y="23.5" width="3.4" height="3.4" rx=".7" opacity=".35" />
      </g>
      <rect x="14.3" y="23.5" width="3.4" height="3.4" rx=".7" fill="#bcd6ff" />
    </svg>
  )
}

function WrenchIcon() {
  return (
    <svg viewBox="0 0 32 32" fill="none">
      <defs>
        <linearGradient id="fwHat" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#4d88ff" />
          <stop offset="1" stopColor="#0c2db0" />
        </linearGradient>
      </defs>
      {/* dome */}
      <path d="M6 21v-1a10 10 0 0120 0v1z" fill="url(#fwHat)" />
      {/* ridges */}
      <path d="M16 9.4V21" stroke="#bcd6ff" strokeWidth="1.2" opacity=".5" strokeLinecap="round" />
      <path d="M11.4 10.8 10.2 21M20.6 10.8 21.8 21" stroke="#8ab8ff" strokeWidth="1.1" opacity=".45" strokeLinecap="round" />
      {/* front crest */}
      <path d="M13 21v-2.4a3 3 0 016 0V21z" fill="#2868ff" />
      {/* brim */}
      <rect x="3.2" y="21" width="25.6" height="3.7" rx="1.85" fill="#4d88ff" />
      <rect x="3.2" y="21" width="25.6" height="1.5" rx=".75" fill="#cfe0ff" opacity=".5" />
    </svg>
  )
}

const targets = [
  {
    Icon: HotelIcon,
    title: 'Hôtels',
    desc: "Moins de tensions entre les équipes, et les infos qui ne se perdent plus au changement de service.",
  },
  {
    Icon: RestaurantIcon,
    title: 'Restaurants',
    desc: "Réservations, rappels, service en salle : moins d'appels à passer et moins d'oublis le soir du coup de feu.",
  },
  {
    Icon: HouseIcon,
    title: "Maisons d'hôtes",
    desc: "Confirmations automatiques, suivi des séjours. Plus besoin du tableur avec ses formules cassées.",
  },
  {
    Icon: CalendarIcon,
    title: 'Hébergements indépendants',
    desc: 'Un seul calendrier pour tout voir, toutes plateformes confondues. Sans se connecter partout.',
  },
  {
    Icon: WrenchIcon,
    title: 'Artisans',
    desc: 'Un site propre et des outils simples pour les paysagistes, élagage, BTP. On part de ce que vous avez.',
  },
]

export default function ForWho() {
  return (
    <section id="pour-qui">
      <div className="section-header reveal">
        <p className="section-tag">Secteurs</p>
        <h2 className="section-title">J'ai déjà <em>construit pour eux</em></h2>
        <p className="section-sub">
          Des métiers de terrain que j'ai appris à connaître. J'y ai pris l'habitude de faire des outils simples, qu'on prend en main tout de suite.
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
