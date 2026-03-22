import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

// Lightbox — full screen image viewer
function Lightbox({ images, index, onClose }) {
  const [current, setCurrent] = useState(index);
  const prev = () => setCurrent((c) => (c - 1 + images.length) % images.length);
  const next = () => setCurrent((c) => (c + 1) % images.length);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-dark/95 flex items-center justify-center" onClick={onClose}>
      <button onClick={onClose} className="absolute top-4 right-4 w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-white/20 cursor-pointer z-10">
        <X size={20} />
      </button>
      {images.length > 1 && (
        <>
          <button onClick={(e) => { e.stopPropagation(); prev(); }} className="absolute left-4 w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-white/20 cursor-pointer z-10">
            <ChevronLeft size={20} />
          </button>
          <button onClick={(e) => { e.stopPropagation(); next(); }} className="absolute right-4 w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-white/20 cursor-pointer z-10">
            <ChevronRight size={20} />
          </button>
        </>
      )}
      <img src={images[current]} alt="" className="max-w-[90vw] max-h-[85vh] object-contain rounded-lg" onClick={(e) => e.stopPropagation()} />
      {images.length > 1 && (
        <div className="absolute bottom-6 flex gap-1.5">
          {images.map((_, i) => (
            <button key={i} onClick={(e) => { e.stopPropagation(); setCurrent(i); }}
              className={`w-2 h-2 rounded-full transition-all cursor-pointer ${i === current ? 'bg-white w-5' : 'bg-white/30'}`} />
          ))}
        </div>
      )}
    </motion.div>
  );
}

/**
 * Image carousel with thumbnails and lightbox.
 * @param {string[]} images - Array of image URLs
 * @param {string} alt - Alt text
 * @param {number} height - Height class (default h-72)
 */
export default function ImageCarousel({ images = [], alt = '', className = '' }) {
  const [current, setCurrent] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  if (images.length === 0) return null;

  const prev = () => setCurrent((c) => (c - 1 + images.length) % images.length);
  const next = () => setCurrent((c) => (c + 1) % images.length);

  return (
    <>
      <div className={`relative rounded-2xl overflow-hidden ${className}`}>
        {/* Main image */}
        <img
          src={images[current]}
          alt={alt}
          className="w-full h-full object-cover cursor-pointer"
          onClick={() => setLightboxOpen(true)}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-dark/30 to-transparent pointer-events-none" />

        {/* Navigation arrows */}
        {images.length > 1 && (
          <>
            <button onClick={prev} className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm hover:bg-white cursor-pointer transition-all">
              <ChevronLeft size={16} className="text-dark" />
            </button>
            <button onClick={next} className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm hover:bg-white cursor-pointer transition-all">
              <ChevronRight size={16} className="text-dark" />
            </button>
          </>
        )}

        {/* Counter */}
        {images.length > 1 && (
          <div className="absolute bottom-3 right-3 bg-dark/60 backdrop-blur-sm text-white text-xs font-medium px-2.5 py-1 rounded-full">
            {current + 1} / {images.length}
          </div>
        )}

        {/* Dots */}
        {images.length > 1 && images.length <= 6 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1">
            {images.map((_, i) => (
              <button key={i} onClick={() => setCurrent(i)}
                className={`h-1.5 rounded-full transition-all cursor-pointer ${i === current ? 'w-4 bg-white' : 'w-1.5 bg-white/50'}`} />
            ))}
          </div>
        )}
      </div>

      {/* Thumbnail strip */}
      {images.length > 1 && (
        <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
          {images.map((img, i) => (
            <button key={i} onClick={() => { setCurrent(i); }}
              className={`flex-shrink-0 w-16 h-12 rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                i === current ? 'border-primary shadow-sm' : 'border-transparent opacity-60 hover:opacity-100'
              }`}>
              <img src={img} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxOpen && <Lightbox images={images} index={current} onClose={() => setLightboxOpen(false)} />}
      </AnimatePresence>
    </>
  );
}
