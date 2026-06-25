'use client'
import { useEffect, useRef } from 'react'
import Image from 'next/image'
import { gsap } from '@/lib/gsap'

type ProjectStatus = 'live' | 'private' | 'beta'
interface Project {
  name: string
  type: string
  theme: string
  logoSrc: string
  logoStyle?: React.CSSProperties
  desc: string
  url: string | null
  status: ProjectStatus
}

const projects: Project[] = [
  {
    name: 'BloomYourself Academy',
    type: 'Site vitrine luxe',
    theme: 't-bloom',
    logoSrc: '/logo-bloom-yourself.png',
    logoStyle: { background: '#fff', padding: '6px' },
    desc: 'Trois univers sur une seule vitrine : Academy, Agency et Institut Maison Bloom. Carte interactive, scroll soigné, identité premium pour la Côte d\'Azur.',
    url: 'bloomyourselfacademy.com',
    status: 'live',
  },
  {
    name: 'Enzo Élagage',
    type: 'Site artisan',
    theme: 't-nature',
    logoSrc: '/logo-enzo-elagage.png',
    logoStyle: { background: '#fff', padding: '4px' },
    desc: 'Un site qui montre le vrai travail de terrain. SEO local, pages géo générées et scroll fluide pour un artisan élagage en Provence.',
    url: 'enzo-elagage-var.fr',
    status: 'live',
  },
  {
    name: 'Allodav Services',
    type: 'Site vitrine',
    theme: 't-amber',
    logoSrc: '/logo-allodav.png',
    logoStyle: { background: '#0a0a0a' },
    desc: 'Pour faire connaître un service local qui mérite mieux qu\'une page Facebook. Location de bennes dans le Var, avec un site fluide et soigné.',
    url: 'allodavservices83.fr',
    status: 'live',
  },
  {
    name: 'CVNova',
    type: 'Plateforme SaaS',
    theme: 't-violet',
    logoSrc: '/logo-cvnova.png',
    logoStyle: { background: '#faf5ff', padding: '4px' },
    desc: 'Ton prochain entretien commence par un bon CV. Templates soignés, export PDF et abonnement premium, sans se prendre la tête avec Word.',
    url: 'cvnova.fr',
    status: 'live',
  },
  {
    name: 'CRM HTV Basket',
    type: 'Outil métier',
    theme: 't-sport',
    logoSrc: '/logo-htv-basket.png',
    logoStyle: { background: '#fff', padding: '2px' },
    desc: 'Tout ce qu\'il faut pour suivre ses partenaires sans se noyer dans les tableurs. Prospects, clients, facturation et relances pour Hyères Toulon Var Basket.',
    url: null,
    status: 'private',
  },
]

