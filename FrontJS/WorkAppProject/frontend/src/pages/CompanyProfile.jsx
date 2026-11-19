import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '../api/axios';
import Avatar from '../components/Avatar';
import Badge, { VerifiedBadge } from '../components/Badge';
import EmptyState from '../components/EmptyState';
import { PageLoader } from '../components/Spinner';

const CompanyProfile = () => {
  const { id } = useParams();
  const [fetched, setFetched] = useState({ data: null, error: '', forId: null });
  const data = fetched.forId === id ? fetched.data : null;
  const error = fetched.forId === id ? fetched.error : '';
  const loading = fetched.forId !== id;

  useEffect(() => {
    let alive = true;
    api
      .get(`/profile/public/${id}`)
      .then(({ data: payload }) => { if (alive) setFetched({ data: payload, error: '', forId: id }); })
      .catch((err) => { if (alive) setFetched({ data: null, error: err.message, forId: id }); });
    return () => { alive = false; };
  }, [id]);

  if (loading) return <div className="page"><PageLoader /></div>;

  if (error || !data) {
    return (
      <div className="page page--narrow">
        <EmptyState
          icon="🏢"
          title="Profile not found"
          text={error || 'This profile is no longer available.'}
          action={<Link to="/jobs" className="btn btn--primary">Browse jobs</Link>}
        />
      </div>
    );
  }

  const { user, activeJobs } = data;
  const name = user.companyName || user.name;
  const isCompany = user.role === 'PROVIDER';

  return (
    <div className="page page--narrow">
      <Link to="/jobs" className="small" style={{ display: 'inline-block', marginBottom: 14 }}>
        ← Back to jobs
      </Link>

      <div className="card">
        <div className="row" style={{ gap: 16, marginBottom: 18 }}>
          <Avatar name={name} src={user.avatarUrl} size={74} square={isCompany} />
          <div style={{ flex: 1, minWidth: 180 }}>
            <h1 style={{ fontSize: 23 }}>{name}</h1>
            <div className="row" style={{ marginTop: 6, gap: 8 }}>
              <Badge variant="brand">{isCompany ? 'Employer' : 'Job seeker'}</Badge>
              <VerifiedBadge status={user.verificationStatus} />
              {user.location && <span className="small muted">· {user.location}</span>}
            </div>
            {user.headline && <p className="small muted" style={{ marginTop: 7 }}>{user.headline}</p>}
          </div>
        </div>

        {isCompany && (
          <div className="spec-grid">
            <div className="spec">
              <div className="spec__label">Open jobs</div>
              <div className="spec__value">{activeJobs}</div>
            </div>
            {user.companySize && (
              <div className="spec">
                <div className="spec__label">Company size</div>
                <div className="spec__value">{user.companySize}</div>
              </div>
            )}
            {user.companyWebsite && (
              <div className="spec">
                <div className="spec__label">Website</div>
                <div className="spec__value" style={{ fontSize: 13.5 }}>
                  <a href={user.companyWebsite} target="_blank" rel="noreferrer noopener">
                    {user.companyWebsite.replace(/^https?:\/\//, '')}
                  </a>
                </div>
              </div>
            )}
          </div>
        )}

        {(user.companyAbout || user.bio) && (
          <>
            <h3 style={{ margin: '18px 0 10px' }}>About</h3>
            <p className="job-detail__body">{user.companyAbout || user.bio}</p>
          </>
        )}

        {user.skills?.length > 0 && (
          <>
            <h3 style={{ margin: '20px 0 10px' }}>Skills</h3>
            <div className="chip-list">
              {user.skills.map((s) => <Badge key={s} variant="brand">{s}</Badge>)}
            </div>
          </>
        )}

        {isCompany && activeJobs > 0 && (
          <Link to={`/jobs?search=${encodeURIComponent(name)}`} className="btn btn--primary" style={{ marginTop: 20 }}>
            See their {activeJobs} open job{activeJobs === 1 ? '' : 's'}
          </Link>
        )}
      </div>
    </div>
  );
};
export default CompanyProfile;
