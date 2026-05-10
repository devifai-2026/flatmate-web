import { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Gift } from 'lucide-react';

const COLORS = ['#FF1351', '#FFD700', '#22C55E', '#3B82F6', '#A855F7', '#FB923C'];

function ConfettiPiece({ delay, x, color, rotate, drift }) {
  return (
    <motion.span
      initial={{ y: -40, x, opacity: 0, rotate: 0 }}
      animate={{ y: '110vh', x: x + drift, opacity: [0, 1, 1, 0.8, 0], rotate }}
      transition={{ duration: 3.2 + Math.random() * 1.4, delay, ease: 'easeIn' }}
      style={{
        position: 'absolute',
        top: 0,
        width: 9,
        height: 14,
        background: color,
        borderRadius: 2,
        pointerEvents: 'none',
      }}
    />
  );
}

export default function SignupBonusModal({ amount, onClose }) {
  const pieces = useMemo(() => {
    const arr = [];
    for (let i = 0; i < 80; i++) {
      arr.push({
        id: i,
        delay: Math.random() * 0.6,
        x: Math.random() * window.innerWidth,
        drift: (Math.random() - 0.5) * 240,
        color: COLORS[i % COLORS.length],
        rotate: 360 + Math.random() * 720,
      });
    }
    return arr;
  }, []);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[200] flex items-center justify-center"
        style={{ background: 'rgba(15, 23, 42, 0.55)', backdropFilter: 'blur(4px)' }}
      >
        {/* Confetti layer */}
        <div className="pointer-events-none fixed inset-0 overflow-hidden">
          {pieces.map(p => (
            <ConfettiPiece key={p.id} {...p} />
          ))}
        </div>

        {/* Modal card */}
        <motion.div
          initial={{ scale: 0.7, y: 30, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.85, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 220, damping: 22 }}
          className="relative bg-white rounded-3xl shadow-2xl p-8 mx-6 max-w-sm w-full text-center overflow-hidden"
        >
          {/* Decorative gradient */}
          <div
            className="absolute inset-x-0 top-0 h-32 pointer-events-none"
            style={{ background: 'linear-gradient(180deg, rgba(255,19,81,0.12), transparent)' }}
          />

          <motion.div
            initial={{ scale: 0, rotate: -30 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 16, delay: 0.15 }}
            className="relative w-20 h-20 mx-auto mb-5 rounded-2xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #FF1351, #FF6B9D)' }}
          >
            <Gift size={38} color="white" strokeWidth={2.4} />
            <motion.div
              animate={{ rotate: [0, 15, -10, 0] }}
              transition={{ duration: 1.6, repeat: Infinity, repeatDelay: 1.4 }}
              className="absolute -top-2 -right-2"
            >
              <Sparkles size={20} color="#FFD700" />
            </motion.div>
          </motion.div>

          <h2 className="text-2xl font-extrabold text-dark mb-2">Welcome to FlatMate! 🎉</h2>
          <p className="text-muted text-sm mb-5 leading-relaxed">
            FlatMate has gifted you a signup bonus to get you started.
          </p>

          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.4, type: 'spring', stiffness: 200 }}
            className="rounded-2xl py-5 mb-6"
            style={{
              background: 'linear-gradient(135deg, rgba(255,19,81,0.08), rgba(255,107,157,0.08))',
              border: '1px solid rgba(255,19,81,0.15)',
            }}
          >
            <div className="text-xs font-semibold text-muted uppercase tracking-wider mb-1">Bonus credited</div>
            <div className="text-4xl font-extrabold" style={{ color: '#FF1351' }}>
              {amount}
              <span className="text-base font-bold ml-1.5">tokens</span>
            </div>
          </motion.div>

          <button
            onClick={onClose}
            className="w-full py-3.5 rounded-2xl text-white font-bold text-base transition-transform hover:scale-[1.02] active:scale-[0.98]"
            style={{ background: 'linear-gradient(135deg, #FF1351, #FF4778)' }}
          >
            Awesome, let's go!
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
