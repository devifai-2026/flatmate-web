import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, MapPin, Star, ChevronRight, Share2, Info, Wifi, Car, Waves, Coffee, ShieldCheck } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination as SwiperPagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

import MainLayout from '../layouts/MainLayout';
import { fetchWishlist, toggleSave } from '../redux/slices/wishlistSlice';
import { CardSkeleton } from '../components/ui/Skeleton';
import EmptyState from '../components/ui/EmptyState';
import { getRoomImage } from '../utils/constants';

function ShortlistCard({ item, onRemove }) {
  const { itemType, data } = item;
  if (!data) return null;

  const detailUrl = itemType === 'room' ? `/rooms/${data._id}` : itemType === 'pg' ? `/pgs/${data._id}` : `/roommates/${data._id}`;
  const images = data.images?.length > 0 ? data.images : [getRoomImage(data._id, [])];
  
  // Mock tags for premium look (can be replaced by real data if available)
  const tags = [
    { label: 'Save Up To £250', icon: null, color: 'text-rose-500 bg-rose-50 border-rose-100' },
    { label: 'Instant Booking', icon: <ShieldCheck size={12} />, color: 'text-emerald-600 bg-emerald-50 border-emerald-100' },
    { label: 'Recycling', icon: <Info size={12} />, color: 'text-gray-500 bg-gray-50 border-gray-100' },
    { label: 'Bike Storage', icon: <Car size={12} />, color: 'text-gray-500 bg-gray-50 border-gray-100' },
    { label: 'Laundry Facility', icon: <Waves size={12} />, color: 'text-gray-500 bg-gray-50 border-gray-100' },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl border border-gray-200 overflow-hidden group flex flex-col md:flex-row relative"
    >
      {/* Remove Button (Heart) */}
      <button 
        onClick={() => onRemove(itemType, data._id || item.itemId)}
        className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-white shadow-lg flex items-center justify-center text-rose-500 hover:scale-110 transition-transform cursor-pointer"
      >
        <Heart size={18} fill="currentColor" />
      </button>

      {/* Left: Image Slider */}
      <div className="w-full md:w-[350px] lg:w-[400px] h-[250px] relative overflow-hidden flex-shrink-0">
        <Swiper
          modules={[SwiperPagination]}
          pagination={{ clickable: true }}
          className="h-full w-full shortlist-swiper"
        >
          {images.map((img, idx) => (
            <SwiperSlide key={idx}>
              <img 
                src={img} 
                alt="" 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Right: Content */}
      <div className="flex-1 p-6 flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className="text-xl font-bold text-dark tracking-tight leading-tight group-hover:text-primary transition-colors">
                <Link to={detailUrl}>{data.title || data.name || 'Premium Property'}</Link>
              </h3>
              <p className="text-sm text-gray-400 mt-1 flex items-center gap-1 font-medium italic">
                 {data.location || data.city || 'Central London'}, {data.address || 'UK'}
              </p>
            </div>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-1 mb-4">
            <span className="text-sm font-bold text-dark">5.0</span>
            <div className="flex items-center text-emerald-500">
              {[1, 2, 3, 4, 5].map(i => <Star key={i} size={14} fill="currentColor" />)}
            </div>
            <span className="text-xs text-gray-400 font-medium">(24 reviews)</span>
          </div>

          {/* Tags Grid */}
          <div className="flex flex-wrap gap-2 mb-6 max-w-2xl">
            {tags.map((tag, i) => (
              <span 
                key={i} 
                className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${tag.color}`}
              >
                {tag.icon} {tag.label}
              </span>
            ))}
          </div>
        </div>

        {/* Pricing & CTA */}
        <div className="flex items-end justify-between">
          <div>
            <p className="text-xs text-gray-400 font-medium mb-0.5">From</p>
            <p className="text-xl font-black text-dark">
              ₹{(data.rent || 15000).toLocaleString('en-IN')}
              <span className="text-sm font-normal text-gray-400 uppercase tracking-tighter"> / MONTH</span>
            </p>
          </div>
          <Link to={detailUrl}>
            <button className="bg-primary text-white font-bold py-2.5 px-8 rounded-lg flex items-center gap-2 hover:bg-rose-600 shadow-lg shadow-rose-200 transition-all cursor-pointer">
              View <ChevronRight size={16} strokeWidth={3} />
            </button>
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

export default function Saved() {
  const dispatch = useDispatch();
  const { items, loading } = useSelector((s) => s.wishlist);

  useEffect(() => { 
    dispatch(fetchWishlist()); 
    window.scrollTo(0, 0);
  }, [dispatch]);

  const handleRemove = (itemType, itemId) => {
    dispatch(toggleSave({ itemType, itemId }));
  };

  return (
    <MainLayout>
      <div className="bg-[#F8F9FB] min-h-screen pt-26 pb-4">
        <div className="max-w-6xl mx-auto px-4">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-[13px] mb-6">
            <Link to="/" className="text-muted hover:text-dark transition-colors font-medium">Home</Link>
            <span className="text-muted/40">/</span>
            <Link to="/profile" className="text-muted hover:text-dark transition-colors font-medium">Profile</Link>
            <span className="text-muted/40">/</span>
            <span className="text-primary font-semibold">Shortlist</span>
          </nav>

          {/* Page Title */}
          <h1 className="text-3xl font-black text-dark mb-10 tracking-tight">Shortlist</h1>

          {/* Unified Parent Container */}
          <div className="bg-white rounded-2xl p-10 shadow-[0_4px_30px_-10px_rgba(0,0,0,0.06)] border border-gray-100">
            {loading ? (
              <div className="space-y-6">
                <div className="h-6 w-48 bg-gray-100 rounded animate-pulse mb-6" />
                {[0, 1].map(i => <div key={i} className="h-64 w-full bg-gray-50 rounded-xl animate-pulse" />)}
              </div>
            ) : items.length === 0 ? (
              <EmptyState 
                icon={Heart} 
                title="Your shortlist is empty" 
                description="Save rooms, PGs, and roommates to compare them and make the right choice."
              >
                <Link to="/search">
                  <button className="bg-primary text-white font-bold py-3 px-10 rounded-xl mt-6 hover:bg-rose-600 transition-all cursor-pointer">
                    Start Browsing
                  </button>
                </Link>
              </EmptyState>
            ) : (
              <div className="space-y-10">
                {/* Count Header */}
                <p className="text-sm font-bold text-dark tracking-tight uppercase border-b border-gray-50 pb-6">
                   {items.length} propert{items.length !== 1 ? 'ies' : 'y'} shortlisted
                </p>

                {/* Grid */}
                <div className="space-y-8">
                  {items.map((item, i) => (
                    <ShortlistCard key={item._id || i} item={item} onRemove={handleRemove} />
                  ))}
                </div>

                {/* Pagination Placeholder */}
                <div className="flex justify-center pt-6">
                  <button className="w-10 h-10 bg-primary text-white rounded-lg flex items-center justify-center font-bold text-sm shadow-lg shadow-rose-200">
                    1
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .shortlist-swiper .swiper-pagination-bullet {
          width: 6px;
          height: 6px;
          background: white;
          opacity: 0.8;
          transition: all 0.3s;
        }
        .shortlist-swiper .swiper-pagination-bullet-active {
          width: 24px;
          border-radius: 4px;
          background: white;
          opacity: 1;
        }
      `}} />
    </MainLayout>
  );
}

