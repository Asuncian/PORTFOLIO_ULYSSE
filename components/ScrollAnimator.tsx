'use client'
import { useEffect } from 'react'
import { gsap } from '@/lib/gsap'

export default function ScrollAnimator() {
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) {
      document.querySelectorAll<HTMLElement>('.reveal, .reveal-grid > *').forEach((el) => {
        el.style.opacity = '1'
        el.style.transform = 'none'
      })
      return
    }

    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('.reveal').forEach((el) => {
        gsap.to(el, {
          opacity: 1,
          y: 0,
          duration: 0.85,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 84%',
          },
        })
      })

      gsap.utils.toArray<HTMLElement>('.reveal-grid').forEach((grid) => {
        const children = grid.children
        gsap.fromTo(
          children,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            stagger: 0.1,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: grid,
              start: 'top 82%',
            },
          },
        )
      })
    })

    return () => ctx.revert()
  }, [])

  return null
}
