'use client'
import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { buildBackgroundMotifs } from '@/lib/buildBackgroundMotifs'

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
    const motifs = buildBackgroundMotifs(scene, geos, mats)

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
