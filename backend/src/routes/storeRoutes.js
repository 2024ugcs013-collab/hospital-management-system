import { Router } from 'express';
import { getMedicines, getMedicineById, placeOrder, getOrders, getOrderById } from '../controllers/storeController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/medicines', authMiddleware, getMedicines);
router.get('/medicines/:id', authMiddleware, getMedicineById);
router.post('/orders', authMiddleware, placeOrder);
router.get('/orders', authMiddleware, getOrders);
router.get('/orders/:id', authMiddleware, getOrderById);

export default router;
