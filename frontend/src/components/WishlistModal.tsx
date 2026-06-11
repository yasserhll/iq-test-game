import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { submitWishlist } from '../lib/api';

interface Props {
  onClose: () => void;
}

interface FormState {
  name: string;
  email: string;
}

interface FormErrors {
  name?: string;
  email?: string;
}

function validate(form: FormState): FormErrors {
  const errors: FormErrors = {};
  if (!form.name.trim()) errors.name = 'Le nom est requis.';
  if (!form.email.trim()) {
    errors.email = "L'email est requis.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = "Format d'email invalide.";
  }
  return errors;
}

export default function WishlistModal({ onClose }: Props) {
  const [form, setForm] = useState<FormState>({ name: '', email: '' });
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [serverError, setServerError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors(prev => ({ ...prev, [e.target.name]: undefined }));
    setServerError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate(form);
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setLoading(true);
    try {
      await submitWishlist({ email: form.email, name: form.name });
      setSuccess(true);
    } catch (err) {
      setServerError(err instanceof Error ? err.message : 'Erreur serveur.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="modal-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <motion.div
        className="modal"
        initial={{ scale: .85, y: 30 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: .85, y: 30 }}
        transition={{ type: 'spring', stiffness: 300, damping: 24 }}
      >
        <button className="modal-close" onClick={onClose} aria-label="Fermer">&#x2715;</button>

        <AnimatePresence mode="wait">
          {success ? (
            <motion.div
              key="success"
              className="modal-success"
              initial={{ opacity: 0, scale: .9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <h3>You're on the list!</h3>
              <p>
                We'll ping you when Blob Bash launches.<br />
                Get ready to bash some goo.
              </p>
            </motion.div>
          ) : (
            <motion.form key="form" onSubmit={handleSubmit} noValidate>
              <h2>Wishlist Now</h2>
              <p>Be first in line. Get notified on launch day + exclusive early backer bonus.</p>

              <div className="field">
                <label htmlFor="wl-name">Your Name</label>
                <input
                  id="wl-name" name="name" type="text"
                  placeholder="Gloob McSplat"
                  value={form.name} onChange={handleChange}
                  className={errors.name ? 'error-input' : ''}
                  autoComplete="name"
                />
                {errors.name && <p className="field-error">{errors.name}</p>}
              </div>

              <div className="field">
                <label htmlFor="wl-email">Email Address</label>
                <input
                  id="wl-email" name="email" type="email"
                  placeholder="you@goo.world"
                  value={form.email} onChange={handleChange}
                  className={errors.email ? 'error-input' : ''}
                  autoComplete="email"
                />
                {errors.email && <p className="field-error">{errors.email}</p>}
              </div>

              {serverError && <p className="field-error" style={{ marginBottom: 8 }}>{serverError}</p>}

              <button className="modal-submit" type="submit" disabled={loading}>
                {loading ? 'Sending...' : 'Count Me In'}
              </button>
            </motion.form>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
