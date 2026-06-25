'use client'
import { useEffect, useRef } from 'react'
import * as THREE from 'three'

export type ForWhoIconVariant = 'wellness' | 'artisan' | 'local' | 'saas' | 'sport'

type IconPalette = {
  body: number
  main: number
  accent: number
  edge: number
  glow: number
}

const PALETTES: Record<ForWhoIconVariant, IconPalette> = {
  wellness: { body: 0x5c3d2e, main: 0xf0d4bc, accent: 0xfff5eb, edge: 0xf5e0c8, glow: 0xe8b896 },
  artisan:  { body: 0x14532d, main: 0x34d399, accent: 0x86efac, edge: 0xa7f3d0, glow: 0x22c55e },
  local:    { body: 0x713f12, main: 0xfbbf24, accent: 0xfde68a, edge: 0xfcd34d, glow: 0xf59e0b },
  saas:     { body: 0x4c1d95, main: 0xa78bfa, accent: 0xddd6fe, edge: 0xc4b5fd, glow: 0x8b5cf6 },
  sport:    { body: 0x9a3412, main: 0xfb923c, accent: 0xfdba74, edge: 0xfed7aa, glow: 0xea580c },
}

function createMaterials(p: IconPalette) {
  const solid = (color: number, intensity = 0.28) =>
    new THREE.MeshStandardMaterial({
      color,
      emissive: color,
      emissiveIntensity: intensity,
      metalness: 0.38,
      roughness: 0.42,
    })
  return {
    body: solid(p.body, 0.12),
    main: solid(p.main, 0.32),
    accent: solid(p.accent, 0.4),
    edge: new THREE.LineBasicMaterial({ color: p.edge, transparent: true, opacity: 0.7 }),
  }
}

function buildIcon(variant: ForWhoIconVariant): { group: THREE.Group; mats: THREE.Material[] } {
  const palette = PALETTES[variant]
  const { body, main, accent, edge } = createMaterials(palette)
  const mats: THREE.Material[] = [body, main, accent, edge]
  const root = new THREE.Group()
  const geos: THREE.BufferGeometry[] = []

  const addMesh = (geo: THREE.BufferGeometry, mat: THREE.Material, pos?: THREE.Vector3, rot?: THREE.Euler) => {
    const mesh = new THREE.Mesh(geo, mat)
    if (pos) mesh.position.copy(pos)
    if (rot) mesh.rotation.copy(rot)
    const edges = new THREE.LineSegments(new THREE.EdgesGeometry(geo), edge)
    if (pos) edges.position.copy(pos)
    if (rot) edges.rotation.copy(rot)
    root.add(mesh, edges)
    geos.push(geo)
    return mesh
  }

  const addLine = (pts: THREE.Vector3[]) => {
    const geo = new THREE.BufferGeometry().setFromPoints(pts)
    geos.push(geo)
    root.add(new THREE.Line(geo, edge))
  }

  // Socle commun pour cohérence visuelle
  const pedestal = new THREE.CylinderGeometry(1.05, 1.15, 0.1, 32)
  addMesh(pedestal, body, new THREE.Vector3(0, -0.98, 0))

  switch (variant) {
    case 'wellness': {
      const gem = new THREE.OctahedronGeometry(0.72, 0)
      const gemMesh = addMesh(gem, main, new THREE.Vector3(0, 0.15, 0))
      gemMesh.rotation.y = Math.PI / 4
      gemMesh.scale.set(1, 1.25, 1)
      const inner = new THREE.SphereGeometry(0.22, 12, 10)
      addMesh(inner, accent, new THREE.Vector3(0, 0.15, 0.35))
      const ringA = new THREE.TorusGeometry(0.95, 0.045, 8, 40)
      addMesh(ringA, accent, new THREE.Vector3(0, 0.15, 0), new THREE.Euler(Math.PI / 2.8, 0.4, 0))
      const ringB = new THREE.TorusGeometry(1.12, 0.03, 6, 40)
      addMesh(ringB, body, new THREE.Vector3(0, 0.15, 0), new THREE.Euler(0.9, 0.8, 0.2))
      break
    }
    case 'artisan': {
      const trunk = new THREE.CylinderGeometry(0.14, 0.18, 0.55, 10)
      addMesh(trunk, body, new THREE.Vector3(0, -0.52, 0))
      const layers = [
        { r: 0.72, h: 0.55, y: -0.05 },
        { r: 0.58, h: 0.48, y: 0.42 },
        { r: 0.42, h: 0.38, y: 0.78 },
      ]
      layers.forEach(({ r, h, y }) => {
        const cone = new THREE.ConeGeometry(r, h, 6)
        addMesh(cone, main, new THREE.Vector3(0, y, 0))
      })
      addMesh(new THREE.SphereGeometry(0.12, 8, 8), accent, new THREE.Vector3(0.38, 0.95, 0.2))
      break
    }
    case 'local': {
      // Benne (skip) trapézoïdale + 4 roues
      const bin = new THREE.CylinderGeometry(0.54, 0.4, 0.72, 4)
      const binMesh = addMesh(bin, main, new THREE.Vector3(0, 0.1, 0))
      binMesh.rotation.y = Math.PI / 4

      const rim = new THREE.CylinderGeometry(0.58, 0.58, 0.07, 4)
      const rimMesh = addMesh(rim, accent, new THREE.Vector3(0, 0.48, 0))
      rimMesh.rotation.y = Math.PI / 4

      const lip = new THREE.BoxGeometry(0.62, 0.06, 0.62)
      const lipMesh = addMesh(lip, accent, new THREE.Vector3(0, 0.52, 0))
      lipMesh.rotation.y = Math.PI / 4

      const wheelY = -0.34
      const wheelGeo = new THREE.CylinderGeometry(0.13, 0.13, 0.08, 12)
      const wheelRot = new THREE.Euler(Math.PI / 2, 0, 0)
      ;[
        [-0.34, wheelY, 0.3],
        [0.34, wheelY, 0.3],
        [-0.34, wheelY, -0.3],
        [0.34, wheelY, -0.3],
      ].forEach(([x, y, z]) => {
        addMesh(wheelGeo.clone(), body, new THREE.Vector3(x, y, z), wheelRot)
        const hub = new THREE.CylinderGeometry(0.05, 0.05, 0.09, 8)
        addMesh(hub, accent, new THREE.Vector3(x, y, z), wheelRot)
      })
      wheelGeo.dispose()

      const arm = new THREE.BoxGeometry(0.05, 0.32, 0.05)
      addMesh(arm, body, new THREE.Vector3(-0.38, 0.22, 0.3))
      addMesh(arm.clone(), body, new THREE.Vector3(0.38, 0.22, 0.3))
      break
    }
    case 'saas': {
      const bezel = new THREE.BoxGeometry(1.55, 1.05, 0.14)
      addMesh(bezel, body, new THREE.Vector3(0, 0.2, 0))
      const screen = new THREE.BoxGeometry(1.35, 0.82, 0.06)
      addMesh(screen, main, new THREE.Vector3(0, 0.22, 0.08))
      const bar = new THREE.BoxGeometry(1.35, 0.12, 0.05)
      addMesh(bar, accent, new THREE.Vector3(0, 0.58, 0.09))
      ;[0.2, 0.05, -0.1].forEach((y, i) => {
        const line = new THREE.BoxGeometry(0.72 - i * 0.14, 0.05, 0.02)
        addMesh(line, accent, new THREE.Vector3(0, y, 0.12))
      })
      const neck = new THREE.BoxGeometry(0.12, 0.28, 0.1)
      addMesh(neck, body, new THREE.Vector3(0, -0.42, 0))
      const foot = new THREE.BoxGeometry(0.75, 0.07, 0.28)
      addMesh(foot, body, new THREE.Vector3(0, -0.6, 0))
      break
    }
    case 'sport': {
      const ball = new THREE.SphereGeometry(0.78, 20, 16)
      addMesh(ball, main, new THREE.Vector3(0, 0.1, 0))
      const seamR = 0.79
      const seamPts = (tilt: number) =>
        Array.from({ length: 33 }, (_, i) => {
          const a = (i / 32) * Math.PI * 2
          return new THREE.Vector3(
            Math.cos(a) * seamR,
            Math.sin(a) * seamR * Math.cos(tilt),
            Math.sin(a) * seamR * Math.sin(tilt),
          )
        })
      addLine(seamPts(0).map(p => p.clone().add(new THREE.Vector3(0, 0.1, 0))))
      addLine(seamPts(Math.PI / 2).map(p => p.clone().add(new THREE.Vector3(0, 0.1, 0))))
      const lines = new THREE.LineSegments(
        new THREE.EdgesGeometry(new THREE.SphereGeometry(0.78, 10, 8)),
        edge,
      )
      lines.position.set(0, 0.1, 0)
      root.add(lines)
      geos.push(lines.geometry as THREE.BufferGeometry)
      break
    }
  }

  root.userData.geometries = geos
  return { group: root, mats }
}

