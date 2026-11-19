import crypto from 'crypto';
import prisma from './prisma.js';
import { TOKEN_TYPES, VERIFY_EMAIL_TTL_MS, RESET_PASSWORD_TTL_MS } from './constants.js';

const TTL = {
  [TOKEN_TYPES.VERIFY_EMAIL]: VERIFY_EMAIL_TTL_MS,
  [TOKEN_TYPES.RESET_PASSWORD]: RESET_PASSWORD_TTL_MS,
};

const randomToken = () => crypto.randomBytes(32).toString('hex');

// Issues a fresh single-use token and invalidates any earlier unused token of
// the same type, so an old link in an old email stops working.
async function issueToken(userId, type) {
  await prisma.authToken.updateMany({
    where: { userId, type, usedAt: null },
    data: { usedAt: new Date() },
  });

  return prisma.authToken.create({
    data: {
      token: randomToken(),
      type,
      userId,
      expiresAt: new Date(Date.now() + (TTL[type] ?? VERIFY_EMAIL_TTL_MS)),
    },
  });
}

// Returns the token row only if it exists, matches the type, is unused and
// has not expired.
async function consumeToken(token, type) {
  if (!token || typeof token !== 'string') return null;

  const row = await prisma.authToken.findUnique({ where: { token } });
  if (!row || row.type !== type || row.usedAt) return null;
  if (new Date(row.expiresAt).getTime() < Date.now()) return null;

  await prisma.authToken.update({ where: { id: row.id }, data: { usedAt: new Date() } });
  return row;
}

export { issueToken, consumeToken, randomToken };
