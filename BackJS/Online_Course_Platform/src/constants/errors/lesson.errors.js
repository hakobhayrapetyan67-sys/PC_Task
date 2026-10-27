const LESSON_ERRORS = {
    NOT_FOUND: {
        statusCode: 404,
        message: 'Lesson not found'
    },
    ORDER_EXISTS: {
        statusCode: 409,
        message: 'A lesson with tis order already exists in this course'
    },
    NOT_ENROLLED: {
        statusCode: 403,
        message: 'You must be enrolled in this course to view lessons'
    },
    INVALID_DURATION: {
        statusCode: 400,
        message: 'Duration must be greater than 0'
    }
};

module.expors = LESSON_ERRORS;