import express from 'express';
import * as adminController from '../controllers/adminController.js';
import { authenticateAdmin } from '../middlewares/auth.js';

const router = express.Router();

router.use(authenticateAdmin);

router.get('/types', adminController.getReportTypes);
router.get('/recent', adminController.getRecentReports);
router.get('/stats', adminController.getReportStats);

export default router;
