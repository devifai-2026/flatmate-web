import { useState } from 'react';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { 
  Users, 
  Wallet, 
  Copy, 
  Check, 
  Share2, 
  MessageCircle, 
  Send, 
  Mail,
  ChevronRight,
  Gift,
  House,
  Star
} from 'lucide-react';
import toast from 'react-hot-toast';
import { IoLogoWhatsapp } from 'react-icons/io5';
import { SiTelegram, SiGmail } from 'react-icons/si';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import Button from '../components/ui/Button';

// Embedding the generated student image
const STUDENT_IMG = "/brain/4b00f100-c9f3-4757-b8f9-5a6097579b79/referral_student_pointing_1775469849952.png";
const CAMPUS_BG = "https://i.ibb.co/207zh86W/photo-1706016899218-ebe36844f70e-w-600-auto-format-fit-crop-q-60-ixlib-rb-4-1.jpg";

export default function Refer() {
  const { user } = useSelector((s) => s.auth);
  const [copied, setCopied] = useState(false);
  
  // Mock referral link - in reality, it would be based on user ID or a unique code
  const referralCode = user?._id?.slice(-8) || "9bacca54";
  const referralLink = `https://flatmate.com/l/${referralCode}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    toast.success('Link copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen font-outfit">
      <Navbar transparent={true} />
      
      {/* ── HERO SECTION ── sits behind the transparent navbar */}
      <div className="relative min-h-[700px] bg-dark pt-40 pb-20 overflow-hidden m-0">
        {/* Background Image - Clean & Architectural */}
        <div className="absolute inset-0 z-0">
          <img 
            src={CAMPUS_BG} 
            alt="" 
            className="w-full h-full object-cover" 
          />
          {/* Darker left-to-right gradient to ensure text readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
        </div>

          <div className="max-w-[98%] mx-auto px-4 relative z-10">
            <div className="max-w-2xl space-y-10">
              {/* Header Area - Left Aligned */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <h1 className="text-[52px] md:text-[68px] font-black text-white leading-[1.1] tracking-tight">
                  Refer a friend, and <br />
                  you both get £50
                </h1>
                <p className="text-xl text-white font-medium max-w-xl leading-relaxed opacity-90">
                  When your friend books, you both get £50. Keep sharing, keep earning — there's no limit!
                </p>
              </motion.div>

              {/* Referral Card & Stats Stack */}
              <div className="space-y-6 max-w-[480px]">
                {/* Referral Card */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-white rounded-3xl p-8 shadow-2xl border border-white/10"
                >
                  <label className="block text-base font-bold text-[#0c1b3d] mb-4">
                    Your referral link
                  </label>
                  
                  <div className="space-y-5">
                    {/* Dashed Input */}
                    <div className="w-full bg-[#FAFBFF] border border-dashed border-gray-200 rounded-xl px-5 py-5 flex items-center justify-center">
                      <p className="text-gray-400 font-medium tracking-tight text-center">
                        {referralLink}
                      </p>
                    </div>

                    {/* Action Row */}
                    <div className="flex gap-3">
                      <button 
                        onClick={handleCopy}
                        className="flex-1 bg-[#FF585D] hover:bg-[#FF484D] text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-[#FF585D]/20 text-base"
                      >
                        {copied ? 'Copied!' : 'Copy Link'}
                      </button>
                      
                      <div className="flex gap-2.5">
                        {/* WhatsApp */}
                        <button className="w-12 h-12 rounded-xl border border-gray-100 flex items-center justify-center hover:bg-emerald-50 transition-colors cursor-pointer bg-white">
                          <IoLogoWhatsapp size={26} color="#25D366" />
                        </button>
                        {/* Telegram */}
                        <button className="w-12 h-12 rounded-xl border border-gray-100 flex items-center justify-center hover:bg-sky-50 transition-colors cursor-pointer bg-white">
                          <SiTelegram size={24} color="#0088cc" />
                        </button>
                        {/* Gmail */}
                        <button className="w-12 h-12 rounded-xl border border-gray-100 flex items-center justify-center hover:bg-rose-50 transition-colors cursor-pointer bg-white">
                          <SiGmail size={22} color="#EA4335" />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Stats Integrated Underneath */}
                <div className="flex items-center gap-12 px-2">
                   <div className="flex items-center gap-4">
                      <Users size={28} className="text-white" />
                      <div>
                         <p className="text-xl font-black text-white">10,000+</p>
                         <p className="text-[12px] font-medium text-white/50">People Referred</p>
                      </div>
                   </div>
                   <div className="w-px h-10 bg-white/10" />
                   <div className="flex items-center gap-4">
                      <Wallet size={28} className="text-white" />
                      <div>
                         <p className="text-xl font-black text-white">£500K+</p>
                         <p className="text-[12px] font-medium text-white/50">Payout Disbursed</p>
                      </div>
                   </div>
                </div>
              </div>
            </div>
          </div>
        </div>


        {/* --- REFERRALS LIST --- */}
        <div className="max-w-[98%] mx-auto px-4 py-20 border-b border-gray-50">
          <h2 className="text-2xl font-black text-dark mb-10 tracking-tight">Your Referrals</h2>
          
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="bg-white rounded-2xl p-12 border border-gray-100 text-center space-y-6"
          >
            <div className="w-max mx-auto p-6 rounded-full bg-surface">
              <Gift size={40} className="text-muted/40" />
            </div>
            <div className="max-w-4xl mx-auto space-y-2">
              <p className="text-lg font-medium text-muted/60 leading-relaxed">
                Initiate your first referral by sharing your unique referral code with your friends and <span className="text-primary font-bold">earn £50</span>
              </p>
            </div>
          </motion.div>
        </div>

        {/* --- EASY AS 1,2,3 SECTION --- */}
        <div className="max-w-[98%] mx-auto px-4 pb-20">
          <h2 className="text-2xl font-black text-dark mb-10 tracking-tight">Referring Is As Easy As 1,2,3</h2>
          
          <div className="flex flex-col md:flex-row items-center gap-6">
             {/* Step 1 */}
             <div className="flex-1 bg-white p-8 rounded-2xl border border-gray-100 relative group hover:border-primary/20 transition-all">
                <div className="absolute -top-3 -left-3 w-8 h-8 bg-white border border-gray-100 rounded-lg flex items-center justify-center font-bold text-sm text-dark shadow-sm">1</div>
                <div className="space-y-4">
                   <div className="w-12 h-12 rounded-xl bg-rose-50 flex items-center justify-center text-primary">
                      <Send size={24} />
                   </div>
                   <h3 className="text-lg font-bold text-dark">You Share</h3>
                   <p className="text-sm text-muted/70 leading-relaxed">Share your unique referral link with anyone looking for an accommodation</p>
                </div>
             </div>

             <div className="hidden md:block text-gray-200">
                <ChevronRight size={32} strokeWidth={1} />
             </div>

             {/* Step 2 */}
             <div className="flex-1 bg-white p-8 rounded-2xl border border-gray-100 relative group hover:border-primary/20 transition-all">
                <div className="absolute -top-3 -left-3 w-8 h-8 bg-white border border-gray-100 rounded-lg flex items-center justify-center font-bold text-sm text-dark shadow-sm">2</div>
                <div className="space-y-4">
                   <div className="w-12 h-12 rounded-xl bg-rose-50 flex items-center justify-center text-primary">
                      <House size={24} />
                   </div>
                   <h3 className="text-lg font-bold text-dark">They Book</h3>
                   <p className="text-sm text-muted/70 leading-relaxed">When they book using your link, they get £50.</p>
                </div>
             </div>

             <div className="hidden md:block text-gray-200">
                <ChevronRight size={32} strokeWidth={1} />
             </div>

             {/* Step 3 */}
             <div className="flex-1 bg-white p-8 rounded-2xl border border-gray-100 relative group hover:border-primary/20 transition-all">
                <div className="absolute -top-3 -left-3 w-8 h-8 bg-white border border-gray-100 rounded-lg flex items-center justify-center font-bold text-sm text-dark shadow-sm">3</div>
                <div className="space-y-4">
                   <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-500">
                      <Wallet size={24} />
                   </div>
                   <h3 className="text-lg font-bold text-dark">You Earn</h3>
                   <p className="text-sm text-muted/70 leading-relaxed">You earn an easy £50 (there's no limit - more referrals = more cash)</p>
                </div>
             </div>
          </div>
        </div>

        {/* --- TERMS & CONDITIONS --- */}
        <div className="max-w-[98%] mx-auto px-4 pb-20">
           <h2 className="text-xl font-bold text-dark mb-6 tracking-tight">Terms and Conditions</h2>
           <ul className="space-y-3">
              {[
                "You can refer multiple friends and win cashback upto GBP 10,000!",
                "The referred student must be a new user, not an existing student registered with amber.",
                "The referred student must book in the property that is listed with amber."
              ].map((text, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm font-medium text-muted/60 leading-relaxed">
                   <div className="w-1.5 h-1.5 rounded-full bg-dark/20 mt-2 shrink-0" />
                   {text}
                </li>
              ))}
              <li className="pt-2">
                 <button className="text-primary font-bold text-sm flex items-center gap-1 hover:underline">
                    See More <ChevronRight size={14} className="rotate-90" />
                 </button>
              </li>
           </ul>
        </div>

        {/* --- TRUST SECTION --- */}
        <div className="bg-[#EAF5F1] py-20 overflow-hidden">
           <div className="max-w-[98%] mx-auto px-4">
             <div className="flex justify-between items-center mb-10">
                <h2 className="text-2xl font-black text-[#0B3B2C] tracking-tight">Trust of 1 Million+ students</h2>
                <div className="flex items-center gap-2 bg-[#10B981] text-white px-3 py-1.5 rounded text-[11px] font-bold">
                   <span>★ Trustpilot</span>
                   <span className="opacity-60">|</span>
                   <span>9.4K reviews</span>
                </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
                {[
                  { name: "shraddha", text: "I was trying to find an affordable accommodation in Melbourne and was getting overwhelmed.", university: "The University Of Melbourne", flag: "🇦🇺" },
                  { name: "Vishesh", text: "Fast process and communication. Great Experience.", university: "University Of Westminster", flag: "🇬🇧" },
                  { name: "Akanksha", text: "In a new city for me, Amber students really helped me find the best place to stay.", university: "Ucl School Of Management", flag: "🇬🇧" },
                  { name: "Rishabh Mehta", text: "Amber assigned one of the best agent for my Accommodation journey and he did lot's of efforts.", university: "Northumbria University", flag: "🇬🇧" },
                  { name: "Trisha Nathan", text: "My consultant was helpful throughout the accommodation process. Pleased with the services.", university: "Bayes Business School", flag: "🇬🇧" }
                ].map((item, i) => (
                   <motion.div 
                    key={i} 
                    className="min-w-[360px] bg-white p-6 rounded-xl border border-gray-100 flex flex-col justify-between shadow-sm"
                   >
                     <div>
                        <p className="text-[13px] text-dark/70 font-medium leading-relaxed italic">
                          "{item.text}" <span className="text-rose-500 font-bold not-italic cursor-pointer">Read More</span>
                        </p>
                     </div>
                     <div className="mt-8 flex items-center gap-3">
                        <div className="text-2xl">{item.flag}</div>
                        <div>
                           <p className="text-sm font-bold text-dark">{item.name}</p>
                           <p className="text-[10px] font-medium text-muted/60">{item.university}</p>
                        </div>
                     </div>
                   </motion.div>
                ))}
             </div>
           </div>
        </div>

      <Footer />
      
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes float {
          0% { transform: translateY(0px) rotate(45deg); }
          50% { transform: translateY(-15px) rotate(50deg); }
          100% { transform: translateY(0px) rotate(45deg); }
        }
      `}} />
    </div>
  );
}
