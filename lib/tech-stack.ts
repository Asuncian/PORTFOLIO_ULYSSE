export type TechItem = { label: string; color: string }

export const TECH_RING_A: TechItem[] = [
  { label: 'Next.js', color: '#ffffff' },
  { label: 'React', color: '#61dafb' },
  { label: 'TypeScript', color: '#4d88ff' },
  { label: 'Vite', color: '#a78bfa' },
  { label: 'NestJS', color: '#fb7185' },
  { label: 'Node.js', color: '#6ee7b7' },
  { label: 'Hono', color: '#fcd34d' },
  { label: 'Prisma', color: '#c4b5fd' },
  { label: 'PostgreSQL', color: '#67e8f9' },
  { label: 'Neon', color: '#6ee7b7' },
]

export const TECH_RING_B: TechItem[] = [
  { label: 'Supabase', color: '#3ecf8e' },
  { label: 'Stripe', color: '#a78bfa' },
  { label: 'Three.js', color: '#ffffff' },
  { label: 'Dokploy', color: '#818cf8' },
  { label: 'Tailwind CSS', color: '#38bdf8' },
  { label: 'GSAP', color: '#6ee7b7' },
  { label: 'Lenis', color: '#93c5fd' },
  { label: 'VPS', color: '#67e8f9' },
  { label: 'Infomaniak', color: '#0098ff' },
  { label: 'Leaflet', color: '#86efac' },
]

export const MARQUEE_ROW_1 = TECH_RING_A.map((t) => t.label)
export const MARQUEE_ROW_2 = TECH_RING_B.map((t) => t.label)

export const MARQUEE_ACCENTS: Record<string, string> = {
  'Next.js': 'mq-a-blue',
  React: 'mq-a-cyan',
  TypeScript: 'mq-a-blue',
  Vite: 'mq-a-violet',
  Supabase: 'mq-a-emerald',
  Stripe: 'mq-a-violet',
  'Three.js': 'mq-a-blue',
  Dokploy: 'mq-a-violet',
  GSAP: 'mq-a-emerald',
  'Tailwind CSS': 'mq-a-cyan',
  Neon: 'mq-a-emerald',
  NestJS: 'mq-a-red',
  Hono: 'mq-a-amber',
  VPS: 'mq-a-cyan',
  Infomaniak: 'mq-a-blue',
}
