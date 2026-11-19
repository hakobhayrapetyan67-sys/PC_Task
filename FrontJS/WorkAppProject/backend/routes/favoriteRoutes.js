import express from 'express';
import * as c from '../controllers/favoriteController.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

const router = express.Router();

router.use(requireAuth, requireRole('WORKER'));

router.get('/', c.listFavorites);
router.post('/:jobId/toggle', c.toggleFavorite);
router.post('/:jobId', c.addFavorite);
router.delete('/:jobId', c.removeFavorite);

export default router;
