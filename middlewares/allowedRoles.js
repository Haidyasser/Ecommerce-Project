const httpStatus = require('../utilities/httpStatus');
module.exports = (roles) => {
    return (req, res, next) => {
        try {
            if (!roles.includes(req.user.role)) {
                return res.status(httpStatus.UNAUTHORIZED)
                .json({ status: httpStatus.FAIL, message: "Access denied" });
            }
            next();
        }
        catch (error) {
            res.status(httpStatus.UNAUTHORIZED).json({ status: httpStatus.ERROR, message: error.message });
        }
    }

}