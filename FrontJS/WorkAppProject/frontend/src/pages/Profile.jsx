import { useEffect, useState } from 'react';
import api from '../api/axios';
import useAuthStore from '../store/authStore';
import useUiStore from '../store/uiStore';
import Avatar from '../components/Avatar';
import Badge, { VerifiedBadge } from '../components/Badge';
import FileField from '../components/FileField';
import Spinner, { PageLoader } from '../components/Spinner';
import { timeAgo } from '../components/JobCard';

const ACTION_LABEL = {
  'auth.register': 'Created the account',
  'auth.login': 'Signed in',
  'auth.logout': 'Signed out',
  'auth.login_failed': 'Failed sign-in attempt',
  'auth.email_verified': 'Confirmed the email address',
  'auth.password_changed': 'Changed the password',
  'auth.password_reset': 'Reset the password',
  'auth.password_reset_requested': 'Requested a password reset',
  'auth.verification_resent': 'Requested a new confirmation email',
  'profile.updated': 'Updated the profile',
  'profile.avatar_uploaded': 'Uploaded an avatar',
  'profile.cv_uploaded': 'Uploaded a CV',
  'job.created': 'Published a job',
  'job.updated': 'Edited a job',
  'job.deleted': 'Deleted a job',
  'application.created': 'Applied to a job',
  'application.withdrawn': 'Withdrew an application',
  'application.status_changed': 'Changed an application status',
  'favorite.added': 'Saved a job',
  'favorite.removed': 'Removed a saved job',
  'verification.submitted': 'Submitted company documents',
  'verification.reviewed': 'Reviewed a verification request',
};

