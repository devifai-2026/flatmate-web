import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { MapPin, Calendar, Sparkles, IndianRupee, ArrowRight } from 'lucide-react';
import SaveButton from '../ui/SaveButton';
import ShareButton from '../ui/ShareButton';
import ContactButtons from '../ui/ContactButtons';
import { getRoomImage } from '../../utils/constants';

function calcMatch(room, prefs, userCity) {
  if (!prefs) return null;
  let score = 0, factors = 0;
  if (prefs.budgetMin || prefs.budgetMax) {
    factors += 50;
    const rent = room.rent || 0, min = prefs.budgetMin || 0, max = prefs.budgetMax || Infinity;
    if (rent >= min && rent <= max) score += 50;
    else { const diff = rent < min ? min - rent : rent - max; score += Math.max(0, 50 - Math.round((diff / (max - min || 10000)) * 50)); }
  }
  if (userCity || prefs.preferredLocation) {
    factors += 50;
    const target = (prefs.preferredLocation || userCity || '').toLowerCase();
    const loc = (room.location || '').toLowerCase();
    if (loc.includes(target) || target.includes(loc)) score += 50;
  }
  if (factors === 0) return null;
  const pct = Math.round((score / factors) * 100);
  return pct < 15 ? null : pct;
}

export default function RoomCard({ room }) {
  const image = getRoomImage(room._id, room.images);
  const { profile } = useSelector((s) => s.user);
  const { user } = useSelector((s) => s.auth);
  const ownerId = room.postedBy?._id || room.postedBy;
  const isOwn = user && ownerId === user._id;
  const match = isOwn ? null : calcMatch(room, profile?.preferences, profile?.city);

  return (
    <Link to={`/rooms/${room._id}`} className="block h-full">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        whileHover={{ y: -4 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-2xl hover:shadow-primary/8 transition-all duration-300 group cursor-pointer h-full flex flex-col"
      >
        {/* Image */}
        <div className="relative h-52 overflow-hidden">
          <img src={image} alt={room.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out" loading="lazy" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

          {/* Top row */}
          <div className="absolute top-3 left-3 right-3 flex items-start justify-between">
            {isOwn ? (
              <span className="bg-primary text-white text-[10px] font-bold px-3 py-1.5 rounded-full shadow-lg tracking-wide uppercase">Your Listing</span>
            ) : match ? (
              <div className="bg-white/95 backdrop-blur-sm text-xs font-bold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1.5">
                <Sparkles size={12} className="text-primary" />
                <span className="text-primary">{match}%</span>
                <span className="text-muted/70 font-medium">match</span>
              </div>
            ) : <span />}
            <div className="flex gap-1.5">
              <ShareButton url={`${window.location.origin}/rooms/${room._id}`} title={room.title} />
              <SaveButton itemType="room" itemId={room._id} />
            </div>
          </div>

          {/* Bottom row: price + tenant badge */}
          <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
            <div className="bg-white/95 backdrop-blur-sm text-dark px-3.5 py-2 rounded-xl shadow-lg flex items-center gap-0.5">
              <IndianRupee size={14} className="text-dark" strokeWidth={2.5} />
              <span className="text-lg font-extrabold tracking-tight">{room.rent?.toLocaleString('en-IN')}</span>
              <span className="text-[10px] text-muted font-medium ml-0.5">/mo</span>
            </div>
            {room.preferredTenant && room.preferredTenant !== 'any' && (
              <span className="bg-white/90 backdrop-blur-sm text-dark text-[10px] font-bold px-2.5 py-1.5 rounded-lg capitalize tracking-wide">{room.preferredTenant}</span>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-4 flex-1 flex flex-col gap-3">
          <div>
            <h3 className="font-bold text-dark text-[15px] leading-snug line-clamp-1 group-hover:text-primary transition-colors">{room.title}</h3>
            <div className="flex items-center flex-wrap gap-x-4 gap-y-1 mt-2">
              <div className="flex items-center gap-1.5 text-xs text-muted">
                <div className="w-5 h-5 rounded-md bg-primary/8 flex items-center justify-center flex-shrink-0">
                  <MapPin size={11} className="text-primary" />
                </div>
                <span className="truncate max-w-[160px]">{room.location}</span>
              </div>
              {room.availableFrom && (
                <div className="flex items-center gap-1.5 text-xs text-muted">
                  <div className="w-5 h-5 rounded-md bg-primary/8 flex items-center justify-center flex-shrink-0">
                    <Calendar size={11} className="text-primary" />
                  </div>
                  <span>{new Date(room.availableFrom).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}</span>
                </div>
              )}
            </div>
          </div>

          {/* Amenities */}
          {room.amenities?.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {room.amenities.slice(0, 4).map((a) => (
                <span key={a} className="bg-gray-50 text-muted text-[10px] font-semibold px-2.5 py-1 rounded-lg capitalize border border-gray-100">{a}</span>
              ))}
              {room.amenities.length > 4 && <span className="bg-primary/5 text-primary text-[10px] font-bold px-2.5 py-1 rounded-lg border border-primary/10">+{room.amenities.length - 4}</span>}
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-2 mt-auto pt-3 border-t border-gray-100">
            <div className="flex-1 py-2.5 rounded-xl text-xs font-bold text-center transition-all duration-300 flex items-center justify-center gap-1.5 bg-primary/5 text-primary group-hover:bg-primary group-hover:text-white group-hover:shadow-lg group-hover:shadow-primary/20">
              {isOwn ? 'Manage Listing' : 'View Details'}
              <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
            </div>
            {!isOwn && <ContactButtons userId={ownerId} listingType="room" listingId={room._id} />}
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
