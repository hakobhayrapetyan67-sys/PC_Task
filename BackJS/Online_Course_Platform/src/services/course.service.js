const { Course, User, Lesson } = require('../models');
const AppError = require('../utils/AppError');
const COURSE_ERRORS = require('../constants/errors/course.errors');

exports.getAllCourses = async (filters) => {
    const where = { isPublished: true };
    if (filters.category) where.category = filters.category;
    if (filters.level) where.level = filters.level;

    return await Course.findAll({
        where,
        include: [{
            model: User,
            as: 'instructor',
            attributes: ['id', 'fullName', 'email']
        }],
        attributes: {
            include: [
                [
                    require('sequelize').fn('COUNT', require('sequelize').col('lessons.id')),
                    'lessonCount'
                ]
            ]
        },
        include: [
            { model: User, as: 'instructor', attributes: ['id', 'fullName', 'email'] },
            { model: Lesson, as: 'lessons', attributes: [] }
        ],
        group: ['Course.id', 'instructor.id']
    });
};


exports.getMyCourses = async (instructorId) => {
    return await Course.findAll({
        where: { instructorId },
        include: [{ model: Lesson, as: 'lessons', attributes: ['id', 'title', 'order'] }]
    });
};

exports.getCourseById = async (id) => {
    const course = await Course.findByPk(id, {
        include: [
            { model: User, as: 'instructor', attributes: ['id', 'fullName', 'email'] },
            { model: Lesson, as: 'lessons' }
        ],
        order: [[{ model: Lesson, as: 'lessons' }, 'order', 'ASC']]
    });

    if (!course) {
        const { message, statusCode } = COURSE_ERRORS.NOT_FOUND;
        throw new AppError(message, statusCode);
    }
    return course;
};

exports.createCourse = async (data, user) => {
    const { title, description, category, level, price } = data;

    if (!title) {
        const { message, statusCode } = COURSE_ERRORS.TITLE_REQUIRED;
        throw new AppError(message, statusCode);
    }

    if (price !== undefined && price < 0) {
        const { message, statusCode } = COURSE_ERRORS.INVALID_PRICE;
        throw new AppError(message, statusCode);
    }

    return await Course.create({
        title,
        description,
        category,
        level: level || 'beginner',
        price: price || 0,
        instructorId: user.id
    });
};

exports.updateCourse = async (id, data, user) => {
    const course = await Course.findByPk(id);

    if (!course) {
        const { message, statusCode } = COURSE_ERRORS.NOT_FOUND;
        throw new AppError(message, statusCode);
    }

    if (course.instructorId !== user.id && user.role !== 'admin') {
        const { message, statusCode } = COURSE_ERRORS.NOT_OWNER;
        throw new AppError(message, statusCode);
    }

    await course.update(data);
    return course;
};

exports.deleteCourse = async (id, user) => {
    const course = await Course.findByPk(id);

    if (!course) {
        const { message, statusCode } = COURSE_ERRORS.NOT_FOUND;
        throw new AppError(message, statusCode);
    }

    if (course.instructorId !== user.id && user.role !== 'admin') {
        const { message, statusCode } = COURSE_ERRORS.NOT_OWNER;
        throw new AppError(message, statusCode);
    }

    await course.destroy();
};
exports.getCourseStudents = async (courseId, user) => {
    const course = await Course.findByPk(courseId);

    if (!course) {
        const { message, statusCode } = COURSE_ERRORS.NOT_FOUND;
        throw new AppError(message, statusCode);
    }

    if (course.instructorId !== user.id && user.role !== 'admin') {
        const { message, statusCode } = COURSE_ERRORS.NOT_OWNER;
        throw new AppError(message, statusCode);
    }

    const students = await User.findAll({
        include: [{
            model: Course,
            as: 'enrolledCourses',
            where: { id: courseId },
            attributes: [],
            through: { attributes: ['status', 'progress', 'enrolledAt'] }
        }],
        attributes: ['id', 'fullName', 'email']
    });

    return students;
};