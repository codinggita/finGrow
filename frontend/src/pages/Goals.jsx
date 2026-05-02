import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import api from '../services/api';
import { toast } from 'react-toastify';
import SEO from '../components/SEO';

export default function Goals() {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Form State
  const [name, setName] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [category, setCategory] = useState('Other');
  const [deadline, setDeadline] = useState('');

  const fetchGoals = async () => {
    try {
      const response = await api.get('/goals');
      setGoals(response.data);
    } catch (err) {
      toast.error('Failed to fetch goals');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  const handleAddGoal = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/goals', {
        name,
        targetAmount: parseFloat(targetAmount),
        category,
        deadline
      });
      setGoals([...goals, response.data]);
      toast.success('Goal created successfully');
      setName('');
      setTargetAmount('');
      setDeadline('');
    } catch (err) {
      toast.error('Failed to create goal');
    }
  };

  const handleContribute = async (goalId) => {
    const amount = prompt('Enter contribution amount:');
    if (!amount || isNaN(amount)) return;

    try {
      const response = await api.put(`/goals/${goalId}`, {
        contribution: parseFloat(amount)
      });
      setGoals(goals.map(g => g._id === goalId ? response.data : g));
      toast.success('Contribution added!');
    } catch (err) {
      toast.error('Failed to add contribution');
    }
  };

  const handleDeleteGoal = async (goalId) => {
    if (!window.confirm('Delete this goal?')) return;
    try {
      await api.delete(`/goals/${goalId}`);
      setGoals(goals.filter(g => g._id !== goalId));
      toast.success('Goal removed');
    } catch (err) {
      toast.error('Failed to remove goal');
    }
  };

  return (
    <Layout>
      <SEO title="Savings Goals" description="Track and reach your financial milestones." />
      <div className="flex flex-col gap-8 max-w-6xl mx-auto pb-10">
        <div className="flex justify-between items-end">
          <div>
            <h2 className="text-3xl font-black text-navy tracking-tight">Smart Savings Goals</h2>
            <p className="text-gray-500 text-sm font-medium mt-1">Visualize your future and reach your milestones faster.</p>
          </div>
          <button 
            onClick={() => document.getElementById('add-goal-form').scrollIntoView({ behavior: 'smooth' })}
            className="bg-primary text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-lg hover:bg-green-600 transition-all active:scale-95"
          >
            + Create New Goal
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {goals.map((goal) => {
            const progress = Math.min((goal.currentAmount / goal.targetAmount) * 100, 100);
            return (
              <div key={goal._id} className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-md transition-all group">
                <div className="flex justify-between items-start mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-green-50 flex items-center justify-center text-green-600">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 8v8"/><path d="M8 12h8"/></svg>
                  </div>
                  <button onClick={() => handleDeleteGoal(goal._id)} className="text-gray-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                  </button>
                </div>
                
                <h3 className="font-black text-navy text-xl mb-1">{goal.name}</h3>
                <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-6">{goal.category}</p>

                <div className="flex justify-between text-sm font-black mb-2">
                   <span className="text-navy">₹{goal.currentAmount.toLocaleString()}</span>
                   <span className="text-gray-400">Target: ₹{goal.targetAmount.toLocaleString()}</span>
                </div>

                <div className="w-full bg-gray-50 h-3 rounded-full mb-6 border border-gray-100 overflow-hidden">
                   <div className="h-full bg-primary rounded-full transition-all duration-1000" style={{ width: `${progress}%` }}></div>
                </div>

                <div className="flex items-center justify-between">
                   <span className="text-xs font-bold text-green-600">{Math.round(progress)}% Completed</span>
                   <button 
                     onClick={() => handleContribute(goal._id)}
                     className="bg-navy text-white px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all"
                   >
                     Contribute
                   </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Add Goal Form */}
        <div id="add-goal-form" className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-sm max-w-2xl mx-auto w-full mt-8">
           <h3 className="text-2xl font-black text-navy mb-8 tracking-tight text-center">New Savings Milestone</h3>
           <form onSubmit={handleAddGoal} className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                 <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 px-1">Goal Name</label>
                    <input 
                      type="text" 
                      required 
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. New Macbook" 
                      className="w-full px-5 py-3.5 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-primary focus:bg-white transition-all outline-none font-bold text-navy"
                    />
                 </div>
                 <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 px-1">Target Amount</label>
                    <input 
                      type="number" 
                      required 
                      value={targetAmount}
                      onChange={(e) => setTargetAmount(e.target.value)}
                      placeholder="₹ 0.00" 
                      className="w-full px-5 py-3.5 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-primary focus:bg-white transition-all outline-none font-bold text-navy"
                    />
                 </div>
              </div>
              <div className="grid grid-cols-2 gap-6">
                 <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 px-1">Category</label>
                    <select 
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full px-5 py-3.5 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-primary focus:bg-white transition-all outline-none font-bold text-navy appearance-none"
                    >
                       <option>Electronics</option>
                       <option>Travel</option>
                       <option>Emergency Fund</option>
                       <option>Vehicle</option>
                       <option>Other</option>
                    </select>
                 </div>
                 <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 px-1">Deadline</label>
                    <input 
                      type="date" 
                      value={deadline}
                      onChange={(e) => setDeadline(e.target.value)}
                      className="w-full px-5 py-3.5 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-primary focus:bg-white transition-all outline-none font-bold text-navy"
                    />
                 </div>
              </div>
              <button type="submit" className="w-full bg-navy text-white py-4 rounded-2xl font-black text-sm uppercase tracking-[0.2em] shadow-xl hover:bg-black transition-all active:scale-95 mt-4">
                 Set Goal
              </button>
           </form>
        </div>
      </div>
    </Layout>
  );
}
