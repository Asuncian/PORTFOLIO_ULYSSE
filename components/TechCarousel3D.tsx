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

  // Label — auto-scale pour les noms longs
  const textX = pad + 92
  const maxTextW = W - textX - pad - 16
  let fontSize = 74
  ctx.font = `600 ${fontSize}px Inter, system-ui, sans-serif`
  while (ctx.measureText(tech.label).width > maxTextW && fontSize > 50) {
    fontSize -= 3
    ctx.font = `600 ${fontSize}px Inter, system-ui, sans-serif`
  }
  ctx.textBaseline = 'middle'
  ctx.textAlign = 'left'
  ctx.fillStyle = '#eef4ff'
  ctx.fillText(tech.label, textX, H / 2 + 4)

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
    buildRing(RING_B, -0.62, Math.PI / RING_B.length)

    // Scintillements — halos doux + éclats croisés, deux couches de profondeur
    const makeStarLayer = (count: number, spread: { rMin: number; rMax: number; y: number; z: number }) => {
      const pos = new Float32Array(count * 3)
      const phase = new Float32Array(count)
      const size = new Float32Array(count)
      const speed = new Float32Array(count)
      const tint = new Float32Array(count)
      for (let i = 0; i < count; i++) {
        const r = spread.rMin + Math.random() * (spread.rMax - spread.rMin)
        const a = Math.random() * Math.PI * 2
        pos[i * 3] = Math.cos(a) * r
        pos[i * 3 + 1] = (Math.random() - 0.5) * spread.y
        pos[i * 3 + 2] = Math.sin(a) * r * 0.55 + spread.z
        phase[i] = Math.random() * Math.PI * 2
        size[i] = 0.02 + Math.random() * 0.048
        speed[i] = 0.35 + Math.random() * 1.1
        tint[i] = Math.random()
      }
      const geo = new THREE.BufferGeometry()
      geo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
      geo.setAttribute('aPhase', new THREE.BufferAttribute(phase, 1))
      geo.setAttribute('aSize', new THREE.BufferAttribute(size, 1))
      geo.setAttribute('aSpeed', new THREE.BufferAttribute(speed, 1))
      geo.setAttribute('aTint', new THREE.BufferAttribute(tint, 1))
      return geo
    }

    const starGeo = makeStarLayer(72, { rMin: 7.5, rMax: 14, y: 6.5, z: -3 })
    const dustGeo = makeStarLayer(48, { rMin: 5, rMax: 10, y: 4, z: -1.5 })

    const starShader = {
      uniforms: { uTime: { value: 0 } },
      vertexShader: `
        attribute float aPhase;
        attribute float aSize;
        attribute float aSpeed;
        attribute float aTint;
        uniform float uTime;
        varying float vTwinkle;
        varying float vTint;
        void main() {
          float wave = sin(uTime * aSpeed + aPhase);
          float wave2 = sin(uTime * aSpeed * 1.7 + aPhase * 2.1);
          vTwinkle = 0.18 + 0.82 * pow(0.5 + 0.5 * wave, 3.0) * (0.55 + 0.45 * (0.5 + 0.5 * wave2));
          vTint = aTint;
          vec4 mv = modelViewMatrix * vec4(position, 1.0);
          float scale = 300.0 / max(-mv.z, 1.0);
          gl_PointSize = aSize * scale * (0.65 + vTwinkle * 0.5);
          gl_Position = projectionMatrix * mv;
        }
      `,
      fragmentShader: `
        varying float vTwinkle;
        varying float vTint;
        void main() {
          vec2 uv = gl_PointCoord - 0.5;
          float d = length(uv);
          float core = smoothstep(0.38, 0.0, d);
          float halo = smoothstep(0.55, 0.1, d) * 0.32;
          float cross = exp(-abs(uv.x) * 22.0) * exp(-abs(uv.y) * 22.0) * 0.55;
          float alpha = (core * 0.9 + halo + cross * vTwinkle) * vTwinkle;
          if (alpha < 0.015) discard;
          vec3 cool = vec3(0.42, 0.58, 0.92);
          vec3 warm = vec3(0.88, 0.94, 1.0);
          vec3 col = mix(cool, warm, vTint * 0.6 + core * 0.4);
          gl_FragColor = vec4(col, alpha * 0.72);
        }
      `,
    }

    const starMat = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      ...starShader,
    })
    const dustMat = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: { uTime: { value: 0 } },
      vertexShader: starShader.vertexShader,
      fragmentShader: `
        varying float vTwinkle;
        varying float vTint;
        void main() {
          vec2 uv = gl_PointCoord - 0.5;
          float d = length(uv);
          float core = smoothstep(0.45, 0.0, d);
          float alpha = core * vTwinkle * 0.55;
          if (alpha < 0.01) discard;
          gl_FragColor = vec4(vec3(0.55, 0.72, 0.98), alpha);
        }
      `,
    })

    const stars = new THREE.Points(starGeo, starMat)
    const dust = new THREE.Points(dustGeo, dustMat)
    scene.add(stars, dust)

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
    let onScreen = true, tabVisible = true, animId = 0, t = 0
    const isPaused = () => !onScreen || !tabVisible

    const render = () => {
      animId = requestAnimationFrame(render)
      if (isPaused()) return
      t += 0.016
      starMat.uniforms.uTime.value = t
      dustMat.uniforms.uTime.value = t
      stars.rotation.y = wheel.rotation.y * 0.12
      dust.rotation.y = wheel.rotation.y * 0.08

      if (!dragging) {
        wheel.rotation.y += vel
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
      starGeo.dispose()
      dustGeo.dispose()
      starMat.dispose()
      dustMat.dispose()
      planes.forEach(m => m.material.dispose())
      textures.forEach(t => t.dispose())
      renderer.dispose()
    }
  }, [])

  return <canvas ref={canvasRef} className="tech3d-canvas" />
}
