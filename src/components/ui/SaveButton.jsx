import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Users, User } from 'lucide-react';
import { toggleSave } from '../../redux/slices/wishlistSlice';
import toast from 'react-hot-toast';
import api from '../../services/api';

export default function SaveButton({ itemType, itemId, className = '' }) {
  const dispatch = useDispatch();
  const { token } = useSelector((s) => s.auth);
  const savedIds = useSelector((s) => s.wishlist.savedIds);
  const key = `${itemType}_${itemId}`;
  const isSaved = !!savedIds[key];
  const [showMenu, setShowMenu] = useState(false);
  const [teams, setTeams] = useState([]);

  // Fetch teams once when menu opens
  useEffect(() => {
    if (!showMenu || !token) return;
    api.get('/teams').then((r) => setTeams(r.data.data || [])).catch(() => {});
  }, [showMenu, token]);

  const handleClick = (e) => {
    e.stopPropagation();
    e.preventDefault();
    if (!token) return toast.error('Login to save items');
    if (!itemId) return;

    if (isSaved) {
      // If already saved, just unsave
      dispatch(toggleSave({ itemType, itemId })).unwrap()
        .then(() => toast.success('Removed from saved'))
        .catch((err) => toast.error(typeof err === 'string' ? err : 'Failed'));
      return;
    }

    // Check if user has teams — show menu if yes
    api.get('/teams').then((r) => {
      const t = r.data.data || [];
      if (t.length > 0) {
        setTeams(t);
        setShowMenu(true);
      } else {
        savePersonal();
      }
    }).catch(() => savePersonal());
  };

  const savePersonal = () => {
    dispatch(toggleSave({ itemType, itemId })).unwrap()
      .then((r) => toast.success(r.saved ? 'Saved!' : 'Removed'))
      .catch((err) => toast.error(typeof err === 'string' ? err : 'Failed'));
    setShowMenu(false);
  };

  const saveToTeam = async (teamId, teamName) => {
    try {
      await api.post(`/teams/${teamId}/wishlist`, { itemType, itemId });
      toast.success(`Added to ${teamName}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Already in team wishlist');
    }
    setShowMenu(false);
  };

  return (
    <div className={`relative ${className}`}>
      <motion.button
        whileTap={{ scale: 0.85 }}
        onClick={handleClick}
        className={`w-8 h-8 rounded-full flex items-center justify-center transition-all cursor-pointer ${
          isSaved
            ? 'bg-primary text-white shadow-md shadow-primary/20'
            : 'bg-white/90 backdrop-blur-sm text-muted hover:text-primary shadow-sm'
        }`}
      >
        <Heart size={14} fill={isSaved ? 'white' : 'none'} />
      </motion.button>

      {/* Team vs Personal popup */}
      <AnimatePresence>
        {showMenu && (
          <>
            <div className="fixed inset-0 z-40" onClick={(e) => { e.stopPropagation(); setShowMenu(false); }} />
            <motion.div
              initial={{ opacity: 0, y: 5, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 5, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="absolute right-0 top-10 w-48 bg-white rounded-xl shadow-2xl border border-dark/6 py-1.5 z-50"
            >
              <p className="px-3 py-1 text-[10px] text-muted font-semibold uppercase tracking-wider">Save to</p>
              {/* Personal */}
              <button onClick={savePersonal}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-dark hover:bg-surface transition-colors cursor-pointer">
                <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
                  <User size={13} className="text-primary" />
                </div>
                <span className="font-medium text-xs">My Wishlist</span>
              </button>
              {/* Teams */}
              {teams.map((team) => (
                <button key={team._id} onClick={() => saveToTeam(team._id, team.name)}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-dark hover:bg-surface transition-colors cursor-pointer">
                  <div className="w-7 h-7 rounded-lg bg-dark/5 flex items-center justify-center">
                    <Users size={13} className="text-dark" />
                  </div>
                  <div className="text-left">
                    <span className="font-medium text-xs block">{team.name}</span>
                    <span className="text-[9px] text-muted">{team.members?.length} members</span>
                  </div>
                </button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
