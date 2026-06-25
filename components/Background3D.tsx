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

    // Stockage : baie serveur avec unités et disques
    const storage = new THREE.Group()
    const stMain = wireMat(0.14, 0x38bdf8)
    const stDim = wireMat(0.08, 0x60a5fa)
    storage.add(new THREE.LineSegments(wireBox(16, 18, 9), stMain))
    for (let i = 0; i < 4; i++) {
      const y = 6 - i * 3.8
      const unit = new THREE.LineSegments(wireBox(13.5, 2.8, 7.2), stDim)
      unit.position.y = y
      storage.add(unit)
      storage.add(new THREE.Line(wireLine([-5, y, 3.65, 5, y, 3.65]), wireMat(0.1, 0x6ee7b7)))
      storage.add(new THREE.Line(wireLine([-5, y - 0.5, 3.65, 3, y - 0.5, 3.65]), wireMat(0.06)))
      const led = new THREE.Points(
        wireLine([-6, y, 3.7, -6, y, 3.7]),
        new THREE.PointsMaterial({ color: 0x6ee7b7, size: 2.8, transparent: true, opacity: 0.8, sizeAttenuation: true }),
      )
      mats.push(led.material as THREE.Material)
      storage.add(led)
    }
    addMotif(storage, -70, 20, -55, 62, (t) => {
      storage.rotation.y = t * 0.05
    })

    // Sécurité : cadenas sur bouclier
    const security = new THREE.Group()
    const secMain = wireMat(0.16, 0x93c5fd)
    const shield = [0, 10, 0, 8, 8, 0, 8, 1, 0, 0, -8, 0, -8, 1, 0, -8, 8, 0, 0, 10, 0]
    security.add(new THREE.Line(wireLine(shield), wireMat(0.09, 0x4d88ff)))
    const shackle = new THREE.TorusGeometry(2.8, 0.18, 8, 20, Math.PI)
    const shackleEdges = new THREE.EdgesGeometry(shackle)
    shackle.dispose()
    geos.push(shackleEdges)
    const shackleLine = new THREE.LineSegments(shackleEdges, secMain)
    shackleLine.position.set(0, 3.2, 0.3)
    security.add(shackleLine)
    const lockBody = new THREE.LineSegments(wireBox(5.5, 5, 1.2), secMain)
    lockBody.position.set(0, -0.5, 0.5)
    security.add(lockBody)
    security.add(new THREE.Line(wireLine([0, -1.2, 0.7, 0, -3.2, 0.7]), wireMat(0.1)))
    const keyhole = new THREE.CircleGeometry(0.55, 12, 0, Math.PI)
    const keyholeEdges = new THREE.EdgesGeometry(keyhole)
    keyhole.dispose()
    geos.push(keyholeEdges)
    const kh = new THREE.LineSegments(keyholeEdges, wireMat(0.12))
    kh.position.set(0, -1.5, 0.75)
    security.add(kh)
    addMotif(security, 74, 26, -58, 58, (t) => {
      security.rotation.y = -t * 0.04
    })

    // Sites web : fenêtre navigateur lisible
    const web = new THREE.Group()
    const wMain = wireMat(0.15, 0x4d88ff)
    web.add(new THREE.LineSegments(wireBox(30, 20, 1.4), wMain))
    web.add(new THREE.Line(wireLine([-15, 8, 0.75, 15, 8, 0.75]), wireMat(0.1)))
    ;[[-11, 8.5], [-8, 8.5], [-5, 8.5]].forEach(([x, y], i) => {
      const colors = [0xf87171, 0xfbbf24, 0x4ade80]
      const dot = new THREE.Points(
        wireLine([x, y, 0.8, x, y, 0.8]),
        new THREE.PointsMaterial({ color: colors[i], size: 2.2, sizeAttenuation: true }),
      )
      mats.push(dot.material as THREE.Material)
      web.add(dot)
    })
    const addrBar = new THREE.LineSegments(wireBox(18, 2.2, 0.2), wireMat(0.08))
    addrBar.position.set(2, 8.5, 0.85)
    web.add(addrBar)
    const content = new THREE.LineSegments(wireBox(24, 10, 0.15), wireMat(0.07))
    content.position.set(0, -1, 0.8)
    web.add(content)
    ;[[-8, 2], [-8, -1], [-8, -4]].forEach(([x, y], i) => {
      web.add(new THREE.Line(wireLine([x, y, 0.85, x + 14 - i * 3, y, 0.85]), wireMat(0.06 + i * 0.01)))
    })
    addMotif(web, 60, -4, -24, 48, (t) => {
      web.rotation.y = t * 0.06
    })

    // Automatisation : engrenages + flux de nœuds
    const auto = new THREE.Group()
    const aMain = wireMat(0.14, 0x818cf8)
    const gear = (r: number, teeth: number, y: number, x: number, z: number) => {
      const g = new THREE.CylinderGeometry(r, r, 0.6, teeth, 1)
      const e = new THREE.EdgesGeometry(g)
      g.dispose()
      geos.push(e)
      const mesh = new THREE.LineSegments(e, aMain)
      mesh.position.set(x, y, z)
      mesh.rotation.x = Math.PI / 2
      auto.add(mesh)
    }
    gear(3.2, 10, 0, -2.5, 0)
    gear(2.2, 8, 0, 3.5, 0.4)
    const nodes = [[-9, 5, 0], [9, 5, 0], [9, -5, 0], [-9, -5, 0]]
    nodes.forEach(([x, y, z]) => {
      const node = new THREE.LineSegments(wireBox(3.5, 3.5, 0.8), wireMat(0.11, 0xa78bfa))
      node.position.set(x, y, z)
      auto.add(node)
    })
    auto.add(new THREE.Line(wireCurve(
      nodes.map(([x, y, z]) => new THREE.Vector3(x, y, z)).concat([new THREE.Vector3(nodes[0][0], nodes[0][1], nodes[0][2])]),
      80,
    ), wireMat(0.1)))
    ;[[5, 5, 0.5, 8, 7, 0.5], [-5, -5, 0.5, -8, -7, 0.5]].forEach(pts => {
      auto.add(new THREE.Line(wireLine(pts), wireMat(0.08)))
    })
    const pulseMat = new THREE.PointsMaterial({ color: 0xc4b5fd, size: 2.8, transparent: true, opacity: 0.85, sizeAttenuation: true })
    mats.push(pulseMat)
    const pulse = new THREE.Points(wireLine([0, 0, 0, 0, 0, 0]), pulseMat)
    auto.add(pulse)
    addMotif(auto, -64, -12, -32, 52, (t) => {
      auto.children[0].rotation.z = t * 0.12
      auto.children[1].rotation.z = -t * 0.16
      pulse.position.set(Math.cos(t * 0.9) * 9, Math.sin(t * 0.9) * 5, 0.8)
    })

    // Performance : jauge vitesse + courbe montante
    const perf = new THREE.Group()
    const pMain = wireMat(0.16, 0x6ee7b7)
    const gauge = new THREE.TorusGeometry(10, 0.14, 4, 48, Math.PI * 1.1)
    const gaugeE = new THREE.EdgesGeometry(gauge)
    gauge.dispose()
    geos.push(gaugeE)
    const gaugeLine = new THREE.LineSegments(gaugeE, wireMat(0.11))
    gaugeLine.rotation.z = Math.PI * 1.05
    gaugeLine.position.set(0, 2, 0)
    perf.add(gaugeLine)
    const needle = new THREE.Line(wireLine([0, 2, 0.2, 7, 9, 0.2]), pMain)
    perf.add(needle)
    const bars = [3.5, 6, 8.5, 11, 13.5]
    bars.forEach((h, i) => {
      const bar = new THREE.LineSegments(wireBox(2.8, h, 1), i === 4 ? pMain : wireMat(0.08 + i * 0.012, 0x4d88ff))
      bar.position.set(-8 + i * 4, h / 2 - 9, 0)
      perf.add(bar)
    })
    perf.add(new THREE.Line(wireLine([-8, -9, 0.2, 8, 5, 0.2]), wireMat(0.09, 0x38bdf8)))
    addMotif(perf, 8, -36, -46, 40, (t) => {
      perf.rotation.y = t * 0.05
      needle.rotation.z = Math.sin(t * 0.7) * 0.25
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
