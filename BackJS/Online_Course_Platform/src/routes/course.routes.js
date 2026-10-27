const express = require('express');
const router = express.Router();
const courseController = require('../controllers/course.controller');
const lessonController = require('../controllers/lesson.controller');
const { authenticate, authorize } = require('../middlewares/auth.middleware');
const ROLES = require('../constants/roles');

router.get('/', courseController.getAll);

router.get('/my', authenticate, authorize(ROLES.INSTRUCTOR, ROLES.ADMIN), courseController.getMy);

router.get('/:id', courseController.getById);

router.post('/', authenticate, authorize(ROLES.INSTRUCTOR, ROLES.ADMIN), courseController.create);
router.put('/:id', authenticate, authorize(ROLES.INSTRUCTOR, ROLES.ADMIN), courseController.update);
router.delete('/:id', authenticate, authorize(ROLES.INSTRUCTOR, ROLES.ADMIN), courseController.remove);

router.get('/:id/students', authenticate, authorize(ROLES.INSTRUCTOR, ROLES.ADMIN), courseController.getStudents);

router.get('/:courseId/lessons', authenticate, lessonController.getByCourse);
router.post('/:courseId/lessons', authenticate, authorize(ROLES.INSTRUCTOR, ROLES.ADMIN), lessonController.create);

module.exports = router;