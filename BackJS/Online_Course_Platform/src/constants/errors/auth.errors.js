const AUTH_ERRORS = {
    INVALID_CREDENTIALS: {
        statusCode: 401,
        message: 'Invalid email or password'
    },
    TOKEN_MISSING: {
        statusCode: 401,
        message: 'Token is missaing'
    },
    TOKEN_INVALID: {
        statusCode: 401,
        message: 'Token is invalid'
    },
    TOKEN_EXPIRED: {
        statusCode: 401,
        message: 'Token has expired'
    },
    FORBIDDEN: {
        statusCode: 403,
        MESSAGE: 'you are not allowed to perform this action'
    }
};

module.exports = AUTH_ERRORS;