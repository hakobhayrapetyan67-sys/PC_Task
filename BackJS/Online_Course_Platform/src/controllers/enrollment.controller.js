const enrollmentService = require('../services/enrollment.service');
const asyncHandler = require('../utils/asyncHandler');

exports.enroll = asyncHandler(async (req, res) => {
    const enrollment = await enrollmentService.enroll(req.user.id, req.body.courseId);
    res.status(201).json({ success: true, data: enrollment });
});

exports.getMy = asyncHandler(async (req, res) => {
    const enrollments = await enrollmentService.getMyEnrollments(req.user.id);
    res.status(200).json({ success: true, data: enrollments });
});

exports.updateProgress = asyncHandler(async (req, res) => {
    const enrollment = await enrollmentService.updateProgress(
        req.params.id,
        req.user.id,
        req.body.progress
    );
    res.status(200).json({ success: true, data: enrollment });
});

exports.remove = asyncHandler(async (req, res) => {
    await enrollmentService.cancelEnrollment(req.params.id, req.user);
    res.status(204).send();
});

exports.getAll = asyncHandler(async (req, res) => {
    const enrollments = await enrollmentService.getAllEnrollments();
    res.status(200).json({ success: true, data: enrollments });
});