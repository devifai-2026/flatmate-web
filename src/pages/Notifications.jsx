import { useEffect, useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Bell, Check, CheckCheck, Trash2, MessageCircle, Home, Users, Sparkles, Shield, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import MainLayout from '../layouts/MainLayout';
import EmptyState from '../components/ui/EmptyState';
import Button from '../components/ui/Button';
import { getAvatar } from '../utils/constants';
import api from '../services/api';

const typeIcons = {
  message: MessageCircle,
  enquiry: Home,
  match: Sparkles,
  team_join: Users,
  team_wishlist: Home,
  system: Shield,
};

const typeColors = {
  message: 'bg-primary/10 text-primary',
  enquiry: 'bg-primary/10 text-primary',
  match: 'bg-primary/10 text-primary',
  team_join: 'bg-primary/10 text-primary',
  team_wishlist: 'bg-primary/10 text-primary',
  system: 'bg-dark/5 text-dark',
};

function timeAgo(date) {
  const now = new Date();
  const d = new Date(date);
  const diff = Math.floor((now - d) / 1000);
  if (diff < 60) return 'Just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
}

export default function Notifications() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [pagination, setPagination] = useState(null);
  const sentinelRef = useRef(null);

  const fetchNotifications = async (page = 1, append = false) => {
    if (page === 1) setLoading(true); else setLoadingMore(true);
    try {
      const r = await api.get('/notifications', { params: { page, limit: 15 } });
      const data = r.data.data;
      if (append) {
        setNotifications((prev) => {
          const existingIds = new Set(prev.map((n) => n._id));
          return [...prev, ...(data.notifications || []).filter((n) => !existingIds.has(n._id))];
        });
      } else {
        setNotifications(data.notifications || []);
      }
      setUnreadCount(data.unreadCount || 0);
      setPagination(data.pagination || null);
    } catch { if (!append) setNotifications([]); }
    setLoading(false);
    setLoadingMore(false);
  };

  useEffect(() => { fetchNotifications(); }, []);

  const hasMore = pagination ? pagination.page < pagination.pages : false;

  const loadMore = useCallback(() => {
    if (!hasMore || loadingMore) return;
    fetchNotifications(pagination.page + 1, true);
  }, [hasMore, loadingMore, pagination]);

  // IntersectionObserver for infinite scroll
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el || !hasMore) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting && !loadingMore && hasMore) loadMore(); },
      { rootMargin: '200px', threshold: 0 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [loadMore, hasMore, loadingMore]);

  const notifyNavbar = () => window.dispatchEvent(new Event('notifications-updated'));

  const markAsRead = async (id) => {
    try {
      await api.put(`/notifications/${id}/read`);
      setNotifications((prev) => prev.map((n) => n._id === id ? { ...n, read: true } : n));
      setUnreadCount((c) => Math.max(0, c - 1));
      notifyNavbar();
    } catch {}
  };

  const markAllAsRead = async () => {
    try {
      await api.put('/notifications/read-all');
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      setUnreadCount(0);
      toast.success('All marked as read');
      notifyNavbar();
    } catch {}
  };

  const remove = async (id) => {
    try {
      await api.delete(`/notifications/${id}`);
      setNotifications((prev) => prev.filter((n) => n._id !== id));
      toast.success('Deleted');
      notifyNavbar();
    } catch {}
  };

  const clearAll = async () => {
    try {
      await api.delete('/notifications');
      setNotifications([]);
      setUnreadCount(0);
      toast.success('All cleared');
      notifyNavbar();
    } catch {}
  };

  const handleClick = (notif) => {
    if (!notif.read) markAsRead(notif._id);
    if (notif.link?.type === 'chat' && notif.link?.id) navigate(`/chat?conv=${notif.link.id}`);
    else if (notif.link?.type === 'room' && notif.link?.id) navigate(`/rooms/${notif.link.id}`);
    else if (notif.link?.type === 'team') navigate('/teams');
    else if (notif.link?.type === 'profile' && notif.link?.id) navigate(`/profile/${notif.link.id}`);
  };

  return (
    <MainLayout>
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-primary/10 rounded-xl flex items-center justify-center relative">
              <Bell size={20} className="text-primary" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[16px] h-4 bg-primary text-white text-[9px] font-bold rounded-full flex items-center justify-center px-1">
                  {unreadCount}
                </span>
              )}
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-dark">Notifications</h1>
              <p className="text-xs text-muted">{unreadCount > 0 ? `${unreadCount} unread` : 'All caught up'}</p>
            </div>
          </div>
          <div className="flex gap-2">
            {unreadCount > 0 && (
              <Button variant="ghost" size="sm" className="rounded-xl" onClick={markAllAsRead}>
                <CheckCheck size={14} /> Read All
              </Button>
            )}
            {notifications.length > 0 && (
              <Button variant="ghost" size="sm" className="rounded-xl !text-red-500" onClick={clearAll}>
                <Trash2 size={14} /> Clear
              </Button>
            )}
          </div>
        </div>

        {/* List */}
        {loading ? (
          <div className="space-y-3">
            {[0,1,2,3].map((i) => <div key={i} className="h-20 bg-white rounded-xl animate-pulse" />)}
          </div>
        ) : notifications.length === 0 ? (
          <EmptyState icon={Bell} title="No notifications" description="You're all caught up! Notifications about messages, matches, and teams will appear here." />
        ) : (
          <div className="space-y-2">
            {notifications.map((notif) => {
              const Icon = typeIcons[notif.type] || Bell;
              const colorClass = typeColors[notif.type] || 'bg-dark/5 text-dark';
              return (
                <motion.div key={notif._id} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}
                  className={`flex items-start gap-3 p-3.5 rounded-xl cursor-pointer transition-all group ${
                    notif.read ? 'bg-white border border-dark/4' : 'bg-primary/[0.03] border border-primary/10'
                  } hover:shadow-sm`}
                  onClick={() => handleClick(notif)}>
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${colorClass}`}>
                    <Icon size={16} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className={`text-sm leading-snug ${notif.read ? 'text-dark' : 'text-dark font-semibold'}`}>{notif.title}</p>
                        {notif.body && <p className="text-xs text-muted mt-0.5 line-clamp-2">{notif.body}</p>}
                      </div>
                      <span className="text-[10px] text-muted flex-shrink-0 mt-0.5">{timeAgo(notif.createdAt)}</span>
                    </div>
                    {notif.fromUser && (
                      <div className="flex items-center gap-1.5 mt-1.5">
                        <img src={getAvatar(notif.fromUser._id, notif.fromUser.profileImage)} alt="" className="w-4 h-4 rounded-full" />
                        <span className="text-[10px] text-muted">{notif.fromUser.name}</span>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                    {!notif.read && (
                      <button onClick={(e) => { e.stopPropagation(); markAsRead(notif._id); }}
                        className="p-1.5 hover:bg-primary/10 rounded-lg cursor-pointer" title="Mark as read">
                        <Check size={12} className="text-primary" />
                      </button>
                    )}
                    <button onClick={(e) => { e.stopPropagation(); remove(notif._id); }}
                      className="p-1.5 hover:bg-red-50 rounded-lg cursor-pointer" title="Delete">
                      <Trash2 size={12} className="text-muted" />
                    </button>
                  </div>
                </motion.div>
              );
            })}
            {/* Infinite scroll sentinel */}
            {hasMore && (
              <div ref={sentinelRef} className="flex justify-center py-4">
                {loadingMore && <Loader2 size={20} className="text-primary animate-spin" />}
              </div>
            )}
          </div>
        )}
      </div>
    </MainLayout>
  );
}
