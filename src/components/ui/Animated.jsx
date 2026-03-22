import { useRef, useEffect, useState } from 'react';
import { motion, useInView, useMotionValue, useTransform, animate } from 'framer-motion';

// ── Animated number counter ──
export function Counter({ from = 0, to, duration = 2, suffix = '', prefix = '' }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const count = useMotionValue(from);
  const rounded = useTransform(count, (v) => Math.round(v).toLocaleString('en-IN'));
  const [display, setDisplay] = useState(from.toLocaleString('en-IN'));

  useEffect(() => {
    if (isInView) {
      const controls = animate(count, to, { duration, ease: 'easeOut' });
      const unsubscribe = rounded.on('change', (v) => setDisplay(v));
      return () => { controls.stop(); unsubscribe(); };
    }
  }, [isInView, count, to, duration, rounded]);

  return <span ref={ref}>{prefix}{display}{suffix}</span>;
}

// ── Spotlight hover card ──
export function SpotlightCard({ children, className = '' }) {
  const ref = useRef(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [isHover, setIsHover] = useState(false);

  const handleMouseMove = (e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    setPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
      className={`relative overflow-hidden ${className}`}
    >
      {isHover && (
        <div
          className="pointer-events-none absolute -inset-px opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{
            background: `radial-gradient(400px circle at ${pos.x}px ${pos.y}px, rgba(108,99,255,0.08), transparent 60%)`,
          }}
        />
      )}
      {children}
    </div>
  );
}

// ── Text gradient animation ──
export function GradientText({ children, className = '' }) {
  return (
    <span className={`bg-gradient-to-r from-primary via-primary-light to-dark bg-clip-text text-transparent ${className}`}>
      {children}
    </span>
  );
}

// ── Infinite marquee ──
export function Marquee({ children, speed = 30, className = '' }) {
  return (
    <div className={`overflow-hidden ${className}`}>
      <motion.div
        className="flex gap-8 w-max"
        animate={{ x: ['0%', '-50%'] }}
        transition={{ duration: speed, repeat: Infinity, ease: 'linear' }}
      >
        {children}
        {children}
      </motion.div>
    </div>
  );
}

// ── Bento grid item with hover glow ──
export function BentoCard({ children, className = '', glowColor = 'rgba(108,99,255,0.15)' }) {
  const ref = useRef(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  return (
    <motion.div
      ref={ref}
      onMouseMove={(e) => {
        if (!ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
      }}
      whileHover={{ y: -4 }}
      className={`group relative bg-white rounded-3xl border border-gray-100 overflow-hidden transition-shadow duration-500 hover:shadow-2xl hover:shadow-primary/5 ${className}`}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: `radial-gradient(300px circle at ${mousePos.x}px ${mousePos.y}px, ${glowColor}, transparent 60%)`,
        }}
      />
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}

// ── Staggered reveal container ──
export function StaggerContainer({ children, className = '', stagger = 0.08 }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={{
        visible: { transition: { staggerChildren: stagger } },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ── Stagger child item ──
export function StaggerItem({ children, className = '' }) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 24 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.4, 0.25, 1] } },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ── Reveal on scroll ──
export function Reveal({ children, className = '', delay = 0 }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.25, 0.4, 0.25, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
