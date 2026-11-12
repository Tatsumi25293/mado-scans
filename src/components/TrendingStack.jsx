import React, { useState } from 'react';
import { Eye, Lock, ArrowUpRight, ChevronRight } from 'lucide-react';

export function TrendingStack({ manhwas, onSelectManhwa, lang, onSeeAll }) {
  if (!manhwas || manhwas.length === 0) return null;

  const trending = manhwas.filter(m => m.isTrending);
  const isArabic = lang === 'ar';

  const stackItems = [
    trending[0] || manhwas[0],
    trending[1] || manhwas[1],
    trending[2] || manhwas[2],
  ].filter(Boolean);

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 pt-3 pb-8 md:pb-12">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <h3 
              onClick={onSeeAll}
              className="text-base sm:text-lg md:text-xl font-bold text-white tracking-wide cursor-pointer hover:text-zinc-200 transition-colors"
            >
              Top Trending
            </h3>
          </div>

          <button
            onClick={onSeeAll}
            className="flex items-center gap-1 text-xs text-zinc-400 hover:text-white transition-colors cursor-pointer"
          >
            <span>{isArabic ? 'عرض كل التريند' : 'View All'}</span>
            <ChevronRight className={`w-3.5 h-3.5 ${isArabic ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {/* MOBILE LAYOUT (< md): Exact Match to Picture with Vertical "10 Items" Indicator & Overlapping Cards */}
        <div className="md:hidden relative flex items-start gap-4">
          
          {/* Vertical Indicator: Orange Dash + Dashed dots + 10 Items */}
          <div className="flex flex-col items-center gap-2 pt-6 select-none flex-shrink-0">
            <div className="w-[3px] h-3.5 rounded-full bg-[#e64626]" />
            <div className="flex flex-col gap-1.5 py-1">
              <span className="w-1 h-1 rounded-full bg-zinc-600/60" />
              <span className="w-1 h-1 rounded-full bg-zinc-600/60" />
              <span className="w-1 h-1 rounded-full bg-zinc-600/60" />
              <span className="w-1 h-1 rounded-full bg-zinc-600/60" />
            </div>
            <span className="text-[10px] font-medium text-zinc-400 tracking-wider [writing-mode:vertical-lr] rotate-180 mt-2">
              {trending.length || 10} Items
            </span>
          </div>

          {/* Overlapping Stacked Cards Container */}
          <div className="flex-1 relative h-[360px] sm:h-[390px]">
            
            {/* Card 1: Top-Right Background Card */}
            {stackItems[1] && (
              <div
                onClick={() => onSelectManhwa(stackItems[1])}
                className="absolute top-0 right-0 w-[84%] h-[200px] rounded-[26px] overflow-hidden bg-zinc-900 border border-white/10 shadow-xl cursor-pointer transition-transform active:scale-[0.98] z-10"
              >
                <img 
                  src={stackItems[1].cover} 
                  alt={stackItems[1].title} 
                  className="w-full h-full object-cover brightness-[0.85]" 
                  loading="lazy"
                  decoding="async"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />
                
                <div className="absolute top-3 left-3 flex items-center gap-1.5 z-20">
                  <div className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#f4a100]/90 backdrop-blur-md text-zinc-950 font-bold text-[10px] shadow-sm">
                    <Eye className="w-2.5 h-2.5" />
                    <span>10k+</span>
                  </div>
                  <div className="w-5 h-5 rounded-full bg-[#e64626] text-white flex items-center justify-center shadow-sm">
                    <Lock className="w-2.5 h-2.5" />
                  </div>
                </div>
              </div>
            )}

            {/* Card 2: Main Foreground Card */}
            {stackItems[0] && (
              <div
                onClick={() => onSelectManhwa(stackItems[0])}
                className="absolute top-[85px] left-0 w-[88%] h-[220px] rounded-[28px] overflow-hidden bg-zinc-900 border border-white/15 shadow-[0_20px_40px_rgba(0,0,0,0.8)] cursor-pointer transition-transform active:scale-[0.98] z-20"
              >
                <img 
                  src={stackItems[0].cover} 
                  alt={stackItems[0].title} 
                  className="w-full h-full object-cover brightness-[0.9]" 
                  loading="lazy"
                  decoding="async"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/20" />
                
                <div className="absolute top-3.5 left-3.5 flex items-center gap-1.5 z-30">
                  <div className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#f4a100]/90 backdrop-blur-md text-zinc-950 font-bold text-[10px] shadow-sm">
                    <Eye className="w-2.5 h-2.5" />
                    <span>10k+</span>
                  </div>
                  <div className="w-5 h-5 rounded-full bg-[#e64626] text-white flex items-center justify-center shadow-sm">
                    <Lock className="w-2.5 h-2.5" />
                  </div>
                </div>

                <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between">
                  <div className="min-w-0 pr-2">
                    <span className="text-[10px] font-bold text-zinc-300 uppercase tracking-wider block">
                      {stackItems[0].genres?.[0] || 'Romance'}
                    </span>
                    <h4 className="text-sm font-bold text-white truncate">
                      {isArabic ? stackItems[0].arabicTitle : stackItems[0].title}
                    </h4>
                  </div>
                  <div className="w-7 h-7 rounded-full bg-white/10 backdrop-blur-md text-white flex items-center justify-center flex-shrink-0">
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            )}

            {/* Card 3: Bottom Peeking Card */}
            {stackItems[2] && (
              <div
                onClick={() => onSelectManhwa(stackItems[2])}
                className="absolute top-[200px] right-2 w-[78%] h-[170px] rounded-[24px] overflow-hidden bg-zinc-900 border border-white/10 shadow-lg cursor-pointer z-10"
              >
                <img 
                  src={stackItems[2].cover} 
                  alt={stackItems[2].title} 
                  className="w-full h-full object-cover brightness-[0.8]" 
                  loading="lazy"
                  decoding="async"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/30" />
                
                <div className="absolute top-3 left-3 flex items-center gap-1.5 z-20">
                  <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#f4a100]/90 backdrop-blur-md text-zinc-950 font-bold text-[9px]">
                    <Eye className="w-2 h-2" />
                    <span>10k+</span>
                  </div>
                  <div className="w-4 h-4 rounded-full bg-[#e64626] text-white flex items-center justify-center">
                    <Lock className="w-2 h-2" />
                  </div>
                </div>
              </div>
            )}

          </div>

        </div>

        {/* DESKTOP / PC LAYOUT (≥ md): Natural, Widescreen Apple Glass Grid with Badges */}
        <div className="hidden md:grid md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-5">
          {trending.slice(0, 4).map((manhwa) => (
            <div
              key={manhwa.id}
              onClick={() => onSelectManhwa(manhwa)}
              className="group relative h-[320px] rounded-[26px] overflow-hidden bg-zinc-900 border border-white/10 hover:border-white/20 shadow-xl cursor-pointer transition-all duration-300 hover:-translate-y-1.5"
            >
              <img
                src={manhwa.cover}
                alt={manhwa.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 brightness-[0.88]"
                loading="lazy"
                decoding="async"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/30" />

              {/* Badges: Yellow 10k+ Pill + Red-Orange Lock Circle (Exact match) */}
              <div className="absolute top-3.5 left-3.5 flex items-center gap-1.5 z-20">
                <div className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#f4a100]/90 backdrop-blur-md text-zinc-950 font-bold text-[10px] shadow-sm">
                  <Eye className="w-2.5 h-2.5" />
                  <span>10k+</span>
                </div>
                <div className="w-5 h-5 rounded-full bg-[#e64626] text-white flex items-center justify-center shadow-sm">
                  <Lock className="w-2.5 h-2.5" />
                </div>
              </div>

              {/* Bottom Frosted Glass Card Footer with Arrow Button */}
              <div className="absolute bottom-3 left-3 right-3 p-3.5 rounded-2xl apple-glass flex items-center justify-between gap-2 shadow-2xl">
                <div className="flex-1 min-w-0 pr-1">
                  <span className="text-[10px] font-bold text-zinc-300 uppercase tracking-wider block">
                    {manhwa.genres?.[0] || 'Action'}
                  </span>
                  <h4 className="text-sm font-bold text-white truncate">
                    {isArabic ? manhwa.arabicTitle : manhwa.title}
                  </h4>
                  <p className="text-[11px] text-zinc-400 truncate">
                    {manhwa.chaptersCount || manhwa.chapters?.length || 1} {isArabic ? 'فصل' : 'chs'}
                  </p>
                </div>

                <div className="w-7 h-7 rounded-full bg-white/10 group-hover:bg-[#e64626] text-white flex items-center justify-center transition-all flex-shrink-0">
                  <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
