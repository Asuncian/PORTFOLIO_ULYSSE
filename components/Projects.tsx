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
  desc: string
  url: string | null
  status: ProjectStatus
}

const projects: Project[] = [
  {
    name: 'BloomYourself',
    type: 'Formation & bien-être',
    theme: 't-bloom',
    logoSrc: '/logo-bloom-yourself.png',
    desc: 'Centre de formation beauté certifié Qualiopi à Fréjus : difficile de faire remonter les parcours quand institut, agence et academy cohabitent. La vitrine met les formations (regard, onglerie, massage, reconversion) au premier plan pour que les visiteurs comprennent vite l\'offre et passent à l\'action.',
    url: 'bloomyourselfacademy.com',
    status: 'live',
  },
  {
    name: 'Enzo Élagage',
    type: 'Élagage & paysage',
    theme: 't-nature',
    logoSrc: '/logo-enzo-elagage.png',
    desc: 'Élagueur-grimpeur dans le Var : les recherches locales noient souvent l\'activité dans des annuaires génériques. Le site montre les chantiers, décline une page par commune pour le référencement local et un formulaire clair pour demander un devis sans perdre de temps.',
    url: 'enzo-elagage-var.fr',
    status: 'live',
  },
  {
    name: 'Allodav Services',
    type: 'Location de bennes',
    theme: 't-amber',
    logoSrc: '/logo-allodav.png',
    desc: 'Location de bennes dans le Var : particuliers comme pros du bâtiment ont besoin de savoir vite quoi louer et où. La vitrine détaille les prestations et zones d\'intervention, avec un contact direct pour lancer une demande sans aller-retour inutile.',
    url: 'allodavservices83.fr',
    status: 'live',
  },
  {
    name: 'CVNova',
    type: 'CV & candidature',
    theme: 't-violet',
    logoSrc: '/logo-cvnova.png',
    desc: 'Rédaction de CV et lettres de motivation sur mesure : difficile de choisir une formule sans voir le travail réel. Le site présente les offres, des réalisations à parcourir et un contact simple pour orienter chaque demande avant de commander.',
    url: 'cvnova.fr',
    status: 'live',
  },
  {
    name: 'CRM HTV Basket',
    type: 'Outil métier',
    theme: 't-sport',
    logoSrc: '/logo-htv-basket.png',
    desc: 'Club de basket HTV : prospects, clients, devis et relances étaient éparpillés entre tableurs et messagerie. L\'outil rassemble tout le suivi commercial en un seul endroit, adapté au rythme et aux habitudes de l\'équipe.',
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
          Des projets partis d'un besoin réel, utilisés au quotidien par ceux qui les ont commandés.
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

            <div className="strip-layout">
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

              <div className="strip-logo-side" aria-hidden>
                <Image
                  src={proj.logoSrc}
                  alt=""
                  width={220}
                  height={220}
                  className="strip-logo-img"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="proj-more reveal">
        <p className="proj-more-text">
          D'autres sites et outils internes tournent déjà en prod, dont certains en accès réservé.
        </p>
      </div>
    </section>
  )
}
