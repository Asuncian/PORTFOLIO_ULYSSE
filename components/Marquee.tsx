const ROW_1 = ['Next.js', 'React', 'TypeScript', 'Vite', 'NestJS', 'Node.js', 'Hono', 'Prisma', 'PostgreSQL', 'Neon']
const ROW_2 = ['Supabase', 'Stripe', 'Resend', 'Twilio', 'Tailwind CSS', 'GSAP', 'Lenis', 'shadcn/ui', 'TanStack Query', 'Leaflet']

const ACCENTS: Record<string, string> = {
  'Next.js': 'mq-a-blue', 'React': 'mq-a-cyan', 'TypeScript': 'mq-a-blue',
  'Vite': 'mq-a-violet', 'Supabase': 'mq-a-emerald', 'Stripe': 'mq-a-violet',
  'GSAP': 'mq-a-emerald', 'Tailwind CSS': 'mq-a-cyan', 'Neon': 'mq-a-emerald',
  'NestJS': 'mq-a-red', 'Hono': 'mq-a-amber',
}

function Track({ items, reverse }: { items: string[]; reverse?: boolean }) {
  const doubled = [...items, ...items]
  return (
    <div className={`mq-track ${reverse ? 'mq-track-r' : ''}`}>
      {doubled.map((item, i) => (
        <span key={i} className={`mq-pill ${ACCENTS[item] ?? ''}`}>
          {item}
        </span>
      ))}
    </div>
  )
}

export default function Marquee() {
  return (
    <section id="marquee">
      <div className="mq-row">
        <Track items={ROW_1} />
      </div>
      <div className="mq-row mq-row-dim">
        <Track items={ROW_2} reverse />
      </div>
    </section>
  )
}
