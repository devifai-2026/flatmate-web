import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence, useInView, useMotionValue, useTransform, animate } from 'framer-motion';
import MarqueeModule from 'react-fast-marquee';
const Marquee = MarqueeModule.default || MarqueeModule;
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import Button from '../components/ui/Button';
import { CITY_IMAGES, CITY_GRADIENTS, PLATFORM_STATS, GLOBAL_COUNTRIES } from '../utils/constants';

import {
  Search, Home, Sparkles, ArrowRight, Shield, Zap, Star,
  MapPin, UserCheck, Heart, MessageCircle, TrendingUp, Play,
  Globe, Percent, BadgeCheck, Lock, Users, Building2, ChevronRight, ChevronDown,
  Clock, DollarSign, Headset, CheckCircle as CheckCircleIcon, Gift, MousePointer2, FileText,
  Mail, Phone, Instagram, Youtube, Linkedin, Twitter as TwitterIcon, LucidePin as Pinterest,
  MessageSquare, X
} from 'lucide-react';

import { FaCcVisa, FaCcMastercard, FaCcAmex, FaCcPaypal, FaApple, FaGooglePlay } from 'react-icons/fa';
import { RiHandHeartLine } from 'react-icons/ri';
import { LiaBedSolid } from 'react-icons/lia';

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

const ALL_CITIES = [
  "London", "Glasgow", "Coventry", "Birmingham", "Nottingham", "Sheffield", "Manchester", "Edinburgh", "Leicester", "Cardiff", 
  "Leeds", "Newcastle", "Aberdeen", "Portsmouth", "Cambridge", "Oxford", "Southampton", "Exeter", "Bournemouth", "Belfast",
  "Bristol", "Canterbury", "Dublin", "Swansea", "Loughborough", "Brighton", "De", "Dallas", "Cork", "Melbourne", "Sydney", 
  "Adelaide", "Brisbane", "Canberra", "Gold Coast", "Perth", "Ann Arbor", "Atlanta", "Austin", "Champaign", "Chicago",
  "Houston", "Los Angeles", "Lubbock", "Miami", "New York", "Philadelphia", "San Antonio", "San Francisco", "Seattle", 
  "Tempe", "Washington DC", "Burnaby", "Hamilton", "Mississauga", "Toronto", "Vancouver", "Waterloo", "Winnipeg", "Montreal",
  "Mumbai", "Bangalore", "Pune", "Delhi", "Chennai", "Hyderabad", "Kolkata", "Ahmedabad", "Jaipur", "Lucknow"
];

const ALL_COUNTRIES = [
  "UK", "USA", "India", "Australia", "Canada", "Ireland", "Germany", "France", "Spain", "Italy", "Singapore"
];

