const AppError = require('../utils/AppError');

const errorHandler = (err, req, res, next) => {
    let statusCode = err.statusCode || 500;
    let message = err.message || 'Something went wrong';

    if (err.name === 'SequelizeValidationError') {
        statusCode = 400;
        message = err.errors.map(e => e.message).join(', ');
    }

    if (err.name === 'SequelizeUniqueConstraintError') {
        statusCode = 409;
        message = err.errors.map(e => e.message).join(', ');
    }

    if (err.name === 'SequelizeForeignKeyConstraintError') {
        statusCode = 400;
        message = 'Foreign key constraint error';
    }

    if (err.name === 'JsonWebTokenError') {
        statusCode = 401;
        message = 'Token is invalid';
    }

    if (err.name === 'TokenExpiredError') {
        statusCode = 401;
        message = 'Token has expired';
    }

    if (statusCode === 500) {
        console.error('REAL ERROR:', err);
    }

    res.status(statusCode).json({
        success: false,
        statusCode,
        message
    });
};

module.exports = errorHandler;