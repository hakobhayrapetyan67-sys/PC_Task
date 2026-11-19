import useUiStore from '../store/uiStore';

const Toaster = () => {
  const toasts = useUiStore((s) => s.toasts);
  const dismiss = useUiStore((s) => s.dismiss);

  if (!toasts.length) return null;

  return (
    <div className="toaster" role="region" aria-label="Notifications">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`toast toast--${t.variant}`}
          role={t.variant === 'error' ? 'alert' : 'status'}
        >
          <div className="toast__body">
            <div className="toast__title">{t.title}</div>
            {t.text && <div className="toast__text">{t.text}</div>}
          </div>
          <button className="toast__close" onClick={() => dismiss(t.id)} aria-label="Dismiss">
            ×
          </button>
        </div>
      ))}
    </div>
  );
};
export default Toaster;
