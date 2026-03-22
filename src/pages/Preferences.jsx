import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { Check, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';
import MainLayout from '../layouts/MainLayout';
import Button from '../components/ui/Button';
import { fetchProfile } from '../redux/slices/userSlice';
import { LIFESTYLE_TAGS } from '../utils/constants';
import api from '../services/api';

// Premium SVG icons — each is a rich detailed illustration
const icons = {
  'night-owl': (
    <svg viewBox="0 0 80 80" fill="none" className="w-full h-full">
      <circle cx="40" cy="40" r="38" fill="#1E1B4B" opacity="0.06"/>
      <ellipse cx="40" cy="56" rx="16" ry="6" fill="#1E1B4B" opacity="0.04"/>
      {/* Body */}
      <ellipse cx="40" cy="42" rx="14" ry="16" fill="#4338CA" opacity="0.12"/>
      {/* Eyes */}
      <circle cx="33" cy="36" r="6" fill="white"/><circle cx="47" cy="36" r="6" fill="white"/>
      <circle cx="33" cy="36" r="3.5" fill="#1E1B4B"/><circle cx="47" cy="36" r="3.5" fill="#1E1B4B"/>
      <circle cx="34" cy="35" r="1.2" fill="white"/>
      <circle cx="48" cy="35" r="1.2" fill="white"/>
      {/* Beak */}
      <path d="M37 42L40 45L43 42" fill="#F59E0B" opacity="0.7"/>
      {/* Ears */}
      <path d="M28 28L32 34" stroke="#4338CA" strokeWidth="2" strokeLinecap="round" opacity="0.3"/>
      <path d="M52 28L48 34" stroke="#4338CA" strokeWidth="2" strokeLinecap="round" opacity="0.3"/>
      {/* Moon */}
      <circle cx="58" cy="16" r="5" fill="#FCD34D" opacity="0.4"/>
      <circle cx="60" cy="14" r="4" fill="#1E1B4B" opacity="0.06"/>
      {/* Stars */}
      <circle cx="20" cy="14" r="1" fill="#FCD34D" opacity="0.5"/>
      <circle cx="14" cy="22" r="0.8" fill="#FCD34D" opacity="0.3"/>
      <circle cx="66" cy="24" r="0.8" fill="#FCD34D" opacity="0.4"/>
    </svg>
  ),
  'early-bird': (
    <svg viewBox="0 0 80 80" fill="none" className="w-full h-full">
      <circle cx="40" cy="40" r="38" fill="#FEF3C7"/>
      {/* Sun rays */}
      {[0,45,90,135,180,225,270,315].map((a,i) => (
        <line key={i} x1="40" y1="14" x2="40" y2="8" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" opacity="0.3" transform={`rotate(${a} 40 40)`}/>
      ))}
      {/* Sun */}
      <circle cx="40" cy="22" r="8" fill="#F59E0B" opacity="0.25"/>
      <circle cx="40" cy="22" r="5" fill="#F59E0B" opacity="0.15"/>
      {/* Bird body */}
      <ellipse cx="40" cy="48" rx="12" ry="8" fill="#F59E0B" opacity="0.2"/>
      {/* Wing */}
      <path d="M30 46Q24 40 28 36Q32 40 34 46" fill="#F59E0B" opacity="0.15"/>
      {/* Eye */}
      <circle cx="44" cy="44" r="2" fill="#92400E" opacity="0.5"/>
      {/* Beak */}
      <path d="M50 46L56 44L50 48" fill="#F59E0B" opacity="0.4"/>
      {/* Tail */}
      <path d="M28 50L20 48L22 52" fill="#F59E0B" opacity="0.15"/>
    </svg>
  ),
  'studious': (
    <svg viewBox="0 0 80 80" fill="none" className="w-full h-full">
      <circle cx="40" cy="40" r="38" fill="#EDE9FE"/>
      {/* Stack of books */}
      <rect x="20" y="44" width="40" height="8" rx="2" fill="#7C3AED" opacity="0.2"/>
      <rect x="22" y="36" width="36" height="8" rx="2" fill="#8B5CF6" opacity="0.25"/>
      <rect x="24" y="28" width="32" height="8" rx="2" fill="#A78BFA" opacity="0.3"/>
      {/* Open book on top */}
      <path d="M28 24L40 20L52 24L52 28L40 24L28 28Z" fill="white" stroke="#7C3AED" strokeWidth="0.8" opacity="0.6"/>
      {/* Page lines */}
      <line x1="32" y1="26" x2="38" y2="24" stroke="#7C3AED" strokeWidth="0.5" opacity="0.2"/>
      <line x1="42" y1="24" x2="48" y2="26" stroke="#7C3AED" strokeWidth="0.5" opacity="0.2"/>
      {/* Glasses */}
      <circle cx="34" cy="16" r="4" fill="none" stroke="#7C3AED" strokeWidth="1.2" opacity="0.3"/>
      <circle cx="46" cy="16" r="4" fill="none" stroke="#7C3AED" strokeWidth="1.2" opacity="0.3"/>
      <line x1="38" y1="16" x2="42" y2="16" stroke="#7C3AED" strokeWidth="1" opacity="0.3"/>
      {/* Sparkle */}
      <circle cx="58" cy="20" r="1.5" fill="#7C3AED" opacity="0.2"/>
    </svg>
  ),
  'fitness-freak': (
    <svg viewBox="0 0 80 80" fill="none" className="w-full h-full">
      <circle cx="40" cy="40" r="38" fill="#DBEAFE"/>
      {/* Dumbbell */}
      <rect x="18" y="36" width="44" height="8" rx="4" fill="#3B82F6" opacity="0.15"/>
      <rect x="12" y="32" width="10" height="16" rx="3" fill="#3B82F6" opacity="0.25"/>
      <rect x="58" y="32" width="10" height="16" rx="3" fill="#3B82F6" opacity="0.25"/>
      <rect x="14" y="34" width="6" height="12" rx="2" fill="#3B82F6" opacity="0.15"/>
      <rect x="60" y="34" width="6" height="12" rx="2" fill="#3B82F6" opacity="0.15"/>
      {/* Person silhouette above */}
      <circle cx="40" cy="18" r="5" fill="#3B82F6" opacity="0.15"/>
      <rect x="36" y="24" width="8" height="10" rx="3" fill="#3B82F6" opacity="0.12"/>
      {/* Sweat drops */}
      <circle cx="52" cy="22" r="1.5" fill="#3B82F6" opacity="0.2"/>
      <circle cx="56" cy="26" r="1" fill="#3B82F6" opacity="0.15"/>
    </svg>
  ),
  'sporty': (
    <svg viewBox="0 0 80 80" fill="none" className="w-full h-full">
      <circle cx="40" cy="40" r="38" fill="#D1FAE5"/>
      {/* Football */}
      <circle cx="40" cy="36" r="14" fill="white" stroke="#059669" strokeWidth="1.5" opacity="0.7"/>
      <path d="M40 22V50M26 36H54" stroke="#059669" strokeWidth="0.8" opacity="0.2"/>
      <path d="M30 26Q40 32 50 26" stroke="#059669" strokeWidth="0.8" fill="none" opacity="0.2"/>
      <path d="M30 46Q40 40 50 46" stroke="#059669" strokeWidth="0.8" fill="none" opacity="0.2"/>
      {/* Ground */}
      <ellipse cx="40" cy="58" rx="20" ry="3" fill="#059669" opacity="0.08"/>
      {/* Grass lines */}
      <line x1="24" y1="58" x2="26" y2="54" stroke="#059669" strokeWidth="0.8" opacity="0.15"/>
      <line x1="54" y1="58" x2="56" y2="54" stroke="#059669" strokeWidth="0.8" opacity="0.15"/>
    </svg>
  ),
  'wanderer': (
    <svg viewBox="0 0 80 80" fill="none" className="w-full h-full">
      <circle cx="40" cy="40" r="38" fill="#E0F2FE"/>
      {/* Mountain */}
      <path d="M10 60L30 28L42 44L50 34L70 60Z" fill="#0EA5E9" opacity="0.1"/>
      <path d="M10 60L30 28L42 44" fill="#0EA5E9" opacity="0.08"/>
      {/* Sun */}
      <circle cx="58" cy="20" r="6" fill="#F59E0B" opacity="0.2"/>
      {/* Clouds */}
      <ellipse cx="22" cy="22" rx="8" ry="3" fill="white" opacity="0.5"/>
      <ellipse cx="18" cy="21" rx="5" ry="2.5" fill="white" opacity="0.3"/>
      {/* Backpack person */}
      <circle cx="40" cy="46" r="4" fill="#0EA5E9" opacity="0.2"/>
      <rect x="37" y="50" width="6" height="8" rx="2" fill="#0EA5E9" opacity="0.15"/>
      <rect x="42" y="48" width="4" height="6" rx="1" fill="#F59E0B" opacity="0.2"/>
    </svg>
  ),
  'party-lover': (
    <svg viewBox="0 0 80 80" fill="none" className="w-full h-full">
      <circle cx="40" cy="40" r="38" fill="#FEF3C7"/>
      {/* Confetti */}
      <rect x="20" y="16" width="4" height="4" rx="1" fill="#EC4899" opacity="0.4" transform="rotate(20 22 18)"/>
      <rect x="54" y="14" width="4" height="4" rx="1" fill="#3B82F6" opacity="0.4" transform="rotate(-15 56 16)"/>
      <rect x="60" y="30" width="3" height="3" rx="1" fill="#F59E0B" opacity="0.3" transform="rotate(45 61 31)"/>
      <rect x="14" y="32" width="3" height="3" rx="1" fill="#059669" opacity="0.3"/>
      {/* Party hat */}
      <path d="M40 18L32 42L48 42Z" fill="#EC4899" opacity="0.15"/>
      <path d="M40 18L36 30L44 30Z" fill="#F59E0B" opacity="0.1"/>
      <circle cx="40" cy="16" r="2" fill="#F59E0B" opacity="0.4"/>
      {/* Face */}
      <circle cx="40" cy="48" r="10" fill="#FCD34D" opacity="0.15"/>
      <circle cx="36" cy="46" r="1.5" fill="#1E1B4B" opacity="0.3"/>
      <circle cx="44" cy="46" r="1.5" fill="#1E1B4B" opacity="0.3"/>
      <path d="M36 52Q40 56 44 52" stroke="#1E1B4B" strokeWidth="1.2" fill="none" strokeLinecap="round" opacity="0.3"/>
    </svg>
  ),
  'pet-lover': (
    <svg viewBox="0 0 80 80" fill="none" className="w-full h-full">
      <circle cx="40" cy="40" r="38" fill="#FCE7F3"/>
      {/* Paw print */}
      <ellipse cx="40" cy="44" rx="10" ry="8" fill="#EC4899" opacity="0.12"/>
      <circle cx="32" cy="34" r="4" fill="#EC4899" opacity="0.15"/>
      <circle cx="48" cy="34" r="4" fill="#EC4899" opacity="0.15"/>
      <circle cx="28" cy="42" r="3.5" fill="#EC4899" opacity="0.12"/>
      <circle cx="52" cy="42" r="3.5" fill="#EC4899" opacity="0.12"/>
      {/* Heart above */}
      <path d="M36 20C36 16 40 14 42 18C44 14 48 16 48 20C48 26 42 30 42 30C42 30 36 26 36 20Z" fill="#EC4899" opacity="0.2"/>
    </svg>
  ),
  'vegan': (
    <svg viewBox="0 0 80 80" fill="none" className="w-full h-full">
      <circle cx="40" cy="40" r="38" fill="#D1FAE5"/>
      {/* Big leaf */}
      <path d="M40 58C40 58 20 44 20 30C20 20 30 14 40 24C50 14 60 20 60 30C60 44 40 58 40 58Z" fill="#059669" opacity="0.12"/>
      {/* Leaf vein */}
      <path d="M40 24V52" stroke="#059669" strokeWidth="1" opacity="0.2"/>
      <path d="M32 32Q40 28 48 32" stroke="#059669" strokeWidth="0.8" fill="none" opacity="0.15"/>
      <path d="M30 40Q40 34 50 40" stroke="#059669" strokeWidth="0.8" fill="none" opacity="0.15"/>
      {/* Small leaf */}
      <path d="M56 18Q62 14 64 20Q58 22 56 18Z" fill="#059669" opacity="0.2"/>
    </svg>
  ),
  'non-alcoholic': (
    <svg viewBox="0 0 80 80" fill="none" className="w-full h-full">
      <circle cx="40" cy="40" r="38" fill="#FEE2E2"/>
      {/* Bottle */}
      <rect x="34" y="26" width="12" height="28" rx="4" fill="#EF4444" opacity="0.1"/>
      <rect x="36" y="20" width="8" height="8" rx="2" fill="#EF4444" opacity="0.08"/>
      <rect x="38" y="16" width="4" height="6" rx="2" fill="#EF4444" opacity="0.12"/>
      {/* X mark */}
      <circle cx="40" cy="40" r="16" fill="none" stroke="#EF4444" strokeWidth="2" opacity="0.2"/>
      <line x1="30" y1="30" x2="50" y2="50" stroke="#EF4444" strokeWidth="2.5" strokeLinecap="round" opacity="0.25"/>
    </svg>
  ),
  'music-lover': (
    <svg viewBox="0 0 80 80" fill="none" className="w-full h-full">
      <circle cx="40" cy="40" r="38" fill="#EDE9FE"/>
      {/* Headphones */}
      <path d="M24 40Q24 24 40 24Q56 24 56 40" fill="none" stroke="#7C3AED" strokeWidth="2.5" opacity="0.25" strokeLinecap="round"/>
      <rect x="20" y="38" width="8" height="14" rx="4" fill="#7C3AED" opacity="0.2"/>
      <rect x="52" y="38" width="8" height="14" rx="4" fill="#7C3AED" opacity="0.2"/>
      {/* Music notes */}
      <circle cx="38" cy="56" r="3" fill="#7C3AED" opacity="0.15"/>
      <rect x="40" y="48" width="1.5" height="10" rx="0.75" fill="#7C3AED" opacity="0.15"/>
      <circle cx="48" cy="52" r="2.5" fill="#7C3AED" opacity="0.12"/>
      <rect x="50" y="44" width="1.5" height="10" rx="0.75" fill="#7C3AED" opacity="0.12"/>
    </svg>
  ),
  'non-smoker': (
    <svg viewBox="0 0 80 80" fill="none" className="w-full h-full">
      <circle cx="40" cy="40" r="38" fill="#F3F4F6"/>
      {/* Cigarette */}
      <rect x="22" y="38" width="30" height="6" rx="2" fill="#D1D5DB" opacity="0.3"/>
      <rect x="22" y="38" width="20" height="6" rx="2" fill="#FCD34D" opacity="0.2"/>
      <rect x="52" y="38" width="6" height="6" rx="1" fill="#EF4444" opacity="0.15"/>
      {/* Smoke */}
      <path d="M56 36Q58 30 54 26" stroke="#D1D5DB" strokeWidth="1.5" fill="none" opacity="0.2" strokeLinecap="round"/>
      <path d="M58 34Q62 28 58 22" stroke="#D1D5DB" strokeWidth="1" fill="none" opacity="0.15" strokeLinecap="round"/>
      {/* No sign */}
      <circle cx="40" cy="40" r="18" fill="none" stroke="#EF4444" strokeWidth="2.5" opacity="0.2"/>
      <line x1="28" y1="28" x2="52" y2="52" stroke="#EF4444" strokeWidth="2.5" strokeLinecap="round" opacity="0.2"/>
    </svg>
  ),
  'foodie': (
    <svg viewBox="0 0 80 80" fill="none" className="w-full h-full">
      <circle cx="40" cy="40" r="38" fill="#FEF3C7"/>
      {/* Plate */}
      <ellipse cx="40" cy="44" rx="18" ry="14" fill="white" stroke="#E5E7EB" strokeWidth="1" opacity="0.7"/>
      <ellipse cx="40" cy="44" rx="12" ry="9" fill="#F3F4F6" opacity="0.5"/>
      {/* Food items */}
      <circle cx="36" cy="40" r="4" fill="#EF4444" opacity="0.3"/>{/* tomato */}
      <circle cx="44" cy="40" r="3.5" fill="#059669" opacity="0.3"/>{/* broccoli */}
      <ellipse cx="40" cy="46" rx="5" ry="3" fill="#F59E0B" opacity="0.25"/>{/* rice */}
      {/* Fork + knife */}
      <line x1="18" y1="30" x2="18" y2="54" stroke="#D1D5DB" strokeWidth="1.5" strokeLinecap="round" opacity="0.3"/>
      <line x1="62" y1="30" x2="62" y2="54" stroke="#D1D5DB" strokeWidth="1.5" strokeLinecap="round" opacity="0.3"/>
      <path d="M16 30L18 30L20 30M16 34L20 34" stroke="#D1D5DB" strokeWidth="1" opacity="0.2"/>
      {/* Steam */}
      <path d="M36 30Q38 26 36 22" stroke="#D1D5DB" strokeWidth="1" fill="none" opacity="0.2" strokeLinecap="round"/>
      <path d="M44 28Q46 24 44 20" stroke="#D1D5DB" strokeWidth="1" fill="none" opacity="0.15" strokeLinecap="round"/>
    </svg>
  ),
  'gamer': (
    <svg viewBox="0 0 80 80" fill="none" className="w-full h-full">
      <circle cx="40" cy="40" r="38" fill="#EDE9FE"/>
      {/* Controller */}
      <rect x="16" y="32" width="48" height="20" rx="10" fill="#7C3AED" opacity="0.15"/>
      {/* D-pad */}
      <rect x="24" y="39" width="10" height="3" rx="1" fill="#7C3AED" opacity="0.25"/>
      <rect x="28" y="35" width="3" height="10" rx="1" fill="#7C3AED" opacity="0.25"/>
      {/* Buttons */}
      <circle cx="50" cy="38" r="2.5" fill="#EC4899" opacity="0.3"/>
      <circle cx="56" cy="42" r="2.5" fill="#3B82F6" opacity="0.3"/>
      <circle cx="50" cy="46" r="2.5" fill="#059669" opacity="0.3"/>
      <circle cx="44" cy="42" r="2.5" fill="#F59E0B" opacity="0.3"/>
      {/* Joysticks */}
      <circle cx="28" cy="48" r="3" fill="#7C3AED" opacity="0.1" stroke="#7C3AED" strokeWidth="1" opacity="0.2"/>
      <circle cx="44" cy="48" r="3" fill="#7C3AED" opacity="0.1" stroke="#7C3AED" strokeWidth="1" opacity="0.2"/>
    </svg>
  ),
  'workaholic': (
    <svg viewBox="0 0 80 80" fill="none" className="w-full h-full">
      <circle cx="40" cy="40" r="38" fill="#DBEAFE"/>
      {/* Laptop */}
      <rect x="20" y="28" width="40" height="24" rx="3" fill="#3B82F6" opacity="0.15"/>
      <rect x="22" y="30" width="36" height="18" rx="2" fill="white" opacity="0.5"/>
      {/* Screen content */}
      <rect x="26" y="34" width="16" height="2" rx="1" fill="#3B82F6" opacity="0.2"/>
      <rect x="26" y="38" width="12" height="2" rx="1" fill="#3B82F6" opacity="0.15"/>
      <rect x="26" y="42" width="20" height="2" rx="1" fill="#3B82F6" opacity="0.1"/>
      {/* Keyboard base */}
      <rect x="16" y="52" width="48" height="3" rx="1.5" fill="#3B82F6" opacity="0.1"/>
      {/* Coffee cup */}
      <rect x="54" y="34" width="6" height="8" rx="2" fill="#92400E" opacity="0.15"/>
      <path d="M60 36Q64 36 64 40Q64 44 60 44" stroke="#92400E" strokeWidth="1" fill="none" opacity="0.1"/>
      {/* Steam */}
      <path d="M56 32Q58 28 56 24" stroke="#92400E" strokeWidth="0.8" fill="none" opacity="0.1" strokeLinecap="round"/>
    </svg>
  ),
  'spiritual': (
    <svg viewBox="0 0 80 80" fill="none" className="w-full h-full">
      <circle cx="40" cy="40" r="38" fill="#FEF3C7"/>
      {/* Lotus */}
      <path d="M40 50Q32 42 36 32Q40 38 40 38Q40 38 44 32Q48 42 40 50Z" fill="#F59E0B" opacity="0.15"/>
      <path d="M40 50Q28 46 26 36Q34 40 40 38" fill="#F59E0B" opacity="0.1"/>
      <path d="M40 50Q52 46 54 36Q46 40 40 38" fill="#F59E0B" opacity="0.1"/>
      {/* Meditation pose */}
      <circle cx="40" cy="22" r="5" fill="#F59E0B" opacity="0.12"/>
      <path d="M32 32Q40 28 48 32Q44 36 40 34Q36 36 32 32Z" fill="#F59E0B" opacity="0.1"/>
      {/* Glow */}
      <circle cx="40" cy="22" r="10" fill="#FCD34D" opacity="0.06"/>
      <circle cx="40" cy="22" r="16" fill="#FCD34D" opacity="0.03"/>
      {/* Om symbol hint */}
      <circle cx="40" cy="60" r="2" fill="#F59E0B" opacity="0.15"/>
    </svg>
  ),
};

export default function Preferences() {
  const dispatch = useDispatch();
  const { profile } = useSelector((s) => s.user);
  const [selected, setSelected] = useState([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (profile?.lifestyleTags?.length) setSelected(profile.lifestyleTags);
  }, [profile]);

  const toggle = (id) => setSelected((prev) => prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]);

  const handleSave = async () => {
    if (selected.length < 5) return toast.error('Select at least 5 preferences');
    setSaving(true);
    try {
      await api.put('/onboarding/step2', { lifestyleTags: selected });
      toast.success('Preferences updated!');
      dispatch(fetchProfile());
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to save'); }
    setSaving(false);
  };

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Sparkles size={28} className="text-primary" />
          </div>
          <h1 className="text-3xl font-extrabold text-dark mb-2">Your Preferences</h1>
          <p className="text-muted max-w-md mx-auto">It will show others what kind of flatmate you prefer.<br/>Select at least 5 to update.</p>
          {selected.length < 5 && (
            <div className="inline-flex items-center gap-1.5 text-sm font-semibold px-4 py-1.5 rounded-full mt-4 bg-dark/5 text-muted">
              Select {5 - selected.length} more
            </div>
          )}
        </div>

        {/* Tags grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5 mb-10">
          {LIFESTYLE_TAGS.map((tag, i) => {
            const on = selected.includes(tag.id);
            return (
              <motion.button
                key={tag.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                whileHover={{ y: -4 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => toggle(tag.id)}
                className={`relative flex flex-col items-center gap-3 p-5 rounded-2xl border-2 transition-all cursor-pointer ${
                  on
                    ? 'border-primary bg-primary/[0.03] shadow-lg shadow-primary/10'
                    : 'border-transparent bg-white shadow-sm hover:shadow-md hover:border-dark/8'
                }`}
              >
                {/* Selected check */}
                {on && (
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute top-2.5 right-2.5 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                    <Check size={12} className="text-white" />
                  </motion.div>
                )}

                {/* SVG Icon */}
                <div className={`w-20 h-20 rounded-2xl overflow-hidden transition-all ${on ? 'scale-105' : ''}`}>
                  {icons[tag.id] || (
                    <div className="w-full h-full bg-surface rounded-2xl flex items-center justify-center text-3xl">{tag.emoji}</div>
                  )}
                </div>

                {/* Label */}
                <span className={`text-sm font-semibold transition-colors ${on ? 'text-primary' : 'text-dark'}`}>
                  {tag.label}
                </span>
              </motion.button>
            );
          })}
        </div>

        {/* Save button */}
        <div className="text-center">
          <Button size="lg" className="rounded-2xl px-14 text-base" onClick={handleSave} loading={saving} disabled={selected.length < 5}>
            Update Preferences
          </Button>
        </div>
      </div>
    </MainLayout>
  );
}
