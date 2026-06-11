import { ROADMAP } from '../data/gameData';
import { useScrollReveal } from '../hooks/useScrollReveal';

const CheckIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24">
    <path fill="#0a0a0a" d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
  </svg>
);

const CircleIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="5" fill="rgba(255,229,0,.35)" />
  </svg>
);

function RoadmapItem({ item, index }: { item: typeof ROADMAP[0]; index: number }) {
  const ref = useScrollReveal<HTMLDivElement>({ threshold: 0.15 });

  return (
    <div
      ref={ref}
      className={`rm-item reveal ${item.done ? 'done' : ''}`}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      <div className="rm-dot">
        {item.done ? <CheckIcon /> : <CircleIcon />}
      </div>
      <div className="rm-q">{item.quarter}</div>
      <div className="rm-title">{item.title}</div>
      <div className="rm-detail">{item.detail}</div>
    </div>
  );
}

export default function Roadmap() {
  const tagRef = useScrollReveal<HTMLParagraphElement>();
  const titleRef = useScrollReveal<HTMLHeadingElement>();

  return (
    <section className="roadmap" id="roadmap">
      <p className="sec-tag reveal" ref={tagRef}>Development</p>
      <h2 className="sec-h reveal" ref={titleRef}>
        THE <span>ROADMAP</span>
      </h2>
      <div className="rm-grid">
        {ROADMAP.map((item, i) => (
          <RoadmapItem key={item.id} item={item} index={i} />
        ))}
      </div>
    </section>
  );
}
