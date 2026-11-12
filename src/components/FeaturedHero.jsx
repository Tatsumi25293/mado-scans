import React, { useState, useEffect } from 'react';
import { Play, BookOpen } from 'lucide-react';

export function FeaturedHero({ manhwas, onSelectManhwa, lang }) {
  const featured = manhwas.filter(m => m.isFeatured || m.rating >= 4.9);
  const [currentIndex, setCurrentIndex] = useState(0);
  const isArabic = lang === 'ar';

  const current = featured[currentIndex] || manhwas[0];

  useEffect(() => {
    if (featured.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % featured.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [featured.length]);

  if (!current) return null;

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 pt-2 pb-4">
      <div className="max-w-7xl mx-auto">
        
        {/* Main Hero Card (Responsive: Compact on mobile, Widescreen Cinematic on PC) */}
        <div 
          onClick={() => onSelectManhwa(current)}
          className="relative aspect-[16/10] sm:aspect-[21/9] md:h-[380px] lg:h-[420px] w-full rounded-[28px] md:rounded-[36px] overflow-hidden bg-[#13141b] border border-white/10 shadow-2xl cursor-pointer group transition-transform active:scale-[0.99]"
        >
          {/* Cover / Banner Image */}
          <img 
            src={current.banner || current.cover} 
            alt={current.title}
            className="w-full h-full object-cover object-center brightness-[0.82] group-hover:scale-105 transition-transform duration-700 ease-out"
          />

          {/* Clean Dark Vignette Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0b0c10] via-black/40 to-black/20" />
          <div className="hidden md:block absolute inset-0 bg-gradient-to-r from-[#0b0c10]/90 via-transparent to-transparent" />

          {/* Typography Layer (Mobile: Centered bottom like picture; Desktop: Left/Right aligned with details) */}
          <div className="absolute inset-0 flex flex-col items-center md:items-start justify-end pb-5 md:pb-8 px-5 md:px-10 text-center md:text-start select-none">
            
            <span className="text-[10px] md:text-xs font-bold tracking-[0.25em] text-zinc-300 uppercase drop-shadow">
              {current.genres?.[0] || 'ACTION'} MANHWA 2026
            </span>

            <h2 className="text-2xl sm:text-3xl md:text-5xl font-black text-white tracking-tight uppercase mt-0.5 md:mt-1 drop-shadow-md">
              {isArabic ? current.arabicTitle : current.title}
            </h2>

            {/* Desktop-only synopsis excerpt */}
            <p className="hidden md:block text-xs lg:text-sm text-zinc-300 max-w-xl mt-2 line-clamp-2 drop-shadow">
              {isArabic ? current.synopsis : (current.synopsisEn || current.synopsis)}
            </p>

            {/* Desktop-only CTA buttons */}
            <div className="hidden md:flex items-center gap-3 mt-4">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectManhwa(current);
                }}
                className="px-6 py-2.5 rounded-full bg-[#e64626] hover:bg-[#d43d1f] text-white text-xs lg:text-sm font-semibold flex items-center gap-2 shadow-lg transition-all"
              >
                <Play className="w-3.5 h-3.5 fill-white" />
                <span>{isArabic ? 'اقرأ الآن' : 'Read Now'}</span>
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectManhwa(current);
                }}
                className="px-5 py-2.5 rounded-full apple-glass-pill hover:bg-white/[0.12] text-white text-xs lg:text-sm font-medium transition-all"
              >
                <span>{isArabic ? 'تفاصيل العمل' : 'Details'}</span>
              </button>
            </div>

          </div>
        </div>

        {/* Minimalist 3 Dots (Apple style matching picture) */}
        <div className="flex items-center justify-center gap-1.5 pt-3">
          {featured.slice(0, 3).map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`transition-all duration-300 rounded-full cursor-pointer ${
                currentIndex === idx 
                  ? 'w-5 h-1.5 bg-[#e64626] shadow-[0_0_8px_rgba(230,70,38,0.7)]' 
                  : 'w-1.5 h-1.5 bg-zinc-700/60 hover:bg-zinc-500'
              }`}
            />
          ))}
        </div>

      </div>
    </div>
  );
}
