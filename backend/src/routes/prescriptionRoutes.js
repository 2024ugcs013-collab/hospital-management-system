import { Router } from 'express';
import { getPrescriptionById, getPrescriptions } from '../controllers/prescriptionController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/', authMiddleware, getPrescriptions);
router.get('/:id', authMiddleware, getPrescriptionById);

export default router;
