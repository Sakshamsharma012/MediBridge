import { Router } from 'express';
import {
  getFirstAidArticles,
  getSelfCareArticles,
  generateHealthcarePlan,
} from '../controllers/healthcareController.js';

const router = Router();

router.get('/first-aid', getFirstAidArticles);
router.get('/self-care', getSelfCareArticles);
router.post('/generate-plan', generateHealthcarePlan);

export default router;
