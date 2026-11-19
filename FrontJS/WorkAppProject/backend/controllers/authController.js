import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../lib/prisma.js';
import env from '../config/env.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { publicUser } from '../lib/serialize.js';
import { issueToken, consumeToken } from '../lib/tokens.js';
import { TOKEN_TYPES } from '../lib/constants.js';
import * as mailer from '../lib/mailer.js';
import { notify } from '../lib/notify.js';
import { logActivity } from '../lib/activity.js';
import {
  validateRegister, validateLogin, validatePassword,
} from '../lib/validators.js';

const signToken = (user) =>
  jwt.sign({ userId: user.id, role: user.role }, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN,
  });

const BCRYPT_ROUNDS = 12;

/* ------------------------------- register -------------------------------- */
const register = asyncHandler(async (req, res) => {
  const { errors, data } = validateRegister(req.body);
  if (errors.length) return res.status(400).json({ message: errors[0], errors });

  const existing = await prisma.user.findUnique({ where: { email: data.email } });
  if (existing) {
    return res.status(409).json({ message: 'An account with this email already exists' });
  }

  const hashed = await bcrypt.hash(data.password, BCRYPT_ROUNDS);

  const user = await prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      password: hashed,
      role: data.role,
      companyName: data.role === 'PROVIDER' ? data.companyName : null,
    },
  });

  // Email confirmation token + message. A mail failure must not fail signup.
  const { token } = await issueToken(user.id, TOKEN_TYPES.VERIFY_EMAIL);
  await mailer.sendVerificationEmail(user, token);

  await notify(user.id, {
    type: 'SYSTEM',
    title: 'Welcome to Workx Clone',
    body: 'Confirm your email address to unlock every feature.',
    link: '/profile',
  });
  await logActivity({ ...req, user: { userId: user.id } }, 'auth.register', { role: user.role });

  res.status(201).json({
    user: publicUser(user),
    token: signToken(user),
    // In development the link is returned so the flow is testable without SMTP.
    ...(env.MAIL_TRANSPORT !== 'smtp' ? { devLink: mailer.verifyEmailLink(token) } : {}),
  });
});

/* --------------------------------- login --------------------------------- */
const login = asyncHandler(async (req, res) => {
  const { errors, data } = validateLogin(req.body);
  if (errors.length) return res.status(400).json({ message: errors[0], errors });

  const user = await prisma.user.findUnique({ where: { email: data.email } });

  // Identical response for "unknown email" and "wrong password" so the
  // endpoint cannot be used to discover which addresses are registered.
  if (!user || !(await bcrypt.compare(data.password, user.password))) {
    await logActivity(req, 'auth.login_failed', { email: data.email });
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  await logActivity({ ...req, user: { userId: user.id } }, 'auth.login');
  res.status(200).json({ user: publicUser(user), token: signToken(user) });
});

/* ---------------------------------- me ----------------------------------- */
// Lets the client validate a stored token on boot and refresh the user object.
const me = asyncHandler(async (req, res) => {
  res.status(200).json({ user: publicUser(req.dbUser) });
});

/* ---------------------------- verify email ------------------------------- */
const verifyEmail = asyncHandler(async (req, res) => {
  const token = req.body?.token || req.query?.token;

  const row = await consumeToken(token, TOKEN_TYPES.VERIFY_EMAIL);
  if (!row) {
    return res.status(400).json({ message: 'This confirmation link is invalid or has expired' });
  }

  const user = await prisma.user.update({
    where: { id: row.userId },
    data: { emailVerified: true },
  });

  await notify(user.id, {
    type: 'SYSTEM',
    title: 'Email confirmed',
    body: 'Your email address has been confirmed.',
  });
  await logActivity({ ...req, user: { userId: user.id } }, 'auth.email_verified');

  res.status(200).json({ message: 'Email confirmed', user: publicUser(user) });
});

const resendVerification = asyncHandler(async (req, res) => {
  const user = req.dbUser;
  if (user.emailVerified) {
    return res.status(400).json({ message: 'Your email is already confirmed' });
  }

  const { token } = await issueToken(user.id, TOKEN_TYPES.VERIFY_EMAIL);
  await mailer.sendVerificationEmail(user, token);
  await logActivity(req, 'auth.verification_resent');

  res.status(200).json({
    message: 'Confirmation email sent',
    ...(env.MAIL_TRANSPORT !== 'smtp' ? { devLink: mailer.verifyEmailLink(token) } : {}),
  });
});

/* --------------------------- password reset ------------------------------ */
const forgotPassword = asyncHandler(async (req, res) => {
  const email = String(req.body?.email || '').trim().toLowerCase();
  const user = email ? await prisma.user.findUnique({ where: { email } }) : null;

  // Always answer 200 with the same text: a different answer for a known and
  // an unknown address would leak the user list.
  const response = {
    message: 'If an account exists for that address, a reset link has been sent',
  };

  if (user) {
    const { token } = await issueToken(user.id, TOKEN_TYPES.RESET_PASSWORD);
    await mailer.sendPasswordResetEmail(user, token);
    await logActivity({ ...req, user: { userId: user.id } }, 'auth.password_reset_requested');
    if (env.MAIL_TRANSPORT !== 'smtp') response.devLink = mailer.resetPasswordLink(token);
  }

  res.status(200).json(response);
});

const resetPassword = asyncHandler(async (req, res) => {
  const { token, password } = req.body || {};

  const pwErrors = validatePassword(password, 'New password');
  if (pwErrors.length) return res.status(400).json({ message: pwErrors[0], errors: pwErrors });

  const row = await consumeToken(token, TOKEN_TYPES.RESET_PASSWORD);
  if (!row) {
    return res.status(400).json({ message: 'This reset link is invalid or has expired' });
  }

  const hashed = await bcrypt.hash(password, BCRYPT_ROUNDS);
  const user = await prisma.user.update({
    where: { id: row.userId },
    data: { password: hashed },
  });

  await notify(user.id, {
    type: 'SYSTEM',
    title: 'Password changed',
    body: 'Your password was reset. If this was not you, contact support.',
  });
  await logActivity({ ...req, user: { userId: user.id } }, 'auth.password_reset');

  // A new JWT is returned so the user lands signed in.
  res.status(200).json({
    message: 'Password updated',
    user: publicUser(user),
    token: signToken(user),
  });
});

const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body || {};

  const pwErrors = validatePassword(newPassword, 'New password');
  if (pwErrors.length) return res.status(400).json({ message: pwErrors[0], errors: pwErrors });

  const ok = await bcrypt.compare(String(currentPassword || ''), req.dbUser.password);
  if (!ok) return res.status(401).json({ message: 'Current password is incorrect' });

  if (await bcrypt.compare(newPassword, req.dbUser.password)) {
    return res.status(400).json({ message: 'The new password must differ from the current one' });
  }

  const hashed = await bcrypt.hash(newPassword, BCRYPT_ROUNDS);
  await prisma.user.update({ where: { id: req.user.userId }, data: { password: hashed } });
  await logActivity(req, 'auth.password_changed');

  res.status(200).json({ message: 'Password updated' });
});

/* -------------------------------- logout --------------------------------- */
// A stateless JWT cannot be revoked server-side, so the client drops it. The
// endpoint exists so the action is logged and the contract is explicit.
const logout = asyncHandler(async (req, res) => {
  await logActivity(req, 'auth.logout');
  res.status(200).json({ message: 'Signed out' });
});

export {
  register, login, me, logout,
  verifyEmail, resendVerification,
  forgotPassword, resetPassword, changePassword,
};
