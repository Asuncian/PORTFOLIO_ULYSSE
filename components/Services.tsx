'use client'
import { useEffect, useRef, useState, lazy, Suspense } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useCanRender3D } from './useCanRender3D'

gsap.registerPlugin(ScrollTrigger)

const ServicesFlow3D = lazy(() => import('./ServicesFlow3D'))

const items = [
  { title: 'Automatiser les tâches répétitives', desc: "Relier les outils entre eux pour que confirmations, rappels et relances partent tout seuls, sans qu'on y pense." },
  { title: 'Rassembler les données', desc: "Sortir les infos des dix fichiers Excel éparpillés et les réunir au même endroit, propres et à jour." },
  { title: 'Construire des sites sur mesure', desc: 'Des interfaces rapides et lisibles, pensées mobile d’abord, qui tiennent dans le temps.' },
  { title: 'Faire dialoguer les services', desc: 'Connecter paiement, emails, SMS et bases de données via leurs API pour un ensemble cohérent.' },
  { title: 'Mettre les chiffres en clair', desc: "Des tableaux de bord qui montrent l'essentiel d'un coup d'œil, pas un rapport que personne n'ouvre." },
  { title: 'Répondre en continu', desc: 'Des chatbots et assistants pour les questions courantes et la prise de rendez-vous, à toute heure.' },
  { title: 'Déployer jusqu’en production', desc: 'Du code jusqu’au serveur : Docker, HTTPS, sauvegardes et surveillance.' },
  { title: 'Soigner le détail', desc: 'Performances, accessibilité, animations discrètes — ce qui fait qu’un produit paraît fini.' },
]

export default function Services() {
  const ref = useRef<HTMLDivElement>(null)
  const flowRef = useRef<HTMLDivElement>(null)
  const fillRef = useRef<HTMLDivElement>(null)
  const canRender = useCanRender3D()
  const [mount3d, setMount3d] = useState(false)

  // Spin up WebGL only when the section nears the viewport
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
      // Each card glides in from its own side as the line reaches it
      gsap.utils.toArray<HTMLElement>('.flow-item').forEach((el) => {
        const dir = el.classList.contains('flow-item--left') ? -36 : 36
        gsap.fromTo(el, { opacity: 0, x: dir, y: 14 }, {
          opacity: 1, x: 0, y: 0, duration: .7, ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 84%' },
        })
      })
      // Flat fallback line draws itself on scroll (when WebGL is skipped)
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
        <h2 className="section-title">Ce que je <em>sais faire</em></h2>
        <p className="section-sub">
          Les briques que je manipule au quotidien, du premier écran jusqu’au serveur.
        </p>
      </div>

      <div className={`flow ${canRender ? 'flow--3d' : 'flow--flat'}`} ref={ref}>
        {/* WebGL weaving line — drawn on scroll */}
        <div className="flow-stage" ref={flowRef} aria-hidden>
          {mount3d && (
            <Suspense fallback={null}>
              <ServicesFlow3D hostRef={flowRef} />
            </Suspense>
          )}
        </div>

        {/* Flat fallback line for low-power / reduced-motion / touch */}
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
