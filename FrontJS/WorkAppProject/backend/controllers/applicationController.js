import prisma from '../lib/prisma.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { publicApplication } from '../lib/serialize.js';
import { validateApplication, validateApplicationStatus } from '../lib/validators.js';
import { notify } from '../lib/notify.js';
import { logActivity } from '../lib/activity.js';

const providerSelect = {
  select: { id: true, name: true, avatarUrl: true, headline: true, location: true,
    companyName: true, verificationStatus: true },
};
const workerSelect = {
  select: { id: true, name: true, avatarUrl: true, headline: true, location: true,
    companyName: true, verificationStatus: true, email: true, cvUrl: true, skills: true },
};

const idParam = (req, key = 'id') => {
  const id = Number(req.params[key]);
  return Number.isInteger(id) && id > 0 ? id : null;
};

/* --------------------------- worker: apply ------------------------------- */
// POST /api/applications/jobs/:jobId
const apply = asyncHandler(async (req, res) => {
  const jobId = idParam(req, 'jobId');
  if (!jobId) return res.status(400).json({ message: 'Invalid job id' });

  const { errors, data } = validateApplication(req.body);
  if (errors.length) return res.status(400).json({ message: errors[0], errors });

  const job = await prisma.job.findUnique({
    where: { id: jobId },
    include: { provider: { select: { id: true, name: true, companyName: true } } },
  });
  if (!job) return res.status(404).json({ message: 'Job not found' });
  if (job.status !== 'ACTIVE') return res.status(409).json({ message: 'This job is closed' });

  // A CV is what the employer actually reviews, so require one.
  const cvUrl = req.dbUser.cvUrl;
  if (!cvUrl) {
    return res.status(400).json({
      message: 'Upload your CV in the profile before applying',
      code: 'CV_REQUIRED',
    });
  }

  const duplicate = await prisma.application.findUnique({
    where: { jobId_workerId: { jobId, workerId: req.user.userId } },
  });
  if (duplicate) {
    return res.status(409).json({ message: 'You have already applied to this job' });
  }

  const application = await prisma.application.create({
    data: {
      jobId,
      workerId: req.user.userId,
      coverLetter: data.coverLetter,
      // Snapshot the CV URL: if the worker later replaces their CV, the
      // employer still sees the file that was actually submitted.
      cvUrl,
    },
    include: { job: { include: { provider: providerSelect } }, worker: workerSelect },
  });

  await notify(job.providerId, {
    type: 'APPLICATION',
    title: 'New application',
    body: `${req.dbUser.name} applied for "${job.title}".`,
    link: `/provider/jobs/${jobId}/applicants`,
  });
  await logActivity(req, 'application.created', { jobId, applicationId: application.id });

  res.status(201).json({ application: publicApplication(application) });
});

/* ----------------------- worker: my applications ------------------------- */
const myApplications = asyncHandler(async (req, res) => {
  const applications = await prisma.application.findMany({
    where: { workerId: req.user.userId },
    include: { job: { include: { provider: providerSelect } } },
    orderBy: { createdAt: 'desc' },
  });
  res.status(200).json({ applications: applications.map(publicApplication) });
});

// DELETE /api/applications/:id - withdraw
const withdraw = asyncHandler(async (req, res) => {
  const id = idParam(req);
  if (!id) return res.status(400).json({ message: 'Invalid application id' });

  const application = await prisma.application.findUnique({ where: { id } });
  if (!application) return res.status(404).json({ message: 'Application not found' });
  if (application.workerId !== req.user.userId) {
    return res.status(403).json({ message: 'You can only withdraw your own applications' });
  }
  if (application.status === 'ACCEPTED') {
    return res.status(409).json({ message: 'An accepted application cannot be withdrawn' });
  }

  await prisma.application.delete({ where: { id } });
  await logActivity(req, 'application.withdrawn', { applicationId: id });

  res.status(200).json({ id, message: 'Application withdrawn' });
});

/* --------------------- employer: applicants per job ---------------------- */
// GET /api/applications/jobs/:jobId
const jobApplications = asyncHandler(async (req, res) => {
  const jobId = idParam(req, 'jobId');
  if (!jobId) return res.status(400).json({ message: 'Invalid job id' });

  const job = await prisma.job.findUnique({ where: { id: jobId } });
  if (!job) return res.status(404).json({ message: 'Job not found' });
  // Without this check any employer could read another company's applicants.
  if (job.providerId !== req.user.userId) {
    return res.status(403).json({ message: 'You can only view applicants for your own jobs' });
  }

  const applications = await prisma.application.findMany({
    where: { jobId },
    include: { worker: workerSelect },
    orderBy: { createdAt: 'desc' },
  });

  res.status(200).json({
    job: { id: job.id, title: job.title, status: job.status },
    applications: applications.map(publicApplication),
  });
});

// GET /api/applications/received - every applicant across the employer's jobs
const receivedApplications = asyncHandler(async (req, res) => {
  const applications = await prisma.application.findMany({
    where: { job: { providerId: req.user.userId } },
    include: { worker: workerSelect, job: { include: { provider: providerSelect } } },
    orderBy: { createdAt: 'desc' },
  });
  res.status(200).json({ applications: applications.map(publicApplication) });
});

/* --------------------- employer: change the status ----------------------- */
// PATCH /api/applications/:id/status
const updateStatus = asyncHandler(async (req, res) => {
  const id = idParam(req);
  if (!id) return res.status(400).json({ message: 'Invalid application id' });

  const { errors, data } = validateApplicationStatus(req.body);
  if (errors.length) return res.status(400).json({ message: errors[0], errors });

  const application = await prisma.application.findUnique({
    where: { id },
    include: { job: true },
  });
  if (!application) return res.status(404).json({ message: 'Application not found' });
  if (application.job.providerId !== req.user.userId) {
    return res.status(403).json({ message: 'You can only manage applications for your own jobs' });
  }

  const updated = await prisma.application.update({
    where: { id },
    data: { status: data.status },
    include: { worker: workerSelect, job: { include: { provider: providerSelect } } },
  });

  const label = {
    PENDING: 'moved back to pending',
    REVIEWED: 'reviewed',
    ACCEPTED: 'accepted',
    REJECTED: 'declined',
  }[data.status];

  await notify(application.workerId, {
    type: 'STATUS',
    title: `Application ${label}`,
    body: `Your application for "${application.job.title}" was ${label}.`,
    link: '/applications',
  });
  await logActivity(req, 'application.status_changed', { applicationId: id, status: data.status });

  res.status(200).json({ application: publicApplication(updated) });
});

export {
  apply, myApplications, withdraw,
  jobApplications, receivedApplications, updateStatus,
};
