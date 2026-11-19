import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useNotificationStore from '../store/notificationStore';
import { timeAgo } from './JobCard';

const NotificationBell = () => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const navigate = useNavigate();

  const notifications = useNotificationStore((s) => s.notifications);
  const unread = useNotificationStore((s) => s.unread);
  const fetch = useNotificationStore((s) => s.fetch);
  const markRead = useNotificationStore((s) => s.markRead);
  const markAllRead = useNotificationStore((s) => s.markAllRead);

  useEffect(() => {
    fetch();
    const timer = setInterval(fetch, 60000);
    return () => clearInterval(timer);
  }, [fetch]);

  useEffect(() => {
    if (!open) return undefined;
    const onDown = (e) => { if (!ref.current?.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, [open]);

  const openNotification = (n) => {
    if (!n.readAt) markRead(n.id);
    setOpen(false);
    if (n.link) navigate(n.link);
  };

  return (
    <div className="bell" ref={ref}>
      <button
        type="button"
        className="icon-btn"
        onClick={() => setOpen((v) => !v)}
        aria-label={`Notifications${unread ? ` (${unread} unread)` : ''}`}
        aria-expanded={open}
      >
        🔔
        {unread > 0 && <span className="bell__dot">{unread > 9 ? '9+' : unread}</span>}
      </button>

      {open && (
        <div className="bell__panel">
          <div className="bell__head">
            <strong style={{ fontSize: 14 }}>Notifications</strong>
            {unread > 0 && (
              <button className="btn btn--subtle btn--sm" onClick={markAllRead}>
                Mark all read
              </button>
            )}
          </div>

          {notifications.length === 0 ? (
            <p className="muted small" style={{ padding: '22px 14px', textAlign: 'center' }}>
              Nothing yet.
            </p>
          ) : (
            notifications.map((n) => (
              <button
                key={n.id}
                type="button"
                className={`notif${!n.readAt ? ' is-unread' : ''}`}
                style={{ width: '100%', textAlign: 'left', background: 'none', border: 'none', borderBottom: '1px solid var(--wx-border)', cursor: 'pointer' }}
                onClick={() => openNotification(n)}
              >
                <div className="notif__title">{n.title}</div>
                {n.body && <div className="notif__body">{n.body}</div>}
                <div className="notif__time">{timeAgo(n.createdAt)}</div>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
};
export default NotificationBell;
