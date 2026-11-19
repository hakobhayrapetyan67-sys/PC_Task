import prisma from './prisma.js';

// Lightweight audit trail: who did what, from which IP.
async function logActivity(req, action, meta = {}) {
  try {
    await prisma.activityLog.create({
      data: {
        userId: req?.user?.userId ?? null,
        action,
        meta: typeof meta === 'string' ? meta : JSON.stringify(meta),
        ip: req?.ip ?? null,
      },
    });
  } catch (err) {
    console.error('[activity] failed:', err.message);
  }
}

export { logActivity };