const Profile = () => {
  const user = useAuthStore((s) => s.user);
  const setUser = useAuthStore((s) => s.setUser);
  const toast = useUiStore();

  const [form, setForm] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const [avatarBusy, setAvatarBusy] = useState(false);
  const [cvBusy, setCvBusy] = useState(false);

  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '', confirm: '' });
  const [pwBusy, setPwBusy] = useState(false);
  const [pwError, setPwError] = useState('');

  const [logs, setLogs] = useState([]);
  const [logsOpen, setLogsOpen] = useState(false);

  const isProvider = user?.role === 'PROVIDER';

  useEffect(() => {
    let alive = true;
    api
      .get('/profile')
      .then(({ data }) => {
        if (!alive) return;
        setStats(data.stats);
        setForm({
          name: data.user.name || '',
          phone: data.user.phone || '',
          location: data.user.location || '',
          headline: data.user.headline || '',
          bio: data.user.bio || '',
          skills: (data.user.skills || []).join(', '),
          companyName: data.user.companyName || '',
          companyWebsite: data.user.companyWebsite || '',
          companySize: data.user.companySize || '',
          companyAbout: data.user.companyAbout || '',
        });
      })
      .catch((err) => { if (alive) setError(err.message); })
      .finally(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
  }, []);

  const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const save = async (e) => {
    e.preventDefault();
    if (saving) return;
    setError('');
    setSaving(true);
    try {
      const payload = isProvider
        ? {
            name: form.name, phone: form.phone, location: form.location,
            headline: form.headline, bio: form.bio,
            companyName: form.companyName, companyWebsite: form.companyWebsite,
            companySize: form.companySize, companyAbout: form.companyAbout,
          }
        : {
            name: form.name, phone: form.phone, location: form.location,
            headline: form.headline, bio: form.bio, skills: form.skills,
          };
      const { data } = await api.patch('/profile', payload);
      setUser(data.user); 
      toast.success('Profile saved');
    } catch (err) {
      setError(err.message);
      toast.error('Could not save', err.message);
    } finally {
      setSaving(false);
    }
  };

  const uploadAvatar = async (file) => {
    setAvatarBusy(true);
    try {
      const fd = new FormData();
      fd.append('avatar', file);
      const { data } = await api.post('/profile/avatar', fd);
      setUser(data.user);
      toast.success('Avatar updated');
    } catch (err) {
      toast.error('Upload failed', err.message);
    } finally {
      setAvatarBusy(false);
    }
  };

  const uploadCv = async (file) => {
    setCvBusy(true);
    try {
      const fd = new FormData();
      fd.append('cv', file);
      const { data } = await api.post('/profile/cv', fd);
      setUser(data.user);
      toast.success('CV uploaded', 'You can apply to jobs now.');
    } catch (err) {
      toast.error('Upload failed', err.message);
    } finally {
      setCvBusy(false);
    }
  };

  const changePassword = async (e) => {
    e.preventDefault();
    if (pwBusy) return;
    setPwError('');

    if (pwForm.newPassword.length < 8) return setPwError('New password must be at least 8 characters');
    if (!/[a-zA-Z]/.test(pwForm.newPassword) || !/[0-9]/.test(pwForm.newPassword))
      return setPwError('New password needs a letter and a digit');
    if (pwForm.newPassword !== pwForm.confirm) return setPwError('The two passwords do not match');

    setPwBusy(true);
    try {
      await api.post('/auth/change-password', {
        currentPassword: pwForm.currentPassword,
        newPassword: pwForm.newPassword,
      });
      setPwForm({ currentPassword: '', newPassword: '', confirm: '' });
      toast.success('Password updated');
    } catch (err) {
      setPwError(err.message);
    } finally {
      setPwBusy(false);
    }
  };

  const loadLogs = async () => {
    setLogsOpen((v) => !v);
    if (logs.length) return;
    try {
      const { data } = await api.get('/profile/activity');
      setLogs(data.logs);
    } catch { /* non-critical */ }
  };

  if (loading || !form) return <div className="page"><PageLoader label="Loading your profile…" /></div>;

  return (
    <div className="page page--narrow">
      <div className="page__head">
        <h1 className="page__title">Profile & settings</h1>
        <p className="page__sub">
          {isProvider ? 'How candidates see your company.' : 'How employers see you.'}
        </p>
      </div>

      {stats && (
        <div className="stat-row">
          {isProvider ? (
            <>
              <div className="stat">
                <div className="stat__value">{stats.jobs ?? 0}</div>
                <div className="stat__label">Jobs published</div>
              </div>
              <div className="stat">
                <div className="stat__value">{stats.applicationsReceived ?? 0}</div>
                <div className="stat__label">Applications received</div>
              </div>
            </>
          ) : (
            <>
              <div className="stat">
                <div className="stat__value">{stats.applications ?? 0}</div>
                <div className="stat__label">Applications sent</div>
              </div>
              <div className="stat">
                <div className="stat__value">{stats.favorites ?? 0}</div>
                <div className="stat__label">Saved jobs</div>
              </div>
            </>
          )}
        </div>
      )}

      <div className="card" style={{ marginBottom: 18 }}>
        <div className="card__head"><h3>Account</h3></div>

        <div className="row" style={{ gap: 16, marginBottom: 18 }}>
          <Avatar name={user?.name} src={user?.avatarUrl} size={72} />
          <div style={{ flex: 1, minWidth: 180 }}>
            <div style={{ fontWeight: 700, fontSize: 16 }}>{user?.name}</div>
            <div className="small muted">{user?.email}</div>
            <div className="row" style={{ marginTop: 7, gap: 6 }}>
              <Badge variant="brand">{isProvider ? 'Employer' : 'Job seeker'}</Badge>
              {user?.emailVerified
                ? <Badge variant="success">✓ Email confirmed</Badge>
                : <Badge variant="warn">Email unconfirmed</Badge>}
              {isProvider && <VerifiedBadge status={user?.verificationStatus} showPending />}
            </div>
          </div>
        </div>

        <FileField
          label="Avatar"
          accept="image/png,image/jpeg,image/webp"
          maxMb={5}
          currentUrl={user?.avatarUrl}
          currentLabel="Current avatar"
          onPick={uploadAvatar}
          uploading={avatarBusy}
          buttonText="Upload image"
        />

        {!isProvider && (
          <div style={{ marginTop: 16 }}>
            <FileField
              label="CV / Resume (required to apply)"
              accept=".pdf,.doc,.docx"
              maxMb={5}
              currentUrl={user?.cvUrl}
              currentLabel="Current CV"
              onPick={uploadCv}
              uploading={cvBusy}
              buttonText="Upload CV"
            />
            {!user?.cvUrl && (
              <p className="field__error" style={{ marginTop: 8 }}>
                You cannot apply to jobs until a CV is on file.
              </p>
            )}
          </div>
        )}
      </div>

      <form className="card" style={{ marginBottom: 18 }} onSubmit={save} noValidate>
        <div className="card__head">
          <h3>{isProvider ? 'Company details' : 'Your details'}</h3>
        </div>

        {error && (
          <div className="alert alert--error" role="alert">
            <span className="alert__icon" aria-hidden="true">⚠</span>
            <span>{error}</span>
          </div>
        )}

        <div className="stack">
          <div className="field-row">
            <div className="field">
              <label className="field__label" htmlFor="p-name">Full name</label>
              <input id="p-name" className="input" name="name" value={form.name}
                onChange={handleChange} disabled={saving} />
            </div>
            <div className="field">
              <label className="field__label" htmlFor="p-location">Location</label>
              <input id="p-location" className="input" name="location" value={form.location}
                onChange={handleChange} placeholder="Yerevan" disabled={saving} />
            </div>
          </div>

          <div className="field-row">
            <div className="field">
              <label className="field__label" htmlFor="p-phone">Phone</label>
              <input id="p-phone" className="input" name="phone" value={form.phone}
                onChange={handleChange} placeholder="+374 ..." disabled={saving} />
            </div>
            <div className="field">
              <label className="field__label" htmlFor="p-headline">Headline</label>
              <input id="p-headline" className="input" name="headline" value={form.headline}
                onChange={handleChange}
                placeholder={isProvider ? 'Building products that matter' : 'Frontend developer · React'}
                disabled={saving} />
            </div>
          </div>

          <div className="field">
            <label className="field__label" htmlFor="p-email">Email (cannot be changed here)</label>
            <input id="p-email" className="input" value={user?.email || ''} disabled readOnly />
          </div>

          {isProvider ? (
            <>
              <div className="field-row">
                <div className="field">
                  <label className="field__label" htmlFor="p-company">Company name</label>
                  <input id="p-company" className="input" name="companyName" value={form.companyName}
                    onChange={handleChange} disabled={saving} />
                </div>
                <div className="field">
                  <label className="field__label" htmlFor="p-size">Company size</label>
                  <input id="p-size" className="input" name="companySize" value={form.companySize}
                    onChange={handleChange} placeholder="50-200" disabled={saving} />
                </div>
              </div>
              <div className="field">
                <label className="field__label" htmlFor="p-site">Website</label>
                <input id="p-site" className="input" name="companyWebsite" value={form.companyWebsite}
                  onChange={handleChange} placeholder="https://example.com" disabled={saving} />
                <span className="field__hint">Must start with http:// or https://</span>
              </div>
              <div className="field">
                <label className="field__label" htmlFor="p-about">About the company</label>
                <textarea id="p-about" className="textarea" name="companyAbout" rows="5"
                  value={form.companyAbout} onChange={handleChange} disabled={saving} />
              </div>
            </>
          ) : (
            <>
              <div className="field">
                <label className="field__label" htmlFor="p-skills">Skills</label>
                <input id="p-skills" className="input" name="skills" value={form.skills}
                  onChange={handleChange} placeholder="React, TypeScript, CSS" disabled={saving} />
                <span className="field__hint">Comma separated.</span>
              </div>
              <div className="field">
                <label className="field__label" htmlFor="p-bio">About you</label>
                <textarea id="p-bio" className="textarea" name="bio" rows="5"
                  value={form.bio} onChange={handleChange} disabled={saving} />
              </div>
            </>
          )}

          <button type="submit" className="btn btn--primary" style={{ alignSelf: 'flex-start' }} disabled={saving}>
            {saving ? <Spinner onPrimary /> : null}
            {saving ? 'Saving…' : 'Save changes'}
          </button>
        </div>
      </form>

      <form className="card" style={{ marginBottom: 18 }} onSubmit={changePassword} noValidate>
        <div className="card__head"><h3>Change password</h3></div>

        {pwError && (
          <div className="alert alert--error" role="alert">
            <span className="alert__icon" aria-hidden="true">⚠</span>
            <span>{pwError}</span>
          </div>
        )}

        <div className="stack">
          <div className="field">
            <label className="field__label" htmlFor="pw-current">Current password</label>
            <input id="pw-current" className="input" type="password" autoComplete="current-password"
              value={pwForm.currentPassword}
              onChange={(e) => setPwForm((p) => ({ ...p, currentPassword: e.target.value }))}
              disabled={pwBusy} />
          </div>
          <div className="field-row">
            <div className="field">
              <label className="field__label" htmlFor="pw-new">New password</label>
              <input id="pw-new" className="input" type="password" autoComplete="new-password"
                value={pwForm.newPassword}
                onChange={(e) => setPwForm((p) => ({ ...p, newPassword: e.target.value }))}
                disabled={pwBusy} />
            </div>
            <div className="field">
              <label className="field__label" htmlFor="pw-confirm">Repeat new password</label>
              <input id="pw-confirm" className="input" type="password" autoComplete="new-password"
                value={pwForm.confirm}
                onChange={(e) => setPwForm((p) => ({ ...p, confirm: e.target.value }))}
                disabled={pwBusy} />
            </div>
          </div>
          <button type="submit" className="btn btn--primary" style={{ alignSelf: 'flex-start' }} disabled={pwBusy}>
            {pwBusy ? <Spinner onPrimary /> : null}
            {pwBusy ? 'Updating…' : 'Update password'}
          </button>
        </div>
      </form>

      <div className="card">
        <div className="card__head" style={{ marginBottom: logsOpen ? 18 : 0, paddingBottom: logsOpen ? 14 : 0, borderBottom: logsOpen ? '1px solid var(--wx-border)' : 'none' }}>
          <h3>Activity log</h3>
          <button type="button" className="btn btn--subtle btn--sm" onClick={loadLogs}>
            {logsOpen ? 'Hide' : 'Show recent activity'}
          </button>
        </div>

        {logsOpen && (
          logs.length === 0 ? (
            <p className="small muted">No activity recorded yet.</p>
          ) : (
            <div className="list">
              {logs.map((l) => (
                <div key={l.id} className="row row--between" style={{ fontSize: 13.5, padding: '7px 0', borderBottom: '1px solid var(--wx-border)' }}>
                  <span>{ACTION_LABEL[l.action] || l.action}</span>
                  <span className="tiny muted">{timeAgo(l.createdAt)}</span>
                </div>
              ))}
            </div>
          )
        )}
      </div>
    </div>
  );
};
export default Profile;
