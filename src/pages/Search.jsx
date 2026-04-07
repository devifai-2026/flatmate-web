import { useState, useEffect, useCallback, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, Users, Building2, LayoutGrid, MapPin, Plus, SearchX, Filter, X, 
  Loader2, Sparkles, ArrowUpDown, UserPlus, Search as SearchIcon,
  ChevronRight, Heart, Bus, Footprints, Clock, Info, ShieldCheck, Zap,
  CheckCircle2, Star, ChevronDown, List, Grid3X3, Calendar as CalendarIcon, ChevronLeft,
  CalendarDays, Globe, Smile, MoveRight, ParkingSquare, CarFront
} from 'lucide-react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

import MainLayout from '../layouts/MainLayout';
import Sidebar from '../components/layout/Sidebar';
import { CardSkeleton } from '../components/ui/Skeleton';
import EmptyState from '../components/ui/EmptyState';
import Button from '../components/ui/Button';
import { fetchRooms, clearRooms } from '../redux/slices/roomSlice';
import api from '../services/api';
import { getRoomImage } from '../utils/constants';
import { HiOutlineSlash } from "react-icons/hi2";
import Footer from '../components/layout/Footer';

// ── Dropdown Components ──

function FilterModal({ onClose, resultsCount }) {
  const categories = [ { id: 'University', label: 'University', selected: true }, { id: 'Locality', label: 'Locality' }, { id: 'Budget', label: 'Budget', selected: true }, { id: 'Move in Month', label: 'Move in Month' }, { id: 'Stay Duration', label: 'Stay Duration' }, { id: 'Room Type', label: 'Room Type' }, { id: 'Guarantor', label: 'Guarantor' }, { id: 'Availability', label: 'Availability' }, { id: 'Dual Occupancy', label: 'Dual Occupancy' }, { id: 'Property Type', label: 'Property Type' }, { id: 'Distance from City', label: 'Distance from City' } ];
  const [activeCat, setActiveCat] = useState('University');
  const universities = [ 'Academic Bridge', 'Alpha College of English', 'American College', 'American College Dublin', 'Atlantic Language School', 'Atlas Language School', 'Baldoyle Training Centre', 'Ballyfermot College of Further Education', 'BIMM, Dublin', 'CCT College Dublin' ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[1000] flex items-center justify-center bg-dark/60 backdrop-blur-sm p-4" onClick={onClose}>
      <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-white w-full max-w-[800px] h-[600px] rounded-[2rem] shadow-2xl overflow-hidden flex flex-col" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center px-10 py-5 border-b border-gray-50 shrink-0"><h2 className="text-xl font-black text-dark tracking-tight">Filter</h2><button onClick={onClose} className="p-2 hover:bg-gray-50 rounded-full transition-colors"><X size={24} className="text-gray-400" /></button></div>
        <div className="flex-1 flex overflow-hidden">
          <div className="w-[200px] border-r border-gray-50 flex flex-col overflow-y-auto no-scrollbar py-3 shrink-0">{categories.map((cat) => (<button key={cat.id} onClick={() => setActiveCat(cat.id)} className={`w-full text-left px-8 py-3 text-[13px] font-bold transition-all relative flex items-center justify-between ${activeCat === cat.id ? 'text-primary bg-gray-50/50' : 'text-gray-500 hover:text-dark hover:bg-gray-50/30'}`}>{cat.label}{cat.selected && <ChevronRight size={14} className="text-primary" />}</button>))}<div className="mt-auto px-8 py-4"><button className="text-[13px] font-black text-primary hover:underline">Clear All</button></div></div>
          <div className="flex-1 flex flex-col px-10 py-6 overflow-hidden"><h3 className="text-lg font-black text-dark tracking-tight mb-4 shrink-0">{activeCat}</h3><div className="relative mb-5 shrink-0"><SearchIcon size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" /><input placeholder={`Search ${activeCat}`} className="w-full bg-gray-50 border-none rounded-full py-3.5 pl-14 pr-6 text-sm font-medium focus:ring-2 focus:ring-primary/10 outline-none" /></div><div className="flex-1 overflow-y-auto space-y-5 custom-scrollbar pr-2">{universities.map(u => (<div key={u} className="flex items-center gap-4 group cursor-pointer py-0.5"><input type="checkbox" className="w-5 h-5 accent-primary rounded-md cursor-pointer border-gray-200" /><span className="text-[15px] font-bold text-gray-500 group-hover:text-dark transition-colors">{u}</span></div>))}</div></div>
        </div>
        <div className="px-10 py-5 border-t border-gray-50 shrink-0 bg-white flex justify-end"><button onClick={onClose} className="px-10 py-2.5 bg-primary text-white font-black rounded-lg shadow-lg shadow-primary/20 hover:bg-primary/95 transition-all active:scale-[0.98] text-[15px]">Show {resultsCount} results</button></div>
      </motion.div>
    </motion.div>
  );
}

