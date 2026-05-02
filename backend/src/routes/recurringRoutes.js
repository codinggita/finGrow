import express from 'express';
import { createRecurringExpense, getRecurringExpenses, deleteRecurringExpense } from '../controllers/recurringController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, createRecurringExpense);
router.get('/', protect, getRecurringExpenses);
router.delete('/:id', protect, deleteRecurringExpense);

export default router;
