import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  User, 
  Shield, 
  Settings, 
  Heart, 
  CalendarDays, 
  Gift, 
  Tag, 
  ChevronRight,
  LogOut 
} from 'lucide-react';
import toast from 'react-hot-toast';
import MainLayout from '../layouts/MainLayout';
import Skeleton from '../components/ui/Skeleton';
import { fetchProfile } from '../redux/slices/userSlice';
import api from '../services/api';
import { logout } from '../redux/slices/authSlice';

export default function Profile() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { profile: myProfile, loading: myLoading } = useSelector((s) => s.user);
  const { user: authUser } = useSelector((s) => s.auth);
  const [otherProfile, setOtherProfile] = useState(null);
  const [otherLoading, setOtherLoading] = useState(false);

  const isOwnProfile = !id || id === authUser?._id;
  const profile = isOwnProfile ? myProfile : otherProfile;
  const loading = isOwnProfile ? myLoading : otherLoading;

  useEffect(() => {
    if (isOwnProfile) {
      dispatch(fetchProfile());
    } else {
      setOtherLoading(true);
      api.get(`/users/${id}`)
        .then((r) => setOtherProfile(r.data.data))
        .catch(() => toast.error('User not found'))
        .finally(() => setOtherLoading(false));
    }
  }, [id, isOwnProfile, dispatch]);

  const handleLogout = () => {
    dispatch(logout());
    toast.success('Logged out successfully');
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-32 w-full rounded-2xl" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-32 w-full rounded-2xl" />)}
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="bg-[#F8F9FA] min-h-screen pt-26 pb-4">
        <div className="max-w-6xl mx-auto px-4">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-[13px] mb-6">
            <Link to="/" className="text-muted hover:text-dark transition-colors font-medium">Home</Link>
            <span className="text-muted/40">/</span>
            <span className="text-primary font-semibold">Profile</span>
          </nav>

          {/* Page Title */}
          <h1 className="text-2xl font-black text-dark mb-8 tracking-tight">Profile</h1>

          {/* Single Parent Container with Shadow */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-10 shadow-[0_4px_25px_-5px_rgba(0,0,0,0.05)] border border-gray-300"
          >
            <div className="space-y-12">
              {/* User Info Section */}
              <div className="flex items-center justify-between group px-2">
                <div className="flex items-center gap-6">
                  <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-primary/5 shadow-inner">
                    {profile?.profileImage || profile?.avatar ? (
                      <img 
                        src={profile?.profileImage || profile?.avatar} 
                        alt="" 
                        className="w-full h-full object-cover" 
                      />
                    ) : (
                      <div className="w-full h-full bg-primary/5 flex items-center justify-center">
                        <User size={36} className="text-primary/30" />
                      </div>
                    )}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-dark flex items-center gap-2 mb-1">
                      {profile?.firstName ? `${profile.firstName} ${profile.surname || ''}` : profile?.name || 'FlatMate User'}
                      {profile?.verified && <Shield size={18} className="text-primary fill-primary/10" />}
                    </h2>
                    <p className="text-base text-muted/60 font-normal tracking-wide lowercase">
                      {profile?.email || 'email@example.com'}
                    </p>
                  </div>
                </div>

              </div>

              {/* Action Grid Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <MenuCard 
                  icon={<Heart size={26} className="text-primary" />}
                  title="Shortlist"
                  subtitle="Click to check all the amazing properties you shortlisted for your stay."
                  to="/saved"
                />
                <MenuCard 
                  icon={<CalendarDays size={26} className="text-primary" />}
                  title="Bookings"
                  subtitle="You can see the completed and pending bookings here."
                  to="#"
                />
                <MenuCard 
                  icon={<Gift size={26} className="text-primary" />}
                  title="Refer and Earn"
                  subtitle="You can earn £50 on each successful referral. Click to see your referral code."
                  to="/refer"
                />
                <MenuCard 
                  icon={<Tag size={26} className="text-primary" />}
                  title="Offers"
                  subtitle="Explore the irresistible offers to save money on your student journey."
                  to="/offers"
                  badge="3"
                />
              </div>

              {/* Public Profile View (Bio/Tags) if not own profile */}
              {!isOwnProfile && profile && (
                <div className="pt-8 border-t border-gray-50">
                  <h3 className="text-xs font-bold text-dark uppercase tracking-widest mb-4">About</h3>
                  {profile.bio ? (
                    <p className="text-sm text-muted leading-relaxed mb-6">{profile.bio}</p>
                  ) : (
                    <p className="text-sm text-muted italic mb-6">No bio available</p>
                  )}
                  
                  <div className="flex flex-wrap gap-2">
                    {profile.lifestyleTags?.map(tag => (
                      <span 
                        key={tag} 
                        className="px-3 py-1.5 rounded-lg bg-surface text-muted text-xs font-medium border border-gray-100"
                      >
                        {tag.replace(/-/g, ' ')}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </MainLayout>
  );
}

function MenuCard({ icon, title, subtitle, to, badge }) {
  return (
    <Link 
      to={to}
      className="bg-white p-10 rounded-xl border border-gray-300 hover:border-primary/20 transition-all duration-300 flex items-center justify-between group h-full relative overflow-hidden"
    >
      <div className="flex flex-col items-start gap-5 flex-1 relative z-10 pr-8">
        <div className="w-16 h-16 rounded-full border border-gray-100 flex items-center justify-center flex-shrink-0 bg-white transition-all duration-500 group-hover:scale-105 group-hover:border-primary/30 group-hover:bg-primary/5">
          <div className="p-3 rounded-full">
            {icon}
          </div>
        </div>
        
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-dark text-lg tracking-tight group-hover:text-primary transition-colors duration-300">{title}</h3>
            {badge && (
              <span className="bg-primary text-white text-[10px] px-2 py-0.5 rounded-full flex items-center justify-center font-bold min-w-[20px] h-5 shadow-sm shadow-primary/20">
                {badge}
              </span>
            )}
          </div>
          <p className="text-sm text-muted/60 text-gray-500 leading-relaxed font-normal pr-4">
            {subtitle}
          </p>
        </div>
      </div>
      
      <div className="w-12 h-12 rounded-full bg-surface flex items-center justify-center flex-shrink-0 group-hover:bg-primary group-hover:text-white group-hover:translate-x-1 transition-all duration-500">
        <ChevronRight size={22} className="text-muted/40 group-hover:text-white transition-colors" />
      </div>
    </Link>
  );
}




