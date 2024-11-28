const httpStatus = require('../utils/httpStatus');
const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const generateToken = require('../utils/generateToken');
const { validationResult } = require('express-validator');

exports.register = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(httpStatus.BAD_REQUEST)
            .json({ status: httpStatus.FAIL, message: errors.array() });
        }
        const user = new User(req.body);
        const findUser = await User.findOne({ email: user.email });
        if (findUser) {
            return res.status(httpStatus.BAD_REQUEST)
            .json({ status: httpStatus.FAIL, message: "User already exists" });
        }
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
        await user.save();
        res.status(httpStatus.CREATED).json({ status: httpStatus.SUCCESS, data: user });
    }
    catch (error) {
        res.status(httpStatus.BAD_REQUEST).json({ status: httpStatus.ERROR, message: error.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(httpStatus.BAD_REQUEST)
            .json({ status: httpStatus.FAIL, message: "Email and password are required" });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(httpStatus.BAD_REQUEST)
            .json({ status: httpStatus.FAIL, message: "User not found" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(httpStatus.BAD_REQUEST)
            .json({ status: httpStatus.FAIL, message: "Invalid credentials" });
        }

        const token = await generateToken({ email: user.email, id: user._id , role: user.role });
        //add token to the response cookie
        res.cookie('token', token, { httpOnly: true });
        res.status(httpStatus.OK).json({ status: httpStatus.SUCCESS, data: user.token});
    }
    catch (error) {
        res.status(httpStatus.BAD_REQUEST).json({ status: httpStatus.ERROR, message: error.message });
    }
};