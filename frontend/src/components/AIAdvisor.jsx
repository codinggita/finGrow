import React, { useState } from 'react';
import api from '../services/api';

export default function AIAdvisor() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'ai', text: "Hello! I'm your FinGrow AI Advisor. How can I help you optimize your wealth today?" }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = { role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      // Rule-based logic simulated in frontend for speed, or call backend
      setTimeout(() => {
        let aiResponse = "That's an interesting question. Based on your current efficiency score, I recommend focusing on increasing your emergency fund before making aggressive investments.";
        
        const lowerInput = input.toLowerCase();
        if (lowerInput.includes('gold')) aiResponse = "Gold is a great hedge against inflation. I suggest allocating 5-10% of your portfolio to Digital Gold or SGBs.";
        if (lowerInput.includes('crypto')) aiResponse = "Crypto is high-risk. Given your medium risk appetite, limit your exposure to 2-3% in Bitcoin or Ethereum.";
        if (lowerInput.includes('budget')) aiResponse = "I noticed you're overspending on 'Food'. Try setting a tighter budget and logging daily to stay on track.";
        
        setMessages(prev => [...prev, { role: 'ai', text: aiResponse }]);
        setLoading(false);
      }, 1000);
    } catch (err) {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-8 right-8 z-[100]">
      {isOpen ? (
        <div className="w-80 h-[450px] bg-white rounded-3xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
           <div className="bg-navy p-4 flex justify-between items-center">
              <div className="flex items-center gap-2">
                 <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-black text-xs">AI</div>
                 <span className="text-white font-bold text-sm">FinGrow Advisor</span>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white">
                 <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
              </button>
           </div>
           
           <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                   <div className={`max-w-[80%] p-3 rounded-2xl text-xs font-medium leading-relaxed ${m.role === 'user' ? 'bg-primary text-white rounded-tr-none' : 'bg-gray-100 text-navy rounded-tl-none'}`}>
                      {m.text}
                   </div>
                </div>
              ))}
              {loading && <div className="text-[10px] text-gray-400 animate-pulse font-bold italic">AI is thinking...</div>}
           </div>

           <form onSubmit={handleSend} className="p-4 border-t border-gray-50 flex gap-2">
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask anything..." 
                className="flex-1 bg-gray-50 border-none rounded-xl px-4 py-2 text-xs focus:ring-1 focus:ring-primary outline-none font-medium"
              />
              <button type="submit" className="bg-navy text-white p-2 rounded-xl hover:bg-black transition-all">
                 <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>
              </button>
           </form>
        </div>
      ) : (
        <button 
          onClick={() => setIsOpen(true)}
          className="w-16 h-16 bg-navy text-white rounded-full shadow-xl flex items-center justify-center hover:scale-110 transition-all active:scale-95 group relative"
        >
           <div className="absolute -top-1 -right-1 w-4 h-4 bg-primary rounded-full border-2 border-white"></div>
           <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
        </button>
      )}
    </div>
  );
}
