import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import api from '../services/api';

export default function Investments() {
  const [formData, setFormData] = useState({
    monthlyIncome: '',
    monthlyExpenses: '',
    currentSavings: '',
    riskAppetite: 'Medium',
    investmentDuration: 'Long-term'
  });
  const [recommendation, setRecommendation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Auto-fill from localStorage if possible (assuming Expense Tracker data is there)
  useEffect(() => {
    try {
      const expenses = JSON.parse(localStorage.getItem('expenses')) || [];
      const totalExpenses = expenses.reduce((sum, exp) => sum + Number(exp.amount || 0), 0);
      if (totalExpenses > 0) {
        setFormData(prev => ({ ...prev, monthlyExpenses: totalExpenses }));
      }
    } catch (e) {
      console.log('Error reading local storage', e);
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const fetchRecommendation = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setRecommendation(null);
    try {
      const response = await api.post('/investments/recommend', formData);
      setRecommendation(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Could not connect to the recommendation server. Please ensure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="flex flex-col gap-8 max-w-6xl mx-auto h-full pb-10">
        
        {/* Header */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Smart Investment Engine</h2>
          <p className="text-gray-500 max-w-2xl text-sm leading-relaxed">
            Get an AI-driven, personalized investment strategy based on your real financial data, savings capacity, and risk tolerance.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Input Form */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-800 mb-5">Financial Profile</h3>
              <form onSubmit={fetchRecommendation} className="space-y-4">
                
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Monthly Income (₹)</label>
                  <input 
                    type="number" name="monthlyIncome" value={formData.monthlyIncome} onChange={handleInputChange} required
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#0b5c2a] focus:outline-none"
                    placeholder="e.g. 80000"
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Monthly Expenses (₹)</label>
                  <input 
                    type="number" name="monthlyExpenses" value={formData.monthlyExpenses} onChange={handleInputChange} required
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#0b5c2a] focus:outline-none"
                    placeholder="e.g. 40000"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Current Total Savings (₹)</label>
                  <input 
                    type="number" name="currentSavings" value={formData.currentSavings} onChange={handleInputChange} required
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#0b5c2a] focus:outline-none"
                    placeholder="e.g. 150000"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Risk Appetite</label>
                  <select name="riskAppetite" value={formData.riskAppetite} onChange={handleInputChange}
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#0b5c2a] focus:outline-none"
                  >
                    <option value="Low">Low (Safe, Stable Returns)</option>
                    <option value="Medium">Medium (Balanced Growth)</option>
                    <option value="High">High (Aggressive Growth)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Investment Duration</label>
                  <select name="investmentDuration" value={formData.investmentDuration} onChange={handleInputChange}
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#0b5c2a] focus:outline-none"
                  >
                    <option value="Short-term">Short-term (&lt; 3 Years)</option>
                    <option value="Long-term">Long-term (3+ Years)</option>
                  </select>
                </div>

                <button 
                  type="submit" disabled={loading}
                  className={`w-full py-3 rounded-xl text-sm font-semibold text-white shadow-md transition-all ${loading ? 'bg-gray-400' : 'bg-green-700 hover:bg-green-800'}`}
                >
                  {loading ? 'Analyzing...' : 'Generate Plan'}
                </button>
              </form>
              {error && <p className="text-red-500 text-xs mt-3">{error}</p>}
            </div>
          </div>

          {/* Right Column: Results Display */}
          <div className="lg:col-span-8">
            {!recommendation && !loading && (
              <div className="bg-gray-50/50 rounded-2xl border border-dashed border-gray-300 h-full min-h-[400px] flex flex-col items-center justify-center p-8 text-center">
                <div className="w-16 h-16 bg-white rounded-full shadow-sm flex items-center justify-center mb-4 text-green-700">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.21 15.89A10 10 0 1 1 8 2.83"/><path d="M22 12A10 10 0 0 0 12 2v10z"/></svg>
                </div>
                <h4 className="text-gray-800 font-medium mb-2">Awaiting Your Details</h4>
                <p className="text-gray-500 text-sm max-w-xs">Fill out the financial profile to receive a personalized, data-driven investment breakdown.</p>
              </div>
            )}

            {loading && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 h-full min-h-[400px] flex flex-col items-center justify-center p-8 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700 mb-4"></div>
                <p className="text-gray-500 text-sm">Crunching the numbers & fetching real-time market data...</p>
              </div>
            )}

            {recommendation && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                {/* Status Alert */}
                <div className={`p-4 rounded-xl border flex gap-3 ${recommendation.status === 'warning' ? 'bg-orange-50 border-orange-200 text-orange-800' : 'bg-green-50 border-green-200 text-green-800'}`}>
                  <div className="mt-0.5">
                    {recommendation.status === 'warning' ? (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>
                    ) : (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/></svg>
                    )}
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm mb-1">{recommendation.status === 'warning' ? 'Action Required' : 'Optimal Portfolio Found'}</h4>
                    <p className="text-xs">{recommendation.message}</p>
                  </div>
                </div>

                {/* Core Metrics */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm text-center">
                    <p className="text-[10px] uppercase font-semibold text-gray-500 mb-1">Savings Rate</p>
                    <p className="text-xl font-bold text-gray-900">{recommendation.calculations.savingsRate}%</p>
                  </div>
                  <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm text-center">
                    <p className="text-[10px] uppercase font-semibold text-gray-500 mb-1">Disposable Inc.</p>
                    <p className="text-xl font-bold text-gray-900">₹{recommendation.calculations.disposableIncome}</p>
                  </div>
                  <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm text-center">
                    <p className="text-[10px] uppercase font-semibold text-gray-500 mb-1">Emergency Goal</p>
                    <p className="text-xl font-bold text-gray-900">₹{recommendation.calculations.emergencyFundRequirement}</p>
                  </div>
                  <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm text-center">
                    <p className="text-[10px] uppercase font-semibold text-gray-500 mb-1">Investment Score</p>
                    <p className="text-xl font-bold text-[#0b5c2a]">{recommendation.calculations.investmentScore || 'N/A'}</p>
                  </div>
                </div>

                {/* Portfolio Allocation */}
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Recommended Allocation</h3>
                      <p className="text-xs text-gray-500 mt-1">Profile: <span className="font-medium text-gray-700">{recommendation.recommendation.profile}</span> • Target Return: <span className="font-medium text-green-700">{recommendation.expectedReturn}</span></p>
                    </div>
                  </div>

                  {/* Allocation Visual Bar */}
                  <div className="w-full h-4 rounded-full overflow-hidden flex mb-6 shadow-inner">
                    {recommendation.recommendation.allocation.map((item, i) => {
                      const colors = ['bg-green-600', 'bg-blue-500', 'bg-orange-400', 'bg-purple-500'];
                      return <div key={i} style={{ width: `${item.percentage}%` }} className={`${colors[i % colors.length]} h-full`} title={`${item.asset}: ${item.percentage}%`}></div>
                    })}
                  </div>

                  {/* Allocation Details */}
                  <div className="space-y-3">
                    {recommendation.recommendation.allocation.map((item, i) => {
                      const colors = ['text-green-600 bg-green-50', 'text-blue-600 bg-blue-50', 'text-orange-600 bg-orange-50', 'text-purple-600 bg-purple-50'];
                      return (
                        <div key={i} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl transition-colors border border-transparent hover:border-gray-100">
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-sm ${colors[i % colors.length]}`}>
                              {item.percentage}%
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-gray-900">{item.asset}</p>
                              {item.symbol && <p className="text-[10px] text-gray-500 font-medium tracking-wide">TICKER: {item.symbol}</p>}
                            </div>
                          </div>
                          {item.price && (
                            <div className="text-right">
                              <p className="text-sm font-medium text-gray-900">${item.price.toFixed(2)}</p>
                              <p className={`text-[10px] font-semibold ${item.trend.startsWith('+') ? 'text-green-600' : 'text-red-500'}`}>
                                {item.trend}
                              </p>
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Bonus Projection Feature */}
                {recommendation.projections && (
                  <div className="bg-gradient-to-br from-navy to-blue-900 p-6 rounded-2xl text-white shadow-xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                      <svg width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><path d="m2 12 5.25 5 2.625-3L15 19l7-14"/></svg>
                    </div>
                    <div className="relative z-10">
                      <div className="flex items-center gap-2 mb-2">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-yellow-400"><path d="M12 2v20"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                        <h4 className="font-semibold text-sm text-yellow-400">Wealth Multiplier Insights</h4>
                      </div>
                      <p className="text-sm leading-relaxed text-blue-100">{recommendation.projections.whatIf}</p>
                    </div>
                  </div>
                )}
                
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
