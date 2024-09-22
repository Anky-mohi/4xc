const { isCelebrateError } = require('celebrate');

const globalErrHandler = (err, req, res, next) => {
  let message = err.message;
  let status = err.status || 'failed';
  let statusCode = err.statusCode || 500;
  const stack = err.stack;

  // Handle Celebrate validation errors
  if (isCelebrateError(err)) {
    message = "Validation failed";
    statusCode = 400; // Set a suitable status code for validation errors

    // Extract validation details
    const validationDetails = [];
    err.details.forEach((detail) => {
      validationDetails.push(detail.message);
    });
    message = validationDetails.join(', ');
  }

  // General error response
  res.status(statusCode).json({
    status,
    message,
    stack: process.env.NODE_ENV === 'development' ? stack : undefined, // Show stack trace only in development
  });
};

// Not found error handler
const notFoundErr = (req, res, next) => {
  const err = new Error(`Can't find ${req.originalUrl} on this server`);
  err.statusCode = 404;
  err.status = 'fail';
  next(err);
};

module.exports = { globalErrHandler, notFoundErr };
