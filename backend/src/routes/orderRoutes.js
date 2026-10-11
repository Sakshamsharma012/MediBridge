import { Router } from 'express';
import { createOrder, getMyOrders, getPharmacyOrders, updateOrderStatus } from '../controllers/orderController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

router.use(authenticateToken);

router.post('/', createOrder);
router.get('/my', getMyOrders);
router.get('/pharmacy', getPharmacyOrders);
router.patch('/:id/status', updateOrderStatus);

export default router;
