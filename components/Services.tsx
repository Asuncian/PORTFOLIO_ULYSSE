'use client'
import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const items = [
  { title: 'Automatisation des réservations', desc: 'Un calendrier unique, synchronisé entre Booking, le site et les demandes directes.' },
  { title: 'Centralisation des données clients', desc: 'Toutes les infos au même endroit. Fini les fichiers Excel éparpillés.' },
  { title: "Envoi automatique d'emails", desc: 'Confirmations, rappels et relances qui partent tout seuls.' },
  { title: 'CRM sur mesure', desc: "Un outil de suivi taillé pour une activité, pas une usine à gaz." },
  { title: 'Sites vitrines modernes', desc: 'Rapides, propres, lisibles sur mobile. Juste ce qu\'il faut pour donner envie.' },
  { title: 'Formulaires personnalisés', desc: 'Devis, contact, prise de rendez-vous, reliés directement aux bons outils.' },
  { title: 'Chatbots & assistants', desc: 'Disponibles en continu pour les questions courantes et la prise de rendez-vous.' },
  { title: 'Tableaux de bord', desc: 'Les indicateurs utiles d\'un coup d\'œil. Pas un rapport que personne ne lit.' },
]

export default function Services() {
  const ref = useRef<HTMLDivElement>(null)
  const fillRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // The thread draws itself as you scroll through the section
      if (fillRef.current) {
        gsap.fromTo(fillRef.current, { scaleY: 0 }, {
          scaleY: 1, ease: 'none',
          scrollTrigger: { trigger: ref.current, start: 'top 65%', end: 'bottom 75%', scrub: 0.5 },
        })
      }
      // Each link of the thread snaps into place in turn
      gsap.utils.toArray<HTMLElement>('.lever').forEach((el) => {
        gsap.fromTo(el, { opacity: 0, x: -24 }, {
          opacity: 1, x: 0, duration: .6, ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 86%' },
        })
      })
    }, ref)
    return () => ctx.revert()
  }, [])

  return (
    <section id="services">
      <div className="section-header reveal">
        <p className="section-tag">Compétences</p>
        <h2 className="section-title">Ce que je <em>construis</em></h2>
        <p className="section-sub">
          Les briques que je manipule au quotidien, du front jusqu'au déploiement.
        </p>
      </div>

      <div className="levers" ref={ref}>
        <div className="levers-line" aria-hidden>
          <div className="levers-line-fill" ref={fillRef} />
        </div>
        {items.map((item, i) => (
          <div key={item.title} className="lever">
            <div className="lever-node"><span>{`0${i + 1}`}</span></div>
            <div className="lever-body">
              <h3>{item.title}</h3>
              <p>{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
