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
        opacity: 0.9,
      })
      mats.push(m)
      return m
    }
    const edge = new THREE.LineBasicMaterial({ color: p.edge, transparent: true, opacity: 0.78 })
    mats.push(edge)
    return {
      body: solid(p.body, 0.14),
      main: solid(p.main, 0.32),
      accent: solid(p.accent, 0.42),
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

  const buildGear = (g: THREE.Group, r: number, teeth: number, thick: number, m: MotifMats) => {
    const gear = new THREE.Group()
    gear.rotation.x = Math.PI / 2
    const cyl = new THREE.CylinderGeometry(r, r, thick, teeth, 1)
    addMesh(gear, cyl, m.main, m.edge)
    for (let i = 0; i < teeth; i++) {
      const a = (i / teeth) * Math.PI * 2
      const tooth = new THREE.BoxGeometry(1.1, thick * 1.15, 1.35)
      addMesh(
        gear, tooth, m.accent, m.edge,
        new THREE.Vector3(Math.cos(a) * (r + 0.55), Math.sin(a) * (r + 0.55), 0),
        new THREE.Euler(0, 0, -a),
      )
    }
    g.add(gear)
    return gear
  }

  scene.add(new THREE.AmbientLight(0x081428, 0.95))
  const motifKey = new THREE.DirectionalLight(0x7aa8ff, 0.55)
  motifKey.position.set(40, 60, 90)
  scene.add(motifKey)
  const motifFill = new THREE.PointLight(0x2868ff, 0.7, 500)
  motifFill.position.set(-80, 10, 70)
  scene.add(motifFill)

  // Stockage : baie serveur
  const storage = new THREE.Group()
  const stM = createMotifMats(PALETTES.storage)
  addMesh(storage, new THREE.BoxGeometry(14, 16, 8), stM.body, stM.edge)
  for (let i = 0; i < 4; i++) {
    const y = 5.5 - i * 3.6
    addMesh(storage, new THREE.BoxGeometry(12, 2.4, 6.8), stM.main, stM.edge, new THREE.Vector3(0, y, 0.2))
    addMesh(storage, new THREE.BoxGeometry(8, 0.18, 0.18), stM.accent, stM.edge, new THREE.Vector3(0, y, 3.55))
    addMesh(storage, new THREE.CylinderGeometry(0.22, 0.22, 0.22, 8), stM.accent, stM.edge, new THREE.Vector3(-5.2, y, 3.5))
  }
  addMotif(storage, -70, 20, -55, 62, (t) => {
    storage.rotation.y = 0.3 + t * 0.03
    storage.rotation.x = 0.06
  })

  // Sécurité : bouclier biseauté + cadenas
  const security = new THREE.Group()
  const secM = createMotifMats(PALETTES.security)
  const shieldShape = new THREE.Shape()
  shieldShape.moveTo(0, 11.5)
  shieldShape.bezierCurveTo(9.5, 10.5, 11, 6.5, 11, 2)
  shieldShape.lineTo(11, -2.5)
  shieldShape.bezierCurveTo(11, -8, 6, -11.5, 0, -12.5)
  shieldShape.bezierCurveTo(-6, -11.5, -11, -8, -11, -2.5)
  shieldShape.lineTo(-11, 2)
  shieldShape.bezierCurveTo(-11, 6.5, -9.5, 10.5, 0, 11.5)
  const shieldGeo = new THREE.ExtrudeGeometry(shieldShape, {
    depth: 2,
    bevelEnabled: true,
    bevelThickness: 0.25,
    bevelSize: 0.2,
    bevelSegments: 3,
    curveSegments: 28,
  })
  shieldGeo.center()
  const shield = addMesh(security, shieldGeo, secM.body, secM.edge, new THREE.Vector3(0, 0, -1.4))
  shield.rotation.x = -0.1
  addMesh(security, new THREE.TorusGeometry(2.4, 0.28, 10, 28, Math.PI), secM.main, secM.edge, new THREE.Vector3(0, 2.5, 1.8))
  addMesh(security, new THREE.BoxGeometry(4.8, 5.2, 1.6), secM.main, secM.edge, new THREE.Vector3(0, -0.8, 1.6))
  addMesh(
    security,
    new THREE.CylinderGeometry(0.45, 0.45, 0.3, 12),
    secM.accent, secM.edge,
    new THREE.Vector3(0, -1.2, 2.45),
    new THREE.Euler(Math.PI / 2, 0, 0),
  )
  addMesh(security, new THREE.BoxGeometry(0.35, 1.1, 0.2), secM.accent, secM.edge, new THREE.Vector3(0, -2.1, 2.5))
  addMotif(security, 74, 26, -58, 58, (t) => {
    security.rotation.y = -0.2 - t * 0.028
  })

  // Sites web : navigateur
  const web = new THREE.Group()
  const wM = createMotifMats(PALETTES.web)
  addMesh(web, new THREE.BoxGeometry(24, 16, 2.2), wM.body, wM.edge)
  addMesh(web, new THREE.BoxGeometry(22, 10.5, 0.35), wM.main, wM.edge, new THREE.Vector3(0, -1.2, 1.15))
  addMesh(web, new THREE.BoxGeometry(15, 1.8, 0.3), wM.accent, wM.edge, new THREE.Vector3(0, 6.2, 1.2))
  ;[-9, -6, -3].forEach((x, i) => {
    const dotMat = i === 0 ? wM.accent : i === 1 ? wM.main : wM.accent
    addMesh(web, new THREE.SphereGeometry(0.38, 10, 10), dotMat, wM.edge, new THREE.Vector3(x, 6.2, 1.35))
  })
  ;[[11, 2.5], [9, -0.5], [7, -3.5]].forEach(([w, y], i) => {
    addMesh(web, new THREE.BoxGeometry(w, 0.35, 0.2), wM.accent, wM.edge, new THREE.Vector3(0, y, 1.28))
  })
  addMotif(web, 60, -4, -24, 48, (t) => {
    web.rotation.y = 0.2 + t * 0.035
  })

  // Automatisation : pipeline + engrenage
  const auto = new THREE.Group()
  const aM = createMotifMats(PALETTES.auto)
  addMesh(auto, new THREE.BoxGeometry(5, 3.8, 1.8), aM.main, aM.edge, new THREE.Vector3(-10, 0, 0))
  addMesh(auto, new THREE.BoxGeometry(5, 3.8, 1.8), aM.main, aM.edge, new THREE.Vector3(10, 0, 0))
  addMesh(auto, new THREE.BoxGeometry(3.2, 0.35, 0.35), aM.accent, aM.edge, new THREE.Vector3(-6.5, 0, 1.05))
  addMesh(auto, new THREE.BoxGeometry(3.2, 0.35, 0.35), aM.accent, aM.edge, new THREE.Vector3(6.5, 0, 1.05))
  addMesh(auto, new THREE.ConeGeometry(0.7, 1.2, 3), aM.accent, aM.edge, new THREE.Vector3(-4.2, 0, 1.05), new THREE.Euler(0, 0, -Math.PI / 2))
  addMesh(auto, new THREE.ConeGeometry(0.7, 1.2, 3), aM.accent, aM.edge, new THREE.Vector3(4.2, 0, 1.05), new THREE.Euler(0, 0, -Math.PI / 2))
  const gearGroup = buildGear(auto, 3, 12, 0.75, aM)
  addMotif(auto, -64, -12, -32, 52, (t) => {
    gearGroup.rotation.z = t * 0.12
    auto.rotation.y = 0.1
  })

  // Performance : jauge + barres
  const perf = new THREE.Group()
  const pM = createMotifMats(PALETTES.perf)
  addMesh(
    perf,
    new THREE.TorusGeometry(7.5, 0.35, 8, 40, Math.PI * 1.12),
    pM.main, pM.edge,
    new THREE.Vector3(0, 6.5, 0),
    new THREE.Euler(0, 0, Math.PI * 1.06),
  )
  const needleGeo = new THREE.BoxGeometry(0.2, 5.5, 0.25)
  needleGeo.translate(0, 2.5, 0)
  const needle = addMesh(perf, needleGeo, pM.accent, pM.edge, new THREE.Vector3(0, 6.5, 0.5))
  ;[3.5, 6, 8.5, 11].forEach((h, i) => {
    addMesh(
      perf,
      new THREE.BoxGeometry(2.4, h, 1.8),
      i === 3 ? pM.accent : pM.main,
      pM.edge,
      new THREE.Vector3(-6 + i * 4, h / 2 - 6, 0),
    )
  })
  addMesh(perf, new THREE.BoxGeometry(17, 0.45, 2.2), pM.body, pM.edge, new THREE.Vector3(0, -6.2, 0))
  addMotif(perf, 8, -36, -46, 40, (t) => {
    perf.rotation.y = 0.14 + t * 0.03
    needle.rotation.z = Math.sin(t * 0.65) * 0.25
  })

  return motifs
}
