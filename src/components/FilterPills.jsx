import React from 'react';

export function FilterPills({ 
  categories, 
  activeCategory, 
  onSelectCategory, 
  lang 
}) {
  const isArabic = lang === 'ar';

  return (
    <div className="w-full px-4 py-2.5 overflow-x-auto hide-scrollbar">
      <div className="flex items-center gap-2.5 min-w-max">
        {categories.map((cat) => {
          const isActive = activeCategory === cat.id;
          const label = isArabic ? cat.name : cat.enName;

          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`transition-all duration-300 font-semibold text-xs sm:text-sm px-5 py-2 rounded-full cursor-pointer whitespace-nowrap ${
                isActive
                  ? 'bg-gradient-to-r from-[#ff4d29] to-[#ff6a3d] text-white font-bold shadow-[0_4px_16px_rgba(255,77,41,0.45)] border border-[#ff7b52]/50 scale-105'
                  : 'bg-white/[0.05] hover:bg-white/[0.09] text-zinc-400 hover:text-white border border-white/5 hover:border-white/10'
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
