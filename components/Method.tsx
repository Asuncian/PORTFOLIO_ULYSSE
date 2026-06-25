'use client'
import { useEffect, useRef } from 'react'

const steps = [
  {
    num: '01',
    title: 'Comprendre',
    desc: "Je commence par comprendre le besoin : ce qui prend du temps, ce qui bloque, ce qui compte vraiment pour vous.",
  },
  {
    num: '02',
    title: 'Concevoir',
    desc: "Je vous propose une direction claire : quoi faire, dans quel ordre, et pourquoi. Sans jargon.",
  },
  {
    num: '03',
    title: 'Construire',
    desc: "Je code, je déploie, j'explique. Et je reste dispo pour ajuster une fois que c'est en ligne.",
  },
]

export default function Method() {
  const stageRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const stage = stageRef.current
    const scene = sceneRef.current
    if (!stage || !scene) return

    // Parallax tilt only where it makes sense - skip on touch / reduced-motion
    const coarse = window.matchMedia('(pointer: coarse)').matches
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (coarse || reduced) return

    let tx = 0, ty = 0, cx = 0, cy = 0, raf = 0, running = false

    const loop = () => {
      cx += (tx - cx) * 0.09
      cy += (ty - cy) * 0.09
      scene.style.transform = `rotateX(${(-cy * 5).toFixed(2)}deg) rotateY(${(cx * 8).toFixed(2)}deg)`
      if (Math.abs(tx - cx) > 0.0005 || Math.abs(ty - cy) > 0.0005) {
        raf = requestAnimationFrame(loop)
      } else {
        running = false
      }
    }
    const kick = () => { if (!running) { running = true; raf = requestAnimationFrame(loop) } }

    const onMove = (e: MouseEvent) => {
      const r = stage.getBoundingClientRect()
      tx = ((e.clientX - r.left) / r.width - 0.5) * 2
      ty = ((e.clientY - r.top) / r.height - 0.5) * 2
      kick()
    }
    const onLeave = () => { tx = 0; ty = 0; kick() }

    stage.addEventListener('mousemove', onMove, { passive: true })
    stage.addEventListener('mouseleave', onLeave, { passive: true })
    return () => {
      cancelAnimationFrame(raf)
      stage.removeEventListener('mousemove', onMove)
      stage.removeEventListener('mouseleave', onLeave)
    }
  }, [])

  return (
    <section id="methode">
      <div className="section-header reveal">
        <p className="section-tag">Méthode</p>
        <h2 className="section-title">Ma façon de <em>travailler</em></h2>
        <p className="section-sub">De la première discussion à la mise en ligne, en trois étapes.</p>
      </div>

      <div className="method-stage reveal" ref={stageRef}>
        <div className="method-scene" ref={sceneRef}>
          <span className="method-beam" aria-hidden />
          {steps.map((s, i) => (
            <article
              key={s.num}
              className="method-card3d"
              style={{ ['--i' as string]: i } as React.CSSProperties}
            >
              <span className="method-ghost" aria-hidden>{s.num}</span>
              <div className="method-num">{s.num}</div>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
              <span className="method-glint" aria-hidden />
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
