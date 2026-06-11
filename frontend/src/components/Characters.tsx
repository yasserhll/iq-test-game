import { useEffect, useRef } from 'react';
import { CHARACTERS } from '../data/gameData';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { BlobSvg } from './Hero';
import type { Character } from '../types';

function StatBar({ label, value }: { label: string; value: number }) {
  const fillRef = useRef<HTMLDivElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = wrapRef.current;
    const fill = fillRef.current;
    if (!el || !fill) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          fill.style.width = `${value}%`;
          observer.unobserve(el);
        }
      },
      { threshold: 0.4 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [value]);

  return (
    <div className="s-row" ref={wrapRef}>
      <span className="s-label">{label}</span>
      <div className="s-track">
        <div className="s-fill" ref={fillRef} />
      </div>
    </div>
  );
}

function CharCard({ char, index }: { char: Character; index: number }) {
  const ref = useScrollReveal<HTMLDivElement>({ threshold: 0.15 });

  return (
    <div
      ref={ref}
      className="char-card reveal"
      style={{ transitionDelay: `${index * 80}ms` }}
    >
      <div className="char-portrait" style={{ background: char.color }}>
        <BlobSvg color={char.svgColor} dark={char.svgDark} size={110} />
      </div>
      <div className="char-body">
        <div className="char-name">{char.name}</div>
        <div className="char-role">
          {char.role} &middot; {char.tag}
        </div>
        <div className="stats">
          <StatBar label="STR" value={char.stats.str} />
          <StatBar label="SPD" value={char.stats.spd} />
          <StatBar label="GOO" value={char.stats.goo} />
        </div>
      </div>
    </div>
  );
}

export default function Characters() {
  const tagRef = useScrollReveal<HTMLParagraphElement>();
  const titleRef = useScrollReveal<HTMLHeadingElement>();

  return (
    <section className="chars" id="characters">
      <div className="chars-header">
        <p className="sec-tag reveal" ref={tagRef}>Meet the Squad</p>
        <h2 className="sec-h reveal" ref={titleRef}>
          THE <span>BLOBS</span>
        </h2>
      </div>
      <div className="chars-grid">
        {CHARACTERS.map((c, i) => (
          <CharCard key={c.id} char={c} index={i} />
        ))}
      </div>
    </section>
  );
}
