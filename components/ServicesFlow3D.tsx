'use client'
import { useEffect, type RefObject } from 'react'
import * as THREE from 'three'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

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
          if (vUv.x > uDraw) discard;
          vec3 col = mix(uColA, uColB, smoothstep(0.0, 1.0, vUv.x));
          float head = smoothstep(uDraw - 0.05, uDraw, vUv.x);
          col = mix(col, vec3(0.92, 0.96, 1.0), head);          // white-hot leading edge
          float across = 1.0 - smoothstep(0.0, 0.5, abs(vUv.y - 0.5));
          // soft fade at both extremities so the line eases in and out
          float ends = smoothstep(0.0, 0.04, vUv.x) * smoothstep(0.0, 0.04, 1.0 - vUv.x);
          float a = (across * 0.9 + head * 0.4) * uAlpha * ends;
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

    // Glowing head sprite (radial gradient on a canvas texture)
    const hc = document.createElement('canvas'); hc.width = hc.height = 128
    const hg = hc.getContext('2d')!
    const grad = hg.createRadialGradient(64, 64, 0, 64, 64, 64)
    grad.addColorStop(0, 'rgba(232,242,255,1)')
    grad.addColorStop(0.25, 'rgba(120,170,255,0.85)')
    grad.addColorStop(1, 'rgba(22,80,240,0)')
    hg.fillStyle = grad; hg.fillRect(0, 0, 128, 128)
    const headTex = new THREE.CanvasTexture(hc)
    const headMat = new THREE.SpriteMaterial({ map: headTex, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending })
    const head = new THREE.Sprite(headMat)
    head.visible = false
    scene.add(head)

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
        const p = curve.getPoint(d)
        head.position.set(p.x, p.y, 1)
        const pulse = 24 + Math.sin(t) * 3
        head.scale.set(pulse, pulse, 1)
        // fade the head in/out near the extremities
        headMat.opacity = Math.min(1, smoothstep(0, 0.06, d) * smoothstep(0, 0.06, 1 - d) + Math.sin(t) * 0.05)
      } else {
        head.visible = false
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
      headTex.dispose(); headMat.dispose()
      renderer.dispose()
      canvas.remove()
    }
  }, [hostRef])

  return null
}
