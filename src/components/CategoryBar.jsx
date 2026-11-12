import React from 'react';
import { Layers, Sparkles } from 'lucide-react';

export function CategoryBar({ 
  activeCategory = 'all', 
  onSelectCategory, 
  lang = 'ar' 
}) {
  const isArabic = lang === 'ar';

  const categories = [
    { id: 'all', name: 'الكل', enName: 'All' },
    { id: 'popular', name: 'شائع', enName: 'Popular' },
    { id: 'trending', name: 'تريند', enName: 'Trending' },
    { id: 'action', name: 'أكشن', enName: 'Action' },
    { id: 'fantasy', name: 'فانتازيا', enName: 'Fantasy' },
    { id: 'murim', name: 'موريم', enName: 'Murim' },
    { id: 'romance', name: 'رومانسي', enName: 'Romance' },
    { id: 'comedy', name: 'كوميديا', enName: 'Comedy' },
    { id: 'drama', name: 'دراما', enName: 'Drama' },
  ];

  return (
    <section className="w-full px-4 sm:px-6 lg:px-8 pt-2 pb-10 select-none">
      <div className="max-w-7xl mx-auto p-5 sm:p-6 rounded-[28px] apple-glass">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl apple-glass-pill flex items-center justify-center text-[#e64626]">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-white tracking-wide">
                {isArabic ? 'استكشف حسب التصنيف' : 'Explore by Genre'}
              </h3>
              <p className="text-[11px] text-zinc-400">
                {isArabic ? 'تصفح مكتبة MADO حسب النوع والتصنيف المفضل' : 'Browse MADO titles by your favorite genres'}
              </p>
            </div>
          </div>

          {activeCategory !== 'all' && (
            <button
              onClick={() => onSelectCategory('all')}
              className="text-[11px] text-zinc-400 hover:text-white underline cursor-pointer self-start sm:self-auto"
            >
              {isArabic ? 'إعادة ضبط (عرض الكل)' : 'Reset filter'}
            </button>
          )}
        </div>

        {/* Category Filter Pills Strip */}
        <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar py-1">
          {categories.map((cat) => {
            const isActive = activeCategory === cat.id;
            const label = isArabic ? cat.name : cat.enName;

            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(isActive && cat.id !== 'all' ? 'all' : cat.id)}
                className={`px-4 sm:px-5 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'bg-[#e64626] text-white font-bold shadow-[0_4px_16px_rgba(230,70,38,0.4)] scale-105'
                    : 'apple-glass-pill text-zinc-300 hover:text-white hover:bg-white/[0.12]'
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>

      </div>
    </section>
  );
}
