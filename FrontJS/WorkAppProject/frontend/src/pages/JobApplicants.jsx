import { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import api from '../api/axios';
import useUiStore from '../store/uiStore';
import useChatStore from '../store/chatStore';
import Avatar from '../components/Avatar';
import Badge, { StatusBadge } from '../components/Badge';
import EmptyState from '../components/EmptyState';
import Modal from '../components/Modal';
import Spinner from '../components/Spinner';
import { timeAgo } from '../components/JobCard';

const NEXT_ACTIONS = [
  { status: 'REVIEWED', label: 'Mark reviewed', variant: 'btn--subtle' },
  { status: 'ACCEPTED', label: 'Accept', variant: 'btn--primary' },
  { status: 'REJECTED', label: 'Decline', variant: 'btn--danger' },
];

const JobApplicants = () => {
  const { id } = useParams();
  const scoped = Boolean(id);
  const toast = useUiStore();
  const openForJob = useChatStore((s) => s.openForJob);
  const navigate = useNavigate();
  const [chatBusy, setChatBusy] = useState(null);

  const [job, setJob] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [busyId, setBusyId] = useState(null);
  const [letter, setLetter] = useState(null);
  const [filter, setFilter] = useState('ALL');

  const load = useCallback(async () => {
    try {
      const { data } = await api.get(scoped ? `/applications/jobs/${id}` : '/applications/received');
      setApplications(data.applications);
      if (data.job) setJob(data.job);
      setError('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [id, scoped]);

  useEffect(() => { load(); }, [load]);

  // Opens (or reuses) the thread with this candidate for this job.
  const message = async (app) => {
    setChatBusy(app.id);
    try {
      const conversation = await openForJob(app.jobId, app.workerId);
      navigate(`/messages/${conversation.id}`);
    } catch (err) {
      toast.error('Could not open the chat', err.message);
    } finally {
      setChatBusy(null);
    }
  };

  const setStatus = async (app, status) => {
    setBusyId(app.id);
    try {
      const { data } = await api.patch(`/applications/${app.id}/status`, { status });
      setApplications((list) => list.map((a) => (a.id === app.id ? data.application : a)));
      toast.success(`Application ${status.toLowerCase()}`, 'The candidate was notified.');
    } catch (err) {
      toast.error('Could not update', err.message);
    } finally {
      setBusyId(null);
    }
  };

  const counts = applications.reduce((acc, a) => {
    acc[a.status] = (acc[a.status] || 0) + 1;
    return acc;
  }, {});
  const visible = filter === 'ALL' ? applications : applications.filter((a) => a.status === filter);

  return (
    <div className="page">
      <Link to="/provider/jobs" className="small" style={{ display: 'inline-block', marginBottom: 14 }}>
        ← Back to my jobs
      </Link>

      <div className="page__head">
        <h1 className="page__title">
          {scoped ? (job?.title || 'Applicants') : 'All applicants'}
        </h1>
        <p className="page__sub">
          {loading
            ? 'Loading…'
            : `${applications.length} application${applications.length === 1 ? '' : 's'}`}
          {scoped && job?.status === 'CLOSED' ? ' · this job is closed' : ''}
        </p>
      </div>

      <div className="chip-list" style={{ marginBottom: 18 }}>
        {['ALL', 'PENDING', 'REVIEWED', 'ACCEPTED', 'REJECTED'].map((s) => (
          <button
            key={s}
            type="button"
            className={`btn btn--sm ${filter === s ? 'btn--primary' : 'btn--subtle'}`}
            onClick={() => setFilter(s)}
          >
            {s === 'ALL' ? 'All' : s.charAt(0) + s.slice(1).toLowerCase()}
            {s !== 'ALL' && counts[s] ? ` (${counts[s]})` : ''}
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

        {!loading && visible.map((app) => (
          <article key={app.id} className="list-row">
            <Avatar name={app.worker?.name} src={app.worker?.avatarUrl} size={48} />
            <div className="list-row__main">
              <div className="row" style={{ gap: 8 }}>
                <span className="list-row__title">{app.worker?.name || 'Candidate'}</span>
                <StatusBadge status={app.status} />
              </div>
              <div className="list-row__sub">
                {app.worker?.headline || 'No headline'}
                {app.worker?.location ? ` · ${app.worker.location}` : ''}
              </div>
              {!scoped && app.job && (
                <div className="tiny muted" style={{ marginTop: 3 }}>
                  for <Link to={`/jobs/${app.jobId}`}>{app.job.title}</Link>
                </div>
              )}
              {app.worker?.skills?.length > 0 && (
                <div className="chip-list" style={{ marginTop: 7 }}>
                  {(Array.isArray(app.worker.skills)
                    ? app.worker.skills
                    : String(app.worker.skills).split(',')
                  ).filter(Boolean).slice(0, 5).map((s) => (
                    <Badge key={s}>{String(s).trim()}</Badge>
                  ))}
                </div>
              )}
              <div className="tiny muted" style={{ marginTop: 5 }}>
                Applied {timeAgo(app.createdAt)} · {app.worker?.email}
              </div>
            </div>

            <div className="list-row__actions" style={{ flexDirection: 'column', alignItems: 'stretch', minWidth: 160 }}>
              <div className="row" style={{ gap: 6 }}>
                {app.cvUrl && (
                  <a className="btn btn--ghost btn--sm" href={app.cvUrl} target="_blank" rel="noreferrer">
                    Open CV
                  </a>
                )}
                {app.coverLetter && (
                  <button className="btn btn--subtle btn--sm" onClick={() => setLetter(app)}>
                    Cover letter
                  </button>
                )}
                <button
                  className="btn btn--subtle btn--sm"
                  onClick={() => message(app)}
                  disabled={chatBusy === app.id}
                >
                  {chatBusy === app.id ? <Spinner /> : '💬'} Message
                </button>
              </div>
              <div className="row" style={{ gap: 6 }}>
                {NEXT_ACTIONS.filter((a) => a.status !== app.status).map((a) => (
                  <button
                    key={a.status}
                    className={`btn ${a.variant} btn--sm`}
                    onClick={() => setStatus(app, a.status)}
                    disabled={busyId === app.id}
                  >
                    {busyId === app.id ? <Spinner /> : a.label}
                  </button>
                ))}
              </div>
            </div>
          </article>
        ))}

        {!loading && !error && visible.length === 0 && (
          <EmptyState
            icon="👥"
            title={applications.length === 0 ? 'No applicants yet' : 'Nothing in this status'}
            text={
              applications.length === 0
                ? 'When someone applies, their profile and CV appear here.'
                : 'Try another status filter.'
            }
            action={
              applications.length === 0
                ? <Link to="/provider/jobs" className="btn btn--primary">Back to my jobs</Link>
                : <button className="btn btn--subtle" onClick={() => setFilter('ALL')}>Show all</button>
            }
          />
        )}
      </div>

      <Modal
        open={Boolean(letter)}
        title={`Cover letter — ${letter?.worker?.name || ''}`}
        onClose={() => setLetter(null)}
        actions={<button className="btn btn--subtle" onClick={() => setLetter(null)}>Close</button>}
      >
        <p style={{ whiteSpace: 'pre-wrap', fontSize: 14, lineHeight: 1.7 }}>
          {letter?.coverLetter}
        </p>
      </Modal>
    </div>
  );
};
export default JobApplicants;
