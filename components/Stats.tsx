'use client'
import { useEffect, useRef } from 'react'
import { gsap } from '@/lib/gsap'

type CounterStat = { kind: 'counter'; value: number; suffix: string; label: string }
type TextStat = { kind: 'text'; text: string; label: string }
type Stat = CounterStat | TextStat

const STATS: Stat[] = [
  { kind: 'counter', value: 100, suffix: '%', label: 'Projets en prod' },
  { kind: 'counter', value: 15, suffix: '+', label: 'Technologies' },
  { kind: 'counter', value: 2, suffix: ' ans+', label: 'Expérience terrain' },
  { kind: 'text', text: 'Oct. 2026', label: 'Disponibilité' },
]

export default function Stats() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const blocks = ref.current?.querySelectorAll<HTMLElement>('.stat-block')
      if (!blocks) return

      blocks.forEach((block, i) => {
        const numEl = block.querySelector<HTMLElement>('.stat-val')
        if (!numEl) return

        const isText = numEl.dataset.kind === 'text'

        gsap.fromTo(block, { opacity: 0, y: 30 }, {
          opacity: 1, y: 0, duration: .7, delay: i * .12, ease: 'power2.out',
          scrollTrigger: { trigger: block, start: 'top 92%' },
          onStart: () => {
            if (isText) {
              numEl.textContent = numEl.dataset.text ?? ''
              return
            }

            const target = +(numEl.dataset.target ?? 0)
            const suffix = numEl.dataset.suffix ?? ''
            const counter = { v: 0 }
            counter.v = 0
            gsap.to(counter, {
              v: target,
              duration: 1.8,
              ease: 'power2.out',
              onUpdate: () => {
                numEl.textContent = Math.round(counter.v) + suffix
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
                {s.kind === 'counter' ? (
                  <span
                    className="stat-val"
                    data-kind="counter"
                    data-target={s.value}
                    data-suffix={s.suffix}
                  >
                    0{s.suffix}
                  </span>
                ) : (
                  <span className="stat-val stat-val--text" data-kind="text" data-text={s.text}>
                    {s.text}
                  </span>
                )}
              </div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
