import { Router } from 'express';
import { getGenericAlternatives } from '../controllers/alternativesController.js';

const router = Router();

router.get('/:medicineId', getGenericAlternatives);

export default router;
