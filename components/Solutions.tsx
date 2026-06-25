function AutoIcon() {
  return (
    <svg viewBox="0 0 32 32" fill="none">
      <circle cx="16" cy="16" r="13" stroke="#7c3aed" strokeWidth=".5" opacity=".4"/>
      <path d="M16 5A11 11 0 0127 16" stroke="#60a5fa" strokeWidth="2" strokeLinecap="round"/>
      <path d="M27 16A11 11 0 0116 27" stroke="#818cf8" strokeWidth="2" strokeLinecap="round"/>
      <path d="M16 27A11 11 0 015 16" stroke="#a78bfa" strokeWidth="2" strokeLinecap="round"/>
      <path d="M5 16A11 11 0 0116 5" stroke="#60a5fa" strokeWidth="2" strokeLinecap="round" strokeDasharray="3 2"/>
      <path d="M24 12.5l3.2 3.5-3.2 3.5" stroke="#60a5fa" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="16" cy="16" r="5" fill="#7c3aed" opacity=".2"/>
      <path d="M17.5 11.5l-3 4.5h3l-3 4.5" stroke="#fbbf24" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

function CodeIcon() {
  return (
    <svg viewBox="0 0 32 32" fill="none">
      <rect x="3" y="5" width="26" height="22" rx="3" fill="#1e3a5f" opacity=".7"/>
      <rect x="3" y="5" width="26" height="6" rx="3" fill="#1e40af" opacity=".8"/>
      <rect x="3" y="8" width="26" height="3" fill="#1e40af" opacity=".8"/>
      <circle cx="8"  cy="8" r="1.3" fill="#ef4444"/>
      <circle cx="12" cy="8" r="1.3" fill="#fbbf24"/>
      <circle cx="16" cy="8" r="1.3" fill="#22c55e"/>
      <path d="M10 16l-4 3 4 3" stroke="#60a5fa" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M22 16l4 3-4 3" stroke="#818cf8" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M18 15l-4 8" stroke="#a78bfa" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  )
}

function ServerIcon() {
  return (
    <svg viewBox="0 0 32 32" fill="none">
      <rect x="3" y="4"  width="26" height="7" rx="2" fill="#1e3a5f"/>
      <rect x="3" y="4"  width="26" height="7" rx="2" stroke="#3b82f6" strokeWidth=".7"/>
      <rect x="3" y="13" width="26" height="7" rx="2" fill="#1e3a5f"/>
      <rect x="3" y="13" width="26" height="7" rx="2" stroke="#3b82f6" strokeWidth=".7"/>
      <rect x="3" y="22" width="26" height="7" rx="2" fill="#1e3a5f"/>
      <rect x="3" y="22" width="26" height="7" rx="2" stroke="#3b82f6" strokeWidth=".7"/>
      <line x1="7" y1="7.5" x2="16" y2="7.5" stroke="#4b5563" strokeWidth="1.2" strokeLinecap="round"/>
      <line x1="7" y1="16.5" x2="14" y2="16.5" stroke="#4b5563" strokeWidth="1.2" strokeLinecap="round"/>
      <line x1="7" y1="25.5" x2="16" y2="25.5" stroke="#4b5563" strokeWidth="1.2" strokeLinecap="round"/>
      <circle cx="24" cy="7.5"  r="1.8" fill="#22c55e"/>
      <circle cx="24" cy="16.5" r="1.8" fill="#22c55e" opacity=".7"/>
      <circle cx="24" cy="25.5" r="1.8" fill="#fbbf24"/>
      <circle cx="24" cy="7.5"  r="3" fill="#22c55e" opacity=".2"/>
    </svg>
  )
}

const cols = [
  {
    Icon: AutoIcon,
    title: 'Automatisation',
    items: [
      'Workflows n8n ou Make sur mesure',
      'Emails automatiques : confirmations, rappels, relances',
      'Synchronisation réservations et suivi clients',
      'Réponses automatiques aux questions courantes et prise de RDV',
    ],
  },
  {
    Icon: CodeIcon,
    title: 'Développement web',
    items: [
      'Sites rapides, mobiles, qui durent',
      'Formulaires reliés directement à vos outils',
      'Un site qui montre clairement ce que vous faites',
      'Performances et accessibilité intégrées dès le départ',
    ],
  },
  {
    Icon: ServerIcon,
    title: 'Infrastructure',
    items: [
      'Hébergement sur VPS, déploiement Docker avec Dokploy',
      'HTTPS, sauvegardes et surveillance des serveurs',
      'Domaine et DNS via Infomaniak',
      'Maintenance et correctifs de sécurité réguliers',
    ],
  },
]

export default function Solutions() {
  return (
    <section id="solutions" style={{ padding: '7rem 2rem' }}>
      <div className="section-header reveal">
        <p className="section-tag">Expertise</p>
        <h2 className="section-title">Trois <em>domaines</em></h2>
        <p className="section-sub">
          Là où je suis le plus à l'aise : de l'idée jusqu'au serveur.
        </p>
      </div>

      <div className="pillars reveal-grid">
        {cols.map(({ Icon, title, items }, i) => (
          <article key={title} className="pillar">
            <span className="pillar-index" aria-hidden>{`0${i + 1}`}</span>
            <span className="pillar-edge" aria-hidden />
            <div className="pillar-icon">
              <Icon />
            </div>
            <h3>{title}</h3>
            <ul>
              {items.map(item => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  )
}
