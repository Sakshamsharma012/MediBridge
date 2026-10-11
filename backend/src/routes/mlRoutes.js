import { Router } from 'express';
import { getMedicineDemandForecast } from '../controllers/mlController.js';

const router = Router();

router.get('/demand/:medicineId', getMedicineDemandForecast);

export default router;
