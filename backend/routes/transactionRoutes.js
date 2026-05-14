import express from 'express';
import * as adminController from '../controllers/adminController.js';

const router = express.Router();

// Transaction API (User App + Admin)
router.get('/', adminController.getTransactions);
router.post('/', adminController.createTransaction);

export default router;
