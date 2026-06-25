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

    const wireEllipse = (rx: number, ry: number, y: number, z: number, segs = 14) => {
      const curve = new THREE.EllipseCurve(0, y, rx, ry, 0, Math.PI * 2, false, 0)
      return curve.getPoints(segs).flatMap(p => [p.x, p.y, z])
    }
    const addDisk = (
      g: THREE.Group, y: number, rx: number, ry: number, depth: number,
      mat: THREE.LineBasicMaterial, dim = wireMat(0.07),
    ) => {
      const fz = depth * 0.5
      const bz = -depth * 0.5
      for (const z of [fz, bz]) {
        const ring = wireEllipse(rx, ry, y, z, 16)
        ring.push(ring[0], ring[1], ring[2])
        g.add(new THREE.Line(wireLine(ring), mat))
      }
      ;[[-rx, y], [rx, y], [0, y + ry], [0, y - ry]].forEach(([x, py]) => {
        g.add(new THREE.Line(wireLine([x, py, fz, x, py, bz]), dim))
      })
      g.add(new THREE.Line(wireLine([-rx * 0.55, y, fz + 0.05, rx * 0.55, y, fz + 0.05]), dim))
    }
    const addWireBox = (
      g: THREE.Group, w: number, h: number, d: number,
      x: number, y: number, z: number, mat: THREE.LineBasicMaterial,
    ) => {
      const box = new THREE.LineSegments(wireBox(w, h, d), mat)
      box.position.set(x, y, z)
      g.add(box)
    }
    const addArrow = (
      g: THREE.Group, x1: number, y: number, x2: number, z: number,
      mat: THREE.LineBasicMaterial,
    ) => {
      g.add(new THREE.Line(wireLine([x1, y, z, x2, y, z]), mat))
      const tip = x2 > x1 ? -1 : 1
      g.add(new THREE.Line(wireLine([
        x2, y, z,
        x2 + tip * 1.4, y + 0.9, z,
        x2 + tip * 1.4, y - 0.9, z,
        x2, y, z,
      ]), mat))
    }

    // Stockage : base de données 3D (disques empilés)
    const storage = new THREE.Group()
    const dbMain = wireMat(0.14, 0x38bdf8)
    const dbDim = wireMat(0.08, 0x60a5fa)
    ;[5, 0.5, -4].forEach(y => addDisk(storage, y, 5.5, 1.35, 2.4, dbMain, dbDim))
    addMotif(storage, -70, 20, -55, 62, (t) => {
      storage.rotation.y = 0.28 + t * 0.035
      storage.rotation.x = 0.08
    })

    // Sécurité : cadenas 3D
    const security = new THREE.Group()
    const secMain = wireMat(0.15, 0x93c5fd)
    const shackle = new THREE.TorusGeometry(2.6, 0.2, 8, 22, Math.PI)
    const shE = new THREE.EdgesGeometry(shackle)
    shackle.dispose()
    geos.push(shE)
    const shLine = new THREE.LineSegments(shE, secMain)
    shLine.position.set(0, 2.8, 0)
    security.add(shLine)
    addWireBox(security, 5.2, 5, 2, 0, -1.5, 0, secMain)
    security.add(new THREE.Line(wireLine([0, -2.2, 1.05, 0, -3.6, 1.05]), wireMat(0.1)))
    const shield = [0, 9, -0.5, 7.5, 7, -0.5, 7.5, 0, -0.5, 0, -7, -0.5, -7.5, 0, -0.5, -7.5, 7, -0.5, 0, 9, -0.5]
    security.add(new THREE.Line(wireLine(shield), wireMat(0.07, 0x4d88ff)))
    addMotif(security, 74, 26, -58, 58, (t) => {
      security.rotation.y = -0.22 - t * 0.03
    })

    // Sites web : navigateur 3D
    const web = new THREE.Group()
    const wMain = wireMat(0.14, 0x4d88ff)
    addWireBox(web, 26, 17, 2.2, 0, 0, 0, wMain)
    web.add(new THREE.Line(wireLine([-13, 6.5, 1.15, 13, 6.5, 1.15]), wireMat(0.1)))
    addWireBox(web, 16, 2, 0.25, 0, 7.2, 1.2, wireMat(0.08))
    ;[[-8, 2], [-8, -1], [-8, -4]].forEach(([x, y], i) => {
      web.add(new THREE.Line(wireLine([x, y, 1.15, x + 12 - i * 2.5, y, 1.15]), wireMat(0.07 + i * 0.01)))
    })
    ;[[-10.5, 7.2], [-7.5, 7.2], [-4.5, 7.2]].forEach(([x, y], i) => {
      const colors = [0xf87171, 0xfbbf24, 0x4ade80]
      web.add(new THREE.Line(wireLine([x, y, 1.25, x + 0.01, y, 1.25]), wireMat(0.12, colors[i])))
    })
    addMotif(web, 60, -4, -24, 48, (t) => {
      web.rotation.y = 0.18 + t * 0.04
    })

    // Automatisation : pipeline déclencheur → engrenage → action
    const auto = new THREE.Group()
    const aMain = wireMat(0.14, 0x818cf8)
    const aAccent = wireMat(0.12, 0xc4b5fd)
    addWireBox(auto, 5, 4, 1.8, -10, 0, 0, aMain)
    addArrow(auto, -7.2, 0, -3.5, 0.95, aAccent)
    const gearGeo = new THREE.CylinderGeometry(3.2, 3.2, 0.7, 10, 1)
    const gearE = new THREE.EdgesGeometry(gearGeo)
    gearGeo.dispose()
    geos.push(gearE)
    const gearMesh = new THREE.LineSegments(gearE, aMain)
    gearMesh.rotation.x = Math.PI / 2
    auto.add(gearMesh)
    addArrow(auto, 3.5, 0, 7.2, 0.95, aAccent)
    addWireBox(auto, 5, 4, 1.8, 10, 0, 0, aMain)
    auto.add(new THREE.Line(wireLine([0, 2.8, 0.4, 0, 4.8, 0.4]), wireMat(0.08)))
    addMotif(auto, -64, -12, -32, 52, (t) => {
      gearMesh.rotation.z = t * 0.1
      auto.rotation.y = 0.12
    })

    // Performance : jauge 3D + barres en volume
    const perf = new THREE.Group()
    const pMain = wireMat(0.15, 0x6ee7b7)
    const gaugeGeo = new THREE.TorusGeometry(8, 0.14, 4, 36, Math.PI * 1.15)
    const gaugeE = new THREE.EdgesGeometry(gaugeGeo)
    gaugeGeo.dispose()
    geos.push(gaugeE)
    const gauge = new THREE.LineSegments(gaugeE, wireMat(0.11))
    gauge.rotation.z = Math.PI * 1.08
    gauge.position.set(0, 7, 0)
    perf.add(gauge)
    const needle = new THREE.Line(wireLine([0, 7, 0.2, 5.5, 11.5, 0.2]), pMain)
    perf.add(needle)
    const barData = [4, 7, 10, 13]
    barData.forEach((h, i) => {
      const x = -6 + i * 4
      addWireBox(perf, 2.6, h, 1.6, x, h / 2 - 6, 0, i === 3 ? pMain : wireMat(0.09, 0x4d88ff))
    })
    addWireBox(perf, 18, 0.4, 2, 0, -6.2, 0, wireMat(0.07))
    addMotif(perf, 8, -36, -46, 40, (t) => {
      perf.rotation.y = 0.15 + t * 0.035
      needle.rotation.z = Math.sin(t * 0.65) * 0.22
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
