import { Router } from 'express';
import { createPrescription, getPrescriptionById, getPrescriptions } from '../controllers/prescriptionController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { roleMiddleware } from '../middleware/roleMiddleware.js';

const router = Router();

router.get('/', authMiddleware, getPrescriptions);
router.post('/', authMiddleware, roleMiddleware('doctor'), createPrescription);
router.get('/:id', authMiddleware, getPrescriptionById);

export default router;
