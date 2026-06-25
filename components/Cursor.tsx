'use client'
import { useEffect, useRef } from 'react'

export default function Cursor() {
  const dotRef  = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const dot  = dotRef.current
    const ring = ringRef.current
    if (!dot || !ring) return

    let cx = 0, cy = 0, rx = 0, ry = 0, moved = false

    const onMove = (e: MouseEvent) => {
      cx = e.clientX; cy = e.clientY; moved = true
      // GPU composite: transform instead of left/top
      dot.style.transform = `translate3d(${cx}px, ${cy}px, 0) translate(-50%, -50%)`
    }
    window.addEventListener('mousemove', onMove, { passive: true })

    // Single rAF loop; idle when the pointer hasn't moved to save the GPU
    let raf: number
    const follow = () => {
      if (moved) {
        rx += (cx - rx) * 0.1
        ry += (cy - ry) * 0.1
        ring.style.transform = `translate3d(${rx}px, ${ry}px, 0) translate(-50%, -50%)`
        if (Math.abs(cx - rx) < 0.1 && Math.abs(cy - ry) < 0.1) moved = false
      }
      raf = requestAnimationFrame(follow)
    }
    follow()

    // Event delegation — zero per-element listeners, no MutationObserver.
    // mouseover/mouseout bubble, so one pair of handlers covers the whole page,
    // including nodes GSAP injects later.
    const targets = 'a, button, .fw-card, .pillar, .flow-card, .contact-chip, .method-card3d, input, select, textarea'
    const onOver = (e: MouseEvent) => {
      if ((e.target as Element)?.closest?.(targets)) {
        ring.classList.add('hovered'); dot.classList.add('hovered')
      }
    }
    const onOut = (e: MouseEvent) => {
      if ((e.target as Element)?.closest?.(targets)) {
        ring.classList.remove('hovered'); dot.classList.remove('hovered')
      }
    }
    document.addEventListener('mouseover', onOver, { passive: true })
    document.addEventListener('mouseout', onOut, { passive: true })

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseover', onOver)
      document.removeEventListener('mouseout', onOut)
    }
  }, [])

  return (
    <>
      <div ref={dotRef}  className="cursor-dot"  />
      <div ref={ringRef} className="cursor-ring" />
    </>
  )
}
