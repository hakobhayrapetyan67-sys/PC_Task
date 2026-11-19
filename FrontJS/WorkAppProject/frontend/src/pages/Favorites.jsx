import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import useUiStore from '../store/uiStore';
import JobCard from '../components/JobCard';
import EmptyState from '../components/EmptyState';

const Favorites = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(null);
  const toast = useUiStore();

  const load = async () => {
    try {
      const { data } = await api.get('/favorites');
      setJobs(data.jobs);
      setError('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const remove = async (job) => {
    setBusy(job.id);
    const snapshot = jobs;
    setJobs((list) => list.filter((j) => j.id !== job.id));
    try {
      await api.delete(`/favorites/${job.id}`);
      toast.success('Removed from favorites');
    } catch (err) {
      setJobs(snapshot); // roll back
      toast.error('Could not remove', err.message);
    } finally {
      setBusy(null);
    }
  };

  return (
    <div className="page">
      <div className="page__head">
        <h1 className="page__title">Favorites</h1>
        <p className="page__sub">
          {loading ? 'Loading…' : `${jobs.length} saved job${jobs.length === 1 ? '' : 's'}`}
        </p>
      </div>

      {error && (
        <div className="alert alert--error" role="alert">
          <span className="alert__icon" aria-hidden="true">⚠</span>
          <div style={{ flex: 1 }}>{error}</div>
          <button className="btn btn--subtle btn--sm" onClick={() => { setLoading(true); load(); }}>Retry</button>
        </div>
      )}

      <div className="job-grid">
        {loading && [0, 1, 2].map((i) => <div key={i} className="skeleton skeleton--card" />)}

        {!loading && jobs.map((job) => (
          <JobCard key={job.id} job={job} onToggleFavorite={remove} favoriteBusy={busy === job.id} />
        ))}

        {!loading && !error && jobs.length === 0 && (
          <EmptyState
            icon="♡"
            title="No saved jobs"
            text="Tap the heart on any listing and it will be waiting for you here."
            action={<Link to="/jobs" className="btn btn--primary">Browse jobs</Link>}
          />
        )}
      </div>
    </div>
  );
};
export default Favorites;
