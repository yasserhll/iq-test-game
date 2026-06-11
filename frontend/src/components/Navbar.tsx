import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import WishlistModal from './WishlistModal';
import BetaGame from './BetaGame';

function IQGameLogo({ size = 44 }: { size?: number }) {
  const P = '#c44dff'; // violet cerveau
  const D = '#7b00c9'; // ombre
  const K = '#0a0a0a'; // contour
  const W = '#ffffff'; // reflet
  const Y = '#FFE500'; // jaune sparks
  const R = '#ff2d55'; // rouge accents
  return (
    <svg width={size} height={size} viewBox="0 0 14 14" style={{ imageRendering: 'pixelated' }}>
      {/* lobe gauche - contour */}
      <rect x="1" y="1" width="4" height="1" fill={K}/>
      <rect x="0" y="2" width="1" height="3" fill={K}/>
      <rect x="1" y="5" width="3" height="1" fill={K}/>
      <rect x="4" y="4" width="1" height="1" fill={K}/>
      {/* lobe gauche - remplissage */}
      <rect x="1" y="2" width="4" height="3" fill={P}/>
      <rect x="1" y="2" width="1" height="1" fill={W}/>
      <rect x="3" y="3" width="1" height="1" fill={D}/>
      {/* lobe droit - contour */}
      <rect x="9" y="1" width="4" height="1" fill={K}/>
      <rect x="13" y="2" width="1" height="3" fill={K}/>
      <rect x="10" y="5" width="3" height="1" fill={K}/>
      <rect x="9" y="4" width="1" height="1" fill={K}/>
      {/* lobe droit - remplissage */}
      <rect x="9" y="2" width="4" height="3" fill={P}/>
      <rect x="12" y="2" width="1" height="1" fill={W}/>
      <rect x="10" y="3" width="1" height="1" fill={D}/>
      {/* sillon central (ligne de séparation des hémisphères) */}
      <rect x="5" y="1" width="4" height="1" fill={K}/>
      <rect x="6" y="2" width="2" height="3" fill={K}/>
      <rect x="5" y="5" width="4" height="1" fill={K}/>
      {/* corps bas du cerveau */}
      <rect x="0" y="6" width="14" height="1" fill={K}/>
      <rect x="0" y="7" width="1" height="4" fill={K}/>
      <rect x="13" y="7" width="1" height="4" fill={K}/>
      <rect x="1" y="7" width="12" height="4" fill={P}/>
      <rect x="0" y="11" width="14" height="1" fill={K}/>
      {/* ride centrale continue */}
      <rect x="6" y="7" width="2" height="4" fill={D}/>
      {/* rides latérales */}
      <rect x="3" y="8" width="1" height="2" fill={D}/>
      <rect x="10" y="8" width="1" height="2" fill={D}/>
      {/* sparks IQ jaunes - neurones actifs */}
      <rect x="2" y="7" width="1" height="1" fill={Y}/>
      <rect x="4" y="9" width="1" height="1" fill={Y}/>
      <rect x="9" y="7" width="1" height="1" fill={Y}/>
      <rect x="11" y="9" width="1" height="1" fill={Y}/>
      {/* point rouge - signal jeu (bouton A) */}
      <rect x="2" y="10" width="1" height="1" fill={R}/>
      <rect x="11" y="7" width="1" height="1" fill={R}/>
      {/* bas arrondi */}
      <rect x="1" y="12" width="1" height="1" fill={K}/>
      <rect x="12" y="12" width="1" height="1" fill={K}/>
      <rect x="2" y="12" width="10" height="1" fill={D}/>
    </svg>
  );
}

const links = [
  { href: '#features', label: 'Features' },
  { href: '#characters', label: 'Characters' },
  { href: '#press', label: 'Press' },
  { href: '#roadmap', label: 'Roadmap' },
];

