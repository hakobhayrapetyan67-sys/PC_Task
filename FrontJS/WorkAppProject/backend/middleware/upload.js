import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import crypto from 'crypto';
import multer from 'multer';
import env from '../config/env.js';

// ESM has no __dirname; derive it from this module's URL.
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const UPLOAD_ROOT = path.join(__dirname, '..', 'uploads');

const FOLDERS = { avatar: 'avatars', cv: 'cv', document: 'documents', chat: 'chat' };

// Create the folders at boot so the first upload cannot fail on ENOENT.
for (const folder of Object.values(FOLDERS)) {
  fs.mkdirSync(path.join(UPLOAD_ROOT, folder), { recursive: true });
}

const ALLOWED = {
  avatar: { mimes: ['image/png', 'image/jpeg', 'image/webp'], exts: ['.png', '.jpg', '.jpeg', '.webp'] },
  cv: {
    mimes: ['application/pdf', 'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
    exts: ['.pdf', '.doc', '.docx'],
  },
  document: {
    mimes: ['application/pdf', 'image/png', 'image/jpeg'],
    exts: ['.pdf', '.png', '.jpg', '.jpeg'],
  },
  // Chat attachments: images preview inline, the rest download.
  chat: {
    mimes: [
      'image/png', 'image/jpeg', 'image/webp', 'image/gif',
      'application/pdf', 'text/plain',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/zip',
    ],
    exts: ['.png', '.jpg', '.jpeg', '.webp', '.gif', '.pdf', '.txt',
      '.doc', '.docx', '.xls', '.xlsx', '.zip'],
  },
};

function makeUploader(kind) {
  const rule = ALLOWED[kind];

  const storage = multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, path.join(UPLOAD_ROOT, FOLDERS[kind])),
    filename: (req, file, cb) => {
      // Never trust the client's filename: a name like "../../server.js" would
      // otherwise escape the uploads folder. Only the extension is reused.
      const ext = path.extname(file.originalname).toLowerCase();
      const safeExt = rule.exts.includes(ext) ? ext : '';
      const unique = crypto.randomBytes(12).toString('hex');
      cb(null, `${kind}-${req.user?.userId ?? 'anon'}-${Date.now()}-${unique}${safeExt}`);
    },
  });

  return multer({
    storage,
    limits: { fileSize: env.MAX_UPLOAD_MB * 1024 * 1024, files: 1 },
    fileFilter: (_req, file, cb) => {
      const ext = path.extname(file.originalname).toLowerCase();
      if (!rule.mimes.includes(file.mimetype) || !rule.exts.includes(ext)) {
        const err = new Error(`Only ${rule.exts.join(', ')} files are allowed here`);
        err.status = 400;
        return cb(err);
      }
      cb(null, true);
    },
  });
}

// Public URL for a stored file, e.g. /uploads/avatars/avatar-1-...png
const publicUrl = (kind, filename) => `/uploads/${FOLDERS[kind]}/${filename}`;

// Deletes an old file when it is replaced. Guards against path traversal and
// ignores a missing file.
function removeUpload(url) {
  if (!url || typeof url !== 'string' || !url.startsWith('/uploads/')) return;
  const target = path.resolve(UPLOAD_ROOT, '.' + url.replace('/uploads', ''));
  if (!target.startsWith(path.resolve(UPLOAD_ROOT))) return;
  fs.promises.unlink(target).catch(() => {});
}

// Built once at module load: an ESM export list cannot hold expressions.
const uploadAvatar = makeUploader('avatar');
const uploadCv = makeUploader('cv');
const uploadDocument = makeUploader('document');
const uploadChatFile = makeUploader('chat');

export { uploadAvatar, uploadCv, uploadDocument, uploadChatFile, publicUrl, removeUpload, UPLOAD_ROOT };
