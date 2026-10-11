import { Router } from 'express';
import { getPharmacyInventory, addInventoryItem, updateInventoryItem } from '../controllers/pharmacyController.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';

const router = Router();

router.use(authenticateToken);

router.get('/inventory', requireRole(['PHARMACY', 'ADMIN']), getPharmacyInventory);
router.post('/inventory', requireRole(['PHARMACY', 'ADMIN']), addInventoryItem);
router.patch('/inventory/:id', requireRole(['PHARMACY', 'ADMIN']), updateInventoryItem);

export default router;
