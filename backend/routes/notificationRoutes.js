import express from 'express';
import * as adminController from '../controllers/adminController.js';
import { authenticateAdmin } from '../middlewares/auth.js';

const router = express.Router();

router.use(authenticateAdmin);

router.get('/history', adminController.getNotificationHistory);
router.get('/templates', adminController.getNotificationTemplates);

export default router;
