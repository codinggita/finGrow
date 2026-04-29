import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';

export default function Profile() {
  const [profile, setProfile] = useState({
    fullName: '',
    email: '',
    profilePicture: '',
    monthlyIncome: 0,
    savings: 0,
    riskAppetite: 'Medium',
    investmentGoals: []
  });
  
  const [expenses, setExpenses] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  // Fetch Profile and Expenses on load
  useEffect(() => {
    const loadData = async () => {
      try {
        // Calculate expenses from local storage (Expense Tracker)
        const storedExpenses = JSON.parse(localStorage.getItem('expenses')) || [];
        const totalExp = storedExpenses.reduce((sum, item) => sum + Number(item.amount || 0), 0);
        setExpenses(totalExp);

        // Fetch profile from backend
        // We use a mock token or assume auth middleware falls back to mock user
        const response = await fetch('http://localhost:5000/api/profile', {
          headers: {
            'Authorization': 'Bearer mock_token' // Replace with actual token from auth
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          setProfile(data);
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleGoalChange = (e) => {
    // simple comma separated string to array
    const value = e.target.value;
    const goalsArray = value.split(',').map(g => g.trim());
    setProfile(prev => ({ ...prev, investmentGoals: goalsArray }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile(prev => ({ ...prev, profilePicture: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const saveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    
    // Validation
    if (profile.monthlyIncome <= 0) {
      setMessage('Income must be greater than 0');
      setSaving(false);
      return;
    }
    if (expenses > profile.monthlyIncome) {
      setMessage('Warning: Your expenses exceed your income.');
      // Continue anyway but show warning
    }

    try {
      const response = await fetch('http://localhost:5000/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer mock_token'
        },
        body: JSON.stringify(profile)
      });
      if (response.ok) {
        setMessage('Profile updated successfully!');
      } else {
        setMessage('Failed to update profile.');
      }
    } catch (error) {
      setMessage('Error connecting to server.');
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(''), 3000);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-full">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700"></div>
        </div>
      </Layout>
    );
  }

  // Derived Metrics
  const savingsRate = profile.monthlyIncome > 0 ? ((profile.savings / profile.monthlyIncome) * 100).toFixed(1) : 0;
  const netBalance = profile.monthlyIncome - expenses;
  
  // Bonus: Financial Health Score (0-100)
  // Metrics: Savings Rate (40%), Expenses vs Income (40%), Savings Buffer (20%)
  let healthScore = 50; // base
  if (profile.monthlyIncome > 0) {
    const expenseRatio = expenses / profile.monthlyIncome;
    let score = 0;
    if (savingsRate >= 20) score += 40;
    else if (savingsRate >= 10) score += 20;
    
    if (expenseRatio <= 0.5) score += 40;
    else if (expenseRatio <= 0.8) score += 20;
    else if (expenseRatio > 1) score -= 20;

    if (profile.savings >= expenses * 3) score += 20; // 3 months emergency fund

    healthScore = Math.min(Math.max(score, 0), 100);
  }

  return (
    <Layout>
      <div className="flex flex-col gap-6 max-w-6xl mx-auto pb-20">
        
        {/* Header */}
        <div className="mb-2 flex justify-between items-end">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-1 tracking-tight">Profile & Dashboard</h2>
            <p className="text-gray-500 text-sm max-w-2xl">
              Manage your profile, sync financial data, and monitor your overall health score.
            </p>
          </div>
          {message && (
             <div className={`px-4 py-2 rounded-lg text-sm font-medium animate-fade-in-out ${message.includes('successfully') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {message}
             </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Column: Form & Personal Info */}
          <div className="lg:col-span-2 space-y-6">
            
            <form onSubmit={saveProfile} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 mb-6">Personal Information</h3>
              
              <div className="flex flex-col md:flex-row gap-8 mb-8">
                {/* Avatar */}
                <div className="flex-shrink-0 flex flex-col items-center">
                  <div className="relative group cursor-pointer">
                    <div className="w-24 h-24 rounded-full bg-gray-100 overflow-hidden border-4 border-white shadow-sm flex items-center justify-center">
                      {profile.profilePicture ? (
                        <img src={profile.profilePicture} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                        <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                      )}
                    </div>
                    <label className="absolute inset-0 w-full h-full bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-white">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
                      <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                    </label>
                  </div>
                  <p className="text-[10px] text-gray-400 mt-2">Click to upload</p>
                </div>

                {/* Name & Email */}
                <div className="flex-1 flex flex-col gap-4 justify-center">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Full Name</label>
                    <input type="text" name="fullName" value={profile.fullName} onChange={handleInputChange} required className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-green-600 outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Email Address</label>
                    <input type="email" name="email" value={profile.email} onChange={handleInputChange} required className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-green-600 outline-none" />
                  </div>
                </div>
              </div>

              <hr className="border-gray-100 my-6" />

              <h3 className="text-lg font-bold text-gray-900 mb-6">Financial Profile</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Monthly Income (₹)</label>
                  <input type="number" name="monthlyIncome" value={profile.monthlyIncome} onChange={handleInputChange} required className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-green-600 outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Current Savings (₹)</label>
                  <input type="number" name="savings" value={profile.savings} onChange={handleInputChange} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-green-600 outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Risk Appetite</label>
                  <select name="riskAppetite" value={profile.riskAppetite} onChange={handleInputChange} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-green-600 outline-none">
                    <option value="Low">Low (Safe)</option>
                    <option value="Medium">Medium (Balanced)</option>
                    <option value="High">High (Aggressive)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Investment Goals (Comma separated)</label>
                  <input type="text" placeholder="e.g. Wealth Growth, Retirement" value={profile.investmentGoals?.join(', ')} onChange={handleGoalChange} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-green-600 outline-none" />
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <button type="submit" disabled={saving} className={`bg-green-700 hover:bg-green-800 text-white font-semibold py-2.5 px-8 rounded-xl transition-colors text-sm shadow-sm ${saving ? 'opacity-70' : ''}`}>
                  {saving ? 'Saving...' : 'Save Profile'}
                </button>
              </div>
            </form>

          </div>

          {/* Right Column: Dashboard & Insights */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* Financial Summary Card */}
            <div className="bg-gradient-to-br from-green-800 to-navy p-6 rounded-2xl text-white shadow-lg relative overflow-hidden">
               <div className="absolute top-0 right-0 p-4 opacity-10">
                  <svg width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
               </div>
               <div className="relative z-10">
                 <h3 className="text-sm font-medium text-green-200 mb-1">Financial Health Score</h3>
                 <div className="flex items-end gap-2 mb-6">
                    <span className="text-5xl font-bold">{healthScore}</span>
                    <span className="text-sm text-green-200 pb-1">/ 100</span>
                 </div>
                 
                 <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-green-100">Savings Rate</span>
                        <span className="font-semibold">{savingsRate}%</span>
                      </div>
                      <div className="w-full bg-green-900/50 rounded-full h-1.5">
                        <div className="bg-green-400 h-1.5 rounded-full" style={{ width: `${Math.min(savingsRate, 100)}%` }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-green-100">Net Balance</span>
                        <span className="font-semibold">₹{netBalance.toLocaleString()}</span>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-green-100">Total Expenses</span>
                        <span className="font-semibold text-red-300">₹{expenses.toLocaleString()}</span>
                      </div>
                    </div>
                 </div>
               </div>
            </div>

            {/* Goals Progress */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
               <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                 <svg width="16" height="16" className="text-green-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>
                 Goal Progress
               </h3>
               {profile.investmentGoals && profile.investmentGoals.length > 0 ? (
                 <div className="space-y-4">
                   {profile.investmentGoals.map((goal, idx) => {
                     // Mocking progress for visual effect
                     const progress = Math.min((profile.savings / (50000 * (idx + 1))) * 100, 100).toFixed(0);
                     return (
                       <div key={idx}>
                         <div className="flex justify-between text-xs mb-1">
                           <span className="font-medium text-gray-700">{goal}</span>
                           <span className="text-gray-500">{progress}%</span>
                         </div>
                         <div className="w-full bg-gray-100 rounded-full h-1.5">
                           <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: `${progress}%` }}></div>
                         </div>
                       </div>
                     )
                   })}
                 </div>
               ) : (
                 <p className="text-xs text-gray-500 text-center py-4">No goals added yet.</p>
               )}
            </div>

            {/* Sync Status */}
            <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 flex items-start gap-3">
               <div className="mt-0.5 text-blue-600">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.3"/></svg>
               </div>
               <div>
                  <h4 className="text-sm font-semibold text-blue-900 mb-1">Tracker Synced</h4>
                  <p className="text-xs text-blue-800 leading-relaxed">
                    Your profile is automatically pulling real-time expenses (₹{expenses}) from your expense tracker to calculate precise investment recommendations.
                  </p>
               </div>
            </div>

          </div>
        </div>
      </div>
    </Layout>
  );
}
