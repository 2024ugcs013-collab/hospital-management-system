import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export async function authMiddleware(req, _res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    const error = new Error('Unauthorized');
    error.statusCode = 401;
    next(error);
    return;
  }

  try {
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select('-password');

    if (!user) {
      const error = new Error('Unauthorized');
      error.statusCode = 401;
      next(error);
      return;
    }

    req.user = user;
    req.tokenPayload = decoded;
    next();
  } catch (error) {
    error.statusCode = 401;
    next(error);
  }
}
