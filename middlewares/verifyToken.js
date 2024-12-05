const jwt = require('jsonwebtoken');
const createError = require('http-errors');
const User = require('../models/userModel');

exports.verifyToken = async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];
        if (!token) {
            throw new createError.Unauthorized("Access denied");
        }

        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        const user = await User.findById(decoded.id);
        if (!user) {
            throw new createError.Unauthorized("Access denied");
        }
        req.user = decoded;
        next();
    }
    catch (error) {
        throw new createError.Unauthorized("Access denied");
    }
};

exports.verifyTokenAdmin = async (req, res, next) => {
    this.verifyToken(req, res, () => {
        if (req.user.role === 'admin') {
            next();
        }
        else {
            throw new createError.Unauthorized("Access denied");
        }
    })
}

exports.verifyTokenAndAuthorized = async (req, res, next) => {
    this.verifyToken(req, res, () => {
        if (req.user.role === 'admin' || req.user.id === req.params.id) {
            next();
        }
        else {
            throw new createError.Unauthorized("Access denied");
        }
    })
}