import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { MapPin, Calendar, Sparkles } from 'lucide-react';
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
  const match = calcMatch(room, profile?.preferences, profile?.city);

  return (
    <Link to={`/rooms/${room._id}`}>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        whileHover={{ y: -3 }}
        className="bg-white rounded-2xl overflow-hidden border border-dark/6 shadow-sm hover:shadow-xl transition-all duration-300 group cursor-pointer h-full flex flex-col"
      >
        {/* Image */}
        <div className="relative h-48 overflow-hidden">
          <img src={image} alt={room.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
          {/* Strong gradient for text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-dark/70 via-dark/20 to-dark/5" />

          {/* Top: price + save */}
          <div className="absolute top-3 left-3 right-3 flex items-start justify-between">
            <div className="bg-white text-dark text-sm font-extrabold px-3 py-1.5 rounded-lg shadow-md">
              ₹{room.rent?.toLocaleString('en-IN')}<span className="text-xs font-normal text-muted">/mo</span>
            </div>
            <div className="flex gap-1.5">
              <ShareButton url={`${window.location.origin}/rooms/${room._id}`} title={room.title} />
              <SaveButton itemType="room" itemId={room._id} />
            </div>
          </div>

          {/* Bottom: match badge + tenant type */}
          <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
            {room.preferredTenant && room.preferredTenant !== 'any' && (
              <span className="bg-white/90 backdrop-blur-sm text-dark text-[10px] font-semibold px-2 py-1 rounded-md capitalize">{room.preferredTenant}</span>
            )}
            {!room.preferredTenant || room.preferredTenant === 'any' ? <span /> : null}
            {match && (
              <div className="bg-white text-xs font-bold px-2.5 py-1 rounded-lg shadow-md flex items-center gap-1">
                <Sparkles size={10} className="text-primary" />
                <span className="text-primary">{match}%</span>
                <span className="text-muted font-medium">Match</span>
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-4 flex-1 flex flex-col">
          <h3 className="font-bold text-dark text-sm line-clamp-1 group-hover:text-primary transition-colors">{room.title}</h3>
          <div className="flex items-center gap-3 mt-1.5 text-xs text-muted">
            <span className="flex items-center gap-1"><MapPin size={11} /> {room.location}</span>
            {room.availableFrom && (
              <span className="flex items-center gap-1"><Calendar size={11} /> {new Date(room.availableFrom).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}</span>
            )}
          </div>

          {/* Amenities — show all */}
          {room.amenities?.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2.5">
              {room.amenities.slice(0, 4).map((a) => (
                <span key={a} className="bg-surface text-muted text-[10px] font-medium px-2 py-0.5 rounded-md capitalize">{a}</span>
              ))}
              {room.amenities.length > 4 && <span className="bg-primary/5 text-primary text-[10px] font-semibold px-2 py-0.5 rounded-md">+{room.amenities.length - 4} more</span>}
            </div>
          )}

          {/* Actions — always at bottom */}
          <div className="flex items-center gap-2 mt-auto pt-3 border-t border-dark/5">
            <div className="flex-1 py-2 rounded-lg text-xs font-semibold text-center text-primary bg-primary/5 group-hover:bg-primary group-hover:text-white transition-all">
              View Details
            </div>
            <ContactButtons userId={room.postedBy?._id || room.postedBy} phone={room.contactPhone} phoneVisibility={room.phoneVisibility} listingType="room" listingId={room._id} />
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