function RoomTypeDropdown({ onClose }) {
  const sections = [ { title: 'Room Type', items: ['Ensuite', 'Non Ensuite', 'Studio', '1B', '2B'] }, { title: 'Accommodation', items: ['Private Room', 'Shared Room'] }, { title: 'Kitchen', items: ['Private Kitchen', 'Shared Kitchen'] }, { title: 'Bathroom', items: ['Private Bathroom', 'Shared Bathroom'] } ];
  return (
    <div className="w-[420px] bg-white border border-gray-100 shadow-2xl rounded-2xl overflow-hidden p-6 max-h-[440px] flex flex-col"><div className="flex justify-between items-center mb-5 shrink-0"><h3 className="text-xl font-black text-dark tracking-tight">Room Type</h3><button className="text-sm font-bold text-gray-300 hover:text-primary transition-colors">Reset</button></div><div className="flex-1 overflow-y-auto space-y-8 custom-scrollbar pr-2 overscroll-contain">{sections.map((section, idx) => (<div key={idx} className="space-y-4"><h4 className="text-[17px] font-black text-dark tracking-tight">{section.title}</h4><div className="space-y-3.5">{section.items.map(item => (<div key={item} className="flex items-center justify-between group cursor-pointer"><div className="flex items-center gap-3"><input type="checkbox" className="w-5 h-5 accent-primary rounded-md cursor-pointer border-gray-100" /><span className="text-[15px] font-bold text-gray-500 group-hover:text-dark transition-colors">{item}</span></div><Info size={16} className="text-gray-300 hover:text-primary transition-colors cursor-help" /></div>))}</div>{section.title === 'Room Type' && (<button className="text-primary font-black text-sm flex items-center gap-2 hover:underline pt-1">View More Rooms <ChevronDown size={14} /></button>)}</div>))}</div></div>
  );
}

function UniversityDropdown({ onClose }) {
  const universities = [ 'Academic Bridge', 'Alpha College of English', 'American College', 'American College Dublin', 'Atlantic Language School', 'Atlas Language School', 'Baldoyle Training Centre' ];
  return (
    <div className="w-[380px] bg-white border border-gray-100 shadow-2xl rounded-2xl overflow-hidden p-5"><div className="flex justify-between items-center mb-6"><h3 className="text-lg font-black text-dark tracking-tight">University</h3><button onClick={onClose} className="text-sm font-bold text-gray-300 hover:text-primary transition-colors">Reset</button></div><div className="relative mb-6"><SearchIcon size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" /><input placeholder="Search University" className="w-full bg-gray-50/50 border border-gray-100 rounded-full py-3.5 pl-12 pr-6 text-sm font-medium focus:ring-2 focus:ring-primary/20 outline-none transition-all" /></div><div className="max-h-[300px] overflow-y-auto space-y-1 pr-1 custom-scrollbar">{universities.map(u => (<button key={u} className="w-full text-left px-4 py-3.5 text-[15px] font-medium text-gray-600 hover:bg-gray-50 rounded-xl transition-colors">{u}</button>))}</div></div>
  );
}

function BudgetDropdown({ onClose }) {
  const [minPrice, setMinPrice] = useState(120); const [maxPrice, setMaxPrice] = useState(429);
  const handleMinChange = (e) => { const value = Math.min(Number(e.target.value), maxPrice - 10); setMinPrice(value); };
  const handleMaxChange = (e) => { const value = Math.max(Number(e.target.value), minPrice + 10); setMaxPrice(value); };
  return (
    <div className="w-[380px] bg-white border border-gray-100 shadow-2xl rounded-2xl overflow-hidden p-5"><div className="flex justify-between items-center mb-8"><h3 className="text-lg font-black text-dark tracking-tight">Budget (per week)</h3><button onClick={() => { setMinPrice(120); setMaxPrice(1000); }} className="text-sm font-bold text-gray-300 hover:text-primary transition-colors">Reset</button></div><div className="px-2 mb-10 relative h-6 flex items-center"><div className="absolute w-full h-1 bg-gray-100 rounded-full" /><div className="absolute h-1 bg-primary rounded-full transition-all duration-300 shadow-sm" style={{ left: `${(minPrice / 1000) * 100}%`, right: `${100 - (maxPrice / 1000) * 100}%` }} /><input type="range" min="0" max="1000" value={minPrice} onChange={handleMinChange} className="absolute w-full appearance-none bg-transparent pointer-events-none z-20 range-thumb-custom" /><input type="range" min="0" max="1000" value={maxPrice} onChange={handleMaxChange} className="absolute w-full appearance-none bg-transparent pointer-events-none z-20 range-thumb-custom" /></div><div className="flex justify-between items-center bg-gray-50/50 p-4 rounded-xl border border-gray-100"><div className="space-y-0.5"><p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Min Price</p><p className="text-lg font-black text-dark tracking-tighter">€{minPrice}</p></div><div className="w-8 h-px bg-gray-200" /><div className="space-y-0.5 text-right"><p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Max Price</p><p className="text-lg font-black text-dark tracking-tighter">€{maxPrice}</p></div></div></div>
  );
}

