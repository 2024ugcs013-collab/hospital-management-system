import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../services/api';

export default function Navbar({ onMenuClick, title = 'Dashboard', user, onLogout }) {
  const navigate = useNavigate();
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  
  const profileRef = useRef(null);
  const notifRef = useRef(null);

  // Fetch notifications
  const fetchNotifications = async () => {
    try {
      if (user) {
        const response = await api.get('/notifications');
        if (response.data?.success) {
          setNotifications(response.data.notifications);
        }
      }
    } catch (err) {
      console.error('Error fetching notifications:', err);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 10000); // Poll every 10s
    return () => clearInterval(interval);
  }, [user]);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileDropdownOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setNotificationsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleMarkAllRead = async () => {
    try {
      await api.put('/notifications/read-all');
      setNotifications(notifications.map((n) => ({ ...n, isRead: true })));
    } catch (err) {
      console.error(err);
    }
  };

  const handleNotificationClick = async (notif) => {
    try {
      if (!notif.isRead) {
        await api.put(`/notifications/${notif._id}/read`);
        setNotifications(notifications.map((n) => n._id === notif._id ? { ...n, isRead: true } : n));
      }
      setNotificationsOpen(false);
      
      // Route based on type
      if (notif.type === 'appointment') {
        navigate('/patient/appointments');
      } else if (notif.type === 'prescription') {
        navigate('/patient/prescriptions');
      } else if (notif.type === 'order') {
        navigate('/patient/orders');
      } else {
        navigate('/patient/notifications');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleGlobalSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/patient/store?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  };

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur-md">
      <div className="flex items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        {/* Left side: Logo & Toggle Button */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onMenuClick}
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:border-brand-200 hover:text-brand-700 lg:hidden"
            aria-label="Toggle sidebar"
          >
            <span className="text-xl">☰</span>
          </button>
          
          <div className="hidden lg:flex items-center gap-2">
            <span className="text-xl font-bold text-slate-800 tracking-tight">CareCenter</span>
            <span className="rounded-full bg-brand-50 px-2 py-0.5 text-2xs font-semibold text-brand-600 uppercase">Patient</span>
          </div>
        </div>

        {/* Middle: Global Search */}
        <form onSubmit={handleGlobalSearch} className="hidden md:flex flex-1 max-w-md">
          <div className="relative w-full">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-slate-400 text-sm">🔍</span>
            </div>
            <input
              type="text"
              placeholder="Search medicines, doctors, or help topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl bg-slate-50 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 focus:bg-white transition"
            />
          </div>
        </form>

        {/* Right side: Actions & User Dropdown */}
        <div className="flex items-center gap-4">
          {/* Notification bell */}
          <div className="relative" ref={notifRef}>
            <button
              type="button"
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className="relative p-2 text-slate-600 hover:bg-slate-50 rounded-xl border border-slate-100 transition"
              aria-label="Notifications"
            >
              <span className="text-lg">🔔</span>
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white ring-2 ring-white animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notification dropdown popover */}
            {notificationsOpen && (
              <div className="absolute right-0 mt-2 w-80 rounded-2xl border border-slate-200 bg-white p-4 shadow-xl ring-1 ring-black/5 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-2">
                  <h3 className="font-semibold text-slate-800 text-sm">Notifications</h3>
                  {unreadCount > 0 && (
                    <button
                      type="button"
                      onClick={handleMarkAllRead}
                      className="text-xs text-brand-600 hover:text-brand-700 font-medium"
                    >
                      Mark all as read
                    </button>
                  )}
                </div>
                <div className="max-h-64 overflow-y-auto space-y-2">
                  {notifications.length === 0 ? (
                    <p className="text-center text-xs py-4 text-slate-400">No notifications yet.</p>
                  ) : (
                    notifications.slice(0, 4).map((n) => (
                      <div
                        key={n._id}
                        onClick={() => handleNotificationClick(n)}
                        className={`p-2.5 rounded-xl text-left cursor-pointer transition ${
                          n.isRead ? 'hover:bg-slate-50' : 'bg-brand-50/40 border border-brand-100 hover:bg-brand-50'
                        }`}
                      >
                        <div className="flex justify-between items-start gap-1">
                          <p className="text-xs font-semibold text-slate-800 truncate">{n.title}</p>
                          {!n.isRead && <span className="h-1.5 w-1.5 rounded-full bg-brand-500 shrink-0 mt-1" />}
                        </div>
                        <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">{n.message}</p>
                        <p className="text-[9px] text-slate-400 mt-1">
                          {new Date(n.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    ))
                  )}
                </div>
                <Link
                  to="/patient/notifications"
                  onClick={() => setNotificationsOpen(false)}
                  className="block text-center text-xs font-semibold text-slate-600 hover:text-slate-800 border-t border-slate-100 pt-2 mt-2"
                >
                  View all notifications
                </Link>
              </div>
            )}
          </div>

          {/* User profile dropdown */}
          <div className="relative flex items-center" ref={profileRef}>
            <button
              type="button"
              onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
              className="flex items-center gap-2 text-left hover:bg-slate-50 p-1.5 rounded-xl transition border border-transparent hover:border-slate-100"
            >
              <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-brand-500 to-emerald-600 text-white font-bold flex items-center justify-center text-sm shadow-sm">
                {user?.name ? user.name[0].toUpperCase() : 'P'}
              </div>
              <div className="hidden sm:block">
                <p className="text-xs text-slate-400">Patient</p>
                <p className="text-xs font-semibold text-slate-800 max-w-[100px] truncate">{user?.name || 'Guest'}</p>
              </div>
            </button>

            {/* Profile Dropdown popover */}
            {profileDropdownOpen && (
              <div className="absolute right-0 top-full mt-2 w-56 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl ring-1 ring-black/5 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="px-3 py-2 border-b border-slate-100 mb-1">
                  <p className="text-xs text-slate-400">Signed in as</p>
                  <p className="text-sm font-semibold text-slate-800 truncate">{user?.name || 'Patient User'}</p>
                  <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                </div>
                
                <Link
                  to="/patient/profile"
                  onClick={() => setProfileDropdownOpen(false)}
                  className="flex items-center gap-2 w-full text-left px-3 py-2 rounded-xl text-sm text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition"
                >
                  <span>👤</span> Profile
                </Link>
                
                <Link
                  to="/patient/settings"
                  onClick={() => setProfileDropdownOpen(false)}
                  className="flex items-center gap-2 w-full text-left px-3 py-2 rounded-xl text-sm text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition"
                >
                  <span>⚙️</span> Settings
                </Link>
                
                <button
                  type="button"
                  onClick={() => {
                    setProfileDropdownOpen(false);
                    onLogout();
                  }}
                  className="flex items-center gap-2 w-full text-left px-3 py-2 rounded-xl text-sm text-rose-600 hover:bg-rose-50 hover:text-rose-700 transition"
                >
                  <span>🚪</span> Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
