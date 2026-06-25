'use client'
import { useEffect, useRef, useState } from 'react'

export default function Cursor() {
  const dotRef  = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const haloRef = useRef<HTMLDivElement>(null)
  const [hidden, setHidden] = useState(false)

  useEffect(() => {
    const coarse = window.matchMedia('(pointer: coarse)').matches
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (coarse || reduced) {
      setHidden(true)
      return
    }

    const dot  = dotRef.current
    const ring = ringRef.current
    const halo = haloRef.current
    if (!dot || !ring || !halo) return

    let cx = 0, cy = 0, rx = 0, ry = 0, hx = 0, hy = 0, moved = false

    const onMove = (e: MouseEvent) => {
      cx = e.clientX; cy = e.clientY; moved = true
      dot.style.transform = `translate3d(${cx}px, ${cy}px, 0) translate(-50%, -50%)`
    }
    window.addEventListener('mousemove', onMove, { passive: true })

    let raf: number
    const follow = () => {
      if (moved) {
        rx += (cx - rx) * 0.11
        ry += (cy - ry) * 0.11
        hx += (cx - hx) * 0.06
        hy += (cy - hy) * 0.06
        ring.style.transform = `translate3d(${rx}px, ${ry}px, 0) translate(-50%, -50%)`
        halo.style.transform = `translate3d(${hx}px, ${hy}px, 0) translate(-50%, -50%)`
        if (Math.abs(cx - rx) < 0.1 && Math.abs(cy - ry) < 0.1) moved = false
      }
      raf = requestAnimationFrame(follow)
    }
    follow()

    const targets = 'a, button, .fw-card, .pillar, .flow-card, .flow-node, .contact-chip, .method-card3d, input, select, textarea'
    const onOver = (e: MouseEvent) => {
      if ((e.target as Element)?.closest?.(targets)) ring.classList.add('hovered')
    }
    const onOut = (e: MouseEvent) => {
      if ((e.target as Element)?.closest?.(targets)) ring.classList.remove('hovered')
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

  if (hidden) return null

  return (
    <>
      <div ref={haloRef} className="cursor-halo" />
      <div ref={dotRef}  className="cursor-dot"  />
      <div ref={ringRef} className="cursor-ring" />
    </>
  )
}
