import { FEATURES } from '../data/gameData';
import { useScrollReveal } from '../hooks/useScrollReveal';

const icons: Record<string, React.ReactNode> = {
  users: (
    <svg width="38" height="38" viewBox="0 0 24 24" fill="currentColor">
      <path d="M16 11c1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3 1.34 3 3 3zm-8 0c1.66 0 3-1.34 3-3S9.66 5 8 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
    </svg>
  ),
  map: (
    <svg width="38" height="38" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.5 3l-.16.03L15 5.1 9 3 3.36 4.9c-.21.07-.36.25-.36.48V20.5c0 .28.22.5.5.5l.16-.03L9 18.9l6 2.1 5.64-1.9c.21-.07.36-.25.36-.48V3.5c0-.28-.22-.5-.5-.5zM15 19l-6-2.11V5l6 2.11V19z" />
    </svg>
  ),
  zap: (
    <svg width="38" height="38" viewBox="0 0 24 24" fill="currentColor">
      <path d="M7 2v11h3v9l7-12h-4l4-8z" />
    </svg>
  ),
};

function FeatureCard({ feature, index }: { feature: typeof FEATURES[0]; index: number }) {
  const ref = useScrollReveal<HTMLDivElement>({ threshold: 0.15 });

  return (
    <div
      ref={ref}
      className="feat-card reveal"
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      <span className="feat-n">{feature.number}</span>
      <span className="feat-icon">{icons[feature.icon]}</span>
      <h3 className="feat-title">{feature.title}</h3>
      <p className="feat-text">{feature.description}</p>
    </div>
  );
}

export default function Features() {
  const tagRef = useScrollReveal<HTMLParagraphElement>();
  const titleRef = useScrollReveal<HTMLHeadingElement>();

  return (
    <section className="features" id="features">
      <p className="sec-tag reveal" ref={tagRef}>Game Features</p>
      <h2 className="sec-h reveal" ref={titleRef}>
        WHY IT <span>SLAPS</span>
      </h2>
      <div className="feat-grid">
        {FEATURES.map((f, i) => (
          <FeatureCard key={f.id} feature={f} index={i} />
        ))}
      </div>
    </section>
  );
}
