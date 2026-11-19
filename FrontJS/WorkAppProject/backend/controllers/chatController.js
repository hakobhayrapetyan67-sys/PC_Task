import prisma from '../lib/prisma.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { publicMessage, publicConversation } from '../lib/serialize.js';
import { validateMessage } from '../lib/validators.js';
import { publicUrl } from '../middleware/upload.js';
import { notify } from '../lib/notify.js';
import { logActivity } from '../lib/activity.js';

const participantSelect = {
  select: {
    id: true, name: true, avatarUrl: true, headline: true, location: true,
    companyName: true, verificationStatus: true,
  },
};

const idParam = (req, key = 'id') => {
  const id = Number(req.params[key]);
  return Number.isInteger(id) && id > 0 ? id : null;
};

// Loads a conversation and refuses it to anyone who is not one of the two
// participants. Every chat route goes through this.
async function loadOwnConversation(conversationId, userId) {
  const conversation = await prisma.conversation.findUnique({
    where: { id: conversationId },
    include: {
      job: { select: { id: true, title: true, status: true } },
      worker: participantSelect,
      provider: participantSelect,
    },
  });
  if (!conversation) return { error: { status: 404, message: 'Conversation not found' } };
  if (conversation.workerId !== userId && conversation.providerId !== userId) {
    return { error: { status: 403, message: 'This conversation is not yours' } };
  }
  return { conversation };
}

/* ---------------------- GET /api/chat/conversations ---------------------- */
const listConversations = asyncHandler(async (req, res) => {
  const userId = req.user.userId;

  const conversations = await prisma.conversation.findMany({
    where: { OR: [{ workerId: userId }, { providerId: userId }] },
    include: {
      job: { select: { id: true, title: true, status: true } },
      worker: participantSelect,
      provider: participantSelect,
      // Newest message for the preview line
      messages: { orderBy: { createdAt: 'desc' }, take: 1, include: { sender: participantSelect } },
    },
    orderBy: { lastMessageAt: 'desc' },
  });

  // Unread has to be counted per thread: a plain `_count` would include the
  // viewer's own messages.
  const withUnread = await Promise.all(
    conversations.map(async (c) => {
      const unread = await prisma.message.count({
        where: { conversationId: c.id, senderId: { not: userId }, readAt: null },
      });
      return { ...publicConversation(c, userId), unread };
    })
  );

  const totalUnread = withUnread.reduce((sum, c) => sum + c.unread, 0);
  res.status(200).json({ conversations: withUnread, totalUnread });
});

/* ------------------- POST /api/chat/conversations/job/:jobId ------------- */
// Opens (or reuses) the thread for a job. A worker may only start one after
// applying; an employer may start one with anyone who applied to their job.
const openConversation = asyncHandler(async (req, res) => {
  const jobId = idParam(req, 'jobId');
  if (!jobId) return res.status(400).json({ message: 'Invalid job id' });

  const job = await prisma.job.findUnique({ where: { id: jobId } });
  if (!job) return res.status(404).json({ message: 'Job not found' });

  let workerId;
  let providerId = job.providerId;

  if (req.user.role === 'WORKER') {
    workerId = req.user.userId;
    const application = await prisma.application.findUnique({
      where: { jobId_workerId: { jobId, workerId } },
    });
    if (!application) {
      return res.status(403).json({
        message: 'Apply to this job before messaging the employer',
        code: 'APPLY_FIRST',
      });
    }
  } else {
    // Employer: must own the job and name the candidate.
    if (job.providerId !== req.user.userId) {
      return res.status(403).json({ message: 'You can only message candidates of your own jobs' });
    }
    workerId = Number(req.body?.workerId);
    if (!Number.isInteger(workerId) || workerId <= 0) {
      return res.status(400).json({ message: 'workerId is required' });
    }
    const application = await prisma.application.findUnique({
      where: { jobId_workerId: { jobId, workerId } },
    });
    if (!application) {
      return res.status(403).json({ message: 'That candidate has not applied to this job' });
    }
  }

  const existing = await prisma.conversation.findUnique({
    where: { jobId_workerId: { jobId, workerId } },
    include: {
      job: { select: { id: true, title: true, status: true } },
      worker: participantSelect,
      provider: participantSelect,
    },
  });
  if (existing) {
    return res.status(200).json({ conversation: publicConversation(existing, req.user.userId) });
  }

  const created = await prisma.conversation.create({
    data: { jobId, workerId, providerId },
    include: {
      job: { select: { id: true, title: true, status: true } },
      worker: participantSelect,
      provider: participantSelect,
    },
  });

  await logActivity(req, 'chat.conversation_opened', { conversationId: created.id, jobId });
  res.status(201).json({ conversation: publicConversation(created, req.user.userId) });
});

