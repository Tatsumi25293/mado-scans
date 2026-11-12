import React from 'react';
import { Wifi, Battery, Signal, ArrowLeft, ArrowUpRight, Flame, Star, Coins, Lock, Eye, Play } from 'lucide-react';

export function PhoneShowcase({ manhwas, onSelectManhwa, lang }) {
  const isArabic = lang === 'ar';
  const trending = manhwas.filter(m => m.isTrending);
  const featured = manhwas.find(m => m.isFeatured) || manhwas[0];
  const top10 = [...manhwas].sort((a, b) => b.rating - a.rating).slice(0, 6);

  return (
    <div className="w-full max-w-7xl mx-auto py-8 px-4">
      
      {/* Intro Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#ff4d29]/15 border border-[#ff4d29]/30 text-[#ff4d29] text-xs font-black tracking-widest uppercase mb-2">
          ✨ MADO PHONE SHOWCASE
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-white">
          {isArabic ? 'تصميم الهواتف الثلاثة تماماً كما في الصورة' : 'Exact 3-Screen Mobile Preview'}
        </h2>
        <p className="text-xs sm:text-sm text-zinc-400 max-w-xl mx-auto mt-1">
          {isArabic 
            ? 'تجسيد حقيقي للشاشات الثلاث: شاشة الاستكشاف، شاشة الهيرو والمتصدرة، وشاشة قائمة الـ 10 الأوائل' 
            : 'Explore all three screens from your reference picture side-by-side with full interactive manhwa features'}
        </p>
      </div>

      {/* 3 Phones Grid matching user's image layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
        
        {/* PHONE 1: LEFT SCREEN (DISCOVERY, POPULAR PILL, STACKED TRENDING, LATEST RELEASES) */}
        <div className="relative w-[340px] sm:w-[360px] h-[720px] rounded-[52px] bg-[#0c0d14] border-[7px] border-[#2c2b36] shadow-[0_25px_60px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col ring-1 ring-white/10">
          
          {/* Dynamic Island / Notch & Status Bar */}
          <div className="pt-3 px-6 pb-2 flex items-center justify-between text-white text-[11px] font-semibold select-none z-30">
            <span>9:30</span>
            <div className="w-24 h-5 rounded-full bg-black mx-auto flex items-center justify-center">
              <div className="w-2.5 h-2.5 rounded-full bg-zinc-900 ml-3" />
            </div>
            <div className="flex items-center gap-1.5">
              <Signal className="w-3 h-3" />
              <Wifi className="w-3 h-3" />
              <Battery className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Screen 1 Inner Content */}
          <div className="flex-1 overflow-y-auto hide-scrollbar px-4 pt-1 pb-16">
            
            {/* Header: User avatar + search bar + mic + globe */}
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-full overflow-hidden border border-white/20">
                <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80" alt="Avatar" className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 h-8 rounded-full bg-white/5 border border-white/10 px-3 flex items-center justify-between text-zinc-400 text-[11px]">
                <span>{isArabic ? 'ابحث في MADO' : 'Search on MADO'}</span>
                <span className="text-[10px]">🎙️ 🌐</span>
              </div>
            </div>

            {/* Filter Pills: Popular active pill */}
            <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar mb-4 text-[11px]">
              <span className="px-3.5 py-1 rounded-full bg-[#ff4d29] text-white font-black shadow-md">
                Popular
              </span>
              <span className="px-3 py-1 rounded-full bg-white/5 text-zinc-400 border border-white/5">
                Trending
              </span>
              <span className="px-3 py-1 rounded-full bg-white/5 text-zinc-400 border border-white/5">
                Action
              </span>
              <span className="px-3 py-1 rounded-full bg-white/5 text-zinc-400 border border-white/5">
                Fantasy
              </span>
            </div>

            {/* Stacked Cards: Robin Hood & Avengers style */}
            <div className="flex gap-2.5 mb-4">
              {trending.slice(0, 2).map((m) => (
                <div 
                  key={m.id}
                  onClick={() => onSelectManhwa(m)}
                  className="flex-1 relative h-36 rounded-2xl overflow-hidden cursor-pointer group shadow-lg"
                >
                  <img src={m.cover} alt={m.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/30" />
                  <div className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded-full bg-black/60 text-amber-400 text-[9px] font-bold flex items-center gap-0.5">
                    <Coins className="w-2.5 h-2.5" /> 10k+ 🔒
                  </div>
                  <div className="absolute bottom-2 left-2 right-2 p-1.5 rounded-xl bg-black/60 backdrop-blur-md flex items-center justify-between">
                    <div>
                      <span className="text-[8px] text-[#ff4d29] uppercase font-bold block">Action</span>
                      <span className="text-[10px] text-white font-bold block truncate">{m.arabicTitle || m.title}</span>
                    </div>
                    <div className="w-5 h-5 rounded-full bg-[#ff4d29] text-white flex items-center justify-center">
                      <ArrowUpRight className="w-3 h-3" />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Latest Releases Section */}
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs font-black text-white">Latest Releases</span>
              <span className="text-[10px] text-[#ff4d29]">••••</span>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              {manhwas.slice(2, 6).map((m) => (
                <div 
                  key={m.id}
                  onClick={() => onSelectManhwa(m)}
                  className="relative h-32 rounded-2xl overflow-hidden cursor-pointer group shadow-md"
                >
                  <img src={m.cover} alt={m.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent" />
                  <div className="absolute bottom-2 left-2 right-2">
                    <span className="text-[10px] font-bold text-white block truncate">{m.arabicTitle || m.title}</span>
                    <span className="text-[9px] text-zinc-300 block">Premier Now</span>
                  </div>
                </div>
              ))}
            </div>

          </div>

          {/* Floating Bottom Nav */}
          <div className="absolute bottom-3 left-4 right-4 h-12 rounded-full bg-[#131520]/80 backdrop-blur-xl border border-white/10 flex items-center justify-around px-4 text-zinc-400">
            <span className="text-[#ff4d29] font-bold text-xs flex flex-col items-center">🏠<span className="text-[8px]">Home</span></span>
            <span className="text-xs">💎</span>
            <span className="text-xs">🏛️</span>
            <span className="text-xs">👤</span>
          </div>
        </div>

        {/* PHONE 2: MIDDLE SCREEN (FEATURED HERO BANNER & 3D OVERLAPPING STACK) */}
        <div className="relative w-[340px] sm:w-[360px] h-[720px] rounded-[52px] bg-[#0c0d14] border-[7px] border-[#2c2b36] shadow-[0_25px_60px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col ring-1 ring-white/10 scale-105 z-20">
          
          {/* Notch & Status Bar */}
          <div className="pt-3 px-6 pb-2 flex items-center justify-between text-white text-[11px] font-semibold select-none z-30">
            <span>9:30</span>
            <div className="w-24 h-5 rounded-full bg-black mx-auto flex items-center justify-center">
              <div className="w-2.5 h-2.5 rounded-full bg-zinc-900 ml-3" />
            </div>
            <div className="flex items-center gap-1.5">
              <Signal className="w-3 h-3" />
              <Wifi className="w-3 h-3" />
              <Battery className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Screen 2 Inner Content */}
          <div className="flex-1 overflow-y-auto hide-scrollbar px-4 pt-1 pb-16">
            
            {/* Header: Avatar & Search */}
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-full overflow-hidden border border-white/20">
                <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80" alt="Avatar" className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 h-8 rounded-full bg-white/5 border border-white/10 px-3 flex items-center justify-between text-zinc-400 text-[11px]">
                <span>Search on MADO</span>
                <span className="text-[10px]">🎙️ 🌐</span>
              </div>
            </div>

            {/* Featured Hero Banner: "ACTION MANHWA 2026 / SOLO LEVELING" */}
            <div 
              onClick={() => onSelectManhwa(featured)}
              className="relative h-44 rounded-3xl overflow-hidden mb-4 cursor-pointer group shadow-2xl"
            >
              <img src={featured.banner || featured.cover} alt={featured.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
              <div className="absolute bottom-3 left-4 right-4 text-center">
                <span className="text-[9px] font-black uppercase text-[#ff4d29] tracking-widest block">
                  ACTION MANHWA 2026
                </span>
                <span className="text-xl font-black text-white uppercase tracking-tight block">
                  {featured.arabicTitle}
                </span>
              </div>
            </div>

            {/* Hero dots */}
            <div className="flex items-center justify-center gap-1.5 mb-4">
              <span className="w-4 h-1.5 rounded-full bg-[#ff4d29]" />
              <span className="w-1.5 h-1.5 rounded-full bg-white/20" />
              <span className="w-1.5 h-1.5 rounded-full bg-white/20" />
            </div>

            {/* Section: Top Trending + 10 items badge */}
            <div className="text-xs font-black text-white mb-2">Top Trending</div>

            <div className="flex items-center gap-3">
              {/* Vertical line with 10 Items */}
              <div className="flex flex-col items-center gap-1 text-[8px] font-mono font-bold text-[#ff4d29] select-none">
                <span className="[writing-mode:vertical-lr] rotate-180">10 ITEMS</span>
                <div className="w-[1.5px] h-14 bg-[#ff4d29]" />
              </div>

              {/* Overlapping Curved Stack Cards */}
              <div className="flex-1 relative h-64">
                {trending.slice(0, 3).map((m, idx) => (
                  <div
                    key={m.id}
                    onClick={() => onSelectManhwa(m)}
                    style={{
                      transform: `translateY(${idx * 16}px) scale(${1 - idx * 0.05})`,
                      zIndex: 10 - idx
                    }}
                    className="absolute inset-x-0 h-48 rounded-3xl overflow-hidden border border-white/10 shadow-2xl cursor-pointer"
                  >
                    <img src={m.cover} alt={m.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/30" />
                    
                    <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-black/60 text-amber-400 text-[9px] font-bold">
                      10k+ 🔒
                    </div>

                    <div className="absolute bottom-2 left-3 right-3 p-2 rounded-2xl bg-black/60 backdrop-blur-md flex items-center justify-between">
                      <div>
                        <span className="text-[9px] text-[#ff4d29] uppercase font-bold block">{m.genres[0]}</span>
                        <span className="text-xs text-white font-bold block truncate">{m.arabicTitle || m.title}</span>
                      </div>
                      <div className="w-6 h-6 rounded-full bg-[#ff4d29] text-white flex items-center justify-center">
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Floating Bottom Nav */}
          <div className="absolute bottom-3 left-4 right-4 h-12 rounded-full bg-[#131520]/80 backdrop-blur-xl border border-white/10 flex items-center justify-around px-4 text-zinc-400">
            <span className="text-[#ff4d29] font-bold text-xs flex flex-col items-center">🏠<span className="text-[8px]">Home</span></span>
            <span className="text-xs">💎</span>
            <span className="text-xs">🏛️</span>
            <span className="text-xs">👤</span>
          </div>
        </div>

        {/* PHONE 3: RIGHT SCREEN (TOP 10 TRENDING LIST VIEW WITH THUMBNAILS & SYNOPSIS) */}
        <div className="relative w-[340px] sm:w-[360px] h-[720px] rounded-[52px] bg-[#0c0d14] border-[7px] border-[#2c2b36] shadow-[0_25px_60px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col ring-1 ring-white/10">
          
          {/* Notch & Status Bar */}
          <div className="pt-3 px-6 pb-2 flex items-center justify-between text-white text-[11px] font-semibold select-none z-30">
            <span>9:30</span>
            <div className="w-24 h-5 rounded-full bg-black mx-auto flex items-center justify-center">
              <div className="w-2.5 h-2.5 rounded-full bg-zinc-900 ml-3" />
            </div>
            <div className="flex items-center gap-1.5">
              <Signal className="w-3 h-3" />
              <Wifi className="w-3 h-3" />
              <Battery className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Screen 3 Inner Content: Top 10 Trending List */}
          <div className="flex-1 overflow-y-auto hide-scrollbar px-4 pt-1 pb-16">
            
            {/* Header with back chevron + Top 10 Trending */}
            <div className="flex items-center gap-2 mb-4">
              <span className="text-white text-sm">‹</span>
              <h3 className="text-sm font-black text-white">Top 10 Trending</h3>
            </div>

            {/* Vertical list items matching phone 3 in screenshot */}
            <div className="space-y-3">
              {top10.map((m, idx) => (
                <div
                  key={m.id}
                  onClick={() => onSelectManhwa(m)}
                  className="flex items-center gap-2.5 p-2 rounded-2xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/5 cursor-pointer"
                >
                  <img src={m.cover} alt={m.title} className="w-14 h-16 rounded-xl object-cover flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <span className="text-xs font-black text-white block truncate">
                      {m.arabicTitle || m.title}
                    </span>
                    <span className="text-[10px] text-zinc-400 line-clamp-1 block">
                      {m.synopsis}
                    </span>
                    <span className="text-[9px] text-[#ff4d29] font-bold block mt-1">
                      {m.views} views • 1h 20min
                    </span>
                  </div>
                </div>
              ))}
            </div>

          </div>

          {/* Floating Bottom Nav */}
          <div className="absolute bottom-3 left-4 right-4 h-12 rounded-full bg-[#131520]/80 backdrop-blur-xl border border-white/10 flex items-center justify-around px-4 text-zinc-400">
            <span className="text-[#ff4d29] font-bold text-xs flex flex-col items-center">🏠<span className="text-[8px]">Home</span></span>
            <span className="text-xs">💎</span>
            <span className="text-xs">🏛️</span>
            <span className="text-xs">👤</span>
          </div>
        </div>

      </div>

    </div>
  );
}
