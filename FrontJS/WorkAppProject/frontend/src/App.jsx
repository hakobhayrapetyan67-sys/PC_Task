import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import useAuthStore from './store/authStore';
import ProtectedRoute from './components/ProtectedRoute';
import AppLayout from './components/AppLayout';
import Toaster from './components/Toaster';

import Login from './pages/Login';
import Register from './pages/Register';
import VerifyEmail from './pages/VerifyEmail';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';

import Jobs from './pages/Jobs';
import JobDetails from './pages/JobDetails';
import MyApplications from './pages/MyApplications';
import Favorites from './pages/Favorites';
import Profile from './pages/Profile';
import Messages from './pages/Messages';
import CompanyProfile from './pages/CompanyProfile';

import ProviderJobs from './pages/ProviderJobs';
import JobForm from './pages/JobForm';
import JobApplicants from './pages/JobApplicants';
import Verification from './pages/Verification';

import NotFound from './pages/NotFound';

const RoleHome = () => {
  const user = useAuthStore((s) => s.user);
  return <Navigate to={user?.role === 'PROVIDER' ? '/provider/jobs' : '/jobs'} replace />;
};

const PublicOnly = ({ children }) => {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const booting = useAuthStore((s) => s.booting);
  if (booting) return null;
  return isAuthenticated ? <RoleHome /> : children;
};

function App() {
  const bootstrap = useAuthStore((s) => s.bootstrap);

  useEffect(() => { bootstrap(); }, [bootstrap]);

  return (
    <BrowserRouter>
      <Toaster />
      <Routes>
        {/* ---------- public ---------- */}
        <Route path="/login" element={<PublicOnly><Login /></PublicOnly>} />
        <Route path="/register" element={<PublicOnly><Register /></PublicOnly>} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/forgot-password" element={<PublicOnly><ForgotPassword /></PublicOnly>} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* ---------- signed in (any role) ---------- */}
        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/jobs" element={<Jobs />} />
            <Route path="/jobs/:id" element={<JobDetails />} />
            <Route path="/companies/:id" element={<CompanyProfile />} />
            <Route path="/profile" element={<Profile />} />
            {/* Both roles share the chat; the server decides who may read what. */}
            <Route path="/messages" element={<Messages />} />
            <Route path="/messages/:id" element={<Messages />} />
          </Route>
        </Route>

        {/* ---------- job seeker only ---------- */}
        <Route element={<ProtectedRoute allowedRoles={['WORKER']} />}>
          <Route element={<AppLayout />}>
            <Route path="/applications" element={<MyApplications />} />
            <Route path="/favorites" element={<Favorites />} />
          </Route>
        </Route>

        {/* ---------- employer only ---------- */}
        <Route element={<ProtectedRoute allowedRoles={['PROVIDER']} />}>
          <Route element={<AppLayout />}>
            <Route path="/provider/jobs" element={<ProviderJobs />} />
            <Route path="/provider/jobs/new" element={<JobForm />} />
            <Route path="/provider/jobs/:id/edit" element={<JobForm />} />
            <Route path="/provider/jobs/:id/applicants" element={<JobApplicants />} />
            <Route path="/provider/applicants" element={<JobApplicants />} />
            <Route path="/provider/verification" element={<Verification />} />
          </Route>
        </Route>

        {/* ---------- fallbacks ---------- */}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<RoleHome />} />
          <Route element={<AppLayout />}>
            <Route path="*" element={<NotFound />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