export default function ForWhoIcon3D({ variant }: { variant: ForWhoIconVariant }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const hostRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const host = hostRef.current
    if (!canvas || !host) return

    const palette = PALETTES[variant]
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' })
    renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5))
    renderer.setSize(128, 128)

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 50)
    camera.position.set(0, 0.2, 3.6)

    const { group: icon, mats } = buildIcon(variant)
    scene.add(icon)

    const key = new THREE.PointLight(palette.glow, 1.6, 12)
    key.position.set(1.4, 1.8, 2.2)
    scene.add(key)
    const fill = new THREE.PointLight(palette.main, 0.45, 10)
    fill.position.set(-1.5, 0.2, 1.5)
    scene.add(fill)
    scene.add(new THREE.AmbientLight(0x0a1028, 0.65))

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

      icon.rotation.y = time * 0.45 + hover * 0.35
      icon.rotation.x = Math.sin(time * 0.55) * 0.08 - hover * 0.06
      icon.position.y = Math.sin(time * 0.9) * 0.04

      renderer.render(scene, camera)
    }
    raf = requestAnimationFrame(render)

    return () => {
      cancelAnimationFrame(raf)
      io.disconnect()
      document.removeEventListener('visibilitychange', onVis)
      host.removeEventListener('mouseenter', onEnter)
      host.removeEventListener('mouseleave', onLeave)
      const geos = icon.userData.geometries as THREE.BufferGeometry[] | undefined
      geos?.forEach(g => g.dispose())
      icon.traverse(obj => {
        if (obj instanceof THREE.LineSegments || obj instanceof THREE.Line) {
          if (!geos?.includes(obj.geometry as THREE.BufferGeometry)) {
            obj.geometry.dispose()
          }
        }
      })
      mats.forEach(m => m.dispose())
      renderer.dispose()
    }
  }, [variant])

  return (
    <div ref={hostRef} className={`fw-icon-stage fw-icon-stage--${variant}`}>
      <canvas ref={canvasRef} className="fw-icon-canvas" aria-hidden />
    </div>
  )
}
