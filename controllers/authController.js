const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const generateToken = require('../utils/generateToken');
const { validationResult } = require('express-validator');
const createError = require('http-errors');
const { Status, Code } = require('../utils/httpStatus');

exports.register = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) throw createError.BadRequest(errors.array());

        const user = new User(req.body);
        const findUser = await User.findOne({ email: user.email });
        if (findUser) throw createError.Conflict('User already exists');

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
        await user.save();

        res.status(Code.CREATED).json({ status: Status.SUCCESS, data: user });
    } catch (error) {
        next(error);
    }
};

exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) throw createError.BadRequest("Email and password are required");

        const user = await User.findOne({ email });
        if (!user) throw createError.NotFound("User not found");

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) throw createError.Unauthorized("Invalid credentials");

        const token = await generateToken({ email: user.email, id: user._id, role: user.role });
        res.cookie('token', token, { httpOnly: true });

        res.status(Code.OK).json({ status: Status.SUCCESS, data: token });
    } catch (error) {
        next(error);
    }
};