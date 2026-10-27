const AppError = require('./AppError');

const e1 = new AppError('Course not found', 404);
const e2 = new AppError('Forbidden', 403);
const e3 = new AppError('DB crash', 5001);

console.log('Error 1:', e1.message, e1.statusCode, e1.status, e1.isOperational);
console.log('Error 2:', e2.message, e2.statusCode, e2.status, e2.isOperational);
console.log('Error 3:', e3.message, e3.statusCode, e3.status, e3.isOperational);