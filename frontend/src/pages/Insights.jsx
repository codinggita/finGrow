import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import api from '../services/api';
import SEO from '../components/SEO';

const SpendingChart = ({ data, prevData }) => {
  if (!data || data.length === 0) return null;
  
  const max = Math.max(...data, ...prevData, 100) * 1.1; // Add 10% padding
  const width = 1000;
  const height = 300;

  const getPoints = (values) => {
    return values.map((val, i) => ({
      x: (i / (values.length - 1)) * width,
      y: height - (val / max) * height
    }));
  };

  const currentPoints = getPoints(data);
  const previousPoints = getPoints(prevData);

  // Function to create SVG path for smooth curves
  const createSmoothPath = (points) => {
    if (points.length < 2) return '';
    let d = `M ${points[0].x},${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
      const curr = points[i];
      const next = points[i + 1];
      const controlX = (curr.x + next.x) / 2;
      d += ` C ${controlX},${curr.y} ${controlX},${next.y} ${next.x},${next.y}`;
    }
    return d;
  };

  const pathD = createSmoothPath(currentPoints);
  const prevPathD = createSmoothPath(previousPoints);

  return (
    <div className="w-full h-full relative group">
      <svg className="w-full h-full overflow-visible" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
        <defs>
          <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#16a34a" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#16a34a" stopOpacity="0" />
          </linearGradient>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Previous Period Line */}
        <path
          d={prevPathD}
          fill="none"
          stroke="#f3f4f6"
          strokeWidth="4"
          strokeDasharray="8,8"
          className="transition-all duration-500"
        />

        {/* Area under current line */}
        <path
          d={`${pathD} L ${width},${height} L 0,${height} Z`}
          fill="url(#chartGradient)"
          className="transition-all duration-700"
        />

        {/* Current Period Line */}
        <path
          d={pathD}
          fill="none"
          stroke="#16a34a"
          strokeWidth="5"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter="url(#glow)"
          className="transition-all duration-500 drop-shadow-lg"
        />
        
        {/* Interaction points (invisible but large for hover) */}
        {currentPoints.map((p, i) => (
          <circle
            key={i}
            cx={p.x}
            cy={p.y}
            r="8"
            fill="transparent"
            className="cursor-pointer"
          >
            <title>{`Day ${i + 1}: ₹${data[i]}`}</title>
          </circle>
        ))}
      </svg>
    </div>
  );
};

export default function Insights() {
  const [trend, setTrend] = useState({ current: [], previous: [], labels: [] });
  const [distribution, setDistribution] = useState([]);
  const [efficiency, setEfficiency] = useState({ score: 0, status: 'Loading...' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [trendRes, distRes, effRes] = await Promise.all([
          api.get('/analytics/spending-trend'),
          api.get('/analytics/category-distribution'),
          api.get('/analytics/efficiency-score')
        ]);
        setTrend(trendRes.data);
        setDistribution(distRes.data);
        setEfficiency(effRes.data);
      } catch (err) {
        console.error('Error fetching insights:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const getCategoryColor = (cat) => {
    const c = cat.toLowerCase();
    if (c.includes('food')) return 'bg-orange-500';
    if (c.includes('housing')) return 'bg-green-600';
    if (c.includes('transport')) return 'bg-blue-500';
    if (c.includes('entertain')) return 'bg-purple-500';
    if (c.includes('shop')) return 'bg-pink-500';
    return 'bg-gray-400';
  };

  return (
    <Layout>
      <SEO title="Insights" description="Detailed financial analysis and smart suggestions." />
      <div className="flex flex-col gap-8 max-w-7xl mx-auto pb-10">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-50 text-green-700 rounded-full text-[10px] font-black uppercase tracking-widest mb-3 border border-green-100">
               <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
               Live Analysis
            </div>
            <h2 className="text-4xl font-black text-navy mb-1 tracking-tight">Financial Insights</h2>
            <p className="text-gray-500 text-sm font-medium">Advanced analysis of your spending ecosystem and wealth growth.</p>
          </div>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 bg-white border border-gray-200 text-gray-700 px-5 py-3 rounded-2xl text-sm font-bold hover:border-green-600 transition-all shadow-sm group">
              <svg width="16" height="16" className="text-gray-400 group-hover:text-green-600 transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
              April 2024
            </button>
            <button className="flex items-center gap-2 bg-navy text-white px-6 py-3 rounded-2xl text-sm font-bold hover:bg-black transition-all shadow-xl active:scale-95 group">
              <svg width="16" height="16" className="group-hover:translate-y-0.5 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
              Export Analytics
            </button>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label: 'Monthly Spending', value: `₹${efficiency.totalExpenses?.toLocaleString()}`, trend: '-12%', positive: true, color: 'green' },
            { label: 'Savings Rate', value: `${efficiency.savingsRate}%`, trend: '+5%', positive: true, color: 'blue' },
            { label: 'Efficiency Score', value: `${efficiency.score}/100`, trend: '+2', positive: true, color: 'navy' },
            { label: 'Active Budgets', value: '4', trend: 'On Track', positive: true, color: 'orange' }
          ].map((stat, i) => (
            <div key={i} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all group cursor-pointer">
               <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">{stat.label}</p>
               <div className="flex items-end justify-between">
                  <h4 className="text-2xl font-black text-navy tracking-tight">{stat.value}</h4>
                  <span className={`text-[10px] font-black px-2 py-1 rounded-lg ${stat.positive ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                    {stat.trend}
                  </span>
               </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-2">
          
          {/* Left Column (Trends & Breakdown) */}
          <div className="lg:col-span-2 flex flex-col gap-8">
            
            {/* Spending Trends */}
            <div className="bg-white p-8 md:p-10 rounded-[2.5rem] shadow-sm border border-gray-100 flex flex-col">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
                <div>
                  <h3 className="font-black text-navy text-2xl mb-1 tracking-tight">Spending Trajectory</h3>
                  <p className="text-sm text-gray-500 font-medium">Comparing your daily habits against previous cycles</p>
                </div>
                <div className="flex items-center gap-8 text-[10px] font-black uppercase tracking-[0.2em]">
                  <div className="flex items-center gap-2.5 text-green-600">
                    <div className="w-4 h-1 rounded-full bg-green-600 shadow-[0_0_8px_rgba(22,163,74,0.4)]"></div>
                    Current
                  </div>
                  <div className="flex items-center gap-2.5 text-gray-300">
                    <div className="w-4 h-1 rounded-full bg-gray-200"></div>
                    Target
                  </div>
                </div>
              </div>
              
              <div className="h-[320px] w-full mt-4 relative">
                <div className="absolute inset-0 flex flex-col justify-between pointer-events-none px-2">
                  {[1, 2, 3, 4, 5].map(i => (
                    <div key={i} className="border-b border-gray-50 w-full h-0"></div>
                  ))}
                  <div className="border-b border-gray-200 w-full h-0"></div>
                </div>
                
                <div className="absolute inset-0 pt-4 pb-2">
                  {loading ? (
                    <div className="w-full h-full flex flex-col items-center justify-center gap-4">
                      <div className="w-12 h-12 border-4 border-green-100 border-t-green-600 rounded-full animate-spin"></div>
                      <div className="text-gray-400 text-[10px] font-black tracking-[0.3em] uppercase">Processing Data</div>
                    </div>
                  ) : (
                    <SpendingChart data={trend.current} prevData={trend.previous} />
                  )}
                </div>

                <div className="absolute bottom-[-32px] left-0 w-full flex justify-between text-[10px] text-gray-400 font-black uppercase tracking-widest px-2">
                  <span>Start of Month</span>
                  <span>Mid Point</span>
                  <span>Cycle End</span>
                </div>
              </div>
            </div>

            {/* AI Wealth Predictor Banner */}
            <div className="bg-navy text-white rounded-[2.5rem] p-10 relative overflow-hidden shadow-2xl group cursor-pointer border border-white/5">
               <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-green-500/10 to-transparent pointer-events-none"></div>
               <div className="absolute -right-10 -bottom-10 opacity-10 transform rotate-12 group-hover:scale-110 transition-transform duration-700">
                  <svg width="300" height="300" viewBox="0 0 24 24" fill="currentColor"><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/></svg>
               </div>
               
               <div className="relative z-10 max-w-lg">
                  <div className="inline-flex items-center gap-2 bg-green-500/20 text-green-400 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest mb-6 border border-green-500/30">
                     ✨ FinGrow AI Predictor
                  </div>
                  <h3 className="text-3xl font-black mb-4 tracking-tight leading-tight">Your wealth could reach <span className="text-green-400">₹12,40,000</span> by 2029.</h3>
                  <p className="text-gray-400 text-sm mb-8 leading-relaxed font-medium">
                     Based on your 84/100 efficiency score and current savings rate of 18%, our engine predicts you are 14% ahead of your long-term goals.
                  </p>
                  <div className="flex items-center gap-6">
                     <button className="bg-white text-navy px-8 py-3.5 rounded-2xl text-sm font-black hover:bg-green-50 transition-all shadow-lg active:scale-95">
                        Deep Dive Forecast
                     </button>
                     <div className="flex -space-x-3 overflow-hidden">
                        {[1, 2, 3].map(i => (
                          <img key={i} className="inline-block h-8 w-8 rounded-full ring-4 ring-navy" src={`https://i.pravatar.cc/150?u=${i}`} alt="" />
                        ))}
                        <div className="h-8 w-8 rounded-full bg-gray-800 flex items-center justify-center text-[10px] font-black ring-4 ring-navy">+2k</div>
                     </div>
                  </div>
               </div>
            </div>
            
          </div>

          {/* Right Column (Cards & Suggestions) */}
          <div className="flex flex-col gap-8">
            
            {/* Category Breakdown */}
            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 flex-1">
              <div className="flex justify-between items-center mb-10">
                 <h3 className="font-black text-navy text-xl tracking-tight">Spending Ecosystem</h3>
              </div>
              <div className="space-y-8">
                {distribution.length > 0 ? distribution.slice(0, 6).map((item, i) => (
                  <div key={i} className="group">
                    <div className="flex justify-between text-xs font-black mb-3 uppercase tracking-wider">
                      <span className="text-gray-400 group-hover:text-green-600 transition-colors">{item.name}</span>
                      <div className="flex items-center gap-3">
                        <span className="text-navy">₹{item.value.toLocaleString()}</span>
                      </div>
                    </div>
                    <div className="w-full bg-gray-50 rounded-full h-2.5 overflow-hidden border border-gray-100">
                      <div 
                        className={`h-full ${getCategoryColor(item.name)} rounded-full transition-all duration-1000 ease-out relative`} 
                        style={{ width: `${item.percentage}%` }}
                      >
                         <div className="absolute top-0 right-0 bottom-0 w-1/2 bg-white/20 skew-x-12 translate-x-full group-hover:translate-x-[-200%] transition-transform duration-1000"></div>
                      </div>
                    </div>
                  </div>
                )) : (
                  <div className="py-20 text-center flex flex-col items-center gap-4">
                     <div className="w-16 h-16 bg-gray-50 rounded-3xl flex items-center justify-center text-gray-300">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect width="18" height="18" x="3" y="3" rx="4"/><path d="M3 9h18"/><path d="M9 21V9"/></svg>
                     </div>
                     <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">No data mapped</p>
                  </div>
                )}
              </div>
            </div>

            {/* Smart Suggestions */}
            <div className="flex flex-col gap-6">
              <h3 className="font-black text-navy text-xl tracking-tight px-2">Actionable Intelligence</h3>
              <div className="flex flex-col gap-4">
                {[
                  { title: "Spending Anomaly", desc: "Your food spending spiked by ₹2,400 this week. We recommend home-cooking for the next 4 days.", icon: "cutlery", color: "red" },
                  { title: "Savings Milestone", desc: "You've maintained an 80+ efficiency score for 14 days straight. You're in the top 5% of savers.", icon: "check", color: "green" },
                  { title: "Yield Optimization", desc: "Move ₹12,000 idle cash to your high-yield debt fund to earn an extra ₹850 annually.", icon: "chart", color: "blue" }
                ].map((s, i) => (
                  <div key={i} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-start gap-5 hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer group relative overflow-hidden">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 transition-all group-hover:rotate-6 ${
                      s.color === 'red' ? 'bg-red-50 text-red-500 shadow-[0_0_15px_rgba(239,68,68,0.1)]' :
                      s.color === 'blue' ? 'bg-blue-50 text-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.1)]' :
                      'bg-green-50 text-green-600 shadow-[0_0_15px_rgba(22,163,74,0.1)]'
                    }`}>
                      {s.icon === 'cutlery' && <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"/></svg>}
                      {s.icon === 'check' && <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>}
                      {s.icon === 'chart' && <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/></svg>}
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-black text-navy mb-1.5 transition-colors">{s.title}</h4>
                      <p className="text-xs text-gray-400 leading-relaxed font-medium">{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </Layout>
  );
}
