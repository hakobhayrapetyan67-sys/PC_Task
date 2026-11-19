import env from '../config/env.js';

const notFound = (req, res) => {
  res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` });
};

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, _next) => {
  let status = err.status || err.statusCode || 500;
  let message = err.message || 'Internal server error';

  // Prisma: unique constraint
  if (err.code === 'P2002') {
    status = 409;
    const target = Array.isArray(err.meta?.target) ? err.meta.target.join(', ') : err.meta?.target;
    message = target ? `Already exists: ${target}` : 'This record already exists';
  }
  // Prisma: record not found
  if (err.code === 'P2025') {
    status = 404;
    message = 'Record not found';
  }
  // Prisma: foreign key failure
  if (err.code === 'P2003') {
    status = 400;
    message = 'Related record does not exist';
  }
  // Malformed JSON body
  if (err.type === 'entity.parse.failed') {
    status = 400;
    message = 'Invalid JSON body';
  }
  // Multer
  if (err.code === 'LIMIT_FILE_SIZE') {
    status = 413;
    message = `File is too large (max ${env.MAX_UPLOAD_MB} MB)`;
  }
  if (err.code === 'LIMIT_UNEXPECTED_FILE') {
    status = 400;
    message = 'Unexpected file field';
  }

  if (status >= 500) console.error('[error]', err);

  res.status(status).json({
    message: status >= 500 && !env.isDev ? 'Internal server error' : message,
    ...(env.isDev && status >= 500 ? { stack: err.stack } : {}),
  });
};

// Wraps async handlers so a rejected promise reaches errorHandler instead of
// becoming an unhandled rejection that kills the process.
const asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

// Throwable HTTP error
class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

export { notFound, errorHandler, asyncHandler, HttpError };
