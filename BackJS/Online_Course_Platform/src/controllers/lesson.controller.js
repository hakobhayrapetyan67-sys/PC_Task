const lessonService = require('../services/lesson.service');
const asyncHandler = require('../utils/asyncHandler');

exports.getByCourse = asyncHandler(async (req, res) => {
    const lessons = await lessonService.getLessonsByCourse(req.params.courseId, req.user);
    res.status(200).json({ success: true, data: lessons });
});

exports.getById = asyncHandler(async (req, res) => {
    const lesson = await lessonService.getLessonById(req.params.id, req.user);
    res.status(200).json({ success: true, data: lesson });
});

exports.create = asyncHandler(async (req, res) => {
    const lesson = await lessonService.createLesson(req.params.courseId, req.body, req.user);
    res.status(201).json({ success: true, data: lesson });
});

exports.update = asyncHandler(async (req, res) => {
    const lesson = await lessonService.updateLesson(req.params.id, req.body, req.user);
    res.status(200).json({ success: true, data: lesson });
});

exports.remove = asyncHandler(async (req, res) => {
    await lessonService.deleteLesson(req.params.id, req.user);
    res.status(204).send();
});