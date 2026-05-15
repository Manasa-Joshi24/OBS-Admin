import express from 'express';
import * as adminController from '../controllers/adminController.js';
import { authenticateAdmin } from '../middlewares/auth.js';

const router = express.Router();

router.use(authenticateAdmin);

router.get('/cases', adminController.getFraudCases);
router.get('/rules', adminController.getFraudRules);
router.get('/stats', adminController.getFraudStats);

export default router;
