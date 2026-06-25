'use client'
import { useEffect, useRef } from 'react'
import { gsap, ScrollTrigger } from '@/lib/gsap'

export default function QuoteBand() {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.bridge-lead', { opacity: 0, y: 28 }, {
        opacity: 1, y: 0, duration: 0.9, ease: 'power3.out',
        scrollTrigger: { trigger: '.bridge-lead', start: 'top 90%' },
      })
      gsap.fromTo('.bridge-text', { opacity: 0, y: 18 }, {
        opacity: 1, y: 0, duration: 0.8, delay: 0.12, ease: 'power2.out',
        scrollTrigger: { trigger: '.bridge-text', start: 'top 92%' },
      })
      gsap.fromTo('.bridge-cta', { opacity: 0, scale: 0.94 }, {
        opacity: 1, scale: 1, duration: 0.65, delay: 0.2, ease: 'back.out(1.5)',
        scrollTrigger: { trigger: '.bridge-cta', start: 'top 94%' },
      })
    }, ref)
    return () => ctx.revert()
  }, [])

  return (
    <section id="quote-band" ref={ref}>
      <p className="bridge-lead">Un projet en tête ?</p>
      <p className="bridge-text">
        Dites-moi où vous en êtes. Je vous réponds avec une idée claire, sans engagement.
      </p>
      <div className="bridge-cta">
        <a href="#contact" className="btn-primary">
          <span>Me contacter</span>
        </a>
      </div>
    </section>
  )
}
