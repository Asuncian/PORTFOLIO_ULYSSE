'use client'
import { useEffect, useRef } from 'react'
import gsap from 'gsap'

export default function Hero() {
  const ref = useRef<HTMLElement>(null)
  const orbRef = useRef<HTMLDivElement>(null)
  const planeRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)

  // Intro timeline
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.2 })
      tl.from('.h-word', {
          clipPath: 'inset(0 0 110% 0)',
          y: 42,
          duration: 1.2,
          stagger: 0.18,
          ease: 'power4.out',
        })
        .from('.h-sub', { opacity: 0, y: 18, duration: .9, ease: 'power2.out' }, '-=0.5')
        .from('.h-btn', { opacity: 0, y: 14, scale: .95, duration: .7, stagger: .12, ease: 'back.out(1.8)' }, '-=0.5')
    }, ref)
    return () => ctx.revert()
  }, [])

  // Pointer parallax + 3D tilt — depth layers move at different rates.
  // Skipped on touch / reduced-motion; one rAF, transforms only.
  useEffect(() => {
    const coarse = window.matchMedia('(pointer: coarse)').matches
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (coarse || reduced) return

    let tx = 0, ty = 0, cx = 0, cy = 0, raf = 0, running = false
    const loop = () => {
      cx += (tx - cx) * 0.07
      cy += (ty - cy) * 0.07
      const orb = orbRef.current, plane = planeRef.current, title = titleRef.current
      if (orb)   orb.style.transform   = `translate3d(${(cx * 34).toFixed(1)}px, ${(cy * 24).toFixed(1)}px, 0)`
      if (plane) plane.style.transform = `translate(-50%, -50%) rotateX(62deg) translate3d(${(-cx * 26).toFixed(1)}px, ${(-cy * 16).toFixed(1)}px, 0)`
      if (title) title.style.transform = `rotateY(${(cx * 6).toFixed(2)}deg) rotateX(${(-cy * 5).toFixed(2)}deg)`
      if (Math.abs(tx - cx) > 0.0005 || Math.abs(ty - cy) > 0.0005) {
        raf = requestAnimationFrame(loop)
      } else {
        running = false
      }
    }
    const kick = () => { if (!running) { running = true; raf = requestAnimationFrame(loop) } }
    const onMove = (e: MouseEvent) => {
      tx = (e.clientX / window.innerWidth - 0.5) * 2
      ty = (e.clientY / window.innerHeight - 0.5) * 2
      kick()
    }
    window.addEventListener('mousemove', onMove, { passive: true })
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('mousemove', onMove)
    }
  }, [])

  return (
    <section id="hero" ref={ref}>
      <div className="hero-plane" ref={planeRef} aria-hidden="true" />
      <div className="hero-orb" ref={orbRef} aria-hidden="true" />

      <h1 className="hero-title" ref={titleRef}>
        <span className="line"><span className="h-word word">Sites.</span></span>
        <span className="line"><span className="h-word word accent">Automati&shy;sations.</span></span>
        <span className="line"><span className="h-word word dim">Résultats.</span></span>
      </h1>

      <p className="hero-sub h-sub">
        Développeur web en alternance. J'aime construire des sites rapides et des automatisations qui tiennent, jusqu'à la mise en production.
      </p>

      <div className="hero-actions">
        <a href="#projets" className="btn-primary h-btn"><span>Voir mes projets</span></a>
        <a href="#contact" className="btn-ghost h-btn">Me contacter</a>
      </div>
    </section>
  )
}
