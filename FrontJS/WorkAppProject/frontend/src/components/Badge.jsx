const Badge = ({ variant = 'default', children }) => (
  <span className={`badge${variant === 'default' ? '' : ` badge--${variant}`}`}>{children}</span>
);

export const VerifiedBadge = ({ status, showPending = false }) => {
  if (status === 'VERIFIED') return <span className="badge badge--success">✓ Verified</span>;
  if (status === 'PENDING' && showPending) return <span className="badge badge--warn">⏳ Pending</span>;
  if (status === 'REJECTED' && showPending) return <span className="badge badge--danger">✕ Rejected</span>;
  return null;
};

const APPLICATION_VARIANT = {
  PENDING: 'warn', REVIEWED: 'info', ACCEPTED: 'success', REJECTED: 'danger',
};
const APPLICATION_LABEL = {
  PENDING: 'Pending', REVIEWED: 'Reviewed', ACCEPTED: 'Accepted', REJECTED: 'Declined',
};

export const StatusBadge = ({ status }) => (
  <span className={`badge badge--${APPLICATION_VARIANT[status] || 'default'}`}>
    {APPLICATION_LABEL[status] || status}
  </span>
);

export default Badge;
