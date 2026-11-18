import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import WorkerDashboard from './pages/WorkerDashboard';
import ProviderDashboard from './pages/ProviderDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import useAuthStore from './store/authStore';

function App() {
  const { user, isAuthenticated } = useAuthStore();

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route element={<ProtectedRoute />}>
          <Route 
            path="/dashboard" 
            element={
              isAuthenticated ? (
                user.role === 'WORKER' ? <Navigate to="/worker" replace /> : <Navigate to="/provider" replace />
              ) : <Navigate to="/login" replace />
            } 
          />
          
          <Route element={<ProtectedRoute allowedRoles={['WORKER']} />}>
            <Route path="/worker" element={<WorkerDashboard />} />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={['PROVIDER']} />}>
            <Route path="/provider" element={<ProviderDashboard />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
export default App;