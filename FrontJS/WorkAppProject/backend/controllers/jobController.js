import prisma from '../lib/prisma.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { publicJob } from '../lib/serialize.js';
import { validateJob } from '../lib/validators.js';
import { logActivity } from '../lib/activity.js';
import C from '../lib/constants.js';

const providerSelect = {
  select: { id: true, name: true, avatarUrl: true, headline: true, location: true,
    companyName: true, verificationStatus: true },
};

const jobInclude = { provider: providerSelect };

const idParam = (req) => {
  const id = Number(req.params.id);
  return Number.isInteger(id) && id > 0 ? id : null;
};

/* ------------------------------ list / search ---------------------------- */
// GET /api/jobs - public. ?search= &category= &location= &workMode=
//                 &employmentType= &minSalary= &maxSalary= &sort= &page= &limit=
const listJobs = asyncHandler(async (req, res) => {
  const {
    search, category, location, workMode, employmentType,
    minSalary, maxSalary, sort = 'newest',
  } = req.query;

  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(50, Math.max(1, Number(req.query.limit) || 12));

  const where = { status: 'ACTIVE' };

  if (search && String(search).trim()) {
    const q = String(search).trim();
    where.OR = [
      { title: { contains: q } },
      { description: { contains: q } },
      { skills: { contains: q } },
    ];
  }
  if (category && C.CATEGORIES.includes(String(category).toUpperCase())) {
    where.category = String(category).toUpperCase();
  }
  if (location && String(location).trim()) {
    where.location = { contains: String(location).trim() };
  }
  if (workMode && C.WORK_MODES.includes(String(workMode).toUpperCase())) {
    where.workMode = String(workMode).toUpperCase();
  }
  if (employmentType && C.EMPLOYMENT_TYPES.includes(String(employmentType).toUpperCase())) {
    where.employmentType = String(employmentType).toUpperCase();
  }

  const min = Number(minSalary);
  const max = Number(maxSalary);
  // A job matches when its range overlaps the requested one. salaryMax is
  // nullable, so "open upper bound" rows must not be filtered out.
  if (Number.isFinite(min) && min > 0) {
    where.AND = [
      ...(where.AND || []),
      { OR: [{ salaryMax: { gte: min } }, { salaryMax: null, salaryMin: { gte: min } }] },
    ];
  }
  if (Number.isFinite(max) && max > 0) {
    where.AND = [...(where.AND || []), { salaryMin: { lte: max } }];
  }

  const orderBy =
    sort === 'salary_desc' ? [{ salaryMax: 'desc' }, { createdAt: 'desc' }]
    : sort === 'salary_asc' ? [{ salaryMin: 'asc' }, { createdAt: 'desc' }]
    : sort === 'oldest' ? [{ createdAt: 'asc' }]
    : [{ createdAt: 'desc' }];

  const [total, jobs] = await Promise.all([
    prisma.job.count({ where }),
    prisma.job.findMany({
      where,
      include: jobInclude,
      orderBy,
      skip: (page - 1) * limit,
      take: limit,
    }),
  ]);

  // Mark favourites / already-applied for the signed-in worker in one query
  // each, instead of one query per card.
  let favoriteIds = new Set();
  let appliedIds = new Set();
  if (req.user?.role === 'WORKER' && jobs.length) {
    const ids = jobs.map((j) => j.id);
    const [favs, apps] = await Promise.all([
      prisma.favorite.findMany({
        where: { workerId: req.user.userId, jobId: { in: ids } },
        select: { jobId: true },
      }),
      prisma.application.findMany({
        where: { workerId: req.user.userId, jobId: { in: ids } },
        select: { jobId: true },
      }),
    ]);
    favoriteIds = new Set(favs.map((f) => f.jobId));
    appliedIds = new Set(apps.map((a) => a.jobId));
  }

  res.status(200).json({
    jobs: jobs.map((j) =>
      publicJob(j, { isFavorite: favoriteIds.has(j.id), hasApplied: appliedIds.has(j.id) })
    ),
    page,
    limit,
    total,
    totalPages: Math.max(1, Math.ceil(total / limit)),
  });
});

