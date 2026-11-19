import { useState } from 'react';
import useAuthStore from '../store/authStore';
import useUiStore from '../store/uiStore';
import Spinner from './Spinner';

const EmailVerifyBanner = () => {
  const user = useAuthStore((s) => s.user);
  const resend = useAuthStore((s) => s.resendVerification);
  const toastSuccess = useUiStore((s) => s.success);
  const toastError = useUiStore((s) => s.error);
  const [sending, setSending] = useState(false);

  if (!user || user.emailVerified) return null;

  const handleResend = async () => {
    setSending(true);
    try {
      const data = await resend();
      toastSuccess('Confirmation sent', `Check ${user.email}.`);
      // In dev the backend returns the link, so the flow is testable without SMTP.
      if (data?.devLink) console.info('[dev] confirmation link:', data.devLink);
    } catch (err) {
      toastError('Could not send', err.message);
    } finally {
      setSending(false);
    }
  };

  return (
    <div style={{ padding: '12px 28px 0' }}>
      <div className="alert alert--warn" style={{ marginBottom: 0 }}>
        <span className="alert__icon" aria-hidden="true">✉</span>
        <div style={{ flex: 1 }}>
          <strong>Confirm your email address.</strong>{' '}
          We sent a link to {user.email}. Until you confirm it you cannot
          {user.role === 'PROVIDER' ? ' publish jobs' : ' apply to jobs'}.
        </div>
        <button className="btn btn--subtle btn--sm" onClick={handleResend} disabled={sending}>
          {sending ? <Spinner /> : null}
          {sending ? 'Sending…' : 'Resend'}
        </button>
      </div>
    </div>
  );
};
export default EmailVerifyBanner;
