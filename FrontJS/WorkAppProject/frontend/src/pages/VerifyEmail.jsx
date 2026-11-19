import { useEffect, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import api from '../api/axios';
import useAuthStore from '../store/authStore';
import Logo from '../components/Logo';
import Spinner from '../components/Spinner';

const VerifyEmail = () => {
  const [params] = useSearchParams();
  const token = params.get('token');
  const [state, setState] = useState(token ? 'loading' : 'missing');
  const [message, setMessage] = useState('');
  const setUser = useAuthStore((s) => s.setUser);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const done = useRef(false);

  useEffect(() => {
    if (!token || done.current) return;
    done.current = true;

    api
      .post('/auth/verify-email', { token })
      .then(({ data }) => {
        setState('ok');
        setMessage(data.message || 'Email confirmed');
        if (isAuthenticated && data.user) setUser(data.user);
      })
      .catch((err) => {
        setState('error');
        setMessage(err.message);
      });
  }, [token, isAuthenticated, setUser]);

  return (
    <div className="auth-container">
      <div className="auth-shell">
        <div className="auth-brand">
          <Logo size={28} />
          <strong style={{ fontSize: 19 }}>workx.am</strong>
          <span className="brand-badge">Clone</span>
        </div>

        <div className="auth-card" style={{ textAlign: 'center' }}>
          {state === 'loading' && (
            <>
              <div className="center-state" style={{ padding: '20px 0' }}>
                <Spinner size="lg" />
              </div>
              <h2 className="auth-title">Confirming your email…</h2>
            </>
          )}

          {state === 'ok' && (
            <>
              <div style={{ fontSize: 40 }} aria-hidden="true">✅</div>
              <h2 className="auth-title">Email confirmed</h2>
              <p className="auth-subtitle">{message}</p>
              <Link to={isAuthenticated ? '/jobs' : '/login'} className="btn btn--primary auth-submit">
                {isAuthenticated ? 'Go to jobs' : 'Sign in'}
              </Link>
            </>
          )}

          {(state === 'error' || state === 'missing') && (
            <>
              <div style={{ fontSize: 40 }} aria-hidden="true">⚠️</div>
              <h2 className="auth-title">Link not valid</h2>
              <p className="auth-subtitle">
                {state === 'missing' ? 'This page needs a confirmation token.' : message}
              </p>
              <p className="small muted" style={{ marginBottom: 18 }}>
                Confirmation links expire after 24 hours and work only once. Sign in and press
                “Resend” in the banner to get a fresh one.
              </p>
              <Link to="/login" className="btn btn--primary auth-submit">Back to sign in</Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
export default VerifyEmail;
