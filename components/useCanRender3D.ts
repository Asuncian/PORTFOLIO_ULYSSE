'use client'
import { useState, useEffect } from 'react'

/**
 * Decides whether heavy WebGL scenes are worth rendering on this device.
 * Returns false for: reduced-motion users, small/mobile screens, low core
 * counts and devices that report little memory - so the main thread stays
 * free for first paint and interaction on the machines that need it most.
 */
export function useCanRender3D(): boolean {
  const [ok, setOk] = useState(false)

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const small   = window.innerWidth < 760
    const cores   = navigator.hardwareConcurrency ?? 8
    // @ts-expect-error deviceMemory is non-standard but widely shipped
    const mem     = (navigator.deviceMemory as number | undefined) ?? 8
    const coarse  = window.matchMedia('(pointer: coarse)').matches

    if (reduced || small || coarse || cores <= 4 || mem <= 4) {
      setOk(false)
      return
    }
    setOk(true)
  }, [])

  return ok
}
