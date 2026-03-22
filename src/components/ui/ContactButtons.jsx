import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { MessageCircle, Phone, Lock, Loader2, Coins } from 'lucide-react';
import toast from 'react-hot-toast';
import { fetchBalance, addUnlocked } from '../../redux/slices/walletSlice';
import api from '../../services/api';

/**
 * Chat + Call buttons for cards and detail pages.
 * Checks phoneVisibility: if masked + not unlocked → show lock + pay button.
 * @param {string} userId - The user to contact (owner/poster)
 * @param {string} phone - Phone number
 * @param {string} phoneVisibility - 'reveal' | 'masked'
 * @param {string} listingType - 'room' | 'pg' | 'requirement'
 * @param {string} listingId - The listing ID
 * @param {string} size - 'sm' for cards, 'lg' for detail pages
 */
export default function ContactButtons({ userId, phone, phoneVisibility = 'masked', listingType, listingId, size = 'sm', className = '' }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { token, user } = useSelector((s) => s.auth);
  const { balance, unlockedListings } = useSelector((s) => s.wallet);
  const [unlocking, setUnlocking] = useState(false);
  const [revealedPhone, setRevealedPhone] = useState(null);

  const isOwner = userId === user?._id;
  const isUnlocked = isOwner || phoneVisibility === 'reveal' || unlockedListings.some(
    (u) => u.listingType === listingType && u.listingId === listingId
  );

  const handleChat = async (e) => {
    e.stopPropagation();
    e.preventDefault();
    if (!token) return toast.error('Login to chat');
    if (isOwner) return toast.error("That's you!");
    if (!isUnlocked) return handleUnlock(e);
    try {
      const res = await api.post('/messages', { receiverId: userId, text: 'Hi, I am interested!' });
      const convId = res.data.data?.conversation?._id;
      navigate(convId ? `/chat?conv=${convId}` : '/chat');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to start chat');
    }
  };

  const handleCall = (e) => {
    e.stopPropagation();
    e.preventDefault();
    if (!token) return toast.error('Login to call');
    if (!isUnlocked) return handleUnlock(e);
    const p = revealedPhone || phone;
    if (!p) return toast.error('Phone number not available');
    window.location.href = `tel:${p}`;
  };

  const handleUnlock = async (e) => {
    e.stopPropagation();
    e.preventDefault();
    if (!token) return toast.error('Login first');
    if (!listingType || !listingId) return toast.error('Cannot unlock this listing');

    if (balance < 19) {
      toast.error('Insufficient tokens. Recharge your wallet!');
      navigate('/wallet');
      return;
    }

    setUnlocking(true);
    try {
      const res = await api.post('/wallet/unlock', { listingType, listingId });
      const data = res.data.data;
      toast.success(data.message);
      setRevealedPhone(data.phone);
      dispatch(addUnlocked({ listingType, listingId }));
      dispatch(fetchBalance());
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to unlock';
      if (msg.includes('Insufficient') || msg.includes('Recharge')) {
        toast.error(msg);
        navigate('/wallet');
      } else {
        toast.error(msg);
      }
    }
    setUnlocking(false);
  };

  // ── Large layout (detail pages) ──
  if (size === 'lg') {
    if (!isUnlocked && !isOwner) {
      return (
        <div className={`space-y-2 ${className}`}>
          <button onClick={handleUnlock} disabled={unlocking}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-primary text-white font-semibold text-sm hover:bg-primary-dark transition-all cursor-pointer shadow-md shadow-primary/20 disabled:opacity-60">
            {unlocking ? <Loader2 size={16} className="animate-spin" /> : <Lock size={16} />}
            Unlock Chat & Call — 19 Tokens
          </button>
          <p className="text-center text-[10px] text-muted flex items-center justify-center gap-1">
            <Coins size={10} /> Balance: {balance} tokens
            {balance < 19 && <span className="text-primary font-semibold cursor-pointer hover:underline" onClick={() => navigate('/wallet')}> • Recharge</span>}
          </p>
        </div>
      );
    }
    return (
      <div className={`flex gap-2 ${className}`}>
        <button onClick={handleChat}
          className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-primary text-white font-semibold text-sm hover:bg-primary-dark transition-all cursor-pointer shadow-md shadow-primary/20">
          <MessageCircle size={16} /> Chat
        </button>
        <button onClick={handleCall}
          className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-white text-dark font-semibold text-sm border border-dark/8 hover:border-primary hover:text-primary transition-all cursor-pointer">
          <Phone size={16} /> Call
        </button>
      </div>
    );
  }

  // ── Small layout (cards) ──
  if (!isUnlocked && !isOwner) {
    return (
      <div className={`flex items-center gap-1 ${className}`}>
        <button onClick={handleUnlock} disabled={unlocking}
          className="h-8 px-2.5 rounded-full bg-primary/10 flex items-center justify-center gap-1 hover:bg-primary hover:text-white text-primary transition-all cursor-pointer text-[10px] font-semibold disabled:opacity-60"
          title="Unlock for 19 tokens">
          {unlocking ? <Loader2 size={12} className="animate-spin" /> : <Lock size={12} />}
          <span className="hidden sm:inline">19</span>
        </button>
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      <button onClick={handleChat}
        className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary hover:text-white text-primary transition-all cursor-pointer"
        title="Chat">
        <MessageCircle size={14} />
      </button>
      <button onClick={handleCall}
        className="w-8 h-8 rounded-full bg-dark/5 flex items-center justify-center hover:bg-dark/10 text-dark transition-all cursor-pointer"
        title="Call">
        <Phone size={14} />
      </button>
    </div>
  );
}
