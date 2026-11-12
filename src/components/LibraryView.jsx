import React from 'react';
import { ArrowLeft, Trash2, BookOpen } from 'lucide-react';

export function LibraryView({ manhwas, bookmarks, onSelectManhwa, onToggleBookmark, onBack, lang }) {
  const isArabic = lang === 'ar';
  const bookmarkedManhwas = manhwas.filter(m => bookmarks.includes(m.id));

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-6 pb-28">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={onBack}
          className="w-9 h-9 rounded-full apple-glass-pill flex items-center justify-center text-zinc-300 hover:text-white transition-all cursor-pointer"
        >
          <ArrowLeft className={`w-4 h-4 ${isArabic ? 'rotate-180' : ''}`} />
        </button>
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">
            {isArabic ? 'المفضلة والمكتبة' : 'My Library'}
          </h2>
          <p className="text-xs text-zinc-400">
            {bookmarkedManhwas.length} {isArabic ? 'أعمال محفوظة' : 'saved titles'}
          </p>
        </div>
      </div>

      {bookmarkedManhwas.length === 0 ? (
        <div className="p-12 text-center rounded-3xl apple-glass-card text-zinc-400 text-xs sm:text-sm">
          <BookOpen className="w-8 h-8 text-zinc-500 mx-auto mb-2 opacity-60" />
          <p>{isArabic ? 'لم تقم بحفظ أي مانهوا بعد في مكتبتك' : 'No saved manhwas in your library yet'}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
          {bookmarkedManhwas.map((manhwa) => (
            <div
              key={manhwa.id}
              onClick={() => onSelectManhwa(manhwa)}
              className="flex items-center gap-3 p-3 rounded-2xl apple-glass-card hover:bg-white/[0.08] cursor-pointer transition-all"
            >
              <img
                src={manhwa.cover}
                alt={manhwa.title}
                className="w-16 h-20 rounded-xl object-cover flex-shrink-0 border border-white/10"
                loading="lazy"
                decoding="async"
              />
              <div className="flex-1 min-w-0 pr-1">
                <h4 className="text-sm font-bold text-white truncate">
                  {isArabic ? manhwa.arabicTitle : manhwa.title}
                </h4>
                <p className="text-xs text-zinc-400 truncate mt-0.5">
                  {manhwa.author} • {manhwa.views} views
                </p>
              </div>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleBookmark(manhwa.id);
                }}
                className="w-8 h-8 rounded-full apple-glass-pill flex items-center justify-center text-zinc-400 hover:text-red-400 transition-colors cursor-pointer"
                title={isArabic ? 'إزالة' : 'Remove'}
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