export default function Projects() {
  const showcaseRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const cleanups: Array<() => void> = []

    const ctx = gsap.context(() => {
      const strips = showcaseRef.current?.querySelectorAll<HTMLElement>('.proj-strip')
      if (!strips) return

      strips.forEach((strip, i) => {
        const dir = i % 2 === 0 ? -70 : 70
        gsap.fromTo(strip,
          { opacity: 0, x: dir },
          {
            opacity: 1, x: 0, duration: 1.1, ease: 'power3.out',
            scrollTrigger: { trigger: strip, start: 'top 93%' },
          }
        )

        const tilt = (cx: number, cy: number, rect: DOMRect) => {
          const x = ((cx - rect.left) / rect.width  - .5) * 12
          const y = ((cy - rect.top)  / rect.height - .5) * -8
          gsap.to(strip, {
            rotateX: y, rotateY: x, scale: 1.012, z: 30,
            duration: .5, ease: 'power2.out', transformPerspective: 1000,
          })
        }
        const reset = () => gsap.to(strip, {
          rotateX: 0, rotateY: 0, scale: 1, z: 0,
          duration: 1, ease: 'elastic.out(1,.4)',
        })

        const onMove  = (e: MouseEvent) => tilt(e.clientX, e.clientY, strip.getBoundingClientRect())
        const onTouch = (e: TouchEvent) => {
          const t = e.touches[0]
          if (t) tilt(t.clientX, t.clientY, strip.getBoundingClientRect())
        }
        strip.addEventListener('mousemove', onMove)
        strip.addEventListener('mouseleave', reset)
        strip.addEventListener('touchmove',  onTouch, { passive: true })
        strip.addEventListener('touchend',   reset)

        cleanups.push(() => {
          strip.removeEventListener('mousemove', onMove)
          strip.removeEventListener('mouseleave', reset)
          strip.removeEventListener('touchmove', onTouch)
          strip.removeEventListener('touchend', reset)
        })
      })
    }, showcaseRef)

    return () => {
      cleanups.forEach((fn) => fn())
      ctx.revert()
    }
  }, [])

  return (
    <section id="projets">
      <div className="section-header reveal">
        <p className="section-tag">Projets</p>
        <h2 className="section-title">Ce que j'ai <em>livré</em></h2>
        <p className="section-sub">
          Ce ne sont pas des exercices de style : chaque projet répond à un besoin réel, pour une structure qui l'utilise au quotidien.
        </p>
      </div>

      <div ref={showcaseRef} className="proj-showcase">
        {projects.map((proj, i) => (
          <div key={proj.name} className={`proj-strip ${proj.theme}${i % 2 === 1 ? ' alt' : ''}`}>
            <div className="strip-bg-glow" aria-hidden />
            <div className="strip-shine"   aria-hidden />

            {/* Soft marine waves - layered, slow, themed by --accent */}
            <div className="strip-waves" aria-hidden>
              <svg className="wave wave-1" viewBox="0 0 1440 220" preserveAspectRatio="none">
                <path d="M0,128 C240,200 480,40 720,96 C960,152 1200,72 1440,120 L1440,220 L0,220 Z" />
              </svg>
              <svg className="wave wave-2" viewBox="0 0 1440 220" preserveAspectRatio="none">
                <path d="M0,160 C260,90 520,180 760,150 C1020,118 1240,190 1440,150 L1440,220 L0,220 Z" />
              </svg>
              <svg className="wave wave-3" viewBox="0 0 1440 220" preserveAspectRatio="none">
                <path d="M0,188 C300,150 600,210 900,184 C1140,162 1320,200 1440,182 L1440,220 L0,220 Z" />
              </svg>
            </div>

            {/* Visual */}
            <div className="strip-visual">
              <div className="strip-logo-frame" style={proj.logoStyle}>
                <Image
                  src={proj.logoSrc}
                  alt={proj.name}
                  width={110}
                  height={110}
                  style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                />
              </div>
              <div className="strip-orb" aria-hidden />
            </div>

            {/* Content */}
            <div className="strip-content">
              <div className="strip-meta">
                <span className="proj-type">{proj.type}</span>
                {proj.status === 'live'    && <span className="proj-status proj-status-live">Live</span>}
                {proj.status === 'beta'    && <span className="proj-status proj-status-beta">Bêta</span>}
                {proj.status === 'private' && <span className="proj-status proj-status-private">Privé</span>}
              </div>
              <h3 className="strip-title">{proj.name}</h3>
              <p className="strip-desc">{proj.desc}</p>
              <div className="strip-footer">
                {proj.url ? (
                  <a href={`https://${proj.url}`} target="_blank" rel="noopener noreferrer" className="proj-link">
                    {proj.url}<span className="proj-link-arrow">↗</span>
                  </a>
                ) : (
                  <span className="proj-private-note">
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
                    Accès protégé par login
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="proj-more reveal">
        <p className="proj-more-text">
          Ce n'est qu'un <em>aperçu</em>. D'autres sites et outils internes tournent déjà,
          parfois en accès privé.
        </p>
      </div>
    </section>
  )
}
