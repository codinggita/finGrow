import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchNotifications, markNotificationAsRead } from '../features/notifications/notificationSlice';

export default function NotificationCenter() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const dispatch = useDispatch();
  const { items, loading } = useSelector((state) => state.notifications);
  
  const unreadCount = items.filter(n => !n.isRead).length;

  useEffect(() => {
    dispatch(fetchNotifications());
    // Polling for new notifications every 30 seconds
    const interval = setInterval(() => {
      dispatch(fetchNotifications());
    }, 30000);
    return () => clearInterval(interval);
  }, [dispatch]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleToggle = () => setIsOpen(!isOpen);

  const handleMarkAsRead = (id) => {
    dispatch(markNotificationAsRead(id));
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={handleToggle}
        className="p-2 text-gray-400 hover:text-primary transition-colors relative focus:outline-none"
      >
        <span className="sr-only">View notifications</span>
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 text-[10px] text-white font-bold items-center justify-center">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 overflow-hidden animate-fade-in">
          <div className="p-4 border-b border-gray-50 flex items-center justify-between bg-gray-50/50">
            <h3 className="text-sm font-bold text-navy">Notifications</h3>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{unreadCount} New</span>
          </div>
          
          <div className="max-h-96 overflow-y-auto">
            {loading && items.length === 0 ? (
              <div className="p-8 text-center text-gray-400 text-sm italic">Loading...</div>
            ) : items.length === 0 ? (
              <div className="p-8 text-center text-gray-400 text-sm">No notifications yet.</div>
            ) : (
              items.map((notification) => (
                <div 
                  key={notification._id} 
                  className={`p-4 border-b border-gray-50 hover:bg-gray-50 transition-colors cursor-pointer relative ${!notification.isRead ? 'bg-primary/5' : ''}`}
                  onClick={() => !notification.isRead && handleMarkAsRead(notification._id)}
                >
                  <div className="flex gap-3">
                    <div className={`mt-1 h-2 w-2 rounded-full flex-shrink-0 ${!notification.isRead ? 'bg-primary' : 'bg-transparent'}`} />
                    <div>
                      <p className={`text-sm ${!notification.isRead ? 'font-bold text-navy' : 'text-gray-600'}`}>
                        {notification.message}
                      </p>
                      <p className="text-[10px] text-gray-400 mt-1">
                        {new Date(notification.createdAt).toLocaleDateString()} at {new Date(notification.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
          
          <div className="p-3 bg-gray-50 text-center border-t border-gray-100">
            <button className="text-xs font-bold text-primary hover:text-primary-dark transition-colors">
              View All Activity
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
