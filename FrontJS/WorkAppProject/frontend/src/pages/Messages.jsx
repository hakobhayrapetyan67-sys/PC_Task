import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import useChatStore from '../store/chatStore';
import useAuthStore from '../store/authStore';
import ChatWindow from '../components/ChatWindow';
import Avatar from '../components/Avatar';
import EmptyState from '../components/EmptyState';
import { timeAgo } from '../components/JobCard';

const Messages = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const me = useAuthStore((s) => s.user);

  const conversations = useChatStore((s) => s.conversations);
  const activeId = useChatStore((s) => s.activeId);
  const fetchConversations = useChatStore((s) => s.fetchConversations);
  const openConversation = useChatStore((s) => s.openConversation);
  const error = useChatStore((s) => s.error);

  useEffect(() => { fetchConversations(); }, [fetchConversations]);

  useEffect(() => {
    const timer = setInterval(fetchConversations, 15000);
    return () => clearInterval(timer);
  }, [fetchConversations]);

  useEffect(() => {
    const numeric = Number(id);
    if (!Number.isInteger(numeric) || numeric <= 0) return;
    if (numeric === activeId) return;
    openConversation(numeric).catch(() => navigate('/messages', { replace: true }));
  }, [id, activeId, openConversation, navigate]);

  const isWorker = me?.role === 'WORKER';

  return (
    <div className="page">
      <div className="page__head">
        <h1 className="page__title">Messages</h1>
        <p className="page__sub">
          {isWorker
            ? 'Talk to employers about the jobs you applied to.'
            : 'Talk to the candidates who applied to your jobs.'}
        </p>
      </div>

      {error && (
        <div className="alert alert--error" role="alert">
          <span className="alert__icon" aria-hidden="true">⚠</span>
          <div style={{ flex: 1 }}>{error}</div>
          <button className="btn btn--subtle btn--sm" onClick={fetchConversations}>Retry</button>
        </div>
      )}

      <div className="chat-layout">
        <aside className="chat-list">
          {conversations.length === 0 ? (
            <EmptyState
              icon="💬"
              title="No conversations yet"
              text={
                isWorker
                  ? 'Apply to a job, then open it and press “Message employer”.'
                  : 'Open a job’s applicants and press “Message” next to a candidate.'
              }
            />
          ) : (
            conversations.map((c) => {
              const name = c.withUser?.companyName || c.withUser?.name;
              return (
                <button
                  key={c.id}
                  type="button"
                  className={`chat-list__item${c.id === activeId ? ' is-active' : ''}`}
                  onClick={() => navigate(`/messages/${c.id}`)}
                >
                  <Avatar name={name} src={c.withUser?.avatarUrl} size={42} />
                  <div className="chat-list__text">
                    <div className="chat-list__top">
                      <span className="chat-list__name">{name}</span>
                      <span className="chat-list__time">{timeAgo(c.lastMessageAt)}</span>
                    </div>
                    <div className="chat-list__job">{c.job?.title}</div>
                    <div className="chat-list__preview">
                      {c.lastMessage
                        ? (c.lastMessage.body || `📎 ${c.lastMessage.attachment?.name ?? 'file'}`)
                        : 'No messages yet'}
                    </div>
                  </div>
                  {c.unread > 0 && <span className="chat-list__badge">{c.unread > 9 ? '9+' : c.unread}</span>}
                </button>
              );
            })
          )}
        </aside>

        <ChatWindow />
      </div>
    </div>
  );
};

export default Messages;
