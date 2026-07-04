export type TechItem = { label: string; color: string }

export const TECH_RING_A: TechItem[] = [
  { label: 'React', color: '#61dafb' },
  { label: 'Next.js', color: '#ffffff' },
  { label: 'TypeScript', color: '#4d88ff' },
  { label: 'Python', color: '#fcd34d' },
  { label: 'Django', color: '#6ee7b7' },
  { label: 'n8n', color: '#fb7185' },
  { label: 'Make', color: '#a78bfa' },
  { label: 'Node.js', color: '#6ee7b7' },
  { label: 'PostgreSQL', color: '#67e8f9' },
  { label: 'Docker', color: '#818cf8' },
]

export const TECH_RING_B: TechItem[] = [
  { label: 'agents IA', color: '#c4b5fd' },
  { label: 'Supabase', color: '#3ecf8e' },
  { label: 'Prisma', color: '#c4b5fd' },
  { label: 'Three.js', color: '#ffffff' },
  { label: 'Tailwind CSS', color: '#38bdf8' },
  { label: 'GSAP', color: '#6ee7b7' },
  { label: 'Dokploy', color: '#818cf8' },
  { label: 'VPS', color: '#67e8f9' },
  { label: 'Stripe', color: '#a78bfa' },
  { label: 'NestJS', color: '#fb7185' },
]

export const MARQUEE_ROW_1 = TECH_RING_A.map((t) => t.label)
export const MARQUEE_ROW_2 = TECH_RING_B.map((t) => t.label)

export const MARQUEE_ACCENTS: Record<string, string> = {
  'Next.js': 'mq-a-blue',
  React: 'mq-a-cyan',
  TypeScript: 'mq-a-blue',
  Python: 'mq-a-amber',
  Django: 'mq-a-emerald',
  n8n: 'mq-a-red',
  Make: 'mq-a-violet',
  'agents IA': 'mq-a-violet',
  Supabase: 'mq-a-emerald',
  Stripe: 'mq-a-violet',
  'Three.js': 'mq-a-blue',
  Dokploy: 'mq-a-violet',
  GSAP: 'mq-a-emerald',
  'Tailwind CSS': 'mq-a-cyan',
  Neon: 'mq-a-emerald',
  NestJS: 'mq-a-red',
  VPS: 'mq-a-cyan',
  Docker: 'mq-a-blue',
}
