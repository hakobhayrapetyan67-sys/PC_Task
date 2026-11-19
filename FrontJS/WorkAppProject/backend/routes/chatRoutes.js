import express from 'express';
import * as c from '../controllers/chatController.js';
import { requireAuth, requireVerifiedEmail } from '../middleware/auth.js';
import { uploadChatFile } from '../middleware/upload.js';

const router = express.Router();

router.use(requireAuth);

router.get('/unread-count', c.unreadCount);
router.get('/conversations', c.listConversations);

// Static segments before '/:id' so they are not swallowed by the param.
router.post('/conversations/job/:jobId', requireVerifiedEmail, c.openConversation);

router.get('/conversations/:id', c.getConversation);
router.get('/conversations/:id/messages', c.listMessages);
router.post('/conversations/:id/read', c.markRead);

// Accepts JSON or multipart with an optional "file" field.
router.post(
  '/conversations/:id/messages',
  requireVerifiedEmail,
  uploadChatFile.single('file'),
  c.sendMessage
);

export default router;
