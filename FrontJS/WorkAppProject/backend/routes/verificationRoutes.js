import express from 'express';
import * as c from '../controllers/verificationController.js';
import { requireAuth, requireRole, requireVerifiedEmail, requireAdmin } from '../middleware/auth.js';
import { uploadDocument } from '../middleware/upload.js';

const router = express.Router();

router.use(requireAuth);

// --- admin (ADMIN_EMAIL in .env) ---
router.get('/requests', requireAdmin, c.listRequests);
router.post('/:id/review', requireAdmin, c.reviewRequest);

// --- employer ---
router.get('/status', requireRole('PROVIDER'), c.getStatus);
router.post(
  '/',
  requireRole('PROVIDER'),
  requireVerifiedEmail,
  uploadDocument.single('document'),
  c.submitRequest
);

export default router;
