import express from 'express';
import * as optimizationController from '../controllers/optimization.controller.js';
import { authenticateAdmin } from '../middlewares/auth.js';

const router = express.Router();

router.get('/analytics', authenticateAdmin, optimizationController.getAnalytics);
router.get('/fraud', authenticateAdmin, optimizationController.getFraudAnalysis);
router.get('/autocomplete', authenticateAdmin, optimizationController.getAutocomplete);
router.get('/sort', authenticateAdmin, optimizationController.getSortedTransactions);

export default router;
