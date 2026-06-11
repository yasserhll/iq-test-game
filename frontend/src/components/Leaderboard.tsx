import { useEffect, useRef } from 'react';
import { LEADERBOARD, CHARACTERS } from '../data/gameData';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { BlobSvg } from './Hero';
import type { LeaderboardEntry } from '../types';

const MEDALS = ['#FFD700', '#C0C0C0', '#CD7F32'];
const MEDAL_LABELS = ['GOLD', 'SILVER', 'BRONZE'];

function getBlobProps(blobId: number) {
  const c = CHARACTERS.find(ch => ch.id === blobId) ?? CHARACTERS[0];
  return { color: c.color, svgColor: c.svgColor, svgDark: c.svgDark };
}

function IQBar({ iq, max = 148 }: { iq: number; max?: number }) {
  const fillRef = useRef<HTMLDivElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = wrapRef.current;
    const fill = fillRef.current;
    if (!el || !fill) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        fill.style.width = `${(iq / max) * 100}%`;
        observer.unobserve(el);
      }
    }, { threshold: 0.4 });
    observer.observe(el);
    return () => observer.disconnect();
  }, [iq, max]);

  return (
    <div className="lb-iq-track" ref={wrapRef}>
      <div className="lb-iq-fill" ref={fillRef} />
    </div>
  );
}

function PodiumCard({ entry, position }: { entry: LeaderboardEntry; position: number }) {
  const ref = useScrollReveal<HTMLDivElement>({ threshold: 0.1 });
  const blob = getBlobProps(entry.blobId);
  const medal = MEDALS[position];
  const delay = [80, 0, 160][position];

  return (
    <div
      ref={ref}
      className={`lb-podium-card reveal lb-pos-${position + 1}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className="lb-medal" style={{ background: medal }}>
        <span className="lb-medal-num">#{entry.rank}</span>
        <span className="lb-medal-label">{MEDAL_LABELS[position]}</span>
      </div>
      <div className="lb-avatar" style={{ background: blob.color }}>
        <BlobSvg color={blob.svgColor} dark={blob.svgDark} size={64} />
      </div>
      <div className="lb-card-name">{entry.name}</div>
      <div className="lb-card-region">{entry.region}</div>
      <div className="lb-card-iq" style={{ color: medal }}>{entry.iq}</div>
      <div className="lb-card-iq-label">IQ SCORE</div>
      <div className="lb-card-time">
        <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor" style={{ opacity: 0.4 }}>
          <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm0 18c-4.4 0-8-3.6-8-8s3.6-8 8-8 8 3.6 8 8-3.6 8-8 8zm.5-13H11v6l5.2 3.2.8-1.3-4.5-2.7V7z"/>
        </svg>
        {entry.time}
      </div>
    </div>
  );
}

function TableRow({ entry }: { entry: LeaderboardEntry }) {
  const ref = useScrollReveal<HTMLDivElement>({ threshold: 0.1 });
  const blob = getBlobProps(entry.blobId);

  return (
    <div ref={ref} className="lb-row reveal">
      <span className="lb-row-rank">#{entry.rank}</span>
      <div className="lb-row-avatar" style={{ background: blob.color }}>
        <BlobSvg color={blob.svgColor} dark={blob.svgDark} size={28} />
      </div>
      <span className="lb-row-name">{entry.name}</span>
      <span className="lb-row-region">{entry.region}</span>
      <div className="lb-row-bar">
        <IQBar iq={entry.iq} />
      </div>
      <span className="lb-row-iq">{entry.iq}</span>
      <span className="lb-row-time">{entry.time}</span>
    </div>
  );
}

const PODIUM_ORDER = [1, 0, 2]; // silver left, gold center, bronze right

export default function Leaderboard() {
  const titleRef = useScrollReveal<HTMLHeadingElement>();
  const tagRef = useScrollReveal<HTMLParagraphElement>();

  return (
    <section className="leaderboard" id="leaderboard">
      <div className="lb-inner">
        <div className="lb-header">
          <p className="sec-tag lb-tag reveal" ref={tagRef}>
            Live Rankings
          </p>
          <h2 className="sec-h lb-h reveal" ref={titleRef}>
            GLOBAL <span>IQ</span> LEADERBOARD
          </h2>
          <p className="lb-subtitle">
            4,821 players ranked worldwide — can you crack the top 10?
          </p>
        </div>

        <div className="lb-podium">
          {PODIUM_ORDER.map(pos => (
            <PodiumCard key={pos} entry={LEADERBOARD[pos]} position={pos} />
          ))}
        </div>

        <div className="lb-table">
          <div className="lb-table-head">
            <span>Rank</span>
            <span></span>
            <span>Player</span>
            <span>Region</span>
            <span className="lb-th-bar">IQ Score</span>
            <span></span>
            <span>Time</span>
          </div>
          {LEADERBOARD.slice(3).map(entry => (
            <TableRow key={entry.rank} entry={entry} />
          ))}
          <div className="lb-row lb-row-you">
            <span className="lb-row-rank lb-you-rank">?</span>
            <div className="lb-row-avatar lb-you-avatar">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17.93V18c0-.55-.45-1-1-1s-1 .45-1 1v1.93C7.06 19.48 4.52 16.94 4.07 13H6c.55 0 1-.45 1-1s-.45-1-1-1H4.07C4.52 7.06 7.06 4.52 11 4.07V6c0 .55.45 1 1 1s1-.45 1-1V4.07C16.94 4.52 19.48 7.06 19.93 11H18c-.55 0-1 .45-1 1s.45 1 1 1h1.93c-.45 3.94-2.99 6.48-6.93 6.93z"/>
              </svg>
            </div>
            <span className="lb-row-name lb-you-name">YOUR NAME</span>
            <span className="lb-row-region">??</span>
            <div className="lb-row-bar">
              <div className="lb-iq-track lb-you-track">
                <div className="lb-you-bar-pulse" />
              </div>
            </div>
            <span className="lb-row-iq lb-you-iq">???</span>
            <span className="lb-row-time">--:--</span>
          </div>
        </div>

        <div className="lb-cta-row">
          <p className="lb-cta-text">
            Top score is IQ 148 — what's yours?
          </p>
          <button
            className="lb-cta-btn"
            onClick={() => document.getElementById('hero-try-beta')?.click()}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z"/>
            </svg>
            Claim Your Spot
          </button>
        </div>
      </div>
    </section>
  );
}
