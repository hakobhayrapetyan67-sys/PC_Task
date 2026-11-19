import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import Logo from '../components/Logo';
import Spinner from '../components/Spinner';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [devLink, setDevLink] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;
    setError('');
    setSubmitting(true);
    try {
      const { data } = await api.post('/auth/forgot-password', { email: email.trim() });
      setSent(true);
      if (data.devLink) setDevLink(data.devLink);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-shell">
        <div className="auth-brand">
          <Logo size={28} />
          <strong style={{ fontSize: 19 }}>workx.am</strong>
          <span className="brand-badge">Clone</span>
        </div>

        <div className="auth-card">
          <h2 className="auth-title">Reset your password</h2>
          <p className="auth-subtitle">We will email you a link to set a new one</p>

          {error && (
            <div className="alert alert--error" role="alert">
              <span className="alert__icon" aria-hidden="true">⚠</span>
              <span>{error}</span>
            </div>
          )}

          {sent ? (
            <>
              {/* Deliberately vague: a different answer for a known and an
                  unknown address would leak who has an account. */}
              <div className="alert alert--success" role="status">
                <span className="alert__icon" aria-hidden="true">✓</span>
                <span>
                  If an account exists for <strong>{email}</strong>, a reset link is on its way.
                  It is valid for one hour.
                </span>
              </div>
              {devLink && (
                <div className="alert alert--info">
                  <span className="alert__icon" aria-hidden="true">🛠</span>
                  <span>
                    Dev mode (no SMTP configured): <a href={devLink}>open the reset link</a>
                  </span>
                </div>
              )}
              <p className="auth-foot"><Link to="/login">Back to sign in</Link></p>
            </>
          ) : (
            <>
              <form onSubmit={handleSubmit} className="auth-form" noValidate>
                <div className="field">
                  <label className="field__label" htmlFor="fp-email">Email</label>
                  <input
                    id="fp-email" className="input" type="email" value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com" required autoComplete="email" autoFocus
                    disabled={submitting}
                  />
                </div>
                <button type="submit" className="btn btn--primary auth-submit" disabled={submitting}>
                  {submitting ? <Spinner onPrimary /> : null}
                  {submitting ? 'Sending…' : 'Send reset link'}
                </button>
              </form>
              <p className="auth-foot">
                Remembered it? <Link to="/login">Sign in</Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
export default ForgotPassword;
