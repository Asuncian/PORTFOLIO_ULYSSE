'use client'
import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function QuoteBand() {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.qb-quote', { opacity: 0, y: 40 }, {
        opacity: 1, y: 0, duration: 1.1, ease: 'power3.out',
        scrollTrigger: { trigger: '.qb-quote', start: 'top 80%' }
      })
      gsap.fromTo('.qb-attr', { opacity: 0 }, {
        opacity: 1, duration: .8, delay: .3, ease: 'power2.out',
        scrollTrigger: { trigger: '.qb-attr', start: 'top 82%' }
      })
      gsap.fromTo('.qb-cta', { opacity: 0, scale: .9 }, {
        opacity: 1, scale: 1, duration: .7, delay: .4, ease: 'back.out(1.5)',
        scrollTrigger: { trigger: '.qb-cta', start: 'top 85%' }
      })
    }, ref)
    return () => ctx.revert()
  }, [])

  return (
    <section id="quote-band" ref={ref}>
      <p className="quote-text qb-quote">
        «&nbsp;Un bon outil, c'est celui qu'on finit par oublier,
        parce qu'il fait <strong>simplement son travail.</strong>&nbsp;»
      </p>
      <p className="quote-attr qb-attr">- Ulysse Goming Jobert</p>
      <div className="quote-band-cta qb-cta">
        <a href="#contact" className="btn-primary">
          <span>Me contacter</span>
        </a>
      </div>
    </section>
  )
}
