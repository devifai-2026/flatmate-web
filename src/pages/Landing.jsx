import { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, useInView, useMotionValue, useTransform, animate } from 'framer-motion';
import {
  Search, Home, Sparkles, ArrowRight, Shield, Zap, Star,
  MapPin, UserCheck, Heart, MessageCircle, TrendingUp, Play,
  Globe, Percent, BadgeCheck, Lock, Users, Building2, ChevronRight,
} from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Button from '../components/ui/Button';
import { CITY_IMAGES, CITY_GRADIENTS, PLATFORM_STATS } from '../utils/constants';
import heroLiving from '../assets/hero/living.jpg';
import heroApartment from '../assets/hero/apartment.jpg';
import heroMoving from '../assets/hero/moving.jpg';
import heroHappy from '../assets/hero/happy.jpg';

/* ── Animated counter ── */
function Counter({ to, suffix = '' }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const count = useMotionValue(0);
  const rounded = useTransform(count, (v) => Math.round(v).toLocaleString('en-IN'));
  const [display, setDisplay] = useState('0');
  useEffect(() => {
    if (inView) {
      const c = animate(count, to, { duration: 2, ease: 'easeOut' });
      const unsub = rounded.on('change', setDisplay);
      return () => { c.stop(); unsub(); };
    }
  }, [inView, count, to, rounded]);
  return <span ref={ref}>{display}{suffix}</span>;
}

/* ── Scroll reveal ── */
function Reveal({ children, className = '', delay = 0 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay, ease: [0.25, 0.4, 0.25, 1] }} className={className}>
      {children}
    </motion.div>
  );
}


