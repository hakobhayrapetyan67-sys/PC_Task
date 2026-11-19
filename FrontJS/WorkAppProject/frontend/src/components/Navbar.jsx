import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import useNotificationStore from '../store/notificationStore';
import useChatStore from '../store/chatStore';
import useUiStore from '../store/uiStore';
import Logo from './Logo';
import Avatar from './Avatar';
import NotificationBell from './NotificationBell';
import { VerifiedBadge } from './Badge';

const Navbar = () => {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const resetNotifications = useNotificationStore((s) => s.reset);
  const chatUnread = useChatStore((s) => s.totalUnread);
  const fetchChatUnread = useChatStore((s) => s.fetchUnreadCount);
  const resetChat = useChatStore((s) => s.reset);
  const toastInfo = useUiStore((s) => s.info);
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    if (!menuOpen) return undefined;
    const onDown = (e) => { if (!menuRef.current?.contains(e.target)) setMenuOpen(false); };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, [menuOpen]);

  useEffect(() => {
    fetchChatUnread();
    const timer = setInterval(fetchChatUnread, 20000);
    return () => clearInterval(timer);
  }, [fetchChatUnread]);

  const isProvider = user?.role === 'PROVIDER';

  const handleLogout = async () => {
    setMenuOpen(false);
    await logout();
    resetNotifications();
    resetChat();
    toastInfo('Signed out', 'Your session was closed.');
    navigate('/login', { replace: true });
  };

  const links = isProvider
    ? [
        { to: '/provider/jobs', label: 'My jobs' },
        { to: '/provider/applicants', label: 'Applicants' },
        { to: '/messages', label: 'Messages', badge: chatUnread },
        { to: '/jobs', label: 'Browse jobs' },
        { to: '/provider/verification', label: 'Verification' },
      ]
    : [
        { to: '/jobs', label: 'Jobs' },
        { to: '/applications', label: 'My applications' },
        { to: '/messages', label: 'Messages', badge: chatUnread },
        { to: '/favorites', label: 'Favorites' },
      ];

  return (
    <nav className="navbar">
      <Link to={isProvider ? '/provider/jobs' : '/jobs'} className="navbar__brand">
        <Logo />
        workx.am
        <span className="brand-badge">Clone</span>
      </Link>

      <div className="navbar__links">
        {links.map((l) => (
          <NavLink key={l.to} to={l.to} className={({ isActive }) => (isActive ? 'is-active' : undefined)}>
            {l.label}
            {l.badge > 0 && <span className="nav-badge">{l.badge > 9 ? '9+' : l.badge}</span>}
          </NavLink>
        ))}
      </div>

      <div className="navbar__right">
        <span className="lang-pill">HY</span>
        <NotificationBell />

        <div className="user-menu" ref={menuRef}>
          <button
            type="button"
            className="user-menu__trigger"
            onClick={() => setMenuOpen((v) => !v)}
            aria-expanded={menuOpen}
            aria-haspopup="menu"
          >
            <Avatar name={user?.name} src={user?.avatarUrl} size={30} />
            <span className="user-name">{user?.name}</span>
            <span aria-hidden="true" style={{ fontSize: 10 }}>▾</span>
          </button>

          {menuOpen && (
            <div className="user-menu__panel" role="menu">
              <div className="user-menu__header">
                <div className="user-menu__name">{user?.name}</div>
                <div className="user-menu__email">{user?.email}</div>
                <div className="row" style={{ marginTop: 7, gap: 6 }}>
                  <span className="badge badge--brand">{isProvider ? 'Employer' : 'Job seeker'}</span>
                  {!user?.emailVerified && <span className="badge badge--warn">Email unconfirmed</span>}
                  {isProvider && <VerifiedBadge status={user?.verificationStatus} showPending />}
                </div>
              </div>

              <Link to="/messages" className="user-menu__item" role="menuitem" onClick={() => setMenuOpen(false)}>
                💬 Messages{chatUnread > 0 ? ` (${chatUnread})` : ''}
              </Link>
              <Link to="/profile" className="user-menu__item" role="menuitem" onClick={() => setMenuOpen(false)}>
                👤 Profile & settings
              </Link>
              {isProvider ? (
                <Link to="/provider/verification" className="user-menu__item" role="menuitem" onClick={() => setMenuOpen(false)}>
                  🛡 Company verification
                </Link>
              ) : (
                <Link to="/applications" className="user-menu__item" role="menuitem" onClick={() => setMenuOpen(false)}>
                  📄 My applications
                </Link>
              )}
              <button type="button" className="user-menu__item user-menu__item--danger" onClick={handleLogout} role="menuitem">
                ⎋ Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};
export default Navbar;
