import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../api/axios';
import useJobStore from '../store/jobStore';
import useAuthStore from '../store/authStore';
import useUiStore from '../store/uiStore';
import JobCard from '../components/JobCard';
import EmptyState from '../components/EmptyState';
import Pagination from '../components/Pagination';

const POPULAR = ['React Developer', 'UI/UX Designer', 'Product Manager', 'DevOps'];

const LABEL = {
  IT: 'IT / Software', DESIGN: 'Design', MARKETING: 'Marketing',
  SALES: 'Sales', FINANCE: 'Finance', OTHER: 'Other',
  FULL_TIME: 'Full-time', PART_TIME: 'Part-time', CONTRACT: 'Contract', INTERNSHIP: 'Internship',
  ONSITE: 'On-site', HYBRID: 'Hybrid', REMOTE: 'Remote',
};

const Jobs = () => {
  const jobs = useJobStore((s) => s.jobs);
  const total = useJobStore((s) => s.total);
  const page = useJobStore((s) => s.page);
  const totalPages = useJobStore((s) => s.totalPages);
  const loading = useJobStore((s) => s.loading);
  const error = useJobStore((s) => s.error);
  const filters = useJobStore((s) => s.filters);
  const setFilter = useJobStore((s) => s.setFilter);
  const resetFilters = useJobStore((s) => s.resetFilters);
  const fetchJobs = useJobStore((s) => s.fetchJobs);
  const fetchMeta = useJobStore((s) => s.fetchMeta);
  const meta = useJobStore((s) => s.meta);
  const patchJobLocally = useJobStore((s) => s.patchJobLocally);

  const user = useAuthStore((s) => s.user);
  const toastError = useUiStore((s) => s.error);
  const isWorker = user?.role === 'WORKER';

  const [searchParams, setSearchParams] = useSearchParams();
  const [heroQuery, setHeroQuery] = useState(searchParams.get('search') || '');
  const [favoriteBusy, setFavoriteBusy] = useState(null);

  useEffect(() => { fetchMeta(); }, [fetchMeta]);

  useEffect(() => {
    const fromUrl = {};
    for (const key of ['search', 'category', 'location', 'workMode', 'employmentType', 'minSalary', 'maxSalary', 'sort']) {
      const v = searchParams.get(key);
      if (v) fromUrl[key] = v;
    }
    if (Object.keys(fromUrl).length) setFilter(fromUrl);
    fetchJobs(Number(searchParams.get('page')) || 1);
  }, []);

  const runSearch = (patch = {}, nextPage = 1) => {
    const next = { ...filters, ...patch };
    setFilter(patch);
    const params = { ...next, page: String(nextPage) };
    setSearchParams(
      Object.fromEntries(Object.entries(params).filter(([, v]) => v && v !== 'newest' && v !== '1'))
    );
    fetchJobs(nextPage);
  };

  const handleReset = () => {
    resetFilters();
    setHeroQuery('');
    setSearchParams({});
    fetchJobs(1);
  };

  const toggleFavorite = async (job) => {
    if (!isWorker) return;
    setFavoriteBusy(job.id);
    patchJobLocally(job.id, { isFavorite: !job.isFavorite });
    try {
      const { data } = await api.post(`/favorites/${job.id}/toggle`);
      patchJobLocally(job.id, { isFavorite: data.isFavorite });
    } catch (err) {
      patchJobLocally(job.id, { isFavorite: job.isFavorite });
      toastError('Could not update favorites', err.message);
    } finally {
      setFavoriteBusy(null);
    }
  };

  const activeFilterCount = Object.entries(filters).filter(
    ([k, v]) => v && !(k === 'sort' && v === 'newest')
  ).length;

  return (
    <>
      <section className="hero">
        <h1>New opportunities for <em>your career</em></h1>
        <p>Find a role that matches your skills and goals among Armenia's leading employers.</p>

        <form
          className="hero__search"
          onSubmit={(e) => { e.preventDefault(); runSearch({ search: heroQuery }); }}
        >
          <label className="sr-only" htmlFor="hero-search">Search jobs</label>
          <input
            id="hero-search" type="search" placeholder="Job title, skill or company…"
            value={heroQuery} onChange={(e) => setHeroQuery(e.target.value)}
          />
          <button type="submit" className="btn btn--primary">Search</button>
        </form>

        <div className="hero__tags">
          <span className="small muted">Popular:</span>
          {POPULAR.map((tag) => (
            <button
              key={tag} type="button"
              onClick={() => { setHeroQuery(tag); runSearch({ search: tag }); }}
            >
              {tag}
            </button>
          ))}
        </div>
      </section>

      <div className="page">
        <div className="layout-split">
          <aside className="layout-split__side">
            <div className="card">
              <div className="card__head" style={{ marginBottom: 14, paddingBottom: 12 }}>
                <h3>Filters</h3>
                {activeFilterCount > 0 && <span className="badge badge--brand">{activeFilterCount}</span>}
              </div>

              <div className="stack">
                <div className="field">
                  <label className="field__label" htmlFor="f-search">Keyword</label>
                  <input
                    id="f-search" className="input" type="text" placeholder="Title or skill…"
                    value={filters.search}
                    onChange={(e) => { setFilter({ search: e.target.value }); setHeroQuery(e.target.value); }}
                    onKeyDown={(e) => { if (e.key === 'Enter') runSearch({}); }}
                  />
                </div>

                <div className="field">
                  <label className="field__label" htmlFor="f-category">Category</label>
                  <select
                    id="f-category" className="select" value={filters.category}
                    onChange={(e) => runSearch({ category: e.target.value })}
                  >
                    <option value="">All categories</option>
                    {(meta.categories || []).map((c) => (
                      <option key={c} value={c}>{LABEL[c] || c}</option>
                    ))}
                  </select>
                </div>

                <div className="field">
                  <label className="field__label" htmlFor="f-location">Location</label>
                  <select
                    id="f-location" className="select" value={filters.location}
                    onChange={(e) => runSearch({ location: e.target.value })}
                  >
                    <option value="">Anywhere</option>
                    {(meta.locations || []).map((l) => <option key={l} value={l}>{l}</option>)}
                  </select>
                </div>

                <div className="field">
                  <label className="field__label" htmlFor="f-workmode">Work mode</label>
                  <select
                    id="f-workmode" className="select" value={filters.workMode}
                    onChange={(e) => runSearch({ workMode: e.target.value })}
                  >
                    <option value="">Any</option>
                    {(meta.workModes || []).map((w) => (
                      <option key={w} value={w}>{LABEL[w] || w}</option>
                    ))}
                  </select>
                </div>

                <div className="field">
                  <label className="field__label" htmlFor="f-type">Employment type</label>
                  <select
                    id="f-type" className="select" value={filters.employmentType}
                    onChange={(e) => runSearch({ employmentType: e.target.value })}
                  >
                    <option value="">Any</option>
                    {(meta.employmentTypes || []).map((t) => (
                      <option key={t} value={t}>{LABEL[t] || t}</option>
                    ))}
                  </select>
                </div>

                <div className="field">
                  <span className="field__label">Salary, $ / month</span>
                  <div className="field-row">
                    <input
                      className="input" type="number" min="0" placeholder="From"
                      value={filters.minSalary}
                      onChange={(e) => setFilter({ minSalary: e.target.value })}
                      onBlur={() => runSearch({})}
                      aria-label="Minimum salary"
                    />
                    <input
                      className="input" type="number" min="0" placeholder="To"
                      value={filters.maxSalary}
                      onChange={(e) => setFilter({ maxSalary: e.target.value })}
                      onBlur={() => runSearch({})}
                      aria-label="Maximum salary"
                    />
                  </div>
                </div>

                <button type="button" className="btn btn--primary btn--block" onClick={() => runSearch({})}>
                  Apply filters
                </button>
                <button type="button" className="btn btn--subtle btn--block" onClick={handleReset}>
                  Reset
                </button>
              </div>
            </div>
          </aside>

          <main className="layout-split__main">
            <div className="row row--between" style={{ marginBottom: 18 }}>
              <div>
                <h2>Available jobs</h2>
                <p className="small muted" style={{ marginTop: 3 }}>
                  {loading ? 'Loading…' : `${total} listing${total === 1 ? '' : 's'} found`}
                </p>
              </div>
              <div className="field" style={{ minWidth: 190 }}>
                <label className="sr-only" htmlFor="f-sort">Sort by</label>
                <select
                  id="f-sort" className="select" value={filters.sort}
                  onChange={(e) => runSearch({ sort: e.target.value })}
                >
                  <option value="newest">Newest first</option>
                  <option value="oldest">Oldest first</option>
                  <option value="salary_desc">Highest salary</option>
                  <option value="salary_asc">Lowest salary</option>
                </select>
              </div>
            </div>

            {error && (
              <div className="alert alert--error" role="alert">
                <span className="alert__icon" aria-hidden="true">⚠</span>
                <div style={{ flex: 1 }}>{error}</div>
                <button className="btn btn--subtle btn--sm" onClick={() => fetchJobs(page)}>Retry</button>
              </div>
            )}

            <div className="job-grid">
              {loading && [0, 1, 2, 3].map((i) => <div key={i} className="skeleton skeleton--card" />)}

              {!loading && jobs.map((job) => (
                <JobCard
                  key={job.id}
                  job={job}
                  onToggleFavorite={isWorker ? toggleFavorite : undefined}
                  favoriteBusy={favoriteBusy === job.id}
                />
              ))}

              {!loading && !error && jobs.length === 0 && (
                <EmptyState
                  icon="🔍"
                  title="No jobs match your search"
                  text="Try a different keyword, or clear the filters to see everything."
                  action={
                    <button className="btn btn--primary" onClick={handleReset}>Clear filters</button>
                  }
                />
              )}
            </div>

            {!loading && <Pagination page={page} totalPages={totalPages} onChange={(p) => runSearch({}, p)} />}
          </main>
        </div>
      </div>
    </>
  );
};
export default Jobs;
