import { Link } from 'react-router-dom';
import Avatar from './Avatar';
import Badge, { VerifiedBadge } from './Badge';

const LABEL = {
  FULL_TIME: 'Full-time', PART_TIME: 'Part-time', CONTRACT: 'Contract', INTERNSHIP: 'Internship',
  ONSITE: 'On-site', HYBRID: 'Hybrid', REMOTE: 'Remote',
};

export const timeAgo = (iso) => {
  if (!iso) return 'just now';
  const diff = Date.now() - new Date(iso).getTime();
  if (Number.isNaN(diff)) return 'just now';
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins} min ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days} d ago`;
  const months = Math.floor(days / 30);
  return `${months} mo ago`;
};

export const salaryText = (job) => {
  const cur = job.currency === 'USD' ? '$' : `${job.currency} `;
  const fmt = (n) => `${cur}${Number(n).toLocaleString('en-US')}`;
  if (job.salaryMin && job.salaryMax) return `${fmt(job.salaryMin)} – ${fmt(job.salaryMax)}`;
  if (job.salaryMin) return `from ${fmt(job.salaryMin)}`;
  if (job.salaryMax) return `up to ${fmt(job.salaryMax)}`;
  return 'Negotiable';
};

export const experienceText = (job) => {
  if (job.experienceMin === 0 && !job.experienceMax) return 'No experience required';
  if (job.experienceMax) return `${job.experienceMin}–${job.experienceMax} years`;
  return `${job.experienceMin}+ years`;
};

const JobCard = ({ job, variant = 'public', onToggleFavorite, favoriteBusy, actions }) => {
  const company = job.provider?.companyName || job.provider?.name || 'Unknown company';
  const isOwn = variant === 'own';

  return (
    <article className="job-card">
      <header className="job-card__head">
        <Avatar name={company} src={job.provider?.avatarUrl} size={52} square />
        <div className="job-card__text">
          <Link to={`/jobs/${job.id}`} className="job-card__title">{job.title}</Link>
          <div className="job-card__company">
            <span>{isOwn ? 'Posted by you' : company}</span>
            <span aria-hidden="true">·</span>
            <span>{job.location}</span>
            {!isOwn && <VerifiedBadge status={job.provider?.verificationStatus} />}
          </div>
        </div>
        <div className="job-card__salary">
          {salaryText(job)}
          <small>per month</small>
        </div>
      </header>

      <p className="job-card__desc">{job.description}</p>

      <div className="job-card__meta">
        <span>🕒 {LABEL[job.employmentType] || job.employmentType}</span>
        <span>🏠 {LABEL[job.workMode] || job.workMode}</span>
        <span>📅 {timeAgo(job.createdAt)}</span>
        {isOwn && <span>👥 {job.applicationsCount ?? 0} applicants</span>}
      </div>

      <div className="chip-list" style={{ marginBottom: 16 }}>
        {isOwn && <Badge variant={job.status === 'ACTIVE' ? 'success' : 'default'}>
          {job.status === 'ACTIVE' ? 'Active' : 'Closed'}
        </Badge>}
        <Badge variant="brand">{experienceText(job)}</Badge>
        {(job.skills || []).slice(0, 3).map((s) => <Badge key={s}>{s}</Badge>)}
      </div>

      <div className="job-card__foot">
        {actions || (
          <>
            <Link
              to={`/jobs/${job.id}`}
              className={`btn ${job.hasApplied ? 'btn--ghost' : 'btn--primary'}`}
            >
              {job.hasApplied ? 'Applied ✓' : 'View & apply'}
            </Link>
            {onToggleFavorite && (
              <button
                type="button"
                className={`icon-btn${job.isFavorite ? ' is-on' : ''}`}
                onClick={() => onToggleFavorite(job)}
                disabled={favoriteBusy}
                aria-pressed={Boolean(job.isFavorite)}
                aria-label={job.isFavorite ? 'Remove from favorites' : 'Save to favorites'}
                title={job.isFavorite ? 'Remove from favorites' : 'Save to favorites'}
              >
                {job.isFavorite ? '♥' : '♡'}
              </button>
            )}
          </>
        )}
      </div>
    </article>
  );
};
export default JobCard;
