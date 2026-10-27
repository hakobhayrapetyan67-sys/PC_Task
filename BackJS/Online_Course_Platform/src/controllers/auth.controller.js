const authService = require('../services/auth.service');
const asyncHandler = require('../utils/asyncHandler');

exports.register = asyncHandler(async (req, res) => {
    const user = await authService.register(req.body);
    res.status(201).json({ success: true, data: user });
});

exports.login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const result = await authService.login(email, password);
    res.status(200).json({ success: true, data: result });
});

exports.me = asyncHandler(async (req, res) => {
    const user = await authService.me(req.user.id);
    res.status(200).json({ success: true, data: user });
});