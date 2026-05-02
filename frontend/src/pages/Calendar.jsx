import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import api from '../services/api';
import SEO from '../components/SEO';

export default function CashflowCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [recurring, setRecurring] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [recRes, expRes] = await Promise.all([
          api.get('/recurring'),
          api.get('/expenses')
        ]);
        setRecurring(recRes.data);
        setExpenses(expRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    return { firstDay, daysInMonth };
  };

  const { firstDay, daysInMonth } = getDaysInMonth(currentDate);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const blanks = Array.from({ length: firstDay }, (_, i) => i);

  const getEventsForDay = (day) => {
    const dateStr = new Date(currentDate.getFullYear(), currentDate.getMonth(), day).toISOString().split('T')[0];
    
    // Past Expenses
    const dayExpenses = expenses.filter(e => e.date.split('T')[0] === dateStr);
    
    // Upcoming Recurring
    const dayRecurring = recurring.filter(r => {
      const next = new Date(r.nextOccurrence);
      return next.getFullYear() === currentDate.getFullYear() && 
             next.getMonth() === currentDate.getMonth() && 
             next.getDate() === day;
    });

    return [...dayExpenses.map(e => ({ ...e, type: 'expense' })), ...dayRecurring.map(r => ({ ...r, type: 'recurring' }))];
  };

  return (
    <Layout>
      <SEO title="Cashflow Calendar" description="Track your past spending and upcoming bills in a visual calendar." />
      <div className="flex flex-col gap-8 max-w-7xl mx-auto pb-10">
        <div className="flex justify-between items-end">
          <div>
            <h2 className="text-3xl font-black text-navy tracking-tight">Cashflow Calendar</h2>
            <p className="text-gray-500 text-sm font-medium mt-1">A visual timeline of your financial life.</p>
          </div>
          <div className="flex items-center bg-gray-100 p-1 rounded-xl">
             <button onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)))} className="p-2 hover:bg-white rounded-lg transition-all text-navy">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m15 18-6-6 6-6"/></svg>
             </button>
             <span className="px-4 font-black text-navy text-sm uppercase tracking-widest">
                {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
             </span>
             <button onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)))} className="p-2 hover:bg-white rounded-lg transition-all text-navy">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m9 18 6-6-6-6"/></svg>
             </button>
          </div>
        </div>

        <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
          <div className="grid grid-cols-7 bg-gray-50/50 border-b border-gray-100">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
              <div key={d} className="py-4 text-center text-[10px] font-black text-gray-400 uppercase tracking-widest">{d}</div>
            ))}
          </div>
          <div className="grid grid-cols-7">
            {blanks.map(i => <div key={`b-${i}`} className="h-32 border-r border-b border-gray-50 bg-gray-50/20"></div>)}
            {days.map(day => {
              const events = getEventsForDay(day);
              const isToday = new Date().toDateString() === new Date(currentDate.getFullYear(), currentDate.getMonth(), day).toDateString();
              
              return (
                <div key={day} className={`h-32 border-r border-b border-gray-50 p-2 transition-all hover:bg-green-50/30 group relative ${isToday ? 'bg-green-50/20' : ''}`}>
                  <span className={`text-xs font-black ${isToday ? 'text-primary bg-white px-2 py-1 rounded-lg shadow-sm' : 'text-gray-300 group-hover:text-navy'}`}>
                    {day}
                  </span>
                  <div className="mt-2 space-y-1 overflow-y-auto max-h-[80px] scrollbar-hide">
                    {events.map((e, idx) => (
                      <div key={idx} className={`text-[9px] font-bold px-2 py-1 rounded-md truncate ${e.type === 'recurring' ? 'bg-navy text-white' : 'bg-green-100 text-green-700'}`}>
                        {e.type === 'recurring' ? '🔔 ' : ''}{e.title || e.description}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-green-100 text-green-600 flex items-center justify-center">
                 <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 6L9 17l-5-5"/></svg>
              </div>
              <div>
                 <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Logged Expenses</p>
                 <h4 className="text-xl font-black text-navy">{expenses.length}</h4>
              </div>
           </div>
           <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-navy text-white flex items-center justify-center">
                 <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 2v20"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
              </div>
              <div>
                 <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Upcoming Bills</p>
                 <h4 className="text-xl font-black text-navy">{recurring.length}</h4>
              </div>
           </div>
        </div>
      </div>
    </Layout>
  );
}
