import { Router } from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { uploadDoctorFiles } from '../middleware/uploadMiddleware.js';
import { forgotPassword, getCurrentUser, login, registerDoctor, registerPatient } from '../controllers/authController.js';
import {
	forgotPasswordValidator,
	loginValidator,
	registerDoctorValidator,
	registerPatientValidator,
	validateRequest,
} from '../validators/authValidator.js';

const router = Router();

router.post('/register/patient', registerPatientValidator, validateRequest, registerPatient);
router.post('/register/doctor', uploadDoctorFiles, registerDoctorValidator, validateRequest, registerDoctor);
router.post('/login', loginValidator, validateRequest, login);
router.post('/forgot-password', forgotPasswordValidator, validateRequest, forgotPassword);
router.get('/me', authMiddleware, getCurrentUser);

export default router;
