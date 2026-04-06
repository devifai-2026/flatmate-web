import React from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronRight, Gift, Zap, Star, Sparkles, Coins } from 'lucide-react';
import MainLayout from '../layouts/MainLayout';

const IMAGES = {
  REFERRAL: "https://i.ibb.co/C5PzCzb1/photo-1606695252368-b2a09b5f324a-w-600-auto-format-fit-crop-q-60-ixlib-rb-4-1.jpg",
  CASHBACK: "https://i.ibb.co/hFTzMgT2/photo-1689143943908-729b4335c6dd-w-600-auto-format-fit-crop-q-60-ixlib-rb-4-1.jpg",
  AMBERPLUS: "https://i.ibb.co/CKwrF5d7/photo-1735827401351-dbfb001546d3-w-600-auto-format-fit-crop-q-60-ixlib-rb-4-1.jpg"
};

const COIN_ICON = "https://i.ibb.co/hR8YV4P/gold-coin.png";

export default function Offers() {
  const navigate = useNavigate();

  const offers = [
    {
      title: "Refer a friend, and you both get £50",
      description: "Turn connections into rewards. Get credited after successful booking.",
      btnText: "Refer Now",
      btnLink: "/refer",
      image: IMAGES.REFERRAL,
      bg: "bg-[#FFF8F0]", // Warm Peach
      borderColor: "border-[#FF585D]/10",
      accent: "#FF585D"
    },
    {
      title: "Get additional £20 cashback on your booking!",
      description: "Book your student accommodation via the amber app to avail this offer!",
      btnText: "Avail Now",
      btnLink: "/search",
      image: IMAGES.CASHBACK,
      bg: "bg-[#F0F7FF]", // Cool Azure
      borderColor: "border-[#FF585D]/10",
      accent: "#FF585D"
    },
    {
      title: "Save up to £300 with amber+",
      description: "Get exclusive discounts from 150+ trusted partners at this one-stop student platform",
      btnText: "Claim Now",
      btnLink: "/support",
      image: IMAGES.AMBERPLUS,
      bg: "bg-[#FAF4F0]", // Soft Sand
      borderColor: "border-pink-100",
      accent: "#FF585D"
    }
  ];

  return (
    <MainLayout>
      <div className="min-h-screen bg-[#F8F9FB] pt-26 pb-4 font-outfit">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          
          {/* --- BREADCRUMBS --- */}
          <nav className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-muted/60 mb-3">
            <Link to="/" className="hover:text-primary transition-colors">Home</Link>
            <ChevronRight size={10} className="opacity-50" />
            <Link to="/profile" className="hover:text-primary transition-colors">Profile</Link>
            <ChevronRight size={10} className="opacity-50" />
            <span className="text-primary opacity-80">Offers</span>
          </nav>

          {/* --- HEADER --- */}
          <div className="mb-10">
            <h1 className="text-3xl font-black text-[#0c1b3d] mb-1">Offers</h1>
            <p className="text-sm font-medium text-muted/80">3 offers available for you</p>
          </div>

          {/* --- MAIN PAGE CARD --- */}
          <div className="bg-white rounded-[2.5rem] p-10 shadow-2xl shadow-dark/5 border border-white/5 space-y-8">
            
            {offers.map((offer, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className={`relative overflow-hidden rounded-3xl h-[240px] group hover:shadow-xl transition-all duration-500 border ${offer.borderColor}`}
              >
                {/* --- FULL BACKGROUND IMAGE --- */}
                <div className="absolute inset-0 z-0">
                  <img 
                    src={offer.image} 
                    alt="" 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" 
                  />
                  {/* Subtle Color Overlay + Gradient to ensure text readability */}
                  <div className={`absolute inset-0 ${offer.bg} opacity-10`} />
                  <div className="absolute inset-0 bg-gradient-to-r from-white/80 via-white/30 to-transparent" />
                </div>

                {/* --- CONTENT LAYER --- */}
                <div className="relative z-10 p-10 flex flex-col justify-center h-full max-w-[60%]">
                  <h3 className="text-2xl font-black text-[#0c1b3d] mb-3 leading-tight">
                    {offer.title}
                  </h3>
                  
                  <div className="h-1 w-24 rounded-full mb-4 opacity-30 bg-[#FF585D]" />

                  <p className="text-sm font-medium text-muted/80 mb-8 leading-relaxed">
                    {offer.description}
                  </p>

                  <button 
                    onClick={() => navigate(offer.btnLink)}
                    className="w-fit px-8 py-3 bg-[#FF585D] hover:bg-[#FF484D] text-white font-black text-[12px] uppercase tracking-wider rounded-xl transition-all shadow-lg shadow-[#FF585D]/20 active:scale-95 cursor-pointer"
                  >
                    {offer.btnText}
                  </button>
                </div>

                {/* --- FLOATING DECORATIONS --- */}
                <motion.div 
                  animate={{ y: [0, -15, 0], rotate: [0, 5, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute top-8 right-1/4 w-12 h-12 pointer-events-none drop-shadow-xl z-20"
                >
                  <div className="bg-gradient-to-tr from-yellow-600 to-yellow-200 rounded-full w-full h-full flex items-center justify-center border-2 border-white/40">
                     <span className="text-white font-black text-lg">$</span>
                  </div>
                </motion.div>

                <motion.div 
                  animate={{ y: [0, 15, 0], rotate: [20, 25, 20] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                  className="absolute bottom-8 right-12 w-14 h-14 pointer-events-none drop-shadow-xl z-20"
                >
                  <div className="bg-gradient-to-tr from-yellow-600 to-yellow-200 rounded-full w-full h-full flex items-center justify-center border-2 border-white/40">
                     <span className="text-white font-black text-lg">$</span>
                  </div>
                </motion.div>
              </motion.div>
            ))}

          </div>

        </div>
      </div>
    </MainLayout>
  );
}
