import { Router } from 'express';
import { searchMedicines, getMedicineById } from '../controllers/medicineController.js';

const router = Router();

router.get('/', searchMedicines);
router.get('/search', searchMedicines);
router.get('/:id', getMedicineById);

export default router;
