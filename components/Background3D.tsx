'use client'
import { useEffect, useRef } from 'react'
import * as THREE from 'three'

export default function Background3D() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const renderer = new THREE.WebGLRenderer({
      canvas, antialias: true, alpha: true, powerPreference: 'high-performance',
    })
    // Capping DPR is the single biggest GPU win on retina/4K - 1.5 looks crisp
    renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5))
    renderer.setSize(innerWidth, innerHeight)
    renderer.setClearColor(0x000000, 0)

    const scene  = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(65, innerWidth / innerHeight, 0.1, 3000)
    camera.position.set(0, 0, 100)

    // ═══════════════════════════════════════════════════
    //  1 · STAR FIELD  -  shader twinkling + cross spike
    // ═══════════════════════════════════════════════════
    const N_STARS   = 2000
    const sPos      = new Float32Array(N_STARS * 3)
    const sSz       = new Float32Array(N_STARS)
    const sPhase    = new Float32Array(N_STARS)
    const sSpeed    = new Float32Array(N_STARS)
    const sTemp     = new Float32Array(N_STARS) // 0=deep-blue, 1=icy-white

    for (let i = 0; i < N_STARS; i++) {
      sPos[i*3]   = (Math.random() - .5) * 600
      sPos[i*3+1] = (Math.random() - .5) * 400
      sPos[i*3+2] = (Math.random() - .5) * 400
      sSz[i]      = Math.pow(Math.random(), 3) * 6 + 0.3
      sPhase[i]   = Math.random() * Math.PI * 2
      sSpeed[i]   = Math.random() * 2.2 + 0.5
      sTemp[i]    = Math.random()
    }

    const starGeo = new THREE.BufferGeometry()
    starGeo.setAttribute('position', new THREE.BufferAttribute(sPos, 3))
    starGeo.setAttribute('aSize',    new THREE.BufferAttribute(sSz, 1))
    starGeo.setAttribute('aPhase',   new THREE.BufferAttribute(sPhase, 1))
    starGeo.setAttribute('aSpeed',   new THREE.BufferAttribute(sSpeed, 1))
    starGeo.setAttribute('aTemp',    new THREE.BufferAttribute(sTemp, 1))

    const starMat = new THREE.ShaderMaterial({
      uniforms: { uTime: { value: 0.0 } },
      vertexShader: `
        attribute float aSize;
        attribute float aPhase;
        attribute float aSpeed;
        attribute float aTemp;
        uniform  float uTime;
        varying  float vTwinkle;
        varying  float vTemp;

        void main() {
          float raw    = sin(uTime * aSpeed + aPhase);
          float sq     = raw * raw;
          float flare  = mix(sq, pow(max(raw, 0.0), 1.5), 0.5);
          vTwinkle     = 0.15 + 0.85 * flare;
          vTemp        = aTemp;

          vec4 mv      = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = aSize * (700.0 / -mv.z) * (0.55 + 0.45 * flare);
          gl_Position  = projectionMatrix * mv;
        }
      `,
      fragmentShader: `
        varying float vTwinkle;
        varying float vTemp;

        void main() {
          vec2  uv     = gl_PointCoord - 0.5;
          float d      = length(uv);
          if (d > 0.5) discard;

          /* Diffraction spikes */
          float h = exp(-abs(uv.y) * 20.0) * exp(-abs(uv.x) * 4.0);
          float v = exp(-abs(uv.x) * 20.0) * exp(-abs(uv.y) * 4.0);
          float spike = max(h, v) * 0.45;

          float core = exp(-d * 28.0);
          float glow = exp(-d *  5.0);

          /* Deep electric blue → icy blue-white */
          vec3 cDeep  = vec3(0.04, 0.18, 0.90);
          vec3 cMid   = vec3(0.18, 0.45, 1.00);
          vec3 cIce   = vec3(0.65, 0.82, 1.00);
          vec3 cWhite = vec3(0.90, 0.95, 1.00);

          vec3 col = mix(cDeep, cMid, vTemp);
          col      = mix(col,  cIce, core * vTemp);
          col      = mix(col,  cWhite, core * core);

          float alpha = (glow * 0.55 + core * 1.1 + spike) * vTwinkle;
          gl_FragColor = vec4(col, clamp(alpha, 0.0, 1.0));
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    })

    const starField = new THREE.Points(starGeo, starMat)
    scene.add(starField)

    // ═══════════════════════════════════════════════════
    //  2 · NEBULA  -  large soft blobs, deep-blue glow
    // ═══════════════════════════════════════════════════
    const N_NEB   = 140
    const nebPos  = new Float32Array(N_NEB * 3)
    for (let i = 0; i < N_NEB; i++) {
      nebPos[i*3]   = (Math.random() - .5) * 360
      nebPos[i*3+1] = (Math.random() - .5) * 240
      nebPos[i*3+2] = (Math.random() - .5) * 120 - 40
    }
    const nebGeo = new THREE.BufferGeometry()
    nebGeo.setAttribute('position', new THREE.BufferAttribute(nebPos, 3))
    const nebMat = new THREE.PointsMaterial({
      size: 22, color: 0x0a30cc,
      transparent: true, opacity: 0.025,
      sizeAttenuation: true,
      depthWrite: false, blending: THREE.AdditiveBlending,
    })
    scene.add(new THREE.Points(nebGeo, nebMat))

    // ═══════════════════════════════════════════════════
    //  3 · MOTIFS MÉTIER  -  5 piliers, répartis dans la scène
    // ═══════════════════════════════════════════════════
    const geos: THREE.BufferGeometry[] = []
    const mats: THREE.Material[] = []
    const motifs: { g: THREE.Group; base: THREE.Vector3; parallax: number; tick: (t: number) => void }[] = []

    const wireMat = (opacity: number, color = 0x4d88ff) => {
      const mat = new THREE.LineBasicMaterial({
        color, transparent: true, opacity,
        blending: THREE.AdditiveBlending,
      })
      mats.push(mat)
      return mat
    }
    const wireBox = (w: number, h: number, d: number) => {
      const box = new THREE.BoxGeometry(w, h, d)
      const edges = new THREE.EdgesGeometry(box)
      box.dispose()
      geos.push(edges)
      return edges
    }
    const wireLine = (pts: number[]) => {
      const geo = new THREE.BufferGeometry()
      geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(pts), 3))
      geos.push(geo)
      return geo
    }
    const wireCurve = (pts: THREE.Vector3[], segs = 48) => {
      const curve = new THREE.CatmullRomCurve3(pts, false, 'catmullrom', 0.35)
      const geo = new THREE.BufferGeometry().setFromPoints(curve.getPoints(segs))
      geos.push(geo)
      return geo
    }
    const addMotif = (
      g: THREE.Group,
      x: number, y: number, z: number,
      parallax: number,
      tick: (t: number) => void,
    ) => {
      g.position.set(x, y, z)
      scene.add(g)
      motifs.push({ g, base: new THREE.Vector3(x, y, z), parallax, tick })
    }

    // Stockage : cylindres empilés + disques (base de données / fichiers)
    const storage = new THREE.Group()
    const stMat = wireMat(0.13, 0x38bdf8)
    const stDim = wireMat(0.07, 0x60a5fa)
    for (let i = 0; i < 3; i++) {
      const cyl = new THREE.CylinderGeometry(4.2 - i * 0.3, 4.2 - i * 0.3, 3.2, 20, 1, true)
      const edges = new THREE.EdgesGeometry(cyl)
      cyl.dispose()
      geos.push(edges)
      const layer = new THREE.LineSegments(edges, i === 0 ? stMat : stDim)
      layer.position.y = i * 3.6 - 3.6
      storage.add(layer)
      const ring = new THREE.Line(
        wireLine(
          Array.from({ length: 25 }, (_, j) => {
            const a = (j / 24) * Math.PI * 2
            const r = 4.8 - i * 0.25
            return [Math.cos(a) * r, i * 3.6 - 1.8, Math.sin(a) * r]
          }).flat(),
        ),
        wireMat(0.05),
      )
      storage.add(ring)
    }
    addMotif(storage, -68, 22, -58, 62, (t) => {
      storage.rotation.y = t * 0.06
      storage.rotation.x = Math.sin(t * 0.35) * 0.04
    })

    // Sécurité : bouclier + cadenas
    const security = new THREE.Group()
    const secMat = wireMat(0.15, 0x93c5fd)
    const shieldPts = [0, 9, 0, 7, 7, 0, 7, 0, 0, 0, -7, 0, -7, 0, 0, -7, 7, 0, 0, 9, 0]
    security.add(new THREE.Line(wireLine(shieldPts), secMat))
    security.add(new THREE.Line(wireLine([-3.5, 2, 0.2, 3.5, 2, 0.2, 3.5, -1, 0.2, -3.5, -1, 0.2, -3.5, 2, 0.2]), wireMat(0.11)))
    security.add(new THREE.Line(wireLine([0, -1, 0.2, 0, -4.5, 0.2]), wireMat(0.09)))
    const lockArc = new THREE.EllipseCurve(0, 1.5, 2.2, 2.2, Math.PI, 0, false, 0)
    const lockGeo = new THREE.BufferGeometry().setFromPoints(lockArc.getPoints(24).map(p => new THREE.Vector3(p.x, p.y, 0.2)))
    geos.push(lockGeo)
    security.add(new THREE.Line(lockGeo, wireMat(0.1)))
    addMotif(security, 72, 28, -62, 58, (t) => {
      security.rotation.y = -t * 0.05
      security.rotation.z = Math.sin(t * 0.3) * 0.03
    })

    // Sites web : navigateur détaillé
    const web = new THREE.Group()
    const wMat = wireMat(0.14)
    web.add(new THREE.LineSegments(wireBox(28, 18, 1.2), wMat))
    web.add(new THREE.Line(wireLine([-14, 7, 0.65, 14, 7, 0.65]), wireMat(0.09)))
    for (let row = 0; row < 3; row++) {
      const y = 2 - row * 4
      const w = 12 - row * 2
      web.add(new THREE.Line(wireLine([-10, y, 0.7, -10 + w, y, 0.7]), wireMat(0.06 + row * 0.01)))
    }
    for (let col = 0; col < 3; col++) {
      for (let row = 0; row < 2; row++) {
        const x = -6 + col * 6
        const y = -4 + row * 3
        web.add(new THREE.LineSegments(wireBox(4.5, 2.2, 0.1), wireMat(0.05)))
        web.children[web.children.length - 1].position.set(x, y, 0.75)
      }
    }
    addMotif(web, 58, -6, -26, 48, (t) => {
      web.rotation.y = t * 0.08
      web.rotation.x = Math.sin(t * 0.45) * 0.05
    })

    // Automatisation : boucle de nœuds reliés
    const auto = new THREE.Group()
    const aMat = wireMat(0.14, 0x818cf8)
    const nodePos = [[-7, 7, 0], [7, 7, 0], [7, -7, 0], [-7, -7, 0]]
    nodePos.forEach(([x, y, z]) => {
      auto.add(new THREE.LineSegments(wireBox(4, 4, 1), aMat))
      auto.children[auto.children.length - 1].position.set(x, y, z)
    })
    const loopPts = nodePos.map(([x, y, z]) => new THREE.Vector3(x, y, z))
    loopPts.push(loopPts[0].clone())
    auto.add(new THREE.Line(wireCurve(loopPts, 64), wireMat(0.1)))
    auto.add(new THREE.Line(wireLine([5, 7, 0.5, 8, 9, 0.5, 6.5, 6, 0.5]), wireMat(0.08)))
    const pulseMat = new THREE.PointsMaterial({ color: 0xa78bfa, size: 2.5, transparent: true, opacity: 0.75, sizeAttenuation: true })
    mats.push(pulseMat)
    const pulse = new THREE.Points(wireLine([0, 0, 0, 0, 0, 0]), pulseMat)
    auto.add(pulse)
    addMotif(auto, -62, -14, -34, 52, (t) => {
      auto.rotation.z = t * 0.04
      pulse.position.set(Math.cos(t * 1.2) * 7, Math.sin(t * 1.2) * 7, 0.6)
    })

    // Performance : jauges + barres montantes
    const perf = new THREE.Group()
    const pMat = wireMat(0.15, 0x6ee7b7)
    const barHeights = [4, 7, 10, 13, 16]
    barHeights.forEach((h, i) => {
      const bar = new THREE.LineSegments(wireBox(3.2, h, 1.2), i === 4 ? pMat : wireMat(0.08 + i * 0.015, 0x4d88ff))
      bar.position.set(-8 + i * 4, h / 2 - 8, 0)
      perf.add(bar)
    })
    const gaugeGeo = new THREE.TorusGeometry(9, 0.12, 4, 48, Math.PI * 1.35)
    const gaugeEdges = new THREE.EdgesGeometry(gaugeGeo)
    gaugeGeo.dispose()
    geos.push(gaugeEdges)
    const gauge = new THREE.LineSegments(gaugeEdges, wireMat(0.1))
    gauge.rotation.z = Math.PI * 0.85
    gauge.position.set(0, 6, 0)
    perf.add(gauge)
    perf.add(new THREE.Line(wireLine([0, 6, 0.2, 5, 11, 0.2]), pMat))
    addMotif(perf, 6, -38, -48, 40, (t) => {
      perf.rotation.y = t * 0.07
      gauge.rotation.z = Math.PI * 0.85 + Math.sin(t * 0.8) * 0.15
    })

    // ═══════════════════════════════════════════════════
    //  MOUSE  &  ANIMATION
    // ═══════════════════════════════════════════════════
    let mx = 0, my = 0
    const onMouse = (e: MouseEvent) => {
      mx = (e.clientX / innerWidth  - .5) * 2
      my = (e.clientY / innerHeight - .5) * 2
    }
    window.addEventListener('mousemove', onMouse, { passive: true })

    // Cache layout-dependent values - reading them every frame forces a
    // synchronous reflow. Refresh only on scroll/resize (both passive).
    let scrollProgress = 0
    let docRange = Math.max(document.body.scrollHeight - innerHeight, 1)
    const onScroll = () => { scrollProgress = scrollY / docRange }
    const refreshRange = () => {
      docRange = Math.max(document.body.scrollHeight - innerHeight, 1)
      scrollProgress = scrollY / docRange
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()

    let time = 0, animId: number, paused = false
    const loop = () => {
      animId = requestAnimationFrame(loop)
      if (paused) return
      time += 0.004

      starMat.uniforms.uTime.value = time

      const sp = scrollProgress
      motifs.forEach(({ g, base, parallax, tick }) => {
        tick(time)
        const floatY = Math.sin(time * 0.55 + base.x * 0.02) * 2.2
        g.position.y = base.y + floatY - sp * parallax
      })
      starField.position.y = -sp * 140

      // Camera parallax
      camera.position.x += (mx * 8  - camera.position.x) * 0.02
      camera.position.y += (-my * 5 - camera.position.y) * 0.02
      camera.lookAt(0, 0, 0)

      renderer.render(scene, camera)
    }
    loop()

    const onResize = () => {
      camera.aspect = innerWidth / innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(innerWidth, innerHeight)
      refreshRange()
    }
    window.addEventListener('resize', onResize, { passive: true })

    // Stop burning frames while the tab is in the background
    const onVisibility = () => { paused = document.hidden }
    document.addEventListener('visibilitychange', onVisibility)

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('mousemove', onMouse)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onResize)
      document.removeEventListener('visibilitychange', onVisibility)
      ;[starGeo, nebGeo, ...geos].forEach(g => g.dispose())
      ;[starMat, nebMat, ...mats].forEach(m => m.dispose())
      renderer.dispose()
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }}
    />
  )
}
