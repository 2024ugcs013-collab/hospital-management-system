import { Router } from 'express';
import { getPatientProfile, updatePatientProfile, getMedicalHistory } from '../controllers/patientController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/profile', authMiddleware, getPatientProfile);
router.put('/profile', authMiddleware, updatePatientProfile);
router.get('/history', authMiddleware, getMedicalHistory);

export default router;
