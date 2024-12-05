const errorHandler = (err, req, res, next) => {
    const statusCode = err.status || 500;
    const status = statusCode === 500 ? "error" : "fail";
  
    res.status(statusCode).json({
      status,
      message: err.message || "Internal Server Error",
    });
  };
  
module.exports = errorHandler;