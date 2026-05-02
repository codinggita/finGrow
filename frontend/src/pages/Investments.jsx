import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import api from '../services/api';

export default function Investments() {
  const [activeTab, setActiveTab] = useState('portfolio'); // 'portfolio' or 'strategy'
  const [assets, setAssets] = useState([]);
  const [portfolioLoading, setPortfolioLoading] = useState(true);
  
  // Asset Form State
  const [assetName, setAssetName] = useState('');
  const [symbol, setSymbol] = useState('');
  const [type, setType] = useState('Stock');
  const [quantity, setQuantity] = useState('');
  const [purchasePrice, setPurchasePrice] = useState('');

  // Strategy Form State
  const [formData, setFormData] = useState({
    monthlyIncome: '',
    monthlyExpenses: '',
    currentSavings: '',
    riskAppetite: 'Medium',
    investmentDuration: 'Long-term'
  });
  const [recommendation, setRecommendation] = useState(null);
  const [strategyLoading, setStrategyLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchAssets = async () => {
    try {
      const response = await api.get('/assets');
      setAssets(response.data);
    } catch (err) {
      toast.error('Failed to fetch portfolio');
    } finally {
      setPortfolioLoading(false);
    }
  };

  useEffect(() => {
    fetchAssets();
    // Auto-fill from Profile if possible
    api.get('/profile')
      .then(res => {
        if (res.data) {
          setFormData(prev => ({
            ...prev,
            monthlyIncome: res.data.monthlyIncome || '',
            currentSavings: res.data.savings || ''
          }));
        }
      })
      .catch(err => console.error('Error fetching profile for investments:', err));
  }, []);

  const handleAddAsset = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/assets', {
        name: assetName,
        symbol: symbol.toUpperCase(),
        type,
        quantity: parseFloat(quantity),
        purchasePrice: parseFloat(purchasePrice)
      });
      setAssets([...assets, response.data]);
      toast.success('Asset added to portfolio');
      setAssetName(''); setSymbol(''); setQuantity(''); setPurchasePrice('');
    } catch (err) {
      toast.error('Failed to add asset');
    }
  };

  const handleDeleteAsset = async (id) => {
    if (!window.confirm('Remove this asset?')) return;
    try {
      await api.delete(`/assets/${id}`);
      setAssets(assets.filter(a => a._id !== id));
      toast.success('Asset removed');
    } catch (err) {
      toast.error('Failed to remove asset');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const fetchRecommendation = async (e) => {
    e.preventDefault();
    setStrategyLoading(true);
    setError('');
    setRecommendation(null);
    try {
      const response = await api.post('/investments/recommend', formData);
      setRecommendation(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Could not connect to the recommendation server.');
    } finally {
      setStrategyLoading(false);
    }
  };

  const totalValue = assets.reduce((acc, curr) => acc + (curr.currentPrice * curr.quantity), 0);
  const totalCost = assets.reduce((acc, curr) => acc + (curr.purchasePrice * curr.quantity), 0);
  const totalPnL = totalValue - totalCost;
  const pnlPercentage = totalCost > 0 ? (totalPnL / totalCost) * 100 : 0;

  return (
    <Layout>
      <div className="flex flex-col gap-8 max-w-7xl mx-auto h-full pb-10">
        
        {/* Header & Tabs */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h2 className="text-4xl font-black text-navy mb-1 tracking-tight">Investment Ecosystem</h2>
            <p className="text-gray-500 text-sm font-medium">Manage your portfolio and discover new growth strategies.</p>
          </div>
          <div className="flex bg-gray-100 p-1.5 rounded-2xl">
             <button 
               onClick={() => setActiveTab('portfolio')}
               className={`px-6 py-2.5 rounded-xl text-sm font-black transition-all ${activeTab === 'portfolio' ? 'bg-white text-navy shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
             >
               My Portfolio
             </button>
             <button 
               onClick={() => setActiveTab('strategy')}
               className={`px-6 py-2.5 rounded-xl text-sm font-black transition-all ${activeTab === 'strategy' ? 'bg-white text-navy shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
             >
               AI Strategy
             </button>
          </div>
        </div>

        {activeTab === 'portfolio' ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
             {/* Left: Summary & Table */}
             <div className="lg:col-span-8 space-y-8">
                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                   <div className="bg-navy p-6 rounded-3xl text-white shadow-xl relative overflow-hidden">
                      <div className="absolute -right-4 -bottom-4 opacity-10">
                         <svg width="100" height="100" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
                      </div>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Total Portfolio Value</p>
                      <h4 className="text-3xl font-black tracking-tight">₹{totalValue.toLocaleString()}</h4>
                   </div>
                   <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Total Profit/Loss</p>
                      <h4 className={`text-2xl font-black tracking-tight ${totalPnL >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                         {totalPnL >= 0 ? '+' : ''}₹{totalPnL.toLocaleString()}
                      </h4>
                   </div>
                   <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Portfolio ROI</p>
                      <h4 className={`text-2xl font-black tracking-tight ${pnlPercentage >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                         {pnlPercentage >= 0 ? '+' : ''}{pnlPercentage.toFixed(2)}%
                      </h4>
                   </div>
                </div>

                {/* Table */}
                <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                   <table className="w-full text-left">
                      <thead>
                         <tr className="bg-gray-50/50 text-[10px] font-black uppercase tracking-widest text-gray-400 border-b border-gray-100">
                            <th className="px-8 py-4">Asset</th>
                            <th className="px-6 py-4">Qty</th>
                            <th className="px-6 py-4">Purchase</th>
                            <th className="px-6 py-4">Current</th>
                            <th className="px-6 py-4 text-right">Returns</th>
                            <th className="px-8 py-4"></th>
                         </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                         {assets.map(asset => {
                            const gain = (asset.currentPrice - asset.purchasePrice) * asset.quantity;
                            return (
                               <tr key={asset._id} className="group hover:bg-gray-50 transition-all">
                                  <td className="px-8 py-5">
                                     <div className="flex flex-col">
                                        <span className="font-black text-navy text-sm">{asset.name}</span>
                                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{asset.symbol} • {asset.type}</span>
                                     </div>
                                  </td>
                                  <td className="px-6 py-5 text-sm font-bold text-gray-600">{asset.quantity}</td>
                                  <td className="px-6 py-5 text-sm font-bold text-gray-600">₹{asset.purchasePrice.toLocaleString()}</td>
                                  <td className="px-6 py-5 text-sm font-black text-navy">₹{asset.currentPrice.toLocaleString()}</td>
                                  <td className={`px-6 py-5 text-sm font-black text-right ${gain >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                                     {gain >= 0 ? '+' : ''}₹{gain.toLocaleString()}
                                  </td>
                                  <td className="px-8 py-5 text-right">
                                     <button onClick={() => handleDeleteAsset(asset._id)} className="text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all">
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                                     </button>
                                  </td>
                               </tr>
                            )
                         })}
                      </tbody>
                   </table>
                   {assets.length === 0 && (
                      <div className="py-20 text-center flex flex-col items-center gap-4">
                         <div className="w-16 h-16 bg-gray-50 rounded-3xl flex items-center justify-center text-gray-300">
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/></svg>
                         </div>
                         <p className="text-gray-400 text-xs font-black uppercase tracking-widest">No assets tracked yet</p>
                      </div>
                   )}
                </div>
             </div>

             {/* Right: Add Form */}
             <div className="lg:col-span-4">
                <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm sticky top-8">
                   <h3 className="text-xl font-black text-navy mb-8 tracking-tight">Add Investment</h3>
                   <form onSubmit={handleAddAsset} className="space-y-5">
                      <div>
                         <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 px-1">Asset Name</label>
                         <input type="text" required value={assetName} onChange={e => setAssetName(e.target.value)} placeholder="e.g. Reliance" className="w-full px-5 py-3.5 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-primary focus:bg-white transition-all outline-none font-bold text-navy" />
                      </div>
                      <div>
                         <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 px-1">Symbol / Ticker</label>
                         <input type="text" required value={symbol} onChange={e => setSymbol(e.target.value)} placeholder="e.g. RELIANCE.NS" className="w-full px-5 py-3.5 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-primary focus:bg-white transition-all outline-none font-bold text-navy uppercase" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                         <div>
                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 px-1">Type</label>
                            <select value={type} onChange={e => setType(e.target.value)} className="w-full px-5 py-3.5 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-primary focus:bg-white transition-all outline-none font-bold text-navy appearance-none">
                               <option>Stock</option>
                               <option>Crypto</option>
                               <option>Mutual Fund</option>
                               <option>Gold</option>
                            </select>
                         </div>
                         <div>
                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 px-1">Quantity</label>
                            <input type="number" required value={quantity} onChange={e => setQuantity(e.target.value)} placeholder="0" className="w-full px-5 py-3.5 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-primary focus:bg-white transition-all outline-none font-bold text-navy" />
                         </div>
                      </div>
                      <div>
                         <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 px-1">Purchase Price (₹)</label>
                         <input type="number" required value={purchasePrice} onChange={e => setPurchasePrice(e.target.value)} placeholder="₹ 0.00" className="w-full px-5 py-3.5 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-primary focus:bg-white transition-all outline-none font-bold text-navy" />
                      </div>
                      <button type="submit" className="w-full bg-navy text-white py-4 rounded-2xl font-black text-sm uppercase tracking-[0.2em] shadow-xl hover:bg-black transition-all active:scale-95 mt-4">
                         Add to Portfolio
                      </button>
                   </form>
                </div>
             </div>
          </div>
        ) : (
          /* Strategy Tab (Legacy/Existing Strategy Logic) */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
                <h3 className="text-xl font-black text-navy mb-8 tracking-tight">Financial Profile</h3>
                <form onSubmit={fetchRecommendation} className="space-y-5">
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 px-1">Monthly Income (₹)</label>
                    <input type="number" name="monthlyIncome" value={formData.monthlyIncome} onChange={handleInputChange} required className="w-full px-5 py-3.5 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-primary focus:bg-white transition-all outline-none font-bold text-navy" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 px-1">Monthly Expenses (₹)</label>
                    <input type="number" name="monthlyExpenses" value={formData.monthlyExpenses} onChange={handleInputChange} required className="w-full px-5 py-3.5 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-primary focus:bg-white transition-all outline-none font-bold text-navy" />
                  </div>
                  <button type="submit" className="w-full bg-navy text-white py-4 rounded-2xl font-black text-sm uppercase tracking-[0.2em] shadow-xl hover:bg-black transition-all active:scale-95">
                    {strategyLoading ? 'Analyzing...' : 'Generate Plan'}
                  </button>
                </form>
              </div>
            </div>
            
            <div className="lg:col-span-8">
               {/* Simplified recommendation display for brevity, can be expanded to full previous UI if needed */}
               {recommendation ? (
                 <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
                    <h3 className="text-2xl font-black text-navy mb-4 tracking-tight">AI Strategy Recommendations</h3>
                    <p className="text-gray-500 mb-8 font-medium">{recommendation.message}</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       {recommendation.recommendation.allocation.map((item, i) => (
                          <div key={i} className="bg-gray-50 p-6 rounded-3xl border border-gray-100">
                             <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{item.asset}</span>
                             <h4 className="text-2xl font-black text-navy mt-1">{item.percentage}%</h4>
                          </div>
                       ))}
                    </div>
                 </div>
               ) : (
                 <div className="h-full min-h-[400px] bg-gray-50/50 rounded-[2.5rem] border border-dashed border-gray-200 flex flex-col items-center justify-center p-10 text-center">
                    <p className="text-gray-400 font-bold uppercase tracking-widest">Generate a plan to see insights</p>
                 </div>
               )}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
