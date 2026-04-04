import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Star, Mail, MessageCircle, Phone, Instagram, Youtube, MessageSquare, 
  Linkedin, Twitter as TwitterIcon, LucidePin as Pinterest 
} from 'lucide-react';
import { FaCcVisa, FaCcMastercard, FaCcAmex, FaApple, FaGooglePlay } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100 pt-24 pb-12 font-outfit">
      <div className="max-w-[90%] mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-16 mb-20">
          {/* Brand + Trustpilot */}
          <div className="md:col-span-4 flex flex-col gap-8 text-left">
            <div>
              <h2 className="text-2xl font-black text-dark mb-1 tracking-tight">amber</h2>
              <p className="text-gray-400 text-sm font-medium">amber © 2026. All rights reserved.</p>
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-1.5">
                <Star size={18} className="fill-[#00b67a] text-[#00b67a]" />
                <span className="text-xl font-black text-dark">Trustpilot</span>
              </div>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map(i => (
                  <div key={i} className="w-9 h-9 bg-[#00b67a] rounded-sm flex items-center justify-center">
                    <Star size={18} className="fill-white text-white" />
                  </div>
                ))}
              </div>
              <p className="text-xs font-bold text-gray-500">TrustScore <span className="text-dark">4.8 | 9,423 reviews</span></p>
            </div>

            <div className="bg-gray-50 rounded-2xl p-6 flex flex-col gap-6">
              <div className="flex items-center gap-8">
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase mb-3">Get the app</p>
                  <div className="flex gap-2">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" alt="Play Store" className="h-6 cursor-pointer" />
                    <img src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg" alt="App Store" className="h-6 cursor-pointer" />
                  </div>
                </div>
                <div className="w-[1px] h-12 bg-gray-200" />
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase mb-3">Payment Options</p>
                  <div className="flex gap-4 items-center">
                    <FaCcVisa className="text-3xl text-gray-400 hover:text-blue-600 transition-colors cursor-pointer" title="Visa" />
                    <FaCcMastercard className="text-3xl text-gray-400 hover:text-orange-500 transition-colors cursor-pointer" title="Mastercard" />
                    <FaCcAmex className="text-3xl text-gray-400 hover:text-blue-400 transition-colors cursor-pointer" title="American Express" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Links Columns */}
          <div className="md:col-span-2 flex flex-col gap-6 text-left">
            <h3 className="font-black text-dark text-sm tracking-tight capitalize">Company</h3>
            <ul className="flex flex-col gap-3.5">
              {['About', 'How it works', 'Refer a Friend', 'Group Bookings', 'List with us', 'Partner with us', 'Universities', 'Careers'].map(link => (
                <li key={link} className="text-sm font-medium text-gray-400 hover:text-primary transition-colors cursor-pointer flex items-center gap-2">
                  {link}
                  {(link === 'Group Bookings' || link === 'List with us' || link === 'Partner with us' || link === 'Universities') && <span className="text-[9px] font-black bg-pink-50 text-pink-500 px-1.5 py-0.5 rounded uppercase">New</span>}
                  {link === 'Careers' && <span className="text-[9px] font-black bg-pink-50 text-pink-500 px-1.5 py-0.5 rounded uppercase">We are hiring!</span>}
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-2 flex flex-col gap-6 text-left">
            <h3 className="font-black text-dark text-sm tracking-tight capitalize">Discover</h3>
            <ul className="flex flex-col gap-3.5">
              {['Blog', 'Podcast', 'Newsroom', 'Amber Plus', 'Media Mention', 'Ambassador', 'Scholarships', 'Exams'].map(link => (
                <li key={link} className="text-sm font-medium text-gray-400 hover:text-primary transition-colors cursor-pointer flex items-center gap-2">
                  {link}
                  {link === 'Scholarships' && <span className="text-[9px] font-black text-primary hover:underline uppercase">Apply Now</span>}
                  {link === 'Exams' && <span className="text-[9px] font-black bg-pink-50 text-pink-500 px-1.5 py-0.5 rounded uppercase">New</span>}
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-2 flex flex-col gap-6 text-left">
            <h3 className="font-black text-dark text-sm tracking-tight capitalize">Support</h3>
            <ul className="flex flex-col gap-3.5">
              {['Help Center', 'Contact', 'T&C', 'Privacy Policy', 'Sitemap'].map(link => (
                <li key={link} className="text-sm font-medium text-gray-400 hover:text-primary transition-colors cursor-pointer">{link}</li>
              ))}
            </ul>
          </div>

          {/* Contact Us */}
          <div className="md:col-span-2 flex flex-col gap-6 text-left">
            <h3 className="font-black text-dark text-sm tracking-tight capitalize">Contact us</h3>
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl border border-gray-100 text-gray-400 text-xs font-bold hover:border-primary transition-all cursor-pointer whitespace-nowrap">
                <Mail size={14} className="text-pink-400 flex-shrink-0" />
                contact@amberstudent.com
              </div>
              <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl border border-gray-100 text-gray-400 text-xs font-bold hover:border-primary transition-all cursor-pointer">
                <MessageCircle size={14} className="text-green-500 flex-shrink-0" />
                WhatsApp
              </div>
              <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl border border-gray-100 text-gray-400 text-xs font-bold hover:border-primary transition-all cursor-pointer whitespace-nowrap">
                <Phone size={14} className="text-pink-400 flex-shrink-0" />
                +91 8035735724
              </div>
            </div>

            <div className="flex flex-col gap-4 mt-4">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Follow us on:</p>
              <div className="flex gap-3">
                {[Instagram, Youtube, MessageSquare, Linkedin, TwitterIcon, Pinterest].map((Icon, i) => (
                  <button key={i} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-primary hover:text-white transition-all">
                    <Icon size={14} />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
