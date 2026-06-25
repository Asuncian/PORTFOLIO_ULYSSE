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
    //  3 · CONSTELLATION LINES
    // ═══════════════════════════════════════════════════
    const linePts: number[] = []
    for (let i = 0; i < 90; i++) {
      const si = Math.floor(Math.random() * N_STARS)
      const sx = sPos[si*3], sy = sPos[si*3+1], sz = sPos[si*3+2]
      let best = -1, bestD = Infinity
      for (let t = 0; t < 30; t++) {
        const sj = Math.floor(Math.random() * N_STARS)
        if (sj === si) continue
        const dx = sPos[sj*3]-sx, dy = sPos[sj*3+1]-sy, dz = sPos[sj*3+2]-sz
        const dist = Math.sqrt(dx*dx + dy*dy + dz*dz)
        if (dist < 60 && dist < bestD) { bestD = dist; best = sj }
      }
      if (best < 0) continue
      linePts.push(sx, sy, sz, sPos[best*3], sPos[best*3+1], sPos[best*3+2])
    }
    const lineGeo = new THREE.BufferGeometry()
    lineGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(linePts), 3))
    const lineMat = new THREE.LineBasicMaterial({
      color: 0x1650f0, transparent: true, opacity: 0.055,
      blending: THREE.AdditiveBlending,
    })
    scene.add(new THREE.LineSegments(lineGeo, lineMat))

    // ═══════════════════════════════════════════════════
    //  4 · HERO ICOSAHEDRON  -  wireframe, electric blue
    // ═══════════════════════════════════════════════════
    const icoGeo = new THREE.IcosahedronGeometry(24, 1)
    const icoMat = new THREE.MeshBasicMaterial({
      color: 0x1650f0, wireframe: true,
      transparent: true, opacity: 0.085,
    })
    const ico = new THREE.Mesh(icoGeo, icoMat)
    ico.position.set(42, 8, -35)
    scene.add(ico)

    // ═══════════════════════════════════════════════════
    //  5 · GLOWING TORUS  -  animated shader
    // ═══════════════════════════════════════════════════
    const torusGeo = new THREE.TorusGeometry(16, 0.3, 8, 100)
    const torusMat = new THREE.ShaderMaterial({
      uniforms: { uTime: { value: 0.0 } },
      vertexShader: `
        varying vec3 vWorldPos;
        void main() {
          vWorldPos = position;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uTime;
        varying vec3 vWorldPos;
        void main() {
          float a = atan(vWorldPos.y, vWorldPos.x);
          float t = sin(a * 4.0 + uTime * 1.6) * 0.5 + 0.5;
          vec3 col = mix(vec3(0.06, 0.20, 0.88), vec3(0.30, 0.62, 1.0), t);
          gl_FragColor = vec4(col, 0.55 * t + 0.06);
        }
      `,
      transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
    })
    const torus = new THREE.Mesh(torusGeo, torusMat)
    torus.position.set(-36, -10, -25)
    torus.rotation.x = 0.9
    scene.add(torus)

    // ═══════════════════════════════════════════════════
    //  6 · OCTAHEDRON  -  floating accent
    // ═══════════════════════════════════════════════════
    const octaGeo = new THREE.OctahedronGeometry(8, 0)
    const octaMat = new THREE.MeshBasicMaterial({
      color: 0x4d88ff, wireframe: true,
      transparent: true, opacity: 0.16,
    })
    const octa = new THREE.Mesh(octaGeo, octaMat)
    octa.position.set(-45, 22, -28)
    scene.add(octa)

    // ═══════════════════════════════════════════════════
    //  7 · LARGE AMBIENT RING
    // ═══════════════════════════════════════════════════
    const ringGeo = new THREE.TorusGeometry(55, 0.15, 4, 200)
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x1650f0, transparent: true, opacity: 0.03,
    })
    const ring = new THREE.Mesh(ringGeo, ringMat)
    ring.rotation.x = 0.35
    ring.position.z = -80
    scene.add(ring)

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

      starMat.uniforms.uTime.value  = time
      torusMat.uniforms.uTime.value = time

      ico.rotation.y  = time * 0.10
      ico.rotation.x  = time * 0.06
      torus.rotation.z = time * 0.14
      torus.rotation.y = Math.sin(time * 0.35) * 0.28
      octa.rotation.y  = time * 0.18
      octa.rotation.x  = time * 0.10
      ring.rotation.z  = time * 0.035
      octa.position.y  = 22 + Math.sin(time * 0.65) * 3.5

      // Scroll parallax (uses cached progress - no per-frame layout reads)
      const sp = scrollProgress
      starField.position.y  = -sp * 140
      ico.position.y        =  8  - sp * 70
      torus.position.y      = -10 - sp * 45

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
      ;[starGeo, nebGeo, lineGeo, icoGeo, torusGeo, octaGeo, ringGeo].forEach(g => g.dispose())
      ;[starMat, nebMat, lineMat, icoMat, torusMat, octaMat, ringMat].forEach(m => m.dispose())
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
