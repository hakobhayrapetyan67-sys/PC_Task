const bcrypt = require('bcryptjs');
const { sequelize, ensureDatabaseExists } = require('../config/database');
const { User, Course, Lesson, Enrollment } = require('../models');

const seed = async () => {
    try {
        await ensureDatabaseExists();
        await sequelize.authenticate();
        await sequelize.sync({ alter: true });

        console.log('Seeding database...');

        const hash = await bcrypt.hash('secret123', 10);

        await sequelize.query('SET FOREIGN_KEY_CHECKS = 0');
        await Enrollment.destroy({ where: {}, truncate: true });
        await Lesson.destroy({ where: {}, truncate: true });
        await Course.destroy({ where: {}, truncate: true });
        await User.destroy({ where: {}, truncate: true });
        await sequelize.query('SET FOREIGN_KEY_CHECKS = 1');

        const admin = await User.create({
            fullName: 'Admin User',
            email: 'admin@mail.com',
            password: hash,
            role: 'admin'
        });

        const instructor = await User.create({
            fullName: 'Alice Teacher',
            email: 'alice@mail.com',
            password: hash,
            role: 'instructor'
        });

        const student = await User.create({
            fullName: 'Bob Student',
            email: 'bob@mail.com',
            password: hash,
            role: 'student'
        });

        const course1 = await Course.create({
            title: 'Node.js Fundamentals',
            description: 'Learn Node.js from scratch',
            category: 'Programming',
            level: 'beginner',
            price: 49.99,
            isPublished: true,
            instructorId: instructor.id
        });

        const course2 = await Course.create({
            title: 'Advanced Express',
            description: 'Master Express.js',
            category: 'Programming',
            level: 'advanced',
            price: 79.99,
            isPublished: false,
            instructorId: instructor.id
        });

        await Lesson.bulkCreate([
            { title: 'Intro to Node', content: 'Lesson 1', duration: 15, order: 1, courseId: course1.id },
            { title: 'Modules', content: 'Lesson 2', duration: 20, order: 2, courseId: course1.id },
            { title: 'Event Loop', content: 'Lesson 3', duration: 25, order: 3, courseId: course1.id }
        ]);

        await Enrollment.create({
            userId: student.id,
            courseId: course1.id,
            status: 'active',
            progress: 33
        });

        console.log('Seed complete!');
        console.log('');
        console.log('  Credentials:');
        console.log('  Admin:      admin@mail.com / secret123');
        console.log('  Instructor: alice@mail.com / secret123');
        console.log('  Student:    bob@mail.com   / secret123');

        process.exit(0);
    } catch (err) {
        console.error('Seed failed:', err.message);
        process.exit(1);
    }
};

seed();