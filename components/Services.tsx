'use client'
import { useEffect, useRef, useState, lazy, Suspense } from 'react'
import { gsap } from '@/lib/gsap'
import { useCanRender3D } from './useCanRender3D'

const ServicesFlow3D = lazy(() => import('./ServicesFlow3D'))

const items = [
  { title: 'Workflows n8n/Make', desc: 'Synchronisation entre outils, déclencheurs et scénarios automatisés.' },
  { title: 'Centralisation de données', desc: 'API, bases et fichiers rassemblés au même endroit.' },
  { title: "Emails automatiques", desc: 'Confirmations, rappels et relances sans intervention manuelle.' },
  { title: 'CRM et outils métier', desc: 'Apps internes adaptées au fonctionnement de l\'équipe.' },
  { title: 'Sites et apps React/Next.js', desc: 'Interfaces claires, performantes et responsive.' },
  { title: 'Formulaires et webhooks', desc: 'Collecte de données et connexion aux services tiers.' },
  { title: 'Intégrations LLM / agents IA', desc: 'Automatisation de tâches répétitives via LLM et API.' },
  { title: 'Déploiement Docker, VPS', desc: 'Mise en production, HTTPS et monitoring basique.' },
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
          Automatisation, dev web, intégrations et mise en prod : ce que je fais au quotidien.
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
