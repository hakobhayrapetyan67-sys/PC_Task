import prisma from '../lib/prisma.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { publicUser, miniUser, publicApplication } from '../lib/serialize.js';
import { validateProfile } from '../lib/validators.js';
import { publicUrl, removeUpload } from '../middleware/upload.js';
import { logActivity } from '../lib/activity.js';

// GET /api/profile
const getProfile = asyncHandler(async (req, res) => {
  const [applications, favorites, jobs] = await Promise.all([
    prisma.application.count({ where: { workerId: req.user.userId } }),
    prisma.favorite.count({ where: { workerId: req.user.userId } }),
    prisma.job.count({ where: { providerId: req.user.userId } }),
  ]);

  res.status(200).json({
    user: publicUser(req.dbUser),
    stats:
      req.user.role === 'WORKER'
        ? { applications, favorites }
        : { jobs, applicationsReceived: await prisma.application.count({
            where: { job: { providerId: req.user.userId } },
          }) },
  });
});

// PATCH /api/profile
const updateProfile = asyncHandler(async (req, res) => {
  const { errors, data } = validateProfile(req.body, req.user.role);
  if (errors.length) return res.status(400).json({ message: errors[0], errors });

  // Email and role are deliberately NOT updatable here: changing the email
  // would bypass confirmation, and changing the role would bypass verification.
  const user = await prisma.user.update({ where: { id: req.user.userId }, data });
  await logActivity(req, 'profile.updated');

  res.status(200).json({ user: publicUser(user), message: 'Profile saved' });
});

// POST /api/profile/avatar  (multipart, field "avatar")
const uploadAvatarFile = asyncHandler(async (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No file uploaded (field "avatar")' });

  const url = publicUrl('avatar', req.file.filename);
  const previous = req.dbUser.avatarUrl;

  const user = await prisma.user.update({
    where: { id: req.user.userId },
    data: { avatarUrl: url },
  });

  // Delete the replaced file so uploads/ does not grow forever.
  if (previous && previous !== url) removeUpload(previous);
  await logActivity(req, 'profile.avatar_uploaded');

  res.status(200).json({ user: publicUser(user), avatarUrl: url, message: 'Avatar updated' });
});

// POST /api/profile/cv  (multipart, field "cv") - workers only
const uploadCvFile = asyncHandler(async (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No file uploaded (field "cv")' });

  const url = publicUrl('cv', req.file.filename);
  const previous = req.dbUser.cvUrl;

  const user = await prisma.user.update({
    where: { id: req.user.userId },
    data: { cvUrl: url },
  });

  // NOTE: the old file is kept only if an application already references it.
  const stillReferenced = previous
    ? await prisma.application.count({ where: { cvUrl: previous } })
    : 0;
  if (previous && previous !== url && stillReferenced === 0) removeUpload(previous);

  await logActivity(req, 'profile.cv_uploaded');
  res.status(200).json({ user: publicUser(user), cvUrl: url, message: 'CV uploaded' });
});

// GET /api/profile/activity - the signed-in user's own action history
const getActivity = asyncHandler(async (req, res) => {
  const logs = await prisma.activityLog.findMany({
    where: { userId: req.user.userId },
    orderBy: { createdAt: 'desc' },
    take: 50,
  });

  res.status(200).json({
    logs: logs.map((l) => ({
      id: l.id,
      action: l.action,
      meta: l.meta,
      createdAt: l.createdAt,
    })),
  });
});

// GET /api/profile/:id - a public profile (e.g. a company page)
const getPublicProfile = asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) return res.status(400).json({ message: 'Invalid user id' });

  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) return res.status(404).json({ message: 'User not found' });

  const jobs =
    user.role === 'PROVIDER'
      ? await prisma.job.count({ where: { providerId: id, status: 'ACTIVE' } })
      : 0;

  res.status(200).json({
    user: {
      ...miniUser(user),
      role: user.role,
      bio: user.bio ?? null,
      companyAbout: user.companyAbout ?? null,
      companyWebsite: user.companyWebsite ?? null,
      companySize: user.companySize ?? null,
      skills: user.skills ? user.skills.split(',').filter(Boolean) : [],
      createdAt: user.createdAt,
    },
    activeJobs: jobs,
  });
});

/* ------------------------------ notifications ---------------------------- */
const listNotifications = asyncHandler(async (req, res) => {
  const [notifications, unread] = await Promise.all([
    prisma.notification.findMany({
      where: { userId: req.user.userId },
      orderBy: { createdAt: 'desc' },
      take: 30,
    }),
    prisma.notification.count({ where: { userId: req.user.userId, readAt: null } }),
  ]);

  res.status(200).json({ notifications, unread });
});

const markNotificationsRead = asyncHandler(async (req, res) => {
  const id = Number(req.params.id);

  if (req.params.id === 'all' || !Number.isInteger(id)) {
    await prisma.notification.updateMany({
      where: { userId: req.user.userId, readAt: null },
      data: { readAt: new Date() },
    });
    return res.status(200).json({ message: 'All notifications marked as read', unread: 0 });
  }

  await prisma.notification.updateMany({
    where: { id, userId: req.user.userId },
    data: { readAt: new Date() },
  });
  const unread = await prisma.notification.count({
    where: { userId: req.user.userId, readAt: null },
  });

  res.status(200).json({ message: 'Notification marked as read', unread });
});

export {
  getProfile, updateProfile, uploadAvatarFile, uploadCvFile,
  getActivity, getPublicProfile,
  listNotifications, markNotificationsRead,
};
