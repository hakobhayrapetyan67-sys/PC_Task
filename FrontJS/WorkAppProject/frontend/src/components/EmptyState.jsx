const EmptyState = ({ icon = '📭', title, text, action }) => (
  <div className="empty">
    <div className="empty__icon" aria-hidden="true">{icon}</div>
    <div className="empty__title">{title}</div>
    {text && <p className="empty__text">{text}</p>}
    {action}
  </div>
);
export default EmptyState;
