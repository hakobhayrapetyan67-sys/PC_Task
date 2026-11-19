import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import useUiStore from '../store/uiStore';
import Logo from '../components/Logo';
import Spinner from '../components/Spinner';

const Register = () => {
  const [form, setForm] = useState({
    name: '', email: '', password: '', role: 'WORKER', companyName: '',
  });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const register = useAuthStore((s) => s.register);
  const toastSuccess = useUiStore((s) => s.success);
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;
    setError('');

    if (form.name.trim().length < 2) return setError('Enter your full name');
    if (form.password.length < 8) return setError('Password must be at least 8 characters');
    if (!/[a-zA-Z]/.test(form.password) || !/[0-9]/.test(form.password))
      return setError('Password must contain at least one letter and one digit');
    if (form.role === 'PROVIDER' && form.companyName.trim().length < 2)
      return setError('Enter your company name');

    setSubmitting(true);
    try {
      const data = await register({
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
        role: form.role,
        companyName: form.role === 'PROVIDER' ? form.companyName.trim() : undefined,
      });
      toastSuccess('Account created', 'Check your email to confirm the address.');
      if (data?.devLink) console.info('[dev] confirmation link:', data.devLink);
      navigate(form.role === 'PROVIDER' ? '/provider/verification' : '/profile', { replace: true });
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
          <h2 className="auth-title">Create account</h2>
          <p className="auth-subtitle">Find a job or hire experienced specialists</p>

          {error && (
            <div className="alert alert--error" role="alert">
              <span className="alert__icon" aria-hidden="true">⚠</span>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form" noValidate>
            <div className="field">
              <span className="field__label">I am a…</span>
              <div className="role-picker">
                {[
                  { value: 'WORKER', title: 'Job seeker', text: 'Search and apply' },
                  { value: 'PROVIDER', title: 'Employer', text: 'Post vacancies' },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    className={`role-option${form.role === opt.value ? ' is-active' : ''}`}
                    onClick={() => setForm((p) => ({ ...p, role: opt.value }))}
                    aria-pressed={form.role === opt.value}
                  >
                    <div className="role-option__title">{opt.title}</div>
                    <div className="role-option__text">{opt.text}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="field">
              <label className="field__label" htmlFor="reg-name">Full name</label>
              <input
                id="reg-name" className="input" type="text" name="name"
                placeholder="Hakob Hayrapetyan" value={form.name} onChange={handleChange}
                required autoComplete="name" disabled={submitting}
              />
            </div>

            {form.role === 'PROVIDER' && (
              <div className="field">
                <label className="field__label" htmlFor="reg-company">Company name</label>
                <input
                  id="reg-company" className="input" type="text" name="companyName"
                  placeholder="Tech Innovations LLC" value={form.companyName}
                  onChange={handleChange} required autoComplete="organization" disabled={submitting}
                />
              </div>
            )}

            <div className="field">
              <label className="field__label" htmlFor="reg-email">Email</label>
              <input
                id="reg-email" className="input" type="email" name="email"
                placeholder="you@example.com" value={form.email} onChange={handleChange}
                required autoComplete="email" disabled={submitting}
              />
            </div>

            <div className="field">
              <label className="field__label" htmlFor="reg-password">Password</label>
              <input
                id="reg-password" className="input" type="password" name="password"
                placeholder="At least 8 characters" value={form.password} onChange={handleChange}
                required minLength={8} autoComplete="new-password" disabled={submitting}
              />
              <span className="field__hint">At least 8 characters, with a letter and a digit.</span>
            </div>

            <button type="submit" className="btn btn--primary auth-submit" disabled={submitting}>
              {submitting ? <Spinner onPrimary /> : null}
              {submitting ? 'Creating…' : 'Sign Up'}
            </button>
          </form>

          <p className="auth-foot">
            Have an account? <Link to="/login">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
};
export default Register;
