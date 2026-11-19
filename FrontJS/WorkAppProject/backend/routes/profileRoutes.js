import express from 'express';
import * as c from '../controllers/profileController.js';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { uploadAvatar, uploadCv } from '../middleware/upload.js';

const router = express.Router();

// Public profile first - it is the only unauthenticated route here.
router.get('/public/:id', c.getPublicProfile);

router.use(requireAuth);

router.get('/', c.getProfile);
router.patch('/', c.updateProfile);
router.get('/activity', c.getActivity);

router.post('/avatar', uploadAvatar.single('avatar'), c.uploadAvatarFile);
router.post('/cv', requireRole('WORKER'), uploadCv.single('cv'), c.uploadCvFile);

router.get('/notifications', c.listNotifications);
router.post('/notifications/:id/read', c.markNotificationsRead);

export default router;
