import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { BlobSvg } from './Hero';
import WishlistModal from './WishlistModal';

const FEATURES = [
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"/>
      </svg>
    ),
    title: 'Real-Time Race',
    desc: 'Race a live opponent through the same maze simultaneously. Same seed, same start — only skill decides.',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 4l5 2.18V11c0 3.5-2.33 6.79-5 7.93-2.67-1.14-5-4.43-5-7.93V7.18L12 5z"/>
      </svg>
    ),
    title: 'Global ELO Ranking',
    desc: 'Every match updates your ELO. Climb from Bronze Brain to Grand Master — each win proves your IQ edge.',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 3c1.93 0 3.5 1.57 3.5 3.5S13.93 13 12 13s-3.5-1.57-3.5-3.5S10.07 6 12 6zm7 13H5v-.23c0-.62.28-1.2.76-1.58C7.47 15.82 9.64 15 12 15s4.53.82 6.24 2.19c.48.38.76.97.76 1.58V19z"/>
      </svg>
    ),
    title: 'IQ Tournaments',
    desc: 'Weekly elimination brackets. 64 players enter — 1 IQ champion survives. Cross-region finals every month.',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
      </svg>
    ),
    title: 'Daily IQ Challenge',
    desc: 'Fresh maze seed every 24 hours. Every player worldwide solves the same maze — one daily leaderboard, one winner.',
  },
];

export default function Multiplayer() {
  const [modalOpen, setModalOpen] = useState(false);
  const titleRef = useScrollReveal<HTMLHeadingElement>();
  const tagRef = useScrollReveal<HTMLParagraphElement>();

  return (
    <>
      <section className="multiplayer" id="multiplayer">
        <div className="mp-inner">
          <div className="mp-header">
            <p className="sec-tag mp-tag reveal" ref={tagRef}>Online Multiplayer</p>
            <h2 className="sec-h mp-h reveal" ref={titleRef}>
              RACE THE <span>WORLD</span>
            </h2>
            <p className="mp-subtitle">
              Your IQ score means nothing if you can't prove it live. Coming Q4 2026.
            </p>
          </div>

          <div className="mp-arena">
            <div className="mp-player mp-p1">
              <div className="mp-player-card">
                <div className="mp-blob-wrap" style={{ background: '#3d9bff' }}>
                  <BlobSvg color="#2ecc40" dark="#1aab2e" size={80} />
                </div>
                <div className="mp-player-info">
                  <span className="mp-player-tag" style={{ background: '#3d9bff' }}>YOU</span>
                  <span className="mp-player-name">GLOOB</span>
                  <span className="mp-player-elo">IQ ???</span>
                </div>
              </div>
              <div className="mp-controls-hint">
                <kbd>W</kbd><kbd>A</kbd><kbd>S</kbd><kbd>D</kbd>
              </div>
            </div>

            <div className="mp-vs-col">
              <div className="mp-vs-badge">VS</div>
              <div className="mp-vs-line" />
              <div className="mp-vs-globe">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
                </svg>
                GLOBAL
              </div>
            </div>

            <div className="mp-player mp-p2">
              <div className="mp-player-card mp-card-r">
                <div className="mp-blob-wrap" style={{ background: '#ff5555' }}>
                  <BlobSvg color="#ff2d55" dark="#b01f3b" size={80} />
                </div>
                <div className="mp-player-info">
                  <span className="mp-player-tag" style={{ background: '#ff5555' }}>OPPONENT</span>
                  <span className="mp-player-name">SPLATTY</span>
                  <span className="mp-player-elo">IQ 137</span>
                </div>
              </div>
              <div className="mp-controls-hint">
                <kbd>↑</kbd><kbd>←</kbd><kbd>↓</kbd><kbd>→</kbd>
              </div>
            </div>
          </div>

          <div className="mp-features-grid">
            {FEATURES.map((f, i) => (
              <div key={i} className="mp-feat">
                <div className="mp-feat-icon">{f.icon}</div>
                <div className="mp-feat-title">{f.title}</div>
                <div className="mp-feat-desc">{f.desc}</div>
              </div>
            ))}
          </div>

          <div className="mp-cta-row">
            <div className="mp-coming-badge">Q4 2026</div>
            <p className="mp-cta-text">
              Wishlist now — get notified the day online multiplayer drops.
            </p>
            <button className="mp-cta-btn" onClick={() => setModalOpen(true)}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
              Wishlist Now
            </button>
          </div>
        </div>
      </section>

      <AnimatePresence>
        {modalOpen && <WishlistModal onClose={() => setModalOpen(false)} />}
      </AnimatePresence>
    </>
  );
}
