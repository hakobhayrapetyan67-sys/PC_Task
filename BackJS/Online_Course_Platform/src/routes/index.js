const express = require('express');
const router = express.Router();

router.use('/auth', require('./auth.routes'));
router.use('/courses', require('./course.routes'));
router.use('/lessons', require('./lesson.routes'));
router.use('/enrollments', require('./enrollment.routes'));
router.use('/users', require('./user.routes'));

module.exports = router;