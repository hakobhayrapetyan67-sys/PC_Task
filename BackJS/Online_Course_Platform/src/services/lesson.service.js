const { Lesson, Course, Enrollment } = require('../models');
const AppError = require('../utils/AppError');
const LESSON_ERRORS = require('../constants/errors/lesson.errors');
const COURSE_ERRORS = require('../constants/errors/course.errors');
const ENROLLMENT_ERRORS = require('../constants/errors/enrollment.errors');

exports.getLessonsByCourse = async (courseId, user) => {
    const course = await Course.findByPk(courseId);
    if (!course) {
        const { message, statusCode } = COURSE_ERRORS.NOT_FOUND;
        throw new AppError(message, statusCode);
    }

    const isOwner = course.instructorId === user.id;
    const isAdmin = user.role === 'admin';

    if (!isOwner && !isAdmin) {
        const enrollment = await Enrollment.findOne({
            where: { userId: user.id, courseId, status: ['active', 'completed'] }
        });
        if (!enrollment) {
            const { message, statusCode } = LESSON_ERRORS.NOT_ENROLLED;
            throw new AppError(message, statusCode);
        }
    }

    return await Lesson.findAll({
        where: { courseId },
        order: [['order', 'ASC']]
    });
};

exports.getLessonById = async (id, user) => {
    const lesson = await Lesson.findByPk(id, {
        include: [{ model: Course, as: 'course' }]
    });

    if (!lesson) {
        const { message, statusCode } = LESSON_ERRORS.NOT_FOUND;
        throw new AppError(message, statusCode);
    }

    const isOwner = lesson.course.instructorId === user.id;
    const isAdmin = user.role === 'admin';

    if (!isOwner && !isAdmin) {
        const enrollment = await Enrollment.findOne({
            where: { userId: user.id, courseId: lesson.courseId, status: ['active', 'completed'] }
        });
        if (!enrollment) {
            const { message, statusCode } = LESSON_ERRORS.NOT_ENROLLED;
            throw new AppError(message, statusCode);
        }
    }

    return lesson;
};

exports.createLesson = async (courseId, data, user) => {
    const course = await Course.findByPk(courseId);
    if (!course) {
        const { message, statusCode } = COURSE_ERRORS.NOT_FOUND;
        throw new AppError(message, statusCode);
    }

    if (course.instructorId !== user.id && user.role !== 'admin') {
        const { message, statusCode } = COURSE_ERRORS.NOT_OWNER;
        throw new AppError(message, statusCode);
    }

    if (!data.duration || data.duration <= 0) {
        const { message, statusCode } = LESSON_ERRORS.INVALID_DURATION;
        throw new AppError(message, statusCode);
    }

    const existing = await Lesson.findOne({
        where: { courseId, order: data.order }
    });
    if (existing) {
        const { message, statusCode } = LESSON_ERRORS.ORDER_EXISTS;
        throw new AppError(message, statusCode);
    }

    return await Lesson.create({ ...data, courseId });
};

exports.updateLesson = async (id, data, user) => {
    const lesson = await Lesson.findByPk(id, {
        include: [{ model: Course, as: 'course' }]
    });

    if (!lesson) {
        const { message, statusCode } = LESSON_ERRORS.NOT_FOUND;
        throw new AppError(message, statusCode);
    }

    if (lesson.course.instructorId !== user.id && user.role !== 'admin') {
        const { message, statusCode } = COURSE_ERRORS.NOT_OWNER;
        throw new AppError(message, statusCode);
    }

    if (data.order && data.order !== lesson.order) {
        const existing = await Lesson.findOne({
            where: { courseId: lesson.courseId, order: data.order }
        });
        if (existing) {
            const { message, statusCode } = LESSON_ERRORS.ORDER_EXISTS;
            throw new AppError(message, statusCode);
        }
    }

    await lesson.update(data);
    return lesson;
};

exports.deleteLesson = async (id, user) => {
    const lesson = await Lesson.findByPk(id, {
        include: [{ model: Course, as: 'course' }]
    });

    if (!lesson) {
        const { message, statusCode } = LESSON_ERRORS.NOT_FOUND;
        throw new AppError(message, statusCode);
    }

    if (lesson.course.instructorId !== user.id && user.role !== 'admin') {
        const { message, statusCode } = COURSE_ERRORS.NOT_OWNER;
        throw new AppError(message, statusCode);
    }

    await lesson.destroy();
};