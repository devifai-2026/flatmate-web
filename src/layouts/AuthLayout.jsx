import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Users, Heart, CheckCircle } from 'lucide-react';
import { AUTH_BG } from '../utils/constants';

export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen flex">
      {/* Left branding panel with real photo */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <img src={AUTH_BG} alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/90 via-primary-dark/90 to-primary-light/80" />

        {/* Animated floating orbs */}
        <motion.div
          animate={{ y: [0, -20, 0], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute top-20 right-20 w-40 h-40 bg-white/10 rounded-full blur-2xl"
        />
        <motion.div
          animate={{ y: [0, 15, 0], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 6, repeat: Infinity, delay: 2 }}
          className="absolute bottom-32 left-16 w-56 h-56 bg-white/10 rounded-full blur-3xl"
        />

        <div className="relative z-10 flex flex-col justify-between p-12 text-white w-full">
          <div>
            <Link to="/" className="flex items-center gap-2 mb-20">
              <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">F</span>
              </div>
              <span className="text-2xl font-bold">flatmate</span>
            </Link>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <h1 className="text-4xl font-extrabold leading-tight mb-4">
                Find your perfect<br />living situation
              </h1>
              <p className="text-white/60 text-lg max-w-md leading-relaxed">
                Connect with compatible roommates, discover perfect rooms, and build your ideal living arrangement.
              </p>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="mt-10 space-y-4">
              {[
                { icon: Home, text: '5,000+ verified rooms across 50+ cities' },
                { icon: Users, text: 'Smart AI-powered roommate matching' },
                { icon: Heart, text: 'Lifestyle-based compatibility scoring' },
                { icon: CheckCircle, text: '100% brokerage-free, always' },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-3 text-white/70">
                  <div className="w-9 h-9 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
                    <Icon size={16} />
                  </div>
                  <span className="text-sm">{text}</span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Testimonial */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 border border-white/10"
          >
            <p className="text-white/80 text-sm italic mb-3">"Found my perfect roommate in 3 days. The matching algorithm is genuinely smart!"</p>
            <div className="flex items-center gap-3">
              <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&q=80" alt="" className="w-8 h-8 rounded-full object-cover" />
              <div>
                <p className="text-white text-xs font-semibold">Priya Sharma</p>
                <p className="text-white/40 text-xs">Bangalore</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 bg-surface">
        <div className="w-full max-w-md">{children}</div>
      </div>
    </div>
  );
}
