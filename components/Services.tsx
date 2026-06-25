'use client'
import { useEffect, useRef, useState, lazy, Suspense } from 'react'
import { gsap } from '@/lib/gsap'
import { useCanRender3D } from './useCanRender3D'

const ServicesFlow3D = lazy(() => import('./ServicesFlow3D'))

const items = [
  { title: 'Automatisation des réservations', desc: 'Un calendrier unique, synchronisé entre Booking, le site et les demandes directes.' },
  { title: 'Centralisation des données clients', desc: 'Toutes les infos au même endroit, sans fichiers éparpillés.' },
  { title: "Envoi automatique d'emails", desc: 'Confirmations, rappels et relances qui partent tout seuls.' },
  { title: 'CRM sur mesure', desc: 'Un CRM léger, pensé pour une activité précise.' },
  { title: 'Sites vitrines modernes', desc: 'Rapides, propres, lisibles sur mobile. Juste ce qu\'il faut pour donner envie.' },
  { title: 'Formulaires personnalisés', desc: 'Devis, contact, prise de rendez-vous, reliés directement aux bons outils.' },
  { title: 'Réponses sur le site', desc: 'Les visiteurs posent leurs questions courantes et prennent rendez-vous sans vous déranger.' },
  { title: 'Tableaux de bord', desc: 'Les indicateurs utiles d\'un coup d\'œil, directement exploitables.' },
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
        <h2 className="section-title">Ce que je <em>construis</em></h2>
        <p className="section-sub">
          Ce que je fais au quotidien, du site jusqu'au déploiement.
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
