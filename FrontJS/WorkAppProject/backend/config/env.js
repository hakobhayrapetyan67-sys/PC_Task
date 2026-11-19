// Loads + validates environment variables once, at startup, so a missing
// value fails fast with a readable message instead of crashing inside a library.
import 'dotenv/config';

const missing = [];

function required(name, fallback) {
  const value = process.env[name] ?? fallback;
  if (!value) missing.push(name);
  return value;
}

const bool = (v, def = false) =>
  v === undefined ? def : ['1', 'true', 'yes', 'on'].includes(String(v).toLowerCase());

const env = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: Number(process.env.PORT) || 5001,

  DATABASE_URL: required('DATABASE_URL', 'file:./dev.db'),

  JWT_SECRET: required('JWT_SECRET'),
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',

  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:5173',
  CORS_ORIGIN: (process.env.CORS_ORIGIN || 'http://localhost:5173,http://127.0.0.1:5173')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean),

  MAIL_TRANSPORT: (process.env.MAIL_TRANSPORT || 'console').toLowerCase(),
  MAIL_FROM: process.env.MAIL_FROM || 'Workx Clone <no-reply@workx.local>',
  SMTP_HOST: process.env.SMTP_HOST || '',
  SMTP_PORT: Number(process.env.SMTP_PORT) || 587,
  SMTP_SECURE: bool(process.env.SMTP_SECURE, false),
  SMTP_USER: process.env.SMTP_USER || '',
  SMTP_PASS: process.env.SMTP_PASS || '',

  MAX_UPLOAD_MB: Number(process.env.MAX_UPLOAD_MB) || 5,

  VERIFICATION_MODE: (process.env.VERIFICATION_MODE || 'manual').toLowerCase(),
  ADMIN_EMAIL: (process.env.ADMIN_EMAIL || 'admin@workx.local').toLowerCase(),
};

env.isDev = env.NODE_ENV === 'development';

if (missing.length) {
  console.error(
    `\n[config] Missing required environment variable(s): ${missing.join(', ')}` +
      '\n[config] Create a .env file in the backend folder:  cp .env.example .env\n'
  );
  process.exit(1);
}

export default env;
