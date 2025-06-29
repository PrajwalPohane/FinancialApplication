import express from 'express';
import { body, query, param } from 'express-validator';
import transactionController from '../controllers/transactionController';
import auth from '../middleware/auth';
import validate from '../middleware/validation';

const router = express.Router();

// Apply auth middleware to all routes
router.use(auth);

// Validation rules
const createTransactionValidation = [
  body('amount')
    .isNumeric()
    .withMessage('Amount must be a number'),
  body('category')
    .isIn(['Revenue', 'Expense'])
    .withMessage('Category must be either Revenue or Expense'),
  body('status')
    .isIn(['Paid', 'Pending', 'Failed', 'Cancelled'])
    .withMessage('Status must be one of: Paid, Pending, Failed, Cancelled'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description must be less than 500 characters')
];

const updateTransactionValidation = [
  param('id')
    .isNumeric()
    .withMessage('Transaction ID must be a number'),
  body('amount')
    .optional()
    .isNumeric()
    .withMessage('Amount must be a number'),
  body('category')
    .optional()
    .isIn(['Revenue', 'Expense'])
    .withMessage('Category must be either Revenue or Expense'),
  body('status')
    .optional()
    .isIn(['Paid', 'Pending', 'Failed', 'Cancelled'])
    .withMessage('Status must be one of: Paid, Pending, Failed, Cancelled'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description must be less than 500 characters')
];

const getTransactionsValidation = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  query('category')
    .optional()
    .isIn(['Revenue', 'Expense'])
    .withMessage('Category must be either Revenue or Expense'),
  query('status')
    .optional()
    .isIn(['Paid', 'Pending', 'Failed', 'Cancelled'])
    .withMessage('Status must be one of: Paid, Pending, Failed, Cancelled'),
  query('sortBy')
    .optional()
    .isIn(['date', 'amount', 'category', 'status'])
    .withMessage('Sort by must be one of: date, amount, category, status'),
  query('sortOrder')
    .optional()
    .isIn(['asc', 'desc'])
    .withMessage('Sort order must be either asc or desc')
];

const analyticsValidation = [
  query('timeRange')
    .optional()
    .isIn(['all', 'last30days', 'monthly', 'selectrange'])
    .withMessage('Time range must be one of: all, last30days, monthly, selectrange'),
  query('startDate')
    .optional()
    .isISO8601()
    .withMessage('Start date must be a valid ISO date'),
  query('endDate')
    .optional()
    .isISO8601()
    .withMessage('End date must be a valid ISO date')
];

const exportValidation = [
  query('category')
    .optional()
    .isIn(['Revenue', 'Expense'])
    .withMessage('Category must be either Revenue or Expense'),
  query('status')
    .optional()
    .isIn(['Paid', 'Pending', 'Failed', 'Cancelled'])
    .withMessage('Status must be one of: Paid, Pending, Failed, Cancelled'),
  query('startDate')
    .optional()
    .isISO8601()
    .withMessage('Start date must be a valid ISO date'),
  query('endDate')
    .optional()
    .isISO8601()
    .withMessage('End date must be a valid ISO date')
];

// Routes
router.get('/', getTransactionsValidation, validate, transactionController.getTransactions);
router.get('/analytics', analyticsValidation, validate, transactionController.getAnalytics);
router.get('/analytics/export', analyticsValidation, validate, transactionController.exportAnalyticsReport);
router.get('/export', exportValidation, validate, transactionController.exportToCSV);
router.get('/:id', param('id').isNumeric(), validate, transactionController.getTransaction);
router.post('/', createTransactionValidation, validate, transactionController.createTransaction);
router.put('/:id', updateTransactionValidation, validate, transactionController.updateTransaction);
router.delete('/:id', param('id').isNumeric(), validate, transactionController.deleteTransaction);

export default router; 