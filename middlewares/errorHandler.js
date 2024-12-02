const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;

  console.error(`Error: ${err.message}`, err);

  res.status(statusCode).json({
    message: err.message || "An unexpected error occurred on the server",
  });
};

module.exports = errorHandler;
