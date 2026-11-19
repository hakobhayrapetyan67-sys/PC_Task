import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import useAuthStore from '../store/authStore';
import useUiStore from '../store/uiStore';
import Badge from '../components/Badge';
import FileField from '../components/FileField';
import Spinner, { PageLoader } from '../components/Spinner';
import { timeAgo } from '../components/JobCard';

const STATUS_UI = {
  NONE: { variant: 'default', label: 'Not submitted', icon: '○',
    text: 'Submit a company document to unlock publishing.' },
  PENDING: { variant: 'warn', label: 'Under review', icon: '⏳',
    text: 'We received your documents. Review usually takes 1–2 business days.' },
  VERIFIED: { variant: 'success', label: 'Verified', icon: '✓',
    text: 'Your company is verified. You can publish jobs and candidates see the badge.' },
  REJECTED: { variant: 'danger', label: 'Rejected', icon: '✕',
    text: 'Your documents were not accepted. Check the note below and submit again.' },
};

const Verification = () => {
  const user = useAuthStore((s) => s.user);
  const refreshUser = useAuthStore((s) => s.refreshUser);
  const toast = useUiStore();

  const [status, setStatus] = useState(null);
  const [request, setRequest] = useState(null);
  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [form, setForm] = useState({ companyName: '', taxId: '' });
  const [file, setFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await api.get('/verification/status');
      setStatus(data.verificationStatus);
      setNote(data.verificationNote);
      setRequest(data.request);
      setForm((p) => ({
        ...p,
        companyName: data.request?.companyName || user?.companyName || '',
        taxId: data.request?.taxId || '',
      }));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, []);

  const submit = async (e) => {
    e.preventDefault();
    if (submitting) return;
    setFormError('');

    if (form.companyName.trim().length < 2) return setFormError('Enter your company name');
    if (!file) return setFormError('Attach a registration document (PDF, PNG or JPG)');

    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.append('companyName', form.companyName.trim());
      if (form.taxId.trim()) fd.append('taxId', form.taxId.trim());
      fd.append('document', file);

      const { data } = await api.post('/verification', fd);
      setStatus(data.request.status);
      setRequest(data.request);
      setFile(null);
      await refreshUser();
      toast.success(
        data.request.status === 'VERIFIED' ? 'Company verified' : 'Documents submitted',
        data.request.status === 'VERIFIED'
          ? 'You can publish jobs now.'
          : 'We will review them shortly.'
      );
    } catch (err) {
      setFormError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="page"><PageLoader label="Loading verification status…" /></div>;

  const ui = STATUS_UI[status] || STATUS_UI.NONE;
  const canSubmit = status === 'NONE' || status === 'REJECTED';

  return (
    <div className="page page--narrow">
      <div className="page__head">
        <h1 className="page__title">Company verification</h1>
        <p className="page__sub">
          Verified companies can publish vacancies and show a badge to candidates.
        </p>
      </div>

      {error && (
        <div className="alert alert--error" role="alert">
          <span className="alert__icon" aria-hidden="true">⚠</span>
          <div style={{ flex: 1 }}>{error}</div>
          <button className="btn btn--subtle btn--sm" onClick={load}>Retry</button>
        </div>
      )}

      <div className="card" style={{ marginBottom: 18 }}>
        <div className="card__head">
          <h3>Status</h3>
          <Badge variant={ui.variant}>{ui.icon} {ui.label}</Badge>
        </div>

        <p className="small" style={{ marginBottom: 14 }}>{ui.text}</p>

        {status === 'REJECTED' && note && (
          <div className="alert alert--error" role="status">
            <span className="alert__icon" aria-hidden="true">📝</span>
            <span><strong>Reviewer note:</strong> {note}</span>
          </div>
        )}

        {!user?.emailVerified && (
          <div className="alert alert--warn" role="status" style={{ marginBottom: 0 }}>
            <span className="alert__icon" aria-hidden="true">✉</span>
            <span>Confirm your email address before submitting documents.</span>
          </div>
        )}

        {request && (
          <div className="list" style={{ marginTop: 14 }}>
            <div className="list-row" style={{ boxShadow: 'none' }}>
              <div className="list-row__main">
                <div className="list-row__title">{request.companyName}</div>
                <div className="list-row__sub">
                  {request.taxId ? `Tax ID ${request.taxId} · ` : ''}
                  submitted {timeAgo(request.createdAt)}
                  {request.reviewedAt ? ` · reviewed ${timeAgo(request.reviewedAt)}` : ''}
                </div>
              </div>
              <div className="list-row__actions">
                <a className="btn btn--subtle btn--sm" href={request.documentUrl} target="_blank" rel="noreferrer">
                  View document
                </a>
              </div>
            </div>
          </div>
        )}

        {status === 'VERIFIED' && (
          <Link to="/provider/jobs/new" className="btn btn--primary" style={{ marginTop: 14 }}>
            Post a job
          </Link>
        )}
      </div>

      <div className="card" style={{ marginBottom: 18 }}>
        <div className="card__head"><h3>What stays locked until you verify</h3></div>
        <div className="stack">
          {[
            ['Publishing vacancies', status === 'VERIFIED'],
            ['The “Verified” badge on your listings', status === 'VERIFIED'],
            ['Receiving applications', status === 'VERIFIED'],
            ['Browsing the job board', true],
            ['Editing your company profile', true],
          ].map(([label, unlocked]) => (
            <div key={label} className="row row--between" style={{ fontSize: 13.5 }}>
              <span>{label}</span>
              <Badge variant={unlocked ? 'success' : 'default'}>
                {unlocked ? '✓ Available' : 'Locked'}
              </Badge>
            </div>
          ))}
        </div>
      </div>

      {canSubmit && (
        <form className="card" onSubmit={submit} noValidate>
          <div className="card__head">
            <h3>{status === 'REJECTED' ? 'Submit again' : 'Submit documents'}</h3>
          </div>

          {formError && (
            <div className="alert alert--error" role="alert">
              <span className="alert__icon" aria-hidden="true">⚠</span>
              <span>{formError}</span>
            </div>
          )}

          <div className="stack">
            <div className="field">
              <label className="field__label" htmlFor="v-company">Legal company name *</label>
              <input
                id="v-company" className="input" value={form.companyName}
                onChange={(e) => setForm((p) => ({ ...p, companyName: e.target.value }))}
                placeholder="Tech Innovations LLC" required disabled={submitting}
              />
            </div>

            <div className="field">
              <label className="field__label" htmlFor="v-tax">Tax ID / registration number</label>
              <input
                id="v-tax" className="input" value={form.taxId}
                onChange={(e) => setForm((p) => ({ ...p, taxId: e.target.value }))}
                placeholder="optional" disabled={submitting}
              />
            </div>

            <FileField
              label="Registration document * (PDF, PNG or JPG, max 5 MB)"
              accept=".pdf,.png,.jpg,.jpeg"
              maxMb={5}
              onPick={setFile}
              buttonText={file ? 'Change file' : 'Attach document'}
            />
            {file && <p className="small muted">Selected: {file.name}</p>}

            <button
              type="submit"
              className="btn btn--primary"
              style={{ alignSelf: 'flex-start' }}
              disabled={submitting || !user?.emailVerified}
            >
              {submitting ? <Spinner onPrimary /> : null}
              {submitting ? 'Submitting…' : 'Submit for review'}
            </button>

            <p className="tiny muted">
              Documents are stored privately on the server and are only used to confirm that the
              company exists.
            </p>
          </div>
        </form>
      )}
    </div>
  );
};
export default Verification;
