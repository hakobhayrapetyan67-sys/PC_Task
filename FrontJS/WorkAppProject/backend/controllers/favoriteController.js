import prisma from '../lib/prisma.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { publicJob } from '../lib/serialize.js';
import { logActivity } from '../lib/activity.js';

const providerSelect = {
  select: { id: true, name: true, avatarUrl: true, headline: true, location: true,
    companyName: true, verificationStatus: true },
};

const jobIdParam = (req) => {
  const id = Number(req.params.jobId);
  return Number.isInteger(id) && id > 0 ? id : null;
};

// GET /api/favorites
const listFavorites = asyncHandler(async (req, res) => {
  const favorites = await prisma.favorite.findMany({
    where: { workerId: req.user.userId },
    include: { job: { include: { provider: providerSelect } } },
    orderBy: { createdAt: 'desc' },
  });

  // A favourited job can be deleted by its owner; skip the orphans rather
  // than returning nulls the UI would crash on.
  const jobs = favorites
    .filter((f) => f.job)
    .map((f) => publicJob(f.job, { isFavorite: true }));

  res.status(200).json({ jobs, total: jobs.length });
});

// POST /api/favorites/:jobId - idempotent add
const addFavorite = asyncHandler(async (req, res) => {
  const jobId = jobIdParam(req);
  if (!jobId) return res.status(400).json({ message: 'Invalid job id' });

  const job = await prisma.job.findUnique({ where: { id: jobId } });
  if (!job) return res.status(404).json({ message: 'Job not found' });

  const existing = await prisma.favorite.findUnique({
    where: { jobId_workerId: { jobId, workerId: req.user.userId } },
  });
  if (existing) {
    return res.status(200).json({ jobId, isFavorite: true, message: 'Already saved' });
  }

  await prisma.favorite.create({ data: { jobId, workerId: req.user.userId } });
  await logActivity(req, 'favorite.added', { jobId });

  res.status(201).json({ jobId, isFavorite: true, message: 'Saved to favorites' });
});

// DELETE /api/favorites/:jobId - idempotent remove
const removeFavorite = asyncHandler(async (req, res) => {
  const jobId = jobIdParam(req);
  if (!jobId) return res.status(400).json({ message: 'Invalid job id' });

  await prisma.favorite.deleteMany({ where: { jobId, workerId: req.user.userId } });
  await logActivity(req, 'favorite.removed', { jobId });

  res.status(200).json({ jobId, isFavorite: false, message: 'Removed from favorites' });
});

// POST /api/favorites/:jobId/toggle - what the heart button calls
const toggleFavorite = asyncHandler(async (req, res) => {
  const jobId = jobIdParam(req);
  if (!jobId) return res.status(400).json({ message: 'Invalid job id' });

  const job = await prisma.job.findUnique({ where: { id: jobId } });
  if (!job) return res.status(404).json({ message: 'Job not found' });

  const existing = await prisma.favorite.findUnique({
    where: { jobId_workerId: { jobId, workerId: req.user.userId } },
  });

  if (existing) {
    await prisma.favorite.delete({ where: { id: existing.id } });
    await logActivity(req, 'favorite.removed', { jobId });
    return res.status(200).json({ jobId, isFavorite: false, message: 'Removed from favorites' });
  }

  await prisma.favorite.create({ data: { jobId, workerId: req.user.userId } });
  await logActivity(req, 'favorite.added', { jobId });
  res.status(201).json({ jobId, isFavorite: true, message: 'Saved to favorites' });
});

export { listFavorites, addFavorite, removeFavorite, toggleFavorite };
