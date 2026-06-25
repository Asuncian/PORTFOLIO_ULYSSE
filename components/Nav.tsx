'use client'
import { useEffect, useState } from 'react'

const links = [
  { href: '#pour-qui', label: 'Terrain',     id: 'pour-qui' },
  { href: '#services', label: 'Compétences', id: 'services' },
  { href: '#projets',  label: 'Projets',     id: 'projets'  },
  { href: '#methode',  label: 'Méthode',     id: 'methode'  },
]

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [active,   setActive]   = useState('')

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 55)
    window.addEventListener('scroll', onScroll, { passive: true })

    const obs = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) setActive(e.target.id) }),
      { threshold: 0.25, rootMargin: '-5% 0px -65% 0px' }
    )
    links.forEach(l => { const el = document.getElementById(l.id); if (el) obs.observe(el) })
    return () => { window.removeEventListener('scroll', onScroll); obs.disconnect() }
  }, [])

  return (
    <nav id="main-nav" className={scrolled ? 'scrolled' : ''}>
      <a href="#hero" className="nav-logo">
        <span className="nav-logo-text">Ulysse</span><span className="nav-dot">.</span>
      </a>

      <ul className="nav-links">
        {links.map(l => (
          <li key={l.href}>
            <a href={l.href} className={`nav-link${active === l.id ? ' nav-active' : ''}`}>
              {l.label}
            </a>
          </li>
        ))}
      </ul>

      <a href="#contact" className="nav-cta">
        <span>Me contacter</span>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <path d="M5 12h14M12 5l7 7-7 7"/>
        </svg>
      </a>
    </nav>
  )
}
