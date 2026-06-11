import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import WishlistModal from './WishlistModal';

const links = [
  { href: '#features', label: 'Features' },
  { href: '#characters', label: 'Characters' },
  { href: '#press', label: 'Press' },
  { href: '#roadmap', label: 'Roadmap' },
];

export default function Navbar() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <nav className="nav">
        <div className="nav-logo">
          <a className="logo-a" href="#">PIXELBYTE</a>
          <a className="logo-b" href="#">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z" />
            </svg>
            ARCADE
          </a>
        </div>

        <ul className="nav-links">
          {links.map(l => (
            <li key={l.href}>
              <a href={l.href}>{l.label}</a>
            </li>
          ))}
        </ul>

        <button className="nav-cta" onClick={() => setModalOpen(true)}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
          Wishlist
        </button>
      </nav>

      <AnimatePresence>
        {modalOpen && <WishlistModal onClose={() => setModalOpen(false)} />}
      </AnimatePresence>
    </>
  );
}
