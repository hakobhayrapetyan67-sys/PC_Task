import env from './config/env.js'; // loads + validates .env first
import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import cors from 'cors';

import authRoutes from './routes/authRoutes.js';
import jobRoutes from './routes/jobRoutes.js';
import applicationRoutes from './routes/applicationRoutes.js';
import favoriteRoutes from './routes/favoriteRoutes.js';
import profileRoutes from './routes/profileRoutes.js';
import verificationRoutes from './routes/verificationRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import { notFound, errorHandler } from './middleware/errorHandler.js';
import { UPLOAD_ROOT } from './middleware/upload.js';

const app = express();

// req.ip must be the real client address behind the Vite dev proxy.
app.set('trust proxy', 'loopback');

// Only the configured origins. `cors()` with no options allows every origin.
app.use(
  cors({
    origin(origin, callback) {
      // No Origin header: curl, Postman, same-origin requests.
      if (!origin || env.CORS_ORIGIN.includes(origin)) return callback(null, true);
      callback(new Error(`Origin not allowed by CORS: ${origin}`));
    },
    credentials: true,
  })
);

app.use(express.json({ limit: '200kb' }));
app.use(express.urlencoded({ extended: true, limit: '200kb' }));

// Uploaded avatars / CVs / documents.
app.use(
  '/uploads',
  express.static(UPLOAD_ROOT, {
    maxAge: '7d',
    // Never execute anything from the upload folder; always hand it back as
    // a file. Without this an uploaded .html could run on this origin.
    setHeaders: (res) => {
      res.setHeader('X-Content-Type-Options', 'nosniff');
      res.setHeader('Content-Security-Policy', "default-src 'none'; sandbox");
    },
  })
);

app.get('/api/health', (_req, res) =>
  res.json({
    status: 'ok',
    env: env.NODE_ENV,
    port: env.PORT,
    mail: env.MAIL_TRANSPORT,
    verification: env.VERIFICATION_MODE,
    time: new Date().toISOString(),
  })
);

app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/favorites', favoriteRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/verification', verificationRoutes);
app.use('/api/chat', chatRoutes);

app.use(notFound);
app.use(errorHandler);

// Exported without listening so a test file can import the app.
// `import.meta.main` is not available on Node 20, so compare argv instead.
const isEntrypoint = process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1]);

if (isEntrypoint) {
  const server = app.listen(env.PORT, () => {
    console.log(`\nBackend running at http://localhost:${env.PORT}`);
    console.log(`CORS origins : ${env.CORS_ORIGIN.join(', ')}`);
    console.log(`Mail transport: ${env.MAIL_TRANSPORT}  |  Verification: ${env.VERIFICATION_MODE}`);
    console.log(`Uploads      : ${UPLOAD_ROOT}\n`);
  });

  const shutdown = (signal) => {
    console.log(`\n[${signal}] shutting down...`);
    server.close(() => process.exit(0));
    setTimeout(() => process.exit(1), 5000).unref();
  };
  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('SIGTERM', () => shutdown('SIGTERM'));
}

export default app;
