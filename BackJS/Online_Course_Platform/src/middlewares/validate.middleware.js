const AppError = require('../utils/AppError');

const validate = (schema) => {
    return (req, res, next) => {
        const errors = [];

        for (const [field, rules] of Object.entries(schema)) {
            const value = req.body[field];

            if (rules.required && (value === undefined || value === null || value === '')) {
                errors.push(`${field} is required`);
                continue;
            }

            if (value === undefined || value === null) continue;

            if (rules.type && typeof value !== rules.type) {
                errors.push(`${field} must be a ${rules.type}`);
            }

            if (rules.minLength && value.length < rules.minLength) {
                errors.push(`${field} must be at least ${rules.minLength} characters`);
            }

            if (rules.maxLength && value.length > rules.maxLength) {
                errors.push(`${field} must be at most ${rules.maxLength} characters`);
            }

            if (rules.enum && !rules.enum.includes(value)) {
                errors.push(`${field} must be one of: ${rules.enum.join(', ')}`);
            }

            if (rules.min !== undefined && value < rules.min) {
                errors.push(`${field} must be at least ${rules.min}`);
            }

            if (rules.max !== undefined && value > rules.max) {
                errors.push(`${field} must be at most ${rules.max}`);
            }
        }

        if (errors.length > 0) {
            return next(new AppError(errors.join(', '), 400));
        }

        next();
    };
};

module.exports = validate;