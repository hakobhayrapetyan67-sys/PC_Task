import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import api from '../api/axios';
import useJobStore from '../store/jobStore';
import useAuthStore from '../store/authStore';
import useUiStore from '../store/uiStore';
import Spinner, { PageLoader } from '../components/Spinner';

const EMPTY = {
  title: '', description: '', category: 'IT', location: 'Yerevan',
  employmentType: 'FULL_TIME', workMode: 'ONSITE',
  experienceMin: 0, experienceMax: '', salaryMin: '', salaryMax: '',
  currency: 'USD', skills: '', status: 'ACTIVE',
};

const CATEGORIES = [
  ['IT', 'IT / Software'], ['DESIGN', 'Design'], ['MARKETING', 'Marketing'],
  ['SALES', 'Sales'], ['FINANCE', 'Finance'], ['OTHER', 'Other'],
];
const TYPES = [
  ['FULL_TIME', 'Full-time'], ['PART_TIME', 'Part-time'],
  ['CONTRACT', 'Contract'], ['INTERNSHIP', 'Internship'],
];
const MODES = [['ONSITE', 'On-site'], ['HYBRID', 'Hybrid'], ['REMOTE', 'Remote']];

const JobForm = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const createJob = useJobStore((s) => s.createJob);
  const updateJob = useJobStore((s) => s.updateJob);
  const user = useAuthStore((s) => s.user);
  const toast = useUiStore();

  const [form, setForm] = useState(EMPTY);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isEdit) return undefined;
    let alive = true;
    api
      .get(`/jobs/${id}`)
      .then(({ data }) => {
        if (!alive) return;
        const j = data.job;
        setForm({
          title: j.title, description: j.description, category: j.category,
          location: j.location, employmentType: j.employmentType, workMode: j.workMode,
          experienceMin: j.experienceMin ?? 0,
          experienceMax: j.experienceMax ?? '',
          salaryMin: j.salaryMin ?? '', salaryMax: j.salaryMax ?? '',
          currency: j.currency, skills: (j.skills || []).join(', '), status: j.status,
        });
      })
      .catch((err) => { if (alive) setError(err.message); })
      .finally(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
  }, [id, isEdit]);

  const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (saving) return;
    setError('');

    if (form.title.trim().length < 3) return setError('Title must be at least 3 characters');
    if (form.description.trim().length < 20)
      return setError('Description must be at least 20 characters');
    if (!form.salaryMin && !form.salaryMax) return setError('Enter at least one salary value');
    if (form.salaryMin && form.salaryMax && Number(form.salaryMax) < Number(form.salaryMin))
      return setError('Maximum salary cannot be lower than the minimum');
    if (form.experienceMax && Number(form.experienceMax) < Number(form.experienceMin))
      return setError('Maximum experience cannot be lower than the minimum');

    const payload = {
      ...form,
      experienceMin: Number(form.experienceMin) || 0,
      experienceMax: form.experienceMax === '' ? null : Number(form.experienceMax),
      salaryMin: form.salaryMin === '' ? null : Number(form.salaryMin),
      salaryMax: form.salaryMax === '' ? null : Number(form.salaryMax),
    };

    setSaving(true);
    try {
      if (isEdit) {
        await updateJob(Number(id), payload);
        toast.success('Job updated');
      } else {
        await createJob(payload);
        toast.success('Job published', 'It is live on the public board.');
      }
      navigate('/provider/jobs', { replace: true });
    } catch (err) {
      setError(err.message);
      // The guard can reject a create if verification lapsed in the meantime.
      if (err.code === 'COMPANY_NOT_VERIFIED' || err.code === 'EMAIL_NOT_VERIFIED') {
        toast.error('Publishing is locked', err.message);
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="page"><PageLoader label="Loading the listing…" /></div>;

  const canPublish = user?.emailVerified && user?.verificationStatus === 'VERIFIED';

  return (
    <div className="page page--narrow">
      <Link to="/provider/jobs" className="small" style={{ display: 'inline-block', marginBottom: 14 }}>
        ← Back to my jobs
      </Link>

      <div className="page__head">
        <h1 className="page__title">{isEdit ? 'Edit listing' : 'Post a new job'}</h1>
        <p className="page__sub">
          {isEdit ? 'Changes go live immediately.' : 'It appears on the public board as soon as you publish.'}
        </p>
      </div>

      {!isEdit && !canPublish && (
        <div className="alert alert--warn" role="status">
          <span className="alert__icon" aria-hidden="true">🛡</span>
          <div style={{ flex: 1 }}>
            Your company is not verified yet, so publishing will be rejected.
          </div>
          <Link to="/provider/verification" className="btn btn--subtle btn--sm">Verify</Link>
        </div>
      )}

      <form className="card" onSubmit={handleSubmit} noValidate>
        {error && (
          <div className="alert alert--error" role="alert">
            <span className="alert__icon" aria-hidden="true">⚠</span>
            <span>{error}</span>
          </div>
        )}

        <div className="stack">
          <div className="field">
            <label className="field__label" htmlFor="j-title">Job title *</label>
            <input id="j-title" className="input" name="title" value={form.title}
              onChange={handleChange} placeholder="Senior React Developer"
              required disabled={saving} autoFocus />
          </div>

          <div className="field">
            <label className="field__label" htmlFor="j-desc">Description *</label>
            <textarea id="j-desc" className="textarea" name="description" rows="8"
              value={form.description} onChange={handleChange}
              placeholder="What the person will own, who they work with, what success looks like…"
              required disabled={saving} />
            <span className="field__hint">{form.description.length} characters (minimum 20)</span>
          </div>

          <div className="field-row">
            <div className="field">
              <label className="field__label" htmlFor="j-category">Category</label>
              <select id="j-category" className="select" name="category" value={form.category}
                onChange={handleChange} disabled={saving}>
                {CATEGORIES.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
              </select>
            </div>
            <div className="field">
              <label className="field__label" htmlFor="j-location">Location</label>
              <input id="j-location" className="input" name="location" value={form.location}
                onChange={handleChange} placeholder="Yerevan" disabled={saving} />
            </div>
          </div>

          <div className="field-row">
            <div className="field">
              <label className="field__label" htmlFor="j-type">Employment type</label>
              <select id="j-type" className="select" name="employmentType" value={form.employmentType}
                onChange={handleChange} disabled={saving}>
                {TYPES.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
              </select>
            </div>
            <div className="field">
              <label className="field__label" htmlFor="j-mode">Work mode</label>
              <select id="j-mode" className="select" name="workMode" value={form.workMode}
                onChange={handleChange} disabled={saving}>
                {MODES.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
              </select>
            </div>
          </div>

          <div className="field-row">
            <div className="field">
              <label className="field__label" htmlFor="j-smin">Salary from, $ *</label>
              <input id="j-smin" className="input" type="number" min="1" step="50" name="salaryMin"
                value={form.salaryMin} onChange={handleChange} placeholder="2000" disabled={saving} />
            </div>
            <div className="field">
              <label className="field__label" htmlFor="j-smax">Salary to, $</label>
              <input id="j-smax" className="input" type="number" min="1" step="50" name="salaryMax"
                value={form.salaryMax} onChange={handleChange} placeholder="3000" disabled={saving} />
            </div>
          </div>

          <div className="field-row">
            <div className="field">
              <label className="field__label" htmlFor="j-emin">Experience from, years</label>
              <input id="j-emin" className="input" type="number" min="0" max="50" name="experienceMin"
                value={form.experienceMin} onChange={handleChange} disabled={saving} />
            </div>
            <div className="field">
              <label className="field__label" htmlFor="j-emax">Experience to, years</label>
              <input id="j-emax" className="input" type="number" min="0" max="50" name="experienceMax"
                value={form.experienceMax} onChange={handleChange} placeholder="optional" disabled={saving} />
            </div>
          </div>

          <div className="field">
            <label className="field__label" htmlFor="j-skills">Skills</label>
            <input id="j-skills" className="input" name="skills" value={form.skills}
              onChange={handleChange} placeholder="React, TypeScript, REST" disabled={saving} />
            <span className="field__hint">Comma separated. They are searchable.</span>
          </div>

          {isEdit && (
            <div className="field">
              <label className="field__label" htmlFor="j-status">Status</label>
              <select id="j-status" className="select" name="status" value={form.status}
                onChange={handleChange} disabled={saving}>
                <option value="ACTIVE">Active — accepting applications</option>
                <option value="CLOSED">Closed — hidden from the board</option>
              </select>
            </div>
          )}

          <div className="row" style={{ marginTop: 6 }}>
            <button type="submit" className="btn btn--primary" disabled={saving}>
              {saving ? <Spinner onPrimary /> : null}
              {saving ? 'Saving…' : isEdit ? 'Save changes' : 'Publish job'}
            </button>
            <Link to="/provider/jobs" className="btn btn--subtle">Cancel</Link>
          </div>
        </div>
      </form>
    </div>
  );
};
export default JobForm;
