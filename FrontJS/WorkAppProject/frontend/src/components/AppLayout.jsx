import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import EmailVerifyBanner from './EmailVerifyBanner';

const AppLayout = () => (
  <div className="app-shell">
    <Navbar />
    <EmailVerifyBanner />
    <Outlet />
  </div>
);
export default AppLayout;
