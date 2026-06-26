'use client'
import { useEffect } from 'react'
import { gsap, ScrollTrigger } from '@/lib/gsap'

const EARLY_SELECTORS = '.reveal-early'

function syncEarlyReveals() {
  ScrollTrigger.refresh()
  document.querySelectorAll<HTMLElement>(EARLY_SELECTORS).forEach((el) => {
    const rect = el.getBoundingClientRect()
    if (rect.top >= window.innerHeight || rect.bottom <= 0) return
    gsap.set(el, { opacity: 1, y: 0, clearProps: 'transform' })
    ScrollTrigger.getAll()
      .filter((st) => st.trigger === el)
      .forEach((st) => st.kill())
  })

  document.querySelectorAll<HTMLElement>('.reveal-early.reveal-grid').forEach((grid) => {
    const rect = grid.getBoundingClientRect()
    if (rect.top >= window.innerHeight || rect.bottom <= 0) return
    gsap.set(grid.children, { opacity: 1, y: 0, clearProps: 'transform' })
    ScrollTrigger.getAll()
      .filter((st) => st.trigger === grid)
      .forEach((st) => st.kill())
  })
}

export default function ScrollAnimator() {
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) {
      document.querySelectorAll<HTMLElement>('.reveal, .reveal-grid > *, .reveal-early, .reveal-early.reveal-grid > *').forEach((el) => {
        el.style.opacity = '1'
        el.style.transform = 'none'
      })
      return
    }

    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('.reveal').forEach((el) => {
        const early = el.classList.contains('reveal-early')
        gsap.to(el, {
          opacity: 1,
          y: 0,
          duration: early ? 0.7 : 0.85,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: early ? 'top bottom' : 'top 94%',
            once: true,
            invalidateOnRefresh: true,
          },
        })
      })

      gsap.utils.toArray<HTMLElement>('.reveal-grid').forEach((grid) => {
        const early = grid.classList.contains('reveal-early')
        const children = grid.children
        gsap.fromTo(
          children,
          { opacity: 0, y: early ? 24 : 40 },
          {
            opacity: 1,
            y: 0,
            duration: early ? 0.6 : 0.7,
            stagger: early ? 0.06 : 0.1,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: grid,
              start: early ? 'top bottom' : 'top 92%',
              once: true,
              invalidateOnRefresh: true,
            },
          },
        )
      })

      syncEarlyReveals()
    })

    const refresh = () => {
      ScrollTrigger.refresh()
      syncEarlyReveals()
    }
    const onHash = () => window.setTimeout(syncEarlyReveals, 200)

    window.addEventListener('load', refresh)
    window.addEventListener('resize', refresh, { passive: true })
    window.addEventListener('hashchange', onHash)
    const t = window.setTimeout(syncEarlyReveals, 150)

    return () => {
      window.removeEventListener('load', refresh)
      window.removeEventListener('resize', refresh)
      window.removeEventListener('hashchange', onHash)
      window.clearTimeout(t)
      ctx.revert()
    }
  }, [])

  return null
}
