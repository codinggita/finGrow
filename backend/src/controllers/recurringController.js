import RecurringExpense from '../models/RecurringExpense.js';
import Expense from '../models/Expense.js';

export const createRecurringExpense = async (req, res) => {
  const { amount, category, description, frequency, startDate } = req.body;
  try {
    let nextOccurrence = new Date(startDate || Date.now());
    
    // Calculate first next occurrence (since first one is created manually)
    if (frequency === 'daily') nextOccurrence.setDate(nextOccurrence.getDate() + 1);
    else if (frequency === 'weekly') nextOccurrence.setDate(nextOccurrence.getDate() + 7);
    else if (frequency === 'monthly') nextOccurrence.setMonth(nextOccurrence.getMonth() + 1);
    else if (frequency === 'yearly') nextOccurrence.setFullYear(nextOccurrence.getFullYear() + 1);

    const recurring = await RecurringExpense.create({
      userId: req.user.id,
      amount,
      category,
      description,
      frequency,
      startDate: startDate || Date.now(),
      nextOccurrence
    });
    res.status(201).json(recurring);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getRecurringExpenses = async (req, res) => {
  try {
    const recurrings = await RecurringExpense.find({ userId: req.user.id });
    res.json(recurrings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteRecurringExpense = async (req, res) => {
  try {
    await RecurringExpense.findByIdAndDelete(req.params.id);
    res.json({ message: 'Recurring expense removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Logic to process due recurring expenses
export const processRecurringExpenses = async (userId) => {
  const now = new Date();
  const dueRecurrings = await RecurringExpense.find({
    userId,
    isActive: true,
    nextOccurrence: { $lte: now }
  });

  for (const rec of dueRecurrings) {
    // Create actual expense
    await Expense.create({
      userId: rec.userId,
      amount: rec.amount,
      category: rec.category,
      description: `${rec.description} (Recurring)`,
      date: rec.nextOccurrence
    });

    // Calculate next occurrence
    let next = new Date(rec.nextOccurrence);
    if (rec.frequency === 'daily') next.setDate(next.getDate() + 1);
    else if (rec.frequency === 'weekly') next.setDate(next.getDate() + 7);
    else if (rec.frequency === 'monthly') next.setMonth(next.getMonth() + 1);
    else if (rec.frequency === 'yearly') next.setFullYear(next.getFullYear() + 1);

    rec.lastProcessed = rec.nextOccurrence;
    rec.nextOccurrence = next;
    await rec.save();
  }
};