export default function Landing() {
  const [location, setLocation] = useState('');
  const navigate = useNavigate();
  const handleSearch = (e) => { e.preventDefault(); navigate(`/search?location=${encodeURIComponent(location)}`); };

  return (
    <div className="min-h-screen bg-white overflow-hidden">
      <Navbar />

      {/* ══ HERO ══ */}
      <section className="relative overflow-hidden hero-mesh">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/[0.04] rounded-full blur-[100px] -translate-y-1/3 translate-x-1/4 animate-pulse-soft" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-primary/[0.03] rounded-full blur-[80px] translate-y-1/3 -translate-x-1/4" />

        {/* Corner photo cards */}
        <motion.img src={heroLiving} alt="" initial={{ opacity: 0, y: -15, rotate: -8 }} animate={{ opacity: 1, y: 0, rotate: -6 }} transition={{ duration: 0.5 }}
          className="hidden lg:block absolute top-10 left-8 xl:left-20 w-36 h-36 object-cover rounded-2xl border-4 border-white shadow-xl" />
        <motion.img src={heroApartment} alt="" initial={{ opacity: 0, y: -15, rotate: 8 }} animate={{ opacity: 1, y: 0, rotate: 6 }} transition={{ duration: 0.5, delay: 0.1 }}
          className="hidden lg:block absolute top-16 right-8 xl:right-20 w-36 h-36 object-cover rounded-2xl border-4 border-white shadow-xl" />
        <motion.img src={heroMoving} alt="" initial={{ opacity: 0, y: 15, rotate: 6 }} animate={{ opacity: 1, y: 0, rotate: 4 }} transition={{ duration: 0.5, delay: 0.2 }}
          className="hidden lg:block absolute bottom-10 left-12 xl:left-28 w-36 h-36 object-cover rounded-2xl border-4 border-white shadow-xl" />
        <motion.img src={heroHappy} alt="" initial={{ opacity: 0, y: 15, rotate: -6 }} animate={{ opacity: 1, y: 0, rotate: -4 }} transition={{ duration: 0.5, delay: 0.3 }}
          className="hidden lg:block absolute bottom-14 right-12 xl:right-28 w-36 h-36 object-cover rounded-2xl border-4 border-white shadow-xl" />

        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16 lg:py-24 relative z-10 text-center">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.05 }}
            className="text-4xl sm:text-5xl font-extrabold text-dark leading-[1.15] mb-4 tracking-tight">
            Find Compatible<br />
            <span className="text-gradient">Flatmates, Rooms & PGs</span>
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }}
            className="text-muted text-base leading-relaxed mb-8 max-w-lg mx-auto">
            Smart matching across <strong className="text-dark">50+ cities</strong>. Zero brokerage. Verified profiles, secure chat, and lifestyle-based compatibility scoring.
          </motion.p>

          <motion.form onSubmit={handleSearch} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.15 }}
            className="flex flex-col sm:flex-row gap-2 max-w-lg mx-auto mb-7">
            <div className="flex-1 relative">
              <MapPin size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-primary" />
              <input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Enter City Name"
                className="w-full pl-10 pr-4 py-3.5 rounded-full border-2 border-gray-100 bg-white text-dark placeholder-muted/50 outline-none focus:border-primary/30 focus:shadow-lg focus:shadow-primary/5 transition-all text-sm font-medium" />
            </div>
            <Button type="submit" size="lg" className="!rounded-full shadow-lg shadow-primary/20 px-6">
              <Search size={16} /> Search
            </Button>
          </motion.form>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
            className="flex flex-wrap justify-center gap-6 text-xs text-muted font-medium">
            <span className="flex items-center gap-2"><span className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center"><Shield size={14} className="text-primary" /></span> Verified Profile</span>
            <span className="flex items-center gap-2"><span className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center"><Lock size={14} className="text-primary" /></span> Secure Chat</span>
            <span className="flex items-center gap-2"><span className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center"><Percent size={14} className="text-primary" /></span> Zero Brokerage</span>
          </motion.div>
        </div>
      </section>

      {/* ══ STATS BAR ══ */}
      <section className="border-y border-gray-100 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {PLATFORM_STATS.map((s, i) => (
              <div key={s.label} className="flex items-center gap-3">
                <span className="text-2xl">{s.icon}</span>
                <div>
                  <p className="text-xl font-extrabold text-dark"><Counter to={s.value} suffix="+" /></p>
                  <p className="text-xs text-muted">{s.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ CITIES ══ */}
      <section className="bg-surface py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="flex items-end justify-between mb-6">
              <div>
                <span className="inline-flex items-center gap-1 bg-primary/10 text-primary text-[11px] font-bold px-2.5 py-1 rounded-full mb-2"><Globe size={11} /> 50+ Cities</span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-dark">Explore by City</h2>
              </div>
              <Link to="/search" className="text-primary text-sm font-semibold flex items-center gap-1 hover:gap-2 transition-all">All cities <ChevronRight size={16} /></Link>
            </div>
          </Reveal>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {Object.entries(CITY_IMAGES).slice(0, 10).map(([key, city], i) => (
              <Reveal key={key} delay={i * 0.03}>
                <motion.button whileHover={{ y: -4 }} onClick={() => navigate(`/search?location=${city.label}`)}
                  className="group cursor-pointer w-full">
                  <div className="relative rounded-xl overflow-hidden aspect-[4/3]">
                    <img src={city.image} alt={city.label} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy"
                      onError={(e) => { e.target.style.display='none'; e.target.parentElement.classList.add('bg-gradient-to-br', ...(CITY_GRADIENTS[key]||'from-primary to-primary/80').split(' ')); }} />
                    <div className="absolute inset-0 bg-gradient-to-t from-dark/70 via-dark/10 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-3">
                      <span className="text-white text-sm font-bold block">{city.label}</span>
                      <span className="text-white/50 text-[10px]">{city.tagline}</span>
                    </div>
                  </div>
                </motion.button>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══ FEATURES — 3 equal cards ══ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <Reveal className="text-center mb-10">
          <span className="inline-flex items-center gap-1 bg-primary/10 text-primary text-[11px] font-bold px-2.5 py-1 rounded-full mb-3"><Zap size={11} /> Features</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-dark">Everything you need, one platform</h2>
        </Reveal>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: Home, title: 'Find Rooms', desc: 'Verified rooms with photos, amenities & pricing.', color: 'bg-primary', bg: 'from-primary/5 to-primary/10', count: '5,000+' },
            { icon: Users, title: 'Find Flatmates', desc: 'Matched by lifestyle, budget & personality.', color: 'bg-secondary', bg: 'from-secondary/5 to-secondary/10', count: '10,000+' },
            { icon: Building2, title: 'Find PGs', desc: 'PG with meals, sharing options & amenities.', color: 'bg-primary', bg: 'from-primary/5 to-primary/10', count: '2,000+' },
            { icon: UserCheck, title: 'Create Teams', desc: 'Team up and search for rooms together.', color: 'bg-secondary', bg: 'from-secondary/5 to-secondary/10', count: '500+' },
          ].map((f, i) => (
            <Reveal key={f.title} delay={i * 0.08}>
              <motion.div whileHover={{ y: -4 }}
                className={`bg-gradient-to-br ${f.bg} rounded-2xl p-5 border border-white h-full transition-shadow hover:shadow-lg`}>
                <div className={`w-10 h-10 ${f.color} rounded-xl flex items-center justify-center mb-3 shadow-md`}>
                  <f.icon size={18} className="text-white" />
                </div>
                <h3 className="font-bold text-dark text-sm mb-1">{f.title}</h3>
                <p className="text-muted text-xs leading-relaxed mb-2">{f.desc}</p>
                <span className="text-[10px] font-bold text-muted/50">{f.count} listings</span>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ══ CTA — Post Listing ══ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-6">
        <Reveal>
          <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-2xl px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-4 border border-primary/10">
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 bg-primary rounded-xl flex items-center justify-center shadow-md shadow-primary/20 flex-shrink-0">
                <TrendingUp size={20} className="text-white" />
              </div>
              <div>
                <h3 className="font-bold text-dark text-sm">List your property for FREE</h3>
                <p className="text-muted text-xs">Start receiving enquiries today. Zero brokerage.</p>
              </div>
            </div>
            <Link to="/post">
              <Button size="sm" className="rounded-xl !bg-primary hover:!bg-primary/90 shadow-md shadow-primary/20 whitespace-nowrap">
                Post Free Ad <ArrowRight size={14} />
              </Button>
            </Link>
          </div>
        </Reveal>
      </section>

      {/* ══ SMART MATCHING — illustration + text ══ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          <Reveal>
            {/* Phone mockup with match cards */}
            <div className="relative w-full max-w-xs mx-auto">
              <div className="bg-white rounded-[2rem] shadow-2xl shadow-dark/10 border border-gray-100 p-3">
                <div className="bg-surface rounded-[1.5rem] p-4 space-y-3">
                  <div className="h-2.5 w-14 bg-gray-200 rounded-full mx-auto mb-3" />
                  {[
                    { name: 'Priya S.', city: 'Mumbai • ₹12k', pct: 92, color: 'bg-primary', textColor: 'text-primary' },
                    { name: 'Rahul K.', city: 'Bangalore • ₹15k', pct: 87, color: 'bg-primary', textColor: 'text-primary' },
                    { name: 'Ananya M.', city: 'Delhi • ₹10k', pct: 81, color: 'bg-secondary', textColor: 'text-secondary' },
                  ].map((m, i) => (
                    <motion.div key={m.name} initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 + i * 0.12 }}
                      className="bg-white rounded-xl p-3 flex items-center gap-2.5 shadow-sm">
                      <div className={`w-9 h-9 ${m.color} rounded-full flex items-center justify-center text-white text-xs font-bold`}>{m.name[0]}</div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-dark">{m.name}</p>
                        <p className="text-[10px] text-muted">{m.city}</p>
                        <div className="h-1.5 bg-gray-100 rounded-full mt-1 overflow-hidden">
                          <motion.div className={`h-full ${m.color} rounded-full`} initial={{ width: 0 }} whileInView={{ width: `${m.pct}%` }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.4 + i * 0.12 }} />
                        </div>
                      </div>
                      <span className={`text-xs font-extrabold ${m.textColor}`}>{m.pct}%</span>
                    </motion.div>
                  ))}
                  <div className="bg-primary rounded-xl p-2.5 text-center">
                    <span className="text-white text-xs font-semibold">View All Matches</span>
                  </div>
                </div>
              </div>
              {/* Floating badge */}
              <motion.div animate={{ y: [0, -6, 0] }} transition={{ duration: 3, repeat: Infinity }} className="absolute -left-6 top-8 glass rounded-xl px-3 py-2 shadow-lg flex items-center gap-1.5">
                <BadgeCheck size={12} className="text-primary" />
                <span className="text-[10px] font-bold text-dark">Verified</span>
              </motion.div>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <span className="inline-flex items-center gap-1 bg-primary/10 text-primary text-[11px] font-bold px-2.5 py-1 rounded-full mb-3"><Sparkles size={11} /> Smart Matching</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-dark mb-4">AI-powered compatibility matching</h2>
            <p className="text-muted text-sm leading-relaxed mb-6">Our algorithm analyzes 15+ factors and gives you a compatibility score for every potential flatmate.</p>
            <div className="space-y-3">
              {[
                { label: 'Budget Match', value: '30%', color: 'bg-primary' },
                { label: 'Location Proximity', value: '25%', color: 'bg-primary' },
                { label: 'Lifestyle Compatibility', value: '25%', color: 'bg-secondary' },
                { label: 'Interests Overlap', value: '20%', color: 'bg-secondary' },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-3">
                  <div className={`w-2 h-2 ${item.color} rounded-full flex-shrink-0`} />
                  <span className="text-sm text-dark font-medium flex-1">{item.label}</span>
                  <span className="text-xs font-bold text-muted bg-surface px-2 py-0.5 rounded-full">{item.value}</span>
                </div>
              ))}
            </div>
            <Link to="/discover" className="inline-flex items-center gap-1.5 text-primary text-sm font-semibold mt-5 hover:gap-2.5 transition-all">
              Try it now <ArrowRight size={14} />
            </Link>
          </Reveal>
        </div>
      </section>

      {/* ══ HOW IT WORKS — premium visual steps ══ */}
      <section className="bg-gradient-to-br from-primary to-primary-dark py-16 relative overflow-hidden">
        {/* Animated gradient orbs */}
        <div className="absolute top-[-10%] left-[10%] w-[400px] h-[400px] bg-white/[0.07] rounded-full blur-[120px] animate-pulse-soft" />
        <div className="absolute bottom-[-10%] right-[10%] w-[350px] h-[350px] bg-white/[0.05] rounded-full blur-[100px]" />
        {/* Dot grid pattern */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '28px 28px' }} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <Reveal className="text-center mb-12">
            <span className="inline-flex items-center gap-1.5 bg-white/10 text-white/60 text-[11px] font-bold px-3 py-1.5 rounded-full mb-3 border border-white/10">
              <Play size={11} /> How it works
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-2">3 simple steps to move in</h2>
            <p className="text-white/30 text-sm max-w-md mx-auto">From sign up to your new home — fast, free, and secure</p>
          </Reveal>

          <div className="grid sm:grid-cols-3 gap-5">
            {[
              {
                step: '01', icon: Zap, title: 'Set Your Preferences',
                desc: 'Tell us your budget, city, lifestyle habits and roommate preferences.',
                visual: (
                  <div className="flex flex-wrap gap-1.5 mt-4">
                    {['🏙️ City', '💰 Budget', '🌙 Night Owl', '🚭 No Smoke'].map((t) => (
                      <span key={t} className="bg-primary/8 text-primary text-[9px] font-medium px-2 py-1 rounded-full">{t}</span>
                    ))}
                  </div>
                ),
              },
              {
                step: '02', icon: Sparkles, title: 'Get Smart Matches',
                desc: 'Our algorithm scores compatibility on 15+ factors with detailed breakdowns.',
                visual: (
                  <div className="mt-4 space-y-2">
                    {[{ name: 'Priya', pct: 92 }, { name: 'Rahul', pct: 87 }, { name: 'Ananya', pct: 81 }].map((m) => (
                      <div key={m.name} className="flex items-center gap-2">
                        <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center text-[8px] text-white font-bold">{m.name[0]}</div>
                        <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <motion.div className="h-full bg-primary rounded-full" initial={{ width: 0 }} whileInView={{ width: `${m.pct}%` }} viewport={{ once: true }} transition={{ duration: 1, delay: 0.3 }} />
                        </div>
                        <span className="text-[10px] text-dark font-bold w-7">{m.pct}%</span>
                      </div>
                    ))}
                  </div>
                ),
              },
              {
                step: '03', icon: Shield, title: 'Connect & Move In',
                desc: 'Chat securely, verify profiles, visit the room and finalize your arrangement.',
                visual: (
                  <div className="mt-4 flex items-center gap-3">
                    <div className="flex -space-x-2">
                      {['🧑', '👩', '🧔'].map((e, j) => (
                        <div key={j} className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-sm border-2 border-white">{e}</div>
                      ))}
                    </div>
                    <div className="bg-primary/10 text-primary text-[9px] font-bold px-2 py-1 rounded-full flex items-center gap-1">
                      <BadgeCheck size={10} /> Connected!
                    </div>
                  </div>
                ),
              },
            ].map((s, i) => (
              <Reveal key={s.step} delay={i * 0.12}>
                <motion.div whileHover={{ y: -4 }} className="relative h-full group">
                  <div className="bg-white rounded-2xl p-6 shadow-xl shadow-dark/10 h-full hover:shadow-2xl transition-all duration-300">
                    <div className="flex items-center justify-between mb-5">
                      <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20">
                        <s.icon size={20} className="text-white" />
                      </div>
                      <span className="text-5xl font-extrabold text-dark/[0.04]">{s.step}</span>
                    </div>
                    <h3 className="font-bold text-dark text-base mb-2">{s.title}</h3>
                    <p className="text-muted text-sm leading-relaxed">{s.desc}</p>
                    {s.visual}
                  </div>

                  {i < 2 && (
                    <div className="hidden sm:flex absolute top-1/2 -right-4 z-20 w-8 h-8 items-center justify-center">
                      <div className="w-6 h-6 rounded-full bg-white shadow-md flex items-center justify-center">
                        <ChevronRight size={12} className="text-primary" />
                      </div>
                    </div>
                  )}
                </motion.div>
              </Reveal>
            ))}
          </div>

          <Reveal className="text-center mt-10">
            <Link to="/register">
              <Button size="lg" className="rounded-2xl shadow-xl shadow-primary/30 px-8">
                Get Started — It's Free <ArrowRight size={16} />
              </Button>
            </Link>
          </Reveal>
        </div>
      </section>

      {/* ══ WHY FLATMATE — premium bento cards ══ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Reveal className="text-center mb-10">
          <span className="inline-flex items-center gap-1.5 bg-secondary/10 text-secondary text-[11px] font-bold px-3 py-1.5 rounded-full mb-3"><Heart size={11} /> Why FlatMate</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-dark mb-2">Built for how India finds roommates</h2>
          <p className="text-muted text-sm max-w-md mx-auto">Everything you need for a safe, smart, and stress-free room search</p>
        </Reveal>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Card 1 — Privacy (large, spans 2 rows) */}
          <Reveal className="lg:row-span-2">
            <motion.div whileHover={{ y: -4 }} className="bg-gradient-to-br from-primary/[0.04] to-primary/[0.08] rounded-2xl p-6 border border-primary/10 h-full group relative overflow-hidden">
              <div className="absolute -bottom-16 -right-16 w-48 h-48 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-all duration-700" />
              <div className="relative z-10">
                <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-primary/20">
                  <Shield size={22} className="text-white" />
                </div>
                <h3 className="font-bold text-dark text-lg mb-2">Privacy & Safety First</h3>
                <p className="text-muted text-sm leading-relaxed mb-5">Your phone number stays hidden until you decide to share it. All communication happens through our secure in-app chat.</p>

                {/* Visual: masked number demo */}
                <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary text-sm font-bold">P</div>
                    <div>
                      <p className="text-sm font-semibold text-dark">Priya Sharma</p>
                      <p className="text-xs text-muted">Mumbai • Verified ✓</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-surface rounded-lg px-3 py-2 flex items-center gap-2">
                      <Lock size={12} className="text-muted" />
                      <span className="text-xs text-muted font-mono">+91 •••••• ••48</span>
                    </div>
                    <div className="bg-primary/10 text-primary text-[10px] font-bold px-2.5 py-2 rounded-lg">Masked</div>
                  </div>
                </div>

                <div className="mt-4 flex gap-2">
                  <span className="bg-primary/10 text-primary text-[10px] font-semibold px-2 py-1 rounded-full">🔒 End-to-end secure</span>
                  <span className="bg-primary/10 text-primary text-[10px] font-semibold px-2 py-1 rounded-full">✓ ID Verified</span>
                </div>
              </div>
            </motion.div>
          </Reveal>

          {/* Card 2 — Smart Matching */}
          <Reveal delay={0.08}>
            <motion.div whileHover={{ y: -4 }} className="bg-gradient-to-br from-primary/[0.04] to-primary/[0.08] rounded-2xl p-6 border border-primary/10 h-full group relative overflow-hidden">
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-all" />
              <div className="relative z-10">
                <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-primary/20">
                  <Sparkles size={22} className="text-white" />
                </div>
                <h3 className="font-bold text-dark text-base mb-1.5">Smart Matching</h3>
                <p className="text-muted text-xs leading-relaxed mb-3">15+ compatibility factors scored and ranked in real time.</p>
                {/* Mini progress bars */}
                <div className="space-y-1.5">
                  {[{ l: 'Budget', w: '92%', c: 'bg-primary' }, { l: 'Lifestyle', w: '85%', c: 'bg-primary' }, { l: 'Location', w: '78%', c: 'bg-secondary' }].map((b) => (
                    <div key={b.l} className="flex items-center gap-2">
                      <span className="text-[10px] text-muted w-12">{b.l}</span>
                      <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <motion.div className={`h-full ${b.c} rounded-full`} initial={{ width: 0 }} whileInView={{ width: b.w }} viewport={{ once: true }} transition={{ duration: 0.8 }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </Reveal>

          {/* Card 3 — Secure Chat */}
          <Reveal delay={0.16}>
            <motion.div whileHover={{ y: -4 }} className="bg-gradient-to-br from-secondary/[0.04] to-secondary/[0.08] rounded-2xl p-6 border border-secondary/10 h-full group relative overflow-hidden">
              <div className="relative z-10">
                <div className="w-12 h-12 bg-secondary rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-secondary/20">
                  <MessageCircle size={22} className="text-white" />
                </div>
                <h3 className="font-bold text-dark text-base mb-1.5">Secure Chat</h3>
                <p className="text-muted text-xs leading-relaxed mb-3">Enquire for just ₹19. Chat, share photos, and finalize.</p>
                {/* Mini chat bubbles */}
                <div className="space-y-2">
                  <div className="flex justify-end">
                    <div className="bg-primary text-white text-[10px] px-3 py-1.5 rounded-xl rounded-br-sm max-w-[80%]">Hey! Is the room still available?</div>
                  </div>
                  <div className="flex">
                    <div className="bg-white text-dark text-[10px] px-3 py-1.5 rounded-xl rounded-bl-sm border border-gray-100 max-w-[80%]">Yes! When can you visit? 😊</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </Reveal>

          {/* Card 4 — Zero Brokerage */}
          <Reveal delay={0.12}>
            <motion.div whileHover={{ y: -4 }} className="bg-gradient-to-br from-primary/5 to-primary/5 rounded-2xl p-6 border border-primary/10 h-full group relative overflow-hidden">
              <div className="relative z-10">
                <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-primary/20">
                  <Percent size={22} className="text-white" />
                </div>
                <h3 className="font-bold text-dark text-base mb-1.5">100% Free, Zero Brokerage</h3>
                <p className="text-muted text-xs leading-relaxed mb-3">No hidden charges. List property, search rooms, match with flatmates — all free.</p>
                {/* Savings visual */}
                <div className="bg-white rounded-xl px-4 py-3 border border-gray-100 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] text-muted">You save</p>
                    <p className="text-lg font-extrabold text-primary">₹15,000</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-muted line-through">Broker fee</p>
                    <p className="text-sm font-bold text-muted line-through">₹15,000</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </Reveal>

          {/* Card 5 — Teams */}
          <Reveal delay={0.2}>
            <motion.div whileHover={{ y: -4 }} className="bg-gradient-to-br from-dark/5 to-dark/5 rounded-2xl p-6 border border-dark/10 h-full group relative overflow-hidden">
              <div className="relative z-10">
                <div className="w-12 h-12 bg-secondary rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-secondary/20">
                  <UserCheck size={22} className="text-white" />
                </div>
                <h3 className="font-bold text-dark text-base mb-1.5">Create Teams</h3>
                <p className="text-muted text-xs leading-relaxed mb-3">Team up with friends. Search together. Split rent and save.</p>
                {/* Team visual */}
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                    {['👨', '👩', '🧔', '👧'].map((e, j) => (
                      <div key={j} className="w-8 h-8 rounded-full bg-secondary/15 flex items-center justify-center text-sm border-2 border-white shadow-sm">{e}</div>
                    ))}
                  </div>
                  <span className="text-[10px] font-bold text-secondary bg-secondary/15 px-2 py-1 rounded-full">4/4 Team Ready!</span>
                </div>
              </div>
            </motion.div>
          </Reveal>
        </div>
      </section>

      {/* ══ CREATE TEAM CTA ══ */}
      <section className="bg-surface py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary to-primary-dark p-8 sm:p-12">
              <div className="absolute -top-20 -right-20 w-56 h-56 bg-white/10 rounded-full blur-3xl" />
              <div className="absolute -bottom-16 -left-16 w-44 h-44 bg-white/5 rounded-full blur-2xl" />
              <div className="absolute top-6 right-8 hidden lg:flex -space-x-3">
                {['👨', '👩', '🧔', '👧', '🧑'].map((e, j) => (
                  <motion.div key={j} initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 * j }}
                    className="w-12 h-12 rounded-full bg-white/15 backdrop-blur-sm flex items-center justify-center text-xl border-2 border-white/20 shadow-lg">{e}</motion.div>
                ))}
              </div>

              <div className="relative z-10 max-w-xl">
                <span className="inline-flex items-center gap-1.5 bg-white/15 text-white text-[11px] font-bold px-3 py-1 rounded-full mb-4 backdrop-blur-sm">
                  <Users size={12} /> Team Feature
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight mb-3">
                  Flat hunting with friends?<br />
                  <span className="text-white/70">Create a team. Search together.</span>
                </h2>
                <p className="text-white/50 text-sm leading-relaxed mb-6 max-w-md">
                  Share a private passkey, save listings to a shared wishlist, group chat in real-time, and split the rent. No more forwarding screenshots.
                </p>

                <div className="flex flex-wrap gap-3 mb-6">
                  {[
                    { text: 'Private passkey invite' },
                    { text: 'Shared wishlist' },
                    { text: 'Group chat' },
                    { text: 'Up to 10 members' },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-1.5 bg-white/10 border border-white/10 rounded-lg px-3 py-1.5">
                      <BadgeCheck size={12} className="text-white/60" />
                      <span className="text-white/70 text-xs font-medium">{item.text}</span>
                    </div>
                  ))}
                </div>

                <div className="flex gap-3">
                  <Link to="/teams" className="inline-flex items-center gap-2 bg-white text-primary font-bold text-sm px-6 py-3 rounded-xl hover:shadow-lg hover:shadow-white/20 transition-all">
                    <UserCheck size={16} /> Create Your Team
                  </Link>
                  <Link to="/search" className="inline-flex items-center gap-2 bg-white/10 text-white font-semibold text-sm px-5 py-3 rounded-xl border border-white/15 hover:bg-white/20 transition-all">
                    Browse Listings <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ══ SAFE & SECURE CHAT CTA ══ */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1a1a2e] to-[#16213e] p-8 sm:p-12">
              {/* Decorative */}
              <div className="absolute -top-16 -right-16 w-48 h-48 bg-primary/20 rounded-full blur-3xl" />
              <div className="absolute -bottom-12 -left-12 w-40 h-40 bg-primary/10 rounded-full blur-2xl" />

              <div className="relative z-10 grid lg:grid-cols-2 gap-8 items-center">
                {/* Left — content */}
                <div>
                  <span className="inline-flex items-center gap-1.5 bg-primary/20 text-primary text-[11px] font-bold px-3 py-1 rounded-full mb-4">
                    <Shield size={12} /> Safe & Secured
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight mb-4">
                    No spam. No vulgar messages.<br />
                    <span className="text-primary">Just real conversations.</span>
                  </h2>
                  <p className="text-white/50 text-sm leading-relaxed mb-6 max-w-md">
                    Our AI-free profanity filter automatically blocks inappropriate language.
                    3 strikes and the sender gets blocked for 24 hours. Your safety is our priority.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    {[
                      { icon: Shield, text: 'Auto profanity filter' },
                      { icon: Lock, text: '3-strike auto block' },
                      { icon: MessageCircle, text: 'Masked phone numbers' },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-3.5 py-2">
                        <item.icon size={14} className="text-primary" />
                        <span className="text-white/70 text-xs font-medium">{item.text}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right — visual demo */}
                <div className="hidden lg:block">
                  <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-5 max-w-xs ml-auto">
                    <p className="text-white/30 text-[10px] font-semibold uppercase tracking-wider mb-3">Chat Preview</p>
                    {/* Normal message */}
                    <div className="flex justify-end mb-2">
                      <div className="bg-primary/80 text-white text-xs px-3 py-2 rounded-2xl rounded-br-sm max-w-[200px]">
                        Hi! Is the room still available?
                      </div>
                    </div>
                    <div className="flex justify-start mb-2">
                      <div className="bg-white/10 text-white/80 text-xs px-3 py-2 rounded-2xl rounded-bl-sm max-w-[200px]">
                        Yes, it is! When can you visit?
                      </div>
                    </div>
                    {/* Blocked message */}
                    <div className="flex justify-end mb-2">
                      <div className="bg-red-500/20 text-red-300 text-xs px-3 py-2 rounded-2xl rounded-br-sm max-w-[200px] border border-red-500/20">
                        **** **** ****
                      </div>
                    </div>
                    {/* Warning */}
                    <div className="flex justify-center">
                      <div className="bg-red-500/10 border border-red-500/20 text-red-300 text-[10px] font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1.5">
                        <Shield size={10} /> Warning: 2 strikes left
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ══ TESTIMONIALS ══ */}
      <section className="bg-surface py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal className="text-center mb-8">
            <span className="inline-flex items-center gap-1 bg-yellow-50 text-yellow-600 text-[11px] font-bold px-2.5 py-1 rounded-full mb-3"><Star size={11} /> Reviews</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-dark">Loved by thousands</h2>
          </Reveal>
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { name: 'Priya Sharma', city: 'Mumbai', role: 'Engineer', text: 'Found my perfect roommate in a week! The matching actually works.', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&q=80' },
              { name: 'Rahul Kumar', city: 'Bangalore', role: 'Designer', text: 'No brokers, verified listings, secure chat. Highly recommend!', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&q=80' },
              { name: 'Ananya Mehta', city: 'Delhi', role: 'Student', text: 'Team feature is genius. Found a 3BHK with friends. Saved ₹15k.', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&q=80' },
            ].map((t, i) => (
              <Reveal key={t.name} delay={i * 0.08}>
                <div className="bg-white rounded-2xl p-5 border border-gray-100 h-full flex flex-col">
                  <div className="flex gap-0.5 mb-3">
                    {Array.from({ length: 5 }).map((_, j) => <Star key={j} size={12} className="fill-yellow-400 text-yellow-400" />)}
                  </div>
                  <p className="text-dark/70 text-xs leading-relaxed mb-4 flex-1">"{t.text}"</p>
                  <div className="flex items-center gap-2.5 pt-3 border-t border-gray-50">
                    <img src={t.avatar} alt={t.name} className="w-8 h-8 rounded-full object-cover" loading="lazy" />
                    <div>
                      <p className="font-semibold text-dark text-xs">{t.name}</p>
                      <p className="text-[10px] text-muted">{t.role} • {t.city}</p>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══ DUAL CTA ══ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid sm:grid-cols-2 gap-4">
          <Reveal>
            <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-2xl p-6 border border-primary/10 h-full">
              <span className="text-2xl mb-3 block">🔍</span>
              <h3 className="text-base font-extrabold text-dark mb-1.5">Looking for a room?</h3>
              <p className="text-muted text-xs leading-relaxed mb-4">Browse verified rooms, PGs and flatmates matched to your lifestyle.</p>
              <Link to="/search"><Button size="sm" className="rounded-xl">Start Searching <ArrowRight size={14} /></Button></Link>
            </div>
          </Reveal>
          <Reveal delay={0.08}>
            <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-2xl p-6 border border-primary/10 h-full">
              <span className="text-2xl mb-3 block">🏠</span>
              <h3 className="text-base font-extrabold text-dark mb-1.5">Have a room to rent?</h3>
              <p className="text-muted text-xs leading-relaxed mb-4">List your property free. Reach thousands of verified tenants.</p>
              <Link to="/post"><Button size="sm" className="rounded-xl !bg-primary hover:!bg-primary/90 shadow-md shadow-primary/20">Post Free Listing <ArrowRight size={14} /></Button></Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ══ FINAL CTA ══ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-14">
        <Reveal>
          <div className="bg-gradient-to-br from-primary via-primary-dark to-primary-light rounded-2xl px-8 py-10 sm:py-12 text-center text-white relative overflow-hidden shadow-2xl shadow-primary/20">
            <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '24px 24px' }} />
            <div className="relative z-10">
              <h2 className="text-2xl sm:text-3xl font-extrabold mb-3">Ready to find your perfect flatmate?</h2>
              <p className="text-white/40 mb-6 max-w-md mx-auto text-sm">Join 10,000+ users across 50+ cities.</p>
              <div className="flex flex-col sm:flex-row gap-2.5 justify-center">
                <Link to="/register"><Button size="md" className="!bg-white !text-primary hover:!bg-gray-50 rounded-xl shadow-xl">Sign Up Free <ArrowRight size={14} /></Button></Link>
                <Link to="/search"><Button variant="outline" size="md" className="!border-white/20 !text-white hover:!bg-white/10 rounded-xl">Browse Listings</Button></Link>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ══ FOOTER ══ */}
      <footer className="bg-[#2D2D2D] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/80 rounded-lg flex items-center justify-center"><span className="text-white font-bold text-xs">F</span></div>
                <span className="text-base font-bold">Flat<span className="text-primary-light">Mate</span><sup className="text-[7px] text-white/30 ml-0.5">®</sup></span>
              </div>
              <p className="text-white/20 text-xs leading-relaxed mb-4">Find compatible flatmates, rooms & PGs. 100% brokerage-free.</p>
              <div className="flex gap-2">
                {['Li', 'Tw', 'In', 'Yt'].map((s) => (
                  <a key={s} href="#" className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/25 hover:text-white text-[10px] transition-all">{s}</a>
                ))}
              </div>
            </div>
            {[
              { title: 'Explore', links: ['Find Rooms', 'Find Roommates', 'PG Search', 'Post Listing'] },
              { title: 'Top Cities', links: ['Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Pune'] },
              { title: 'Company', links: ['About Us', 'Careers', 'Blog', 'Privacy', 'Terms'] },
            ].map((col) => (
              <div key={col.title}>
                <h4 className="font-semibold text-[10px] uppercase tracking-widest text-white/25 mb-3">{col.title}</h4>
                <div className="space-y-2">{col.links.map((l) => <a key={l} href="#" className="block text-white/20 hover:text-white text-xs transition-colors">{l}</a>)}</div>
              </div>
            ))}
          </div>
          <div className="border-t border-white/5 pt-5 flex flex-col sm:flex-row items-center justify-between gap-2">
            <span className="text-white/15 text-xs">© 2026 FlatMate®. All rights reserved.</span>
            <span className="text-white/10 text-[10px]">Product of Think Straight IT LLP</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
