import Expense from '../models/Expense.js';
import Budget from '../models/Budget.js';
import { createNotification } from './notificationController.js';

export const getExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find({ userId: req.user.id }).sort({ date: -1 });
    res.json(expenses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const addExpense = async (req, res) => {
  try {
    const { title, amount, category, date, description, frequency } = req.body;

    const expense = new Expense({
      userId: req.user.id,
      title,
      amount,
      category,
      date,
      description,
      frequency
    });

    const createdExpense = await expense.save();
    
    // Check if budget is exceeded for this category
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const categoryExpenses = await Expense.find({
      userId: req.user.id,
      category: { $regex: new RegExp(`^${category}$`, 'i') },
      date: { $gte: startOfMonth }
    });
    
    const totalSpent = categoryExpenses.reduce((sum, exp) => sum + exp.amount, 0);
    const budget = await Budget.findOne({ 
      userId: req.user.id, 
      category: { $regex: new RegExp(`^${category}$`, 'i') } 
    });

    if (budget && totalSpent > budget.limit) {
      await createNotification(
        req.user.id,
        `Budget Alert: You have exceeded your ₹${budget.limit} limit for ${category}!`,
        'warning'
      );
    } else if (budget && totalSpent > budget.limit * 0.8) {
      await createNotification(
        req.user.id,
        `Budget Warning: You have used over 80% of your ₹${budget.limit} limit for ${category}.`,
        'warning'
      );
    }

    // Create standard success notification
    await createNotification(
      req.user.id,
      `New expense added: ${title} for ₹${amount}`,
      'success'
    );

    res.status(201).json(createdExpense);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);

    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    if (expense.userId.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await expense.deleteOne();
    res.json({ message: 'Expense removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
