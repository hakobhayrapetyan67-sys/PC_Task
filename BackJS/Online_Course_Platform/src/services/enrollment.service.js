const { Enrollment, Course, User } = require('../models');
const AppError = require('../utils/AppError');
const ENROLLMENT_ERRORS = require('../constants/errors/enrollment.errors');
const COURSE_ERRORS = require('../constants/errors/course.errors');

exports.enroll = async (userId, courseId) => {
    const course = await Course.findByPk(courseId);
    if (!course) {
        const { message, statusCode } = COURSE_ERRORS.NOT_FOUND;
        throw new AppError(message, statusCode);
    }

    if (!course.isPublished) {
        const { message, statusCode } = COURSE_ERRORS.NOT_PUBLISHED;
        throw new AppError(message, statusCode);
    }

    if (course.instructorId === userId) {
        const { message, statusCode } = ENROLLMENT_ERRORS.OWN_COURSE;
        throw new AppError(message, statusCode);
    }

    const existing = await Enrollment.findOne({ where: { userId, courseId } });
    if (existing) {
        const { message, statusCode } = ENROLLMENT_ERRORS.ALREADY_ENROLLED;
        throw new AppError(message, statusCode);
    }

    return await Enrollment.create({ userId, courseId });
};

exports.getMyEnrollments = async (userId) => {
    return await Enrollment.findAll({
        where: { userId },
        include: [{
            model: Course,
            as: 'course',
            include: [{
                model: User,
                as: 'instructor',
                attributes: ['id', 'fullName', 'email']
            }]
        }],
        order: [['createdAt', 'DESC']]
    });
};

exports.updateProgress = async (id, userId, progress) => {
    const enrollment = await Enrollment.findByPk(id);

    if (!enrollment) {
        const { message, statusCode } = ENROLLMENT_ERRORS.NOT_FOUND;
        throw new AppError(message, statusCode);
    }

    if (enrollment.userId !== userId) {
        const { message, statusCode } = ENROLLMENT_ERRORS.NOT_OWNER;
        throw new AppError(message, statusCode);
    }

    if (enrollment.status === 'cancelled') {
        const { message, statusCode } = ENROLLMENT_ERRORS.CANNOT_UPDATE_CANCELLED;
        throw new AppError(message, statusCode);
    }

    if (progress < 0 || progress > 100) {
        const { message, statusCode } = ENROLLMENT_ERRORS.INVALID_PROGRESS;
        throw new AppError(message, statusCode);
    }

    enrollment.progress = progress;
    if (progress === 100) {
        enrollment.status = 'completed';
    }

    await enrollment.save();
    return enrollment;
};

exports.cancelEnrollment = async (id, user) => {
    const enrollment = await Enrollment.findByPk(id);

    if (!enrollment) {
        const { message, statusCode } = ENROLLMENT_ERRORS.NOT_FOUND;
        throw new AppError(message, statusCode);
    }

    if (enrollment.userId !== user.id && user.role !== 'admin') {
        const { message, statusCode } = ENROLLMENT_ERRORS.NOT_OWNER;
        throw new AppError(message, statusCode);
    }

    await enrollment.destroy();
};

exports.getAllEnrollments = async () => {
    return await Enrollment.findAll({
        include: [
            { model: User, as: 'student', attributes: ['id', 'fullName', 'email'] },
            { model: Course, as: 'course', attributes: ['id', 'title', 'category'] }
        ],
        order: [['createdAt', 'DESC']]
    });
};