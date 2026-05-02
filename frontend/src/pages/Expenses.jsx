import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import api from '../services/api';
import { toast } from 'react-toastify';

const defaultExpenses = [
  { id: 1, date: 'Oct 24, 2023', title: 'Whole Foods Market', subtitle: 'Weekly organic grocery run', category: 'Groceries', amount: '-$142.50', icon: 'cart', color: 'orange' },
  { id: 2, date: 'Oct 22, 2023', title: 'Gas Station', subtitle: 'Fuel for the weekend trip', category: 'Transport', amount: '-$58.00', icon: 'car', color: 'blue' },
  { id: 3, date: 'Oct 20, 2023', title: 'Netflix Subscription', subtitle: 'Monthly premium plan', category: 'Entertainment', amount: '-$19.99', icon: 'monitor', color: 'purple' },
  { id: 4, date: 'Oct 19, 2023', title: 'Property Rent', subtitle: 'October rent payment', category: 'Housing', amount: '-$1,200.00', icon: 'home', color: 'green' },
];

export default function Expenses() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [customCategory, setCustomCategory] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');
  const [frequency, setFrequency] = useState('one-time');
  const [sortOrder, setSortOrder] = useState('newest');
  const [categoryFilter, setCategoryFilter] = useState('All');

  const fetchExpenses = async () => {
    try {
      const response = await api.get('/expenses');
      setExpenses(response.data);
    } catch (err) {
      toast.error('Failed to fetch expenses');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const handleAddExpense = async (e) => {
    e.preventDefault();
    if (!amount || !category || !date) return;

    try {
      const payload = {
        title: category === 'Other' ? customCategory : category,
        amount: parseFloat(amount),
        category: category === 'Other' ? customCategory : category,
        date,
        description: notes,
        frequency
      };

      const response = await api.post('/expenses', payload);
      setExpenses([response.data, ...expenses]);
      toast.success('Expense added successfully');

      // Reset Form
      setAmount('');
      setCategory('');
      setCustomCategory('');
      setDate(new Date().toISOString().split('T')[0]);
      setNotes('');
      setFrequency('one-time');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add expense');
    }
  };

  // Calculate budget stats dynamically
  const BUDGET_LIMIT = 20000;
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  
  const totalSpent = expenses
    .filter(exp => {
      const d = new Date(exp.date);
      return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    })
    .reduce((acc, curr) => acc + (curr.amount || 0), 0);

  const remaining = BUDGET_LIMIT - totalSpent;
  const progressPercentage = Math.min((totalSpent / BUDGET_LIMIT) * 100, 100);

  // Formatting helper
  const formatCurrency = (num) => {
    return '₹' + num.toLocaleString('en-IN');
  };

  const getCategoryStyle = (cat) => {
    const c = String(cat).toLowerCase();
    if (c.includes('grocer') || c.includes('food')) return { icon: 'cart', color: 'orange', bg: 'bg-orange-100', text: 'text-orange-500', bgLight: 'bg-orange-50', textDark: 'text-orange-600' };
    if (c.includes('transport') || c.includes('car')) return { icon: 'car', color: 'blue', bg: 'bg-blue-100', text: 'text-blue-500', bgLight: 'bg-blue-50', textDark: 'text-blue-600' };
    if (c.includes('entertain') || c.includes('netflix')) return { icon: 'monitor', color: 'purple', bg: 'bg-purple-100', text: 'text-purple-500', bgLight: 'bg-purple-50', textDark: 'text-purple-600' };
    if (c.includes('house') || c.includes('rent')) return { icon: 'home', color: 'green', bg: 'bg-green-100', text: 'text-green-500', bgLight: 'bg-green-50', textDark: 'text-green-600' };
    return { icon: 'monitor', color: 'orange', bg: 'bg-orange-100', text: 'text-orange-500', bgLight: 'bg-orange-50', textDark: 'text-orange-600' };
  };

  // Filtering and Sorting Logic
  const uniqueCategories = ['All', ...new Set(expenses.map(e => e.category))];

  const filteredExpenses = expenses.filter(expense => {
    if (categoryFilter === 'All') return true;
    return expense.category === categoryFilter;
  });

  const sortedExpenses = [...filteredExpenses].sort((a, b) => {
    if (sortOrder === 'newest') {
      return new Date(b.date) - new Date(a.date);
    } else if (sortOrder === 'oldest') {
      return new Date(a.date) - new Date(b.date);
    } else if (sortOrder === 'highest') {
      return b.amount - a.amount;
    } else if (sortOrder === 'lowest') {
      return a.amount - b.amount;
    }
    return 0;
  });

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="flex flex-col gap-6 max-w-6xl mx-auto h-full">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Expenses</h2>
            <p className="text-gray-500 mt-1">Track your spending and manage your budget effortlessly.</p>
          </div>
          <button className="flex items-center gap-2 bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors shadow-sm font-medium text-sm">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
            Export
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 mt-2 h-full">
          {/* Left Column */}
          <div className="w-full lg:w-[380px] flex flex-col gap-6">
            {/* Add Expense Form */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-xl font-semibold flex items-center gap-2 mb-6">
                <span className="text-primary">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M8 12h8"/><path d="M12 8v8"/></svg>
                </span>
                Add Expense
              </h3>
              
              <form onSubmit={handleAddExpense} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Amount</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <span className="text-gray-500 font-medium">₹</span>
                    </div>
                    <input 
                      type="number" 
                      step="0.01"
                      required
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="0.00" 
                      className="block w-full pl-8 pr-4 py-2.5 bg-gray-50 border-transparent rounded-xl text-gray-900 focus:ring-2 focus:ring-primary focus:bg-white transition-colors outline-none" 
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Category</label>
                  <select 
                    required
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="block w-full px-4 py-2.5 bg-gray-50 border-transparent rounded-xl text-gray-900 focus:ring-2 focus:ring-primary focus:bg-white transition-colors appearance-none relative outline-none cursor-pointer"
                  >
                    <option value="" disabled>Select category</option>
                    <option value="Food">Food</option>
                    <option value="Transport">Transport</option>
                    <option value="Entertainment">Entertainment</option>
                    <option value="Housing">Housing</option>
                    <option value="Shopping">Shopping</option>
                    <option value="Health">Health</option>
                    <option value="Bills">Bills</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                {category === 'Other' && (
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">Custom Category Name</label>
                    <input 
                      type="text" 
                      required
                      value={customCategory}
                      onChange={(e) => setCustomCategory(e.target.value)}
                      placeholder="e.g. Health, Education..." 
                      className="block w-full px-4 py-2.5 bg-gray-50 border-transparent rounded-xl text-gray-900 focus:ring-2 focus:ring-primary focus:bg-white transition-colors outline-none" 
                    />
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Date</label>
                  <input 
                    type="date" 
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="block w-full px-4 py-2.5 bg-gray-50 border-transparent rounded-xl text-gray-900 focus:ring-2 focus:ring-primary focus:bg-white transition-colors outline-none" 
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Frequency</label>
                  <select 
                    value={frequency}
                    onChange={(e) => setFrequency(e.target.value)}
                    className="block w-full px-4 py-2.5 bg-gray-50 border-transparent rounded-xl text-gray-900 focus:ring-2 focus:ring-primary focus:bg-white transition-colors outline-none cursor-pointer"
                  >
                    <option value="one-time">One-time</option>
                    <option value="monthly">Monthly</option>
                    <option value="yearly">Yearly</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Notes</label>
                  <textarea 
                    rows="3" 
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="What was this for?" 
                    className="block w-full px-4 py-2.5 bg-gray-50 border-transparent rounded-xl text-gray-900 focus:ring-2 focus:ring-primary focus:bg-white transition-colors resize-none outline-none"
                  ></textarea>
                </div>

                <button type="submit" className="w-full mt-2 bg-primary hover:bg-green-600 text-white font-medium py-3 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-sm">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
                  Add Expense
                </button>
              </form>
            </div>

            {/* Budget Status */}
            <div className="bg-primary rounded-2xl p-6 text-white shadow-md relative overflow-hidden">
              <div className="relative z-10">
                <p className="text-sm font-medium text-green-100 mb-1">Monthly Budget Status</p>
                <div className="text-2xl font-bold mb-4">{formatCurrency(totalSpent)} / {formatCurrency(BUDGET_LIMIT)}</div>
                
                <div className="h-2.5 w-full bg-green-700/50 rounded-full mb-3 overflow-hidden">
                  <div className="h-full bg-white rounded-full transition-all duration-500" style={{ width: `${progressPercentage}%` }}></div>
                </div>
                
                <p className="text-sm font-medium text-green-50">
                  {remaining >= 0 ? (
                    <>You have <span className="font-bold">{formatCurrency(remaining)}</span> remaining this month.<br/>Good job!</>
                  ) : (
                    <>You are <span className="font-bold">{formatCurrency(Math.abs(remaining))}</span> over budget.<br/>Be careful!</>
                  )}
                </p>
              </div>
              <div className="absolute right-[-20px] bottom-[-20px] opacity-10 pointer-events-none transform scale-[2]">
                <svg width="120" height="120" viewBox="0 0 24 24" fill="currentColor"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="flex-1 bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col">
            {/* Filters */}
            <div className="p-4 border-b border-gray-50 flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <button className="flex items-center gap-2 text-gray-600 text-sm font-medium px-3 py-1.5 hover:bg-gray-50 rounded-lg">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>
                  Filters
                </button>
                <div className="w-px h-6 bg-gray-200"></div>
                <div className="flex items-center gap-2">
                  <select 
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="text-sm font-medium text-gray-700 bg-transparent border-none focus:ring-0 cursor-pointer outline-none"
                  >
                    {uniqueCategories.map(cat => (
                      <option key={cat} value={cat}>{cat === 'All' ? 'All Categories' : cat}</option>
                    ))}
                  </select>
                </div>
                <div className="flex items-center gap-2 ml-2">
                  <select 
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value)}
                    className="text-sm font-medium text-gray-700 bg-transparent border-none focus:ring-0 cursor-pointer outline-none"
                  >
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                    <option value="highest">Highest Price</option>
                    <option value="lowest">Lowest Price</option>
                  </select>
                </div>
              </div>
              <button 
                className="text-sm font-semibold text-blue-600 hover:text-blue-700"
                onClick={() => {
                  if(window.confirm('Are you sure you want to clear all expenses?')) {
                    setExpenses([]);
                  }
                }}
              >
                Clear All
              </button>
            </div>

            {/* Table */}
            <div className="flex-1 overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-50 text-xs text-gray-500 font-semibold tracking-wider">
                    <th className="px-6 py-4 font-semibold uppercase">Date</th>
                    <th className="px-6 py-4 font-semibold uppercase">Description</th>
                    <th className="px-6 py-4 font-semibold uppercase">Category</th>
                    <th className="px-6 py-4 font-semibold uppercase text-right">Amount</th>
                    <th className="px-6 py-4 font-semibold uppercase text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {sortedExpenses.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="px-6 py-12 text-center text-gray-500 font-medium">
                        No expenses yet. Add one to get started!
                      </td>
                    </tr>
                  ) : null}
                  {sortedExpenses.map((expense) => (
                    <tr key={expense._id} className="hover:bg-gray-50/50 transition-colors group">
                      <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-500 font-medium">
                        {new Date(expense.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${getCategoryStyle(expense.category).bg} ${getCategoryStyle(expense.category).text}`}>
                            {getCategoryStyle(expense.category).icon === 'cart' && <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>}
                            {getCategoryStyle(expense.category).icon === 'car' && <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><path d="M9 17h6"/><circle cx="17" cy="17" r="2"/></svg>}
                            {getCategoryStyle(expense.category).icon === 'monitor' && <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="3" rx="2"/><line x1="8" x2="16" y1="21" y2="21"/><line x1="12" x2="12" y1="17" y2="21"/></svg>}
                            {getCategoryStyle(expense.category).icon === 'home' && <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-gray-900">{expense.title}</p>
                            <p className="text-[10px] text-gray-400 font-medium italic mt-0.5 line-clamp-1">{expense.description}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${getCategoryStyle(expense.category).bgLight} ${getCategoryStyle(expense.category).textDark}`}>
                          {expense.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <span className="text-sm font-bold text-gray-900">₹{expense.amount.toLocaleString()}</span>
                        {expense.frequency !== 'one-time' && (
                          <p className="text-[10px] text-gray-400 font-medium uppercase tracking-tighter">{expense.frequency}</p>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <button 
                          className="text-gray-400 hover:text-red-600 p-1 rounded-md hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100"
                          onClick={async () => {
                            if(window.confirm('Delete this expense?')) {
                              try {
                                await api.delete(`/expenses/${expense._id}`);
                                setExpenses(expenses.filter(e => e._id !== expense._id));
                                toast.success('Expense deleted');
                              } catch (err) {
                                toast.error('Failed to delete expense');
                              }
                            }
                          }}
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="p-4 border-t border-gray-50 flex items-center justify-between text-sm text-gray-500 font-medium">
              <div>Showing {Math.min(expenses.length, 4)} of {expenses.length} expenses</div>
              <div className="flex items-center gap-2">
                <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-400 hover:text-gray-600 transition-colors">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
                </button>
                <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-400 hover:text-gray-600 transition-colors">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
