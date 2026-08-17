const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  console.error(`[Error] ${req.method} ${req.originalUrl}: ${err.message}`);
  
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Something went wrong on the server. Please try again.',
    stack: process.env.NODE_ENV === 'production' ? null : err.stack
  });
};

module.exports = { errorHandler };
