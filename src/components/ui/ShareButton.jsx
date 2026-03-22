import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Share2, Link2, Copy, Check } from 'lucide-react';
import toast from 'react-hot-toast';

/**
 * Share button — native share on mobile, copy link on desktop.
 * @param {string} url - Full URL to share (defaults to current page)
 * @param {string} title - Share title
 * @param {string} size - 'sm' for cards, 'lg' for detail pages
 */
export default function ShareButton({ url, title = 'Check this out on FlatMate', size = 'sm', className = '' }) {
  const [copied, setCopied] = useState(false);
  const shareUrl = url || window.location.href;

  const handleShare = async (e) => {
    e.stopPropagation();
    e.preventDefault();

    // Try native share first (mobile)
    if (navigator.share) {
      try {
        await navigator.share({ title, url: shareUrl });
        return;
      } catch {
        // User cancelled or not supported
      }
    }

    // Fallback — copy to clipboard
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast.success('Link copied!');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Failed to copy');
    }
  };

  if (size === 'lg') {
    return (
      <button onClick={handleShare}
        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl bg-surface border border-dark/6 text-dark text-sm font-medium hover:bg-dark/5 transition-all cursor-pointer ${className}`}>
        {copied ? <Check size={16} className="text-primary" /> : <Share2 size={16} />}
        {copied ? 'Copied!' : 'Share'}
      </button>
    );
  }

  return (
    <button onClick={handleShare}
      className={`w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm hover:bg-white text-muted hover:text-dark transition-all cursor-pointer ${className}`}
      title="Share">
      {copied ? <Check size={14} className="text-primary" /> : <Share2 size={14} />}
    </button>
  );
}
