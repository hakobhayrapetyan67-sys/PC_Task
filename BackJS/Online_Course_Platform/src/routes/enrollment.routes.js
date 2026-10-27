const express = require('express');
const router = express.Router();
const enrollmentController = require('../controllers/enrollment.controller');
const { authenticate, authorize } = require('../middlewares/auth.middleware');
const ROLES = require('../constants/roles');

router.post('/', authenticate, authorize(ROLES.STUDENT), enrollmentController.enroll);

router.get('/me', authenticate, enrollmentController.getMy);

router.patch('/:id/progress', authenticate, authorize(ROLES.STUDENT), enrollmentController.updateProgress);

router.delete('/:id', authenticate, enrollmentController.remove);

router.get('/', authenticate, authorize(ROLES.ADMIN), enrollmentController.getAll);

module.exports = router;
