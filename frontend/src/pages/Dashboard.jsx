import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import SEO from '../components/SEO';

export default function Dashboard() {
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [monthlySpending, setMonthlySpending] = useState(0);
  const [totalBalance, setTotalBalance] = useState(0);
  const [savings, setSavings] = useState(0);
  const [categoryTotals, setCategoryTotals] = useState({ housing: 0, food: 0, entertainment: 0, other: 0 });
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem('fingrow_expenses');
    let parsed = null;
    
    if (saved) {
      try {
        parsed = JSON.parse(saved);
      } catch (e) {
        console.error("Error parsing expenses", e);
      }
    }

    // Default mock data if no data exists in local storage or array is empty
    if (!parsed || !Array.isArray(parsed) || parsed.length === 0) {
      parsed = [
        { id: 1, date: 'Oct 24, 2023', title: 'Whole Foods Market', subtitle: 'Weekly organic grocery run', category: 'Groceries', amount: '-$142.50', icon: 'cart', color: 'orange' },
        { id: 2, date: 'Oct 22, 2023', title: 'Gas Station', subtitle: 'Fuel for the weekend trip', category: 'Transport', amount: '-$58.00', icon: 'car', color: 'blue' },
        { id: 3, date: 'Oct 20, 2023', title: 'Netflix Subscription', subtitle: 'Monthly premium plan', category: 'Entertainment', amount: '-$19.99', icon: 'monitor', color: 'purple' },
        { id: 4, date: 'Oct 19, 2023', title: 'Property Rent', subtitle: 'October rent payment', category: 'Housing', amount: '-$1,200.00', icon: 'home', color: 'green' },
        { id: 5, date: 'Oct 15, 2023', title: 'TechCorp Inc.', subtitle: 'Monthly Salary', category: 'Income', amount: '+$4,200.00', icon: 'home', color: 'green' }
      ];
    }

    // Safely get top 4 recent
    setRecentTransactions(parsed.slice(0, 4));

    let totalExp = 0;
    let totalInc = 0;
    let housing = 0;
    let food = 0;
    let entertainment = 0;
    let other = 0;

    parsed.forEach(curr => {
      try {
        const amtStr = curr.amount ? String(curr.amount) : "0";
        // Extract numbers and negative sign
        const num = parseFloat(amtStr.replace(/[^0-9.-]/g, ""));
        const amt = isNaN(num) ? 0 : num;

        if (amtStr.includes('-') || amt < 0) {
          const absAmt = Math.abs(amt);
          totalExp += absAmt;
          
          const cat = curr.category ? String(curr.category).toLowerCase() : '';
          if (cat.includes('housing')) {
            housing += absAmt;
          } else if (cat.includes('grocer') || cat.includes('food')) {
            food += absAmt;
          } else if (cat.includes('entertain')) {
            entertainment += absAmt;
          } else {
            other += absAmt;
          }
        } else {
          totalInc += amt;
        }
      } catch (err) {
        console.error("Error processing transaction", err);
      }
    });

    setMonthlySpending(totalExp);
    setCategoryTotals({ housing, food, entertainment, other });
    
    // Calculate dynamic totals based on profile
    fetch('http://localhost:5000/api/profile', {
      headers: { 'Authorization': 'Bearer mock_token' }
    })
      .then(res => res.json())
      .then(data => {
        if (data && data.fullName) {
          setProfile(data);
          setTotalBalance(data.monthlyIncome + totalInc - totalExp);
          setSavings(data.savings);
        } else {
          // Fallback
          const baseBalance = 25000.00;
          const baseSavings = 8500.00;
          setTotalBalance(baseBalance + totalInc - totalExp);
          const netIncome = totalInc - totalExp;
          setSavings(baseSavings + (netIncome > 0 ? netIncome * 0.4 : netIncome * 0.1));
        }
      })
      .catch(err => {
        console.error('Error fetching profile for dashboard:', err);
        const baseBalance = 25000.00;
        const baseSavings = 8500.00;
        setTotalBalance(baseBalance + totalInc - totalExp);
        const netIncome = totalInc - totalExp;
        setSavings(baseSavings + (netIncome > 0 ? netIncome * 0.4 : netIncome * 0.1));
      });
  }, []);

  // Calculate percentages for donut chart safely
  const totalCat = monthlySpending > 0 ? monthlySpending : 1; 
  const p1 = monthlySpending > 0 ? Math.round((categoryTotals.housing / totalCat) * 100) : 0;
  const p2 = monthlySpending > 0 ? Math.round((categoryTotals.food / totalCat) * 100) : 0;
  const p3 = monthlySpending > 0 ? Math.round((categoryTotals.entertainment / totalCat) * 100) : 0;
  const p4 = monthlySpending > 0 ? 100 - p1 - p2 - p3 : 100; 

  const offset2 = -p1;
  const offset3 = offset2 - p2;
  const offset4 = offset3 - p3;

  const formatCurrency = (num) => {
    if (isNaN(num) || num === null || num === undefined) return '$0.00';
    const isNegative = num < 0;
    const formattedNum = Math.abs(num).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    return isNegative ? `-$${formattedNum}` : `$${formattedNum}`;
  };

  return (
    <Layout>
      <SEO 
        title="Dashboard" 
        description="View your financial overview, track spending habits, and monitor your investment growth on FinGrow." 
      />
      <div className="flex flex-col gap-6 max-w-6xl mx-auto pb-10">
        
        {/* Header */}
        <div className="mb-2">
          <h2 className="text-3xl font-bold text-gray-900 mb-1 tracking-tight">Good Morning{profile && profile.fullName ? `, ${profile.fullName.split(' ')[0]}` : ''}</h2>
          <p className="text-gray-500 text-sm">Here's what's happening with your money today.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Total Balance */}
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between h-[120px]">
            <div className="flex justify-between items-start">
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Total Balance</span>
              <div className="text-green-700">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>
              </div>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900 mb-1">{formatCurrency(totalBalance)}</div>
              <div className="text-[10px] font-semibold text-green-600 flex items-center gap-1">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" x2="12" y1="19" y2="5"/><polyline points="5 12 12 5 19 12"/></svg>
                +2.4% from last month
              </div>
            </div>
          </div>

          {/* Monthly Spending */}
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between h-[120px]">
            <div className="flex justify-between items-start">
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Monthly Spending</span>
              <div className="text-blue-600">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
              </div>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900 mb-1">{formatCurrency(monthlySpending)}</div>
              <div className="text-[10px] font-semibold text-blue-500 flex items-center gap-1">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>
                12% under budget
              </div>
            </div>
          </div>

          {/* Savings */}
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between h-[120px]">
            <div className="flex justify-between items-start mb-2">
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Savings</span>
              <div className="text-green-500">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 5c-1.5 0-2.8 1.4-3 2-3.5-1.5-11-.3-11 5 0 1.8 0 3 2 4.5V20h4v-2h3v2h4v-4c1-.5 1.7-1 2-2h2v-4h-2c0-1-.5-1.5-1-2h0V5z"/><path d="M2 9v1c0 1.1.9 2 2 2h1"/><path d="M16 11h.01"/></svg>
              </div>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900 mb-2">{formatCurrency(savings)}</div>
              <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden mb-1">
                <div className="bg-green-700 h-full rounded-full" style={{ width: `${Math.max(0, Math.min(100, (savings / 12000) * 100))}%` }}></div>
              </div>
              <div className="text-[9px] font-medium text-gray-400">Goal: $12,000 New Car</div>
            </div>
          </div>

          {/* Investments */}
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between h-[120px]">
            <div className="flex justify-between items-start">
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Investments</span>
              <div className="text-green-700">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M7 17v-4"/><path d="M12 17V9"/><path d="M17 17v-6"/></svg>
              </div>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900 mb-1">$12,540.20</div>
              <div className="text-[10px] font-semibold text-green-600 flex items-center gap-1">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>
                +8.1% YTD
              </div>
            </div>
          </div>
        </div>

        {/* Middle Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Spending Donut */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-lg text-gray-900">Spending</h3>
              <a href="#" className="text-xs font-bold text-green-700">Details</a>
            </div>
            
            <div className="flex-1 flex flex-col items-center justify-center">
              {/* CSS Donut Chart */}
              <div className="relative w-48 h-48 mb-8">
                <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
                  {monthlySpending > 0 ? (
                    <>
                      {p1 > 0 && <circle strokeDasharray={`${p1}, 100`} stroke="#16a34a" strokeWidth="4" fill="none" r="16" cx="18" cy="18" />}
                      {p2 > 0 && <circle strokeDasharray={`${p2}, 100`} strokeDashoffset={offset2} stroke="#0284c7" strokeWidth="4" fill="none" r="16" cx="18" cy="18" />}
                      {p3 > 0 && <circle strokeDasharray={`${p3}, 100`} strokeDashoffset={offset3} stroke="#84cc16" strokeWidth="4" fill="none" r="16" cx="18" cy="18" />}
                      {p4 > 0 && <circle strokeDasharray={`${p4}, 100`} strokeDashoffset={offset4} stroke="#f97316" strokeWidth="4" fill="none" r="16" cx="18" cy="18" />}
                    </>
                  ) : (
                    <circle stroke="#f3f4f6" strokeWidth="4" fill="none" r="16" cx="18" cy="18" />
                  )}
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-[10px] font-semibold text-gray-400">Total</span>
                  <span className="text-lg font-bold text-gray-900">{formatCurrency(monthlySpending)}</span>
                </div>
              </div>

              <div className="w-full space-y-4 px-4">
                <div className="flex justify-between items-center text-sm">
                  <div className="flex items-center gap-2 text-gray-600 font-medium">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#16a34a]"></div> Housing
                  </div>
                  <span className="font-bold text-gray-900">{formatCurrency(categoryTotals.housing)}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <div className="flex items-center gap-2 text-gray-600 font-medium">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#0284c7]"></div> Food & Drink
                  </div>
                  <span className="font-bold text-gray-900">{formatCurrency(categoryTotals.food)}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <div className="flex items-center gap-2 text-gray-600 font-medium">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#84cc16]"></div> Entertainment
                  </div>
                  <span className="font-bold text-gray-900">{formatCurrency(categoryTotals.entertainment)}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <div className="flex items-center gap-2 text-gray-600 font-medium">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#f97316]"></div> Other
                  </div>
                  <span className="font-bold text-gray-900">{formatCurrency(categoryTotals.other)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Transactions */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-lg text-gray-900">Recent Transactions</h3>
              <div className="flex gap-2">
                <button className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>
                </button>
                <button className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-50 text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                    <th className="pb-3 font-bold w-1/2">Description</th>
                    <th className="pb-3 font-bold">Category</th>
                    <th className="pb-3 font-bold">Date</th>
                    <th className="pb-3 font-bold text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {recentTransactions.length > 0 ? recentTransactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-gray-50/50 transition-colors group">
                      <td className="py-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${tx.color === 'orange' ? 'bg-orange-100 text-orange-500' : tx.color === 'blue' ? 'bg-blue-100 text-blue-500' : tx.color === 'purple' ? 'bg-purple-100 text-purple-500' : 'bg-green-100 text-green-500'}`}>
                            {tx.icon === 'cart' && <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>}
                            {tx.icon === 'car' && <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><path d="M9 17h6"/><circle cx="17" cy="17" r="2"/></svg>}
                            {tx.icon === 'monitor' && <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="3" rx="2"/><line x1="8" x2="16" y1="21" y2="21"/><line x1="12" x2="12" y1="17" y2="21"/></svg>}
                            {tx.icon === 'home' && <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>}
                          </div>
                          <div>
                            <div className="font-bold text-sm text-gray-900">{tx.title}</div>
                            <div className="text-[11px] text-gray-400 font-medium">{tx.subtitle}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-black uppercase ${tx.color === 'orange' ? 'bg-orange-100 text-orange-800' : tx.color === 'blue' ? 'bg-blue-100 text-blue-800' : tx.color === 'purple' ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'}`}>
                          {tx.category}
                        </span>
                      </td>
                      <td className="py-4 whitespace-nowrap text-xs text-gray-500 font-medium">{tx.date?.split ? tx.date.split(',')[0] : tx.date}</td>
                      <td className="py-4 whitespace-nowrap text-sm font-bold text-red-600 text-right">{tx.amount}</td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan="4" className="py-8 text-center text-gray-500 font-medium text-sm">
                        No recent transactions to show.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            
            <div className="pt-4 border-t border-gray-50 text-center mt-2">
              <a href="/expenses" className="text-sm font-semibold text-gray-500 hover:text-gray-800 transition-colors">View All Transactions</a>
            </div>
          </div>
        </div>

        {/* Bottom Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Grow your wealth */}
          <div className="bg-[#0b5c2a] rounded-2xl p-8 relative overflow-hidden flex flex-col justify-between shadow-md">
            <div className="absolute right-0 bottom-0 opacity-20 pointer-events-none transform translate-x-10 translate-y-10">
              {/* Abstract chart graphic */}
              <div className="flex items-end gap-2 h-40">
                <div className="w-8 bg-white h-10 rounded-t-sm"></div>
                <div className="w-8 bg-white h-16 rounded-t-sm"></div>
                <div className="w-8 bg-white h-24 rounded-t-sm"></div>
                <div className="w-8 bg-white h-20 rounded-t-sm"></div>
                <div className="w-8 bg-white h-32 rounded-t-sm"></div>
                <div className="w-8 bg-white h-40 rounded-t-sm"></div>
              </div>
              {/* Trend line over bars */}
              <svg className="absolute inset-0 w-full h-full text-white" viewBox="0 0 200 100" preserveAspectRatio="none">
                 <path d="M0,80 L40,60 L80,30 L120,40 L160,20 L200,0" fill="none" stroke="currentColor" strokeWidth="4" />
              </svg>
            </div>
            
            <div className="relative z-10">
              <h3 className="text-2xl font-bold text-white mb-2">Grow your wealth</h3>
              <p className="text-green-100 text-sm max-w-xs leading-relaxed mb-8">
                Automate your investments and reach your financial goals faster.
              </p>
              <button className="bg-white text-green-900 font-bold px-5 py-2.5 rounded-xl text-sm hover:bg-gray-50 transition-colors shadow-sm inline-flex items-center gap-2">
                Start Investing <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
              </button>
            </div>
          </div>

          {/* Add Expense */}
          <div className="bg-white rounded-2xl p-8 border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-center relative group hover:border-gray-300 transition-colors cursor-pointer">
            <div className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 mb-4 group-hover:bg-gray-50 transition-colors">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" x2="12" y1="5" y2="19"/><line x1="5" x2="19" y1="12" y2="12"/></svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Add Expense</h3>
            <p className="text-sm text-gray-500 max-w-xs leading-relaxed">
              Log a new purchase or upload a receipt to keep your dashboard up to date.
            </p>
            
            {/* Floating Add Button */}
            <a href="/expenses" className="absolute bottom-[-16px] right-8 w-14 h-14 bg-green-700 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-green-800 hover:scale-105 transition-all transform z-10 border-4 border-white">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="12" x2="12" y1="5" y2="19"/><line x1="5" x2="19" y1="12" y2="12"/></svg>
            </a>
          </div>

        </div>

      </div>
    </Layout>
  );
}
