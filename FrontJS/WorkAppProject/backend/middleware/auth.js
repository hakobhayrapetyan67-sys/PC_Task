import jwt from 'jsonwebtoken';
import prisma from '../lib/prisma.js';
import env from '../config/env.js';
import { asyncHandler } from './errorHandler.js';

const readBearer = (req) => {
  const [scheme, token] = (req.headers.authorization || '').split(' ');
  return scheme === 'Bearer' && token ? token : null;
};

// Hard guard: the route is unreachable without a valid token.
// Also re-reads the user from the database on every request, so a role change,
// a deleted account or a fresh verification status takes effect immediately
// instead of living in a week-old JWT.
const requireAuth = asyncHandler(async (req, res, next) => {
  const token = readBearer(req);
  if (!token) return res.status(401).json({ message: 'Unauthorized: missing Bearer token' });

  let payload;
  try {
    payload = jwt.verify(token, env.JWT_SECRET);
  } catch (err) {
    return res.status(401).json({
      message: err.name === 'TokenExpiredError' ? 'Session expired, please sign in again' : 'Invalid token',
    });
  }

  const user = await prisma.user.findUnique({ where: { id: payload.userId } });
  if (!user) return res.status(401).json({ message: 'Account no longer exists' });

  req.user = {
    userId: user.id,
    role: user.role,
    email: user.email,
    emailVerified: user.emailVerified,
    verificationStatus: user.verificationStatus,
  };
  req.dbUser = user;
  next();
});

// Soft guard: attaches req.user when a token is present, never blocks.
// Used on public job routes so they can mark "isFavorite" / "hasApplied".
const optionalAuth = asyncHandler(async (req, _res, next) => {
  const token = readBearer(req);
  if (!token) return next();

  try {
    const payload = jwt.verify(token, env.JWT_SECRET);
    const user = await prisma.user.findUnique({ where: { id: payload.userId } });
    if (user) {
      req.user = {
        userId: user.id,
        role: user.role,
        email: user.email,
        emailVerified: user.emailVerified,
        verificationStatus: user.verificationStatus,
      };
      req.dbUser = user;
    }
  } catch {
    /* public route: an invalid token is simply ignored */
  }
  next();
});

const requireRole = (...roles) => (req, res, next) => {
  if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ message: `This action requires the ${roles.join(' or ')} role` });
  }
  next();
};

// Feature gate: email must be confirmed.
const requireVerifiedEmail = (req, res, next) => {
  if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
  if (!req.user.emailVerified) {
    return res.status(403).json({
      message: 'Confirm your email address first',
      code: 'EMAIL_NOT_VERIFIED',
    });
  }
  next();
};

// Feature gate: the company must be verified before it can publish jobs.
const requireVerifiedCompany = (req, res, next) => {
  if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
  if (req.user.verificationStatus !== 'VERIFIED') {
    return res.status(403).json({
      message: 'Your company must be verified before you can publish jobs',
      code: 'COMPANY_NOT_VERIFIED',
      verificationStatus: req.user.verificationStatus,
    });
  }
  next();
};

// Very small admin check so verification requests can be reviewed.
const requireAdmin = (req, res, next) => {
  if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
  if (req.user.email?.toLowerCase() !== env.ADMIN_EMAIL) {
    return res.status(403).json({ message: 'Admin only' });
  }
  next();
};

export {
  requireAuth,
  optionalAuth,
  requireRole,
  requireVerifiedEmail,
  requireVerifiedCompany,
  requireAdmin,
};
