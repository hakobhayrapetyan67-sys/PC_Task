import prisma from '../lib/prisma.js';
import env from '../config/env.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { publicUser } from '../lib/serialize.js';
import { validateVerificationRequest } from '../lib/validators.js';
import { publicUrl } from '../middleware/upload.js';
import { notify } from '../lib/notify.js';
import { logActivity } from '../lib/activity.js';

const shape = (r) =>
  !r
    ? null
    : {
        id: r.id,
        userId: r.userId,
        companyName: r.companyName,
        taxId: r.taxId ?? null,
        documentUrl: r.documentUrl,
        status: r.status,
        note: r.note ?? null,
        createdAt: r.createdAt,
        reviewedAt: r.reviewedAt ?? null,
        user: r.user
          ? { id: r.user.id, name: r.user.name, email: r.user.email, companyName: r.user.companyName }
          : undefined,
      };

// GET /api/verification/status
const getStatus = asyncHandler(async (req, res) => {
  const latest = await prisma.verificationRequest.findFirst({
    where: { userId: req.user.userId },
    orderBy: { createdAt: 'desc' },
  });

  res.status(200).json({
    verificationStatus: req.dbUser.verificationStatus,
    verificationNote: req.dbUser.verificationNote ?? null,
    request: shape(latest),
  });
});

// POST /api/verification  (multipart, field "document")
const submitRequest = asyncHandler(async (req, res) => {
  // State first: "already verified" / "already under review" is more useful to
  // the caller than a complaint about the body they do not need to resend.
  if (req.dbUser.verificationStatus === 'VERIFIED') {
    return res.status(409).json({ message: 'Your company is already verified' });
  }
  if (req.dbUser.verificationStatus === 'PENDING') {
    return res.status(409).json({ message: 'A request is already under review' });
  }

  const { errors, data } = validateVerificationRequest(req.body);
  if (errors.length) return res.status(400).json({ message: errors[0], errors });
  if (!req.file) {
    return res.status(400).json({ message: 'Attach a company document (field "document")' });
  }

  const autoApprove = env.VERIFICATION_MODE === 'auto';
  const status = autoApprove ? 'VERIFIED' : 'PENDING';

  const request = await prisma.verificationRequest.create({
    data: {
      userId: req.user.userId,
      companyName: data.companyName,
      taxId: data.taxId,
      documentUrl: publicUrl('document', req.file.filename),
      status,
      reviewedAt: autoApprove ? new Date() : null,
      note: autoApprove ? 'Auto-approved (VERIFICATION_MODE=auto)' : null,
    },
  });

  // Keep the denormalised status on User in step: every auth guard reads it.
  const user = await prisma.user.update({
    where: { id: req.user.userId },
    data: {
      verificationStatus: status,
      companyName: data.companyName,
      verificationNote: autoApprove ? null : null,
    },
  });

  await notify(req.user.userId, {
    type: 'VERIFICATION',
    title: autoApprove ? 'Company verified' : 'Verification request submitted',
    body: autoApprove
      ? 'Your company is verified. You can publish jobs now.'
      : 'We received your documents. Review usually takes 1-2 business days.',
    link: '/provider/verification',
  });
  await logActivity(req, 'verification.submitted', { requestId: request.id, status });

  res.status(201).json({ request: shape(request), user: publicUser(user) });
});

/* -------------------------------- admin ---------------------------------- */
// GET /api/verification/requests?status=PENDING
const listRequests = asyncHandler(async (req, res) => {
  const status = String(req.query.status || '').toUpperCase();
  const where = ['PENDING', 'VERIFIED', 'REJECTED'].includes(status) ? { status } : {};

  const requests = await prisma.verificationRequest.findMany({
    where,
    include: { user: { select: { id: true, name: true, email: true, companyName: true } } },
    orderBy: { createdAt: 'desc' },
  });

  res.status(200).json({ requests: requests.map(shape) });
});

// POST /api/verification/:id/review  { status: VERIFIED | REJECTED, note? }
const reviewRequest = asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ message: 'Invalid request id' });
  }

  const status = String(req.body?.status || '').toUpperCase();
  if (!['VERIFIED', 'REJECTED'].includes(status)) {
    return res.status(400).json({ message: 'Status must be VERIFIED or REJECTED' });
  }
  const note = typeof req.body?.note === 'string' ? req.body.note.trim().slice(0, 500) : null;
  if (status === 'REJECTED' && !note) {
    return res.status(400).json({ message: 'A rejection needs a note explaining why' });
  }

  const request = await prisma.verificationRequest.findUnique({ where: { id } });
  if (!request) return res.status(404).json({ message: 'Verification request not found' });

  const [updated] = await Promise.all([
    prisma.verificationRequest.update({
      where: { id },
      data: { status, note, reviewedAt: new Date() },
    }),
    prisma.user.update({
      where: { id: request.userId },
      data: { verificationStatus: status, verificationNote: note },
    }),
  ]);

  await notify(request.userId, {
    type: 'VERIFICATION',
    title: status === 'VERIFIED' ? 'Company verified' : 'Verification rejected',
    body:
      status === 'VERIFIED'
        ? 'Your company is verified. You can publish jobs now.'
        : `Your request was rejected: ${note}`,
    link: '/provider/verification',
  });
  await logActivity(req, 'verification.reviewed', { requestId: id, status });

  res.status(200).json({ request: shape(updated) });
});

export { getStatus, submitRequest, listRequests, reviewRequest };
