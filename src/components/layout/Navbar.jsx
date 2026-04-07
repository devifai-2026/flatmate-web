import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, MessageCircle, User, LogOut, Plus, LayoutDashboard, Bell, Users, Heart, Sparkles, Wallet, Coins, ClipboardList, HelpCircle, Globe, ChevronDown, ChevronRight, Headset, Phone, Mail, Info, Calendar, Star, DownloadCloud, UserPlus, Handshake, LayoutList } from 'lucide-react';
import { logout } from '../../redux/slices/authSlice';
import Button from '../ui/Button';
import api from '../../services/api';
import useSocket from '../../hooks/useSocket';

export default function Navbar({ transparent = false }) {
  const { user, token } = useSelector((state) => state.auth);
  const { balance } = useSelector((state) => state.wallet);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const socket = useSocket();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [supportOpen, setSupportOpen] = useState(false);
  const [hasTeams, setHasTeams] = useState(false);
  const [unreadChats, setUnreadChats] = useState(0);
  const [unreadNotifs, setUnreadNotifs] = useState(0);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    if (!transparent) return;
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [transparent]);

  const refreshCounts = useCallback(() => {
    if (!token) return;
    api.get('/chat/conversations').then((r) => {
      const convos = r.data.data || [];
      setUnreadChats(convos.filter((c) => c.unreadCount > 0).length);
    }).catch(() => {});
    api.get('/notifications/unread-count').then((r) => {
      const convos = r.data.data || [];
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

  const isTransparent = transparent && !scrolled;
  const navClass = isTransparent
    ? "fixed top-0 left-0 right-0 z-50 bg-transparent transition-all duration-300"
    : "fixed top-0 left-0 right-0 z-50 glass border-b border-white/40 shadow-[0_1px_3px_rgba(0,0,0,0.04)] transition-all duration-300";
  
  const textColor = isTransparent ? "text-white" : "text-dark";
  const mutedColor = isTransparent ? "text-white/80" : "text-muted";

  return (
    <>
      <nav className={navClass}>
        <div className="max-w-[90%] mx-auto px-2 lg:px-0">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 flex-shrink-0 group">
              <span className={`text-2xl font-bold tracking-tight ${textColor}`}>
                flatmate
              </span>
            </Link>

            {/* Right side */}
            <div className="hidden md:flex items-center gap-6">
              <div className="relative">
                <button
                  onClick={() => setSupportOpen(!supportOpen)}
                  className={`flex items-center gap-1 cursor-pointer hover:opacity-80 transition-opacity ${textColor}`}
                >
                  <Headset size={18} />
                  <span className="text-sm font-medium">Support</span>
                  <ChevronDown size={14} className={`transition-transform duration-200 ${supportOpen ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {supportOpen && (
                    <>
                      <div className="fixed inset-0 z-40 outline-none" onClick={() => setSupportOpen(false)} />
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="absolute right-0 mt-4 w-[420px] bg-white rounded-2xl shadow-2xl shadow-dark/10 border border-gray-100 flex overflow-hidden z-50 pointer-events-auto"
                      >
                        {/* Left side: Support Now */}
                        <div className="flex-1 p-6">
                          <h4 className="text-[10px] uppercase tracking-wider text-muted font-bold mb-5 flex items-center gap-1.5 grayscale opacity-70">
                            Support Now
                          </h4>
                          <div className="space-y-4">
                            <button className="w-full flex items-center gap-3 group text-left">
                              <div className="w-9 h-9 rounded-xl bg-gray-50 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                                <MessageCircle size={18} className="text-muted group-hover:text-primary transition-colors" />
                              </div>
                              <div className="flex-1">
                                <p className="text-sm font-semibold text-dark">Quick Chat</p>
                              </div>
                              <span className="bg-[#10B981] text-white text-[9px] font-bold px-2 py-0.5 rounded-md">Online</span>
                            </button>

                            <button className="w-full flex items-center gap-3 group text-left">
                              <div className="w-9 h-9 rounded-xl bg-gray-50 flex items-center justify-center group-hover:bg-[#25D366]/10 transition-colors">
                                <Phone size={18} className="text-muted group-hover:text-[#25D366] transition-colors" />
                              </div>
                              <div className="flex-1">
                                <p className="text-sm font-semibold text-dark">Whatsapp</p>
                              </div>
                            </button>

                            <button className="w-full flex items-center gap-3 group text-left">
                              <div className="w-9 h-9 rounded-xl bg-gray-50 flex items-center justify-center group-hover:bg-[#0084FF]/10 transition-colors">
                                <MessageCircle size={18} className="text-muted group-hover:text-[#0084FF] transition-colors" />
                              </div>
                              <div className="flex-1">
                                <p className="text-sm font-semibold text-dark">Facebook Messenger</p>
                              </div>
                            </button>
                          </div>

                          <div className="mt-5 pt-5 border-t border-gray-50 space-y-4">
                            <a href="tel:+918035735724" className="flex items-center gap-3 text-sm font-medium text-dark hover:text-primary transition-colors group">
                              <div className="w-9 h-9 rounded-xl bg-gray-50 flex items-center justify-center group-hover:bg-primary/5">
                                <Phone size={16} className="text-muted" />
                              </div>
                              +91 8035735724
                            </a>
                            <a href="mailto:contact@flatmate.com" className="flex items-center gap-3 text-sm font-medium text-dark hover:text-primary transition-colors group">
                              <div className="w-9 h-9 rounded-xl bg-gray-50 flex items-center justify-center group-hover:bg-primary/5">
                                <Mail size={16} className="text-muted" />
                              </div>
                              contact@flatmate.com
                            </a>
                          </div>
                        </div>

                        {/* Right side: Quick Links */}
                        <div className="w-44 bg-surface/40 p-6 border-l border-gray-50">
                          <h4 className="text-[10px] uppercase tracking-wider text-muted font-bold mb-5 flex items-center gap-1.5 grayscale opacity-70">
                            Quick Links
                          </h4>
                          <div className="space-y-4">
                            <Link to="/help" className="flex items-center gap-3 group">
                              <HelpCircle size={18} className="text-muted group-hover:text-primary transition-colors" />
                              <span className="text-sm font-semibold text-dark group-hover:text-primary transition-colors">Help Center</span>
                            </Link>
                            <Link to="/how-it-works" className="flex items-center gap-3 group">
                              <Info size={18} className="text-muted group-hover:text-primary transition-colors" />
                              <span className="text-sm font-semibold text-dark group-hover:text-primary transition-colors">How It Works</span>
                            </Link>
                          </div>
                        </div>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
              
              <div className={`flex items-center gap-1 cursor-pointer hover:opacity-80 transition-opacity ${textColor}`}>
                <Globe size={18} />
                <span className="text-sm font-medium">En</span>
              </div>

              {user ? (
                <div className="flex items-center gap-4">
                  <Link to="/chat" className="relative p-1 hover:opacity-80 transition-opacity">
                    <MessageCircle size={20} className={textColor} />
                    {unreadChats > 0 && (
                      <span className="absolute -top-1 -right-1 min-w-[16px] h-4 bg-primary text-white text-[9px] font-bold rounded-full flex items-center justify-center px-1">
                        {unreadChats > 9 ? '9+' : unreadChats}
                      </span>
                    )}
                  </Link>

                  {/* Avatar dropdown */}
                  <div className="relative">
                    <button
                      onClick={() => setDropdownOpen(!dropdownOpen)}
                      className={`flex items-center gap-2 p-1 rounded-full border ${isTransparent ? 'border-white/30' : 'border-gray-200'} hover:bg-white/10 transition-all cursor-pointer`}
                    >
                      <div className="w-8 h-8 rounded-full overflow-hidden bg-white/20 flex items-center justify-center text-xs font-bold">
                        {user.profileImage ? (
                          <img src={user.profileImage} alt="" className="w-full h-full object-cover" />
                        ) : (
                          user.name?.charAt(0).toUpperCase()
                        )}
                      </div>
                      <Menu size={18} className={textColor} />
                    </button>
                    <AnimatePresence>
                      {dropdownOpen && (
                        <>
                          <div className="fixed inset-0 z-40" onClick={() => setDropdownOpen(false)} />
                          <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            transition={{ duration: 0.2 }}
                            className="absolute right-0 mt-3 w-64 bg-white rounded-2xl shadow-2xl shadow-dark/10 border border-gray-100 flex flex-col py-2 z-50 overflow-hidden"
                          >
                            {/* Group 1 */}
                            <div className="px-1.5 flex flex-col gap-0.5">
                              <Link to="/profile" onClick={() => setDropdownOpen(false)} className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-dark hover:bg-surface/50 transition-colors">
                                <User size={18} className="text-muted" /> Profile
                              </Link>
                              <Link to="/dashboard" onClick={() => setDropdownOpen(false)} className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-dark hover:bg-surface/50 transition-colors">
                                <Calendar size={18} className="text-muted" /> Bookings
                              </Link>
                              <Link to="/saved" onClick={() => setDropdownOpen(false)} className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-dark hover:bg-surface/50 transition-colors">
                                <Heart size={18} className="text-muted" /> Shortlist
                              </Link>
                              <Link to="#" onClick={() => setDropdownOpen(false)} className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-dark hover:bg-surface/50 transition-colors">
                                <DownloadCloud size={18} className="text-muted" /> Download App
                              </Link>
                            </div>

                            <div className="h-px bg-gray-100 my-1 mx-4" />

                            {/* Group 2 */}
                            <div className="px-1.5 flex flex-col gap-0.5">
                              <Link to="/teams" onClick={() => setDropdownOpen(false)} className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-dark hover:bg-surface/50 transition-colors group">
                                <Users size={18} className="text-muted" /> 
                                <span className="flex-1">Group Booking</span>
                                <span className="bg-[#10B981] text-white text-[9px] font-bold px-1.5 py-0.5 rounded-md">New</span>
                              </Link>
                              <Link to="#" onClick={() => setDropdownOpen(false)} className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-dark hover:bg-surface/50 transition-colors group">
                                <UserPlus size={18} className="text-muted" /> 
                                <span className="flex-1">Refer a Friend</span>
                                <span className="bg-[#10B981] text-white text-[9px] font-bold px-1.5 py-0.5 rounded-md">Get 50 GBP</span>
                              </Link>
                              <Link to="#" onClick={() => setDropdownOpen(false)} className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-dark hover:bg-surface/50 transition-colors">
                                <Handshake size={18} className="text-muted" /> Partner with Us
                              </Link>
                              <Link to="/post" onClick={() => setDropdownOpen(false)} className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-dark hover:bg-surface/50 transition-colors">
                                <LayoutList size={18} className="text-muted" /> List with Us
                              </Link>
                            </div>

                            <div className="h-px bg-gray-100 my-1 mx-4" />

                            {/* Group 3 */}
                            <div className="px-1.5 pt-0.5">
                              <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-dark hover:bg-red-50 hover:text-red-500 transition-all cursor-pointer">
                                <LogOut size={18} /> Logout
                              </button>
                            </div>
                          </motion.div>
                        </>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => navigate('/login')}
                    className={`text-sm font-medium hover:opacity-80 transition-opacity cursor-pointer ${textColor}`}
                  >
                    Log in
                  </button>
                  <div className="relative">
                    <button
                      onClick={() => navigate('/register')}
                      className={`flex items-center gap-2 p-1 rounded-full border ${isTransparent ? 'border-white/30' : 'border-gray-200'} hover:bg-white/10 transition-all cursor-pointer`}
                    >
                      <div className="w-8 h-8 rounded-full overflow-hidden bg-white/20 flex items-center justify-center">
                        <User size={16} className={textColor} />
                      </div>
                      <Menu size={18} className={textColor} />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile hamburger */}
            <button onClick={() => setMobileOpen(!mobileOpen)} className={`md:hidden p-2 cursor-pointer ${textColor}`}>
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 bg-dark/40 backdrop-blur-sm z-[100] md:hidden"
            />
            
            {/* Drawer */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-full max-w-[320px] bg-white z-[101] shadow-2xl flex flex-col md:hidden overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-5 border-b border-gray-50 flex-shrink-0">
                <span className="text-xl font-black text-[#0c1b3d] tracking-tight">Menu</span>
                <button 
                  onClick={() => setMobileOpen(false)}
                  className="p-2 hover:bg-gray-50 rounded-full transition-colors text-gray-400 hover:text-dark"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Scrollable Content */}
              <div className="flex-1 overflow-y-auto no-scrollbar py-4 flex flex-col">
                
                {/* Section 1: Support, Shortlist, Preferences */}
                <div className="px-3 space-y-1 pb-4 border-b border-gray-50">
                  <button className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors group">
                    <div className="flex items-center gap-3">
                      <Headset size={20} className="text-gray-500 group-hover:text-primary transition-colors" />
                      <span className="text-[15px] font-semibold text-gray-700">Support</span>
                    </div>
                    <ChevronDown size={18} className="text-gray-300" />
                  </button>
                  <button onClick={() => { navigate('/saved'); setMobileOpen(false); }} className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors group">
                    <Heart size={20} className="text-gray-500 group-hover:text-primary transition-colors" />
                    <span className="text-[15px] font-semibold text-gray-700">Shortlist</span>
                  </button>
                  <button className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors group">
                    <div className="flex items-center gap-3">
                      <Globe size={20} className="text-gray-500 group-hover:text-primary transition-colors" />
                      <span className="text-[15px] font-semibold text-gray-700">Select Preferences En</span>
                    </div>
                    <ChevronRight size={18} className="text-gray-300" />
                  </button>
                </div>

                {/* Section 2: Account (Profile, Bookings) */}
                <div className="px-3 space-y-1 py-4 border-b border-gray-50">
                  <button onClick={() => { navigate('/profile'); setMobileOpen(false); }} className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors group">
                    <User size={20} className="text-gray-500 group-hover:text-primary transition-colors" />
                    <span className="text-[15px] font-semibold text-gray-700">Profile</span>
                  </button>
                  <button onClick={() => { navigate('/dashboard'); setMobileOpen(false); }} className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors group">
                    <Calendar size={20} className="text-gray-500 group-hover:text-primary transition-colors" />
                    <span className="text-[15px] font-semibold text-gray-700">Bookings</span>
                  </button>
                </div>

                {/* Section 3: B2B/Referrals */}
                <div className="px-3 space-y-1 py-4 border-b border-gray-50">
                  <button className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors group">
                    <div className="flex items-center gap-3 text-left">
                      <Users size={20} className="text-gray-500 group-hover:text-primary transition-colors shrink-0" />
                      <span className="text-[15px] font-semibold text-gray-700">Group Booking</span>
                    </div>
                    <span className="bg-[#10B981] text-white text-[10px] font-bold px-2 py-0.5 rounded-md">New</span>
                  </button>
                  <button className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors group">
                    <div className="flex items-center gap-3 text-left">
                      <UserPlus size={20} className="text-gray-500 group-hover:text-primary transition-colors shrink-0" />
                      <span className="text-[15px] font-semibold text-gray-700">Refer a Friend</span>
                    </div>
                    <span className="bg-[#10B981] text-white text-[10px] font-bold px-2 py-0.5 rounded-md">Get 50 GBP</span>
                  </button>
                  <button className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors group">
                    <Handshake size={20} className="text-gray-500 group-hover:text-primary transition-colors" />
                    <span className="text-[15px] font-semibold text-gray-700">Partner with Us</span>
                  </button>
                  <button className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors group text-left">
                    <LayoutList size={20} className="text-gray-500 group-hover:text-primary transition-colors shrink-0" />
                    <span className="text-[15px] font-semibold text-gray-700">List with Us</span>
                  </button>
                </div>

                {/* App Promo Section */}
                <div className="px-6 py-6">
                  <div className="bg-gray-50/50 border border-gray-100 rounded-2xl p-4 flex flex-col items-center">
                    <div className="flex items-center gap-3 mb-4 w-full">
                       <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-gray-100 flex items-center justify-center p-1.5 overflow-hidden shrink-0">
                         <img src="https://i.ibb.co/3yxqLp1/amber-logo.png" alt="Amber" className="w-full h-full object-contain" onError={(e) => e.target.src = 'https://amberstudent.com/static-assets/amber-v2/icons/favicon.png'} />
                       </div>
                       <div className="flex-1 overflow-hidden">
                         <p className="text-[11px] font-black text-[#0c1b3d] leading-tight mb-1 truncate">£20 cashback on the app!</p>
                         <div className="flex items-center gap-1">
                           <Star size={10} className="fill-yellow-400 text-yellow-400" />
                           <span className="text-[11px] font-bold text-gray-500">4.5/5</span>
                           <span className="text-[10px] text-gray-400 font-medium ml-1">| 180K+ Downloads</span>
                         </div>
                       </div>
                    </div>
                    <button className="w-full py-2 bg-white border border-pink-100 text-pink-500 font-black text-xs rounded-xl shadow-sm hover:shadow-md transition-all active:scale-95">
                      Download App
                    </button>
                  </div>
                </div>

                {/* Footer Section: Logout */}
                <div className="mt-auto px-6 py-6 pt-0">
                  <button 
                    onClick={() => { handleLogout(); setMobileOpen(false); }}
                    className="w-full flex items-center gap-3 text-gray-600 hover:text-red-500 font-bold transition-colors"
                  >
                    <LogOut size={20} />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
