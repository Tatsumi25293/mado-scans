import React, { useState, useEffect } from 'react';
import { ArrowLeft, ChevronLeft, ChevronRight, Maximize2, Minimize2 } from 'lucide-react';

export function ChapterReader({ manhwa, chapter, onBack, onSelectChapter, lang }) {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const isArabic = lang === 'ar';

  const chapters = manhwa.chapters || [];
  const currentIndex = chapters.findIndex(c => c.id === chapter.id || c.number === chapter.number);
  const prevChapter = chapters[currentIndex + 1];
  const nextChapter = chapters[currentIndex - 1];

  // Track scroll percentage
  useEffect(() => {
    const handleScroll = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      if (total > 0) {
        setScrollProgress((window.scrollY / total) * 100);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Keyboard navigation on PC (Arrow keys)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight') {
        if (isArabic ? prevChapter : nextChapter) {
          window.scrollTo({ top: 0, behavior: 'smooth' });
          onSelectChapter(manhwa, isArabic ? prevChapter : nextChapter);
        }
      } else if (e.key === 'ArrowLeft') {
        if (isArabic ? nextChapter : prevChapter) {
          window.scrollTo({ top: 0, behavior: 'smooth' });
          onSelectChapter(manhwa, isArabic ? nextChapter : prevChapter);
        }
      } else if (e.key === 'Escape') {
        onBack();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [manhwa, chapter, isArabic, prevChapter, nextChapter, onSelectChapter, onBack]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

  const pages = chapter.pages && chapter.pages.length > 0 ? chapter.pages : [
    manhwa.cover,
    manhwa.banner || manhwa.cover,
    "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=900&auto=format&fit=crop&q=80"
  ];

  return (
    <div className="relative min-h-screen bg-[#07080b] text-white">
      
      {/* Top Hairline Progress Bar */}
      <div className="fixed top-0 inset-x-0 h-[2.5px] bg-white/5 z-50">
        <div 
          className="h-full bg-[#e64626] transition-all duration-150"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Floating Apple Glass Top Controls Header */}
      <header className="fixed top-3 inset-x-0 z-40 flex justify-center px-4">
        <div className="apple-glass h-11 px-4 rounded-full flex items-center justify-between gap-4 max-w-2xl w-full shadow-2xl">
          <div className="flex items-center gap-2 min-w-0">
            <button
              onClick={onBack}
              className="w-8 h-8 rounded-full apple-glass-pill flex items-center justify-center text-zinc-300 hover:text-white transition-all cursor-pointer flex-shrink-0"
              title={isArabic ? 'رجوع' : 'Back'}
            >
              <ArrowLeft className={`w-4 h-4 ${isArabic ? 'rotate-180' : ''}`} />
            </button>

            <span className="text-xs md:text-sm font-semibold text-white truncate">
              {isArabic ? manhwa.arabicTitle : manhwa.title} • فصل {chapter.number}
            </span>
          </div>

          <div className="flex items-center gap-3 flex-shrink-0">
            <span className="text-xs font-mono text-zinc-400">
              {Math.round(scrollProgress)}%
            </span>

            <button
              onClick={toggleFullscreen}
              className="hidden sm:flex w-8 h-8 rounded-full apple-glass-pill items-center justify-center text-zinc-300 hover:text-white transition-all cursor-pointer"
              title="Fullscreen"
            >
              {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Comic Webtoon Pages - Optimal Reading Width on PC and Full width on Mobile */}
      <main className="max-w-2xl mx-auto pt-18 pb-28 flex flex-col items-center">
        {pages.map((url, idx) => (
          <div key={idx} className="w-full relative bg-black shadow-2xl">
            <img
              src={url}
              alt={`Page ${idx + 1}`}
              className="w-full h-auto block select-none pointer-events-none"
              loading="lazy"
            />
          </div>
        ))}

        {/* End of chapter banner */}
        <div className="w-full max-w-lg px-6 py-10 mt-6 text-center rounded-3xl apple-glass mx-4">
          <p className="text-sm font-bold text-white mb-1">
            {isArabic ? `وصلت لنهاية الفصل ${chapter.number}` : `End of Chapter ${chapter.number}`}
          </p>
          <p className="text-xs text-zinc-400 mb-5">
            {isArabic ? 'ترجمة حصرية لمنصة MADO' : 'Exclusive release on MADO'}
          </p>

          <div className="flex items-center justify-center gap-3">
            {nextChapter && (
              <button
                onClick={() => {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                  onSelectChapter(manhwa, nextChapter);
                }}
                className="px-6 py-2.5 rounded-full bg-[#e64626] hover:bg-[#d43d1f] text-white text-xs font-semibold shadow-lg transition-all cursor-pointer"
              >
                {isArabic ? `الفصل التالي (${nextChapter.number})` : `Next Chapter (${nextChapter.number})`}
              </button>
            )}
            <button
              onClick={onBack}
              className="px-5 py-2.5 rounded-full apple-glass-pill hover:bg-white/[0.12] text-white text-xs font-medium transition-all cursor-pointer"
            >
              {isArabic ? 'قائمة الفصول' : 'All Chapters'}
            </button>
          </div>
        </div>
      </main>

      {/* Floating Bottom Nav for Reader */}
      <footer className="fixed bottom-4 inset-x-0 z-40 flex justify-center px-4">
        <div className="apple-glass h-11 px-5 rounded-full flex items-center gap-4 text-xs shadow-2xl">
          <button
            disabled={!prevChapter}
            onClick={() => {
              window.scrollTo({ top: 0, behavior: 'smooth' });
              onSelectChapter(manhwa, prevChapter);
            }}
            className={`cursor-pointer font-medium transition-colors ${
              prevChapter ? 'text-white hover:text-zinc-200' : 'text-zinc-600 cursor-not-allowed'
            }`}
          >
            {isArabic ? 'السابق' : 'Prev'}
          </button>

          <span className="text-zinc-400 font-medium px-2 border-x border-white/10">
            فصل {chapter.number}
          </span>

          <button
            disabled={!nextChapter}
            onClick={() => {
              window.scrollTo({ top: 0, behavior: 'smooth' });
              onSelectChapter(manhwa, nextChapter);
            }}
            className={`cursor-pointer font-bold transition-colors ${
              nextChapter ? 'text-[#e64626] hover:text-[#ff5b3d]' : 'text-zinc-600 cursor-not-allowed'
            }`}
          >
            {isArabic ? 'التالي' : 'Next'}
          </button>
        </div>
      </footer>

    </div>
  );
}
