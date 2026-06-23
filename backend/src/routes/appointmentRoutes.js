import { Router } from 'express';
import { bookAppointment, cancelAppointment, getAppointmentById, getAppointments, rescheduleAppointment } from '../controllers/appointmentController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/', authMiddleware, getAppointments);
router.get('/:id', authMiddleware, getAppointmentById);
router.post('/', authMiddleware, bookAppointment);
router.put('/:id/reschedule', authMiddleware, rescheduleAppointment);
router.put('/:id/cancel', authMiddleware, cancelAppointment);

export default router;
