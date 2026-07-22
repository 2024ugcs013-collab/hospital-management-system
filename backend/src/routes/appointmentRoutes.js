import { Router } from 'express';
import { bookAppointment, cancelAppointment, getAppointmentById, getAppointments, rescheduleAppointment, updateAppointmentStatus } from '../controllers/appointmentController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { roleMiddleware } from '../middleware/roleMiddleware.js';

const router = Router();

router.get('/', authMiddleware, getAppointments);
router.get('/:id', authMiddleware, getAppointmentById);
router.post('/', authMiddleware, roleMiddleware('patient'), bookAppointment);
router.put('/:id/status', authMiddleware, roleMiddleware('doctor', 'admin'), updateAppointmentStatus);
router.put('/:id/reschedule', authMiddleware, rescheduleAppointment);
router.put('/:id/cancel', authMiddleware, cancelAppointment);

export default router;
