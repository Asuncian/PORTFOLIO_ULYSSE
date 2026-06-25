'use client'
import { useEffect } from 'react'
import { gsap, ScrollTrigger } from '@/lib/gsap'

const REVEAL_SELECTORS = '.reveal-contact, .reveal-contact-form'

/** Affiche les blocs déjà visibles (hash #contact, scroll rapide, layout tardif). */
function syncRevealsInView() {
  ScrollTrigger.refresh()
  document.querySelectorAll<HTMLElement>(REVEAL_SELECTORS).forEach((el) => {
    const rect = el.getBoundingClientRect()
    if (rect.top >= window.innerHeight || rect.bottom <= 0) return
    gsap.set(el, { opacity: 1, y: 0, rotateX: 0, clearProps: 'transform' })
    ScrollTrigger.getAll()
      .filter((st) => st.trigger === el)
      .forEach((st) => st.kill())
  })
}

export default function ScrollAnimator() {
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) {
      document.querySelectorAll<HTMLElement>('.reveal, .reveal-grid > *, .reveal-contact, .reveal-contact-form').forEach((el) => {
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
            start: 'top 94%',
            once: true,
            invalidateOnRefresh: true,
          },
        })
      })

      gsap.utils.toArray<HTMLElement>('.reveal-contact').forEach((el) => {
        gsap.fromTo(el,
          { opacity: 0, y: 14 },
          {
            opacity: 1, y: 0, duration: 0.75, ease: 'power3.out',
            scrollTrigger: {
              trigger: el,
              start: 'top bottom',
              once: true,
              invalidateOnRefresh: true,
            },
          },
        )
      })

      gsap.utils.toArray<HTMLElement>('.reveal-contact-form').forEach((el) => {
        gsap.fromTo(el,
          { opacity: 0, y: 10, rotateX: 3, transformPerspective: 900 },
          {
            opacity: 1, y: 0, rotateX: 0, duration: 0.8, ease: 'power3.out',
            scrollTrigger: {
              trigger: el,
              start: 'top bottom',
              once: true,
              invalidateOnRefresh: true,
            },
          },
        )
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
              start: 'top 92%',
              once: true,
              invalidateOnRefresh: true,
            },
          },
        )
      })

      syncRevealsInView()
    })

    const onLoad = () => syncRevealsInView()
    const onHash = () => window.setTimeout(syncRevealsInView, 350)
    const t1 = window.setTimeout(syncRevealsInView, 300)
    const t2 = window.setTimeout(syncRevealsInView, 900)
    if (window.location.hash === '#contact') {
      window.setTimeout(syncRevealsInView, 120)
    }
    window.addEventListener('load', onLoad)
    window.addEventListener('resize', onLoad)
    window.addEventListener('hashchange', onHash)

    return () => {
      window.removeEventListener('load', onLoad)
      window.removeEventListener('resize', onLoad)
      window.removeEventListener('hashchange', onHash)
      window.clearTimeout(t1)
      window.clearTimeout(t2)
      ctx.revert()
    }
  }, [])

  return null
}
