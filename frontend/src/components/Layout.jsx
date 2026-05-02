import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import api from '../services/api';
import NotificationCenter from './NotificationCenter';

const SidebarItem = ({ icon, text, active, to }) => {
  return (
    <Link to={to} className={`flex items-center gap-3 px-6 py-3 font-medium cursor-pointer transition-colors ${active ? 'text-primary border-r-4 border-primary bg-green-50/50' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'}`}>
      <span className={active ? 'text-primary' : 'text-gray-400'}>{icon}</span>
      {text}
    </Link>
  );
};

export default function Layout({ children }) {
  const location = useLocation();
  const [profile, setProfile] = useState({ fullName: 'Alex Rivers', email: 'Premium Member', profilePicture: 'https://i.pravatar.cc/150?img=11' });

  useEffect(() => {
    api.get('/profile')
      .then(response => {
        if (response.data && response.data.fullName) {
          setProfile(response.data);
        }
      })
      .catch(err => console.error('Error fetching profile for layout:', err));
  }, []);

  return (
    <div className="flex h-screen bg-background overflow-hidden font-sans">
      {/* Sidebar */}
      <div className="w-64 flex-shrink-0 flex flex-col bg-background border-r border-gray-100">
        <div className="p-6 pb-8">
          <Link to="/" className="flex flex-col hover:opacity-80 transition-opacity">
            <h1 className="text-2xl font-bold text-primary flex items-center gap-2">
              FinGrow
            </h1>
            <p className="text-xs text-gray-500 mt-1">Stress-free finance</p>
          </Link>
        </div>

        <nav className="flex-1 space-y-1">
          <SidebarItem 
            to="/dashboard" 
            active={location.pathname === '/dashboard'} 
            text="Dashboard" 
            icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></svg>} 
          />
          <SidebarItem 
            to="/expenses" 
            active={location.pathname === '/expenses'} 
            text="Expenses" 
            icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>} 
          />
          <SidebarItem 
            to="/investments" 
            active={location.pathname === '/investments'} 
            text="Investments" 
            icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/></svg>} 
          />
          <SidebarItem 
            to="/insights" 
            active={location.pathname === '/insights'} 
            text="Insights" 
            icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/></svg>} 
          />
          <SidebarItem 
            to="/profile" 
            active={location.pathname === '/profile'} 
            text="Profile" 
            icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>} 
          />
        </nav>

        <div className="p-4 mb-4">
          <div className="bg-white rounded-2xl p-4 flex items-center gap-3 border border-gray-100 shadow-sm cursor-pointer hover:shadow-md transition-shadow">
            {profile.profilePicture ? (
              <img className="h-10 w-10 rounded-full object-cover border border-gray-200" src={profile.profilePicture} alt={profile.fullName} />
            ) : (
              <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-bold border border-gray-300">
                {profile.fullName.charAt(0)}
              </div>
            )}
            <div className="flex flex-col">
              <span className="text-sm font-bold text-navy truncate w-32">{profile.fullName}</span>
              <span className="text-[10px] text-gray-500 font-medium truncate w-32">{profile.email}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden bg-white rounded-tl-3xl shadow-sm border border-gray-100">
        {/* Top Header */}
        <header className="h-20 flex items-center justify-between px-10 flex-shrink-0 border-b border-gray-50">
          <div className="flex-1 flex items-center">
            <div className="relative w-full max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              </div>
              <input 
                type="text" 
                placeholder="Search transactions..." 
                className="block w-full pl-10 pr-3 py-2 border border-transparent rounded-full leading-5 bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-primary focus:border-transparent sm:text-sm transition-all"
              />
            </div>
          </div>
          <div className="ml-4 flex items-center md:ml-6 gap-6">
            <NotificationCenter />
            <button className="flex items-center gap-2 border border-gray-200 hover:border-green-600 bg-white text-gray-800 px-4 py-2 rounded-xl text-sm font-semibold hover:shadow-sm transition-all group">
              <svg width="18" height="18" className="text-green-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>
              Connect Bank
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-gray-50/30 p-10">
          {children}
        </main>
      </div>
    </div>
  );
}
