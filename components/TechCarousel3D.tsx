'use client'
import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { TECH_RING_A, TECH_RING_B } from '@/lib/tech-stack'

type Tech = { label: string; color: string }

const RING_A: Tech[] = TECH_RING_A
const RING_B: Tech[] = TECH_RING_B

/** Draw a clean glassy pill with accent text onto a hi-dpi canvas texture. */
function makePillTexture(tech: Tech): THREE.CanvasTexture {
  const W = 640, H = 200, r = 64
  const c = document.createElement('canvas')
  c.width = W; c.height = H
  const ctx = c.getContext('2d')!
  const pad = 14

  const round = (x: number, y: number, w: number, h: number, rad: number) => {
    ctx.beginPath()
    ctx.moveTo(x + rad, y)
    ctx.arcTo(x + w, y, x + w, y + h, rad)
    ctx.arcTo(x + w, y + h, x, y + h, rad)
    ctx.arcTo(x, y + h, x, y, rad)
    ctx.arcTo(x, y, x + w, y, rad)
    ctx.closePath()
  }

  // Glass fill
  const grad = ctx.createLinearGradient(0, 0, 0, H)
  grad.addColorStop(0, 'rgba(16,22,44,0.72)')
  grad.addColorStop(1, 'rgba(4,6,18,0.82)')
  round(pad, pad, W - pad * 2, H - pad * 2, r)
  ctx.fillStyle = grad
  ctx.fill()

  // Accent border
  ctx.lineWidth = 3
  ctx.strokeStyle = tech.color
  ctx.globalAlpha = 0.55
  ctx.stroke()
  ctx.globalAlpha = 1

  // Accent dot
  ctx.beginPath()
  ctx.arc(pad + 56, H / 2, 9, 0, Math.PI * 2)
  ctx.fillStyle = tech.color
  ctx.shadowColor = tech.color
  ctx.shadowBlur = 22
  ctx.fill()
  ctx.shadowBlur = 0

  // Label
  ctx.font = '600 74px Inter, system-ui, sans-serif'
  ctx.textBaseline = 'middle'
  ctx.textAlign = 'left'
  ctx.fillStyle = '#eef4ff'
  ctx.fillText(tech.label, pad + 92, H / 2 + 4)

  const tex = new THREE.CanvasTexture(c)
  tex.anisotropy = 4
  tex.colorSpace = THREE.SRGBColorSpace
  return tex
}

export default function TechCarousel3D() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const host = canvas.parentElement as HTMLElement

    const renderer = new THREE.WebGLRenderer({
      canvas, antialias: true, alpha: true, powerPreference: 'high-performance',
    })
    renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5))

    const w0 = host.clientWidth, h0 = host.clientHeight
    renderer.setSize(w0, h0)

    const scene = new THREE.Scene()
    scene.fog = new THREE.Fog(0x02020d, 9, 19)

    const camera = new THREE.PerspectiveCamera(42, w0 / h0, 0.1, 100)
    camera.position.set(0, 0, 10.4)
    camera.lookAt(0, 0, 0)

    const wheel = new THREE.Group()
    wheel.rotation.x = -0.07
    scene.add(wheel)

    const planes: THREE.Mesh<THREE.PlaneGeometry, THREE.MeshBasicMaterial>[] = []
    const textures: THREE.Texture[] = []
    const geo = new THREE.PlaneGeometry(3.0, 0.94)

    const buildRing = (items: Tech[], y: number, offset: number) => {
      const n = items.length
      const R = 5.9
      items.forEach((tech, i) => {
        const tex = makePillTexture(tech)
        textures.push(tex)
        const mat = new THREE.MeshBasicMaterial({ map: tex, transparent: true, depthWrite: false })
        const m = new THREE.Mesh(geo, mat)
        const a = (i / n) * Math.PI * 2 + offset
        m.position.set(Math.sin(a) * R, y, Math.cos(a) * R)
        m.rotation.y = a
        wheel.add(m)
        planes.push(m)
      })
    }
    buildRing(RING_A, 0.62, 0)
    buildRing(RING_B, -0.62, Math.PI / RING_B.length) // half-step stagger

    // ── interaction: drag to spin with inertia ──
    let vel = 0.0016          // idle auto-spin
    let dragging = false, lastX = 0, idleSpin = 0.0016
    const onDown = (x: number) => { dragging = true; lastX = x }
    const onMove = (x: number) => {
      if (!dragging) return
      const dx = x - lastX
      lastX = x
      vel = dx * 0.004
      wheel.rotation.y += vel
    }
    const onUp = () => { dragging = false }

    const md = (e: PointerEvent) => onDown(e.clientX)
    const mm = (e: PointerEvent) => onMove(e.clientX)
    canvas.addEventListener('pointerdown', md)
    window.addEventListener('pointermove', mm)
    window.addEventListener('pointerup', onUp)
    canvas.style.touchAction = 'pan-y'

    const tmp = new THREE.Vector3()
    let onScreen = true, tabVisible = true, animId = 0
    const isPaused = () => !onScreen || !tabVisible

    const render = () => {
      animId = requestAnimationFrame(render)
      if (isPaused()) return

      if (!dragging) {
        wheel.rotation.y += vel
        // ease idle spin back, decay throw velocity
        vel += (idleSpin - vel) * 0.03
      }

      // Depth-based opacity & scale → immersive front-to-back fade
      for (const m of planes) {
        m.getWorldPosition(tmp)
        const f = (tmp.z + 5.9) / 11.8          // 0 (back) → 1 (front)
        const e = Math.max(0, Math.min(1, f))
        m.material.opacity = 0.12 + e * 0.88
        const s = 0.86 + e * 0.18
        m.scale.set(s, s, s)
      }

      renderer.render(scene, camera)
    }
    render()

    // pause off-screen
    const io = new IntersectionObserver(
      ([entry]) => { onScreen = entry.isIntersecting },
      { threshold: 0.01 },
    )
    io.observe(host)
    const onVis = () => { tabVisible = !document.hidden }
    document.addEventListener('visibilitychange', onVis)

    const onResize = () => {
      const w = host.clientWidth, h = host.clientHeight
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
    }
    window.addEventListener('resize', onResize)

    return () => {
      cancelAnimationFrame(animId)
      io.disconnect()
      document.removeEventListener('visibilitychange', onVis)
      window.removeEventListener('resize', onResize)
      canvas.removeEventListener('pointerdown', md)
      window.removeEventListener('pointermove', mm)
      window.removeEventListener('pointerup', onUp)
      geo.dispose()
      planes.forEach(m => m.material.dispose())
      textures.forEach(t => t.dispose())
      renderer.dispose()
    }
  }, [])

  return <canvas ref={canvasRef} className="tech3d-canvas" />
}
