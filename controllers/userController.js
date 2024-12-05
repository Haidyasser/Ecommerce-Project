const User = require("../models/userModel");
const { Status, Code } = require("../utils/httpStatus");
const createError = require("http-errors");

exports.getUsers = async (req, res, next) => {
    try {
        const limit = req.query.limit || 10;
        const page = req.query.page || 1;
        const skip = (page - 1) * limit;
        const users = await User.find({}, { "__v": false }).skip(skip).limit(limit);
        res.status(Code.OK).json({ status: Status.SUCCESS, data: users });
    } catch (error) {
        next(error);
    }
};

exports.getUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id, { "__v": false });
        if (!user) {
            throw createError.NotFound("User not found");
        }
        res.status(Code.OK).json({ status: Status.SUCCESS, data: user });
    } catch (error) {
        next(error);
    }
};

exports.updateUser = async (req, res, next) => {
    try {
        const updateUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updateUser) {
            throw createError.NotFound("User not found");
        }
        res.status(Code.OK).json({ status: Status.SUCCESS, data: updateUser });
    } catch (error) {
        next(error);
    }
};

exports.deleteUser = async (req, res, next) => {
    try {
        const deleteUser = await User.findByIdAndDelete(req.params.id);
        if (!deleteUser) {
            throw createError.NotFound("User not found");
        }
        res.status(Code.OK).json({ status: Status.SUCCESS, message: "User deleted successfully" });
    } catch (error) {
        next(error);
    }
};
