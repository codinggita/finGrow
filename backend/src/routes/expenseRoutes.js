import express from 'express';
import { getExpenses, addExpense, deleteExpense } from '../controllers/expenseController.js';
import { exportExpensesCSV } from '../controllers/exportController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/export', protect, exportExpensesCSV);

router.route('/')
  .get(protect, getExpenses)
  .post(protect, addExpense);

router.route('/:id')
  .delete(protect, deleteExpense);

export default router;
