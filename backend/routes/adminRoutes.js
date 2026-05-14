import express from 'express';
import * as adminController from '../controllers/adminController.js';
import { authenticateAdmin, authorizeRole } from '../middlewares/auth.js';

const router = express.Router();

// Public routes
router.post('/login', adminController.login);

// Apply authentication to all other admin routes
router.use(authenticateAdmin);

// User Management
router.get('/users', adminController.getUsers);
router.post('/users/:userId/status', authorizeRole(['super_admin', 'admin', 'compliance_officer']), adminController.updateUserStatus);

// Account & Product Management
router.get('/accounts', adminController.getAccounts);
router.get('/cards', adminController.getCards);
router.get('/loans', adminController.getLoans);

// Transaction Management
router.get('/transactions', adminController.getTransactions);
router.post('/transactions/:transactionId/process', authorizeRole(['super_admin', 'fraud_analyst']), adminController.processTransaction);

// KYC
router.post('/kyc/:userId/verify', authorizeRole(['super_admin', 'admin', 'compliance_officer', 'support_agent']), adminController.verifyKYC);

// Analytics
router.get('/analytics', adminController.getAnalytics);
router.get('/chart-data', adminController.getChartData);

// Audit Logs
router.get('/audit-logs', authorizeRole(['super_admin', 'admin']), adminController.getAuditLogs);

// Support
router.get('/support/tickets', authorizeRole(['super_admin', 'admin', 'support_agent']), adminController.getSupportTickets);

export default router;
