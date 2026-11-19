import express from 'express';
import * as c from '../controllers/jobController.js';
import {
  requireAuth, optionalAuth, requireRole, requireVerifiedEmail, requireVerifiedCompany,
} from '../middleware/auth.js';

const router = express.Router();

// --- public ---
router.get('/', optionalAuth, c.listJobs);
router.get('/meta', c.getMeta);

// --- employer ---
// Static segments must be declared before '/:id', otherwise "mine" and "meta"
// would be captured as an id.
router.get('/mine', requireAuth, requireRole('PROVIDER'), c.myJobs);

router.post(
  '/',
  requireAuth,
  requireRole('PROVIDER'),
  requireVerifiedEmail,   // email confirmed
  requireVerifiedCompany, // company verified
  c.createJob
);
router.patch('/:id', requireAuth, requireRole('PROVIDER'), c.updateJob);
router.delete('/:id', requireAuth, requireRole('PROVIDER'), c.deleteJob);

// --- public, last because of the wildcard param ---
router.get('/:id', optionalAuth, c.getJob);

export default router;