/* -------------------------------- details -------------------------------- */
const getJob = asyncHandler(async (req, res) => {
  const id = idParam(req);
  if (!id) return res.status(400).json({ message: 'Invalid job id' });

  const job = await prisma.job.findUnique({
    where: { id },
    include: { ...jobInclude, _count: { select: { applications: true } } },
  });
  if (!job) return res.status(404).json({ message: 'Job not found' });

  // A closed job stays reachable for its own owner only.
  if (job.status !== 'ACTIVE' && job.providerId !== req.user?.userId) {
    return res.status(404).json({ message: 'Job not found' });
  }

  let isFavorite = false;
  let hasApplied = false;
  if (req.user?.role === 'WORKER') {
    const [fav, app] = await Promise.all([
      prisma.favorite.findUnique({
        where: { jobId_workerId: { jobId: id, workerId: req.user.userId } },
      }),
      prisma.application.findUnique({
        where: { jobId_workerId: { jobId: id, workerId: req.user.userId } },
      }),
    ]);
    isFavorite = Boolean(fav);
    hasApplied = Boolean(app);
  }

  // Count a view, but not the owner's own visits.
  if (req.user?.userId !== job.providerId) {
    await prisma.job.update({ where: { id }, data: { views: { increment: 1 } } });
  }

  res.status(200).json({ job: publicJob(job, { isFavorite, hasApplied }) });
});

/* ------------------------------ my listings ------------------------------ */
const myJobs = asyncHandler(async (req, res) => {
  const jobs = await prisma.job.findMany({
    where: { providerId: req.user.userId },
    include: { ...jobInclude, _count: { select: { applications: true } } },
    orderBy: { createdAt: 'desc' },
  });
  res.status(200).json({ jobs: jobs.map((j) => publicJob(j)) });
});

/* -------------------------------- create --------------------------------- */
const createJob = asyncHandler(async (req, res) => {
  const { errors, data } = validateJob(req.body);
  if (errors.length) return res.status(400).json({ message: errors[0], errors });

  const job = await prisma.job.create({
    data: { ...data, providerId: req.user.userId },
    include: jobInclude,
  });

  await logActivity(req, 'job.created', { jobId: job.id });
  res.status(201).json({ job: publicJob(job) });
});

/* -------------------------------- update --------------------------------- */
const updateJob = asyncHandler(async (req, res) => {
  const id = idParam(req);
  if (!id) return res.status(400).json({ message: 'Invalid job id' });

  const existing = await prisma.job.findUnique({ where: { id } });
  if (!existing) return res.status(404).json({ message: 'Job not found' });
  // Ownership: holding the PROVIDER role is not enough to edit someone else's job.
  if (existing.providerId !== req.user.userId) {
    return res.status(403).json({ message: 'You can only edit your own jobs' });
  }

  const { errors, data } = validateJob({ ...existing, ...req.body });
  if (errors.length) return res.status(400).json({ message: errors[0], errors });

  const job = await prisma.job.update({ where: { id }, data, include: jobInclude });
  await logActivity(req, 'job.updated', { jobId: id });

  res.status(200).json({ job: publicJob(job) });
});

/* -------------------------------- delete --------------------------------- */
const deleteJob = asyncHandler(async (req, res) => {
  const id = idParam(req);
  if (!id) return res.status(400).json({ message: 'Invalid job id' });

  const existing = await prisma.job.findUnique({ where: { id } });
  if (!existing) return res.status(404).json({ message: 'Job not found' });
  if (existing.providerId !== req.user.userId) {
    return res.status(403).json({ message: 'You can only delete your own jobs' });
  }

  // Applications and favourites are removed by the schema's ON DELETE CASCADE.
  await prisma.job.delete({ where: { id } });
  await logActivity(req, 'job.deleted', { jobId: id });

  res.status(200).json({ id, message: 'Job deleted' });
});

/* ------------------------------- meta data ------------------------------- */
// Powers the filter dropdowns without hardcoding the lists in the frontend.
const getMeta = asyncHandler(async (_req, res) => {
  const locations = await prisma.job.findMany({
    where: { status: 'ACTIVE' },
    select: { location: true },
    distinct: ['location'],
    orderBy: { location: 'asc' },
  });

  res.status(200).json({
    categories: C.CATEGORIES,
    employmentTypes: C.EMPLOYMENT_TYPES,
    workModes: C.WORK_MODES,
    locations: locations.map((l) => l.location).filter(Boolean),
  });
});

export { listJobs, getJob, myJobs, createJob, updateJob, deleteJob, getMeta };
