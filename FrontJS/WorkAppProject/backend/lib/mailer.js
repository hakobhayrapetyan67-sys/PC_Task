import nodemailer from 'nodemailer';
import env from '../config/env.js';

// Two transports:
//  - "console" (default in dev): nothing leaves the machine. The message is
//    printed to the terminal, so the whole confirm/reset flow is testable
//    without an SMTP server.
//  - "smtp": real delivery using the SMTP_* variables.
let transporter = null;

function getTransporter() {
  if (transporter) return transporter;

  if (env.MAIL_TRANSPORT === 'smtp' && env.SMTP_HOST) {
    transporter = nodemailer.createTransport({
      host: env.SMTP_HOST,
      port: env.SMTP_PORT,
      secure: env.SMTP_SECURE,
      auth: env.SMTP_USER ? { user: env.SMTP_USER, pass: env.SMTP_PASS } : undefined,
    });
  } else {
    // `jsonTransport` builds the message but never opens a connection.
    transporter = nodemailer.createTransport({ jsonTransport: true });
  }
  return transporter;
}

async function sendMail({ to, subject, text, html }) {
  const message = { from: env.MAIL_FROM, to, subject, text, html };

  try {
    const info = await getTransporter().sendMail(message);

    if (env.MAIL_TRANSPORT !== 'smtp') {
      console.log('\n──────── EMAIL (console transport) ────────');
      console.log(`To:      ${to}`);
      console.log(`Subject: ${subject}`);
      console.log(text);
      console.log('───────────────────────────────────────────\n');
    }
    return { ok: true, id: info?.messageId };
  } catch (err) {
    // Email must never break the request it belongs to: a user who registers
    // is still created even when the mail server is down.
    console.error('[mailer] failed to send:', err.message);
    return { ok: false, error: err.message };
  }
}

const verifyEmailLink = (token) => `${env.CLIENT_URL}/verify-email?token=${token}`;
const resetPasswordLink = (token) => `${env.CLIENT_URL}/reset-password?token=${token}`;

function sendVerificationEmail(user, token) {
  const link = verifyEmailLink(token);
  return sendMail({
    to: user.email,
    subject: 'Confirm your email - Workx Clone',
    text: `Hi ${user.name},\n\nConfirm your email address by opening this link (valid for 24 hours):\n${link}\n\nIf you did not create this account, ignore this message.`,
    html: `<p>Hi ${user.name},</p><p>Confirm your email address:</p><p><a href="${link}">${link}</a></p><p>The link is valid for 24 hours.</p>`,
  });
}

function sendPasswordResetEmail(user, token) {
  const link = resetPasswordLink(token);
  return sendMail({
    to: user.email,
    subject: 'Reset your password - Workx Clone',
    text: `Hi ${user.name},\n\nReset your password with this link (valid for 1 hour):\n${link}\n\nIf you did not request this, ignore this message - your password stays unchanged.`,
    html: `<p>Hi ${user.name},</p><p>Reset your password:</p><p><a href="${link}">${link}</a></p><p>The link is valid for 1 hour.</p>`,
  });
}

export {
  sendMail,
  sendVerificationEmail,
  sendPasswordResetEmail,
  verifyEmailLink,
  resetPasswordLink,
};
