import express from 'express';
import * as adminController from '../controllers/adminController.js';
import { authenticateAdmin } from '../middlewares/auth.js';

const router = express.Router();

router.use(authenticateAdmin);

router.get('/system', adminController.getSystemConfig);
router.get('/limits', adminController.getTransactionLimits);
router.get('/fees', adminController.getFeeStructures);

export default router;
