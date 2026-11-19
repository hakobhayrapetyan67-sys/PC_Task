import prisma from './prisma.js';

// In-app notification. Never throws: a failed notification must not roll back
// the action that triggered it (an application, a status change...).
async function notify(userId, { type, title, body = '', link = null }) {
  try {
    return await prisma.notification.create({
      data: { userId, type, title, body, link },
    });
  } catch (err) {
    console.error('[notify] failed:', err.message);
    return null;
  }
}

export { notify };
