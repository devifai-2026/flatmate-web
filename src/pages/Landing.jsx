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

/* ══════════════════════════════════════════════
   HERO — Apartment SVG with animated scenes
   ══════════════════════════════════════════════ */

const PR = '#FF1351';
const AC = '#FF4D7A'; // primary-light tone

function HeroApartment() {
  const [scene, setScene] = useState(0);
  useEffect(() => { const t = setInterval(() => setScene((v) => (v + 1) % 5), 5000); return () => clearInterval(t); }, []);

  // Track which window the magnifying glass is near (for scene 0)
  const [glassIdx, setGlassIdx] = useState(0);
  useEffect(() => {
    if (scene !== 0) return;
    // Glass visits windows: 0 -> 4 -> 8 -> 3 (corners + center + left)
    const order = [0, 2, 5, 3];
    let i = 0;
    const t = setInterval(() => { i = (i + 1) % order.length; setGlassIdx(order[i]); }, 1200);
    setGlassIdx(order[0]);
    return () => clearInterval(t);
  }, [scene]);

  const labels = ['Finding Rooms', 'Finding PGs', 'Finding Roommates', 'Creating Team', 'Matched!'];
  const colors = [PR, AC, PR, AC, PR];

  // Person component — reusable mini person SVG
  const Person = ({ x, y, color, scale = 1, delay = 0 }) => (
    <motion.g initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay }}>
      <g transform={`translate(${x},${y}) scale(${scale})`}>
        {/* Head */}
        <circle cx="0" cy="-18" r="8" fill="#FFDAB9" />
        {/* Hair */}
        <ellipse cx="0" cy="-22" rx="8" ry="5" fill={color} opacity="0.6" />
        {/* Body */}
        <path d="M-8,0 Q-10,-12 0,-10 Q10,-12 8,0 Z" fill={color} />
        {/* Arms */}
        <path d="M-8,-6 L-14,2" stroke={color} strokeWidth="2.5" strokeLinecap="round" fill="none" />
        <path d="M8,-6 L14,2" stroke={color} strokeWidth="2.5" strokeLinecap="round" fill="none" />
        {/* Legs */}
        <line x1="-3" y1="0" x2="-5" y2="14" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
        <line x1="3" y1="0" x2="5" y2="14" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
      </g>
    </motion.g>
  );

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.15 }}>
      <svg viewBox="0 0 460 440" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
        <defs>
          <filter id="ds"><feDropShadow dx="0" dy="2" stdDeviation="4" floodColor="#1E1E2F" floodOpacity="0.08" /></filter>
          <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#EFF6FF" /><stop offset="100%" stopColor="#F8F9FD" /></linearGradient>
          <linearGradient id="wall" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#FFFFFF" /><stop offset="100%" stopColor="#F8F9FD" /></linearGradient>
        </defs>

        {/* ── Sky background ── */}
        <rect x="0" y="0" width="460" height="440" rx="16" fill="url(#sky)" />

        {/* ── Clouds ── */}
        <motion.g animate={{ x: [0, 10, 0] }} transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}>
          <ellipse cx="80" cy="50" rx="30" ry="12" fill="white" opacity="0.7" />
          <ellipse cx="65" cy="48" rx="20" ry="10" fill="white" opacity="0.5" />
        </motion.g>
        <motion.g animate={{ x: [0, -8, 0] }} transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}>
          <ellipse cx="380" cy="35" rx="25" ry="10" fill="white" opacity="0.6" />
          <ellipse cx="395" cy="33" rx="18" ry="8" fill="white" opacity="0.4" />
        </motion.g>

        {/* ── Ground ── */}
        <rect x="0" y="365" width="460" height="75" rx="0" fill="#E8F5E9" />
        <rect x="0" y="365" width="460" height="8" rx="0" fill="#C8E6C9" opacity="0.5" />
        {/* Path */}
        <rect x="185" y="365" width="90" height="75" fill="#E0E0E0" opacity="0.4" />
        <rect x="195" y="365" width="70" height="75" fill="#EEEEEE" opacity="0.3" />

        {/* ── APARTMENT BUILDING ── */}
        <g>
          {/* Building shadow */}
          <rect x="98" y="370" width="264" height="10" rx="5" fill="#1E1E2F" opacity="0.04" />

          {/* Main wall */}
          <rect x="100" y="95" width="260" height="275" rx="4" fill="url(#wall)" filter="url(#ds)" />
          <rect x="100" y="95" width="260" height="275" rx="4" stroke="#D1D5DB" strokeWidth="0.5" fill="none" />

          {/* Roof */}
          <path d="M90 98 L230 38 L370 98 Z" fill="#FF8A80" opacity="0.15" />
          <path d="M90 98 L230 38 L370 98" fill="none" stroke="#FFAB91" strokeWidth="1.5" />
          {/* Roof tiles texture */}
          <path d="M130 85 L230 48 L330 85" fill="none" stroke="#FFAB91" strokeWidth="0.5" opacity="0.4" />

          {/* ── 3x2 Windows (6 total, avoids door overlap) ── */}
          {[0,1].map(row => [0,1,2].map(col => {
            const idx = row * 3 + col;
            const wx = 124 + col * 78;
            const wy = 115 + row * 90;

            // Scene-based window states
            const roomLit = scene === 0 && idx === glassIdx;
            const pgLit = scene === 1;
            const mateLit = scene >= 2;
            const isLit = roomLit || pgLit || mateLit;
            const warmHues = ['#FFF8E1','#E8F5E9','#E3F2FD','#FCE4EC','#FFF3E0','#F3E5F5'];

            return (
              <g key={idx}>
                {/* Window outer frame */}
                <rect x={wx} y={wy} width="48" height="52" rx="3" fill="#FAFAFA" stroke="#D1D5DB" strokeWidth="0.8" />
                {/* Glass */}
                <rect x={wx+2} y={wy+2} width="44" height="48" rx="2" fill={isLit ? warmHues[idx] : '#F0F4F8'} opacity={isLit ? 0.9 : 1}>
                  {isLit && <animate attributeName="opacity" values="0.7;0.9;0.7" dur="3s" repeatCount="indefinite" />}
                </rect>
                {/* Pane cross */}
                <line x1={wx+24} y1={wy+2} x2={wx+24} y2={wy+50} stroke="#D1D5DB" strokeWidth="0.6" />
                <line x1={wx+2} y1={wy+26} x2={wx+46} y2={wy+26} stroke="#D1D5DB" strokeWidth="0.6" />

                {/* Window sill */}
                <rect x={wx-2} y={wy+52} width="52" height="4" rx="1" fill="#E0E0E0" />

                {/* Curtains (subtle) */}
                <path d={`M${wx+3} ${wy+3} Q${wx+12} ${wy+15} ${wx+3} ${wy+25}`} fill={PR} opacity="0.04" />
                <path d={`M${wx+45} ${wy+3} Q${wx+36} ${wy+15} ${wx+45} ${wy+25}`} fill={PR} opacity="0.04" />

                {/* Person silhouette inside (scenes 2+) */}
                {scene >= 2 && [0,2,3,5].includes(idx) && (
                  <motion.g initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: idx * 0.05 }}>
                    <circle cx={wx+24} cy={wy+18} r="5" fill="#455A64" opacity="0.25" />
                    <rect x={wx+19} y={wy+24} width="10" height="14" rx="3" fill="#455A64" opacity="0.2" />
                  </motion.g>
                )}
              </g>
            );
          }))}

          {/* ── Front door ── */}
          <rect x="198" y="310" width="64" height="60" rx="4" fill="#5D4037" opacity="0.12" />
          <rect x="202" y="314" width="26" height="52" rx="3" fill="#8D6E63" opacity="0.1" />
          <rect x="232" y="314" width="26" height="52" rx="3" fill="#8D6E63" opacity="0.1" />
          <circle cx="226" cy="345" r="3" fill="#BDBDBD" />
          {/* Steps */}
          <rect x="190" y="368" width="80" height="5" rx="2" fill="#E0E0E0" />
          <rect x="185" y="372" width="90" height="4" rx="2" fill="#EEEEEE" />

          {/* (PG sign removed — clean look) */}

          {/* ── Scene 1: PG — SVG icons inside each window ── */}
          {scene === 1 && (() => {
            // Each window gets a unique SVG icon drawn with paths
            const icons = [
              // 0: Bed
              (cx, cy) => <g><rect x={cx-9} y={cy-2} width="18" height="8" rx="2" fill="#8D6E63" opacity="0.5" /><rect x={cx-10} y={cy+5} width="20" height="3" rx="1.5" fill="#8D6E63" opacity="0.35" /><ellipse cx={cx-5} cy={cy-4} rx="4" ry="3" fill="#8D6E63" opacity="0.3" /></g>,
              // 1: Plate + fork (meals)
              (cx, cy) => <g><circle cx={cx} cy={cy} r="8" fill="none" stroke={AC} strokeWidth="1.5" opacity="0.5" /><circle cx={cx} cy={cy} r="4" fill={AC} opacity="0.15" /><line x1={cx-2} y1={cy-10} x2={cx-2} y2={cy-5} stroke={AC} strokeWidth="1.2" strokeLinecap="round" opacity="0.4" /><line x1={cx+2} y1={cy-10} x2={cx+2} y2={cy-5} stroke={AC} strokeWidth="1.2" strokeLinecap="round" opacity="0.4" /></g>,
              // 2: WiFi signal
              (cx, cy) => <g><circle cx={cx} cy={cy+4} r="2" fill={AC} opacity="0.5" /><path d={`M${cx-6} ${cy-2} Q${cx} ${cy-7} ${cx+6} ${cy-2}`} fill="none" stroke={AC} strokeWidth="1.5" strokeLinecap="round" opacity="0.4" /><path d={`M${cx-10} ${cy-6} Q${cx} ${cy-13} ${cx+10} ${cy-6}`} fill="none" stroke={AC} strokeWidth="1.5" strokeLinecap="round" opacity="0.3" /></g>,
              // 3: Snowflake (AC)
              (cx, cy) => <g><line x1={cx} y1={cy-8} x2={cx} y2={cy+8} stroke={PR} strokeWidth="1.5" strokeLinecap="round" opacity="0.4" /><line x1={cx-7} y1={cy-4} x2={cx+7} y2={cy+4} stroke={PR} strokeWidth="1.5" strokeLinecap="round" opacity="0.4" /><line x1={cx-7} y1={cy+4} x2={cx+7} y2={cy-4} stroke={PR} strokeWidth="1.5" strokeLinecap="round" opacity="0.4" /><circle cx={cx} cy={cy} r="2" fill={PR} opacity="0.3" /></g>,
              // 4: Shower head (bath)
              (cx, cy) => <g><rect x={cx-1} y={cy-10} width="2" height="10" rx="1" fill={AC} opacity="0.4" /><circle cx={cx} cy={cy-10} r="4" fill="none" stroke={AC} strokeWidth="1.5" opacity="0.4" /><line x1={cx-3} y1={cy+2} x2={cx-3} y2={cy+6} stroke={AC} strokeWidth="1" strokeLinecap="round" opacity="0.3" /><line x1={cx} y1={cy+2} x2={cx} y2={cy+7} stroke={AC} strokeWidth="1" strokeLinecap="round" opacity="0.3" /><line x1={cx+3} y1={cy+2} x2={cx+3} y2={cy+5} stroke={AC} strokeWidth="1" strokeLinecap="round" opacity="0.3" /></g>,
              // 5: Shield (safety)
              (cx, cy) => <g><path d={`M${cx} ${cy-10} L${cx+9} ${cy-5} L${cx+9} ${cy+2} C${cx+9} ${cy+8} ${cx+4} ${cy+12} ${cx} ${cy+13} C${cx-4} ${cy+12} ${cx-9} ${cy+8} ${cx-9} ${cy+2} L${cx-9} ${cy-5} Z`} fill={PR} opacity="0.15" /><path d={`M${cx} ${cy-10} L${cx+9} ${cy-5} L${cx+9} ${cy+2} C${cx+9} ${cy+8} ${cx+4} ${cy+12} ${cx} ${cy+13} C${cx-4} ${cy+12} ${cx-9} ${cy+8} ${cx-9} ${cy+2} L${cx-9} ${cy-5} Z`} fill="none" stroke={PR} strokeWidth="1" opacity="0.3" /><path d={`M${cx-3} ${cy} L${cx-1} ${cy+3} L${cx+4} ${cy-3}`} fill="none" stroke={PR} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.5" /></g>,
            ];
            const iconLabels = ['Bed', 'Meals', 'WiFi', 'AC', 'Bath', 'Safe'];
            const labelColors = [AC, PR, AC, PR, AC, PR];

            return (
              <g>
                {[0,1].map(row => [0,1,2].map(col => {
                  const idx = row * 3 + col;
                  const cx = 124 + col * 78 + 24;
                  const cy = 115 + row * 90 + 22;
                  return (
                    <motion.g key={`pg-${idx}`}
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5, delay: 0.3 + idx * 0.25 }}
                    >
                      {icons[idx](cx, cy)}
                      <text x={cx} y={cy + 20} textAnchor="middle" fill={labelColors[idx]} fontSize="6" fontWeight="600" opacity="0.7">{iconLabels[idx]}</text>
                    </motion.g>
                  );
                }))}
                {/* Sharing badges removed */}
              </g>
            );
          })()}
        </g>

        {/* ── Scene 0: Magnifying glass moves to each window ── */}
        {scene === 0 && (() => {
          // Window center positions (matches the 3x3 grid)
          const winCenters = [0,1].flatMap(row => [0,1,2].map(col => ({
            x: 124 + col * 78 + 24,
            y: 115 + row * 90 + 26,
          })));
          const target = winCenters[glassIdx] || winCenters[0];
          return (
            <g>
              <motion.g animate={{ x: target.x, y: target.y }} transition={{ duration: 0.9, ease: [0.25, 0.4, 0.25, 1] }}>
                <circle r="22" fill="white" filter="url(#ds)" opacity="0.85" />
                <circle r="12" fill="none" stroke={PR} strokeWidth="2.5" />
                <line x1="9" y1="9" x2="16" y2="16" stroke={PR} strokeWidth="2.5" strokeLinecap="round" />
                <motion.circle cx="-3" cy="-3" r="2" fill={PR} animate={{ opacity: [0,1,0] }} transition={{ duration: 0.8, repeat: Infinity }} />
              </motion.g>
              {/* Highlight ring on target window */}
              <motion.rect
                x={winCenters[glassIdx].x - 28} y={winCenters[glassIdx].y - 30}
                width="56" height="58" rx="6"
                fill="none" stroke={PR} strokeWidth="2" strokeDasharray="4"
                animate={{ opacity: [0, 0.5, 0.5, 0] }}
                transition={{ duration: 0.8 }}
                key={glassIdx}
              />
            </g>
          );
        })()}

        {/* ── Scene 2: Chat bubbles coming out of windows ── */}
        {scene === 2 && (
          <g>
            {/* Bubble 1 — from top-left window (124,141) → left side */}
            <motion.g initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4, duration: 0.5 }}>
              <rect x="125" y="96" width="80" height="22" rx="8" fill="white" filter="url(#ds)" />
              <path d="M148 118 L145 125 L153 118" fill="white" />
              <text x="165" y="111" textAnchor="middle" fill="#455A64" fontSize="6.5" fontWeight="500">Room available?</text>
            </motion.g>
            {/* Bubble 2 — from top-right window (280,141) → right side */}
            <motion.g initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 1.2, duration: 0.5 }}>
              <rect x="256" y="96" width="88" height="22" rx="8" fill={PR} filter="url(#ds)" />
              <path d="M304 118 L307 125 L299 118" fill={PR} />
              <text x="300" y="111" textAnchor="middle" fill="white" fontSize="6.5" fontWeight="500">Yes! Near metro 🚇</text>
            </motion.g>
            {/* Bubble 3 — from bottom-left window (124,231) → left side */}
            <motion.g initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 2.2, duration: 0.5 }}>
              <rect x="120" y="186" width="78" height="22" rx="8" fill="white" filter="url(#ds)" />
              <path d="M148 208 L145 215 L153 208" fill="white" />
              <text x="159" y="201" textAnchor="middle" fill="#455A64" fontSize="6.5" fontWeight="500">Budget ₹12k ok?</text>
            </motion.g>
            {/* Bubble 4 — from bottom-right window (280,231) → right side */}
            <motion.g initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 3.2, duration: 0.5 }}>
              <rect x="253" y="186" width="96" height="22" rx="8" fill={AC} filter="url(#ds)" />
              <path d="M304 208 L307 215 L299 208" fill={AC} />
              <text x="301" y="201" textAnchor="middle" fill="white" fontSize="6.5" fontWeight="500">Perfect, let's connect!</text>
            </motion.g>
          </g>
        )}

        {/* ── Scene 3: People walking toward building ── */}
        {scene === 3 && (
          <g>
            <Person x={60} y={380} color={PR} delay={0.3} />
            <Person x={120} y={385} color={AC} scale={0.9} delay={0.7} />
            <Person x={340} y={385} color={AC} scale={0.9} delay={1.1} />
            <Person x={400} y={380} color={PR} delay={1.5} />

            {/* Walking arrows */}
            <motion.path d="M78 387 L170 387" stroke={PR} strokeWidth="1" strokeDasharray="3" opacity="0.3" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.8, delay: 0.5 }} />
            <motion.path d="M383 387 L290 387" stroke={AC} strokeWidth="1" strokeDasharray="3" opacity="0.3" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.8, delay: 1.3 }} />

            {/* Team badge */}
            <motion.g initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 2.2, ease: 'backOut' }}>
              <rect x="190" y="402" width="80" height="22" rx="11" fill={AC} filter="url(#ds)" />
              <text x="230" y="417" textAnchor="middle" fill="white" fontSize="9" fontWeight="700">Team of 4!</text>
            </motion.g>
          </g>
        )}

        {/* ── Scene 4: Matched celebration ── */}
        {scene === 4 && (
          <g>
            {/* Two people meeting at door */}
            <motion.g initial={{ x: -30 }} animate={{ x: 0 }} transition={{ duration: 0.8 }}>
              <Person x={190} y={380} color={PR} />
            </motion.g>
            <motion.g initial={{ x: 30 }} animate={{ x: 0 }} transition={{ duration: 0.8, delay: 0.3 }}>
              <Person x={270} y={380} color={AC} />
            </motion.g>

            {/* Heart */}
            <motion.g initial={{ scale: 0 }} animate={{ scale: [0,1.4,1] }} transition={{ delay: 1.0, duration: 0.6, ease: 'backOut' }}>
              <path d="M222 365 C222 358,228 356,232 361 C236 356,242 358,242 365 C242 374,232 380,232 380 C232 380,222 374,222 365Z" fill={PR} />
            </motion.g>

            {/* Handshake line */}
            <motion.line x1="202" y1="385" x2="258" y2="385" stroke={AC} strokeWidth="2" strokeDasharray="4" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.9, duration: 0.6 }} opacity="0.4" />

            {/* Match badge */}
            <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.6 }}>
              <rect x="185" y="410" width="90" height="24" rx="12" fill={PR} filter="url(#ds)" />
              <text x="230" y="426" textAnchor="middle" fill="white" fontSize="10" fontWeight="700">92% Matched!</text>
            </motion.g>

            {/* Confetti */}
            {[
              {x:130,y:80},{x:330,y:90},{x:110,y:200},{x:350,y:190},
              {x:160,y:60},{x:300,y:70},{x:140,y:280},{x:320,y:270},
              {x:100,y:140},{x:360,y:150},{x:180,y:50},{x:280,y:55},
            ].map((d, i) => (
              <motion.rect key={i} x={d.x} y={d.y}
                width={i % 3 === 0 ? 6 : 4} height={i % 3 === 0 ? 3 : 5} rx="1"
                fill={[PR,AC,PR,AC,PR,AC,PR,AC,PR,AC,PR,AC][i]}
                initial={{ opacity: 0, rotate: 0 }}
                animate={{ opacity: [0,1,0], y: [d.y, d.y - 30], rotate: [0, 180 + i * 30] }}
                transition={{ duration: 1.4, delay: 1.8 + i * 0.06 }}
              />
            ))}
          </g>
        )}

        {/* ── Status badge (top) ── */}
        <motion.g key={scene} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
          <rect x="150" y="5" width="160" height="26" rx="13" fill={colors[scene]} filter="url(#ds)" />
          {scene < 4 && (
            <motion.g animate={{ opacity: [0.3,1,0.3] }} transition={{ duration: 0.6, repeat: Infinity }}>
              <circle cx="168" cy="18" r="2" fill="white" opacity="0.7" />
              <circle cx="175" cy="18" r="2" fill="white" opacity="0.5" />
              <circle cx="182" cy="18" r="2" fill="white" opacity="0.3" />
            </motion.g>
          )}
          <text x={scene < 4 ? 245 : 230} y="22" textAnchor="middle" fill="white" fontSize="10" fontWeight="700">{labels[scene]}</text>
        </motion.g>

        {/* Progress dots removed */}
      </svg>
    </motion.div>
  );
}


