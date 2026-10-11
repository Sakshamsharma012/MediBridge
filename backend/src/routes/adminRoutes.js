import { Router } from 'express';
import { getAdminDashboardMetrics, getVerificationQueue, getAuditLogs } from '../controllers/adminController.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';

const router = Router();

router.use(authenticateToken);
router.use(requireRole(['ADMIN']));

router.get('/dashboard', getAdminDashboardMetrics);
router.get('/verifications', getVerificationQueue);
router.get('/audit-logs', getAuditLogs);

export default router;
