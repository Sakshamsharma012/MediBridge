import { Router } from 'express';
import { createRequest, getMyRequests, getAllRequests, updateRequestStatus } from '../controllers/requestController.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';

const router = Router();

router.use(authenticateToken);

router.post('/', createRequest);
router.get('/my', getMyRequests);
router.get('/all', requireRole(['ADMIN', 'NGO', 'HOSPITAL', 'PHARMACY']), getAllRequests);
router.patch('/:id/status', requireRole(['ADMIN', 'NGO', 'PHARMACY', 'HOSPITAL']), updateRequestStatus);

export default router;