/* ══════════════════════════════════════════════
   LANDING PAGE
   ══════════════════════════════════════════════ */

export default function Landing() {
  const [location, setLocation] = useState('');
  const navigate = useNavigate();
  const handleSearch = (e) => { e.preventDefault(); navigate(`/search?location=${encodeURIComponent(location)}`); };

  return (
    <div className="min-h-screen bg-white overflow-hidden">
      <Navbar />

      {/* ══ HERO ══ */}
      <section className="relative hero-mesh">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/[0.04] rounded-full blur-[100px] -translate-y-1/3 translate-x-1/4 animate-pulse-soft" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-primary/[0.03] rounded-full blur-[80px] translate-y-1/3 -translate-x-1/4" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20 relative z-10">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            {/* Left — text */}
            <div>
              <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-primary/10 to-primary/10 text-primary text-xs font-bold px-3.5 py-1.5 rounded-full mb-5 border border-primary/10">
                <Sparkles size={13} className="text-primary" /> India's #1 Flatmate & Room Finder
              </motion.div>

              <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.05 }}
                className="text-4xl sm:text-5xl lg:text-[3.4rem] font-extrabold text-dark leading-[1.1] mb-5 tracking-tight">
                Find Compatible <span className="text-gradient">Flatmates</span>,{' '}
                <span className="text-gradient">Rooms</span> & <span className="text-gradient">PGs</span>
              </motion.h1>

              <motion.p initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }}
                className="text-muted text-base leading-relaxed mb-6 max-w-lg">
                Smart matching across <strong className="text-dark">50+ cities</strong>. Zero brokerage. Verified profiles, secure chat, and lifestyle-based compatibility scoring.
              </motion.p>

              <motion.form onSubmit={handleSearch} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.15 }}
                className="flex flex-col sm:flex-row gap-2 max-w-lg mb-5">
                <div className="flex-1 relative">
                  <MapPin size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-primary" />
                  <input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Enter city — Mumbai, Bangalore..."
                    className="w-full pl-10 pr-4 py-3.5 rounded-2xl border-2 border-gray-100 bg-white text-dark placeholder-muted/50 outline-none focus:border-primary/30 focus:shadow-lg focus:shadow-primary/5 transition-all text-sm font-medium" />
                </div>
                <Button type="submit" size="lg" className="rounded-2xl shadow-lg shadow-primary/20 px-6">
                  <Search size={16} /> Search
                </Button>
              </motion.form>

              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
                className="flex flex-wrap gap-4 text-xs text-muted">
                <span className="flex items-center gap-1"><BadgeCheck size={14} className="text-primary" /> Verified Profiles</span>
                <span className="flex items-center gap-1"><Lock size={14} className="text-primary" /> Secure Chat</span>
                <span className="flex items-center gap-1"><Percent size={14} className="text-secondary" /> Zero Brokerage</span>
              </motion.div>
            </div>

            {/* Right — animated apartment SVG */}
            <div className="hidden lg:block">
              <HeroApartment />
            </div>
          </div>
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
