'use client'
import { useEffect, useRef, useState, lazy, Suspense } from 'react'
import { gsap } from '@/lib/gsap'
import { useCanRender3D } from './useCanRender3D'

const ServicesFlow3D = lazy(() => import('./ServicesFlow3D'))

const items = [
  {
    title: 'Workflows n8n/Make',
    desc: 'Synchronisation, génération de posts et de visuels sur les réseaux. Des scénarios en production, sans devoir y toucher tous les jours.',
  },
  {
    title: 'Centralisation de données',
    desc: 'Airtable, Supabase, Drive, CRM. Pour tout centraliser au même endroit, et ne plus perdre d\'information.',
  },
  {
    title: 'Emails et relances',
    desc: 'Bienvenue, rappels, relances prospects, mails adhérents. Des séquences qui partent en autonomie, au bon moment.',
  },
  {
    title: 'CRM et outils métier',
    desc: 'Apps internes pour suivre les partenaires, facturer et notifier. Pensées et organisées pour le quotidien des équipes.',
  },
  {
    title: 'Sites vitrines et apps web',
    desc: 'React, Next.js, Vite, Node.js, Django... Des vitrines claires pour convertir, et des applis fonctionnelles, le tout en production.',
  },
  {
    title: 'Formulaires et webhooks',
    desc: 'Collecte des infos et envoi automatique vers les bons outils. Une demande arrive, le process démarre.',
  },
  {
    title: 'Agents IA et LLM',
    desc: 'Posts, visuels, skills Claude, chaînes d\'agents. L\'IA branchée sur les process qui en ont besoin, avec des garde-fous simples pour garder la main.',
  },
  {
    title: 'Déploiement Docker et VPS',
    desc: 'Mise en production, HTTPS, monitoring basique. Du code sécurisé qui tourne proprement.',
  },
]

export default function Services() {
  const ref = useRef<HTMLDivElement>(null)
  const flowRef = useRef<HTMLDivElement>(null)
  const fillRef = useRef<HTMLDivElement>(null)
  const canRender = useCanRender3D()
  const [mount3d, setMount3d] = useState(false)

  useEffect(() => {
    if (!canRender || !flowRef.current) return
    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setMount3d(true); io.disconnect() } },
      { rootMargin: '400px' },
    )
    io.observe(flowRef.current)
    return () => io.disconnect()
  }, [canRender])

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('.flow-item').forEach((el) => {
        const dir = el.classList.contains('flow-item--left') ? -36 : 36
        gsap.fromTo(el, { opacity: 0, x: dir, y: 14 }, {
          opacity: 1, x: 0, y: 0, duration: .7, ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 93%' },
        })
      })

      if (!canRender && fillRef.current) {
        gsap.fromTo(fillRef.current, { scaleY: 0 }, {
          scaleY: 1, ease: 'none',
          scrollTrigger: { trigger: ref.current, start: 'top 70%', end: 'bottom 80%', scrub: 0.5 },
        })
      }
    }, ref)
    return () => ctx.revert()
  }, [canRender])

  return (
    <section id="services">
      <div className="section-header reveal">
        <p className="section-tag">Compétences</p>
        <h2 className="section-title">Ce que je <em>maîtrise</em></h2>
        <p className="section-sub">
          Automatisations, sites vitrines, apps fonctionnelles, intégrations et mise en production : ce que je fais au quotidien.
        </p>
      </div>

      <div className={`flow ${canRender ? 'flow--3d' : 'flow--flat'}`} ref={ref}>
        <div className="flow-stage" ref={flowRef} aria-hidden>
          {mount3d && (
            <Suspense fallback={null}>
              <ServicesFlow3D hostRef={flowRef} />
            </Suspense>
          )}
        </div>

        {!canRender && (
          <div className="flow-flat-line" aria-hidden>
            <div className="flow-flat-fill" ref={fillRef} />
          </div>
        )}

        <ol className="flow-list">
          {items.map((item, i) => (
            <li key={item.title} className={`flow-item flow-item--${i % 2 ? 'left' : 'right'}`}>
              <span className="flow-node" aria-hidden><i>{`0${i + 1}`}</i></span>
              <div className="flow-card">
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
