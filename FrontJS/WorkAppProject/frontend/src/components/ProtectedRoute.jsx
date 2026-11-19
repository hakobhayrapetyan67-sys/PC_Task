import { Navigate, Outlet, useLocation } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import { PageLoader } from './Spinner';

const ProtectedRoute = ({ allowedRoles }) => {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const booting = useAuthStore((s) => s.booting);
  const user = useAuthStore((s) => s.user);
  const location = useLocation();

  if (booting) return <PageLoader label="Checking your session…" />;

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace state={{ from: location.pathname + location.search }} />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <Navigate to={user?.role === 'PROVIDER' ? '/provider/jobs' : '/jobs'} replace />;
  }

  return <Outlet />;
};
export default ProtectedRoute;
