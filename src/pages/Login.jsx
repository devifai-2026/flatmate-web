import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowLeft, Check, Shield, Home, Users, Heart, CheckCircle, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';
import Button from '../components/ui/Button';
import { sendOtp, verifyOtp, clearError } from '../redux/slices/authSlice';
import { LIFESTYLE_TAGS, USER_TYPES, CITY_IMAGES, DEFAULT_AVATARS, AUTH_BG } from '../utils/constants';
import api from '../services/api';

const slide = {
  enter: (d) => ({ x: d > 0 ? 150 : -150, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (d) => ({ x: d > 0 ? -150 : 150, opacity: 0 }),
};

// Left panel content per step
const leftContent = [
  { title: 'Find your perfect\nliving situation', sub: 'Connect with compatible roommates across 50+ cities. 100% brokerage-free.' },
  { title: 'Verify your\nphone number', sub: 'We use OTP verification to keep your account secure and spam-free.' },
  { title: 'Tell us about\nyourself', sub: 'This helps us match you with the right flatmates based on your lifestyle.' },
  { title: 'Almost there!\nPick your vibe', sub: 'Select tags that describe you so we can find people you\'ll actually get along with.' },
];

export default function Login() {
  const [step, setStep] = useState(0); // 0=phone, 1=otp, 2=profile, 3=lifestyle
  const [dir, setDir] = useState(1);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, token, otpSent, isNewUser } = useSelector((s) => s.auth);

  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const otpRefs = useRef([]);
  const [profile, setProfile] = useState({ userType: '', gender: '', city: '', profileImage: '', name: '' });
  const [tags, setTags] = useState([]);

  useEffect(() => { if (error) { toast.error(error); dispatch(clearError()); } }, [error, dispatch]);
  useEffect(() => { if (otpSent && step === 0) { setDir(1); setStep(1); } }, [otpSent, step]);

  // After OTP verified → decide flow
  useEffect(() => {
    if (token && step === 1) {
      if (isNewUser) { setDir(1); setStep(2); }
      else { navigate('/search'); }
    }
  }, [token, step, isNewUser, navigate]);

  const send = (e) => {
    e?.preventDefault();
    if (phone.length < 10) return toast.error('Enter a valid 10-digit number');
    dispatch(sendOtp({ phone: phone.replace(/\s/g, '') }));
  };

  const otpChange = (i, v) => {
    if (!/^\d?$/.test(v)) return;
    const n = [...otp]; n[i] = v; setOtp(n);
    if (v && i < 5) otpRefs.current[i + 1]?.focus();
  };
  const otpKey = (i, e) => { if (e.key === 'Backspace' && !otp[i] && i > 0) otpRefs.current[i - 1]?.focus(); };

  const verify = () => {
    const code = otp.join('');
    if (code.length !== 6) return toast.error('Enter all 6 digits');
    dispatch(verifyOtp({ phone: phone.replace(/\s/g, ''), otp: code }));
  };
  useEffect(() => { if (otp.every(d => d) && step === 1) verify(); }, [otp]);

  const saveProfile = async (e) => {
    e?.preventDefault();
    if (!profile.name) return toast.error('Enter your name');
    if (!profile.userType) return toast.error('Select who you are');
    if (!profile.gender) return toast.error('Select your gender');
    if (!profile.city) return toast.error('Select your city');
    try { await api.put('/onboarding/step1', profile); setDir(1); setStep(3); }
    catch (err) { toast.error(err.response?.data?.message || 'Failed to save'); }
  };

  const saveTags = async () => {
    if (tags.length < 5) return toast.error('Select at least 5 tags');
    try { await api.put('/onboarding/step2', { lifestyleTags: tags }); toast.success('Welcome to FlatMate!'); navigate('/search'); }
    catch (err) { toast.error(err.response?.data?.message || 'Failed to save'); }
  };

  const back = () => { setDir(-1); setStep(s => Math.max(0, s - 1)); };
  const toggleTag = (id) => setTags(p => p.includes(id) ? p.filter(t => t !== id) : [...p, id]);

  const lc = leftContent[step];

  return (
    <div className="min-h-screen flex">
      {/* ═══ LEFT PANEL — image + dynamic text ═══ */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <img src={AUTH_BG} alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/90 via-primary-dark/90 to-primary-light/80" />

        <motion.div animate={{ y: [0, -20, 0], opacity: [0.3, 0.5, 0.3] }} transition={{ duration: 8, repeat: Infinity }}
          className="absolute top-20 right-20 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
        <motion.div animate={{ y: [0, 15, 0], opacity: [0.2, 0.4, 0.2] }} transition={{ duration: 6, repeat: Infinity, delay: 2 }}
          className="absolute bottom-32 left-16 w-56 h-56 bg-white/10 rounded-full blur-3xl" />

        <div className="relative z-10 flex flex-col justify-between p-12 text-white w-full">
          <div>
            <Link to="/" className="flex items-center gap-2 mb-16">
              <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">F</span>
              </div>
              <span className="text-2xl font-bold">Flat<span className="text-white/80">Mate</span></span>
            </Link>

            {/* Dynamic title per step */}
            <AnimatePresence mode="wait">
              <motion.div key={step} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} transition={{ duration: 0.3 }}>
                <h1 className="text-4xl font-extrabold leading-tight mb-4 whitespace-pre-line">{lc.title}</h1>
                <p className="text-white/50 text-lg max-w-md leading-relaxed">{lc.sub}</p>
              </motion.div>
            </AnimatePresence>

            {/* Features list — only on step 0 */}
            {step === 0 && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="mt-10 space-y-4">
                {[
                  { icon: Home, text: '5,000+ verified rooms across 50+ cities' },
                  { icon: Users, text: 'Smart AI-powered roommate matching' },
                  { icon: Heart, text: 'Lifestyle-based compatibility scoring' },
                  { icon: CheckCircle, text: '100% brokerage-free, always' },
                ].map(({ icon: Icon, text }) => (
                  <div key={text} className="flex items-center gap-3 text-white/60">
                    <div className="w-9 h-9 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
                      <Icon size={16} />
                    </div>
                    <span className="text-sm">{text}</span>
                  </div>
                ))}
              </motion.div>
            )}
          </div>

          {/* Testimonial */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
            className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 border border-white/10">
            <p className="text-white/70 text-sm italic mb-3">"Found my perfect roommate in 3 days. The matching algorithm is genuinely smart!"</p>
            <div className="flex items-center gap-3">
              <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&q=80" alt="" className="w-8 h-8 rounded-full object-cover" />
              <div>
                <p className="text-white text-xs font-semibold">Priya Sharma</p>
                <p className="text-white/40 text-xs">Bangalore</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* ═══ RIGHT PANEL — form steps ═══ */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 bg-surface">
        <div className="w-full max-w-md">
          <AnimatePresence mode="wait" custom={dir}>

            {/* ── STEP 0: Phone ── */}
            {step === 0 && (
              <motion.div key="s0" custom={dir} variants={slide} initial="enter" animate="center" exit="exit" transition={{ duration: 0.25 }}>
                <div className="mb-8">
                  <h2 className="text-2xl font-extrabold text-dark mb-1">Welcome to FlatMate</h2>
                  <p className="text-muted text-sm">Enter your phone number to login or create an account</p>
                </div>
                <form onSubmit={send} className="space-y-4">
                  <div className="bg-white rounded-2xl border border-dark/8 px-4 py-4 flex items-center gap-3 focus-within:border-primary/40 focus-within:shadow-lg focus-within:shadow-primary/5 transition-all shadow-sm">
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className="text-lg">🇮🇳</span>
                      <span className="text-dark font-semibold text-sm">+91</span>
                    </div>
                    <div className="w-px h-6 bg-dark/8" />
                    <input type="tel" value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                      placeholder="Enter 10-digit number"
                      className="flex-1 outline-none text-dark text-base font-medium placeholder-muted/40 tracking-wide bg-transparent"
                      autoFocus maxLength={10} />
                  </div>
                  <Button type="submit" size="lg" className="w-full rounded-2xl" loading={loading}>
                    Continue <ArrowRight size={18} />
                  </Button>
                </form>
                {/* Demo accounts */}
                <div className="mt-5 bg-primary/5 rounded-xl p-3 border border-primary/10">
                  <p className="text-[10px] font-semibold text-primary mb-2">Demo Accounts — OTP: 123456</p>
                  <div className="space-y-1 max-h-44 overflow-y-auto">
                    {[
                      { label: 'Arjun (Lister)', phone: '9876543210', city: 'Mumbai' },
                      { label: 'Kavitha (PG Owner)', phone: '9876543211', city: 'Bangalore' },
                      { label: 'Rohit (Lister)', phone: '9876543212', city: 'Delhi' },
                      { label: 'Priya (Seeker)', phone: '9123456789', city: 'Bangalore' },
                      { label: 'Rahul (Seeker)', phone: '9123456790', city: 'Mumbai' },
                      { label: 'Sneha (Seeker)', phone: '9123456791', city: 'Bangalore' },
                      { label: 'Amit (Seeker)', phone: '9123456792', city: 'Delhi' },
                      { label: 'Nisha (Seeker)', phone: '9123456793', city: 'Mumbai' },
                    ].map((a) => (
                      <button key={a.phone} onClick={() => setPhone(a.phone)}
                        className="w-full flex items-center justify-between text-[11px] text-dark bg-white rounded-lg px-2.5 py-1.5 hover:shadow-sm transition-all cursor-pointer border border-dark/5">
                        <span className="font-medium">{a.label}</span>
                        <span className="font-mono text-muted text-[10px]">{a.phone} · {a.city}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <p className="text-center text-[11px] text-muted mt-4 leading-relaxed">
                  By continuing, you agree to our <a href="#" className="text-dark font-medium">Terms</a> & <a href="#" className="text-dark font-medium">Privacy Policy</a>
                </p>
              </motion.div>
            )}

            {/* ── STEP 1: OTP ── */}
            {step === 1 && (
              <motion.div key="s1" custom={dir} variants={slide} initial="enter" animate="center" exit="exit" transition={{ duration: 0.25 }}>
                <div className="flex justify-center mb-5">
                  <div className="w-14 h-14 bg-primary/8 rounded-2xl flex items-center justify-center">
                    <Shield size={26} className="text-primary" />
                  </div>
                </div>
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-extrabold text-dark mb-1">Verify OTP</h2>
                  <p className="text-muted text-sm">Code sent to <span className="text-dark font-semibold">+91 {phone}</span></p>
                </div>

                <div className="flex justify-center gap-2.5 mb-6">
                  {otp.map((d, i) => (
                    <input key={i} ref={el => otpRefs.current[i] = el}
                      type="text" inputMode="numeric" maxLength={1} value={d}
                      onChange={(e) => otpChange(i, e.target.value)}
                      onKeyDown={(e) => otpKey(i, e)}
                      className={`w-12 h-14 text-center text-xl font-bold rounded-xl border-2 outline-none transition-all shadow-sm ${
                        d ? 'border-primary bg-primary/5 text-dark' : 'border-dark/10 bg-white text-muted'
                      } focus:border-primary focus:shadow-md focus:shadow-primary/10`}
                      autoFocus={i === 0} />
                  ))}
                </div>

                <Button size="lg" className="w-full rounded-2xl" onClick={verify} loading={loading}>
                  Verify <ArrowRight size={18} />
                </Button>
                <div className="flex items-center justify-between mt-5 text-sm">
                  <button onClick={back} className="text-muted hover:text-dark cursor-pointer flex items-center gap-1"><ArrowLeft size={14} /> Change number</button>
                  <button onClick={send} className="text-primary font-semibold hover:underline cursor-pointer">Resend OTP</button>
                </div>
              </motion.div>
            )}

            {/* ── STEP 2: Profile (new users only) ── */}
            {step === 2 && (
              <motion.div key="s2" custom={dir} variants={slide} initial="enter" animate="center" exit="exit" transition={{ duration: 0.25 }}>
                <div className="mb-5">
                  <h2 className="text-2xl font-extrabold text-dark mb-1">Complete your profile</h2>
                  <p className="text-muted text-sm">This takes 30 seconds</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-semibold text-muted uppercase tracking-wider mb-1.5 block">Your Name</label>
                    <input value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                      placeholder="Enter your full name"
                      className="w-full px-4 py-3 rounded-xl bg-white border border-dark/8 text-dark text-sm outline-none focus:border-primary/40 shadow-sm transition-all" />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-muted uppercase tracking-wider mb-1.5 block">I am a</label>
                    <div className="space-y-1.5">
                      {USER_TYPES.map(t => (
                        <button key={t.id} onClick={() => setProfile({ ...profile, userType: t.id })}
                          className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl border transition-all cursor-pointer text-left shadow-sm ${
                            profile.userType === t.id ? 'border-primary bg-primary/5' : 'border-dark/8 bg-white hover:border-dark/15'}`}>
                          <span className="text-base">{t.icon}</span>
                          <span className="text-sm font-medium text-dark flex-1">{t.label}</span>
                          {profile.userType === t.id && <Check size={16} className="text-primary" />}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-muted uppercase tracking-wider mb-1.5 block">Gender</label>
                    <div className="flex gap-2">
                      {['male', 'female'].map(g => (
                        <button key={g} onClick={() => setProfile({ ...profile, gender: g })}
                          className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer shadow-sm ${
                            profile.gender === g ? 'bg-primary text-white shadow-md shadow-primary/20' : 'bg-white text-muted border border-dark/8'}`}>
                          {g === 'male' ? 'Male' : 'Female'}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-muted uppercase tracking-wider mb-1.5 block">City</label>
                    <select value={profile.city} onChange={(e) => setProfile({ ...profile, city: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-white border border-dark/8 text-dark text-sm outline-none focus:border-primary/40 shadow-sm transition-all appearance-none">
                      <option value="">Select your city</option>
                      {Object.values(CITY_IMAGES).map(c => <option key={c.label} value={c.label}>{c.label}</option>)}
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-muted uppercase tracking-wider mb-1.5 block">Avatar</label>
                    <div className="flex justify-center gap-2">
                      {DEFAULT_AVATARS.map(url => (
                        <button key={url} onClick={() => setProfile({ ...profile, profileImage: url })}
                          className={`w-10 h-10 rounded-full overflow-hidden border-2 transition-all cursor-pointer ${
                            profile.profileImage === url ? 'border-primary ring-2 ring-primary/20 scale-110' : 'border-transparent hover:border-dark/15'}`}>
                          <img src={url} alt="" className="w-full h-full" />
                        </button>
                      ))}
                    </div>
                  </div>

                  <Button size="lg" className="w-full rounded-2xl" onClick={saveProfile}>
                    Continue <ArrowRight size={18} />
                  </Button>
                </div>
              </motion.div>
            )}

            {/* ── STEP 3: Lifestyle (new users only) ── */}
            {step === 3 && (
              <motion.div key="s3" custom={dir} variants={slide} initial="enter" animate="center" exit="exit" transition={{ duration: 0.25 }}>
                <div className="mb-5">
                  <h2 className="text-2xl font-extrabold text-dark mb-1">Your lifestyle</h2>
                  <p className="text-muted text-sm">Pick at least 5 that describe you</p>
                  <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full mt-2 ${
                    tags.length >= 5 ? 'bg-primary/10 text-primary' : 'bg-dark/5 text-muted'}`}>
                    {tags.length} / 5 {tags.length >= 5 && <Check size={12} />}
                  </span>
                </div>

                <div className="grid grid-cols-4 gap-2 mb-5">
                  {LIFESTYLE_TAGS.map(tag => {
                    const on = tags.includes(tag.id);
                    return (
                      <motion.button key={tag.id} whileTap={{ scale: 0.95 }} onClick={() => toggleTag(tag.id)}
                        className={`flex flex-col items-center gap-1 py-2.5 px-1 rounded-xl border transition-all cursor-pointer shadow-sm ${
                          on ? 'border-primary bg-primary/5' : 'border-dark/6 bg-white hover:border-dark/12'}`}>
                        <span className="text-base">{tag.emoji}</span>
                        <span className={`text-[8px] font-medium leading-tight ${on ? 'text-primary' : 'text-muted'}`}>{tag.label}</span>
                      </motion.button>
                    );
                  })}
                </div>

                <div className="flex gap-2">
                  <Button variant="ghost" size="lg" onClick={back} className="px-4 rounded-xl"><ArrowLeft size={18} /></Button>
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
