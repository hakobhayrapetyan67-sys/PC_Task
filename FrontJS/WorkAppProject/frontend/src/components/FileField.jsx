import { useRef, useState } from 'react';
import Spinner from './Spinner';

const FileField = ({
  label, accept, maxMb = 5, currentUrl, currentLabel,
  onPick, uploading = false, buttonText = 'Choose file',
}) => {
  const inputRef = useRef(null);
  const [error, setError] = useState('');
  const [name, setName] = useState('');

  const handleChange = (e) => {
    const file = e.target.files?.[0];
    setError('');
    if (!file) return;

    if (file.size > maxMb * 1024 * 1024) {
      setError(`File is too large (max ${maxMb} MB)`);
      e.target.value = '';
      return;
    }
    setName(file.name);
    onPick(file);
    e.target.value = '';
  };

  return (
    <div className="field">
      {label && <span className="field__label">{label}</span>}
      <div className="file-field">
        <input ref={inputRef} type="file" accept={accept} onChange={handleChange} />
        <button
          type="button"
          className="btn btn--subtle btn--sm"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
        >
          {uploading ? <Spinner /> : null}
          {uploading ? 'Uploading…' : buttonText}
        </button>

        <span className="file-field__name">
          {name || (currentUrl ? (currentLabel || 'Current file') : 'No file selected')}
        </span>

        {currentUrl && (
          <a href={currentUrl} target="_blank" rel="noreferrer" className="small">
            Open
          </a>
        )}
      </div>
      {error && <span className="field__error">{error}</span>}
    </div>
  );
};
export default FileField;
