import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import api, { TOKEN_KEY, USER_KEY } from '../api/axios';
import useAuthStore from '../store/authStore';
import useUiStore from '../store/uiStore';
import Logo from '../components/Logo';
import Spinner from '../components/Spinner';

const ResetPassword = () => {
  const [params] = useSearchParams();
  const token = params.get('token');

  const [form, setForm] = useState({ password: '', confirm: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const toastSuccess = useUiStore((s) => s.success);
  const navigate = useNavigate();

  const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;
    setError('');

    if (form.password.length < 8) return setError('Password must be at least 8 characters');
    if (!/[a-zA-Z]/.test(form.password) || !/[0-9]/.test(form.password))
      return setError('Password must contain at least one letter and one digit');
    if (form.password !== form.confirm) return setError('The two passwords do not match');

    setSubmitting(true);
    try {
      const { data } = await api.post('/auth/reset-password', { token, password: form.password });
      localStorage.setItem(TOKEN_KEY, data.token);
      localStorage.setItem(USER_KEY, JSON.stringify(data.user));
      useAuthStore.setState({ user: data.user, token: data.token, isAuthenticated: true, booting: false });

      toastSuccess('Password updated', 'You are signed in.');
      navigate(data.user.role === 'PROVIDER' ? '/provider/jobs' : '/jobs', { replace: true });
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
          <h2 className="auth-title">Set a new password</h2>
          <p className="auth-subtitle">Choose something you have not used before</p>

          {!token && (
            <div className="alert alert--error" role="alert">
              <span className="alert__icon" aria-hidden="true">⚠</span>
              <span>This page needs a reset token. Request a new link.</span>
            </div>
          )}

          {error && (
            <div className="alert alert--error" role="alert">
              <span className="alert__icon" aria-hidden="true">⚠</span>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form" noValidate>
            <div className="field">
              <label className="field__label" htmlFor="rp-password">New password</label>
              <input
                id="rp-password" className="input" type="password" name="password"
                value={form.password} onChange={handleChange} placeholder="At least 8 characters"
                required minLength={8} autoComplete="new-password"
                disabled={submitting || !token} autoFocus
              />
            </div>
            <div className="field">
              <label className="field__label" htmlFor="rp-confirm">Repeat password</label>
              <input
                id="rp-confirm" className="input" type="password" name="confirm"
                value={form.confirm} onChange={handleChange} placeholder="Repeat it"
                required autoComplete="new-password" disabled={submitting || !token}
              />
            </div>
            <button type="submit" className="btn btn--primary auth-submit" disabled={submitting || !token}>
              {submitting ? <Spinner onPrimary /> : null}
              {submitting ? 'Saving…' : 'Save password'}
            </button>
          </form>

          <p className="auth-foot">
            <Link to="/forgot-password">Request a new link</Link>
          </p>
        </div>
      </div>
    </div>
  );
};
export default ResetPassword;