function MoveInMonthDropdown({ onClose }) {
  const [date, setDate] = useState(new Date());
  return (
    <div className="w-[360px] bg-white border border-gray-100 shadow-2xl rounded-2xl overflow-hidden p-3 overflow-visible"><div className="flex justify-between items-center mb-3 px-2"><h3 className="text-lg font-black text-dark tracking-tight">Move in Month</h3><button onClick={() => setDate(new Date())} className="text-sm font-bold text-gray-300 hover:text-primary transition-colors">Reset</button></div><div className="premium-calendar-container overflow-visible"><Calendar onChange={setDate} value={date} view="year" maxDetail="year" prev2Label={null} next2Label={null} className="w-full border-0 font-sans" /></div></div>
  );
}

function StayDurationDropdown({ onClose }) {
  const options = [ { label: 'All', active: true }, { category: 'Long Stays', items: ['45+ Weeks', '41 - 45 Weeks'] }, { category: 'Mid Stays', items: ['26 - 40 Weeks'] }, { category: 'Short Stays', items: ['5 - 25 Weeks', '0 - 4 Week'] } ];
  return (
    <div className="w-[320px] bg-white border border-gray-100 shadow-2xl rounded-2xl overflow-hidden p-5"><div className="flex justify-between items-center mb-6"><h3 className="text-lg font-black text-dark tracking-tight">Stay Duration</h3><button onClick={onClose} className="text-sm font-bold text-gray-300 hover:text-primary transition-colors">Reset</button></div><div className="space-y-6">{options.map((opt, i) => (<div key={i} className="space-y-4">{opt.category && <h4 className="text-[15px] font-bold text-gray-300 tracking-tight">{opt.category}</h4>}{opt.items ? opt.items.map(item => (<button key={item} className="flex items-center gap-4 w-full group"><div className="w-5 h-5 rounded-full border-2 border-gray-100 group-hover:border-primary/30 flex items-center justify-center shrink-0 transition-all" /><span className="text-[15px] font-bold text-dark/70 tracking-tight transition-colors group-hover:text-dark">{item}</span></button>)) : (<button className="flex items-center gap-4 w-full"><div className="w-5 h-5 rounded-full border-2 border-primary flex items-center justify-center shrink-0"><div className="w-2.5 h-2.5 rounded-full bg-primary" /></div><span className="text-[17px] font-black text-dark tracking-tight">{opt.label}</span></button>)}</div>))}</div></div>
  );
}

// ── UTILITY COMPONENTS ──

function AccommodationForm() {
  return (
    <div className="bg-white rounded-[1.5rem] border border-gray-100 p-10 shadow-sm mt-12 w-full">
      <h2 className="text-3xl font-black text-dark tracking-tight mb-2">Want Accommodation of your choice?</h2>
      <p className="text-gray-400 font-medium mb-10">Connect with an housing expert for free personal assistance.</p>
      <div className="space-y-6">
        <div className="relative group"><input type="text" placeholder="Your Full Name *" className="w-full bg-gray-50 border border-gray-100 group-hover:border-primary/30 rounded-2xl px-6 py-4 text-sm font-medium focus:ring-4 focus:ring-primary/5 outline-none transition-all placeholder:text-gray-400" /></div>
        <div className="relative group"><input type="email" placeholder="Your Email Address *" className="w-full bg-gray-50 border border-gray-100 group-hover:border-primary/30 rounded-2xl px-6 py-4 text-sm font-medium focus:ring-4 focus:ring-primary/5 outline-none transition-all placeholder:text-gray-400" /></div>
        <div className="grid grid-cols-[140px,1fr] gap-4">
           <div className="relative group"><span className="absolute -top-2.5 left-4 px-1.5 bg-white text-[10px] font-bold text-primary z-10">Code *</span><div className="flex items-center w-full bg-gray-50 border border-gray-100 rounded-2xl px-4 py-4"><span className="text-sm font-bold text-dark">+91</span><X size={14} className="ml-auto text-gray-300 cursor-pointer" /></div></div>
           <div className="relative group"><input type="tel" placeholder="Your Mobile Number *" className="w-full bg-gray-50 border border-gray-100 group-hover:border-primary/30 rounded-2xl px-6 py-4 text-sm font-medium focus:ring-4 focus:ring-primary/5 outline-none transition-all placeholder:text-gray-400" /></div>
        </div>
        <p className="text-[12px] text-gray-400 font-medium">I agree with all the <Link className="text-dark font-black underline underline-offset-2">terms</Link> and <Link className="text-dark font-black underline underline-offset-2">privacy</Link> of amberstudent.</p>
        <button className="w-full bg-[#FF1351] text-white font-black py-4 rounded-2xl shadow-xl shadow-primary/20 hover:bg-primary/90 transition-all text-base tracking-tight">Submit</button>
      </div>
    </div>
  );
}

