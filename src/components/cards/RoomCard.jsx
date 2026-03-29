import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { MapPin, Calendar, Sparkles, ArrowRight, Home, Sofa, Car } from 'lucide-react';
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
        className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 group cursor-pointer h-full flex flex-col"
      >
        {/* Image */}
        <div className="relative h-44 overflow-hidden">
          <img src={image} alt={room.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

          {/* Top: match badge + actions */}
          <div className="absolute top-2.5 left-2.5 right-2.5 flex items-start justify-between">
            {match ? (
              <div className="bg-white/95 backdrop-blur-sm text-[10px] font-bold px-2.5 py-1 rounded-lg shadow-sm flex items-center gap-1">
                <Sparkles size={10} className="text-primary" />
                <span className="text-primary">{match}%</span>
              </div>
            ) : isOwn ? (
              <span className="bg-primary text-white text-[9px] font-bold px-2.5 py-1 rounded-lg uppercase">Your Listing</span>
            ) : <span />}
            <div className="flex gap-1">
              <ShareButton url={`${window.location.origin}/rooms/${room._id}`} title={room.title} />
              <SaveButton itemType="room" itemId={room._id} />
            </div>
          </div>

          {/* Bottom: room type badge */}
          {room.roomType && (
            <div className="absolute bottom-2.5 left-2.5">
              <span className="bg-white/95 backdrop-blur-sm text-dark text-[10px] font-bold px-2.5 py-1 rounded-lg uppercase shadow-sm">{room.roomType.replace(/-/g, ' ')}</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4 flex-1 flex flex-col">
          {/* Price */}
          <div className="flex items-baseline gap-1 mb-1.5">
            <span className="text-xl font-extrabold text-primary">₹{room.rent?.toLocaleString('en-IN')}</span>
            <span className="text-xs text-muted">/mo</span>
            {room.deposit > 0 && <span className="text-[10px] text-muted ml-auto">Deposit ₹{room.deposit?.toLocaleString('en-IN')}</span>}
          </div>

          {/* Title */}
          <h3 className="font-bold text-dark text-sm leading-snug line-clamp-1 mb-2 group-hover:text-primary transition-colors">{room.title}</h3>

          {/* Location + Date */}
          <div className="flex items-center gap-3 mb-2.5">
            <div className="flex items-center gap-1 text-[11px] text-muted min-w-0">
              <MapPin size={11} className="text-primary flex-shrink-0" />
              <span className="truncate">{room.location}</span>
            </div>
            {room.availableFrom && (
              <div className="flex items-center gap-1 text-[11px] text-muted flex-shrink-0">
                <Calendar size={11} className="text-primary" />
                <span>{new Date(room.availableFrom).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}</span>
              </div>
            )}
          </div>

          {/* Property tags */}
          <div className="flex flex-wrap gap-1.5 mb-3">
            {room.furnishing && (
              <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 text-[9px] font-semibold px-2 py-1 rounded-md">
                <Sofa size={9} /> {room.furnishing.replace(/-/g, ' ')}
              </span>
            )}
            {room.preferredTenant && room.preferredTenant !== 'any' && (
              <span className="bg-violet-50 text-violet-700 text-[9px] font-semibold px-2 py-1 rounded-md capitalize">{room.preferredTenant.replace(/-/g, ' ')}</span>
            )}
            {room.parking && room.parking !== 'none' && (
              <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 text-[9px] font-semibold px-2 py-1 rounded-md">
                <Car size={9} /> {room.parking}
              </span>
            )}
            {room.bathrooms && (
              <span className="bg-blue-50 text-blue-700 text-[9px] font-semibold px-2 py-1 rounded-md">{room.bathrooms} bath</span>
            )}
            {room.totalArea && (
              <span className="bg-gray-50 text-gray-600 text-[9px] font-semibold px-2 py-1 rounded-md">{room.totalArea} sqft</span>
            )}
          </div>

          {/* Amenities */}
          {room.amenities?.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {room.amenities.slice(0, 3).map((a) => (
                <span key={a} className="bg-gray-50 text-muted text-[9px] font-medium px-2 py-0.5 rounded capitalize">{a.replace(/-/g, ' ')}</span>
              ))}
              {room.amenities.length > 3 && <span className="text-primary text-[9px] font-semibold px-1">+{room.amenities.length - 3}</span>}
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-2 mt-auto pt-3 border-t border-gray-50">
            <div className="flex-1 py-2 rounded-xl text-xs font-bold text-center bg-primary/5 text-primary group-hover:bg-primary group-hover:text-white transition-all flex items-center justify-center gap-1">
              View Details <ArrowRight size={12} />
            </div>
            {!isOwn && <ContactButtons userId={ownerId} listingType="room" listingId={room._id} />}
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
