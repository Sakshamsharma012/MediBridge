import { Router } from 'express';
import { getNearbySources } from '../controllers/locationController.js';

const router = Router();

router.get('/nearby', getNearbySources);

export default router;
