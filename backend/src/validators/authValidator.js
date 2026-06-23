import { body, validationResult } from 'express-validator';

export const registerPatientValidator = [
  body('name').trim().isLength({ min: 3 }).withMessage('Name must be at least 3 characters.'),
  body('email').isEmail().withMessage('Enter a valid email address.'),
  body('phone').matches(/^\d{10}$/).withMessage('Phone number must contain exactly 10 digits.'),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters.'),
];

export const registerDoctorValidator = [
  body('name').trim().isLength({ min: 3 }).withMessage('Name must be at least 3 characters.'),
  body('email').isEmail().withMessage('Enter a valid email address.'),
  body('phone').matches(/^\d{10}$/).withMessage('Phone number must contain exactly 10 digits.'),
  body('specialization').trim().notEmpty().withMessage('Specialization is required.'),
  body('experience').trim().notEmpty().withMessage('Experience is required.'),
  body('licenseNumber').trim().notEmpty().withMessage('License number is required.'),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters.'),
];

export const loginValidator = [
  body('email').isEmail().withMessage('Enter a valid email address.'),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters.'),
];

export const forgotPasswordValidator = [body('email').isEmail().withMessage('Enter a valid email address.')];

export function validateRequest(req, res, next) {
  const result = validationResult(req);

  if (!result.isEmpty()) {
    res.status(400).json({
      success: false,
      message: 'Validation error',
      errors: result.array().map((item) => item.msg),
    });
    return;
  }

  next();
}
