import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import WishlistModal from './WishlistModal';
import BetaGame from './BetaGame';

const easeSpring = { type: 'spring', stiffness: 260, damping: 22 } as const;

export default function Hero() {
  const [modalOpen, setModalOpen] = useState(false);
  const [betaOpen, setBetaOpen] = useState(false);

  return (
    <>
      <section className="hero">
        <div className="hero-dots" />

        <div className="hero-content">
          <motion.div
            className="hero-badge"
            initial={{ y: -24, rotate: -4, opacity: 0 }}
            animate={{ y: 0, rotate: -1.5, opacity: 1 }}
            transition={{ ...easeSpring, delay: 0.1 }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
            New from Pixelbyte Arcade
            <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          </motion.div>

          <h1 className="hero-title">
            <motion.span
              className="title-l1"
              initial={{ x: -70, skewX: -6, opacity: 0 }}
              animate={{ x: 0, skewX: 0, opacity: 1 }}
              transition={{ ...easeSpring, delay: 0.2 }}
            >
              BLOB
            </motion.span>
            <motion.span
              className="title-l2"
              initial={{ x: -70, skewX: -6, opacity: 0 }}
              animate={{ x: 0, skewX: 0, opacity: 1 }}
              transition={{ ...easeSpring, delay: 0.35 }}
            >
              BASH
            </motion.span>
          </h1>

          <motion.p
            className="hero-desc"
            initial={{ y: 24, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ ease: 'easeOut', duration: 0.6, delay: 0.52 }}
          >
            A 4-player co-op brawler where everything is made of goo and so are the rules.
            Punch, splat, and ooze through 16 chaotic zones before King Glob absorbs the universe.
          </motion.p>

          <motion.div
            className="hero-btns"
            initial={{ y: 24, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ ease: 'easeOut', duration: 0.6, delay: 0.65 }}
          >
            <button className="btn-p" onClick={() => setModalOpen(true)}>
              <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
              Wishlist Now
            </button>
            <a href="#features" className="btn-s">Watch Goo</a>
            <button className="btn-beta" onClick={() => setBetaOpen(true)}>
              <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
                <path d="M21 6H3c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-10 7H8v3H6v-3H3v-2h3V8h2v3h3v2zm4.5 2c-.83 0-1.5-.67-1.5-1.5S14.67 12 15.5 12s1.5.67 1.5 1.5S16.33 15 15.5 15zm3-3c-.83 0-1.5-.67-1.5-1.5S17.67 9 18.5 9s1.5.67 1.5 1.5S19.33 12 18.5 12z" />
              </svg>
              Try Beta
            </button>
          </motion.div>

          <motion.p
            className="hero-meta"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            Out Fall 2026 &nbsp;&middot;&nbsp; PC + Consoles &nbsp;&middot;&nbsp; Rated G for Goo
          </motion.p>
        </div>

        {/* Floating polaroid */}
        <motion.div
          className="hero-card"
          initial={{ y: 60, rotate: 8, opacity: 0 }}
          animate={{ y: 0, rotate: 4, opacity: 1 }}
          transition={{ ...easeSpring, delay: 0.4 }}
        >
          <div className="polaroid">
            <div className="polaroid-sticker">He Bites!</div>
            <div className="polaroid-art" style={{ background: '#3d9bff' }}>
              <BlobSvg color="#2ecc40" dark="#1aab2e" size={190} />
            </div>
            <div className="polaroid-label">GLOOB &middot; BLOB #001</div>
          </div>
        </motion.div>
      </section>

      <AnimatePresence>
        {modalOpen && <WishlistModal onClose={() => setModalOpen(false)} />}
      </AnimatePresence>

      <AnimatePresence>
        {betaOpen && <BetaGame onClose={() => setBetaOpen(false)} />}
      </AnimatePresence>
    </>
  );
}

export function BlobSvg({
  color, dark, size = 110,
}: {
  color: string; dark: string; size?: number;
}) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" style={{ imageRendering: 'pixelated' }}>
      <rect x="3" y="1" width="10" height="1" fill="#0a0a0a" />
      <rect x="2" y="2" width="12" height="1" fill={color} />
      <rect x="1" y="2" width="1" height="1" fill="#0a0a0a" />
      <rect x="13" y="2" width="1" height="1" fill="#0a0a0a" />
      <rect x="1" y="3" width="14" height="1" fill={color} />
      <rect x="0" y="3" width="1" height="1" fill="#0a0a0a" />
      <rect x="15" y="3" width="1" height="1" fill="#0a0a0a" />
      <rect x="0" y="4" width="1" height="6" fill="#0a0a0a" />
      <rect x="15" y="4" width="1" height="6" fill="#0a0a0a" />
      <rect x="1" y="4" width="14" height="1" fill={color} />
      <rect x="1" y="5" width="3" height="2" fill={color} />
      <rect x="4" y="5" width="2" height="2" fill="#0a0a0a" />
      <rect x="6" y="5" width="2" height="2" fill="#fff" />
      <rect x="8" y="5" width="2" height="2" fill="#0a0a0a" />
      <rect x="10" y="5" width="2" height="2" fill="#fff" />
      <rect x="12" y="5" width="2" height="2" fill="#0a0a0a" />
      <rect x="14" y="5" width="1" height="2" fill={color} />
      <rect x="7" y="6" width="1" height="1" fill="#0a0a0a" />
      <rect x="11" y="6" width="1" height="1" fill="#0a0a0a" />
      <rect x="1" y="7" width="14" height="1" fill={color} />
      <rect x="1" y="8" width="14" height="1" fill={color} />
      <rect x="4" y="8" width="1" height="1" fill="#0a0a0a" />
      <rect x="5" y="8" width="6" height="1" fill="#fff" />
      <rect x="11" y="8" width="1" height="1" fill="#0a0a0a" />
      <rect x="5" y="9" width="2" height="1" fill="#fff" />
      <rect x="7" y="9" width="2" height="1" fill="#0a0a0a" />
      <rect x="9" y="9" width="2" height="1" fill="#fff" />
      <rect x="1" y="9" width="3" height="1" fill={color} />
      <rect x="12" y="9" width="3" height="1" fill={color} />
      <rect x="1" y="10" width="14" height="1" fill={color} />
      <rect x="2" y="11" width="12" height="1" fill={color} />
      <rect x="1" y="11" width="1" height="1" fill="#0a0a0a" />
      <rect x="14" y="11" width="1" height="1" fill="#0a0a0a" />
      <rect x="2" y="12" width="5" height="1" fill={dark} />
      <rect x="9" y="12" width="5" height="1" fill={dark} />
      <rect x="1" y="12" width="1" height="1" fill="#0a0a0a" />
      <rect x="7" y="12" width="2" height="1" fill="#0a0a0a" />
      <rect x="14" y="12" width="1" height="1" fill="#0a0a0a" />
      <rect x="2" y="13" width="5" height="1" fill={dark} />
      <rect x="9" y="13" width="5" height="1" fill={dark} />
      <rect x="1" y="13" width="1" height="1" fill="#0a0a0a" />
      <rect x="7" y="13" width="2" height="1" fill="#0a0a0a" />
      <rect x="14" y="13" width="1" height="1" fill="#0a0a0a" />
      <rect x="2" y="14" width="5" height="1" fill="#0a0a0a" />
      <rect x="9" y="14" width="5" height="1" fill="#0a0a0a" />
    </svg>
  );
}
