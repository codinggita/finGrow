import Expense from '../models/Expense.js';

export const exportExpensesCSV = async (req, res) => {
  try {
    const expenses = await Expense.find({ userId: req.user.id }).sort({ date: -1 });
    
    let csv = 'Date,Category,Title,Description,Amount,Frequency\n';
    
    expenses.forEach(exp => {
      const date = new Date(exp.date).toLocaleDateString('en-IN');
      const title = `"${exp.title.replace(/"/g, '""')}"`;
      const desc = `"${(exp.description || '').replace(/"/g, '""')}"`;
      csv += `${date},${exp.category},${title},${desc},${exp.amount},${exp.frequency || 'one-time'}\n`;
    });

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=fingrow_expenses.csv');
    res.status(200).send(csv);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
