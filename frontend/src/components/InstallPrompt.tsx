import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent);
const isInStandaloneMode = window.matchMedia('(display-mode: standalone)').matches
  || ('standalone' in window.navigator && (window.navigator as Navigator & { standalone?: boolean }).standalone === true);

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showIOSHint, setShowIOSHint] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (isInStandaloneMode) return;
    if (sessionStorage.getItem('pwa-dismissed')) return;

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };
    window.addEventListener('beforeinstallprompt', handler);

    if (isIOS) {
      const timer = setTimeout(() => setShowIOSHint(true), 4000);
      return () => { clearTimeout(timer); window.removeEventListener('beforeinstallprompt', handler); };
    }

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const dismiss = () => {
    setDeferredPrompt(null);
    setShowIOSHint(false);
    setDismissed(true);
    sessionStorage.setItem('pwa-dismissed', '1');
  };

  const install = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') dismiss();
    else dismiss();
  };

  if (dismissed || isInStandaloneMode) return null;

  return (
    <AnimatePresence>
      {(deferredPrompt || showIOSHint) && (
        <motion.div
          className="pwa-banner"
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        >
          <div className="pwa-banner-icon">
            <img src="/pwa-64x64.png" alt="Blob Bash" width={40} height={40} />
          </div>
          <div className="pwa-banner-text">
            <span className="pwa-banner-title">Add to Home Screen</span>
            {isIOS ? (
              <span className="pwa-banner-sub">
                Tap <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" style={{ verticalAlign: 'middle', margin: '0 2px' }}><path d="M16 5l-1.42 1.42-1.59-1.59V16h-1.98V4.83L9.42 6.42 8 5l4-4 4 4zm4 5v11c0 1.1-.9 2-2 2H6c-1.11 0-2-.9-2-2V10c0-1.11.89-2 2-2h3v2H6v11h12V10h-3V8h3c1.1 0 2 .89 2 2z"/></svg> then "Add to Home Screen"
              </span>
            ) : (
              <span className="pwa-banner-sub">Play offline, full screen</span>
            )}
          </div>
          <div className="pwa-banner-actions">
            {!isIOS && (
              <button className="pwa-install-btn" onClick={install}>Install</button>
            )}
            <button className="pwa-dismiss-btn" onClick={dismiss}>&#x2715;</button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
