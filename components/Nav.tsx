'use client'
import { useCallback, useEffect, useRef, useState } from 'react'

const links = [
  { href: '#pour-qui', label: 'Terrain', id: 'pour-qui' },
  { href: '#services', label: 'Compétences', id: 'services' },
  { href: '#projets', label: 'Projets', id: 'projets' },
  { href: '#methode', label: 'Méthode', id: 'methode' },
] as const

const SECTION_IDS = links.map(l => l.id)

const tabLinks = [
  {
    href: '#hero',
    label: 'Accueil',
    shortLabel: 'Accueil',
    id: 'hero',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M3 10.5L12 3l9 7.5V20a1 1 0 01-1 1h-5v-6H9v6H4a1 1 0 01-1-1v-9.5z" />
      </svg>
    ),
  },
  {
    href: '#pour-qui',
    label: 'Univers',
    shortLabel: 'Univers',
    id: 'pour-qui',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <circle cx="12" cy="12" r="9" />
        <path d="M3 12h18M12 3a14 14 0 010 18M12 3a14 14 0 000 18" />
      </svg>
    ),
  },
  {
    href: '#projets',
    label: 'Projets',
    shortLabel: 'Projets',
    id: 'projets',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M4 7h16M4 12h10M4 17h14" />
        <rect x="2" y="4" width="20" height="16" rx="2" />
      </svg>
    ),
  },
  {
    href: '#contact',
    label: 'Contact',
    shortLabel: 'Contact',
    id: 'contact',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M21 15a4 4 0 01-4 4H7l-4 3V7a4 4 0 014-4h10a4 4 0 014 4z" />
      </svg>
    ),
  },
] as const

const drawerLinks = [
  { href: '#hero', label: 'Accueil', id: 'hero' },
  ...links,
  { href: '#contact', label: 'Contact', id: 'contact' },
]

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [active, setActive] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)
  const clickedRef = useRef<string | null>(null)
  const clickTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const pickActiveSection = useCallback(() => {
    if (clickedRef.current) return

    const viewportMid = window.scrollY + window.innerHeight * 0.35
    let bestId = ''
    let bestDist = Infinity

    const ids = ['hero', ...SECTION_IDS, 'contact']
    for (const id of ids) {
      const el = document.getElementById(id)
      if (!el) continue
      const rect = el.getBoundingClientRect()
      const top = rect.top + window.scrollY
      const bottom = top + rect.height
      if (viewportMid >= top && viewportMid <= bottom) {
        setActive(id)
        return
      }
      const dist = Math.min(Math.abs(viewportMid - top), Math.abs(viewportMid - bottom))
      if (dist < bestDist) {
        bestDist = dist
        bestId = id
      }
    }

    if (window.scrollY < 120) {
      setActive('hero')
      return
    }
    if (bestId) setActive(bestId)
  }, [])

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 55)
      pickActiveSection()
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    pickActiveSection()

    const ratios = new Map<string, number>()
    const obs = new IntersectionObserver(
      entries => {
        if (clickedRef.current) return
        entries.forEach(e => ratios.set(e.target.id, e.intersectionRatio))
        let best = ''
        let bestR = 0
        ratios.forEach((r, id) => {
          if (r > bestR) { bestR = r; best = id }
        })
        if (best && bestR >= 0.12) setActive(best)
      },
      { threshold: [0, 0.08, 0.15, 0.25, 0.4, 0.55, 0.7], rootMargin: '-12% 0px -50% 0px' },
    )

    ;['hero', ...SECTION_IDS, 'contact'].forEach(id => {
      const el = document.getElementById(id)
      if (el) obs.observe(el)
    })

    return () => {
      window.removeEventListener('scroll', onScroll)
      obs.disconnect()
      if (clickTimerRef.current) clearTimeout(clickTimerRef.current)
    }
  }, [pickActiveSection])

  useEffect(() => {
    document.body.classList.toggle('nav-menu-open', menuOpen)
    return () => { document.body.classList.remove('nav-menu-open') }
  }, [menuOpen])

  const onLinkClick = (id: string) => {
    setActive(id)
    setMenuOpen(false)
    clickedRef.current = id
    if (clickTimerRef.current) clearTimeout(clickTimerRef.current)
    clickTimerRef.current = setTimeout(() => {
      clickedRef.current = null
      pickActiveSection()
    }, 900)
  }

  return (
    <>
      <nav id="main-nav" className={scrolled ? 'scrolled' : ''}>
        <a href="#hero" className="nav-logo" onClick={() => onLinkClick('hero')}>
          <span className="nav-logo-text">Ulysse</span><span className="nav-dot">.</span>
        </a>

        <ul className="nav-links">
          {links.map(l => (
            <li key={l.href}>
              <a
                href={l.href}
                className={`nav-link${active === l.id ? ' nav-active' : ''}`}
                onClick={() => onLinkClick(l.id)}
                aria-current={active === l.id ? 'page' : undefined}
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="nav-actions">
          <a
            href="#contact"
            className={`nav-cta${active === 'contact' ? ' nav-cta-active' : ''}`}
            onClick={() => onLinkClick('contact')}
          >
            <span className="nav-cta-label">
              Me contacter
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden>
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </span>
          </a>

          <button
            type="button"
            className={`nav-burger${menuOpen ? ' is-open' : ''}`}
            aria-expanded={menuOpen}
            aria-controls="mobile-drawer"
            aria-label={menuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
            onClick={() => setMenuOpen(v => !v)}
          >
            <span /><span /><span />
          </button>
        </div>
      </nav>

      <div
        id="mobile-drawer"
        className={`mobile-drawer${menuOpen ? ' is-open' : ''}`}
        aria-hidden={!menuOpen}
      >
        <button
          type="button"
          className="mobile-drawer-backdrop"
          aria-label="Fermer le menu"
          onClick={() => setMenuOpen(false)}
        />
        <div className="mobile-drawer-panel">
          <p className="mobile-drawer-title">Navigation</p>
          <ul className="mobile-drawer-links">
            {drawerLinks.map(l => (
              <li key={l.href}>
                <a
                  href={l.href}
                  className={active === l.id ? 'is-active' : ''}
                  onClick={() => onLinkClick(l.id)}
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <nav className="mobile-tabbar" aria-label="Navigation principale">
        {tabLinks.map(l => (
          <a
            key={l.href}
            href={l.href}
            className={`mobile-tab${active === l.id ? ' is-active' : ''}${l.id === 'contact' ? ' mobile-tab--cta' : ''}`}
            onClick={() => onLinkClick(l.id)}
            aria-label={l.label}
            aria-current={active === l.id ? 'page' : undefined}
          >
            <span className="mobile-tab-icon">{l.icon}</span>
            <span className="mobile-tab-label">{l.shortLabel}</span>
          </a>
        ))}
      </nav>
    </>
  )
}
