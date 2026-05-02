import Expense from '../models/Expense.js';
import UserProfile from '../models/UserProfile.js';

export const getSpendingTrend = async (req, res) => {
  try {
    const now = new Date();
    const currentStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const currentEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    
    const prevStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const prevEnd = new Date(now.getFullYear(), now.getMonth(), 0);

    const currentExpenses = await Expense.find({
      userId: req.user.id,
      date: { $gte: currentStart, $lte: currentEnd }
    });

    const prevExpenses = await Expense.find({
      userId: req.user.id,
      date: { $gte: prevStart, $lte: prevEnd }
    });

    const currentData = Array(31).fill(0);
    const prevData = Array(31).fill(0);

    currentExpenses.forEach(exp => {
      const day = new Date(exp.date).getDate();
      currentData[day - 1] += exp.amount;
    });

    prevExpenses.forEach(exp => {
      const day = new Date(exp.date).getDate();
      prevData[day - 1] += exp.amount;
    });

    res.json({
      labels: Array.from({ length: 31 }, (_, i) => i + 1),
      current: currentData,
      previous: prevData
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getCategoryDistribution = async (req, res) => {
  try {
    const expenses = await Expense.find({ userId: req.user.id });
    const distribution = {};

    expenses.forEach(exp => {
      distribution[exp.category] = (distribution[exp.category] || 0) + exp.amount;
    });

    const total = Object.values(distribution).reduce((a, b) => a + b, 0);
    
    const result = Object.keys(distribution).map(cat => ({
      name: cat,
      value: distribution[cat],
      percentage: total > 0 ? Math.round((distribution[cat] / total) * 100) : 0
    })).sort((a, b) => b.value - a.value);

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getEfficiencyScore = async (req, res) => {
  try {
    const profile = await UserProfile.findOne({ userId: req.user.id });
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const expenses = await Expense.find({ 
      userId: req.user.id,
      date: { $gte: startOfMonth }
    });

    if (!profile || profile.monthlyIncome === 0) {
      return res.json({ score: 0, status: 'No data', savingsRate: 0, totalExpenses: 0, monthlyIncome: 0 });
    }

    const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
    const savingsRate = ((profile.monthlyIncome - totalExpenses) / profile.monthlyIncome) * 100;
    
    let score = Math.min(Math.max(savingsRate * 2, 0), 100);
    
    res.json({ 
      score: Math.round(score),
      savingsRate: Math.round(savingsRate),
      totalExpenses,
      monthlyIncome: profile.monthlyIncome
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
