import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, Settings } from 'lucide-react';
import MainLayout from '../layouts/MainLayout';
import MatchCard from '../components/cards/MatchCard';
import { CardSkeleton } from '../components/ui/Skeleton';
import EmptyState from '../components/ui/EmptyState';
import { fetchMatches } from '../redux/slices/matchSlice';
import { sendDirectMessage } from '../redux/slices/chatSlice';
import useAuth from '../hooks/useAuth';
import toast from 'react-hot-toast';

export default function Discover() {
  const { user } = useAuth();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { list, loading, error } = useSelector((s) => s.matches);

  useEffect(() => {
    if (user?._id) dispatch(fetchMatches(user._id));
  }, [user, dispatch]);

  const handleConnect = async (targetId) => {
    try {
      await dispatch(sendDirectMessage({ receiverId: targetId, text: 'Hi! I found you on Flatmate matching. Would love to connect!' })).unwrap();
      toast.success('Message sent! Check your chat.');
      navigate('/chat');
    } catch (err) {
      toast.error(err || 'Failed to send message');
    }
  };

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-dark flex items-center gap-2">
                <Sparkles className="text-primary" /> Discover Matches
              </h1>
              <p className="text-muted text-sm mt-1">People compatible with your preferences</p>
            </div>
          </div>

          {loading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} />)}
            </div>
          ) : error ? (
            <EmptyState
              icon={Settings}
              title="Set your preferences first"
              description="Update your preferences (budget, location, lifestyle) to discover compatible roommates."
              actionLabel="Set Preferences"
              onAction={() => navigate('/profile')}
            />
          ) : list.length === 0 ? (
            <EmptyState
              icon={Sparkles}
              title="No matches yet"
              description="We couldn't find matches right now. Try updating your preferences or check back later."
              actionLabel="Update Preferences"
              onAction={() => navigate('/profile')}
            />
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {list.map((match) => (
                <MatchCard key={match.user._id} match={match} onConnect={handleConnect} />
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </MainLayout>
  );
}
