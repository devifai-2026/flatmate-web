import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { Home, Building2, Users, Plus, MessageCircle, Bell, Heart, Sparkles, ArrowRight, Eye, Wallet, ClipboardList, Settings } from 'lucide-react';
import MainLayout from '../layouts/MainLayout';
import Button from '../components/ui/Button';
import Skeleton from '../components/ui/Skeleton';
import { getAvatar, getRoomImage } from '../utils/constants';
import api from '../services/api';

const fadeUp = { hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4 } } };
const stagger = { visible: { transition: { staggerChildren: 0.06 } } };

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useSelector((s) => s.auth);
  const { balance } = useSelector((s) => s.wallet);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/dashboard')
      .then((r) => setData(r.data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const stats = data?.stats || {};

  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 mt-20 ">
        <motion.div initial="hidden" animate="visible" variants={stagger}>

          {/* ── Welcome Header ── */}
          <motion.div variants={fadeUp} className="relative rounded-2xl overflow-hidden mb-6">
            <div className="bg-gradient-to-r from-primary via-primary-dark to-primary p-6 sm:p-8">
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
              <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-white/5 rounded-full blur-xl" />
              <div className="relative z-10 flex items-center justify-between">
                <div>
                  <p className="text-white/50 text-xs font-medium uppercase tracking-wider">Dashboard</p>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
                    Hello, {user?.name?.split(' ')[0] || 'there'} 👋
                  </h1>
                  <p className="text-white/50 text-sm mt-1 max-w-sm">Manage your listings, track enquiries, and connect with flatmates.</p>
                </div>
                <div className="hidden sm:flex gap-2">
                  <Button size="sm" className="!bg-white !text-primary hover:!bg-white/90 rounded-xl shadow-lg" onClick={() => navigate('/post')}>
                    <Plus size={15} /> Post Listing
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>

          {loading ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {[1,2,3,4].map((i) => <Skeleton key={i} className="h-28 rounded-2xl" />)}
            </div>
          ) : (
            <>
              {/* ── Stats Grid ── */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
                {[
                  { icon: Home, label: 'My Rooms', value: stats.myRooms || 0, sub: `${stats.roomUnlocks || 0} unlocks`, color: 'text-primary', bg: 'bg-primary/8' },
                  { icon: Building2, label: 'My PGs', value: stats.myPGs || 0, sub: `${stats.pgUnlocks || 0} unlocks`, color: 'text-violet-600', bg: 'bg-violet-50' },
                  { icon: Users, label: 'Flatmate Posts', value: stats.myRequirements || 0, sub: `${stats.requirementUnlocks || 0} unlocks`, color: 'text-amber-600', bg: 'bg-amber-50' },
                  { icon: Eye, label: 'Total Enquiries', value: stats.totalUnlocks || 0, sub: 'people viewed your contact', color: 'text-emerald-600', bg: 'bg-emerald-50' },
                ].map((s) => (
                  <motion.div key={s.label} variants={fadeUp}
                    className="bg-white rounded-2xl p-4 border border-gray-100 hover:shadow-md transition-shadow">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${s.bg} mb-3`}>
                      <s.icon size={20} className={s.color} />
                    </div>
                    <p className="text-2xl font-extrabold text-dark">{s.value}</p>
                    <p className="text-xs font-medium text-dark mt-0.5">{s.label}</p>
                    <p className="text-[10px] text-muted">{s.sub}</p>
                  </motion.div>
                ))}
              </div>

              {/* ── Wallet + Quick Actions Row ── */}
              <div className="grid sm:grid-cols-3 gap-3 mb-6">
                {/* Wallet card */}
                <motion.div variants={fadeUp}>
                  <Link to="/wallet" className="block bg-gradient-to-br from-dark to-secondary rounded-2xl p-5 text-white hover:shadow-xl transition-shadow h-full">
                    <div className="flex items-center justify-between mb-3">
                      <Wallet size={20} className="text-white/50" />
                      <span className="text-[10px] text-white/40 uppercase tracking-wider font-medium">Wallet</span>
                    </div>
                    <p className="text-3xl font-extrabold">{balance}<span className="text-sm font-normal text-white/40 ml-1">tokens</span></p>
                    <p className="text-[10px] text-white/30 mt-1">Tap to recharge</p>
                  </Link>
                </motion.div>

                {/* Unread messages */}
                <motion.div variants={fadeUp}>
                  <Link to="/chat" className="block bg-white rounded-2xl p-5 border border-gray-100 hover:shadow-md transition-shadow h-full">
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                        <MessageCircle size={20} className="text-blue-600" />
                      </div>
                      {stats.unreadMessages > 0 && (
                        <span className="bg-primary text-white text-[10px] font-bold px-2 py-0.5 rounded-full">{stats.unreadMessages}</span>
                      )}
                    </div>
                    <p className="text-lg font-bold text-dark">Messages</p>
                    <p className="text-xs text-muted">{stats.unreadMessages || 0} unread</p>
                  </Link>
                </motion.div>

                {/* Notifications */}
                <motion.div variants={fadeUp}>
                  <Link to="/notifications" className="block bg-white rounded-2xl p-5 border border-gray-100 hover:shadow-md transition-shadow h-full">
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
                        <Bell size={20} className="text-amber-600" />
                      </div>
                      {stats.unreadNotifs > 0 && (
                        <span className="bg-primary text-white text-[10px] font-bold px-2 py-0.5 rounded-full">{stats.unreadNotifs}</span>
                      )}
                    </div>
                    <p className="text-lg font-bold text-dark">Notifications</p>
                    <p className="text-xs text-muted">{stats.unreadNotifs || 0} unread</p>
                  </Link>
                </motion.div>
              </div>

              {/* ── Quick Navigation ── */}
              <motion.div variants={fadeUp} className="mb-6">
                <h2 className="text-sm font-bold text-dark mb-3">Quick Actions</h2>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { icon: ClipboardList, label: 'My Listings', path: '/my-listings', color: 'text-primary', bg: 'bg-primary/8' },
                    { icon: Heart, label: 'Saved', path: '/saved', color: 'text-red-500', bg: 'bg-red-50' },
                    { icon: Users, label: 'Teams', path: '/teams', color: 'text-violet-600', bg: 'bg-violet-50' },
                    { icon: Sparkles, label: 'Preferences', path: '/preferences', color: 'text-amber-600', bg: 'bg-amber-50' },
                  ].map((a) => (
                    <Link key={a.label} to={a.path}
                      className="flex items-center gap-3 bg-white rounded-xl p-3.5 border border-gray-100 hover:shadow-sm transition-all group">
                      <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${a.bg}`}>
                        <a.icon size={17} className={a.color} />
                      </div>
                      <span className="text-xs font-semibold text-dark group-hover:text-primary transition-colors">{a.label}</span>
                    </Link>
                  ))}
                </div>
              </motion.div>

              {/* ── Recent Rooms ── */}
              {data?.recentRooms?.length > 0 && (
                <motion.div variants={fadeUp}>
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="text-sm font-bold text-dark">Latest Rooms on Platform</h2>
                    <Link to="/search" className="text-xs font-semibold text-primary flex items-center gap-1 hover:gap-2 transition-all">
                      View All <ArrowRight size={12} />
                    </Link>
                  </div>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    {data.recentRooms.map((room) => (
                      <Link key={room._id} to={`/rooms/${room._id}`}
                        className="bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-md transition-all group">
                        <div className="h-28 overflow-hidden">
                          <img src={getRoomImage(room._id, room.images)} alt={room.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" />
                        </div>
                        <div className="p-3">
                          <p className="text-xs font-bold text-dark line-clamp-1">{room.title}</p>
                          <p className="text-[10px] text-muted line-clamp-1 mt-0.5">{room.location}</p>
                          <p className="text-sm font-extrabold text-primary mt-1">₹{room.rent?.toLocaleString('en-IN')}<span className="text-[10px] font-normal text-muted">/mo</span></p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* ── Recent Chats ── */}
              {data?.recentConversations?.length > 0 && (
                <motion.div variants={fadeUp} className="mt-6">
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="text-sm font-bold text-dark">Recent Conversations</h2>
                    <Link to="/chat" className="text-xs font-semibold text-primary flex items-center gap-1 hover:gap-2 transition-all">
                      All Chats <ArrowRight size={12} />
                    </Link>
                  </div>
                  <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden divide-y divide-gray-50">
                    {data.recentConversations.slice(0, 4).map((conv) => {
                      const other = conv.participants?.find((p) => p._id !== user?._id);
                      if (!other) return null;
                      return (
                        <Link key={conv._id} to={`/chat?conv=${conv._id}`}
                          className="flex items-center gap-3 px-4 py-3 hover:bg-surface/50 transition-colors">
                          <img src={getAvatar(other._id, other.profileImage)} alt="" className="w-9 h-9 rounded-full object-cover" />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold text-dark">{other.name || other.phone}</p>
                            <p className="text-[10px] text-muted truncate">{conv.lastMessage?.text || 'Start chatting'}</p>
                          </div>
                          <ArrowRight size={14} className="text-muted/30" />
                        </Link>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </>
          )}
        </motion.div>
      </div>
    </MainLayout>
  );
}
