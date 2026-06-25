'use client'
import { useState, useEffect, Suspense, lazy } from 'react'
import { useCanRender3D } from './useCanRender3D'

const Background3D = lazy(() => import('./Background3D'))

export default function DeferredBackground() {
  const canRender = useCanRender3D()
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (!canRender) return
    // Load Three.js only once the browser is idle and the main UI is interactive
    const id = typeof window.requestIdleCallback === 'function'
      ? window.requestIdleCallback(() => setReady(true), { timeout: 2000 })
      : window.setTimeout(() => setReady(true), 900)

    return () => {
      if (typeof window.cancelIdleCallback === 'function') {
        window.cancelIdleCallback(id as number)
      } else {
        window.clearTimeout(id as number)
      }
    }
  }, [canRender])

  // Lightweight CSS fallback aurora - instant, GPU-cheap, shown on devices
  // where the WebGL field is skipped (mobile / reduced-motion / low-power).
  if (!canRender) return <div className="bg-fallback" aria-hidden />
  if (!ready) return <div className="bg-fallback" aria-hidden />

  return (
    <Suspense fallback={<div className="bg-fallback" aria-hidden />}>
      <Background3D />
    </Suspense>
  )
}
