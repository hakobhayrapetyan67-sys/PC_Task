const { verifyToken } = require('../utils/jwt');
const { User } = require('../models');
const AppError = require('../utils/AppError');
const AUTH_ERRORS = require('../constants/errors/auth.errors');
const asyncHandler = require('../utils/asyncHandler');

exports.authenticate = asyncHandler(async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        const { message, statusCode } = AUTH_ERRORS.TOKEN_MISSING;
        throw new AppError(message, statusCode);
    }

    const token = authHeader.split(' ')[1];

    let decoded;
    try {
        decoded = verifyToken(token);
    } catch (err) {
        const { message, statusCode } = AUTH_ERRORS.TOKEN_INVALID;
        throw new AppError(message, statusCode);
    }

    const user = await User.findByPk(decoded.id, {
        attributes: { exclude: ['password'] }
    });

    if (!user) {
        const { message, statusCode } = AUTH_ERRORS.TOKEN_INVALID;
        throw new AppError(message, statusCode);
    }

    req.user = user;
    next();
});

exports.authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            const { message, statusCode } = AUTH_ERRORS.FORBIDDEN;
            throw new AppError(message, statusCode);
        }
        next();
    };
};