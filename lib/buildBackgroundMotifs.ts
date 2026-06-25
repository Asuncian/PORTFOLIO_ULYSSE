import * as THREE from 'three'

export type MotifEntry = {
  g: THREE.Group
  base: THREE.Vector3
  parallax: number
  tick: (t: number) => void
}

type MP = { body: number; main: number; accent: number; edge: number }

const PALETTES = {
  storage:  { body: 0x0a2848, main: 0x38bdf8, accent: 0x6ee7b7, edge: 0x7dd3fc },
  security: { body: 0x0c1e3d, main: 0x93c5fd, accent: 0x4d88ff, edge: 0xbae6fd },
  web:      { body: 0x0c1840, main: 0x4d88ff, accent: 0x8ab8ff, edge: 0x93c5fd },
  auto:     { body: 0x1a1440, main: 0x818cf8, accent: 0xc4b5fd, edge: 0xa5b4fc },
  perf:     { body: 0x0a2830, main: 0x4d88ff, accent: 0x6ee7b7, edge: 0x67e8f9 },
} satisfies Record<string, MP>

type MotifMats = {
  body: THREE.MeshStandardMaterial
  main: THREE.MeshStandardMaterial
  accent: THREE.MeshStandardMaterial
  edge: THREE.LineBasicMaterial
}

