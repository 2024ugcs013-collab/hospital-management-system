export function notFoundMiddleware(_req, res) {
  res.status(404).json({ success: false, message: 'Route not found' });
}

export function errorMiddleware(err, _req, res, _next) {
  const statusCode = err.statusCode || 500;

  if (err.name === 'ValidationError') {
    res.status(400).json({
      success: false,
      message: 'Validation error',
      errors: Object.values(err.errors).map((item) => item.message),
    });
    return;
  }

  if (err.code === 11000) {
    res.status(409).json({
      success: false,
      message: 'Duplicate key error',
      errors: ['An account with this email already exists.'],
    });
    return;
  }

  if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    res.status(401).json({
      success: false,
      message: 'Invalid or expired token',
    });
    return;
  }

  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
}
