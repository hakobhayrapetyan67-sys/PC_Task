const userService = require('../services/user.service');
const asyncHandler = require('../utils/asyncHandler');

exports.getAll = asyncHandler(async (req, res) => {
    const users = await userService.getAllUsers(req.query);
    res.status(200).json({ success: true, data: users });
});

exports.getById = asyncHandler(async (req, res) => {
    const user = await userService.getUserById(req.params.id);
    res.status(200).json({ success: true, data: user });
});

exports.changeRole = asyncHandler(async (req, res) => {
    const user = await userService.changeRole(req.params.id, req.body.role, req.user);
    res.status(200).json({ success: true, data: user });
});

exports.remove = asyncHandler(async (req, res) => {
    await userService.deleteUser(req.params.id, req.user);
    res.status(204).send();
});