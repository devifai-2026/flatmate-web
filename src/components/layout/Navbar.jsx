import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, MessageCircle, User, LogOut, Plus, LayoutDashboard, Bell, Users, Heart, Sparkles, Wallet, Coins } from 'lucide-react';
import { logout } from '../../redux/slices/authSlice';
import Button from '../ui/Button';
import api from '../../services/api';
import useSocket from '../../hooks/useSocket';

export default function Navbar() {
  const { user, token } = useSelector((state) => state.auth);
  const { balance } = useSelector((state) => state.wallet);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const socket = useSocket();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [hasTeams, setHasTeams] = useState(false);
  const [unreadChats, setUnreadChats] = useState(0);
  const [unreadNotifs, setUnreadNotifs] = useState(0);

  const refreshCounts = useCallback(() => {
    if (!token) return;
    api.get('/chat/conversations').then((r) => {
      const convos = r.data.data || [];
      setUnreadChats(convos.filter((c) => c.unreadCount > 0).length);
    }).catch(() => {});
    api.get('/notifications/unread-count').then((r) => {
      setUnreadNotifs(r.data.data?.count || 0);
    }).catch(() => {});
  }, [token]);

  // Initial fetch
  useEffect(() => {
    if (!token) return;
    api.get('/teams').then((r) => setHasTeams((r.data.data || []).length > 0)).catch(() => {});
    refreshCounts();
  }, [token, refreshCounts]);

  // Listen for socket events to update badges in real-time
  useEffect(() => {
    if (!socket) return;

    const onNewMessage = () => refreshCounts();
    const onMessagesRead = () => refreshCounts();
    const onMessagesDelivered = () => refreshCounts();
    const onNewNotification = () => setUnreadNotifs((c) => c + 1);

    socket.on('new-message', onNewMessage);
    socket.on('messages-read', onMessagesRead);
    socket.on('messages-delivered', onMessagesDelivered);
    socket.on('new-notification', onNewNotification);

    return () => {
      socket.off('new-message', onNewMessage);
      socket.off('messages-read', onMessagesRead);
      socket.off('messages-delivered', onMessagesDelivered);
      socket.off('new-notification', onNewNotification);
    };
  }, [socket, refreshCounts]);

  // Listen for custom events from Notifications page (mark read, delete, clear)
  useEffect(() => {
    const handler = () => refreshCounts();
    window.addEventListener('notifications-updated', handler);
    return () => window.removeEventListener('notifications-updated', handler);
  }, [refreshCounts]);

  const handleLogout = () => {
    dispatch(logout());
    setDropdownOpen(false);
    navigate('/');
  };

  return (
    <nav className="sticky top-0 z-30 glass border-b border-white/40 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 flex-shrink-0 group">
            <div className="w-9 h-9 bg-gradient-to-br from-primary to-primary-dark rounded-xl flex items-center justify-center shadow-lg shadow-primary/20 group-hover:shadow-primary/40 transition-shadow">
              <span className="text-white font-extrabold text-sm">F</span>
            </div>
            <span className="text-xl font-extrabold text-dark tracking-tight">
              Flat<span className="text-gradient-primary">Mate</span>
              <sup className="text-[8px] text-muted font-normal ml-0.5">®</sup>
            </span>
          </Link>

          {/* Right side */}
          <div className="hidden md:flex items-center gap-2">
            {user ? (
              <>
                <Button size="sm" onClick={() => navigate('/post')} className="rounded-xl gap-1.5">
                  <Plus size={14} /> Post Listing
                  <span className="bg-white/20 text-[9px] font-bold px-1.5 py-0.5 rounded-md ml-0.5">FREE</span>
                </Button>
                <Link to="/wallet" className="flex items-center gap-1 px-2.5 py-1.5 bg-primary/5 hover:bg-primary/10 rounded-xl transition-colors border border-primary/10">
                  <Coins size={14} className="text-primary" />
                  <span className="text-xs font-bold text-primary">{balance}</span>
                </Link>
                <Link to="/chat" className="relative p-2 hover:bg-gray-50 rounded-xl transition-colors">
                  <MessageCircle size={20} className="text-muted" />
                  {unreadChats > 0 && (
                    <span className="absolute top-0.5 right-0.5 min-w-[16px] h-4 bg-primary text-white text-[9px] font-bold rounded-full flex items-center justify-center px-1">
                      {unreadChats > 9 ? '9+' : unreadChats}
                    </span>
                  )}
                </Link>
                <Link to="/notifications" className="relative p-2 hover:bg-gray-50 rounded-xl transition-colors">
                  <Bell size={20} className="text-muted" />
                  {unreadNotifs > 0 && (
                    <span className="absolute top-0.5 right-0.5 min-w-[16px] h-4 bg-primary text-white text-[9px] font-bold rounded-full flex items-center justify-center px-1">
                      {unreadNotifs > 9 ? '9+' : unreadNotifs}
                    </span>
                  )}
                </Link>

                {/* Avatar dropdown */}
                <div className="relative ml-1">
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="w-9 h-9 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center text-primary font-bold text-sm ring-2 ring-primary/10 cursor-pointer hover:ring-primary/25 transition-all"
                  >
                    {user.profileImage ? (
                      <img src={user.profileImage} alt="" className="w-full h-full rounded-full object-cover" />
                    ) : (
                      user.name?.charAt(0).toUpperCase()
                    )}
                  </button>
                  <AnimatePresence>
                    {dropdownOpen && (
                      <>
                        <div className="fixed inset-0 z-40" onClick={() => setDropdownOpen(false)} />
                        <motion.div
                          initial={{ opacity: 0, y: 8, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 8, scale: 0.95 }}
                          transition={{ duration: 0.15 }}
                          className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl shadow-dark/10 border border-gray-100 py-2 z-50"
                        >
                          <div className="px-4 py-3 border-b border-gray-50">
                            <p className="font-semibold text-dark text-sm">{user.name}</p>
                            <p className="text-xs text-muted truncate">{user.email}</p>
                          </div>
                          <Link to="/dashboard" onClick={() => setDropdownOpen(false)} className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-muted hover:bg-surface transition-colors">
                            <LayoutDashboard size={16} /> Dashboard
                          </Link>
                          <Link to="/profile" onClick={() => setDropdownOpen(false)} className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-muted hover:bg-surface transition-colors">
                            <User size={16} /> Profile
                          </Link>
                          <Link to="/preferences" onClick={() => setDropdownOpen(false)} className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-muted hover:bg-surface transition-colors">
                            <Sparkles size={16} /> My Preferences
                          </Link>
                          <Link to="/chat" onClick={() => setDropdownOpen(false)} className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-muted hover:bg-surface transition-colors">
                            <MessageCircle size={16} /> Messages
                          </Link>
                          <Link to="/teams" onClick={() => setDropdownOpen(false)} className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-muted hover:bg-surface transition-colors">
                            <Users size={16} /> {hasTeams ? 'My Teams' : 'Create Team'}
                          </Link>
                          <Link to="/wallet" onClick={() => setDropdownOpen(false)} className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-muted hover:bg-surface transition-colors">
                            <Wallet size={16} /> Wallet
                          </Link>
                          <Link to="/saved" onClick={() => setDropdownOpen(false)} className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-muted hover:bg-surface transition-colors">
                            <Heart size={16} /> Saved
                          </Link>
                          <div className="border-t border-gray-50 mt-1 pt-1">
                            <button onClick={handleLogout} className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors cursor-pointer">
                              <LogOut size={16} /> Sign out
                            </button>
                          </div>
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={() => navigate('/login')} className="rounded-xl">Log in</Button>
                <Button size="sm" onClick={() => navigate('/register')} className="rounded-xl">Sign up free</Button>
              </div>
            )}
          </div>

          {/* Mobile hamburger */}
          <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden p-2 cursor-pointer">
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden overflow-hidden bg-white border-t border-gray-100"
          >
            <div className="px-4 py-3 space-y-1">
              {user ? (
                <>
                  <Link to="/post" onClick={() => setMobileOpen(false)} className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm text-primary font-medium hover:bg-primary/5">
                    <Plus size={16} /> Post Listing
                  </Link>
                  <Link to="/dashboard" onClick={() => setMobileOpen(false)} className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm text-muted hover:bg-surface">
                    <LayoutDashboard size={16} /> Dashboard
                  </Link>
                  <Link to="/chat" onClick={() => setMobileOpen(false)} className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm text-muted hover:bg-surface">
                    <MessageCircle size={16} /> Messages
                  </Link>
                  <button onClick={handleLogout} className="w-full flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm text-red-500 hover:bg-red-50 cursor-pointer">
                    <LogOut size={16} /> Sign out
                  </button>
                </>
              ) : (
                <div className="flex gap-2 pt-2">
                  <Button variant="outline" size="sm" className="flex-1 rounded-xl" onClick={() => { navigate('/login'); setMobileOpen(false); }}>Log in</Button>
                  <Button size="sm" className="flex-1 rounded-xl" onClick={() => { navigate('/register'); setMobileOpen(false); }}>Sign up</Button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
