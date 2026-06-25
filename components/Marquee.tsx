import { MARQUEE_ACCENTS, MARQUEE_ROW_1, MARQUEE_ROW_2 } from '@/lib/tech-stack'

function Track({ items, reverse }: { items: string[]; reverse?: boolean }) {
  const doubled = [...items, ...items]
  return (
    <div className={`mq-track ${reverse ? 'mq-track-r' : ''}`}>
      {doubled.map((item, i) => (
        <span key={`${item}-${i}`} className={`mq-pill ${MARQUEE_ACCENTS[item] ?? ''}`}>
          {item}
        </span>
      ))}
    </div>
  )
}

export default function Marquee() {
  return (
    <div id="marquee" className="marquee-wrap">
      <div className="mq-row">
        <Track items={MARQUEE_ROW_1} />
      </div>
      <div className="mq-row mq-row-dim">
        <Track items={MARQUEE_ROW_2} reverse />
      </div>
    </div>
  )
}
