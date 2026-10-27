const ENROLLMENT_ERRORS = {
    NOT_FOUND: { statusCode: 404, message: 'Enrollment not found' },
    ALREADY_ENROLLED: { statusCode: 409, message: 'You are already enrolled in this course' },
    OWN_COURSE: { statusCode: 400, message: 'Instructors cannot enroll in their own courses' },
    INVALID_PROGRESS: { statusCode: 400, message: 'Progress must be between 0 and 100' },
    NOT_OWNER: { statusCode: 403, message: 'You can only modify your own enrollments' },
    CANNOT_UPDATE_CANCELLED: { statusCode: 400, message: 'Cannot update a cancelled enrollment' }
};

module.exports = ENROLLMENT_ERRORS;