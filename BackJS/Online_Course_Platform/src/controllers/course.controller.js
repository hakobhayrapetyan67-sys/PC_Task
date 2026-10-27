const courseService = require('../services/course.service');
const asyncHandler = require('../utils/asyncHandler');

exports.getAll = asyncHandler(async (req, res) => {
    const courses = await courseService.getAllCourses(req.query);
    res.status(200).json({ success: true, data: courses });
});

exports.getMy = asyncHandler(async (req, res) => {
    const courses = await courseService.getMyCourses(req.user.id);
    res.status(200).json({ success: true, data: courses });
});

exports.getById = asyncHandler(async (req, res) => {
    const course = await courseService.getCourseById(req.params.id);
    res.status(200).json({ success: true, data: course });
});

exports.create = asyncHandler(async (req, res) => {
    const course = await courseService.createCourse(req.body, req.user);
    res.status(201).json({ success: true, data: course });
});

exports.update = asyncHandler(async (req, res) => {
    const course = await courseService.updateCourse(req.params.id, req.body, req.user);
    res.status(200).json({ success: true, data: course });
});

exports.remove = asyncHandler(async (req, res) => {
    await courseService.deleteCourse(req.params.id, req.user);
    res.status(204).send();
});

exports.getStudents = asyncHandler(async (req, res) => {
    const students = await courseService.getCourseStudents(req.params.id, req.user);
    res.status(200).json({ success: true, data: students });
});