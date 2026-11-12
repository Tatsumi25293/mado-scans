import React from 'react';
import { Eye, Heart, Star } from 'lucide-react';

export function LatestReleases({ 
  manhwas, 
  onSelectManhwa, 
  lang, 
  onToggleBookmark, 
  bookmarks = [],
  activeCategory = 'all',
  onResetCategory
}) {
  const isArabic = lang === 'ar';

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 pt-2 pb-6 md:pb-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <h3 className="text-base sm:text-lg md:text-xl font-bold text-white tracking-wide">
              {isArabic ? 'أحدث الفصول الصادرة' : 'Latest Releases'}
            </h3>
            {activeCategory !== 'all' && (
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#e64626]/20 text-[#e64626] border border-[#e64626]/30 font-semibold">
                {activeCategory}
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            {activeCategory !== 'all' && (
              <button
                type="button"
                onClick={onResetCategory}
                className="text-xs text-zinc-400 hover:text-white underline cursor-pointer"
              >
                {isArabic ? 'عرض الكل' : 'Show All'}
              </button>
            )}
            <span className="text-xs text-zinc-400">
              {manhwas.length} {isArabic ? 'عمل متوفر' : 'titles'}
            </span>
          </div>
        </div>

        {/* Responsive Grid or Clean Empty State */}
        {manhwas.length === 0 ? (
          <div className="p-8 text-center rounded-[28px] apple-glass-card text-xs text-zinc-400">
            {isArabic ? 'لا توجد فصول منشورة بعد.' : 'No releases yet.'}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 lg:gap-5">
            {manhwas.map((manhwa) => {
              const isBookmarked = bookmarks.includes(manhwa.id);
              const latestChapter = manhwa.chapters?.[0] || { number: manhwa.chaptersCount || 1, date: 'جديد' };

              return (
                <div
                  key={manhwa.id}
                  onClick={() => onSelectManhwa(manhwa)}
                  className="group relative flex flex-col rounded-2xl md:rounded-[22px] overflow-hidden apple-glass-card hover:bg-white/[0.08] cursor-pointer transition-all duration-300 hover:-translate-y-1"
                >
                  {/* Poster Image */}
                  <div className="relative aspect-[3/4] w-full overflow-hidden bg-zinc-900">
                    <img
                      src={manhwa.cover}
                      alt={manhwa.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 brightness-[0.9]"
                      loading="lazy"
                      decoding="async"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0b0c10] via-transparent to-black/30" />

                    {/* Bookmark Button */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleBookmark(manhwa.id);
                      }}
                      className={`absolute top-2 right-2 w-7 h-7 rounded-full apple-glass-pill flex items-center justify-center transition-all ${
                        isBookmarked ? 'text-[#e64626]' : 'text-zinc-400 hover:text-white'
                      }`}
                    >
                      <Heart className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-[#e64626]' : ''}`} />
                    </button>

                    {/* Bottom Chapter Tag on image */}
                    <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-[10px] font-medium text-white">
                      <span className="px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md">
                        فصل {latestChapter.number}
                      </span>
                      <span className="text-zinc-400 text-[9px]">
                        {latestChapter.date}
                      </span>
                    </div>
                  </div>

                  {/* Info Text */}
                  <div className="p-2.5 sm:p-3 flex flex-col flex-1 justify-between">
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-white group-hover:text-zinc-200 truncate">
                        {isArabic ? manhwa.arabicTitle : manhwa.title}
                      </h4>
                      <p className="text-[10px] text-zinc-400 truncate mt-0.5">
                        {manhwa.genres?.[0]} • {manhwa.views}
                      </p>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
}
