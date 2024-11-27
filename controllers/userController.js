const User = require("../models/userModel");
const httpStatus = require("../utilities/httpStatus");
const bcrypt = require("bcrypt");
const generateToken = require("../utilities/generateToken");
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

exports.register = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(httpStatus.BAD_REQUEST).json({ status: httpStatus.FAIL, message: errors.array() });
        }
        const user = new User(req.body);
        const oldUser = await User.findOne({ email: user.email });
        if (oldUser) {
            return res.status(httpStatus.BAD_REQUEST).json({ status: httpStatus.FAIL, message: "User already exists" });
        }
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
        const token = await generateToken({ email: user.email , id: user._id , role: user.role });
        user.token = token;
        await user.save();
        res.status(httpStatus.CREATED).json({ status: httpStatus.SUCCESS, data: user.token });
    }
    catch (error) {
        res.status(httpStatus.BAD_REQUEST).json({ status: httpStatus.ERROR, message: error.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(httpStatus.BAD_REQUEST).json({ status: httpStatus.FAIL, message: "Email and password are required" });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(httpStatus.BAD_REQUEST).json({ status: httpStatus.FAIL, message: "User not found" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(httpStatus.BAD_REQUEST).json({ status: httpStatus.FAIL, message: "Invalid credentials" });
        }

        const token = await generateToken({ email: user.email, id: user._id , role: user.role });
        user.token = token;
        await user.save();

        res.status(httpStatus.OK).json({ status: httpStatus.SUCCESS, data: user.token});
    }
    catch (error) {
        res.status(httpStatus.BAD_REQUEST).json({ status: httpStatus.ERROR, message: error.message });
    }
};

exports.updateUser = async (req, res) => {};
exports.deleteUser = async (req, res) => {};
exports.getUser = async (req, res) => {};
