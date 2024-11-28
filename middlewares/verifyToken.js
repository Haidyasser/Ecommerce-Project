const jwt = require('jsonwebtoken');
const httpStatus = require('../utils/httpStatus');
const User = require('../models/userModel');

exports.verifyToken = async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];
        if (!token) {
            return res.status(httpStatus.UNAUTHORIZED).json({ status: httpStatus.FAIL, message: "Access denied" });
        }

        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(httpStatus.UNAUTHORIZED).json({ status: httpStatus.FAIL, message: "Access denied" });
        }
        req.user = decoded;
        next();
    }
    catch (error) {
        res.status(httpStatus.UNAUTHORIZED).json({ status: httpStatus.ERROR, message: error.message });
    }
};

exports.verifyTokenAdmin = async (req, res, next) => {
    this.verifyToken(req, res, () => {
        if (req.user.role === 'admin') {
            next();
        }
        else {
            return res.status(httpStatus.UNAUTHORIZED).json({ status: httpStatus.FAIL, message: "Access denied" });
        }
    })
}

exports.verifyTokenAndAuthorized = async (req, res, next) => {
    this.verifyToken(req, res, () => {
        if (req.user.role === 'admin' || req.user.id === req.params.id) {
            next();
        }
        else {
            return res.status(httpStatus.UNAUTHORIZED).json({ status: httpStatus.FAIL, message: "Access denied" });
        }
    })
}