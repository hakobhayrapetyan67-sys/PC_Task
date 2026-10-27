# Online Course Platform REST API

Backend for an Online Course Platform (simplified Udemy).

## Tech Stack
- Node.js, Express
- Sequelize (MySQL)
- JWT Authentication
- bcrypt password hashing

## Architecture
routes → middlewares → controllers → services → models → database

## Install & Run

    npm install
    cp .env.example .env
    # edit .env with your DB credentials
    npm run seed
    npm run dev

## Sample Credentials
- Admin:      admin@mail.com / secret123
- Instructor: alice@mail.com / secret123
- Student:    bob@mail.com   / secret123

## Endpoints

### Auth
- POST /api/auth/register
- POST /api/auth/login
- GET  /api/auth/me

### Courses
- GET    /api/courses
- GET    /api/courses/my
- GET    /api/courses/:id
- POST   /api/courses
- PUT    /api/courses/:id
- DELETE /api/courses/:id
- GET    /api/courses/:id/students

### Lessons
- GET    /api/courses/:courseId/lessons
- POST   /api/courses/:courseId/lessons
- GET    /api/lessons/:id
- PUT    /api/lessons/:id
- DELETE /api/lessons/:id

### Enrollments
- POST   /api/enrollments
- GET    /api/enrollments/me
- PATCH  /api/enrollments/:id/progress
- DELETE /api/enrollments/:id
- GET    /api/enrollments

### Users (admin only)
- GET    /api/users
- GET    /api/users/:id
- PATCH  /api/users/:id/role
- DELETE /api/users/:id

## Why is `sequelize.sync({ force: true })` dangerous?

`force: true` drops every table and recreates it. This permanently deletes all data. Fine for tests with a throwaway DB, but in production it would wipe everything. Use `alter: true` in development and migrations in production.