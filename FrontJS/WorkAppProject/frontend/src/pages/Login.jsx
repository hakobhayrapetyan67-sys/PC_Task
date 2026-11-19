import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import useUiStore from '../store/uiStore';
import Logo from '../components/Logo';
import Spinner from '../components/Spinner';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const login = useAuthStore((s) => s.login);
  const toastSuccess = useUiStore((s) => s.success);
  const navigate = useNavigate();
  const location = useLocation();

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;
    setError('');
    setSubmitting(true);
    try {
      const user = await login({ email: form.email.trim(), password: form.password });
      toastSuccess(`Welcome back, ${user.name.split(' ')[0]}`);
      const from = location.state?.from;
      navigate(from || (user.role === 'PROVIDER' ? '/provider/jobs' : '/jobs'), { replace: true });
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
          <strong style={{ fontSize: 19, letterSpacing: '-0.02em' }}>workx.am</strong>
          <span className="brand-badge">Clone</span>
        </div>

        <div className="auth-card">
          <h2 className="auth-title">Welcome back</h2>
          <p className="auth-subtitle">Sign in to continue your career search</p>

          {error && (
            <div className="alert alert--error" role="alert">
              <span className="alert__icon" aria-hidden="true">⚠</span>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form" noValidate>
            <div className="field">
              <label className="field__label" htmlFor="login-email">Email</label>
              <input
                id="login-email" className="input" type="email" name="email"
                placeholder="you@example.com" value={form.email} onChange={handleChange}
                required autoComplete="email" autoFocus disabled={submitting}
              />
            </div>

            <div className="field">
              <label className="field__label" htmlFor="login-password">Password</label>
              <input
                id="login-password" className="input" type="password" name="password"
                placeholder="••••••••" value={form.password} onChange={handleChange}
                required autoComplete="current-password" disabled={submitting}
              />
              <Link to="/forgot-password" className="field__hint" style={{ alignSelf: 'flex-end' }}>
                Forgot your password?
              </Link>
            </div>

            <button type="submit" className="btn btn--primary auth-submit" disabled={submitting}>
              {submitting ? <Spinner onPrimary /> : null}
              {submitting ? 'Signing in…' : 'Sign In'}
            </button>
          </form>

          <p className="auth-foot">
            No account? <Link to="/register">Sign Up</Link>
          </p>

          <div className="auth-hint">
            <strong>Demo accounts</strong> (after <code>npm run seed</code>, password{' '}
            <code>Password123</code>):<br />
            <code>worker@test.com</code> — job seeker<br />
            <code>provider@test.com</code> — verified employer<br />
            <code>pending@test.com</code> — unverified employer
          </div>
        </div>
      </div>
    </div>
  );
};
export default Login;
