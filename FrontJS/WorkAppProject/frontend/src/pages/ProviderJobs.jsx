import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import useJobStore from '../store/jobStore';
import useAuthStore from '../store/authStore';
import useUiStore from '../store/uiStore';
import JobCard from '../components/JobCard';
import EmptyState from '../components/EmptyState';
import Modal from '../components/Modal';
import Spinner from '../components/Spinner';

const ProviderJobs = () => {
  const jobs = useJobStore((s) => s.jobs);
  const loading = useJobStore((s) => s.loading);
  const error = useJobStore((s) => s.error);
  const fetchMyJobs = useJobStore((s) => s.fetchMyJobs);
  const updateJob = useJobStore((s) => s.updateJob);
  const deleteJob = useJobStore((s) => s.deleteJob);

  const user = useAuthStore((s) => s.user);
  const toast = useUiStore();

  const [confirm, setConfirm] = useState(null);
  const [busy, setBusy] = useState(false);
  const [togglingId, setTogglingId] = useState(null);

  useEffect(() => { fetchMyJobs(); }, [fetchMyJobs]);

  const canPublish = user?.emailVerified && user?.verificationStatus === 'VERIFIED';

  const toggleStatus = async (job) => {
    setTogglingId(job.id);
    try {
      await updateJob(job.id, { status: job.status === 'ACTIVE' ? 'CLOSED' : 'ACTIVE' });
      toast.success(job.status === 'ACTIVE' ? 'Job closed' : 'Job reopened');
    } catch (err) {
      toast.error('Could not update the job', err.message);
    } finally {
      setTogglingId(null);
    }
  };

  const remove = async () => {
    setBusy(true);
    try {
      await deleteJob(confirm.id);
      toast.success('Job deleted', 'Its applications were removed too.');
      setConfirm(null);
    } catch (err) {
      toast.error('Could not delete', err.message);
    } finally {
      setBusy(false);
    }
  };

  const active = jobs.filter((j) => j.status === 'ACTIVE').length;
  const applicants = jobs.reduce((sum, j) => sum + (j.applicationsCount ?? 0), 0);

  return (
    <div className="page">
      <div className="row row--between" style={{ marginBottom: 22 }}>
        <div>
          <h1 className="page__title">My jobs</h1>
          <p className="page__sub">Publish, edit and close your listings.</p>
        </div>
        {canPublish ? (
          <Link to="/provider/jobs/new" className="btn btn--primary">+ Post a job</Link>
        ) : (
          <Link to="/provider/verification" className="btn btn--ghost">Get verified to post</Link>
        )}
      </div>

      {!canPublish && (
        <div className="alert alert--warn" role="status">
          <span className="alert__icon" aria-hidden="true">🛡</span>
          <div style={{ flex: 1 }}>
            <strong>Publishing is locked.</strong>{' '}
            {!user?.emailVerified
              ? 'Confirm your email address first.'
              : user?.verificationStatus === 'PENDING'
                ? 'Your company documents are under review.'
                : user?.verificationStatus === 'REJECTED'
                  ? `Your verification was rejected: ${user?.verificationNote || 'see details'}.`
                  : 'Submit your company documents to get verified.'}
          </div>
          <Link to="/provider/verification" className="btn btn--subtle btn--sm">Open verification</Link>
        </div>
      )}

      <div className="stat-row">
        <div className="stat">
          <div className="stat__value">{jobs.length}</div>
          <div className="stat__label">Total listings</div>
        </div>
        <div className="stat">
          <div className="stat__value">{active}</div>
          <div className="stat__label">Active</div>
        </div>
        <div className="stat">
          <div className="stat__value">{applicants}</div>
          <div className="stat__label">Applicants</div>
        </div>
      </div>

      {error && (
        <div className="alert alert--error" role="alert">
          <span className="alert__icon" aria-hidden="true">⚠</span>
          <div style={{ flex: 1 }}>{error}</div>
          <button className="btn btn--subtle btn--sm" onClick={fetchMyJobs}>Retry</button>
        </div>
      )}

      <div className="job-grid">
        {loading && [0, 1].map((i) => <div key={i} className="skeleton skeleton--card" />)}

        {!loading && jobs.map((job) => (
          <JobCard
            key={job.id}
            job={job}
            variant="own"
            actions={
              <>
                <Link to={`/provider/jobs/${job.id}/applicants`} className="btn btn--primary btn--sm" style={{ flex: 1 }}>
                  Applicants ({job.applicationsCount ?? 0})
                </Link>
                <Link to={`/provider/jobs/${job.id}/edit`} className="btn btn--subtle btn--sm">Edit</Link>
                <button
                  className="btn btn--subtle btn--sm"
                  onClick={() => toggleStatus(job)}
                  disabled={togglingId === job.id}
                  title={job.status === 'ACTIVE' ? 'Stop accepting applications' : 'Accept applications again'}
                >
                  {togglingId === job.id ? <Spinner /> : job.status === 'ACTIVE' ? 'Close' : 'Reopen'}
                </button>
                <button className="btn btn--danger btn--sm" onClick={() => setConfirm(job)}>Delete</button>
              </>
            }
          />
        ))}

        {!loading && !error && jobs.length === 0 && (
          <EmptyState
            icon="📢"
            title="No listings yet"
            text={
              canPublish
                ? 'Publish your first vacancy and it will appear on the public job board straight away.'
                : 'Once your company is verified you will be able to publish vacancies here.'
            }
            action={
              canPublish
                ? <Link to="/provider/jobs/new" className="btn btn--primary">Post a job</Link>
                : <Link to="/provider/verification" className="btn btn--primary">Get verified</Link>
            }
          />
        )}
      </div>

      <Modal
        open={Boolean(confirm)}
        title="Delete this job?"
        onClose={() => setConfirm(null)}
        actions={
          <>
            <button className="btn btn--subtle" onClick={() => setConfirm(null)} disabled={busy}>Cancel</button>
            <button className="btn btn--primary" onClick={remove} disabled={busy}>
              {busy ? <Spinner onPrimary /> : null}
              {busy ? 'Deleting…' : 'Delete permanently'}
            </button>
          </>
        }
      >
        <p className="small">
          <strong>{confirm?.title}</strong> will be removed along with its{' '}
          {confirm?.applicationsCount ?? 0} application(s). This cannot be undone — if you only
          want to stop receiving applications, use <strong>Close</strong> instead.
        </p>
      </Modal>
    </div>
  );
};
export default ProviderJobs;
