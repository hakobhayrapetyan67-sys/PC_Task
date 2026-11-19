import { Link } from 'react-router-dom';
import useAuthStore from '../store/authStore';

const NotFound = () => {
  const user = useAuthStore((s) => s.user);
  const home = !user ? '/login' : user.role === 'PROVIDER' ? '/provider/jobs' : '/jobs';

  return (
    <div className="page page--narrow">
      <div className="card" style={{ textAlign: 'center', padding: '60px 24px' }}>
        <div style={{ fontSize: 46 }} aria-hidden="true">🧭</div>
        <h1 style={{ fontSize: 24, margin: '12px 0 8px' }}>Page not found</h1>
        <p className="muted small" style={{ marginBottom: 22 }}>
          The address you opened does not exist in this app.
        </p>
        <Link to={home} className="btn btn--primary">Go back</Link>
      </div>
    </div>
  );
};
export default NotFound;
