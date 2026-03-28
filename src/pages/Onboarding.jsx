import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowLeft, Check, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';
import Button from '../components/ui/Button';
import CityAutocomplete from '../components/ui/CityAutocomplete';
import { fetchProfile } from '../redux/slices/userSlice';
import { updateUser } from '../redux/slices/authSlice';
import { LIFESTYLE_TAGS, USER_TYPES, DEFAULT_AVATARS, AUTH_BG } from '../utils/constants';
import api from '../services/api';

const slide = {
  enter: (d) => ({ x: d > 0 ? 150 : -150, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (d) => ({ x: d > 0 ? -150 : 150, opacity: 0 }),
};

export default function Onboarding() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((s) => s.auth);
  const { profile } = useSelector((s) => s.user);

  // Determine which step to resume from
  const hasProfile = !!(profile?.name && profile?.userType && profile?.gender && profile?.city);
  const [step, setStep] = useState(hasProfile ? 1 : 0); // 0=profile, 1=lifestyle
  const [dir, setDir] = useState(1);

  const [profileForm, setProfileForm] = useState({
    firstName: profile?.firstName || '',
    surname: profile?.surname || '',
    age: profile?.age || '',
    userType: profile?.userType || '',
    gender: profile?.gender || '',
    city: profile?.city || '',
    profileImage: profile?.profileImage || '',
  });
  const [tags, setTags] = useState(profile?.lifestyleTags || []);

  // If onboarding already complete, redirect away
  useEffect(() => {
    if (user?.onboardingComplete || profile?.onboardingComplete) {
      navigate('/search', { replace: true });
    }
  }, [user, profile, navigate]);

  const saveProfile = async () => {
    if (!profileForm.firstName.trim()) return toast.error('Enter your first name');
    if (!profileForm.age || Number(profileForm.age) < 18) return toast.error('Age must be 18 or above');
    if (!profileForm.userType) return toast.error('Select who you are');
    if (!profileForm.gender) return toast.error('Select your gender');
    if (!profileForm.city) return toast.error('Select your city');
    const payload = {
      ...profileForm,
      age: Number(profileForm.age),
      name: [profileForm.firstName, profileForm.surname].filter(Boolean).join(' '),
    };
    try {
      await api.put('/onboarding/step1', payload);
      dispatch(updateUser({ name: payload.name, profileImage: profileForm.profileImage, gender: profileForm.gender, city: profileForm.city }));
      setDir(1);
      setStep(1);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save');
    }
  };

  const saveTags = async () => {
    if (tags.length < 5) return toast.error('Select at least 5 tags');
    try {
      await api.put('/onboarding/step2', { lifestyleTags: tags });
      dispatch(updateUser({ onboardingComplete: true, lifestyleTags: tags }));
      dispatch(fetchProfile());
      toast.success('Welcome to FlatMate!');
      navigate('/search', { replace: true });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save');
    }
  };

  const toggleTag = (id) => setTags((p) => p.includes(id) ? p.filter((t) => t !== id) : [...p, id]);

  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <img src={AUTH_BG} alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/90 via-primary-dark/90 to-primary-light/80" />

        <motion.div animate={{ y: [0, -20, 0], opacity: [0.3, 0.5, 0.3] }} transition={{ duration: 8, repeat: Infinity }}
          className="absolute top-20 right-20 w-40 h-40 bg-white/10 rounded-full blur-2xl" />

        <div className="relative z-10 flex flex-col justify-between p-12 text-white w-full">
          <div>
            <Link to="/" className="flex items-center gap-2 mb-16">
              <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">F</span>
              </div>
              <span className="text-2xl font-bold">Flat<span className="text-white/80">Mate</span></span>
            </Link>

            <h1 className="text-4xl font-extrabold leading-tight mb-4">
              {step === 0 ? 'Complete your\nprofile setup' : 'Almost there!\nPick your vibe'}
            </h1>
            <p className="text-white/50 text-lg max-w-md leading-relaxed">
              {step === 0
                ? 'We need a few details to find you the perfect match.'
                : 'Select lifestyle tags so we can match you with compatible flatmates.'}
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 border border-white/10">
            <p className="text-white/70 text-sm italic mb-3">"The onboarding was super quick and the matches were spot on!"</p>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-xs font-bold">R</div>
              <div>
                <p className="text-white text-xs font-semibold">Rahul Verma</p>
                <p className="text-white/40 text-xs">Mumbai</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 bg-surface">
        <div className="w-full max-w-md">
          <AnimatePresence mode="wait" custom={dir}>

            {/* Step 0: Profile */}
            {step === 0 && (
              <motion.div key="p" custom={dir} variants={slide} initial="enter" animate="center" exit="exit" transition={{ duration: 0.25 }}>
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                      <span className="text-primary font-bold text-sm">1</span>
                    </div>
                    <div className="flex-1 h-1.5 bg-dark/5 rounded-full overflow-hidden">
                      <div className="w-1/2 h-full bg-primary rounded-full" />
                    </div>
                  </div>
                  <h2 className="text-2xl font-extrabold text-dark mb-1">Set up your profile</h2>
                  <p className="text-muted text-sm">This helps us find the best matches for you</p>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-muted uppercase tracking-wider mb-1.5 block">First Name *</label>
                      <input value={profileForm.firstName} onChange={(e) => setProfileForm({ ...profileForm, firstName: e.target.value })}
                        placeholder="First name"
                        className="w-full px-4 py-3 rounded-xl bg-white border border-dark/8 text-dark text-sm outline-none focus:border-primary/40 shadow-sm transition-all" autoFocus />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-muted uppercase tracking-wider mb-1.5 block">Surname</label>
                      <input value={profileForm.surname} onChange={(e) => setProfileForm({ ...profileForm, surname: e.target.value })}
                        placeholder="Surname"
                        className="w-full px-4 py-3 rounded-xl bg-white border border-dark/8 text-dark text-sm outline-none focus:border-primary/40 shadow-sm transition-all" />
                    </div>
                  </div>
                  <p className="text-[10px] text-amber-600 bg-amber-50 px-3 py-1.5 rounded-lg -mt-1">Name cannot be changed after setup</p>

                  <div>
                    <label className="text-xs font-semibold text-muted uppercase tracking-wider mb-1.5 block">Age *</label>
                    <input type="number" min={18} max={120} value={profileForm.age} onChange={(e) => setProfileForm({ ...profileForm, age: e.target.value })}
                      placeholder="e.g. 25"
                      className="w-full px-4 py-3 rounded-xl bg-white border border-dark/8 text-dark text-sm outline-none focus:border-primary/40 shadow-sm transition-all" />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-muted uppercase tracking-wider mb-1.5 block">I am a *</label>
                    <div className="space-y-1.5">
                      {USER_TYPES.map((t) => (
                        <button key={t.id} onClick={() => setProfileForm({ ...profileForm, userType: t.id })}
                          className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl border transition-all cursor-pointer text-left shadow-sm ${
                            profileForm.userType === t.id ? 'border-primary bg-primary/5' : 'border-dark/8 bg-white hover:border-dark/15'}`}>
                          <span className="text-base">{t.icon}</span>
                          <span className="text-sm font-medium text-dark flex-1">{t.label}</span>
                          {profileForm.userType === t.id && <Check size={16} className="text-primary" />}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-muted uppercase tracking-wider mb-1.5 block">Gender *</label>
                    <div className="flex gap-2">
                      {[{ id: 'male', label: 'Male', emoji: '👨' }, { id: 'female', label: 'Female', emoji: '👩' }].map((g) => (
                        <button key={g.id} onClick={() => setProfileForm({ ...profileForm, gender: g.id })}
                          className={`flex-1 py-3 rounded-xl text-sm font-semibold transition-all cursor-pointer shadow-sm flex items-center justify-center gap-2 ${
                            profileForm.gender === g.id ? 'bg-primary text-white shadow-md shadow-primary/20' : 'bg-white text-muted border border-dark/8 hover:border-dark/15'}`}>
                          <span>{g.emoji}</span> {g.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-muted uppercase tracking-wider mb-1.5 block">Location *</label>
                    <CityAutocomplete
                      value={profileForm.city}
                      onChange={(city) => setProfileForm({ ...profileForm, city })}
                      types="address,poi,neighborhood,locality,place"
                      placeholder="Search area, neighborhood or city"
                      className="w-full px-4 py-3 rounded-xl bg-white border border-dark/8 text-dark text-sm outline-none focus:border-primary/40 shadow-sm transition-all"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-muted uppercase tracking-wider mb-1.5 block">Choose Avatar</label>
                    <div className="flex justify-center gap-2.5">
                      {DEFAULT_AVATARS.map((url) => (
                        <button key={url} onClick={() => setProfileForm({ ...profileForm, profileImage: url })}
                          className={`w-11 h-11 rounded-full overflow-hidden border-2 transition-all cursor-pointer ${
                            profileForm.profileImage === url ? 'border-primary ring-2 ring-primary/20 scale-110' : 'border-transparent hover:border-dark/15'}`}>
                          <img src={url} alt="" className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  </div>

                  <Button size="lg" className="w-full rounded-2xl" onClick={saveProfile}>
                    Continue to Preferences <ArrowRight size={18} />
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Step 1: Lifestyle tags */}
            {step === 1 && (
              <motion.div key="l" custom={dir} variants={slide} initial="enter" animate="center" exit="exit" transition={{ duration: 0.25 }}>
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                      <span className="text-primary font-bold text-sm">2</span>
                    </div>
                    <div className="flex-1 h-1.5 bg-dark/5 rounded-full overflow-hidden">
                      <div className="w-full h-full bg-primary rounded-full" />
                    </div>
                  </div>
                  <h2 className="text-2xl font-extrabold text-dark mb-1">Choose your vibe</h2>
                  <p className="text-muted text-sm">Select at least 5 lifestyle tags that describe you</p>
                </div>

                <div className="flex items-center gap-2 mb-4">
                  <div className="flex-1 h-2 bg-dark/5 rounded-full overflow-hidden">
                    <motion.div
                      className={`h-full rounded-full ${tags.length >= 5 ? 'bg-primary' : 'bg-primary/40'}`}
                      animate={{ width: `${Math.min((tags.length / 5) * 100, 100)}%` }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                  <span className={`text-xs font-bold ${tags.length >= 5 ? 'text-primary' : 'text-muted'}`}>
                    {tags.length >= 5 ? <Check size={14} className="inline" /> : `${tags.length}/5`}
                  </span>
                </div>

                <div className="grid grid-cols-4 gap-2 mb-5">
                  {LIFESTYLE_TAGS.map((tag) => {
                    const on = tags.includes(tag.id);
                    return (
                      <motion.button key={tag.id} whileTap={{ scale: 0.95 }} onClick={() => toggleTag(tag.id)}
                        className={`flex flex-col items-center gap-1.5 py-3 px-1.5 rounded-xl border transition-all cursor-pointer ${
                          on ? 'border-primary bg-primary/5 shadow-md shadow-primary/10' : 'border-dark/6 bg-white hover:border-dark/12 shadow-sm'}`}>
                        <span className="text-lg">{tag.emoji}</span>
                        <span className={`text-[9px] font-semibold leading-tight text-center ${on ? 'text-primary' : 'text-muted'}`}>{tag.label}</span>
                      </motion.button>
                    );
                  })}
                </div>

                <div className="flex gap-2">
                  {!hasProfile && (
                    <Button variant="ghost" size="lg" onClick={() => { setDir(-1); setStep(0); }} className="px-4 rounded-xl">
                      <ArrowLeft size={18} />
                    </Button>
                  )}
                  <Button size="lg" className="flex-1 rounded-2xl" onClick={saveTags} disabled={tags.length < 5}>
                    Get Started <Sparkles size={16} />
                  </Button>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