function RecentlyViewed() {
  const items = [
    { title: 'Binary Hub, Dublin', loc: 'Dublin 8, County Dublin, IE', price: '300', img: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=800' },
    { title: 'Arbour House, London', loc: 'London, England, GB', price: '217', offers: 'Save up to £250', img: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&q=80&w=800' },
    { title: 'Moonraker Point, London', loc: 'London, England, GB', price: '272', offers: 'Save up to £250', img: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=800' },
    { title: 'Scape, London', loc: 'London, GB', price: '245', img: 'https://images.unsplash.com/photo-1493666438817-866a91353ca9?auto=format&fit=crop&q=80&w=800' },
    { title: 'Chapter, London', loc: 'London, GB', price: '280', offers: 'Save up to £250', img: 'https://images.unsplash.com/photo-1522770179533-24471fcdba45?auto=format&fit=crop&q=80&w=800' }
  ];
  return (
    <div className="bg-white rounded-[1.5rem] border border-gray-100 p-8 shadow-sm mt-12 w-full">
      <h2 className="text-2xl font-black text-dark tracking-tight mb-8">Recently Viewed</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {items.map((it, idx) => (
          <div key={idx} className="group border border-gray-50 rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-500 bg-white">
            <div className="relative h-32 overflow-hidden shrink-0"><img src={it.img} alt={it.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />{it.offers && <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-md px-2 py-1 rounded-full text-[8.5px] font-black text-primary border border-primary/20">{it.offers}</div>}<button className="absolute top-2 right-2 p-1.5 bg-white rounded-full text-gray-400 hover:text-primary transition-all shadow-md"><Heart size={14} /></button></div>
            <div className="p-3"><h3 className="font-black text-[13px] text-dark tracking-tight truncate leading-none mb-1">{it.title}</h3><p className="text-[11px] text-gray-400 font-medium mb-3 truncate leading-none">{it.loc}</p><div className="flex justify-between items-center mt-auto"><p className="text-[10px] font-bold text-gray-500 leading-none">From <span className="text-dark font-black text-xs">€{it.price}</span></p><div className="flex items-center gap-1 text-emerald-600 font-black text-[10px]"><Star size={10} fill="currentColor" className="text-emerald-500" />4.7</div></div></div>
          </div>
        ))}
      </div>
    </div>
  );
}

function FAQSection({ title, questions }) {
  return (
    <div className="bg-white rounded-[1.5rem] border border-gray-100 p-8 shadow-sm mt-8 w-full">
      <h2 className="text-2xl font-black text-dark tracking-tight mb-8">{title}</h2>
      <div className="divide-y divide-gray-50">{questions.map((q, i) => <div key={i} className="py-6 flex items-center justify-between cursor-pointer group hover:bg-gray-50/30 px-2 rounded-xl transition-colors"><span className="text-[15px] font-bold text-dark tracking-tight group-hover:text-primary transition-colors">{q}</span><ChevronDown size={18} className="text-gray-300 group-hover:text-primary transition-colors" /></div>)}</div>
      <button className="text-primary font-black text-[14px] flex items-center gap-2 mt-6 group pl-2">View All Questions ({questions.length + 2}) <ChevronDown size={16} className="group-hover:translate-y-0.5 transition-transform" /></button>
    </div>
  );
}

function NearbyPlaces() {
  const tabs = ['Cities', 'Localities', 'Universities', 'Properties'];
  const [activeTab, setActiveTab] = useState('Cities');
  const places = ['Student Accommodation in Belfast', 'Student Accommodation in Cork'];
  return (
    <div className="bg-white rounded-[1.5rem] border border-gray-100 p-8 shadow-sm mt-8 w-full mb-20">
      <h2 className="text-2xl font-black text-dark tracking-tight mb-8">Nearby Places</h2>
      <div className="border-b border-gray-100 flex gap-10 mb-10 overflow-x-auto no-scrollbar">{tabs.map(tab => <button key={tab} onClick={() => setActiveTab(tab)} className={`pb-4 text-sm font-black transition-all relative whitespace-nowrap ${activeTab === tab ? 'text-primary' : 'text-gray-400 hover:text-dark'}`}>{tab}{activeTab === tab && <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />}</button>)}</div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-20 gap-y-6">{places.map(p => <Link key={p} className="text-[15px] font-bold text-gray-500 hover:text-primary transition-colors flex items-center gap-2 group"><span className="underline underline-offset-4 decoration-gray-200 group-hover:decoration-primary/30 transition-all">{p}</span></Link>)}</div>
    </div>
  );
}

function GridListingCard({ item }) {
  const images = item.images && item.images.length > 0 ? item.images : [getRoomImage(item._id), getRoomImage(item._id), getRoomImage(item._id)];
  return (
    <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-[1.5rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col group h-full relative">
      <div className="relative aspect-[4/3] overflow-hidden shrink-0">
        <img src={images[0]} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
        <div className="absolute top-3 left-3 bg-white/95 px-2.5 py-1 rounded-full text-[9px] font-black text-primary shadow-sm border border-primary/10">Save up to AU$400</div>
        <button className="absolute top-3 right-3 w-8 h-8 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center text-gray-400 hover:text-primary transition-all shadow-md"><Heart size={16} /></button>
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1"><div className="w-4 h-1.5 rounded-full bg-white shadow-sm" /><div className="w-1.5 h-1.5 rounded-full bg-white/60 shadow-sm" /><div className="w-1.5 h-1.5 rounded-full bg-white/60 shadow-sm" /><div className="w-1.5 h-1.5 rounded-full bg-white/60 shadow-sm" /></div>
        
        {/* Same-to-same Rating Notch (S-CURVE) */}
        <div className="absolute bottom-0 left-0 h-[40px] pointer-events-none translate-y-[1px]">
           <svg width="112" height="40" viewBox="0 0 112 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-sm">
             <path 
               d="M0 40V12C0 5.37258 5.37258 0 12 0H74C84.3411 0 88.6589 0 94.6589 12C94.6589 12 98 20 102 30C106 40 112 40 112 40H0Z" 
               fill="white" 
             />
           </svg>
           <div className="absolute top-0 left-0 h-full flex items-center gap-1.5 px-4 pr-10">
              <Star size={14} className="fill-orange-400 text-orange-400" />
              <span className="text-[13px] font-black text-[#006140] tracking-tight">5.0 (3)</span>
           </div>
        </div>
      </div>
      <div className="p-4 flex flex-col flex-1">
        <h3 className="text-lg font-black text-dark tracking-tight leading-tight mb-1 line-clamp-1">{item.title}</h3>
        <p className="text-[11px] text-gray-400 font-bold mb-3 line-clamp-1">Victoria Ct, North Melbourne, 3051</p>
        <div className="flex items-center gap-2 text-[10px] text-gray-500 font-bold mb-4 overflow-hidden">
          <div className="flex items-center gap-1 shrink-0"><MapPin size={12} className="text-gray-400" /> 1.1 mi fr City...</div>
          <div className="flex items-center gap-1.5 opacity-80 shrink-0">( <Bus size={11} /> 9m · <Building2 size={11} /> 25m )</div>
        </div>
        <div className="flex flex-wrap gap-1.5 mb-4">
           <div className="px-2 py-1 bg-[#EBF2FF] text-[#2563EB] text-[8px] font-black rounded flex items-center gap-1 border border-dashed border-[#2563EB]/40"><Zap size={9} fill="currentColor" /> 5 Offers</div>
           <div className="px-2 py-1 bg-[#FDF2E9] text-[#78350F] text-[8px] font-black rounded flex items-center gap-1"><ShieldCheck size={10} /> No Visa No Pay</div>
           <div className="px-2 py-1 bg-[#F0FDF4] text-[#166534] text-[8px] font-black rounded flex items-center gap-1"><Zap size={9} /> Instant Booking</div>
        </div>
        <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between">
           <div><span className="text-gray-500 text-[10px] font-bold">From </span><span className="text-lg font-black text-dark tracking-tighter">AU$235</span><span className="text-gray-500 text-[10px] font-bold"> / week</span></div>
           <button className="bg-[#FF1351] text-white font-black px-4 py-2 rounded-lg text-xs shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all active:scale-95">Enquire</button>
        </div>
      </div>
    </motion.div>
  );
}

function ListingCard({ item }) {
  const [activeImg, setActiveImg] = useState(0);
  const images = item.images && item.images.length > 0 ? item.images : [getRoomImage(item._id)];
  return (
    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-[1.5rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col md:flex-row group">
      <div className="relative w-full md:w-[260px] lg:w-[300px] h-[220px] md:h-auto overflow-hidden shrink-0"><img src={images[activeImg]} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" /><div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">{images.map((_, i) => <div key={i} className={`w-1.5 h-1.5 rounded-full transition-all ${i === activeImg ? 'bg-white w-4' : 'bg-white/50'}`} />)}</div></div>
      <div className="flex-1 p-6 flex flex-col justify-between overflow-hidden"><div><h3 className="text-xl font-black text-dark leading-tight line-clamp-1">{item.title}</h3><p className="text-[13px] text-gray-400 font-medium mt-1 uppercase tracking-wider truncate mb-4">{item.location || 'Central Delhi'}</p><div className="flex items-center flex-wrap gap-x-4 gap-y-1 text-[12px] text-gray-500 font-medium mb-4 whitespace-nowrap"><div className="flex items-center gap-1.5 shrink-0"><MapPin size={14} className="text-gray-400" /> <span>1.2 mi fr <span className="text-gray-800 font-black">City Cer</span></span></div><div className="flex items-center gap-2 opacity-80 text-gray-400 shrink-0">( <Bus size={13} /> 11m · <Building2 size={13} /> 21m · <Footprints size={13} /> 24m )</div></div><hr className="border-t border-dashed border-gray-200 my-4" />
        <div className="flex flex-wrap gap-2">
          <div className="px-3 py-1.5 bg-[#EBF2FF] text-[#2563EB] text-[9.5px] font-bold rounded-full flex items-center gap-1.5 border border-dashed border-[#2563EB] shrink-0"><div className="bg-[#2563EB] text-white p-0.5 rounded-sm shrink-0"><Zap size={9} fill="currentColor" /></div> {item.offers || '2 Offers'}</div>
          <div className="px-3 py-1.5 bg-[#F0FDF4] text-[#166534] text-[9.5px] font-bold rounded-full flex items-center gap-1.5 border border-[#DCFCE7] shrink-0"><div className="bg-[#166534] text-white p-0.5 rounded-full shrink-0"><Zap size={9} /></div> Instant Booking</div>
          <div className="px-3 py-1.5 bg-[#FDF2E9] text-[#78350F] text-[9.5px] font-bold rounded-full flex items-center gap-1.5 border border-transparent shrink-0"><CalendarDays size={12} className="shrink-0" /> Pay In Instalment</div>
          <div className="px-3 py-1.5 bg-[#FDF2E9] text-[#78350F] text-[9.5px] font-bold rounded-full flex items-center gap-1.5 border border-transparent shrink-0"><ShieldCheck size={12} className="shrink-0" /> No Visa No Pay</div>
          {(item.amenities || ['wifi', 'ac', 'water supply', 'attached bathroom']).slice(0, 4).map((tag, idx) => <span key={idx} className="px-3 py-1.5 bg-white text-gray-600 text-[10px] font-bold rounded-full flex items-center gap-2 border border-gray-200 shrink-0"><LayoutGrid size={13} className="flex-shrink-0" /> {tag.replace(/-/g, ' ')}</span>)}
        </div>
      </div></div>
      <div className="w-full md:w-[170px] px-3 py-5 border-l border-gray-100 flex flex-col justify-between bg-gray-50/5"><div className="flex items-center justify-between"><div className="flex items-center gap-1 text-[#004D40] font-bold text-sm"><Star size={18} className="text-orange-400" fill="currentColor" /><span className="text-[15px]">4.7 (3)</span></div><button className="p-2.5 bg-white border border-gray-200 rounded-full text-gray-400 hover:text-red-500 transition-all shadow-sm hover:shadow-md"><Heart size={20} /></button></div><div className="mt-auto space-y-3"><div className="flex items-baseline gap-1 flex-wrap"><span className="text-[12px] font-bold text-[#1F2937]">From</span><span className="text-base font-black text-[#111827] tracking-tighter">₹{item.rent?.toLocaleString('en-IN')}</span><span className="text-[12px] font-semibold text-[#1F2937]">/ month</span></div><Link to={`/rooms/${item._id}`} className="w-full py-2.5 bg-[#FF1351] text-white font-bold text-center text-[15px] rounded-[0.4rem] shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all flex items-center justify-center h-[32px]">Enquire</Link></div></div>
    </motion.div>
  );
}

function FilterChip({ label, icon: Icon, active, dropdown, onClick }) {
  return (
    <button onClick={onClick} className={`flex items-center gap-2 px-4 py-1.5 rounded-2xl text-[13px] font-semibold transition-all border whitespace-nowrap ${active ? 'bg-primary border-primary text-white shadow-sm' : 'bg-white border-gray-300 text-gray-600 hover:border-gray-400 hover:bg-gray-50'}`}>{Icon && <Icon size={14} className={`shrink-0 ${active ? 'text-white' : 'text-gray-500'}`} />}{label}{dropdown && <ChevronDown size={14} className={`opacity-60 ml-0.5 shrink-0 transition-transform duration-300 ${active ? 'rotate-180' : ''}`} />}</button>
  );
}

export default function Search() {
  const [searchParams] = useSearchParams(); const dispatch = useDispatch(); const locationParam = searchParams.get('location') || 'Delhi'; const [viewMode, setViewMode] = useState('list'); const [activeDropdown, setActiveDropdown] = useState(null); const [dropdownPos, setDropdownPos] = useState(0); const [isFilterModalOpen, setIsFilterModalOpen] = useState(false); const [selectedSort, setSelectedSort] = useState('Recommended'); const dropdownRef = useRef(null); const { list: rooms, loading: roomsLoading } = useSelector((s) => s.rooms);
  useEffect(() => { dispatch(clearRooms()); dispatch(fetchRooms({ location: locationParam, page: 1 })); }, [locationParam, dispatch]);
  useEffect(() => { function handleClickOutside(e) { if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setActiveDropdown(null); } document.addEventListener('mousedown', handleClickOutside); return () => document.removeEventListener('mousedown', handleClickOutside); }, []);
  const handleChipClick = (e, label) => { if (label === 'Filters') { setIsFilterModalOpen(true); return; } if (activeDropdown === label) setActiveDropdown(null); else { const rect = e.currentTarget.getBoundingClientRect(); const parentRect = e.currentTarget.closest('.max-w-\\[95\\%\\]').getBoundingClientRect(); setDropdownPos(rect.left - parentRect.left); setActiveDropdown(label); } };
  const sortOptions = ['Recommended', 'Nearest', 'Price (Low to High)', 'Price (High to Low)', 'Newly Added'];
  const filterConfigs = [ { label: 'Sort', icon: List, dropdown: true, onClick: (e) => handleChipClick(e, 'Sort') }, { label: 'University', dropdown: true, onClick: (e) => handleChipClick(e, 'University') }, { label: 'Locality', dropdown: true, onClick: (e) => handleChipClick(e, 'Locality') }, { label: 'Budget', dropdown: true, onClick: (e) => handleChipClick(e, 'Budget') }, { label: 'Move in Month', dropdown: true, onClick: (e) => handleChipClick(e, 'Move in Month') }, { label: 'Stay Duration', dropdown: true, onClick: (e) => handleChipClick(e, 'Stay Duration') }, { label: 'Room Type', dropdown: true, onClick: (e) => handleChipClick(e, 'Room Type') }, { label: 'Filters', icon: Filter, active: true, onClick: (e) => handleChipClick(e, 'Filters') } ];
  const mapUrl = `https://www.google.com/maps?q=${encodeURIComponent(locationParam + ' University Accommodations')}&output=embed&z=13`;

  return (
    <MainLayout>
      <style>{`
        .range-thumb-custom::-webkit-slider-thumb { appearance: none; width: 24px; height: 24px; background: #fff; border: 2px solid #FF1351; border-radius: 50%; cursor: pointer; box-shadow: 0 4px 10px rgba(255, 19, 81, 0.2); }
        .premium-calendar-container .react-calendar { background: transparent; font-family: inherit; width: 100% !important; border: none !important; }
        .premium-calendar-container .react-calendar__tile--active { background: #FF1351 !important; color: white !important; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e5e7eb; border-radius: 10px; }
      `}</style>
      <div className="sticky top-20 z-[100] bg-white border-b border-gray-100 py-3 shadow-sm overflow-visible"><div className="max-w-[95%] mx-auto pl-2 pr-4 flex items-center gap-1 relative overflow-visible"><div className="flex items-center gap-1 overflow-x-auto no-scrollbar flex-1 pr-6 overscroll-contain">{filterConfigs.map((f, i) => <FilterChip key={i} {...f} active={activeDropdown === f.label || (f.label === 'Filters' && isFilterModalOpen)} onClick={f.onClick} />)}</div><button className="text-xs font-black text-gray-400 hover:text-primary transition-colors whitespace-nowrap shrink-0 ml-2">Clear All</button><AnimatePresence>{activeDropdown && (<motion.div ref={dropdownRef} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} style={{ left: `${dropdownPos}px` }} className="absolute top-14 z-[400]">{activeDropdown === 'Sort' && (<div className="w-[320px] bg-white border border-gray-100 shadow-2xl rounded-2xl overflow-hidden py-2"><div className="p-5 flex justify-between items-center border-b border-gray-50 mb-2"><h3 className="text-lg font-black text-dark tracking-tight">Sort By</h3><button onClick={() => setSelectedSort('Recommended')} className="text-sm font-bold text-gray-400 hover:text-primary transition-colors">Reset</button></div>{sortOptions.map((opt) => (<button key={opt} onClick={() => { setSelectedSort(opt); setActiveDropdown(null); }} className="w-full px-5 py-4 flex items-center gap-4 hover:bg-gray-50 transition-colors group"><div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${selectedSort === opt ? 'border-primary' : 'border-gray-200'}`}>{selectedSort === opt && <div className="w-2.5 h-2.5 rounded-full bg-primary" />}</div><span className={`text-base font-bold transition-colors ${selectedSort === opt ? 'text-dark' : 'text-gray-500 group-hover:text-dark'}`}>{opt}</span></button>))}</div>)}{activeDropdown === 'University' && <UniversityDropdown onClose={() => setActiveDropdown(null)} />}{activeDropdown === 'Locality' && <UniversityDropdown onClose={() => setActiveDropdown(null)} />}{activeDropdown === 'Budget' && <BudgetDropdown onClose={() => setActiveDropdown(null)} />}{activeDropdown === 'Move in Month' && <MoveInMonthDropdown onClose={() => setActiveDropdown(null)} />}{activeDropdown === 'Stay Duration' && <StayDurationDropdown onClose={() => setActiveDropdown(null)} />}{activeDropdown === 'Room Type' && <RoomTypeDropdown onClose={() => setActiveDropdown(null)} />}</motion.div>)}</AnimatePresence></div></div>
      <AnimatePresence>{isFilterModalOpen && <FilterModal onClose={() => setIsFilterModalOpen(false)} resultsCount={rooms.length} />}</AnimatePresence>
      <div className="bg-[#fbfcff] min-h-screen"><div className="max-w-[95%] mx-auto px-4 pb-12"><div className="mt-20 mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6"><div className="space-y-4 pt-4"><nav className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest"><Link to="/" className="text-primary hover:text-primary/80 transition-colors">India</Link><HiOutlineSlash size={10} className="text-gray-300" /><span className="text-gray-400">{locationParam}</span></nav><h1 className="text-3xl md:text-3xl tracking-tight">Accommodations in <span className=" decoration-primary/20 tracking-tighter font-bold">{locationParam}</span> <span className="text-gray-100 font-light mx-2">|</span> <span className="text-gray-400 font-bold text-lg text-nowrap">Showing {rooms.length} places</span></h1><p className="text-sm text-gray-400 font-medium max-w-2xl leading-relaxed">Finding student accommodation in {locationParam}, India...</p></div><div className="flex items-center gap-0.5 bg-white p-1 rounded-xl shadow-sm border border-gray-100 self-end overflow-hidden"><button onClick={() => setViewMode('list')} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-[11px] font-black transition-all ${viewMode === 'list' ? 'bg-gray-100 text-dark' : 'text-gray-400'}`}><List size={14} /> List</button><button onClick={() => setViewMode('grid')} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-[11px] font-black transition-all ${viewMode === 'grid' ? 'bg-gray-100 text-dark' : 'text-gray-400'}`}><Grid3X3 size={14} /> Grid</button></div></div>
          <div className="flex flex-col lg:flex-row gap-6 items-start">
            <div className="flex-1 w-full lg:max-w-none">
              {roomsLoading ? ( <div className="space-y-6">{[1,2,3,4].map(i => <div key={i} className="h-64 bg-white rounded-3xl animate-pulse" />) }</div> ) : ( <div className="space-y-6">{viewMode === 'list' ? ( <div className="space-y-4">{rooms.length > 0 ? rooms.map((room) => <ListingCard key={room._id} item={room} />) : <EmptyState type="search" />}</div> ) : ( <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">{rooms.length > 0 ? rooms.map((room) => <GridListingCard key={room._id} item={room} />) : <EmptyState type="search" />}</div> )}<AccommodationForm /></div> )}
            </div>
            <div className="w-full lg:w-[320px] sticky top-36 shrink-0"><div className="bg-white rounded-[1.5rem] border border-gray-100 shadow-sm overflow-hidden flex flex-col"><div className="relative h-[220px] w-full p-2 pb-0"><div className="w-full h-full rounded-[1.1rem] overflow-hidden relative group/map"><iframe width="100%" height="100%" style={{ border: 0 }} loading="lazy" allowFullScreen src={mapUrl} className="grayscale-[0.5] group-hover/map:grayscale-0 transition-all duration-1000"></iframe></div></div><div className="p-1 pb-4">{[{ label: 'Instant Booking', icon: CalendarIcon, color: 'text-indigo-950' }, { label: 'Lowest Price Guaranteed', icon: Zap, color: 'text-rose-500' }, { label: 'Verified Properties', icon: ShieldCheck, color: 'text-indigo-950' }, { label: '24x7 Personal Assistance', icon: Heart, color: 'text-rose-500' }, { label: '9.4K+ Reviews', icon: Star, color: 'text-rose-400' }].map((feat, i) => (<div key={i} className="flex items-center justify-between p-3.5 py-4 hover:bg-gray-50/50 transition-colors cursor-pointer group border-b border-gray-50 last:border-0 mx-2"><div className="flex items-center gap-3"><div className={`transition-all duration-300 ${feat.color}`}><feat.icon size={18} strokeWidth={1.5} stroke="currentColor" /></div><span className="text-[15px] font-medium text-indigo-950/90 tracking-tight">{feat.label}</span></div><ChevronDown size={18} className="text-gray-300 group-hover:text-gray-400 transition-colors" /></div>))}</div></div></div>
          </div>
          <RecentlyViewed /><FAQSection title="Frequently Asked Questions (FAQs)" questions={['What types of student accommodation are available in Dublin?', 'When should students start looking for student accommodation Dublin?', 'How much does private student accommodation Dublin cost?', 'Which are the best areas for students to live in Dublin for short-term stays?', 'What should students check before renting accommodation in Dublin City?']} /><FAQSection title={`Student Accommodations in ${locationParam}`} questions={[`About ${locationParam}`, `Best Student Accommodation in ${locationParam}`, `Affordable Student Accommodation in ${locationParam}`, `Best Areas to Live in ${locationParam}`, `Room Types for Student Accommodation in ${locationParam}`]} /><NearbyPlaces />
        </div></div>
    </MainLayout>
  );
}