export default function Navbar() {
  const [modalOpen, setModalOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [betaOpen, setBetaOpen] = useState(false);
  const [mobileWarn, setMobileWarn] = useState(false);

  const close = () => setMenuOpen(false);

  const handleBeta = (andClose = false) => {
    if (andClose) close();
    if (window.innerWidth < 1024 || 'ontouchstart' in window) {
      setMobileWarn(true);
    } else {
      setBetaOpen(true);
    }
  };

  return (
    <>
      <nav className="nav">
        <a className="nav-logo" href="#">
          <div className="nav-logo-icon">
            <IQGameLogo size={36} />
          </div>
          <div className="nav-logo-text">
            <span className="nav-logo-title">BLOB BASH</span>
            <span className="nav-logo-sub">IQ MAZE CHALLENGE</span>
          </div>
        </a>

        <ul className="nav-links">
          {links.map(l => (
            <li key={l.href}>
              <a href={l.href}>{l.label}</a>
            </li>
          ))}
        </ul>

        <div className="nav-right">
          <button className="nav-beta" onClick={() => handleBeta()}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M21 6H3c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-10 7H8v3H6v-3H3v-2h3V8h2v3h3v2zm4.5 2c-.83 0-1.5-.67-1.5-1.5S14.67 12 15.5 12s1.5.67 1.5 1.5S16.33 15 15.5 15zm3-3c-.83 0-1.5-.67-1.5-1.5S17.67 9 18.5 9s1.5.67 1.5 1.5S19.33 12 18.5 12z" />
            </svg>
            Try Beta
          </button>

          <button className="nav-cta nav-wishlist-desktop" onClick={() => setModalOpen(true)}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
            Wishlist
          </button>

          <button
            className="nav-hamburger"
            onClick={() => setMenuOpen(v => !v)}
            aria-label="Menu"
          >
            <span className={`ham-line${menuOpen ? ' open' : ''}`} />
            <span className={`ham-line${menuOpen ? ' open' : ''}`} />
            <span className={`ham-line${menuOpen ? ' open' : ''}`} />
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="nav-drawer"
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.2 }}
          >
            {links.map(l => (
              <a key={l.href} href={l.href} className="drawer-link" onClick={close}>
                {l.label}
              </a>
            ))}
            <div className="drawer-actions">
              <button className="drawer-beta" onClick={() => handleBeta(true)}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M21 6H3c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-10 7H8v3H6v-3H3v-2h3V8h2v3h3v2zm4.5 2c-.83 0-1.5-.67-1.5-1.5S14.67 12 15.5 12s1.5.67 1.5 1.5S16.33 15 15.5 15zm3-3c-.83 0-1.5-.67-1.5-1.5S17.67 9 18.5 9s1.5.67 1.5 1.5S19.33 12 18.5 12z" />
                </svg>
                Try Beta
              </button>
              <button className="drawer-cta" onClick={() => { setModalOpen(true); close(); }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
                Wishlist
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {mobileWarn && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setMobileWarn(false)}
          >
            <motion.div
              className="modal mobile-warn-modal"
              initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9 }}
              transition={{ type: 'spring', stiffness: 300, damping: 28 }}
              onClick={e => e.stopPropagation()}
            >
              <button className="modal-close" onClick={() => setMobileWarn(false)}>&#x2715;</button>
              <div className="mobile-warn-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20 18c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2H0v2h24v-2h-4zM4 6h16v10H4V6z"/>
                </svg>
              </div>
              <h2>PC Required</h2>
              <p>The IQ Maze Challenge requires a physical keyboard to play.<br />Open this page on a desktop or laptop to take the test.</p>
              <button className="modal-submit" style={{ marginTop: 16 }} onClick={() => setMobileWarn(false)}>
                Got it
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {modalOpen && <WishlistModal onClose={() => setModalOpen(false)} />}
      </AnimatePresence>

      <AnimatePresence>
        {betaOpen && <BetaGame onClose={() => setBetaOpen(false)} />}
      </AnimatePresence>
    </>
  );
}