/* ------------------ GET /api/chat/conversations/:id ---------------------- */
const getConversation = asyncHandler(async (req, res) => {
  const id = idParam(req);
  if (!id) return res.status(400).json({ message: 'Invalid conversation id' });

  const { conversation, error } = await loadOwnConversation(id, req.user.userId);
  if (error) return res.status(error.status).json({ message: error.message });

  res.status(200).json({ conversation: publicConversation(conversation, req.user.userId) });
});

/* --------------- GET /api/chat/conversations/:id/messages --------------- */
const listMessages = asyncHandler(async (req, res) => {
  const id = idParam(req);
  if (!id) return res.status(400).json({ message: 'Invalid conversation id' });

  const { conversation, error } = await loadOwnConversation(id, req.user.userId);
  if (error) return res.status(error.status).json({ message: error.message });

  // `after` lets the client poll for just the new messages.
  const after = Number(req.query.after);
  const where = { conversationId: id };
  if (Number.isInteger(after) && after > 0) where.id = { gt: after };

  const messages = await prisma.message.findMany({
    where,
    include: { sender: participantSelect },
    orderBy: { createdAt: 'asc' },
    take: 200,
  });

  // Opening the thread marks the other side's messages as read.
  await prisma.message.updateMany({
    where: { conversationId: id, senderId: { not: req.user.userId }, readAt: null },
    data: { readAt: new Date() },
  });

  res.status(200).json({
    conversation: publicConversation(conversation, req.user.userId),
    messages: messages.map(publicMessage),
  });
});

/* -------------- POST /api/chat/conversations/:id/messages --------------- */
// Accepts JSON or multipart (field "file"). Emoji arrive as ordinary UTF-8
// characters in `body`, so nothing special is needed to store them.
const sendMessage = asyncHandler(async (req, res) => {
  const id = idParam(req);
  if (!id) return res.status(400).json({ message: 'Invalid conversation id' });

  const { conversation, error } = await loadOwnConversation(id, req.user.userId);
  if (error) return res.status(error.status).json({ message: error.message });

  const { errors, data } = validateMessage(req.body);
  if (errors.length) return res.status(400).json({ message: errors[0], errors });

  // A message needs text, a file, or both.
  if (!data.body && !req.file) {
    return res.status(400).json({ message: 'Write something or attach a file' });
  }

  const message = await prisma.message.create({
    data: {
      conversationId: id,
      senderId: req.user.userId,
      body: data.body,
      attachmentUrl: req.file ? publicUrl('chat', req.file.filename) : null,
      attachmentName: req.file ? req.file.originalname : null,
      attachmentType: req.file ? req.file.mimetype : null,
      attachmentSize: req.file ? req.file.size : null,
    },
    include: { sender: participantSelect },
  });

  // Keeps the conversation list ordered by recency.
  await prisma.conversation.update({
    where: { id },
    data: { lastMessageAt: new Date() },
  });

  const recipientId =
    conversation.workerId === req.user.userId ? conversation.providerId : conversation.workerId;

  await notify(recipientId, {
    type: 'MESSAGE',
    title: `New message from ${req.dbUser.name}`,
    body: data.body ? data.body.slice(0, 90) : `Sent a file: ${req.file.originalname}`,
    link: `/messages/${id}`,
  });
  await logActivity(req, 'chat.message_sent', { conversationId: id, hasFile: Boolean(req.file) });

  res.status(201).json({ message: publicMessage(message) });
});

/* ---------------- POST /api/chat/conversations/:id/read ----------------- */
const markRead = asyncHandler(async (req, res) => {
  const id = idParam(req);
  if (!id) return res.status(400).json({ message: 'Invalid conversation id' });

  const { error } = await loadOwnConversation(id, req.user.userId);
  if (error) return res.status(error.status).json({ message: error.message });

  const { count } = await prisma.message.updateMany({
    where: { conversationId: id, senderId: { not: req.user.userId }, readAt: null },
    data: { readAt: new Date() },
  });

  res.status(200).json({ conversationId: id, markedRead: count });
});

/* --------------------- GET /api/chat/unread-count ----------------------- */
// Powers the badge in the navbar.
const unreadCount = asyncHandler(async (req, res) => {
  const count = await prisma.message.count({
    where: {
      senderId: { not: req.user.userId },
      readAt: null,
      conversation: {
        OR: [{ workerId: req.user.userId }, { providerId: req.user.userId }],
      },
    },
  });
  res.status(200).json({ unread: count });
});

export {
  listConversations, openConversation, getConversation,
  listMessages, sendMessage, markRead, unreadCount,
};
