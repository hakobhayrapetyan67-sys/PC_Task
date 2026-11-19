import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import useChatStore from '../store/chatStore';
import useAuthStore from '../store/authStore';
import useUiStore from '../store/uiStore';
import Avatar from './Avatar';
import Spinner from './Spinner';
import EmptyState from './EmptyState';
import EmojiPicker from './EmojiPicker';

const MAX_MB = 5;

const isImage = (type) => typeof type === 'string' && type.startsWith('image/');
const prettySize = (bytes) => {
  if (!bytes && bytes !== 0) return '';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
};
const clockOf = (iso) =>
  new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

const ChatWindow = () => {
  const me = useAuthStore((s) => s.user);
  const conversation = useChatStore((s) => s.conversation);
  const messages = useChatStore((s) => s.messages);
  const loading = useChatStore((s) => s.loadingThread);
  const sending = useChatStore((s) => s.sending);
  const activeId = useChatStore((s) => s.activeId);
  const sendMessage = useChatStore((s) => s.sendMessage);
  const pollNewMessages = useChatStore((s) => s.pollNewMessages);
  const toast = useUiStore();

  const [text, setText] = useState('');
  const [file, setFile] = useState(null);
  const [emojiOpen, setEmojiOpen] = useState(false);

  const listRef = useRef(null);
  const inputRef = useRef(null);
  const fileRef = useRef(null);

  // Poll for new messages while the thread is open. A WebSocket would be
  // nicer, but polling needs no extra server and survives a reconnect.
  useEffect(() => {
    if (!activeId) return undefined;
    const timer = setInterval(pollNewMessages, 4000);
    return () => clearInterval(timer);
  }, [activeId, pollNewMessages]);

  // Keep the newest message in view.
  useEffect(() => {
    const el = listRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages.length, activeId]);

  const insertEmoji = (emoji) => {
    const el = inputRef.current;
    if (!el) { setText((t) => t + emoji); return; }
    // Insert at the caret rather than always appending.
    const start = el.selectionStart ?? text.length;
    const end = el.selectionEnd ?? text.length;
    const next = text.slice(0, start) + emoji + text.slice(end);
    setText(next);
    requestAnimationFrame(() => {
      el.focus();
      const pos = start + emoji.length;
      el.setSelectionRange(pos, pos);
    });
  };

  const pickFile = (e) => {
    const picked = e.target.files?.[0];
    e.target.value = '';
    if (!picked) return;
    if (picked.size > MAX_MB * 1024 * 1024) {
      toast.error('File is too large', `Maximum size is ${MAX_MB} MB.`);
      return;
    }
    setFile(picked);
  };

  const submit = async (e) => {
    e.preventDefault();
    if (sending) return;
    const body = text.trim();
    if (!body && !file) return;

    try {
      await sendMessage({ body, file });
      setText('');
      setFile(null);
      setEmojiOpen(false);
    } catch (err) {
      toast.error('Message not sent', err.message);
    }
  };

  const onKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      submit(e);
    }
  };

  if (!activeId) {
    return (
      <div className="chat-window chat-window--empty">
        <EmptyState
          icon="💬"
          title="Pick a conversation"
          text="Your threads with employers and candidates appear on the left."
        />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="chat-window chat-window--empty">
        <div className="center-state"><Spinner size="lg" /><span className="small">Loading…</span></div>
      </div>
    );
  }

  const other = conversation?.withUser;

  return (
    <section className="chat-window">
      <header className="chat-header">
        <Avatar name={other?.companyName || other?.name} src={other?.avatarUrl} size={42} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="chat-header__name">{other?.companyName || other?.name}</div>
          {conversation?.job && (
            <div className="chat-header__sub">
              about <Link to={`/jobs/${conversation.job.id}`}>{conversation.job.title}</Link>
              {conversation.job.status === 'CLOSED' ? ' · closed' : ''}
            </div>
          )}
        </div>
      </header>

      <div className="chat-messages" ref={listRef}>
        {messages.length === 0 && (
          <p className="muted small" style={{ textAlign: 'center', padding: '40px 0' }}>
            No messages yet. Say hello 👋
          </p>
        )}

        {messages.map((m) => {
          const mine = m.senderId === me?.id;
          return (
            <div key={m.id} className={`bubble-row${mine ? ' bubble-row--mine' : ''}`}>
              {!mine && <Avatar name={m.sender?.companyName || m.sender?.name} src={m.sender?.avatarUrl} size={30} />}
              <div className={`bubble${mine ? ' bubble--mine' : ''}`}>
                {m.attachment && (
                  <a
                    className="bubble__file"
                    href={m.attachment.url}
                    target="_blank"
                    rel="noreferrer"
                    download={m.attachment.name}
                  >
                    {isImage(m.attachment.type) ? (
                      <img className="bubble__image" src={m.attachment.url} alt={m.attachment.name} loading="lazy" />
                    ) : (
                      <span className="bubble__fileline">
                        <span aria-hidden="true">📎</span>
                        <span className="bubble__filename">{m.attachment.name}</span>
                        <span className="bubble__filesize">{prettySize(m.attachment.size)}</span>
                      </span>
                    )}
                  </a>
                )}
                {m.body && <p className="bubble__text">{m.body}</p>}
                <span className="bubble__time">
                  {clockOf(m.createdAt)}
                  {mine && m.readAt ? ' · read' : ''}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {file && (
        <div className="chat-attachment">
          <span aria-hidden="true">📎</span>
          <span className="chat-attachment__name">{file.name}</span>
          <span className="muted tiny">{prettySize(file.size)}</span>
          <button type="button" className="toast__close" onClick={() => setFile(null)} aria-label="Remove attachment">
            ×
          </button>
        </div>
      )}

      <form className="chat-composer" onSubmit={submit}>
        <div className="chat-composer__tools">
          <button
            type="button"
            className={`icon-btn${emojiOpen ? ' is-on' : ''}`}
            onClick={() => setEmojiOpen((v) => !v)}
            aria-label="Insert an emoji"
            aria-expanded={emojiOpen}
            title="Emoji"
          >
            😊
          </button>
          <button
            type="button"
            className="icon-btn"
            onClick={() => fileRef.current?.click()}
            aria-label="Attach a file"
            title="Attach a file"
          >
            📎
          </button>
          <input
            ref={fileRef}
            type="file"
            hidden
            accept=".png,.jpg,.jpeg,.webp,.gif,.pdf,.txt,.doc,.docx,.xls,.xlsx,.zip"
            onChange={pickFile}
          />
        </div>

        <label className="sr-only" htmlFor="chat-input">Message</label>
        <textarea
          id="chat-input"
          ref={inputRef}
          className="chat-input"
          rows="1"
          maxLength={4000}
          placeholder="Write a message…  (Enter to send, Shift+Enter for a new line)"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={onKeyDown}
          disabled={sending}
        />

        <button type="submit" className="btn btn--primary btn--sm" disabled={sending || (!text.trim() && !file)}>
          {sending ? <Spinner onPrimary /> : null}
          {sending ? 'Sending…' : 'Send'}
        </button>

        {emojiOpen && <EmojiPicker onPick={insertEmoji} onClose={() => setEmojiOpen(false)} />}
      </form>
    </section>
  );
};

export default ChatWindow;
