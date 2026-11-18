const express = require('express');
const { createJob, getJobs } = require('../controllers/jobController');
const { authenticateToken, checkRole } = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/', authenticateToken, getJobs);
router.post('/', authenticateToken, checkRole('PROVIDER'), createJob);

module.exports = router;