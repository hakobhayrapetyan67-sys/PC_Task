const { sequelize } = require('../config/database');

const { DataTypes } = require('sequelize');

const User = require('./user.model')(sequelize, DataTypes);
const Course = require('./course.model')(sequelize, DataTypes);
const Lesson = require('./lesson.model')(sequelize, DataTypes);
const Enrollment = require('./enrollment.model')(sequelize, DataTypes);

User.hasMany(Course, {
    as: 'courses',                              
    foreignKey: 'instructorId',                 
    onDelete: 'CASCADE'
});
Course.belongsTo(User, {
    as: 'instructor',
    foreignKey: 'instructorId'
});
Course.hasMany(Lesson, {
    as: 'lessons',
    foreignKey: 'courseId',
    onDelete: 'CASCADE'                        
});

Lesson.belongsTo(Course, {
    as: 'course',
    foreignKey: 'courseId'
});

User.belongsToMany(Course, {
    through: Enrollment,                       
    as: 'enrolledCourses',                     
    foreignKey: 'userId',                       
    otherKey: 'courseId'                        
});

Course.belongsToMany(User, {
    through: Enrollment,
    as: 'students',                             
    foreignKey: 'courseId',
    otherKey: 'userId'
});



Enrollment.belongsTo(User, {
    as: 'student',
    foreignKey: 'userId'
});


Enrollment.belongsTo(Course, {
    as: 'course',
    foreignKey: 'courseId'
});

User.hasMany(Enrollment, {
    as: 'enrollments',
    foreignKey: 'userId'
});


Course.hasMany(Enrollment, {
    as: 'enrollments',
    foreignKey: 'courseId'
});


module.exports = {
    sequelize,
    User,
    Course,
    Lesson,
    Enrollment
};