import React, { useState } from 'react';
import { Search, X, Mic } from 'lucide-react';

export function SearchModal({ isOpen, onClose, manhwas, onSelectManhwa, lang }) {
  const [query, setQuery] = useState('');
  const isArabic = lang === 'ar';

  if (!isOpen) return null;

  const filtered = manhwas.filter((m) => {
    if (!query) return true;
    const q = query.toLowerCase();
    return (
      m.title.toLowerCase().includes(q) ||
      m.arabicTitle.includes(q) ||
      (m.author && m.author.toLowerCase().includes(q))
    );
  });

  return (
    <div 
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-start justify-center pt-14 px-4 bg-black/60 backdrop-blur-2xl animate-in fade-in duration-200"
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md apple-glass rounded-[32px] overflow-hidden flex flex-col max-h-[75vh]"
      >
        {/* Search Input */}
        <div className="p-3.5 border-b border-white/10 flex items-center gap-2.5">
          <Search className="w-4 h-4 text-zinc-400 flex-shrink-0" />
          <input
            type="text"
            autoFocus
            placeholder={isArabic ? 'ابحث في MADO...' : 'Search on MADO...'}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent text-sm text-white placeholder-zinc-500 focus:outline-none"
          />
          {query && (
            <button onClick={() => setQuery('')} className="text-zinc-400 hover:text-white p-1">
              <X className="w-3.5 h-3.5" />
            </button>
          )}
          <button onClick={onClose} className="text-xs text-zinc-400 hover:text-white px-2 py-1 rounded-full apple-glass-pill">
            {isArabic ? 'إلغاء' : 'Cancel'}
          </button>
        </div>

        {/* Results */}
        <div className="p-3 overflow-y-auto space-y-2 flex-1">
          {filtered.map((m) => (
            <div
              key={m.id}
              onClick={() => {
                onSelectManhwa(m);
                onClose();
              }}
              className="flex items-center gap-3 p-2 rounded-2xl apple-glass-pill hover:bg-white/[0.1] cursor-pointer transition-all"
            >
              <img
                src={m.cover}
                alt={m.title}
                className="w-10 h-14 rounded-xl object-cover flex-shrink-0 border border-white/10"
                loading="lazy"
                decoding="async"
              />
              <div className="flex-1 min-w-0">
                <h4 className="text-xs font-bold text-white truncate">
                  {isArabic ? m.arabicTitle : m.title}
                </h4>
                <p className="text-[11px] text-zinc-400 truncate mt-0.5">
                  {m.author} • {m.genres?.[0]}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
