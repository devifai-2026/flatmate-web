import { motion } from 'framer-motion';
import { MapPin, IndianRupee, Calendar, Cigarette, Wine, Dog, Moon } from 'lucide-react';
import Badge from '../ui/Badge';
import { getAvatar } from '../../utils/constants';

export default function RequirementCard({ requirement }) {
  const r = requirement;
  const avatar = r.createdBy ? getAvatar(r.createdBy._id, r.createdBy.profileImage) : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 group"
    >
      {/* Type strip */}
      <div className={`h-1.5 ${r.type === 'room' ? 'bg-gradient-to-r from-primary to-primary-light' : 'bg-gradient-to-r from-secondary to-secondary/70'}`} />

      <div className="p-5 space-y-3.5">
        <div className="flex items-start justify-between gap-3">
          <Badge color={r.type === 'room' ? 'primary' : 'secondary'}>
            Looking for {r.type}
          </Badge>
          {r.moveInDate && (
            <span className="flex items-center gap-1 text-[10px] text-muted whitespace-nowrap">
              <Calendar size={11} /> {new Date(r.moveInDate).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
            </span>
          )}
        </div>

        <h3 className="font-bold text-dark text-sm line-clamp-2 group-hover:text-primary transition-colors">{r.title}</h3>

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-muted text-xs">
            <MapPin size={13} className="text-primary flex-shrink-0" /> <span className="truncate">{r.location}</span>
          </div>
          <div className="flex items-center gap-2 text-muted text-xs">
            <IndianRupee size={13} className="text-primary flex-shrink-0" />
            <span>₹{r.budget?.min?.toLocaleString('en-IN')} – ₹{r.budget?.max?.toLocaleString('en-IN')}</span>
          </div>
        </div>

        {/* Lifestyle icons */}
        {r.lifestyle && (
          <div className="flex gap-2">
            {r.lifestyle.smoking === false && (
              <div className="w-7 h-7 rounded-lg bg-green-50 flex items-center justify-center" title="Non-smoking">
                <Cigarette size={12} className="text-green-500" />
              </div>
            )}
            {r.lifestyle.drinking === false && (
              <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center" title="Non-drinking">
                <Wine size={12} className="text-blue-500" />
              </div>
            )}
            {r.lifestyle.pets && (
              <div className="w-7 h-7 rounded-lg bg-orange-50 flex items-center justify-center" title="Pet-friendly">
                <Dog size={12} className="text-orange-500" />
              </div>
            )}
            {r.lifestyle.sleepSchedule && (
              <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center" title={r.lifestyle.sleepSchedule}>
                <Moon size={12} className="text-primary" />
              </div>
            )}
          </div>
        )}

        {/* Posted by */}
        {r.createdBy && (
          <div className="flex items-center gap-2.5 pt-3 border-t border-gray-50">
            <img src={avatar} alt={r.createdBy.name} className="w-8 h-8 rounded-full object-cover" loading="lazy" />
            <div className="flex-1 min-w-0">
              <span className="text-xs font-medium text-dark truncate block">{r.createdBy.name}</span>
              {r.createdBy.occupation && <span className="text-[10px] text-muted">{r.createdBy.occupation}</span>}
            </div>
            {r.createdBy.verified && <Badge color="green">Verified</Badge>}
          </div>
        )}
      </div>
    </motion.div>
  );
}
