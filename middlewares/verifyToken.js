const jwt = require('jsonwebtoken');
const httpStatus = require('../utilities/httpStatus');

exports.verifyToken = async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];
        if (!token) {
            return res.status(httpStatus.UNAUTHORIZED).json({ status: httpStatus.FAIL, message: "Access denied" });
        }

        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        req.user = decoded;
        next();
    }
    catch (error) {
        res.status(httpStatus.UNAUTHORIZED).json({ status: httpStatus.ERROR, message: error.message });
    }
};