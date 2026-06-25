'use client'
import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const STATS = [
  { value: 100, suffix: '%',    label: 'Projets livrés en production' },
  { value: 15,  suffix: '+',    label: 'Technologies maîtrisées' },
  { value: 2,   suffix: '+ ans', label: "D'expérience terrain" },
  { value: 24,  suffix: 'h',    label: 'Pour vous répondre' },
]

export default function Stats() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const blocks = ref.current?.querySelectorAll<HTMLElement>('.stat-block')
      if (!blocks) return

      blocks.forEach((block, i) => {
        const numEl = block.querySelector<HTMLElement>('.stat-val')
        const target = +(numEl?.dataset.target ?? 0)
        const suffix = numEl?.dataset.suffix ?? ''
        const counter = { v: 0 }

        gsap.fromTo(block, { opacity: 0, y: 30 }, {
          opacity: 1, y: 0, duration: .7, delay: i * .12, ease: 'power2.out',
          scrollTrigger: { trigger: block, start: 'top 82%' },
          onStart: () => {
            counter.v = 0
            gsap.to(counter, {
              v: target,
              duration: 1.8,
              ease: 'power2.out',
              onUpdate: () => {
                if (numEl) numEl.textContent = Math.round(counter.v) + suffix
              },
            })
          },
        })
      })
    }, ref)

    return () => ctx.revert()
  }, [])

  return (
    <section id="stats">
      <div className="stats-inner">
        <div ref={ref} className="stats-grid">
          {STATS.map(s => (
            <div key={s.label} className="stat-block">
              <div className="stat-num">
                <span
                  className="stat-val"
                  data-target={s.value}
                  data-suffix={s.suffix}
                >
                  0{s.suffix}
                </span>
              </div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
