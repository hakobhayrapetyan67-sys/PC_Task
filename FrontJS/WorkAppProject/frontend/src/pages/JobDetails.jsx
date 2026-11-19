import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '../api/axios';
import useAuthStore from '../store/authStore';
import useUiStore from '../store/uiStore';
import Avatar from '../components/Avatar';
import Badge, { VerifiedBadge } from '../components/Badge';
import Modal from '../components/Modal';
import Spinner, { PageLoader } from '../components/Spinner';
import EmptyState from '../components/EmptyState';
import { salaryText, experienceText, timeAgo } from '../components/JobCard';

const LABEL = {
  IT: 'IT / Software', DESIGN: 'Design', MARKETING: 'Marketing', SALES: 'Sales',
  FINANCE: 'Finance', OTHER: 'Other',
  FULL_TIME: 'Full-time', PART_TIME: 'Part-time', CONTRACT: 'Contract', INTERNSHIP: 'Internship',
  ONSITE: 'On-site', HYBRID: 'Hybrid', REMOTE: 'Remote',
};

const JobDetails = () => {
  const { id } = useParams();
  const user = useAuthStore((s) => s.user);
  const toast = useUiStore();

  const [fetched, setFetched] = useState({ job: null, error: '', forId: null });
  const job = fetched.forId === id ? fetched.job : null;
  const error = fetched.forId === id ? fetched.error : '';
  const loading = fetched.forId !== id;
  const setJob = (updater) =>
    setFetched((prev) => ({
      ...prev,
      job: typeof updater === 'function' ? updater(prev.job) : updater,
    }));

  const [applyOpen, setApplyOpen] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const [applying, setApplying] = useState(false);
  const [applyError, setApplyError] = useState('');
  const [favBusy, setFavBusy] = useState(false);

  const isWorker = user?.role === 'WORKER';
  const isOwner = job && user?.id === job.providerId;

  useEffect(() => {
    let alive = true;
    api
      .get(`/jobs/${id}`)
      .then(({ data }) => { if (alive) setFetched({ job: data.job, error: '', forId: id }); })
      .catch((err) => { if (alive) setFetched({ job: null, error: err.message, forId: id }); });
    return () => { alive = false; };
  }, [id]);

  const toggleFavorite = async () => {
    setFavBusy(true);
    try {
      const { data } = await api.post(`/favorites/${job.id}/toggle`);
      setJob((j) => ({ ...j, isFavorite: data.isFavorite }));
      toast.success(data.isFavorite ? 'Saved to favorites' : 'Removed from favorites');
    } catch (err) {
      toast.error('Could not update favorites', err.message);
    } finally {
      setFavBusy(false);
    }
  };

  const submitApplication = async () => {
    setApplyError('');
    setApplying(true);
    try {
      await api.post(`/applications/jobs/${job.id}`, { coverLetter: coverLetter.trim() });
      setJob((j) => ({ ...j, hasApplied: true }));
      setApplyOpen(false);
      setCoverLetter('');
      toast.success('Application sent', 'You can follow it under “My applications”.');
    } catch (err) {
      if (err.code === 'CV_REQUIRED') {
        setApplyError('Upload your CV in the profile first.');
      } else {
        setApplyError(err.message);
      }
    } finally {
      setApplying(false);
    }
  };

  if (loading) return <div className="page"><PageLoader label="Loading the job…" /></div>;

  if (error || !job) {
    return (
      <div className="page page--narrow">
        <EmptyState
          icon="🚫"
          title="Job not available"
          text={error || 'It may have been closed or removed by the employer.'}
          action={<Link to="/jobs" className="btn btn--primary">Browse jobs</Link>}
        />
      </div>
    );
  }

  const company = job.provider?.companyName || job.provider?.name || 'Unknown company';

  return (
    <div className="page">
      <Link to="/jobs" className="small" style={{ display: 'inline-block', marginBottom: 14 }}>
        ← Back to jobs
      </Link>

      <div className="layout-split">
        <main className="layout-split__main">
          <div className="card">
            <div className="job-detail__head">
              <Avatar name={company} src={job.provider?.avatarUrl} size={66} square />
              <div style={{ flex: 1, minWidth: 220 }}>
                <h1 style={{ fontSize: 25 }}>{job.title}</h1>
                <div className="row" style={{ marginTop: 7, gap: 8 }}>
                  <Link to={`/companies/${job.providerId}`}>{company}</Link>
                  <VerifiedBadge status={job.provider?.verificationStatus} />
                  <span className="muted small">· {job.location}</span>
                  <span className="muted small">· {timeAgo(job.createdAt)}</span>
                </div>
                <div className="chip-list" style={{ marginTop: 11 }}>
                  <Badge variant="brand">{LABEL[job.category] || job.category}</Badge>
                  <Badge>{LABEL[job.employmentType]}</Badge>
                  <Badge>{LABEL[job.workMode]}</Badge>
                  {job.status === 'CLOSED' && <Badge variant="danger">Closed</Badge>}
                </div>
              </div>
            </div>

            <div className="spec-grid">
              <div className="spec">
                <div className="spec__label">Salary</div>
                <div className="spec__value">{salaryText(job)}</div>
              </div>
              <div className="spec">
                <div className="spec__label">Experience</div>
                <div className="spec__value">{experienceText(job)}</div>
              </div>
              <div className="spec">
                <div className="spec__label">Work mode</div>
                <div className="spec__value">{LABEL[job.workMode]}</div>
              </div>
              <div className="spec">
                <div className="spec__label">Views</div>
                <div className="spec__value">{job.views ?? 0}</div>
              </div>
            </div>

            <h3 style={{ marginBottom: 10 }}>About the role</h3>
            <p className="job-detail__body">{job.description}</p>

            {job.skills?.length > 0 && (
              <>
                <h3 style={{ margin: '22px 0 10px' }}>Skills</h3>
                <div className="chip-list">
                  {job.skills.map((s) => <Badge key={s} variant="brand">{s}</Badge>)}
                </div>
              </>
            )}
          </div>
        </main>

        <aside className="layout-split__side">
          <div className="card">
            <h3 style={{ marginBottom: 14 }}>Interested?</h3>

            {!user && (
              <>
                <p className="small muted" style={{ marginBottom: 14 }}>
                  Sign in as a job seeker to apply for this role.
                </p>
                <Link to="/login" className="btn btn--primary btn--block">Sign in to apply</Link>
              </>
            )}

            {isOwner && (
              <>
                <div className="alert alert--info" role="status">
                  <span className="alert__icon" aria-hidden="true">ℹ</span>
                  <span>This is your own listing.</span>
                </div>
                <div className="stack">
                  <Link to={`/provider/jobs/${job.id}/edit`} className="btn btn--ghost btn--block">
                    Edit listing
                  </Link>
                  <Link to={`/provider/jobs/${job.id}/applicants`} className="btn btn--primary btn--block">
                    View applicants
                  </Link>
                </div>
              </>
            )}

            {user && !isOwner && !isWorker && (
              <p className="small muted">
                You are signed in as an employer, so you cannot apply to jobs.
              </p>
            )}

            {isWorker && (
              <div className="stack">
                {job.hasApplied ? (
                  <>
                    <div className="alert alert--success" role="status" style={{ marginBottom: 0 }}>
                      <span className="alert__icon" aria-hidden="true">✓</span>
                      <span>You already applied to this job.</span>
                    </div>
                    <Link to="/applications" className="btn btn--ghost btn--block">
                      See my applications
                    </Link>
                  </>
                ) : job.status !== 'ACTIVE' ? (
                  <p className="small muted">This job is closed and no longer accepting applications.</p>
                ) : (
                  <button className="btn btn--primary btn--block" onClick={() => setApplyOpen(true)}>
                    Apply now
                  </button>
                )}

                <button
                  className={`btn btn--subtle btn--block${job.isFavorite ? ' is-on' : ''}`}
                  onClick={toggleFavorite}
                  disabled={favBusy}
                >
                  {favBusy ? <Spinner /> : <span aria-hidden="true">{job.isFavorite ? '♥' : '♡'}</span>}
                  {job.isFavorite ? 'Saved' : 'Save to favorites'}
                </button>

                {!user.cvUrl && (
                  <p className="tiny muted">
                    You need a CV on file to apply. <Link to="/profile">Upload it here.</Link>
                  </p>
                )}
              </div>
            )}
          </div>

          <div className="card" style={{ marginTop: 18 }}>
            <h3 style={{ marginBottom: 12 }}>About the company</h3>
            <div className="row" style={{ marginBottom: 10 }}>
              <Avatar name={company} src={job.provider?.avatarUrl} size={42} square />
              <div>
                <div style={{ fontWeight: 700, fontSize: 14 }}>{company}</div>
                <div className="tiny muted">{job.provider?.location || job.location}</div>
              </div>
            </div>
            <Link to={`/companies/${job.providerId}`} className="btn btn--subtle btn--block btn--sm">
              View company profile
            </Link>
          </div>
        </aside>
      </div>

      <Modal
        open={applyOpen}
        title={`Apply for ${job.title}`}
        onClose={() => { setApplyOpen(false); setApplyError(''); }}
        actions={
          <>
            <button className="btn btn--subtle" onClick={() => setApplyOpen(false)} disabled={applying}>
              Cancel
            </button>
            <button className="btn btn--primary" onClick={submitApplication} disabled={applying}>
              {applying ? <Spinner onPrimary /> : null}
              {applying ? 'Sending…' : 'Send application'}
            </button>
          </>
        }
      >
        {applyError && (
          <div className="alert alert--error" role="alert">
            <span className="alert__icon" aria-hidden="true">⚠</span>
            <div style={{ flex: 1 }}>
              {applyError}{' '}
              {applyError.includes('CV') && <Link to="/profile">Go to profile</Link>}
            </div>
          </div>
        )}

        <div className="field">
          <label className="field__label" htmlFor="cover">Cover letter (optional)</label>
          <textarea
            id="cover" className="textarea" rows="7" maxLength={4000}
            placeholder="Why are you a good fit for this role?"
            value={coverLetter} onChange={(e) => setCoverLetter(e.target.value)}
            disabled={applying}
          />
          <span className="field__hint">{coverLetter.length} / 4000</span>
        </div>

        <p className="small muted" style={{ marginTop: 12 }}>
          Your CV {user?.cvUrl ? 'on file' : '(missing)'} will be attached to this application.
        </p>
      </Modal>
    </div>
  );
};
export default JobDetails;
