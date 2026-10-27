const bcrypt = require('bcryptjs');
const { User } = require('../models');
const { generateToken } = require('../utils/jwt');
const AppError = require('../utils/AppError');
const AUTH_ERRORS = require('../constants/errors/auth.errors');
const USER_ERRORS = require('../constants/errors/user.errors');

exports.register = async (data) => {
    const { fullName, email, password } = data;

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
        const { message, statusCode } = USER_ERRORS.EMAIL_EXISTS;
        throw new AppError(message, statusCode);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
        fullName,
        email,
        password: hashedPassword,
        role: 'student'
    });

    return {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        role: user.role
    };
};

exports.login = async (email, password) => {
    const user = await User.findOne({ where: { email } });

    if (!user) {
        const { message, statusCode } = AUTH_ERRORS.INVALID_CREDENTIALS;
        throw new AppError(message, statusCode);
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        const { message, statusCode } = AUTH_ERRORS.INVALID_CREDENTIALS;
        throw new AppError(message, statusCode);
    }

    const token = generateToken(user);

    return {
        token,
        user: {
            id: user.id,
            fullName: user.fullName,
            email: user.email,
            role: user.role
        }
    };
};

exports.me = async (userId) => {
    const user = await User.findByPk(userId, {
        attributes: { exclude: ['password'] }
    });

    if (!user) {
        const { message, statusCode } = USER_ERRORS.NOT_FOUND;
        throw new AppError(message, statusCode);
    }

    return user;
};