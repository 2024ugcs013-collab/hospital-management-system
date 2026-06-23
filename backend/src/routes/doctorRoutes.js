import { Router } from 'express';
import { getDoctors, getDoctorById } from '../controllers/doctorController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/', authMiddleware, getDoctors);
router.get('/:id', authMiddleware, getDoctorById);

export default router;