export function buildBackgroundMotifs(
  scene: THREE.Scene,
  geos: THREE.BufferGeometry[],
  mats: THREE.Material[],
): MotifEntry[] {
  const motifs: MotifEntry[] = []

  const createMotifMats = (p: MP): MotifMats => {
    const solid = (color: number, intensity = 0.28) => {
      const m = new THREE.MeshStandardMaterial({
        color,
        emissive: color,
        emissiveIntensity: intensity,
        metalness: 0.42,
        roughness: 0.38,
        transparent: true,
        opacity: 0.92,
      })
      mats.push(m)
      return m
    }
    const edge = new THREE.LineBasicMaterial({ color: p.edge, transparent: true, opacity: 0.82 })
    mats.push(edge)
    return {
      body: solid(p.body, 0.14),
      main: solid(p.main, 0.34),
      accent: solid(p.accent, 0.46),
      edge,
    }
  }

  const addMesh = (
    g: THREE.Group,
    geo: THREE.BufferGeometry,
    mat: THREE.MeshStandardMaterial,
    edge: THREE.LineBasicMaterial,
    pos = new THREE.Vector3(),
    rot = new THREE.Euler(),
  ) => {
    const mesh = new THREE.Mesh(geo, mat)
    mesh.position.copy(pos)
    mesh.rotation.copy(rot)
    const edges = new THREE.LineSegments(new THREE.EdgesGeometry(geo), edge)
    edges.position.copy(pos)
    edges.rotation.copy(rot)
    g.add(mesh, edges)
    geos.push(geo)
    return mesh
  }

  const addLine = (g: THREE.Group, pts: THREE.Vector3[], edge: THREE.LineBasicMaterial) => {
    const geo = new THREE.BufferGeometry().setFromPoints(pts)
    geos.push(geo)
    g.add(new THREE.Line(geo, edge))
  }

  const addPedestal = (g: THREE.Group, m: MotifMats, y = -9) => {
    addMesh(g, new THREE.CylinderGeometry(9, 10, 0.6, 24), m.body, m.edge, new THREE.Vector3(0, y, 0))
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

  const buildGear = (g: THREE.Group, r: number, teeth: number, thick: number, m: MotifMats, pos: THREE.Vector3) => {
    const gear = new THREE.Group()
    gear.position.copy(pos)
    const cyl = new THREE.CylinderGeometry(r, r, thick, teeth, 1)
    addMesh(gear, cyl, m.main, m.edge)
    for (let i = 0; i < teeth; i++) {
      const a = (i / teeth) * Math.PI * 2
      const tooth = new THREE.BoxGeometry(1.05, thick * 1.2, 1.3)
      addMesh(
        gear, tooth, m.accent, m.edge,
        new THREE.Vector3(Math.cos(a) * (r + 0.52), Math.sin(a) * (r + 0.52), 0),
        new THREE.Euler(0, 0, -a),
      )
    }
    g.add(gear)
    return gear
  }

  scene.add(new THREE.AmbientLight(0x081428, 1))
  const motifKey = new THREE.DirectionalLight(0x7aa8ff, 0.62)
  motifKey.position.set(40, 60, 90)
  scene.add(motifKey)
  const motifFill = new THREE.PointLight(0x2868ff, 0.75, 500)
  motifFill.position.set(-80, 10, 70)
  scene.add(motifFill)

  // ── Hébergement : baie serveur de face (3 unités + LEDs vertes) ──
  const storage = new THREE.Group()
  const stM = createMotifMats(PALETTES.storage)
  addPedestal(storage, stM)
  addMesh(storage, new THREE.BoxGeometry(16, 18, 7), stM.body, stM.edge, new THREE.Vector3(0, 0, 0))
  ;[5.5, 0, -5.5].forEach((y, i) => {
    addMesh(storage, new THREE.BoxGeometry(14, 4.2, 5.8), stM.main, stM.edge, new THREE.Vector3(0, y, 0.35))
    ;[-5, -2, 1, 4].forEach((x) => {
      addMesh(
        storage,
        new THREE.BoxGeometry(2.2, 0.22, 0.22),
        stM.body, stM.edge,
        new THREE.Vector3(x, y - 0.8, 3.25),
      )
    })
    const ledColor = i < 2 ? stM.accent : stM.main
    addMesh(storage, new THREE.SphereGeometry(0.35, 8, 8), ledColor, stM.edge, new THREE.Vector3(6.2, y, 3.2))
    addMesh(storage, new THREE.SphereGeometry(0.22, 8, 8), stM.accent, stM.edge, new THREE.Vector3(6.2, y - 0.5, 3.2))
  })
  addMotif(storage, -70, 20, -55, 62, (t) => {
    storage.rotation.y = Math.sin(t * 0.04) * 0.08
    storage.rotation.x = 0.04
  })

  // ── Sécurité : bouclier + cadenas lisible ──
  const security = new THREE.Group()
  const secM = createMotifMats(PALETTES.security)
  addPedestal(security, secM)
  const shieldShape = new THREE.Shape()
  shieldShape.moveTo(0, 12)
  shieldShape.bezierCurveTo(10, 11, 12, 6.5, 12, 1.5)
  shieldShape.lineTo(12, -3)
  shieldShape.bezierCurveTo(12, -9, 6.5, -12.5, 0, -13.5)
  shieldShape.bezierCurveTo(-6.5, -12.5, -12, -9, -12, -3)
  shieldShape.lineTo(-12, 1.5)
  shieldShape.bezierCurveTo(-12, 6.5, -10, 11, 0, 12)
  const shieldGeo = new THREE.ExtrudeGeometry(shieldShape, {
    depth: 2.2,
    bevelEnabled: true,
    bevelThickness: 0.3,
    bevelSize: 0.22,
    bevelSegments: 4,
    curveSegments: 32,
  })
  shieldGeo.center()
  addMesh(security, shieldGeo, secM.body, secM.edge, new THREE.Vector3(0, 1, -1.2))
  addMesh(
    security,
    new THREE.TorusGeometry(2.8, 0.32, 10, 32, Math.PI),
    secM.main, secM.edge,
    new THREE.Vector3(0, 3.2, 2),
  )
  addMesh(security, new THREE.BoxGeometry(5.4, 5.8, 1.8), secM.main, secM.edge, new THREE.Vector3(0, -0.2, 1.8))
  addMesh(
    security,
    new THREE.CylinderGeometry(0.5, 0.5, 0.35, 12),
    secM.accent, secM.edge,
    new THREE.Vector3(0, -0.8, 2.7),
    new THREE.Euler(Math.PI / 2, 0, 0),
  )
  addMesh(security, new THREE.BoxGeometry(0.4, 1.3, 0.25), secM.accent, secM.edge, new THREE.Vector3(0, -1.9, 2.75))
  addMotif(security, 74, 26, -58, 58, (t) => {
    security.rotation.y = -0.12 + Math.sin(t * 0.035) * 0.06
  })

  // ── Web : navigateur + globe ──
  const web = new THREE.Group()
  const wM = createMotifMats(PALETTES.web)
  addPedestal(web, wM)
  addMesh(web, new THREE.BoxGeometry(26, 17, 2.4), wM.body, wM.edge)
  addMesh(web, new THREE.BoxGeometry(24, 11, 0.4), wM.main, wM.edge, new THREE.Vector3(0, -1.5, 1.25))
  addMesh(web, new THREE.BoxGeometry(16, 2, 0.35), wM.accent, wM.edge, new THREE.Vector3(0, 6.5, 1.3))
  ;[-9.5, -6, -2.5].forEach((x, i) => {
    const dotMat = i === 0 ? wM.accent : wM.main
    addMesh(web, new THREE.SphereGeometry(0.42, 10, 10), dotMat, wM.edge, new THREE.Vector3(x, 6.5, 1.45))
  })
  ;[[12, 3], [10, 0], [8, -3], [6, -5.5]].forEach(([w, y]) => {
    addMesh(web, new THREE.BoxGeometry(w, 0.4, 0.22), wM.accent, wM.edge, new THREE.Vector3(0, y, 1.35))
  })
  addMesh(web, new THREE.SphereGeometry(4.2, 20, 20), wM.main, wM.edge, new THREE.Vector3(14, -1, 2.8))
  addMesh(web, new THREE.TorusGeometry(4.2, 0.22, 8, 32), wM.accent, wM.edge, new THREE.Vector3(14, -1, 2.8), new THREE.Euler(1.1, 0.4, 0.2))
  addMesh(web, new THREE.TorusGeometry(4.2, 0.22, 8, 32), wM.accent, wM.edge, new THREE.Vector3(14, -1, 2.8), new THREE.Euler(0.3, 1.2, 0.6))
  addMotif(web, 60, -4, -24, 48, (t) => {
    web.rotation.y = 0.14 + Math.sin(t * 0.03) * 0.05
  })

  // ── Automatisation : workflow email → engrenage → base de données ──
  const auto = new THREE.Group()
  const aM = createMotifMats(PALETTES.auto)
  addPedestal(auto, aM)
  const n1 = new THREE.Vector3(-11, 0, 0)
  const n2 = new THREE.Vector3(0, 0, 0)
  const n3 = new THREE.Vector3(11, 0, 0)
  addMesh(auto, new THREE.BoxGeometry(6.5, 4.5, 1.6), aM.main, aM.edge, n1)
  addMesh(auto, new THREE.ConeGeometry(3.2, 2.2, 4), aM.accent, aM.edge, new THREE.Vector3(-11, 3.2, 0.8), new THREE.Euler(0, 0, Math.PI))
  addMesh(auto, new THREE.BoxGeometry(5.5, 3.5, 1.6), aM.main, aM.edge, n2)
  addMesh(auto, new THREE.CylinderGeometry(3.2, 3.2, 5.5, 20), aM.main, aM.edge, new THREE.Vector3(n3.x, 0.5, 0))
  addMesh(auto, new THREE.CylinderGeometry(3.5, 3.5, 0.8, 20), aM.accent, aM.edge, new THREE.Vector3(n3.x, 3.2, 0))
  ;[-1.2, 0.8].forEach((y) => {
    addMesh(auto, new THREE.CylinderGeometry(0.18, 0.18, 1.2, 8), aM.accent, aM.edge, new THREE.Vector3(n3.x, y, 1.05), new THREE.Euler(Math.PI / 2, 0, 0))
  })
  const gear = buildGear(auto, 1.35, 10, 0.55, aM, n2)
  gear.rotation.x = Math.PI / 2
  addLine(auto, [new THREE.Vector3(-7.5, 0, 0.9), new THREE.Vector3(-2.8, 0, 0.9)], aM.edge)
  addLine(auto, [new THREE.Vector3(2.8, 0, 0.9), new THREE.Vector3(7.5, 0, 0.9)], aM.edge)
  addMesh(auto, new THREE.ConeGeometry(0.9, 1.4, 3), aM.accent, aM.edge, new THREE.Vector3(-4.8, 0, 0.9), new THREE.Euler(0, 0, -Math.PI / 2))
  addMesh(auto, new THREE.ConeGeometry(0.9, 1.4, 3), aM.accent, aM.edge, new THREE.Vector3(4.8, 0, 0.9), new THREE.Euler(0, 0, -Math.PI / 2))
  addMotif(auto, -64, -12, -32, 52, (t) => {
    gear.rotation.z = t * 0.14
    auto.rotation.y = 0.08
  })

  // ── Performance : éclair (vitesse) + flèche montante ──
  const perf = new THREE.Group()
  const pM = createMotifMats(PALETTES.perf)
  addPedestal(perf, pM)
  const bolt = new THREE.Shape()
  bolt.moveTo(1.5, 14)
  bolt.lineTo(-2, 2)
  bolt.lineTo(1, 2)
  bolt.lineTo(-1.5, -14)
  bolt.lineTo(4, 0)
  bolt.lineTo(0.5, 0)
  bolt.lineTo(1.5, 14)
  const boltGeo = new THREE.ExtrudeGeometry(bolt, {
    depth: 2.4,
    bevelEnabled: true,
    bevelThickness: 0.2,
    bevelSize: 0.18,
    bevelSegments: 3,
  })
  boltGeo.center()
  const boltMesh = addMesh(perf, boltGeo, pM.accent, pM.edge, new THREE.Vector3(-2, 2, 0))
  boltMesh.rotation.z = 0.08
  addMesh(
    perf,
    new THREE.TorusGeometry(8, 0.3, 8, 36, Math.PI * 0.72),
    pM.main, pM.edge,
    new THREE.Vector3(5, -4, 0),
    new THREE.Euler(0, 0, -0.4),
  )
  ;[2, 5, 8].forEach((h, i) => {
    addMesh(
      perf,
      new THREE.BoxGeometry(2.2, h, 1.6),
      i === 2 ? pM.accent : pM.main,
      pM.edge,
      new THREE.Vector3(8 + i * 3.2, h / 2 - 5, 0),
    )
  })
  addMesh(perf, new THREE.ConeGeometry(1.2, 2.2, 3), pM.accent, pM.edge, new THREE.Vector3(15, 4.5, 0), new THREE.Euler(0, 0, 0.6))
  addMotif(perf, 8, -36, -46, 40, (t) => {
    perf.rotation.y = 0.1 + Math.sin(t * 0.028) * 0.05
    boltMesh.position.y = 2 + Math.sin(t * 0.8) * 0.35
  })

  return motifs
}
