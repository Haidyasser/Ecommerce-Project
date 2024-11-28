const User = require("../models/userModel");
const httpStatus = require("../utils/httpStatus");
const bcrypt = require("bcrypt");
const generateToken = require("../utils/generateToken");
const { validationResult } = require("express-validator");

exports.getUsers = async (req, res) => {
    try {
        const limit = req.query.limit || 10;
        const page = req.query.page || 1;
        const skip = (page - 1) * limit;
        const users = await User.find({}, {"__v": false }).skip(skip).limit(limit);
        res.status(httpStatus.OK).json({ status: httpStatus.SUCCESS, data: users });
    }
    catch (error) {
        res.status(httpStatus.BAD_REQUEST).json({ status: httpStatus.ERROR, message: error.message });
    }
};

exports.getUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id, { "__v": false });
        if (!user) {
            return res.status(httpStatus.NOT_FOUND).json({ status: httpStatus.FAIL, message: "User not found" });
        }
        res.status(httpStatus.OK).json({ status: httpStatus.SUCCESS, data: user });
    }
    catch (error) {
        res.status(httpStatus.BAD_REQUEST).json({ status: httpStatus.ERROR, message: error.message });
    }
};
exports.updateUser = async (req, res) => {
    try {
        const updateUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updateUser) {
            return res.status(httpStatus.NOT_FOUND).json({ status: httpStatus.FAIL, message: "User not found" });
        }
        res.status(httpStatus.OK).json({ status: httpStatus.SUCCESS, data: updateUser });
    }
    catch (error) {
        res.status(httpStatus.BAD_REQUEST).json({ status: httpStatus.ERROR, message: error.message });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const deleteUser = await User.findByIdAndDelete(req.params.id);
        if (!deleteUser) {
            return res.status(httpStatus.NOT_FOUND).json({ status: httpStatus.FAIL, message: "User not found" });
        }
        res.status(httpStatus.OK).json({ status: httpStatus.SUCCESS, message: "User deleted successfully" });
    }
    catch (error) {
        res.status(httpStatus.BAD_REQUEST).json({ status: httpStatus.ERROR, message: error.message });
    }
};

