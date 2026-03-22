import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, FileText, Sparkles, Plus, Search, Users, ArrowRight, TrendingUp, MessageCircle } from 'lucide-react';
import MainLayout from '../layouts/MainLayout';
import Button from '../components/ui/Button';
import useAuth from '../hooks/useAuth';
import { ILLUSTRATIONS } from '../utils/constants';

const stagger = { visible: { transition: { staggerChildren: 0.08 } } };
const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const stats = [
    { icon: Home, label: 'Active Rooms', value: '—', color: 'bg-primary/10 text-primary', trend: '+12%' },
    { icon: FileText, label: 'Requirements', value: '—', color: 'bg-secondary/10 text-secondary', trend: '+8%' },
    { icon: Sparkles, label: 'Matches Found', value: '—', color: 'bg-primary/10 text-primary', trend: '+24%' },
    { icon: MessageCircle, label: 'Messages', value: '—', color: 'bg-secondary/10 text-secondary', trend: 'New' },
  ];

  const actions = [
    { icon: Plus, label: 'Post a Room', desc: 'List your room and find tenants', image: ILLUSTRATIONS.search, onClick: () => navigate('/post') },
    { icon: FileText, label: 'Post Requirement', desc: 'Tell everyone what you need', image: ILLUSTRATIONS.moving, onClick: () => navigate('/post') },
    { icon: Search, label: 'Browse Rooms', desc: 'Search verified listings', image: ILLUSTRATIONS.chat, onClick: () => navigate('/search') },
    { icon: Users, label: 'Find Matches', desc: 'Discover compatible roommates', image: ILLUSTRATIONS.match, onClick: () => navigate('/discover') },
  ];

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div initial="hidden" animate="visible" variants={stagger}>
          {/* Welcome banner */}
          <motion.div variants={fadeUp} className="relative rounded-3xl overflow-hidden mb-8">
            <img src={ILLUSTRATIONS.team} alt="" className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/80 to-primary/60" />
            <div className="relative z-10 p-8 sm:p-10">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white mb-2">
                Welcome back, {user?.name?.split(' ')[0]} 👋
              </h1>
              <p className="text-white/60 text-sm max-w-md mb-5">Your dashboard for managing listings, discovering matches, and connecting with potential roommates.</p>
              <div className="flex gap-3">
                <Button size="sm" className="!bg-white !text-primary hover:!bg-gray-50 rounded-xl shadow-lg" onClick={() => navigate('/post')}>
                  <Plus size={16} /> New Listing
                </Button>
                <Button size="sm" variant="ghost" className="!text-white/80 hover:!bg-white/10 rounded-xl" onClick={() => navigate('/discover')}>
                  <Sparkles size={16} /> View Matches
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {stats.map((s) => (
              <motion.div key={s.label} variants={fadeUp} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${s.color}`}>
                    <s.icon size={20} />
                  </div>
                  <span className="flex items-center gap-1 text-xs font-medium text-primary">
                    <TrendingUp size={12} /> {s.trend}
                  </span>
                </div>
                <p className="text-2xl font-extrabold text-dark">{s.value}</p>
                <p className="text-xs text-muted mt-0.5">{s.label}</p>
              </motion.div>
            ))}
          </div>

          {/* Quick Actions */}
          <motion.div variants={fadeUp}>
            <h2 className="text-lg font-bold text-dark mb-4">Quick Actions</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {actions.map((a) => (
                <motion.button
                  key={a.label}
                  whileHover={{ y: -4 }}
                  onClick={a.onClick}
                  className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg transition-all text-left cursor-pointer group"
                >
                  <div className="h-28 relative overflow-hidden">
                    <img src={a.image} alt={a.label} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" loading="lazy" />
                    <div className="absolute inset-0 bg-gradient-to-t from-white via-white/50 to-transparent" />
                  </div>
                  <div className="p-4 -mt-4 relative">
                    <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center mb-2 shadow-sm">
                      <a.icon size={18} className="text-primary" />
                    </div>
                    <h3 className="font-semibold text-dark text-sm">{a.label}</h3>
                    <p className="text-xs text-muted mt-0.5">{a.desc}</p>
                    <span className="flex items-center gap-1 text-xs text-primary font-medium mt-2 group-hover:gap-2 transition-all">
                      Get started <ArrowRight size={12} />
                    </span>
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </MainLayout>
  );
}
