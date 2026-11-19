export const initialsOf = (name) =>
  (name || '?')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join('') || '?';

const Avatar = ({ name, src, size = 40, square = false }) => (
  <span
    className={`avatar${square ? ' avatar--square' : ''}`}
    style={{ width: size, height: size, fontSize: Math.max(11, Math.round(size * 0.36)) }}
    aria-hidden="true"
  >
    {src ? <img src={src} alt="" loading="lazy" /> : initialsOf(name)}
  </span>
);
export default Avatar;
