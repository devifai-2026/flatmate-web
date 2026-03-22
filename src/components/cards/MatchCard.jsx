import { motion } from 'framer-motion';
import { Briefcase, MapPin } from 'lucide-react';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import { getAvatar } from '../../utils/constants';

function ScoreRing({ score }) {
  const radius = 32;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color = score >= 70 ? '#FF1351' : score >= 40 ? '#FF4D7A' : '#7A7A7A';

  return (
    <div className="relative w-24 h-24 flex-shrink-0">
      <svg className="w-24 h-24 -rotate-90" viewBox="0 0 72 72">
        <circle cx="36" cy="36" r={radius} fill="none" stroke="#f3f4f6" strokeWidth="4" />
        <motion.circle
          cx="36" cy="36" r={radius} fill="none" stroke={color} strokeWidth="4" strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          whileInView={{ strokeDashoffset: offset }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <span className="text-lg font-extrabold text-dark">{score}</span>
          <span className="text-[10px] text-muted block -mt-0.5">match</span>
        </div>
      </div>
    </div>
  );
}

function ScoreBar({ label, score, maxScore, detail }) {
  const pct = maxScore > 0 ? (score / maxScore) * 100 : 0;
  const barColor = pct >= 70 ? 'bg-primary' : pct >= 40 ? 'bg-primary' : 'bg-secondary';

  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs">
        <span className="text-muted capitalize">{label}</span>
        <span className="text-dark font-semibold">{score}/{maxScore}</span>
      </div>
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <motion.div
          className={`h-full ${barColor} rounded-full`}
          initial={{ width: 0 }}
          whileInView={{ width: `${pct}%` }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
      </div>
      {detail && <p className="text-[10px] text-muted/70 truncate">{detail}</p>}
    </div>
  );
}

export default function MatchCard({ match, onConnect }) {
  const u = match.user;
  const ex = match.explanation;
  const avatar = getAvatar(u._id, u.profileImage);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300"
    >
      {/* Top gradient strip */}
      <div className={`h-2 ${match.matchScore >= 70 ? 'bg-gradient-to-r from-primary to-primary/60' : match.matchScore >= 40 ? 'bg-gradient-to-r from-primary to-primary/60' : 'bg-gradient-to-r from-secondary to-secondary/60'}`} />

      <div className="p-5">
        <div className="flex gap-4 items-start mb-5">
          <div className="relative">
            <img src={avatar} alt={u.name} className="w-14 h-14 rounded-full object-cover ring-2 ring-white shadow-md" loading="lazy" />
            {u.verified && (
              <div className="absolute -bottom-0.5 -right-0.5 w-5 h-5 bg-primary rounded-full flex items-center justify-center ring-2 ring-white">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-dark">{u.name}</h3>
            <div className="flex flex-wrap items-center gap-2 mt-1">
              {u.age && <span className="text-xs text-muted">{u.age} yrs</span>}
              {u.occupation && (
                <span className="flex items-center gap-1 text-xs text-muted">
                  <Briefcase size={11} /> {u.occupation}
                </span>
              )}
            </div>
            {u.preferences?.preferredLocation && (
              <div className="flex items-center gap-1 text-xs text-muted mt-0.5">
                <MapPin size={11} /> {u.preferences.preferredLocation}
              </div>
            )}
          </div>
          <ScoreRing score={match.matchScore} />
        </div>

        {ex && (
          <div className="space-y-2.5 mb-5 bg-surface rounded-xl p-3.5">
            <ScoreBar label="Budget" score={ex.budget.score} maxScore={ex.budget.maxScore} detail={ex.budget.detail} />
            <ScoreBar label="Location" score={ex.location.score} maxScore={ex.location.maxScore} detail={ex.location.detail} />
            <ScoreBar label="Lifestyle" score={ex.lifestyle.score} maxScore={ex.lifestyle.maxScore} detail={ex.lifestyle.detail} />
            <ScoreBar label="Interests" score={ex.interests.score} maxScore={ex.interests.maxScore} detail={ex.interests.detail} />
          </div>
        )}

        <Button size="md" className="w-full rounded-xl" onClick={() => onConnect?.(u._id)}>
          Connect & Chat
        </Button>
      </div>
    </motion.div>
  );
}
