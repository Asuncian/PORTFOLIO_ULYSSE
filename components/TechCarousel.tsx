'use client'
import { useEffect, useRef, useState, Suspense, lazy } from 'react'
import { useCanRender3D } from './useCanRender3D'
import Marquee from './Marquee'

const TechCarousel3D = lazy(() => import('./TechCarousel3D'))

export default function TechCarousel() {
  const canRender = useCanRender3D()
  const hostRef = useRef<HTMLDivElement>(null)
  const [mount, setMount] = useState(false)

  useEffect(() => {
    if (!canRender || !hostRef.current) return
    // Only spin up WebGL once the section approaches the viewport
    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setMount(true); io.disconnect() } },
      { rootMargin: '300px' },
    )
    io.observe(hostRef.current)
    return () => io.disconnect()
  }, [canRender])

  // Low-power / reduced-motion / mobile → clean CSS marquee instead
  if (!canRender) {
    return (
      <section id="tech">
        <div className="tech-head">
          <p className="section-tag">Stack</p>
        </div>
        <Marquee />
      </section>
    )
  }

  return (
    <section id="tech">
      <div className="tech-head">
        <p className="section-tag">Stack</p>
        <p className="tech-hint">Faites tourner&nbsp;↔</p>
      </div>
      <div ref={hostRef} className="tech3d-stage">
        {mount && (
          <Suspense fallback={null}>
            <TechCarousel3D />
          </Suspense>
        )}
        <div className="tech3d-fade" aria-hidden />
      </div>
    </section>
  )
}
