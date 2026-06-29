'use client'
import { useEffect } from 'react'
import { gsap, ScrollTrigger } from '@/lib/gsap'
import { scrollToInitialHash } from '@/lib/scroll-section'

/** Déclenche les animations douces déjà visibles dans le viewport (scroll rapide, hash). */
function syncMotionInView() {
  ScrollTrigger.refresh()

  document.querySelectorAll<HTMLElement>('.motion-stagger').forEach((group) => {
    const rect = group.getBoundingClientRect()
    if (rect.top >= window.innerHeight * 0.98 || rect.bottom <= 0) return

    const children = group.classList.contains('method-stage')
      ? group.querySelectorAll<HTMLElement>('.method-card3d')
      : Array.from(group.children) as HTMLElement[]

    gsap.set(children, { y: 0, clearProps: 'transform' })
    ScrollTrigger.getAll()
      .filter((st) => st.trigger === group)
      .forEach((st) => st.kill())
  })
}

export default function ScrollAnimator() {
  useEffect(() => {
    scrollToInitialHash()
  }, [])

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) return

    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('.reveal').forEach((el) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 22 },
          {
            opacity: 1,
            y: 0,
            duration: 0.65,
            ease: 'power2.out',
            immediateRender: false,
            scrollTrigger: {
              trigger: el,
              start: 'top 90%',
              once: true,
              invalidateOnRefresh: true,
            },
          },
        )
      })

      gsap.utils.toArray<HTMLElement>('.reveal-grid').forEach((grid) => {
        gsap.fromTo(
          grid.children,
          { opacity: 0, y: 28 },
          {
            opacity: 1,
            y: 0,
            duration: 0.55,
            stagger: 0.07,
            ease: 'power2.out',
            immediateRender: false,
            scrollTrigger: {
              trigger: grid,
              start: 'top 88%',
              once: true,
              invalidateOnRefresh: true,
            },
          },
        )
      })

      // Méthode & FAQ : toujours lisibles, léger slide sans masquer le contenu
      gsap.utils.toArray<HTMLElement>('.motion-stagger').forEach((group) => {
        const targets = group.classList.contains('method-stage')
          ? group.querySelectorAll<HTMLElement>('.method-card3d')
          : group.children

        gsap.from(targets, {
          y: 14,
          duration: 0.5,
          stagger: 0.05,
          ease: 'power2.out',
          immediateRender: false,
          scrollTrigger: {
            trigger: group,
            start: 'top 92%',
            once: true,
            invalidateOnRefresh: true,
          },
        })
      })

      syncMotionInView()
    })

    const refresh = () => {
      ScrollTrigger.refresh()
      syncMotionInView()
    }
    const onHash = () => window.setTimeout(syncMotionInView, 120)

    window.addEventListener('load', refresh)
    window.addEventListener('resize', refresh, { passive: true })
    window.addEventListener('hashchange', onHash)
    const t1 = window.setTimeout(syncMotionInView, 80)
    const t2 = window.setTimeout(syncMotionInView, 400)

    return () => {
      window.removeEventListener('load', refresh)
      window.removeEventListener('resize', refresh)
      window.removeEventListener('hashchange', onHash)
      window.clearTimeout(t1)
      window.clearTimeout(t2)
      ctx.revert()
    }
  }, [])

  return null
}
