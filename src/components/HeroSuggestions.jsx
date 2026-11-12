import React, { useRef, useState, useEffect } from 'react';
import { Eye, Lock, ArrowUpRight, ChevronLeft, ChevronRight } from 'lucide-react';

export function HeroSuggestions({ 
  manhwas = [], 
  onSelectManhwa, 
  lang = 'ar' 
}) {
  const scrollContainerRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const isArabic = lang === 'ar';

  const checkScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(Math.abs(scrollLeft) > 10);
      setCanScrollRight(Math.abs(scrollLeft) + clientWidth < scrollWidth - 10);
    }
  };

  useEffect(() => {
    checkScroll();
    const el = scrollContainerRef.current;
    if (el) {
      el.addEventListener('scroll', checkScroll);
      window.addEventListener('resize', checkScroll);
      return () => {
        el.removeEventListener('scroll', checkScroll);
        window.removeEventListener('resize', checkScroll);
      };
    }
  }, [manhwas]);

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const cardWidth = window.innerWidth < 768 ? 320 : 420;
      const scrollAmount = direction === 'left' ? -cardWidth : cardWidth;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <section className="w-full pt-3 pb-6 md:pb-10 select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Big Cards Slider or Clean Zero State */}
        {manhwas.length === 0 ? (
          <div className="mx-auto max-w-xl p-10 sm:p-14 rounded-[36px] apple-glass text-center space-y-3 my-4">
            <div className="w-12 h-12 rounded-full apple-glass-pill flex items-center justify-center text-white mx-auto">
              <Eye className="w-5 h-5 text-zinc-400" />
            </div>
            <h4 className="text-base font-bold text-white">لا توجد أعمال معروضة حالياً</h4>
            <p className="text-xs text-zinc-400 leading-relaxed max-w-md mx-auto">
              تم تصفير الموقع من الأعمال والبيانات الوهمية بنجاح. سيتم عرض بطاقات المانهوا الفخمة فور إضافتها من لوحة الإدارة.
            </p>
          </div>
        ) : (
          /* Relative Container with Floating Side Arrows & Big Cards Slider */
          <div className="relative group">
            
            {/* Floating Left Side Arrow (Above Cards) */}
            <button
              onClick={() => scroll('left')}
              className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-30 w-11 h-11 sm:w-13 sm:h-13 rounded-full apple-glass-nav flex items-center justify-center text-white shadow-[0_10px_30px_rgba(0,0,0,0.8)] hover:scale-110 active:scale-95 transition-all duration-200 cursor-pointer border border-white/20 opacity-90 hover:opacity-100"
              title={isArabic ? 'السابق' : 'Previous'}
            >
              <ChevronLeft className={`w-5 h-5 sm:w-6 sm:h-6 ${isArabic ? 'rotate-180' : ''}`} />
            </button>

            {/* Floating Right Side Arrow (Above Cards) */}
            <button
              onClick={() => scroll('right')}
              className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-30 w-11 h-11 sm:w-13 sm:h-13 rounded-full apple-glass-nav flex items-center justify-center text-white shadow-[0_10px_30px_rgba(0,0,0,0.8)] hover:scale-110 active:scale-95 transition-all duration-200 cursor-pointer border border-white/20 opacity-90 hover:opacity-100"
              title={isArabic ? 'التالي' : 'Next'}
            >
              <ChevronRight className={`w-5 h-5 sm:w-6 sm:h-6 ${isArabic ? 'rotate-180' : ''}`} />
            </button>

            {/* The Large Cards Showcase Slider */}
            <div
              ref={scrollContainerRef}
              className="flex items-center gap-5 sm:gap-7 overflow-x-auto hide-scrollbar pb-6 pt-2 px-2 sm:px-4 snap-x snap-mandatory scroll-smooth"
            >
              {manhwas.map((manhwa, index) => {
                // Tilt alternation matching the user's reference picture
                const tiltClasses = 
                  index % 3 === 0 ? 'rotate-[-1.5deg] hover:rotate-0' :
                  index % 3 === 1 ? 'rotate-[1.2deg] hover:rotate-0' :
                  'rotate-[-0.8deg] hover:rotate-0';

                return (
                  <div
                    key={manhwa.id}
                    onClick={() => onSelectManhwa(manhwa)}
                    className={`snap-start relative flex-shrink-0 w-[290px] sm:w-[340px] md:w-[380px] lg:w-[410px] h-[410px] sm:h-[480px] md:h-[530px] lg:h-[560px] rounded-[36px] sm:rounded-[42px] md:rounded-[48px] overflow-hidden bg-zinc-900 border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.8)] cursor-pointer group transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_28px_60px_rgba(0,0,0,0.95)] ${tiltClasses}`}
                  >
                    {/* Big Manhwa Cover Image */}
                    <img
                      src={manhwa.cover}
                      alt={manhwa.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out brightness-[0.88]"
                      loading="lazy"
                      decoding="async"
                    />

                    {/* Dark Vignette Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/20 to-black/30" />

                    {/* Top Badges (Exact match to picture: Yellow Views Pill + Red Lock Circle) */}
                    <div className="absolute top-4 sm:top-5 left-4 sm:left-5 flex items-center gap-2 z-20">
                      {/* Yellow Views / Coin Badge */}
                      <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#f5a623] text-zinc-950 font-black text-xs sm:text-sm shadow-lg border border-white/20">
                        <Eye className="w-3.5 h-3.5 stroke-[2.5]" />
                        <span>{manhwa.views || '10k+'}</span>
                      </div>

                      {/* Red/Orange Lock Badge */}
                      <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#e64626] text-white flex items-center justify-center shadow-lg border border-white/15">
                        <Lock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white stroke-[2.5]" />
                      </div>
                    </div>

                    {/* Bottom Frosted Glass Overlay with Genre, Title & Circular Arrow Button */}
                    <div className="absolute bottom-3.5 sm:bottom-4 inset-x-3.5 sm:inset-x-4 p-3.5 sm:p-4 md:p-5 rounded-[26px] sm:rounded-[30px] bg-black/50 backdrop-blur-2xl border border-white/15 shadow-2xl flex items-center justify-between gap-3 group-hover:bg-black/65 transition-colors z-20">
                      <div className="flex-1 min-w-0 pr-1">
                        <span className="text-[11px] sm:text-xs font-semibold text-zinc-300 uppercase tracking-wider block mb-0.5">
                          {manhwa.genres?.[0] || 'Action'}
                        </span>
                        <h3 className="text-base sm:text-lg md:text-xl font-black text-white truncate leading-tight group-hover:text-zinc-100 transition-colors">
                          {isArabic ? manhwa.arabicTitle : manhwa.title}
                        </h3>
                      </div>

                      {/* Circular Button with Diagonal Arrow (↗) */}
                      <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white/20 group-hover:bg-[#e64626] text-white flex items-center justify-center transition-all duration-300 group-hover:scale-110 shadow-lg flex-shrink-0">
                        <ArrowUpRight className="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      </div>
                    </div>

                  </div>
                );
              })}
            </div>

          </div>
        )}

      </div>
    </section>
  );
}
