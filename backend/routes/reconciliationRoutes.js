import express from 'express';
import * as adminController from '../controllers/adminController.js';
import { authenticateAdmin } from '../middlewares/auth.js';

const router = express.Router();

router.use(authenticateAdmin);

router.get('/entries', adminController.getReconciliationEntries);
router.get('/stats', adminController.getReconciliationStats);

export default router;
