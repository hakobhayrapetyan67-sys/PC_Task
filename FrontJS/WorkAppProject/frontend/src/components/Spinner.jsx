export const Spinner = ({ size, onPrimary = false }) => (
  <span
    className={`spinner${size === 'lg' ? ' spinner--lg' : ''}${onPrimary ? ' spinner--on-primary' : ''}`}
    role="status"
    aria-label="Loading"
  />
);

export const PageLoader = ({ label = 'Loading…' }) => (
  <div className="center-state">
    <Spinner size="lg" />
    <span className="small">{label}</span>
  </div>
);

export default Spinner;
