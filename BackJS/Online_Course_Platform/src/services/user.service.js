const { User, Course, Enrollment } = require('../models');
const AppError = require('../utils/AppError');
const USER_ERRORS = require('../constants/errors/user.errors');
const ROLES = require('../constants/roles');

exports.getAllUsers = async (filter) => {
    const where = {};
    if (filter.role) where.role = filter.role;

    return await User.findAll({
        where,
        attributes: { exclude: ['password'] },
        order: [['createdAt', 'DESC']]
    });
};

exports.getUserById = async (id) => {
    const user = await User.findByPk(id, {
        attributes: { exclude: ['password'] },
        include: [
            {
                model: Course,
                as: 'courses',
                required: false,
                attributes: ['id', 'title', 'isPublished']
            },
            {
                model: Course,
                as: 'enrolledCourses',
                required: false,
                attributes: ['id', 'title'],
                through: { attributes: ['status', 'progress'] }
            }
        ]
    });

    if (!user) {
        const { message, statusCode } = USER_ERRORS.NOT_FOUND;
        throw new AppError(message, statusCode);
    }
    return user;
};

exports.changeRole = async (id, newRole, currentUser) => {
    if (!Object.values(ROLES).includes(newRole)) {
        const { message, statusCode } = USER_ERRORS.INVALID_ROLE;
        throw new AppError(message, statusCode);
    }

    if (id === currentUser.id) {
        const { message, statusCode } = USER_ERRORS.CANNOT_CHANGE_OWN_ROLE;
        throw new AppError(message, statusCode);
    }

    const user = await User.findByPk(id);
    if (!user) {
        const { message, statusCode } = USER_ERRORS.NOT_FOUND;
        throw new AppError(message, statusCode);
    }

    user.role = newRole;
    await user.save();

    return {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        role: user.role
    };
};

exports.deleteUser = async (id, currentUser) => {
    if (id === currentUser.id) {
        const { message, statusCode } = USER_ERRORS.CANNOT_DELETE_SELF;
        throw new AppError(message, statusCode);
    }

    const user = await User.findByPk(id);
    if (!user) {
        const { message, statusCode } = USER_ERRORS.NOT_FOUND;
        throw new AppError(message, statusCode);
    }

    await user.destroy();
};