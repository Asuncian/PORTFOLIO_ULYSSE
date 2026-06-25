'use client'
import { useEffect, useRef } from 'react'
import * as THREE from 'three'

export type ForWhoIconVariant = 'wellness' | 'artisan' | 'local' | 'saas' | 'sport'

function buildIcon(variant: ForWhoIconVariant): THREE.Group {
  const root = new THREE.Group()
  const bodyMat = new THREE.MeshBasicMaterial({
    color: 0x1e40af, transparent: true, opacity: 0.92,
  })
  const faceMat = new THREE.MeshBasicMaterial({
    color: 0x4d88ff, transparent: true, opacity: 0.85,
  })
  const accentMat = new THREE.MeshBasicMaterial({ color: 0x93c5fd })
  const edgeMat = new THREE.LineBasicMaterial({
    color: 0xbcd6ff, transparent: true, opacity: 0.55,
  })

  const addSolid = (geo: THREE.BufferGeometry, mat: THREE.Material, pos?: THREE.Vector3) => {
    const mesh = new THREE.Mesh(geo, mat)
    if (pos) mesh.position.copy(pos)
    const edges = new THREE.LineSegments(new THREE.EdgesGeometry(geo), edgeMat)
    if (pos) edges.position.copy(pos)
    root.add(mesh, edges)
    geo.dispose()
    return mesh
  }

  switch (variant) {
    case 'wellness': {
      const star = new THREE.OctahedronGeometry(0.95, 0)
      addSolid(star, faceMat)
      const ring = new THREE.TorusGeometry(1.35, 0.06, 6, 32)
      const ringMesh = new THREE.Mesh(ring, accentMat)
      ringMesh.rotation.x = Math.PI / 2
      root.add(ringMesh, new THREE.LineSegments(new THREE.EdgesGeometry(ring), edgeMat))
      ring.dispose()
      break
    }
    case 'artisan': {
      const trunk = new THREE.CylinderGeometry(0.18, 0.22, 0.7, 8)
      addSolid(trunk, bodyMat, new THREE.Vector3(0, -0.55, 0))
      const crown = new THREE.ConeGeometry(0.85, 1.15, 5)
      addSolid(crown, faceMat, new THREE.Vector3(0, 0.35, 0))
      break
    }
    case 'local': {
      const cargo = new THREE.BoxGeometry(1.35, 0.75, 0.7)
      addSolid(cargo, bodyMat, new THREE.Vector3(-0.15, 0, 0))
      const cab = new THREE.BoxGeometry(0.55, 0.55, 0.65)
      addSolid(cab, faceMat, new THREE.Vector3(0.75, 0.08, 0))
      const wheelG = new THREE.TorusGeometry(0.18, 0.07, 8, 16)
      ;[[-0.55, -0.48, 0.3], [0.55, -0.48, 0.3]].forEach(([x, y, z]) => {
        const w = new THREE.Mesh(wheelG, accentMat)
        w.position.set(x, y, z)
        w.rotation.y = Math.PI / 2
        root.add(w)
      })
      wheelG.dispose()
      break
    }
    case 'saas': {
      const screen = new THREE.BoxGeometry(1.65, 1.15, 0.12)
      addSolid(screen, bodyMat)
      const stand = new THREE.BoxGeometry(0.35, 0.35, 0.08)
      addSolid(stand, faceMat, new THREE.Vector3(0, -0.72, 0))
      const base = new THREE.BoxGeometry(0.9, 0.08, 0.35)
      addSolid(base, accentMat, new THREE.Vector3(0, -0.92, 0))
      break
    }
    case 'sport': {
      const ball = new THREE.SphereGeometry(0.88, 14, 10)
      addSolid(ball, faceMat)
      const seam = new THREE.TorusGeometry(0.88, 0.025, 4, 48)
      const s1 = new THREE.Mesh(seam, accentMat)
      s1.rotation.x = Math.PI / 2
      const s2 = s1.clone()
      s2.rotation.z = Math.PI / 2
      root.add(s1, s2)
      seam.dispose()
      break
    }
  }

  return root
}

export default function ForWhoIcon3D({ variant }: { variant: ForWhoIconVariant }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const hostRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const host = hostRef.current
    if (!canvas || !host) return

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' })
    renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5))
    const size = 112
    renderer.setSize(size, size)

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 50)
    camera.position.set(0, 0.15, 3.4)

    const icon = buildIcon(variant)
    scene.add(icon)

    const glow = new THREE.PointLight(0x4d88ff, 1.2, 8)
    glow.position.set(1.2, 1.5, 2)
    scene.add(glow)
    scene.add(new THREE.AmbientLight(0x1a2a6e, 0.85))

    let time = 0
    let hover = 0
    let raf = 0
    let lastFrame = 0
    let onScreen = true
    let paused = false

    const onEnter = () => { hover = 1 }
    const onLeave = () => { hover = 0 }
    host.addEventListener('mouseenter', onEnter)
    host.addEventListener('mouseleave', onLeave)

    const io = new IntersectionObserver(([e]) => { onScreen = e.isIntersecting }, { threshold: 0.1 })
    io.observe(host)
    const onVis = () => { paused = document.hidden }
    document.addEventListener('visibilitychange', onVis)

    const render = (now: number) => {
      raf = requestAnimationFrame(render)
      if (!onScreen || paused) return
      const dt = lastFrame ? Math.min((now - lastFrame) / 1000, 0.05) : 0.016
      lastFrame = now
      time += dt

      icon.rotation.y = time * 0.55 + hover * 0.25
      icon.rotation.x = Math.sin(time * 0.7) * 0.12 - hover * 0.08
      icon.position.y = Math.sin(time * 1.1) * 0.06

      renderer.render(scene, camera)
    }
    raf = requestAnimationFrame(render)

    return () => {
      cancelAnimationFrame(raf)
      io.disconnect()
      document.removeEventListener('visibilitychange', onVis)
      host.removeEventListener('mouseenter', onEnter)
      host.removeEventListener('mouseleave', onLeave)
      icon.traverse(obj => {
        if (obj instanceof THREE.Mesh) {
          obj.geometry.dispose()
          ;(obj.material as THREE.Material).dispose()
        }
        if (obj instanceof THREE.LineSegments) {
          obj.geometry.dispose()
          ;(obj.material as THREE.Material).dispose()
        }
      })
      renderer.dispose()
    }
  }, [variant])

  return (
    <div ref={hostRef} className="fw-icon-stage">
      <canvas ref={canvasRef} className="fw-icon-canvas" aria-hidden />
    </div>
  )
}
