import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import useUiStore from '../store/uiStore';
import useChatStore from '../store/chatStore';
import Avatar from '../components/Avatar';
import { StatusBadge } from '../components/Badge';
import EmptyState from '../components/EmptyState';
import Modal from '../components/Modal';
import Spinner from '../components/Spinner';
import { salaryText, timeAgo } from '../components/JobCard';

const FILTERS = [
  { value: 'ALL', label: 'All' },
  { value: 'PENDING', label: 'Pending' },
  { value: 'REVIEWED', label: 'Reviewed' },
  { value: 'ACCEPTED', label: 'Accepted' },
  { value: 'REJECTED', label: 'Declined' },
];

const MyApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('ALL');
  const [confirm, setConfirm] = useState(null);
  const [busy, setBusy] = useState(false);
  const toast = useUiStore();
  const openForJob = useChatStore((s) => s.openForJob);
  const navigate = useNavigate();
  const [chatBusy, setChatBusy] = useState(null);

  const load = async () => {
    try {
      const { data } = await api.get('/applications/mine');
      setApplications(data.applications);
      setError('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const message = async (app) => {
    setChatBusy(app.id);
    try {
      const conversation = await openForJob(app.jobId);
      navigate(`/messages/${conversation.id}`);
    } catch (err) {
      toast.error('Could not open the chat', err.message);
    } finally {
      setChatBusy(null);
    }
  };

  const withdraw = async () => {
    setBusy(true);
    try {
      await api.delete(`/applications/${confirm.id}`);
      setApplications((list) => list.filter((a) => a.id !== confirm.id));
      toast.success('Application withdrawn');
      setConfirm(null);
    } catch (err) {
      toast.error('Could not withdraw', err.message);
    } finally {
      setBusy(false);
    }
  };

  const visible = filter === 'ALL' ? applications : applications.filter((a) => a.status === filter);

  const counts = applications.reduce((acc, a) => {
    acc[a.status] = (acc[a.status] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="page">
      <div className="page__head">
        <h1 className="page__title">My applications</h1>
        <p className="page__sub">Track where each application stands.</p>
      </div>

      <div className="stat-row">
        <div className="stat">
          <div className="stat__value">{applications.length}</div>
          <div className="stat__label">Total sent</div>
        </div>
        <div className="stat">
          <div className="stat__value">{counts.PENDING || 0}</div>
          <div className="stat__label">Awaiting review</div>
        </div>
        <div className="stat">
          <div className="stat__value">{counts.ACCEPTED || 0}</div>
          <div className="stat__label">Accepted</div>
        </div>
        <div className="stat">
          <div className="stat__value">{counts.REJECTED || 0}</div>
          <div className="stat__label">Declined</div>
        </div>
      </div>

      <div className="chip-list" style={{ marginBottom: 18 }}>
        {FILTERS.map((f) => (
          <button
            key={f.value}
            type="button"
            className={`btn btn--sm ${filter === f.value ? 'btn--primary' : 'btn--subtle'}`}
            onClick={() => setFilter(f.value)}
          >
            {f.label}
            {f.value !== 'ALL' && counts[f.value] ? ` (${counts[f.value]})` : ''}
          </button>
        ))}
      </div>

      {error && (
        <div className="alert alert--error" role="alert">
          <span className="alert__icon" aria-hidden="true">⚠</span>
          <div style={{ flex: 1 }}>{error}</div>
          <button className="btn btn--subtle btn--sm" onClick={() => { setLoading(true); load(); }}>Retry</button>
        </div>
      )}

      <div className="list">
        {loading && [0, 1, 2].map((i) => <div key={i} className="skeleton skeleton--row" />)}

        {!loading && visible.map((app) => {
          const company = app.job?.provider?.companyName || app.job?.provider?.name || 'Company';
          return (
            <article key={app.id} className="list-row">
              <Avatar name={company} src={app.job?.provider?.avatarUrl} size={48} square />
              <div className="list-row__main">
                <div className="row" style={{ gap: 8 }}>
                  {app.job ? (
                    <Link to={`/jobs/${app.jobId}`} className="list-row__title">{app.job.title}</Link>
                  ) : (
                    <span className="list-row__title muted">Job no longer available</span>
                  )}
                  <StatusBadge status={app.status} />
                </div>
                <div className="list-row__sub">
                  {company}
                  {app.job ? ` · ${app.job.location} · ${salaryText(app.job)}` : ''}
                </div>
                <div className="tiny muted" style={{ marginTop: 4 }}>
                  Applied {timeAgo(app.createdAt)}
                  {app.coverLetter ? ' · cover letter included' : ''}
                </div>
              </div>
              <div className="list-row__actions">
                {app.cvUrl && (
                  <a className="btn btn--subtle btn--sm" href={app.cvUrl} target="_blank" rel="noreferrer">
                    Submitted CV
                  </a>
                )}
                {app.job && (
                  <button
                    className="btn btn--ghost btn--sm"
                    onClick={() => message(app)}
                    disabled={chatBusy === app.id}
                  >
                    {chatBusy === app.id ? <Spinner /> : '💬'} Message employer
                  </button>
                )}
                {app.status !== 'ACCEPTED' && (
                  <button className="btn btn--danger btn--sm" onClick={() => setConfirm(app)}>
                    Withdraw
                  </button>
                )}
              </div>
            </article>
          );
        })}

        {!loading && !error && visible.length === 0 && (
          <EmptyState
            icon="📄"
            title={applications.length === 0 ? 'No applications yet' : 'Nothing in this status'}
            text={
              applications.length === 0
                ? 'When you apply to a job it will show up here with its current status.'
                : 'Try another status filter.'
            }
            action={
              applications.length === 0
                ? <Link to="/jobs" className="btn btn--primary">Browse jobs</Link>
                : <button className="btn btn--subtle" onClick={() => setFilter('ALL')}>Show all</button>
            }
          />
        )}
      </div>

      <Modal
        open={Boolean(confirm)}
        title="Withdraw application?"
        onClose={() => setConfirm(null)}
        actions={
          <>
            <button className="btn btn--subtle" onClick={() => setConfirm(null)} disabled={busy}>
              Keep it
            </button>
            <button className="btn btn--primary" onClick={withdraw} disabled={busy}>
              {busy ? <Spinner onPrimary /> : null}
              {busy ? 'Withdrawing…' : 'Withdraw'}
            </button>
          </>
        }
      >
        <p className="small">
          Your application for <strong>{confirm?.job?.title}</strong> will be removed and the
          employer will no longer see it. You can apply again later.
        </p>
      </Modal>
    </div>
  );
};
export default MyApplications;