/* ── Property Card with Image Slider ── */
const PropertyCard = ({ property: p, i, activePropertyCity, activePropertyRegion, navigate }) => {
  const [currentImg, setCurrentImg] = useState(0);
  const images = useMemo(() => [
    p.img,
    "https://images.unsplash.com/photo-1522770179533-24471fcdba45?w=600&q=80",
    "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&q=80"
  ], [p.img]);

  const handleNext = (e) => {
    e.stopPropagation();
    setCurrentImg((prev) => (prev + 1) % images.length);
  };

  const handlePrev = (e) => {
    e.stopPropagation();
    setCurrentImg((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <Reveal key={i} delay={i * 0.04} className="flex-shrink-0 min-w-[230px] w-[230px] snap-start">
      <motion.div 
        whileHover={{ y: -5 }}
        onClick={() => navigate(`/rooms/flatmate-room-${(activePropertyCity || '').toLowerCase()}-${i+1}`)}
        className="bg-white rounded-[0.5rem] overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-400 h-full flex flex-col group/card relative cursor-pointer"
      >
        <div className="relative aspect-[16/10] overflow-hidden group/img">
          <AnimatePresence mode='wait'>
            <motion.img 
              key={currentImg}
              src={images[currentImg]} 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              alt={p.name} 
              className="w-full h-full object-cover group-hover/card:scale-110 transition-transform duration-700" 
            />
          </AnimatePresence>
          
          {p.badge && (
            <div className="absolute top-2.5 left-2.5 bg-primary/90 backdrop-blur-sm text-white text-[8px] font-black px-2.5 py-1 rounded-full shadow-md uppercase z-10">
              {p.badge}
            </div>
          )}
          
          <button className="absolute top-2.5 right-2.5 w-7 h-7 bg-white/90 backdrop-blur-md rounded-lg flex items-center justify-center text-gray-400 hover:text-primary transition-all shadow-md z-10">
            <Heart size={14} />
          </button>

          {/* Slider Dots */}
          <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
            {images.map((_, idx) => (
              <div 
                key={idx} 
                className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${idx === currentImg ? 'bg-white w-4' : 'bg-white/40 shadow-sm'}`} 
              />
            ))}
          </div>

          {/* Navigation Arrows */}
          <button 
            onClick={handlePrev}
            className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/30 hover:bg-black/50 backdrop-blur-md rounded-full flex items-center justify-center text-white opacity-0 group-hover/img:opacity-100 transition-all duration-300 z-10"
          >
            <ChevronRight className="rotate-180" size={16} />
          </button>
          <button 
            onClick={handleNext}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/30 hover:bg-black/50 backdrop-blur-md rounded-full flex items-center justify-center text-white opacity-0 group-hover/img:opacity-100 transition-all duration-300 z-10"
          >
            <ChevronRight size={16} />
          </button>
        </div>

        <div className="p-4 flex-1 flex flex-col">
          <h3 className="font-black text-dark text-base leading-snug mb-1 line-clamp-1 group-hover/card:text-primary transition-colors">{p.name || ''}</h3>
          <p className="text-[11px] text-gray-400 mb-1 font-black uppercase tracking-widest opacity-60">
            {activePropertyCity || ''}, {activePropertyRegion || ''}
          </p>

          <div className="flex items-center justify-between mt-auto pt-2 border-t border-gray-50">
            <div>
              <p className="text-[10px] text-gray-400 font-bold uppercase mb-0.5 leading-none">From</p>
              <p className="text-xl font-black text-dark leading-none">
                {activePropertyRegion === 'India' ? '₹' : '£'}{p.price}k<span className="text-[12px] font-bold text-gray-300">/mo</span>
              </p>
            </div>
            <div className="flex items-center gap-1.5 bg-[#f0fff4] px-2.5 py-1 rounded-lg border border-[#dcfce7]">
              <Star size={12} className="fill-[#00b67a] text-[#00b67a]" />
              <span className="text-[12px] font-black text-[#00b67a]">{p.rating ? p.rating.split('(')[0] : ''}</span>
            </div>
          </div>
        </div>
      </motion.div>
    </Reveal>
  );
};

export default function Landing() {
  const [location, setLocation] = useState('');
  const navigate = useNavigate();
  const handleSearch = (e) => {
    e.preventDefault();
    if (location) navigate(`/search?location=${encodeURIComponent(location)}`);
  };

  const [activeCountry, setActiveCountry] = useState('India');
  const [activePropertyRegion, setActivePropertyRegion] = useState('India');
  const [activePropertyCity, setActivePropertyCity] = useState('Mumbai');
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [cityTab, setCityTab] = useState('Cities');
  const propertyGridRef = useRef(null);
  const offerScrollRef = useRef(null);
  const testimonialScrollRef = useRef(null);
  const searchContainerRef = useRef(null);

  const [canScrollLeftOffers, setCanScrollLeftOffers] = useState(false);
  const [canScrollLeftProperties, setCanScrollLeftProperties] = useState(false);
  const [canScrollRightProperties, setCanScrollRightProperties] = useState(true);
  const [canScrollLeftTestimonials, setCanScrollLeftTestimonials] = useState(false);
  const [canScrollRightTestimonials, setCanScrollRightTestimonials] = useState(true);
  
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [searchTab, setSearchTab] = useState('ALL');
  const [showAppModal, setShowAppModal] = useState(false);

  const searchData = {
    'ALL': {
      cities: ['London', 'Dublin', 'Melbourne', 'Toronto', 'Manchester', 'Birmingham', 'Sydney', 'Chicago', 'Cork', 'Nottingham', 'Berlin', 'Madrid', 'Mumbai', 'Delhi'],
      universities: [
        { name: 'University College London', city: 'London' },
        { name: 'University of Birmingham', city: 'Birmingham' },
        { name: 'University of Manchester', city: 'Manchester' },
        { name: 'Trinity College', city: 'Dublin' },
        { name: 'Coventry University', city: 'Coventry' }
      ]
    },
    'UK': {
       cities: ['London', 'Manchester', 'Birmingham', 'Glasgow', 'Liverpool', 'Coventry', 'Nottingham', 'Bristol', 'Leeds', 'Sheffield'],
       universities: [
         { name: 'University College London', city: 'London' },
         { name: 'University of Manchester', city: 'Manchester' },
         { name: 'University of Birmingham', city: 'Birmingham' },
         { name: 'Coventry University', city: 'Coventry' },
         { name: 'King\'s College London', city: 'London' }
       ]
    },
    'IRE': {
      cities: ['Dublin', 'Cork', 'Galway', 'Limerick', 'Waterford'],
      universities: [
        { name: 'Trinity College Dublin', city: 'Dublin' },
        { name: 'University College Dublin', city: 'Dublin' },
        { name: 'University College Cork', city: 'Cork' }
      ]
    },
    'AUS': {
      cities: ['Sydney', 'Melbourne', 'Brisbane', 'Perth', 'Adelaide', 'Canberra'],
      universities: [
        { name: 'University of Sydney', city: 'Sydney' },
        { name: 'University of Melbourne', city: 'Melbourne' },
        { name: 'UNSW Sydney', city: 'Sydney' }
      ]
    },
    'CAN': {
      cities: ['Toronto', 'Vancouver', 'Montreal', 'Ottawa', 'Calgary'],
      universities: [
        { name: 'University of Toronto', city: 'Toronto' },
        { name: 'University of British Columbia', city: 'Vancouver' },
        { name: 'McGill University', city: 'Montreal' }
      ]
    },
    'USA': {
      cities: ['New York', 'Los Angeles', 'Chicago', 'Boston', 'San Francisco'],
      universities: [
        { name: 'Columbia University', city: 'New York' },
        { name: 'University of Chicago', city: 'Chicago' },
        { name: 'NYU', city: 'New York' }
      ]
    },
    'GER': {
      cities: ['Berlin', 'Munich', 'Hamburg', 'Frankfurt', 'Cologne'],
      universities: [
        { name: 'Technical University of Munich', city: 'Munich' },
        { name: 'Humboldt University', city: 'Berlin' }
      ]
    },
    'ESP': {
      cities: ['Madrid', 'Barcelona', 'Valencia', 'Seville'],
      universities: [
        { name: 'University of Barcelona', city: 'Barcelona' },
        { name: 'Complutense University of Madrid', city: 'Madrid' }
      ]
    },
    'IND': {
      cities: ['mumbai', 'Delhi', 'Bangalore', 'Pune', 'Hyderabad', 'Chennai'],
      universities: [
        { name: 'Indian Institute of Technology', city: 'Mumbai' },
        { name: 'Delhi University', city: 'Delhi' }
      ]
    }
  };

  const currentSearchData = searchData[searchTab] || searchData['ALL'];

  const filteredCities = useMemo(() => {
    if (!CITY_IMAGES) return [];
    return Object.values(CITY_IMAGES).filter(c => c && c.country === activeCountry);
  }, [activeCountry]);
  
  const propertyCities = useMemo(() => {
    if (!CITY_IMAGES) return [];
    return Object.values(CITY_IMAGES)
      .filter(c => c && c.country === activePropertyRegion)
      .map(c => c.label);
  }, [activePropertyRegion]);

  const handleOfferScroll = (e) => {
    setCanScrollLeftOffers(e.target.scrollLeft > 10);
  };

  const handlePropertyScroll = () => {
    if (propertyGridRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = propertyGridRef.current;
      setCanScrollLeftProperties(scrollLeft > 10);
      setCanScrollRightProperties(scrollLeft + clientWidth < scrollWidth - 10);
    }
  };

  const handleTestimonialScroll = () => {
    if (testimonialScrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = testimonialScrollRef.current;
      setCanScrollLeftTestimonials(scrollLeft > 10);
      setCanScrollRightTestimonials(scrollLeft + clientWidth < scrollWidth - 10);
    }
  };

  useEffect(() => {
    const offerEl = offerScrollRef.current;
    if (offerEl) offerEl.addEventListener('scroll', handleOfferScroll);
    
    const propertyEl = propertyGridRef.current;
    if (propertyEl) {
      propertyEl.addEventListener('scroll', handlePropertyScroll);
      handlePropertyScroll();
    }

    const testimonialEl = testimonialScrollRef.current;
    if (testimonialEl) {
      testimonialEl.addEventListener('scroll', handleTestimonialScroll);
      // Initial check
      handleTestimonialScroll();
    }

    const handleClickOutside = (e) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target)) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      if (offerEl) offerEl.removeEventListener('scroll', handleOfferScroll);
      if (propertyEl) propertyEl.removeEventListener('scroll', handlePropertyScroll);
      if (testimonialEl) testimonialEl.removeEventListener('scroll', handleTestimonialScroll);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const isClosed = localStorage.getItem('appModalClosed');
    if (!isClosed) {
      const timer = setTimeout(() => setShowAppModal(true), 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    if (propertyCities && propertyCities.length > 0 && (!activePropertyCity || !propertyCities.includes(activePropertyCity))) {
       setActivePropertyCity(propertyCities[0]);
    }
  }, [propertyCities, activePropertyCity]);

  return (
    <div className="min-h-screen bg-white overflow-hidden font-outfit text-dark">
      <Navbar transparent={true} />

      {/* ══ HERO ══ */}
      <section className="relative h-[55vh] min-h-[450px] flex items-center justify-center pt-12 z-20">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://i.ibb.co/xqfdtPFM/pexels-thirdman-7236569.jpg" 
            alt="Cozy student accommodation" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/45" />
        </div>

        <div className="max-w-[90%] mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
            className="text-4xl sm:text-7xl font-black text-white mb-4 tracking-tight leading-[1.1]"
          >
            Home away from home
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
            className="text-base sm:text-xl text-white/90 mb-8 max-w-3xl mx-auto font-medium leading-relaxed px-4"
          >
            Book student accommodations near top universities and cities across the globe
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-wrap justify-center gap-2 sm:gap-4 mb-8 sm:mb-10"
          >
            {[
              { icon: BadgeCheck, text: "Verified Properties" },
              { icon: MessageCircle, text: "24x7 Assistance" },
              { icon: Shield, text: "Lowest Price Guarantee" }
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2 sm:gap-2.5 bg-white/15 backdrop-blur-xl border border-white/20 px-3 sm:px-5 py-2 sm:py-2.5 rounded-xl sm:rounded-2xl text-white text-[10px] sm:text-sm font-bold shadow-2xl">
                <item.icon size={14} className="text-primary sm:w-4 sm:h-4" />
                {item.text}
              </div>
            ))}
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }}
            className="w-full max-w-3xl mx-auto relative z-[500]"
            ref={searchContainerRef}
          >
            <form onSubmit={handleSearch} className="relative z-[520]">
              <input 
                type="text" value={location} 
                onChange={(e) => setLocation(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                placeholder="Search by City, University or Property"
                className="w-full bg-white rounded-2xl sm:rounded-full py-4 sm:py-6 px-6 sm:px-10 pr-16 sm:pr-20 text-dark placeholder-gray-400 shadow-2xl focus:outline-none focus:ring-8 focus:ring-primary/10 transition-all text-base sm:text-xl font-bold border-none"
              />
              <button 
                type="submit"
                className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 w-12 h-12 sm:w-14 sm:h-14 bg-primary rounded-xl sm:rounded-full flex items-center justify-center text-white shadow-xl hover:scale-110 active:scale-95 transition-all cursor-pointer"
              >
                <Search size={22} className="sm:w-[26px] sm:h-[26px]" />
              </button>
            </form>

            <AnimatePresence>
              {isSearchFocused && (
                <motion.div 
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 10, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute top-full left-0 right-0 bg-white rounded-[2rem] shadow-[0_30px_100px_rgba(0,0,0,0.15)] z-[510] overflow-hidden border border-gray-100/50 backdrop-blur-3xl"
                >
                  {/* Tabs */}
                  <div className="border-b border-gray-50 bg-gray-50/30 overflow-hidden relative">
                    <motion.div 
                      drag="x"
                      dragConstraints={{ left: -300, right: 0 }}
                      className="flex items-center gap-1 p-2 cursor-grab active:cursor-grabbing"
                    >
                      {['ALL', '🇬🇧 UK', '🇮🇪 IRE', '🇨🇦 CAN', '🇦🇺 AUS', '🇺🇸 USA', '🇩🇪 GER', '🇪🇸 ESP', '🇮🇳 IND'].map((tab) => (
                        <button
                          key={tab}
                          onClick={() => setSearchTab(tab.includes(' ') ? tab.split(' ')[1] : tab)}
                          className={`px-5 py-2.5 rounded-full text-[13px] font-black transition-all whitespace-nowrap
                            ${(searchTab === tab || (tab === 'ALL' && searchTab === 'ALL')) 
                              ? 'bg-white text-primary shadow-sm border border-primary/10' 
                              : 'text-gray-400 hover:text-gray-600'}`}
                        >
                          {tab}
                        </button>
                      ))}
                    </motion.div>
                  </div>

                  <div className="p-2 space-y-1 max-h-[480px] overflow-y-auto no-scrollbar">
                    {/* Recently Searched */}
                    <div className="px-5 py-4">
                      <div className="flex items-center gap-2 text-gray-400 mb-4">
                        <Clock size={14} className="opacity-60" />
                        <span className="text-[11px] font-black uppercase tracking-widest opacity-80">Recently Searched</span>
                      </div>
                      <div className="flex flex-wrap gap-4 ml-6">
                        {['London', 'Liverpool', 'Manchester'].map(city => (
                          <button key={city} onClick={() => { navigate(`/search?location=${encodeURIComponent(city)}`); setIsSearchFocused(false); }} className="flex items-center gap-2 text-gray-500 hover:text-primary transition-all font-bold text-sm">
                             <Clock size={14} className="opacity-40" /> {city}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Top Cities */}
                    <div className="px-5 py-4 bg-gray-50/50 rounded-2xl mx-2">
                      <div className="flex items-center gap-2 text-gray-400 mb-6">
                        <MapPin size={14} className="opacity-60 text-secondary" />
                        <span className="text-[11px] font-black uppercase tracking-widest opacity-80">Top Cities in {searchTab === 'ALL' ? 'Global' : searchTab}</span>
                        <Zap size={10} className="text-orange-400 fill-orange-400 animate-pulse ml-0.5" />
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-y-5 gap-x-2 ml-6">
                        {currentSearchData.cities.map(city => (
                          <button key={city} onClick={() => { navigate(`/search?location=${encodeURIComponent(city)}`); setIsSearchFocused(false); }} className="text-left text-gray-500 hover:text-primary transition-all font-bold text-sm">
                            {city}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Top Universities */}
                    <div className="px-5 py-6">
                      <div className="flex items-center gap-2 text-gray-400 mb-6">
                        <div className="w-6 h-6 flex items-center justify-center bg-gray-50 rounded-md">
                          <img src="https://amberstudent.com/static-assets/amber-v2/icons/amenities/university.svg" alt="Uni" className="w-3.5 h-3.5 grayscale opacity-60" />
                        </div>
                        <span className="text-[11px] font-black uppercase tracking-widest opacity-80">Top Universities</span>
                        <Zap size={10} className="text-orange-400 fill-orange-400 animate-pulse ml-0.5" />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-4 gap-x-6 ml-6 pb-4">
                        {currentSearchData.universities.map((uni, idx) => (
                          <button 
                            key={idx} 
                            onClick={() => { navigate(`/search?location=${encodeURIComponent(`${uni.name}, ${uni.city}`)}`); setIsSearchFocused(false); }} 
                            className="text-left text-gray-500 hover:text-primary transition-all font-bold text-sm leading-snug"
                          >
                            {uni.name}, <span className="opacity-80 font-semibold">{uni.city}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      {/* ══ POPULAR CITIES ══ */}
      <section className="bg-white py-20 pb-10">
        <div className="max-w-[90%] mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="mb-10 text-center md:text-left">
              <h2 className="text-3xl font-black text-dark mb-2 tracking-tight">Popular Cities Across The Globe</h2>
              <p className="text-gray-500 text-lg font-medium">Book student accommodations near top cities and universities around the world.</p>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="relative mb-8 border-b border-gray-100 overflow-hidden">
              <motion.div 
                drag="x"
                dragConstraints={{ left: -500, right: 0 }}
                className="flex items-center gap-3 pb-6 cursor-grab active:cursor-grabbing"
              >
                {GLOBAL_COUNTRIES && GLOBAL_COUNTRIES.map((country) => (
                  <button
                    key={country.name}
                    onClick={() => setActiveCountry(country.name)}
                    className={`flex items-center gap-2.5 px-6 py-3 rounded-full border whitespace-nowrap transition-all cursor-pointer text-base font-bold
                      ${activeCountry === country.name 
                        ? 'border-primary text-primary bg-primary/5 shadow-xl shadow-primary/10' 
                        : 'border-gray-100 text-gray-400 hover:border-primary/30 hover:bg-gray-50'}`}
                  >
                    <span className="text-xl">{country.flag}</span>
                    {country.name}
                  </button>
                ))}
              </motion.div>
            </div>
          </Reveal>

          <div className="relative group min-h-[450px]">
            <AnimatePresence mode="wait">
              <motion.div 
                key={activeCountry}
                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}
                className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-5"
              >
                {filteredCities.map((city) => (
                  <motion.button 
                    key={city.label} whileHover={{ scale: 1.05 }}
                    onClick={() => navigate(`/search?location=${city.label}`)}
                    className="group relative w-full aspect-[4/5] rounded-[0.5rem] overflow-hidden shadow-2xl transition-all duration-500"
                  >
                    <img src={city.image} alt={city.label} className="w-full h-full object-cover group-hover:scale-125 transition-transform duration-1000" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent p-5 flex flex-col justify-end items-center">
                      <span className="text-white text-base font-black tracking-tight drop-shadow-2xl">{city.label}</span>
                    </div>
                  </motion.button>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* ══ PLATFORM HIGHLIGHTS ══ */}
      <section className="bg-white py-24 border-y border-gray-50">
        <div className="max-w-[90%] mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 items-start justify-items-center md:justify-items-stretch">
            <Reveal delay={0.1}>
              <div className="text-center md:text-left group cursor-default">
                <div className="relative mb-6 inline-block md:block">
                  <div className="absolute -inset-4 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-all duration-700" />
                  <LiaBedSolid size={56} className="text-primary relative z-10 mx-auto md:mx-0" />
                </div>
                <h3 className="text-2xl sm:text-3xl font-black text-dark mb-2 tracking-tighter">1M+ Beds</h3>
                <p className="text-gray-500 text-sm font-medium leading-relaxed max-w-[200px] mx-auto md:mx-0">Book your perfect place from an extensive list of options.</p>
              </div>
            </Reveal>

            <Reveal delay={0.2}>
              <div className="text-center md:text-left group cursor-default">
                <div className="relative mb-6 inline-block md:block">
                  <div className="absolute -inset-4 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-all duration-700" />
                  <img src="https://amberstudent.com/static-assets/amber-v2/icons/amenities/university.svg" alt="Universities" className="w-14 h-14 relative z-10 mx-auto md:mx-0" onError={(e) => e.target.src = 'https://cdn-icons-png.flaticon.com/512/2800/2800045.png'} />
                </div>
                <h3 className="text-2xl sm:text-3xl font-black text-dark mb-2 tracking-tighter">800+ Universities</h3>
                <p className="text-gray-500 text-sm font-medium leading-relaxed max-w-[200px] mx-auto md:mx-0">Find the best student homes near prestigious universities.</p>
              </div>
            </Reveal>

            <Reveal delay={0.3}>
              <div className="text-center md:text-left group cursor-default">
                <div className="relative mb-6 inline-block md:block">
                  <div className="absolute -inset-4 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-all duration-700" />
                  <img src="https://amberstudent.com/static-assets/amber-v2/icons/amenities/globe.svg" alt="Cities" className="w-14 h-14 relative z-10 mx-auto md:mx-0" onError={(e) => e.target.src = 'https://cdn-icons-png.flaticon.com/512/921/921439.png'} />
                </div>
                <h3 className="text-2xl sm:text-3xl font-black text-dark mb-2 tracking-tighter">250+ Global Cities</h3>
                <p className="text-gray-500 text-sm font-medium leading-relaxed max-w-[200px] mx-auto md:mx-0">We operate in major cities around the world.</p>
              </div>
            </Reveal>

            <Reveal delay={0.4}>
              <div className="text-center md:text-right group cursor-default">
                <div className="flex flex-col md:items-end">
                  <div className="flex items-center justify-center md:justify-end gap-2 mb-3">
                    <Star size={24} className="fill-[#00b67a] text-[#00b67a]" />
                    <span className="text-2xl font-black text-dark">Trustpilot</span>
                  </div>
                  <div className="flex gap-1 justify-center md:justify-end mb-4">
                    {[1,2,3,4,5].map(i => (
                      <div key={i} className="w-10 h-10 bg-[#00b67a] rounded-sm flex items-center justify-center">
                        <Star size={18} className="fill-white text-white" />
                      </div>
                    ))}
                  </div>
                  <p className="text-sm font-bold text-gray-400">
                    TrustScore <span className="text-dark">4.8 | 9,420 reviews</span>
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ══ GLOBAL PROPERTIES ══ */}
      <section className="bg-[#fbfcff] py-16 relative overflow-hidden">
        <div className="max-w-[90%] mx-auto px-4">
          <Reveal>
            <div className="mb-8 text-center md:text-left ml-2">
              <h2 className="text-2xl font-black text-dark mb-1 tracking-tight">Thousands Of Properties Globally</h2>
              <p className="text-gray-400 text-sm font-bold opacity-80">From studios to private rooms to shared apartments, we’ve got it all.</p>
            </div>
          </Reveal>

          <div className="flex flex-wrap items-center gap-3 mb-10 relative ml-2">
            <div className="relative">
              <button 
                onClick={() => setShowCountryDropdown(!showCountryDropdown)}
                className="flex items-center gap-2 px-4 py-2 rounded-full border border-primary/20 text-primary bg-primary/5 font-black text-[12px] whitespace-nowrap transition-all hover:bg-primary/10 active:scale-95"
              >
                <span className="text-base">{GLOBAL_COUNTRIES && GLOBAL_COUNTRIES.find(c => c.name === activePropertyRegion)?.flag || '🇮🇳'}</span>
                {activePropertyRegion} 
                <ChevronDown className={`transition-transform duration-500 ${showCountryDropdown ? 'rotate-180' : ''}`} size={14} />
              </button>
              
              <AnimatePresence>
                {showCountryDropdown && (
                  <motion.div 
                    initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 5 }}
                    className="absolute top-full left-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-gray-100 py-3 z-[200] overflow-hidden"
                  >
                    <div className="max-h-[250px] overflow-y-auto no-scrollbar">
                      {GLOBAL_COUNTRIES && GLOBAL_COUNTRIES.map(c => (
                        <button 
                          key={c.name}
                          onClick={() => { setActivePropertyRegion(c.name); setShowCountryDropdown(false); }}
                          className="w-full flex items-center gap-3 px-5 py-2.5 hover:bg-primary/5 text-left transition-all font-black text-gray-500 hover:text-primary group text-[13px]"
                        >
                          <span className="text-lg group-hover:scale-110 transition-transform">{c.flag}</span> 
                          <span>{c.name}</span>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="h-4 w-[1px] bg-gray-200 mx-1 hidden sm:block opacity-50" />
            
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
              {(propertyCities || []).map((city) => (
                <button 
                  key={city} 
                  onClick={() => setActivePropertyCity(city)}
                  className={`px-4 py-2 rounded-full border text-[12px] font-black whitespace-nowrap transition-all duration-300
                    ${activePropertyCity === city 
                      ? 'bg-white border-primary text-primary shadow-lg border-2' 
                      : 'bg-white border-gray-100 text-gray-400 hover:border-gray-200 hover:text-gray-600'}`}
                >
                  {city}
                </button>
              ))}
            </div>
          </div>

          <div className="relative group/property-slider">
            <div 
              ref={propertyGridRef}
              className="flex gap-4 overflow-x-auto no-scrollbar scroll-smooth pb-6 snap-x snap-mandatory"
            >
              {[
                { name: `${activePropertyCity || ''} Student Living`, price: '12', rating: '5.0(8)', img: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&q=80', badge: 'Verified Listing' },
                { name: `Premium Rooms ${activePropertyCity || ''}`, price: '15', rating: '5.0(3)', img: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&q=80', badge: 'Save up to 10%' },
                { name: `Luxury Studio ${activePropertyCity || ''}`, price: '20', rating: '5.0(8)', img: 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?w=600&q=80', badge: '' },
                { name: `SafeStay ${activePropertyCity || ''}`, price: '18', rating: '4.9(10)', img: 'https://images.unsplash.com/photo-1554995207-c18c20360a59?w=600&q=80', badge: 'New Opening' },
                { name: `University Hub ${activePropertyCity || ''}`, price: '11', rating: '4.6(13)', img: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=600&q=80', badge: 'Close to Metro' },
                { name: `The Annex ${activePropertyCity || ''}`, price: '14', rating: '4.9(7)', img: 'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=800&q=80', badge: '' },
                { name: `Skyview Suites ${activePropertyCity || ''}`, price: '25', rating: '5.0(1)', img: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80', badge: 'Highly Rated' },
              ].map((p, i) => (
                <PropertyCard 
                  key={i} 
                  property={p} 
                  i={i} 
                  activePropertyCity={activePropertyCity} 
                  activePropertyRegion={activePropertyRegion} 
                  navigate={navigate} 
                />
              ))}
            </div>

            {/* Left Blur & Arrow */}
            <AnimatePresence>
              {canScrollLeftProperties && (
                <motion.div 
                  initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}
                  className="absolute left-0 top-0 h-[calc(100%-1.5rem)] w-32 bg-gradient-to-r from-[#fbfcff] via-[#fbfcff]/80 to-transparent z-20 pointer-events-none flex items-center justify-start"
                >
                  <button 
                    onClick={() => propertyGridRef.current?.scrollBy({ left: -320, behavior: 'smooth' })}
                    className="ml-2 w-10 h-10 bg-white rounded-xl shadow-xl flex items-center justify-center text-dark border border-gray-100 hover:text-primary transition-all pointer-events-auto hover:scale-110 active:scale-95"
                  >
                    <ChevronRight className="rotate-180" size={20} />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Right Blur & Arrow */}
            <AnimatePresence>
              {canScrollRightProperties && (
                <motion.div 
                  initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}
                  className="absolute right-0 top-0 h-[calc(100%-1.5rem)] w-32 bg-gradient-to-l from-[#fbfcff] via-[#fbfcff]/80 to-transparent z-20 pointer-events-none flex items-center justify-end"
                >
                  <button 
                    onClick={() => propertyGridRef.current?.scrollBy({ left: 320, behavior: 'smooth' })}
                    className="mr-2 w-10 h-10 bg-white rounded-xl shadow-xl flex items-center justify-center text-dark border border-gray-100 hover:text-primary transition-all pointer-events-auto hover:scale-110 active:scale-95"
                  >
                    <ChevronRight size={20} />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* ══ TESTIMONIALS ══ */}
      <section className="bg-[#E7F9EF] py-16">
        <div className="max-w-[90%] mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
            <h2 className="text-2xl font-black text-dark tracking-tight">Trust of 1 Million+ students</h2>
            <div className="flex items-center gap-2 bg-[#00b67a] text-white px-3 py-1.5 rounded-md text-xs font-black self-start md:self-auto shadow-lg shadow-green-200">
              <Star size={14} className="fill-white" />
              <span>Trustpilot</span>
              <span className="ml-2 font-bold opacity-80">9.4K reviews</span>
            </div>
          </div>

          <div className="relative group/testimonials">
            <div 
              ref={testimonialScrollRef}
              className="flex gap-4 overflow-x-auto no-scrollbar pb-6 scroll-smooth snap-x snap-mandatory"
            >
              {[
                { name: "rhea ganta", text: "They makes us understand and explain every procedure which makes the booking procedure easy and smooth for us.", university: "University Of Aberdeen", flag: "🇮🇳" },
                { name: "Aravind", text: "The agent assigned was friendly and responded to my queries quickly, even after working hours. I would genuinely recomme...", university: "University of Sheffield", flag: "🇮🇳" },
                { name: "Ujjash Sharma", text: "Great overall experience I was helped with every problem I faced along the way by the extremely commendable staff.", university: "Leeds Beckett University", flag: "🇮🇳" },
                { name: "Simran kaur", text: "Ample of choice and smooth paper work. nHassle free accomodation with all up to date amenities", university: "Plymouth", flag: "🇮🇳" },
                { name: "Rahul", text: "They called me regularly and updated on the available properties keeping in mind about my priorities and demands.", university: "Tu Dublin Grangegorman", flag: "🇮🇳" }
              ].map((t, i) => (
                <motion.div 
                  key={i} 
                  whileHover={{ y: -5 }} 
                  className="min-w-[280px] md:min-w-[320px] bg-white rounded-md p-6 shadow-sm border border-green-50/50 flex flex-col gap-4 snap-start"
                >
                  <p className="text-sm text-dark font-medium leading-relaxed line-clamp-4">"{t.text}"</p>
                  <div className="mt-auto flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center overflow-hidden border border-gray-100 shadow-inner group">
                      <img src="https://i.ibb.co/r2DrjDTv/photo-1597058712635-3182d1eacc1e-w-500-auto-format-fit-crop-q-60-ixlib-rb-4-1.jpg" alt="Student Profile" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    </div>
                    <div>
                      <h4 className="text-[13px] font-black text-dark leading-tight">{t.name}</h4>
                      <p className="text-[11px] text-gray-400 font-bold">{t.university}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Left Blur & Arrow */}
            <AnimatePresence>
              {canScrollLeftTestimonials && (
                <motion.div 
                  initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}
                  className="absolute left-0 top-0 h-[calc(100%-1.5rem)] w-32 bg-gradient-to-r from-[#E7F9EF] via-[#E7F9EF]/80 to-transparent z-20 pointer-events-none flex items-center justify-start"
                >
                  <button 
                    onClick={() => testimonialScrollRef.current?.scrollBy({ left: -340, behavior: 'smooth' })}
                    className="ml-2 w-10 h-10 bg-white rounded-full shadow-xl flex items-center justify-center text-dark border border-gray-100 hover:text-primary transition-all pointer-events-auto hover:scale-110 active:scale-95"
                  >
                    <ChevronRight className="rotate-180" size={20} />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Right Blur & Arrow */}
            <AnimatePresence>
              {canScrollRightTestimonials && (
                <motion.div 
                  initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}
                  className="absolute right-0 top-0 h-[calc(100%-1.5rem)] w-32 bg-gradient-to-l from-[#E7F9EF] via-[#E7F9EF]/80 to-transparent z-20 pointer-events-none flex items-center justify-end"
                >
                  <button 
                    onClick={() => testimonialScrollRef.current?.scrollBy({ left: 340, behavior: 'smooth' })}
                    className="mr-2 w-10 h-10 bg-white rounded-full shadow-xl flex items-center justify-center text-dark border border-gray-100 hover:text-primary transition-all pointer-events-auto hover:scale-110 active:scale-95"
                  >
                    <ChevronRight size={20} />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* ══ VALUE PROPS ══ */}
      <section className="bg-white py-20 border-b border-gray-50">
        <div className="max-w-[90%] mx-auto px-4">
          <div className="mb-14">
            <h2 className="text-3xl font-black text-dark mb-3 tracking-tight">Book Your Perfect Accommodation</h2>
            <p className="text-gray-500 text-lg font-medium">Take the hassle out of securing your student home for the best years of your life</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
            {[
              { icon: RiHandHeartLine, title: 'Instant & Easy Bookings', desc: 'Time is money. Save both when you book with us.', color: 'text-[#FF4D7A]', bg: 'bg-[#FFF0F4]' },
              { icon: DollarSign, title: 'Lowest Price Guarantee', desc: 'Find a lower price and we\'ll match it. No questions asked.', color: 'text-secondary', bg: 'bg-[#F0F7FF]', link: 'Learn More' },
              { icon: Headset, title: '24x7 Assistance', desc: 'If you have a doubt or a query, we\'re always a call away.', color: 'text-primary', bg: 'bg-[#FFF0F4]' },
              { icon: BadgeCheck, title: '100% Verified Listings', desc: 'We promise to deliver what you see on the website.', color: 'text-green-500', bg: 'bg-[#E7F9EF]' },
            ].map((item, i) => (
              <Reveal key={item.title} delay={i * 0.1}>
                <div className="group cursor-default">
                  <div className={`w-14 h-14 ${item.bg} rounded-2xl flex items-center justify-center ${item.color} mb-6 transition-transform duration-500 group-hover:scale-110 shadow-lg shadow-gray-100`}>
                    <item.icon size={28} />
                  </div>
                  <h3 className="font-black text-dark text-lg mb-2 tracking-tight">{item.title}</h3>
                  <p className="text-gray-500 text-sm font-medium leading-relaxed">
                    {item.desc} {item.link && <span className="text-primary cursor-pointer hover:underline underline-offset-4 ml-1">{item.link}</span>}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══ REFERRALS AND OFFERS ══ */}
      <section className="bg-[#fbfcff] py-20 overflow-hidden border-b border-gray-50">
        <div className="max-w-[90%] mx-auto px-4">
          <Reveal>
            <div className="mb-14">
              <h2 className="text-3xl font-black text-dark mb-3 tracking-tight">Amber Referral Program And Offers</h2>
              <p className="text-gray-500 text-lg font-medium opacity-80">Several promotions, deals and special offers crafted just for you.</p>
            </div>
          </Reveal>

          <div className="relative group">
            <div 
              ref={offerScrollRef}
              className="flex gap-6 overflow-x-auto no-scrollbar pb-8 scroll-smooth"
            >
              {[
                { title: 'Refer a friend, and you both get £50', desc: 'Turn connections into rewards. Get credited after successful booking.', btn: 'Refer Now', bg: 'from-[#FFF1E5] to-[#FFE8D1]', img: 'https://i.ibb.co/vx2bS6Mh/premium-photo-1661698954626-27f5fcfa50dd-w-500-auto-format-fit-crop-q-60-ixlib-rb-4-1.jpg' },
                { title: 'Amberscholar 2025 Edition is Here!', desc: 'Win upto $12,000 & study in the UK, USA, Canada, or Ireland.', btn: 'Apply Now', bg: 'from-[#FFEBFA] to-[#FDE1F7]', img: 'https://i.ibb.co/S7X85KHk/photo-1748379409992-9bd3d911ced5-w-500-auto-format-fit-crop-q-60-ixlib-rb-4-1.jpg' },
                { title: 'Save up to £300 with amber+', desc: 'Get exclusive discounts from 150+ trusted partners.', btn: 'Claim Now', bg: 'from-[#EBF5FF] to-[#DBEEFF]', img: 'https://i.ibb.co/S7X85KHk/photo-1748379409992-9bd3d911ced5-w-500-auto-format-fit-crop-q-60-ixlib-rb-4-1.jpg' },
                { title: 'Get additional £20 on booking!', desc: 'Book your student accommodation through the app to avail this offer!', btn: 'Avail Now', bg: 'from-[#F2EFFF] to-[#E8E4FF]', img: 'https://i.ibb.co/qLn30Xvp/photo-1527565290982-018bcfdbee74-w-500-auto-format-fit-crop-q-60-ixlib-rb-4-1.jpg' },
              ].map((offer, i) => (
                <Reveal key={i} delay={i * 0.1}>
                  <motion.div 
                    whileHover={{ y: -8 }}
                    className={`relative min-w-[290px] sm:min-w-[320px] md:min-w-[480px] h-[200px] md:h-[240px] bg-gradient-to-br ${offer.bg} rounded-[1.5rem] sm:rounded-[2rem] flex overflow-hidden shadow-sm border border-white group`}
                  >
                    <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-black/20 to-transparent scale-150 rotate-12" />
                    <div className="relative z-10 flex flex-col justify-between p-8 w-[60%] h-full text-left">
                      <div>
                        <h3 className="text-xl md:text-2xl font-black text-dark tracking-tight leading-tight mb-3 line-clamp-2">{offer.title}</h3>
                        <p className="text-[13px] font-bold text-gray-500 leading-relaxed line-clamp-2">{offer.desc}</p>
                      </div>
                      <button className="bg-primary hover:bg-primary/90 text-white px-6 py-2.5 rounded-xl font-black text-nowrap text-xs md:text-sm w-fit shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all">
                        {offer.btn}
                      </button>
                    </div>
                    <div className="absolute right-0 top-0 w-[40%] h-full">
                      <div className="relative h-full w-full overflow-hidden">
                        <img src={offer.img} alt={offer.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                      </div>
                    </div>
                  </motion.div>
                </Reveal> 
              ))}
            </div>

            {/* Navigation Arrows */}
            <AnimatePresence>
              {canScrollLeftOffers && (
                <motion.div 
                  initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}
                  className="absolute -left-4 top-1/2 -translate-y-1/2 h-full w-24 bg-gradient-to-r from-white/90 to-transparent z-20 pointer-events-none flex items-center justify-start pl-4"
                >
                  <button 
                    onClick={() => offerScrollRef.current?.scrollBy({ left: -400, behavior: 'smooth' })}
                    className="w-10 h-10 bg-white rounded-full shadow-2xl flex items-center justify-center text-dark border border-gray-100 hover:text-primary transition-all pointer-events-auto hover:scale-110 active:scale-95"
                  >
                    <ChevronDown className="rotate-90" size={20} />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="absolute -right-4 top-1/2 -translate-y-1/2 h-full w-24 bg-gradient-to-l from-white/90 to-transparent z-20 pointer-events-none flex items-center justify-end pr-4 opacity-100">
              <button 
                onClick={() => offerScrollRef.current?.scrollBy({ left: 400, behavior: 'smooth' })}
                className="w-10 h-10 bg-white rounded-full shadow-2xl flex items-center justify-center text-dark border border-gray-100 hover:text-primary transition-all pointer-events-auto hover:scale-110 active:scale-95"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ══ 3 EASY STEPS ══ */}
      <section className="bg-[#f8faff] py-24 border-b border-gray-50">
        <div className="max-w-[90%] mx-auto px-4">
          <Reveal>
            <div className="mb-20">
              <h2 className="text-3xl font-black text-dark mb-3 tracking-tight">Book Your Place In 3 Easy Steps</h2>
              <p className="text-gray-400 text-lg font-medium">Book places in major cities and universities across the globe</p>
            </div>
          </Reveal>

          <div className="flex flex-col md:flex-row items-center justify-between gap-12 md:gap-0">
            {[
              { id: '1', icon: MousePointer2, title: 'Discover and Finalise', desc: 'Choose from a plethora of verified student home listings' },
              { id: '2', icon: FileText, title: 'Get your paperwork done', desc: "Paperwork's on us, no need to fuss." },
              { id: '3', icon: BadgeCheck, title: 'Accommodation Booked!', desc: 'Relax, pack your bags, and unravel a new life chapter!' }
            ].map((step, i) => (
              <React.Fragment key={step.id}>
                <Reveal delay={i * 0.1} className="relative w-full md:w-[30%]">
                  {/* Number Badge */}
                  <div className="absolute top-1/2 -left-6 -translate-y-1/2 w-12 h-12 bg-white rounded-full flex items-center justify-center text-lg font-black text-dark shadow-[0_10px_30px_rgba(0,0,0,0.1)] z-20 border border-gray-50">
                    {step.id}
                  </div>

                  {/* Step Card */}
                  <div className="bg-white rounded-[2.5rem] border border-gray-100 p-10 pl-14 shadow-sm hover:shadow-xl transition-all duration-500 min-h-[220px] flex flex-col justify-center">
                    <div className="mb-6 w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-primary/80">
                      <step.icon size={30} />
                    </div>
                    <h3 className="text-xl font-black text-dark mb-3 tracking-tight">{step.title}</h3>
                    <p className="text-sm text-gray-400 font-bold leading-relaxed">{step.desc}</p>
                  </div>
                </Reveal>

                {/* Dashed Arrow */}
                {i < 2 && (
                  <div className="hidden md:flex flex-1 items-center justify-center px-4">
                    <div className="flex items-center gap-1.5 opacity-20">
                      {[...Array(6)].map((_, j) => (
                        <div key={j} className="w-2 h-[2.5px] bg-dark rounded-full" />
                      ))}
                      <ChevronRight size={22} className="text-dark ml-1" />
                    </div>
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>

      {/* ══ BEST PARTNERS & LISTING ══ */}
      {Marquee && (
        <section className="bg-white py-20">
          <div className="max-w-[90%] mx-auto px-4">
            <Reveal>
              <h2 className="text-2xl font-black text-dark mb-10 tracking-tight">We Have The Best Partners</h2>
            </Reveal>
            
              <div className="mb-20 overflow-hidden">
                <Marquee speed={40} gradient={true} gradientWidth={100} autoFill={true} pauseOnHover={true} className="py-10 no-scrollbar overflow-hidden">
                  {[
                    'https://i.ibb.co/ksZgm930/lc-uni.png',
                    'https://i.ibb.co/f3cJwzh/law-uni.png',
                    'https://i.ibb.co/8DHFTxx7/into-uni.png',
                    'https://i.ibb.co/mFqCgwTw/westminster-uni.png',
                    'https://i.ibb.co/5W7qWSdb/torrens-uni.png',
                    'https://i.ibb.co/5xs6NH7y/jamescook-uni.png',
                    'https://i.ibb.co/gFJmQkND/bimm-uni.png',
                    'https://i.ibb.co/1fSGpVrp/ue-uni.png',
                    'https://i.ibb.co/ymfr5Z56/schiller-uni.png',
                    'https://i.ibb.co/Y7mB46sH/medicine-uni.png'
                  ].map((logo, i) => (
                    <img key={i} src={logo} alt="Partner" className="h-12 mx-14 transition-all cursor-pointer hover:scale-110 object-contain" />
                  ))}
                </Marquee>
              </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Reveal delay={0.1}>
                <div className="relative h-[240px] rounded-[2rem] bg-gradient-to-r from-[#D7EBFF] to-[#EBF5FF] overflow-hidden flex items-center p-10 group">
                  <div className="relative z-10 max-w-[60%]">
                    <h3 className="text-2xl font-black text-dark mb-3">Partner With Us</h3>
                    <p className="text-sm font-medium text-gray-500 mb-6">At amber, we offer seamless booking <br /> process and a robust sales support.</p>
                    <button className="bg-white text-dark px-6 py-2.5 rounded-xl font-bold text-nowrap text-xs md:text-sm shadow-sm hover:scale-105 active:scale-95 transition-all">Partner With Us</button>
                  </div>
                  <img src="https://i.ibb.co/PGcvmdN4/premium-photo-1722945742888-b8e43241d8b0-w-500-auto-format-fit-crop-q-60-ixlib-rb-4-1.jpg" alt="Handshake" className="absolute right-0 top-0 h-full w-[45%] object-cover mix-blend-multiply opacity-80 group-hover:scale-110 transition-transform duration-1000" />
                </div>
              </Reveal>

              <Reveal delay={0.2}>
                <div className="relative h-[240px] rounded-[2rem] bg-gradient-to-r from-[#D7EBFF] to-[#EBF5FF] overflow-hidden flex items-center p-10 group">
                  <div className="relative z-10 max-w-[60%]">
                    <h3 className="text-2xl font-black text-dark mb-3">List With Us</h3>
                    <p className="text-sm font-medium text-gray-500 mb-6">List your properties efficiently with amber.</p>
                    <button className="bg-white text-dark px-6 py-2.5 rounded-xl font-bold text-nowrap text-xs md:text-sm shadow-sm hover:scale-105 active:scale-95 transition-all">List Properties</button>
                  </div>
                  <img src="https://i.ibb.co/8L0gMpd5/premium-photo-1726863173328-9437d391141a-w-500-auto-format-fit-crop-q-60-ixlib-rb-4-1.jpg" alt="Key" className="absolute right-0 top-0 h-full w-[45%] object-cover mix-blend-multiply opacity-80 group-hover:scale-110 transition-transform duration-1000" />
                </div>
              </Reveal>
            </div>
          </div>
        </section>
      )}

      {/* ══ FEATURED IN ══ */}
      {Marquee && (
        <section className="bg-white py-20 border-t border-gray-50">
          <div className="max-w-[90%] mx-auto px-4">
            <Reveal>
              <h2 className="text-2xl font-black text-dark mb-10 tracking-tight">Featured In</h2>
            </Reveal>
            <Marquee speed={30} direction="left" gradient={true} gradientWidth={100} autoFill={true} pauseOnHover={true}>
              {[
                'https://i.ibb.co/b5RP1nMc/cnbc.png',
                'https://i.ibb.co/WWWSr8BH/eco-times.png',
                'https://i.ibb.co/20hV8xSC/fin-exp.png',
                'https://i.ibb.co/dsTL0KZg/invezz.png',
                'https://i.ibb.co/0yr7Mxqg/yourstory.png',
                'https://i.ibb.co/wZN5NXZR/outlook-biz.png'
              ].map((logo, i) => (
                <img key={i} src={logo} alt="Featured In" className="h-10 mx-14 transition-all hover:scale-110 object-contain grayscale hover:grayscale-0" />
              ))}
            </Marquee>
          </div>
        </section>
      )}

      {/* ══ HUNDREDS OF CITIES Tag Cloud ══ */}
      <section className="bg-white py-20 border-t border-gray-50">
        <div className="max-w-[90%] mx-auto px-4">
          <Reveal>
            <h2 className="text-2xl font-black text-dark mb-8 tracking-tight">Hundreds Of Cities Around The World</h2>
          </Reveal>
          
          <div className="flex gap-10 border-b border-gray-100 mb-8 overflow-x-auto no-scrollbar">
            {['Cities', 'Countries'].map(tab => (
              <button 
                key={tab} 
                onClick={() => setCityTab(tab)}
                className={`py-3 text-sm font-black transition-all relative whitespace-nowrap
                  ${cityTab === tab ? 'text-primary' : 'text-gray-400 hover:text-gray-600'}`}
              >
                {tab}
                {cityTab === tab && <motion.div layoutId="underline" className="absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-full" />}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap gap-x-8 gap-y-4">
            {(cityTab === 'Cities' ? ALL_CITIES : ALL_COUNTRIES).map((t, i) => (
              <span key={i} className="text-[13px] font-medium text-gray-400 hover:text-primary transition-colors cursor-pointer whitespace-nowrap">{t}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ══ NEED HELP SECTION ══ */}
      <section className="bg-white py-24 border-t border-gray-50">
        <div className="max-w-[90%] mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-12">
          <Reveal className="flex-1">
            <h2 className="text-2xl font-black text-dark mb-2 tracking-tight">Need help? Let's connect</h2>
            <p className="text-gray-400 text-lg font-medium">If you have any queries, feel free to contact us</p>
          </Reveal>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full md:w-auto">
            {[
              { icon: MessageSquare, title: 'Live Chat', badge: '2 Mins Reply', border: 'border-pink-100', text: 'text-pink-500', badge_bg: 'bg-pink-500' },
              { icon: MessageCircle, title: 'Chat on Whatsapp', badge: '2 Mins Reply', border: 'border-green-100', text: 'text-green-500', badge_bg: 'bg-green-500' },
              { icon: Mail, title: 'Email Us', color: 'text-orange-400' },
              { icon: Phone, title: '+91 8035735724', color: 'text-blue-400' }
            ].map((help, i) => (
              <div key={i} className={`relative bg-white border ${help.border || 'border-gray-100'} p-4 sm:p-6 rounded-2xl flex flex-col items-center justify-center text-center gap-2 sm:gap-3 shadow-sm hover:shadow-xl transition-all cursor-pointer group min-w-0 w-full`}>
                {help.badge && (
                  <div className={`absolute -top-3 left-1/2 -translate-x-1/2 ${help.badge_bg} px-3 py-1 rounded-full text-[9px] font-black text-white shadow-lg whitespace-nowrap flex items-center gap-1.5`}>
                     <div className="w-1 h-1 bg-white rounded-full animate-ping" />
                     {help.badge}
                  </div>
                )}
                <help.icon size={28} className={help.text || help.color || "text-dark"} />
                <span className="text-[13px] font-black text-dark">{help.title}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ COMPREHENSIVE FOOTER ══ */}
      <Footer />

      {/* ══ APP DOWNLOAD MODAL ══ */}
      <AnimatePresence>
        {showAppModal && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.8, x: -50, y: 100 }} animate={{ opacity: 1, scale: 1, x: 0, y: 0 }} exit={{ opacity: 0, scale: 0.8, y: 100 }}
            className="fixed bottom-4 sm:bottom-8 left-4 sm:left-8 z-[200] w-[calc(100%-2rem)] sm:w-[280px] bg-[#EBF5FF] rounded-[2rem] sm:rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.2)] border border-white overflow-hidden group"
          >
            {/* Close Button */}
            <button 
              onClick={() => {
                setShowAppModal(false);
                localStorage.setItem('appModalClosed', 'true');
              }}
              className="absolute top-2 right-2 w-8 h-8 bg-gray-500/80 hover:bg-gray-600 text-white rounded-full flex items-center justify-center z-20 shadow-lg transition-colors border-2 border-white/50"
            >
              <X size={16} />
            </button>

            <div className="p-6 pb-2 text-center">
              <h4 className="text-dark font-black text-lg mb-4 tracking-tight leading-tight">£20 cashback on the app!</h4>
              
              <div className="bg-white p-4 rounded-[2rem] shadow-inner mb-4 inline-block">
                <img 
                  src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://amberstudent.com/download-app" 
                  alt="QR Code" 
                  className="w-32 h-32 object-contain"
                />
              </div>

              <p className="text-dark font-bold text-xs mb-3 opacity-80 uppercase tracking-widest">Scan to Download App</p>
              
              <div className="flex items-center justify-center gap-1.5 mb-6">
                <div className="flex text-yellow-400">
                  <Star size={14} fill="currentColor" />
                </div>
                <span className="text-dark font-black text-sm">4.5/5</span>
                <span className="text-gray-400 text-xs font-bold pl-1 border-l border-gray-300 ml-1">180K+ Downloads</span>
              </div>
            </div>

            {/* Footer */}
            <div className="bg-white px-6 py-4 flex items-center justify-between border-t border-blue-100">
              <span className="text-dark font-black text-xs leading-tight">Download from</span>
              <div className="flex gap-3">
                <div className="w-9 h-9 rounded-xl bg-black text-white flex items-center justify-center hover:scale-110 transition-transform cursor-pointer shadow-sm">
                  <FaApple size={20} />
                </div>
                <div className="w-9 h-9 rounded-xl bg-gray-100 text-dark flex items-center justify-center hover:scale-110 transition-transform cursor-pointer shadow-sm">
                  <FaGooglePlay size={18} className="text-[#3DDC84]" />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
