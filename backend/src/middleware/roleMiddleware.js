export function roleMiddleware(...allowedRoles) {
  return (req, _res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      const error = new Error('Forbidden');
      error.statusCode = 403;
      next(error);
      return;
    }

    next();
  };
}
