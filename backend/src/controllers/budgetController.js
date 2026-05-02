import Budget from '../models/Budget.js';
import Expense from '../models/Expense.js';

export const getBudgets = async (req, res) => {
  try {
    const budgets = await Budget.find({ userId: req.user.id });
    
    // Dynamically calculate 'spent' for each budget based on current month's expenses
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const updatedBudgets = await Promise.all(budgets.map(async (budgetDoc) => {
      const budget = budgetDoc.toObject();
      const expenses = await Expense.find({
        userId: req.user.id,
        category: { $regex: new RegExp(`^${budget.category}$`, 'i') },
        date: { $gte: startOfMonth }
      });
      const spent = expenses.reduce((sum, exp) => sum + exp.amount, 0);
      budget.spent = spent;
      return budget;
    }));

    res.json(updatedBudgets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const setBudget = async (req, res) => {
  try {
    const { category, limit } = req.body;
    
    // Update existing budget for category or create new one
    const budget = await Budget.findOneAndUpdate(
      { userId: req.user.id, category },
      { limit },
      { new: true, upsert: true }
    );

    res.status(201).json(budget);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteBudget = async (req, res) => {
  try {
    const budget = await Budget.findById(req.params.id);

    if (!budget) {
      return res.status(404).json({ message: 'Budget not found' });
    }

    if (budget.userId.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await budget.deleteOne();
    res.json({ message: 'Budget removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
