import { useEffect, useMemo, useRef, useState } from 'react';

const GROUPS = [
  {
    id: 'smileys', label: 'Smileys', icon: '😀',
    emoji: ['😀','😃','😄','😁','😆','😅','🤣','😂','🙂','🙃','😉','😊','😇','🥰','😍','🤩','😘','😗','😚','😙','🥲','😋','😛','😜','🤪','😝','🤑','🤗','🤭','🤫','🤔','🤐','🤨','😐','😑','😶','😏','😒','🙄','😬','😮','😯','😴','🥱','😌','😔','😪','🤤','😷','🤒','🤕','🥳','🥺','😢','😭','😤','😠','😡','🤯','😳','🥵','🥶','😱','😨','😰','😥','🤗','🤠','🤡','👻','💀','👽','🤖','🎃'],
  },
  {
    id: 'gestures', label: 'Gestures', icon: '👍',
    emoji: ['👍','👎','👌','🤌','✌️','🤞','🤟','🤘','🤙','👈','👉','👆','👇','☝️','✋','🤚','🖐️','🖖','👋','🤝','🙏','✊','👊','🤛','🤜','👏','🙌','👐','🤲','💪','🦾','✍️','💅','👀','👁️','🧠','👂','👃','👅','👄','🫶','👍🏻','👍🏼','👍🏽','👍🏾','👍🏿'],
  },
  {
    id: 'work', label: 'Work', icon: '💼',
    emoji: ['💼','📁','📂','🗂️','📅','📆','🗓️','📇','📈','📉','📊','📋','📌','📍','📎','🖇️','📏','📐','✂️','🗃️','🗄️','🗑️','🔒','🔓','🔑','🔨','🛠️','⚙️','🧰','🧲','💻','🖥️','⌨️','🖱️','🖨️','📱','☎️','📞','📠','📧','📨','📩','📤','📥','📦','📝','✏️','🖊️','📖','📚','🔍','🔎','💡','⏰','⌛','⏳','🏢','🏭','🎯','🚀','💰','💵','💳','🧾','✅','❌','⚠️','❗','❓','💬','💭','🔔'],
  },
  {
    id: 'hearts', label: 'Symbols', icon: '❤️',
    emoji: ['❤️','🧡','💛','💚','💙','💜','🖤','🤍','🤎','💔','❣️','💕','💞','💓','💗','💖','💘','💝','⭐','🌟','✨','⚡','🔥','💥','💫','🎉','🎊','🏆','🥇','🥈','🥉','🎁','🎈','🌈','☀️','🌙','☁️','❄️','🍀','🌸','🌹','🌻','🎵','🎶'],
  },
  {
    id: 'misc', label: 'Other', icon: '🌍',
    emoji: ['🌍','🌎','🌏','🗺️','🏠','🏡','🏙️','🌆','🚗','🚕','🚌','🚆','✈️','🚢','🚲','🛴','☕','🍵','🥤','🍕','🍔','🍟','🌮','🍣','🍜','🥗','🍎','🍌','🍇','🍰','🎂','🍪','🏃','🚶','🧘','⚽','🏀','🎮','🎧','📷','🎬','🇦🇲','🇬🇧','🇺🇸','🇷🇺'],
  },
];

const RECENT_KEY = 'workx.emoji.recent';

const readRecent = () => {
  try {
    const raw = JSON.parse(localStorage.getItem(RECENT_KEY));
    return Array.isArray(raw) ? raw.slice(0, 24) : [];
  } catch {
    return [];
  }
};

const EmojiPicker = ({ onPick, onClose }) => {
  const [group, setGroup] = useState(GROUPS[0].id);
  const [query, setQuery] = useState('');
  const [recent, setRecent] = useState(readRecent);
  const ref = useRef(null);

  // Close on an outside click or Escape.
  useEffect(() => {
    const onDown = (e) => { if (!ref.current?.contains(e.target)) onClose?.(); };
    const onKey = (e) => { if (e.key === 'Escape') onClose?.(); };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [onClose]);

  const shown = useMemo(() => {
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      const hits = GROUPS.filter((g) => g.label.toLowerCase().includes(q) || g.id.includes(q));
      return hits.length ? hits.flatMap((g) => g.emoji) : [];
    }
    return GROUPS.find((g) => g.id === group)?.emoji ?? [];
  }, [group, query]);

  const pick = (e) => {
    const next = [e, ...recent.filter((x) => x !== e)].slice(0, 24);
    setRecent(next);
    try { localStorage.setItem(RECENT_KEY, JSON.stringify(next)); } catch { /* private mode */ }
    onPick(e);
  };

  return (
    <div className="emoji-picker" ref={ref} role="dialog" aria-label="Emoji picker">
      <div className="emoji-picker__search">
        <input
          className="input"
          type="search"
          placeholder="Search a group…"
          value={query}
          onChange={(ev) => setQuery(ev.target.value)}
          aria-label="Search emoji groups"
        />
      </div>

      {!query && recent.length > 0 && (
        <>
          <div className="emoji-picker__label">Recent</div>
          <div className="emoji-picker__grid">
            {recent.map((e, i) => (
              <button key={`${e}-${i}`} type="button" className="emoji-picker__item" onClick={() => pick(e)}>
                {e}
              </button>
            ))}
          </div>
        </>
      )}

      <div className="emoji-picker__grid emoji-picker__grid--main">
        {shown.map((e, i) => (
          <button
            key={`${e}-${i}`}
            type="button"
            className="emoji-picker__item"
            onClick={() => pick(e)}
            aria-label={`Insert ${e}`}
          >
            {e}
          </button>
        ))}
        {shown.length === 0 && <p className="muted small" style={{ padding: 12 }}>Nothing found.</p>}
      </div>

      <div className="emoji-picker__tabs">
        {GROUPS.map((g) => (
          <button
            key={g.id}
            type="button"
            className={`emoji-picker__tab${g.id === group && !query ? ' is-active' : ''}`}
            onClick={() => { setGroup(g.id); setQuery(''); }}
            title={g.label}
            aria-label={g.label}
          >
            {g.icon}
          </button>
        ))}
      </div>
    </div>
  );
};

export default EmojiPicker;
