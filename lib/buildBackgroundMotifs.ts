import * as THREE from 'three'

export type MotifEntry = {
  g: THREE.Group
  base: THREE.Vector3
  parallax: number
  tick: (t: number) => void
}

type MP = { edge: number }

const PALETTES = {
  storage:  { edge: 0x7dd3fc },
  security: { edge: 0xbae6fd },
  web:      { edge: 0x93c5fd },
  auto:     { edge: 0xa5b4fc },
  perf:     { edge: 0xf1f5f9 },
} satisfies Record<string, MP>

const WIRE_OPACITY = 0.14

export function buildBackgroundMotifs(
  scene: THREE.Scene,
  geos: THREE.BufferGeometry[],
  mats: THREE.Material[],
): MotifEntry[] {
  const motifs: MotifEntry[] = []

  const createEdgeMat = (p: MP) => {
    const edge = new THREE.LineBasicMaterial({
      color: p.edge,
      transparent: true,
      opacity: WIRE_OPACITY,
    })
    mats.push(edge)
    return edge
  }

  const addWire = (
    g: THREE.Group,
    geo: THREE.BufferGeometry,
    edge: THREE.LineBasicMaterial,
    pos = new THREE.Vector3(),
    rot = new THREE.Euler(),
  ) => {
    const wire = new THREE.LineSegments(new THREE.EdgesGeometry(geo), edge)
    wire.position.copy(pos)
    wire.rotation.copy(rot)
    g.add(wire)
    geos.push(geo)
    return wire
  }

  const addLine = (g: THREE.Group, pts: THREE.Vector3[], edge: THREE.LineBasicMaterial) => {
    const geo = new THREE.BufferGeometry().setFromPoints(pts)
    geos.push(geo)
    g.add(new THREE.Line(geo, edge))
  }

  /** Contour lisse (face avant + arrière) pour silhouettes lisibles */
  const addShapeSilhouette = (
    g: THREE.Group,
    shape: THREE.Shape,
    depth: number,
    edge: THREE.LineBasicMaterial,
    pos = new THREE.Vector3(),
    rot = new THREE.Euler(),
    samples = 80,
  ) => {
    const pts = shape.getPoints(samples)
    const shell = new THREE.Group()
    shell.position.copy(pos)
    shell.rotation.copy(rot)
    const zFront = depth * 0.5
    const zBack = -depth * 0.5
    const ring = (z: number) => {
      const ringPts = pts.map(p => new THREE.Vector3(p.x, p.y, z))
      ringPts.push(ringPts[0].clone())
      addLine(shell, ringPts, edge)
    }
    ring(zFront)
    ring(zBack)
    for (let i = 0; i < pts.length; i += 6) {
      addLine(shell, [
        new THREE.Vector3(pts[i].x, pts[i].y, zFront),
        new THREE.Vector3(pts[i].x, pts[i].y, zBack),
      ], edge)
    }
    g.add(shell)
  }

  const addFlatOutline = (
    g: THREE.Group,
    shape: THREE.Shape,
    edge: THREE.LineBasicMaterial,
    pos = new THREE.Vector3(),
    rot = new THREE.Euler(),
    samples = 64,
  ) => {
    const pts = shape.getPoints(samples)
    const loop = pts.map(p => new THREE.Vector3(p.x, p.y, 0))
    loop.push(loop[0].clone())
    const shell = new THREE.Group()
    shell.position.copy(pos)
    shell.rotation.copy(rot)
    addLine(shell, loop, edge)
    g.add(shell)
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

  const buildGear = (
    g: THREE.Group,
    r: number,
    teeth: number,
    thick: number,
    edge: THREE.LineBasicMaterial,
    pos: THREE.Vector3,
  ) => {
    const gear = new THREE.Group()
    gear.position.copy(pos)
    addWire(gear, new THREE.CylinderGeometry(r, r, thick, teeth, 1), edge)
    for (let i = 0; i < teeth; i++) {
      const a = (i / teeth) * Math.PI * 2
      addWire(
        gear, new THREE.BoxGeometry(1, thick * 1.15, 1.2), edge,
        new THREE.Vector3(Math.cos(a) * (r + 0.5), Math.sin(a) * (r + 0.5), 0),
        new THREE.Euler(0, 0, -a),
      )
    }
    g.add(gear)
    return gear
  }

  // Serveur — 3 baies, LEDs
  const storage = new THREE.Group()
  const stE = createEdgeMat(PALETTES.storage)
  addWire(storage, new THREE.BoxGeometry(14, 16, 6), stE)
  ;[5, 0, -5].forEach((y) => {
    addWire(storage, new THREE.BoxGeometry(12.5, 3.8, 5.2), stE, new THREE.Vector3(0, y, 0.3))
    addWire(storage, new THREE.SphereGeometry(0.32, 8, 8), stE, new THREE.Vector3(5.5, y, 2.85))
  })
  addMotif(storage, -70, 20, -55, 62, (t) => {
    storage.rotation.y = Math.sin(t * 0.035) * 0.06
  })

  // Sécurité — bouclier affiné + cadenas
  const security = new THREE.Group()
  const secE = createEdgeMat(PALETTES.security)
  const shieldShape = new THREE.Shape()
  shieldShape.moveTo(0, 11.5)
  shieldShape.bezierCurveTo(5.5, 11.2, 10.5, 8.2, 11.2, 3.5)
  shieldShape.bezierCurveTo(11.6, 0.8, 11.4, -1.8, 11, -4.2)
  shieldShape.bezierCurveTo(10.2, -8.5, 5.8, -11.2, 0, -12)
  shieldShape.bezierCurveTo(-5.8, -11.2, -10.2, -8.5, -11, -4.2)
  shieldShape.bezierCurveTo(-11.4, -1.8, -11.6, 0.8, -11.2, 3.5)
  shieldShape.bezierCurveTo(-10.5, 8.2, -5.5, 11.2, 0, 11.5)
  addShapeSilhouette(security, shieldShape, 2.2, secE, new THREE.Vector3(0, 0.5, -1))
  addWire(security, new THREE.TorusGeometry(2.5, 0.26, 12, 36, Math.PI), secE, new THREE.Vector3(0, 2.8, 1.6))
  addWire(security, new THREE.BoxGeometry(5, 5.2, 1.5), secE, new THREE.Vector3(0, -0.5, 1.5))
  addWire(
    security, new THREE.CylinderGeometry(0.45, 0.45, 0.3, 12), secE,
    new THREE.Vector3(0, -1.1, 2.2), new THREE.Euler(Math.PI / 2, 0, 0),
  )
  addMotif(security, 74, 26, -58, 58, (t) => {
    security.rotation.y = -0.1 + Math.sin(t * 0.03) * 0.05
  })

  // Web — navigateur + globe
  const web = new THREE.Group()
  const wE = createEdgeMat(PALETTES.web)
  addWire(web, new THREE.BoxGeometry(22, 15, 2), wE)
  addWire(web, new THREE.BoxGeometry(20, 9.5, 0.3), wE, new THREE.Vector3(0, -1.2, 1.05))
  addWire(web, new THREE.BoxGeometry(13, 1.6, 0.28), wE, new THREE.Vector3(0, 5.8, 1.1))
  ;[-8, -5, -2].forEach((x) => {
    addWire(web, new THREE.SphereGeometry(0.35, 8, 8), wE, new THREE.Vector3(x, 5.8, 1.2))
  })
  ;[[10, 2.5], [8, -0.5], [6, -3]].forEach(([w, y]) => {
    addWire(web, new THREE.BoxGeometry(w, 0.35, 0.18), wE, new THREE.Vector3(0, y, 1.15))
  })
  addWire(web, new THREE.SphereGeometry(3.8, 18, 18), wE, new THREE.Vector3(12, -0.5, 2.2))
  addWire(web, new THREE.TorusGeometry(3.8, 0.2, 8, 28), wE, new THREE.Vector3(12, -0.5, 2.2), new THREE.Euler(1.2, 0.3, 0.2))
  addMotif(web, 60, -4, -24, 48, (t) => {
    web.rotation.y = 0.12 + Math.sin(t * 0.028) * 0.04
  })

  // Automatisation — email → engrenage → base
  const auto = new THREE.Group()
  const aE = createEdgeMat(PALETTES.auto)
  const n1 = new THREE.Vector3(-10, 0, 0)
  const n2 = new THREE.Vector3(0, 0, 0)
  const n3 = new THREE.Vector3(10, 0, 0)
  addWire(auto, new THREE.BoxGeometry(6, 4.2, 1.5), aE, n1)
  addWire(auto, new THREE.ConeGeometry(2.8, 2, 4), aE, new THREE.Vector3(-10, 3, 0.75), new THREE.Euler(0, 0, Math.PI))
  addWire(auto, new THREE.BoxGeometry(5, 3.2, 1.5), aE, n2)
  addWire(auto, new THREE.CylinderGeometry(2.8, 2.8, 5, 18), aE, new THREE.Vector3(n3.x, 0.4, 0))
  addWire(auto, new THREE.CylinderGeometry(3.1, 3.1, 0.7, 18), aE, new THREE.Vector3(n3.x, 2.9, 0))
  const gear = buildGear(auto, 1.2, 10, 0.5, aE, n2)
  gear.rotation.x = Math.PI / 2
  addLine(auto, [new THREE.Vector3(-7, 0, 0.85), new THREE.Vector3(-2.5, 0, 0.85)], aE)
  addLine(auto, [new THREE.Vector3(2.5, 0, 0.85), new THREE.Vector3(7, 0, 0.85)], aE)
  addWire(auto, new THREE.ConeGeometry(0.75, 1.2, 3), aE, new THREE.Vector3(-4.2, 0, 0.85), new THREE.Euler(0, 0, -Math.PI / 2))
  addWire(auto, new THREE.ConeGeometry(0.75, 1.2, 3), aE, new THREE.Vector3(4.2, 0, 0.85), new THREE.Euler(0, 0, -Math.PI / 2))
  addMotif(auto, -64, -12, -32, 52, (t) => {
    gear.rotation.z = t * 0.1
  })

  // Performance — éclair (contour plat, blanc)
  const perf = new THREE.Group()
  const pE = createEdgeMat(PALETTES.perf)
  const bolt = new THREE.Shape()
  bolt.moveTo(1.2, 12)
  bolt.lineTo(-1.6, 1.5)
  bolt.lineTo(0.8, 1.5)
  bolt.lineTo(-1.2, -12)
  bolt.lineTo(3.2, 0)
  bolt.lineTo(0.4, 0)
  bolt.lineTo(1.2, 12)
  addFlatOutline(perf, bolt, pE)
  addMotif(perf, 8, -36, -46, 40, (t) => {
    perf.rotation.y = 0.08 + Math.sin(t * 0.025) * 0.04
    perf.rotation.z = Math.sin(t * 0.04) * 0.03
  })

  return motifs
}
