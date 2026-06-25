'use client'
import { useEffect, type RefObject } from 'react'
import * as THREE from 'three'
import { gsap, ScrollTrigger } from '@/lib/gsap'

/**
 * A glowing line, rendered in WebGL, that threads through the service nodes —
 * weaving right ↔ left as it descends. It draws itself on scroll: a luminous
 * head travels down the path and the trail lights up behind it.
 *
 * The curve is built from the real on-screen positions of `.flow-node`, so the
 * line always passes exactly through the cards, and rebuilds on resize.
 */
export default function ServicesFlow3D({ hostRef }: { hostRef: RefObject<HTMLDivElement> }) {
  useEffect(() => {
    const host = hostRef.current
    if (!host) return

    const canvas = document.createElement('canvas')
    canvas.className = 'flow-canvas'
    host.appendChild(canvas)

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' })
    renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5))
    renderer.setClearColor(0x000000, 0)

    const scene = new THREE.Scene()
    const camera = new THREE.OrthographicCamera(0, 1, 0, -1, -100, 100)
    camera.position.z = 10

    // ── shared shader: reveals the ribbon up to uDraw, soft glow across its
    //    width, with a white-hot leading head. The ribbon lies flat in the
    //    xy-plane so it always faces the orthographic camera head-on.
    const makeMat = (alpha: number) => new THREE.ShaderMaterial({
      transparent: true, depthWrite: false, side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uDraw:  { value: 0 },
        uAlpha: { value: alpha },
        uColA:  { value: new THREE.Color(0x0a2eb8) },
        uColB:  { value: new THREE.Color(0x4d88ff) },
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uDraw, uAlpha;
        uniform vec3  uColA, uColB;
        varying vec2  vUv;
        void main() {
          float dist = uDraw - vUv.x;
          if (dist < 0.0) discard;
          vec3 col = mix(uColA, uColB, smoothstep(0.0, 1.0, vUv.x));
          float across = 1.0 - smoothstep(0.0, 0.5, abs(vUv.y - 0.5));
          float ends = smoothstep(0.0, 0.04, vUv.x) * smoothstep(0.0, 0.04, 1.0 - vUv.x);
          float cap = smoothstep(0.0, 0.035, dist);
          float a = across * uAlpha * ends * cap;
          gl_FragColor = vec4(col, a);
        }
      `,
    })

    const smoothstep = (e0: number, e1: number, x: number) => {
      const t = Math.min(1, Math.max(0, (x - e0) / (e1 - e0)))
      return t * t * (3 - 2 * t)
    }

    // Flat ribbon along a curve: two rails offset by the in-plane normal.
    // The width tapers to a point at both ends for a graceful, drawn feel.
    const makeRibbon = (c: THREE.CatmullRomCurve3, width: number, segs: number) => {
      const pos: number[] = [], uv: number[] = [], idx: number[] = []
      for (let i = 0; i <= segs; i++) {
        const t = i / segs
        const p = c.getPoint(t)
        const tan = c.getTangent(t)
        const nx = -tan.y, ny = tan.x          // perpendicular, in xy-plane
        const taper = smoothstep(0, 0.05, t) * smoothstep(0, 0.05, 1 - t)
        const hw = (width / 2) * taper
        pos.push(p.x + nx * hw, p.y + ny * hw, 0)
        pos.push(p.x - nx * hw, p.y - ny * hw, 0)
        uv.push(t, 0); uv.push(t, 1)
      }
      for (let i = 0; i < segs; i++) {
        const a = i * 2, b = a + 1, cc = a + 2, d = a + 3
        idx.push(a, b, cc, b, d, cc)
      }
      const g = new THREE.BufferGeometry()
      g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3))
      g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2))
      g.setIndex(idx)
      return g
    }

    const coreMat = makeMat(1.0)
    const glowMat = makeMat(0.5)
    // Faint full-length track so the path ahead is hinted at
    const trackMat = new THREE.MeshBasicMaterial({
      color: 0x4d88ff, transparent: true, opacity: 0.08, side: THREE.DoubleSide,
      depthWrite: false, blending: THREE.AdditiveBlending,
    })

    const makeStarTexture = () => {
      const SIZE = 256
      const hc = document.createElement('canvas')
      hc.width = hc.height = SIZE
      const hg = hc.getContext('2d')!
      const cx = SIZE / 2

      hg.globalCompositeOperation = 'lighter'
      for (let i = 0; i < 4; i++) {
        hg.save()
        hg.translate(cx, cx)
        hg.rotate((Math.PI / 2) * i)
        const beam = hg.createLinearGradient(0, -cx, 0, cx)
        beam.addColorStop(0, 'rgba(255,255,255,0)')
        beam.addColorStop(0.45, 'rgba(200,220,255,0.35)')
        beam.addColorStop(0.5, 'rgba(255,255,255,0.9)')
        beam.addColorStop(0.55, 'rgba(200,220,255,0.35)')
        beam.addColorStop(1, 'rgba(255,255,255,0)')
        hg.fillStyle = beam
        hg.fillRect(-3, -cx, 6, cx * 2)
        hg.restore()
      }

      const grad = hg.createRadialGradient(cx, cx, 0, cx, cx, cx * 0.55)
      grad.addColorStop(0, 'rgba(255,255,255,1)')
      grad.addColorStop(0.15, 'rgba(240,248,255,0.95)')
      grad.addColorStop(0.35, 'rgba(147,197,253,0.55)')
      grad.addColorStop(0.6, 'rgba(77,136,255,0.18)')
      grad.addColorStop(1, 'rgba(22,80,240,0)')
      hg.globalCompositeOperation = 'source-over'
      hg.fillStyle = grad
      hg.fillRect(0, 0, SIZE, SIZE)

      const tex = new THREE.CanvasTexture(hc)
      tex.minFilter = THREE.LinearFilter
      tex.magFilter = THREE.LinearFilter
      tex.generateMipmaps = false
      return tex
    }

    const headTex = makeStarTexture()
    const headMat = new THREE.SpriteMaterial({
      map: headTex,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      opacity: 0.95,
    })
    const head = new THREE.Sprite(headMat)
    head.visible = false
    scene.add(head)

    const headCoreTex = headTex.clone()
    const headCoreMat = new THREE.SpriteMaterial({
      map: headCoreTex,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      opacity: 0.85,
    })
    const headCore = new THREE.Sprite(headCoreMat)
    headCore.visible = false
    scene.add(headCore)

    let curve: THREE.CatmullRomCurve3 | null = null
    let coreMesh: THREE.Mesh | null = null
    let glowMesh: THREE.Mesh | null = null
    let trackMesh: THREE.Mesh | null = null

    const disposeMeshes = () => {
      ;[coreMesh, glowMesh, trackMesh].forEach(m => {
        if (m) { scene.remove(m); (m.geometry as THREE.BufferGeometry).dispose() }
      })
      coreMesh = glowMesh = trackMesh = null
    }

    // Build the curve + tubes from the live DOM positions of the nodes
    const build = () => {
      const hostRect = host.getBoundingClientRect()
      const W = host.clientWidth, H = host.clientHeight
      if (W === 0 || H === 0) return

      // Nodes live in the sibling .flow-list, not inside the canvas stage —
      // measure them from the shared .flow parent (same rect as the stage).
      const scope = host.parentElement ?? host
      const nodes = Array.from(scope.querySelectorAll<HTMLElement>('.flow-node'))
      if (nodes.length < 2) return

      const pts: THREE.Vector3[] = []
      pts.push(new THREE.Vector3(W / 2, 0, 0))                         // graceful entry, top-centre
      nodes.forEach(n => {
        const r = n.getBoundingClientRect()
        const x = r.left - hostRect.left + r.width / 2
        const y = r.top - hostRect.top + r.height / 2
        pts.push(new THREE.Vector3(x, -y, 0))
      })
      pts.push(new THREE.Vector3(W / 2, -H, 0))                        // exit, bottom-centre

      camera.left = 0; camera.right = W; camera.top = 0; camera.bottom = -H
      camera.updateProjectionMatrix()
      renderer.setSize(W, H, false)

      curve = new THREE.CatmullRomCurve3(pts, false, 'catmullrom', 0.4)
      const segs = Math.max(160, nodes.length * 32)

      disposeMeshes()
      coreMesh  = new THREE.Mesh(makeRibbon(curve, 6,  segs), coreMat)
      glowMesh  = new THREE.Mesh(makeRibbon(curve, 30, segs), glowMat)
      trackMesh = new THREE.Mesh(makeRibbon(curve, 3,  segs), trackMat)
      scene.add(trackMesh, glowMesh, coreMesh)
    }

    build()

    // ── scroll drives the draw progress
    let draw = 0, shown = 0
    const st = ScrollTrigger.create({
      trigger: host, start: 'top 72%', end: 'bottom 82%', scrub: 0.6,
      onUpdate: self => { draw = self.progress },
    })

    let raf = 0, onScreen = true, tabVisible = true, t = 0
    const render = () => {
      raf = requestAnimationFrame(render)
      if (!onScreen || !tabVisible) return
      t += 0.05
      shown += (draw - shown) * 0.12
      const d = Math.min(Math.max(shown, 0), 1)
      coreMat.uniforms.uDraw.value = d
      glowMat.uniforms.uDraw.value = d

      if (curve && d > 0.004 && d < 0.997) {
        head.visible = true
        headCore.visible = true
        const p = curve.getPoint(d)
        head.position.set(p.x, p.y, 1)
        headCore.position.set(p.x, p.y, 1.1)
        const pulse = 22 + Math.sin(t * 1.4) * 2
        head.scale.set(pulse, pulse, 1)
        headCore.scale.set(pulse * 0.35, pulse * 0.35, 1)
        const fade = Math.min(1, smoothstep(0, 0.06, d) * smoothstep(0, 0.06, 1 - d))
        headMat.opacity = fade * (0.88 + Math.sin(t * 1.2) * 0.06)
        headCoreMat.opacity = fade * (0.95 + Math.sin(t * 1.2 + 0.4) * 0.04)
      } else {
        head.visible = false
        headCore.visible = false
      }
      renderer.render(scene, camera)
    }
    render()

    const io = new IntersectionObserver(([e]) => { onScreen = e.isIntersecting }, { threshold: 0 })
    io.observe(host)
    const onVis = () => { tabVisible = !document.hidden }
    document.addEventListener('visibilitychange', onVis)

    let resizeRaf = 0
    const onResize = () => {
      cancelAnimationFrame(resizeRaf)
      resizeRaf = requestAnimationFrame(() => { build(); ScrollTrigger.refresh() })
    }
    window.addEventListener('resize', onResize)

    return () => {
      cancelAnimationFrame(raf)
      cancelAnimationFrame(resizeRaf)
      st.kill()
      io.disconnect()
      document.removeEventListener('visibilitychange', onVis)
      window.removeEventListener('resize', onResize)
      disposeMeshes()
      coreMat.dispose(); glowMat.dispose(); trackMat.dispose()
      headTex.dispose(); headCoreTex.dispose()
      headMat.dispose(); headCoreMat.dispose()
      renderer.dispose()
      canvas.remove()
    }
  }, [hostRef])

  return null
}
