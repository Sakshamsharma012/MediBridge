import { Router } from 'express';
import { createDonation, getMyDonations, getDonationById, verifyDonation } from '../controllers/donationController.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = Router();

router.use(authenticateToken);

router.post('/', upload.single('image'), createDonation);
router.get('/my', getMyDonations);
router.get('/:id', getDonationById);
router.patch('/:id/verify', requireRole(['ADMIN', 'NGO']), verifyDonation);

export default router;
