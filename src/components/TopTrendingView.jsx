import React from 'react';
import { ArrowLeft, ChevronRight, Eye, Lock } from 'lucide-react';

export function TopTrendingView({ manhwas, onSelectManhwa, onBack, lang }) {
  const isArabic = lang === 'ar';

  // Sort by rating & views to get top 10
  const top10 = [...manhwas]
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 10);

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-6 pb-28">
      
      {/* Top Header Matching Picture 3: Back arrow + Title */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={onBack}
          className="w-9 h-9 rounded-full apple-glass-pill flex items-center justify-center text-zinc-300 hover:text-white transition-all cursor-pointer"
        >
          <ArrowLeft className={`w-4 h-4 ${isArabic ? 'rotate-180' : ''}`} />
        </button>
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">
            Top 10 Trending
          </h2>
          <p className="text-xs text-zinc-400">
            {isArabic ? 'أعلى الأعمال قراءة وتفضيلاً في MADO' : 'Most popular and highest-rated titles this week'}
          </p>
        </div>
      </div>

      {/* Ranked List: 1 col on mobile, 2 cols on PC */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
        {top10.map((manhwa, index) => {
          const rank = index + 1;

          return (
            <div
              key={manhwa.id}
              onClick={() => onSelectManhwa(manhwa)}
              className="group relative flex items-center gap-3 p-3 rounded-2xl apple-glass-card hover:bg-white/[0.08] cursor-pointer transition-all duration-200"
            >
              {/* Rank number */}
              <span className={`w-6 text-center text-xs font-black ${rank <= 3 ? 'text-[#e64626]' : 'text-zinc-500'}`}>
                {rank}
              </span>

              {/* Cover Art Thumbnail */}
              <div className="relative w-16 h-20 rounded-xl overflow-hidden bg-zinc-900 flex-shrink-0 border border-white/10">
                <img
                  src={manhwa.cover}
                  alt={manhwa.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                
                {/* Tiny lock badge */}
                <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[#e64626] text-white flex items-center justify-center text-[8px]">
                  <Lock className="w-2.5 h-2.5" />
                </div>
              </div>

              {/* Title, Synopsis Excerpt, and Metadata */}
              <div className="flex-1 min-w-0 pr-1">
                <h3 className="text-sm font-bold text-white truncate group-hover:text-zinc-200 transition-colors">
                  {isArabic ? manhwa.arabicTitle : manhwa.title}
                </h3>

                <p className="text-xs text-zinc-400 line-clamp-1 mt-0.5 font-normal">
                  {isArabic ? manhwa.synopsis : (manhwa.synopsisEn || manhwa.synopsis)}
                </p>

                <div className="flex items-center gap-2 mt-1.5 text-[11px] text-zinc-400">
                  <span className="text-[#e64626] font-medium">{manhwa.views} views</span>
                  <span>•</span>
                  <span>1h 20min</span>
                </div>
              </div>

              {/* Action Chevron */}
              <div className="text-zinc-500 group-hover:text-zinc-300 pr-1">
                <ChevronRight className={`w-4 h-4 ${isArabic ? 'rotate-180' : ''}`} />
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
}
