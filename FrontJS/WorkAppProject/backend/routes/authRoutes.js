import express from 'express';
import * as c from '../controllers/authController.js';
import { requireAuth } from '../middleware/auth.js';
import rateLimit from '../middleware/rateLimit.js';

const router = express.Router();

// Brute-force protection on the credential endpoints.
const tight = rateLimit({ windowMs: 15 * 60 * 1000, max: 20 });
const loose = rateLimit({ windowMs: 60 * 60 * 1000, max: 10 });

router.post('/register', tight, c.register);
router.post('/login', tight, c.login);

router.post('/verify-email', c.verifyEmail);
router.get('/verify-email', c.verifyEmail); // allows opening the link directly
router.post('/resend-verification', requireAuth, loose, c.resendVerification);

router.post('/forgot-password', loose, c.forgotPassword);
router.post('/reset-password', tight, c.resetPassword);
router.post('/change-password', requireAuth, c.changePassword);

router.get('/me', requireAuth, c.me);
router.post('/logout', requireAuth, c.logout);

export default router;
