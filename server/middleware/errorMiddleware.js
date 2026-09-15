// Centralized error handling middleware

const errorHandler = (err, req, res, next) => {
  console.error("ERROR:", err);

  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  res.status(statusCode).json({
    message: err.message || "Internal Server Error",
  });
};

module.exports = errorHandler;