import express from 'express';
import * as c from '../controllers/applicationController.js';
import { requireAuth, requireRole, requireVerifiedEmail } from '../middleware/auth.js';

const router = express.Router();

router.use(requireAuth);

// --- worker ---
router.get('/mine', requireRole('WORKER'), c.myApplications);
router.post('/jobs/:jobId', requireRole('WORKER'), requireVerifiedEmail, c.apply);
router.delete('/:id', requireRole('WORKER'), c.withdraw);

// --- employer ---
router.get('/received', requireRole('PROVIDER'), c.receivedApplications);
router.get('/jobs/:jobId', requireRole('PROVIDER'), c.jobApplications);
router.patch('/:id/status', requireRole('PROVIDER'), c.updateStatus);

export default router;
