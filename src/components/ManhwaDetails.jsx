import React, { useState } from 'react';
import { 
  ArrowLeft, Play, Heart, Layers, 
  Calendar, BookOpen, Search, Share2, Sparkles, ChevronRight, ArrowUpRight, MessageSquare, Send 
} from 'lucide-react';

export function ManhwaDetails({ 
  manhwa, 
  onBack, 
  onReadChapter, 
  onToggleBookmark, 
  isBookmarked 
}) {
  const [chapterSearch, setChapterSearch] = useState('');
  const [newCommentText, setNewCommentText] = useState('');
  const [comments, setComments] = useState([]);

  if (!manhwa) return null;

  const chapters = manhwa.chapters || [];
  const latestChapter = chapters[0];
  const firstChapter = chapters[chapters.length - 1];

  const filteredChapters = chapters.filter(c => 
    c.number.toString().includes(chapterSearch) || 
    (c.title && c.title.toLowerCase().includes(chapterSearch.toLowerCase()))
  );

  const handleAddComment = (e) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;
    const newComment = {
      id: Date.now(),
      user: 'قارئ MADO',
      text: newCommentText.trim(),
      date: 'الآن'
    };
    setComments([newComment, ...comments]);
    setNewCommentText('');
  };

  const scrollToComments = () => {
    const el = document.getElementById('comments-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative w-full min-h-screen bg-[#07080b] text-white">
      
      {/* ============================================================== */}
      {/* MOBILE LAYOUT (< md): 1:1 CLEAN APPLE GLASS DETAILS            */}
      {/* ============================================================== */}
      <div className="md:hidden relative w-full pb-36">
        
        {/* Top Hero Artwork Banner */}
        <div className="relative w-full h-[400px] overflow-hidden">
          <img
            src={manhwa.banner || manhwa.cover}
            alt={manhwa.title}
            className="w-full h-full object-cover object-center brightness-[0.82]"
          />

          {/* Deep Cinematic Vignette Gradients */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#07080b] via-[#07080b]/50 to-black/40" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-transparent" />

          {/* Floating Top Navigation Bar */}
          <div className="absolute top-4 inset-x-4 flex items-center justify-between z-30">
            <button
              onClick={onBack}
              className="w-10 h-10 rounded-full apple-glass flex items-center justify-center text-white shadow-xl active:scale-90 transition-transform cursor-pointer"
              title="رجوع"
            >
              <ArrowLeft className="w-5 h-5 rotate-180" />
            </button>

            <span className="text-[11px] font-bold tracking-wider px-3 py-1 rounded-full apple-glass-pill text-white">
              {manhwa.genres?.[0] || 'مانهوا'} • {manhwa.status || 'مستمر'}
            </span>

            <button
              onClick={() => onToggleBookmark(manhwa.id)}
              className="relative w-10 h-10 rounded-full apple-glass flex items-center justify-center text-white shadow-xl active:scale-90 transition-transform cursor-pointer"
              title="حفظ"
            >
              <Heart className={`w-5 h-5 ${isBookmarked ? 'fill-[#e64626] text-[#e64626]' : 'text-white'}`} />
              {isBookmarked && (
                <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#e64626] ring-2 ring-black" />
              )}
            </button>
          </div>

          {/* Center Play Icon Overlay */}
          {latestChapter && (
            <div 
              onClick={() => onReadChapter(manhwa, latestChapter)}
              className="absolute inset-0 flex flex-col items-center justify-center z-20 cursor-pointer active:scale-95 transition-transform"
            >
              <div className="w-16 h-16 rounded-full apple-glass flex items-center justify-center shadow-2xl border border-white/20 active:bg-[#e64626]">
                <Play className="w-7 h-7 fill-white text-white mr-1" />
              </div>
              <span className="text-[11px] font-bold text-white tracking-widest uppercase mt-2 drop-shadow">
                قراءة فورية
              </span>
            </div>
          )}

          {/* Artwork Bottom Edge Indicators (No stars, purely clean white/gray text) */}
          <div className="absolute bottom-5 inset-x-5 flex items-center justify-between text-[11px] text-zinc-300 font-medium z-20">
            <span>{manhwa.views} قراءة</span>
            <span>{comments.length} تعليق</span>
          </div>
        </div>

        {/* Content Section */}
        <div className="relative px-5 -mt-2 z-20 space-y-4">
          
          {/* Main Title & Author */}
          <div>
            <h1 className="text-2xl font-black text-white tracking-tight leading-tight">
              {manhwa.arabicTitle}
            </h1>
            <p className="text-xs text-zinc-400 mt-1 font-medium">
              {manhwa.title} • للمؤلف {manhwa.author}
            </p>
          </div>

          {/* Dual Action Buttons */}
          <div className="flex items-center gap-2.5 pt-1">
            {latestChapter ? (
              <button
                onClick={() => onReadChapter(manhwa, latestChapter)}
                className="flex-1 h-12 rounded-2xl bg-[#e64626] hover:bg-[#d43d1f] active:bg-[#ba3317] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-[0_6px_20px_rgba(230,70,38,0.4)] transition-all cursor-pointer active:scale-95"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>قراءة أحدث فصل ({latestChapter.number})</span>
              </button>
            ) : (
              <button
                onClick={() => onReadChapter(manhwa, firstChapter)}
                className="flex-1 h-12 rounded-2xl bg-[#e64626] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-xl"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>ابدأ القراءة الآن</span>
              </button>
            )}

            {firstChapter && (
              <button
                onClick={() => onReadChapter(manhwa, firstChapter)}
                className="h-12 px-5 rounded-2xl apple-glass-pill hover:bg-white/[0.12] text-white font-semibold text-xs transition-all cursor-pointer active:scale-95"
              >
                الفصل 1
              </button>
            )}
          </div>

          {/* 3 Metric Capsules (Strictly Pure White Text, No Emojis, Comments instead of Rating) */}
          <div className="grid grid-cols-3 gap-2.5 pt-1">
            
            {/* Card 1: الفصول */}
            <div className="p-3 rounded-2xl apple-glass-card flex flex-col justify-between">
              <span className="text-[10px] text-zinc-400 font-medium block truncate mb-1.5">
                الفصول
              </span>
              <span className="px-2 py-1 rounded-xl bg-black/60 text-center text-[11px] font-bold text-white truncate border border-white/5">
                {chapters.length || manhwa.chaptersCount || 1} فصل
              </span>
            </div>

            {/* Card 2: التعليقات (Replaces Rating) */}
            <div 
              onClick={scrollToComments}
              className="p-3 rounded-2xl apple-glass-card flex flex-col justify-between cursor-pointer active:scale-95 transition-transform"
            >
              <span className="text-[10px] text-zinc-400 font-medium block truncate mb-1.5">
                التعليقات
              </span>
              <span className="px-2 py-1 rounded-xl bg-black/60 text-center text-[11px] font-bold text-white truncate border border-white/5">
                {comments.length} تعليق
              </span>
            </div>

            {/* Card 3: الحالة (Pure White Text) */}
            <div className="p-3 rounded-2xl apple-glass-card flex flex-col justify-between">
              <span className="text-[10px] text-zinc-400 font-medium block truncate mb-1.5">
                الحالة
              </span>
              <span className="px-2 py-1 rounded-xl bg-black/60 text-center text-[11px] font-bold text-white truncate border border-white/5">
                {manhwa.status || 'مستمر'}
              </span>
            </div>

          </div>

          {/* Synopsis Description */}
          <div className="p-4 rounded-2xl apple-glass-card text-xs text-zinc-300 leading-relaxed font-normal">
            <h3 className="text-xs font-bold text-white mb-1.5">قصة العمل</h3>
            <p>{manhwa.synopsis}</p>
          </div>

          {/* Horizontal Preview Cards Strip */}
          <div className="pt-2">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold text-white">معاينة أحدث الفصول</h3>
              <span className="text-[10px] text-zinc-400">اسحب للمزيد ←</span>
            </div>

            <div className="flex items-center gap-3 overflow-x-auto hide-scrollbar pb-2 snap-x">
              {chapters.slice(0, 4).map((ch) => (
                <div
                  key={ch.id}
                  onClick={() => onReadChapter(manhwa, ch)}
                  className="snap-start relative flex-shrink-0 w-[155px] h-[95px] rounded-2xl overflow-hidden bg-zinc-900 border border-white/10 shadow-md cursor-pointer active:scale-95 transition-transform"
                >
                  <img
                    src={ch.pages?.[0] || manhwa.banner || manhwa.cover}
                    alt={ch.title}
                    className="w-full h-full object-cover brightness-[0.7]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-7 h-7 rounded-full bg-black/60 backdrop-blur-md text-white flex items-center justify-center shadow-md">
                      <Play className="w-3 h-3 fill-white text-white mr-0.5" />
                    </div>
                  </div>

                  <div className="absolute bottom-1.5 inset-x-2">
                    <span className="text-[10px] font-bold text-white block truncate">
                      فصل {ch.number}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* All Chapters List */}
          <div className="pt-4 border-t border-white/10 space-y-2">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-bold text-white">جميع الفصول ({chapters.length})</h3>
            </div>

            <div className="space-y-2">
              {chapters.map((ch) => (
                <div
                  key={ch.id}
                  onClick={() => onReadChapter(manhwa, ch)}
                  className="flex items-center justify-between p-3 rounded-2xl apple-glass-pill hover:bg-white/[0.08] cursor-pointer transition-all active:scale-[0.98]"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-xl bg-white/5 text-white text-xs font-bold flex items-center justify-center">
                      {ch.number}
                    </span>
                    <div>
                      <h4 className="text-xs font-bold text-white">{ch.title || `فصل ${ch.number}`}</h4>
                      <span className="text-[10px] text-zinc-500">{ch.date}</span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-zinc-500 rotate-180" />
                </div>
              ))}
            </div>
          </div>

          {/* Comments Section (Mobile) */}
          <div id="comments-section" className="pt-6 border-t border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-zinc-300" />
                <span>تعليقات القراء ({comments.length})</span>
              </h3>
            </div>

            {/* Comment Form */}
            <form onSubmit={handleAddComment} className="flex items-center gap-2">
              <input
                type="text"
                placeholder="اكتب تعليقك على هذا العمل..."
                value={newCommentText}
                onChange={(e) => setNewCommentText(e.target.value)}
                className="flex-1 h-10 px-4 rounded-xl apple-glass-pill text-xs text-white placeholder-zinc-500 focus:outline-none"
              />
              <button
                type="submit"
                className="h-10 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center cursor-pointer active:scale-95 transition-all"
              >
                <Send className="w-3.5 h-3.5 rotate-180" />
              </button>
            </form>

            {/* Comments List */}
            <div className="space-y-2 pt-2">
              {comments.length === 0 ? (
                <p className="text-xs text-zinc-500 py-3 text-center">لا توجد تعليقات بعد، كن أول من يشارك برأيه!</p>
              ) : (
                comments.map((c) => (
                  <div key={c.id} className="p-3 rounded-2xl apple-glass-card space-y-1">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-bold text-white">{c.user}</span>
                      <span className="text-zinc-500">{c.date}</span>
                    </div>
                    <p className="text-xs text-zinc-300 font-normal leading-relaxed">{c.text}</p>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

      </div>

      {/* ============================================================== */}
      {/* DESKTOP / PC LAYOUT (≥ md): FULL WIDESCREEN CINEMATIC EXPERIENCE */}
      {/* ============================================================== */}
      <div className="hidden md:block w-full pb-36">
        
        {/* Widescreen Hero Section */}
        <section className="relative w-full min-h-[580px] lg:min-h-[640px] flex items-center overflow-hidden border-b border-white/[0.06]">
          
          {/* Background Artwork */}
          <div className="absolute inset-0 z-0">
            <img
              src={manhwa.banner || manhwa.cover}
              alt={manhwa.title}
              className="w-full h-full object-cover object-left-top lg:object-center brightness-[0.78] contrast-[1.05]"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#07080b]/95 via-[#07080b]/80 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#07080b] via-[#07080b]/40 to-black/30" />
          </div>

          {/* Floating Subtle Vertical Indicator on Far Edge */}
          <div className="absolute top-1/2 -translate-y-1/2 left-6 z-20 hidden xl:flex flex-col items-center gap-6 select-none opacity-60">
            <span className="text-[10px] font-mono font-bold tracking-widest text-zinc-400 [writing-mode:vertical-lr] rotate-180 uppercase">
              جودة عالية
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-white/40" />
            <span className="text-[10px] font-mono font-bold tracking-widest text-zinc-400 [writing-mode:vertical-lr] rotate-180 uppercase">
              ترجمة حصرية
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-white/40" />
            <span className="text-[10px] font-mono font-bold tracking-widest text-zinc-400 [writing-mode:vertical-lr] rotate-180 uppercase">
              فصول مستمرة
            </span>
          </div>

          {/* Main Hero Content Container */}
          <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-10 py-12 w-full flex flex-col justify-between">
            
            {/* Top Navigation Row: Back Button */}
            <div className="flex items-center justify-between mb-8">
              <button
                onClick={onBack}
                className="h-9 px-4 rounded-full apple-glass-pill hover:bg-white/[0.12] flex items-center gap-2 text-zinc-300 hover:text-white transition-all cursor-pointer text-xs font-semibold"
              >
                <ArrowLeft className="w-4 h-4 rotate-180" />
                <span>العودة للرئيسية</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => onToggleBookmark(manhwa.id)}
                  className={`h-9 px-4 rounded-full apple-glass-pill flex items-center gap-2 transition-all cursor-pointer text-xs font-semibold ${
                    isBookmarked ? 'text-[#e64626] border-[#e64626]/40' : 'text-zinc-300 hover:text-white'
                  }`}
                >
                  <Heart className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-[#e64626]' : ''}`} />
                  <span>{isBookmarked ? 'محفوظ في مكتبتي' : 'حفظ في المفضلة'}</span>
                </button>
              </div>
            </div>

            {/* Split Hero Layout */}
            <div className="grid grid-cols-12 gap-8 items-center">
              
              {/* Text Side (Right in RTL) */}
              <div className="col-span-12 md:col-span-8 lg:col-span-7 space-y-4">
                
                <div className="flex items-center gap-2 text-zinc-400 text-xs font-semibold tracking-wider">
                  <span className="text-white font-bold">عمل حصري</span>
                  <span className="w-8 h-[1px] bg-zinc-600" />
                  <span>{manhwa.genres?.[0] || 'مانهوا'} • {manhwa.status || 'مستمر'}</span>
                </div>

                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
                  {manhwa.arabicTitle}
                </h1>

                <p className="text-xs sm:text-sm lg:text-base text-zinc-300 font-normal leading-relaxed max-w-2xl line-clamp-3">
                  {manhwa.synopsis}
                </p>

                {/* Desktop 3 Metric Capsules (Pure White Text, No Emojis, Comments instead of Rating) */}
                <div className="grid grid-cols-3 gap-3 max-w-lg pt-2">
                  <div className="p-3 rounded-2xl apple-glass-card">
                    <span className="text-[11px] text-zinc-400 font-medium block mb-1">الفصول</span>
                    <span className="inline-block px-3 py-1 rounded-xl bg-black/60 text-xs font-bold text-white border border-white/5">
                      {chapters.length || manhwa.chaptersCount || 1} فصل
                    </span>
                  </div>

                  <div 
                    onClick={scrollToComments}
                    className="p-3 rounded-2xl apple-glass-card cursor-pointer hover:bg-white/[0.08] transition-colors"
                  >
                    <span className="text-[11px] text-zinc-400 font-medium block mb-1">التعليقات</span>
                    <span className="inline-block px-3 py-1 rounded-xl bg-black/60 text-xs font-bold text-white border border-white/5">
                      {comments.length} تعليق
                    </span>
                  </div>

                  <div className="p-3 rounded-2xl apple-glass-card">
                    <span className="text-[11px] text-zinc-400 font-medium block mb-1">الحالة</span>
                    <span className="inline-block px-3 py-1 rounded-xl bg-black/60 text-xs font-bold text-white border border-white/5">
                      {manhwa.status || 'مستمر'}
                    </span>
                  </div>
                </div>

                {/* Dual Action Buttons */}
                <div className="flex items-center gap-3.5 pt-2">
                  {latestChapter ? (
                    <button
                      onClick={() => onReadChapter(manhwa, latestChapter)}
                      className="h-11 sm:h-12 px-7 rounded-xl bg-[#e64626] hover:bg-[#d43d1f] text-white font-bold text-xs sm:text-sm shadow-[0_8px_25px_rgba(230,70,38,0.4)] flex items-center gap-2.5 transition-all cursor-pointer hover:scale-105 active:scale-95"
                    >
                      <Play className="w-4 h-4 fill-white" />
                      <span>قراءة أحدث فصل ({latestChapter.number})</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => onReadChapter(manhwa, firstChapter)}
                      className="h-11 sm:h-12 px-7 rounded-xl bg-[#e64626] hover:bg-[#d43d1f] text-white font-bold text-xs sm:text-sm shadow-[0_8px_25px_rgba(230,70,38,0.4)] flex items-center gap-2.5 transition-all"
                    >
                      <Play className="w-4 h-4 fill-white" />
                      <span>ابدأ القراءة الآن</span>
                    </button>
                  )}

                  {firstChapter && (
                    <button
                      onClick={() => onReadChapter(manhwa, firstChapter)}
                      className="h-11 sm:h-12 px-6 rounded-xl apple-glass-pill hover:bg-white/[0.12] text-white font-semibold text-xs sm:text-sm transition-all cursor-pointer border border-white/15"
                    >
                      الفصل الأول
                    </button>
                  )}
                </div>

              </div>

              {/* Artwork Side Trigger */}
              <div className="hidden md:flex col-span-4 lg:col-span-5 items-center justify-center">
                {latestChapter && (
                  <div 
                    onClick={() => onReadChapter(manhwa, latestChapter)}
                    className="flex flex-col items-center gap-3 group cursor-pointer"
                  >
                    <div className="w-16 h-16 lg:w-20 lg:h-20 rounded-full apple-glass flex items-center justify-center shadow-2xl group-hover:scale-110 group-hover:bg-[#e64626] transition-all duration-300 border border-white/20">
                      <Play className="w-7 h-7 lg:w-8 lg:h-8 fill-white text-white mr-1" />
                    </div>
                    <span className="text-xs font-bold text-white tracking-wider uppercase group-hover:text-zinc-200 transition-colors">
                      قراءة فورية
                    </span>
                  </div>
                )}
              </div>

            </div>

            {/* Horizontal Preview Strip */}
            <div className="mt-12 pt-6 border-t border-white/[0.08]">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold text-zinc-400">
                  فصول مميزة ومعاينة سريعة
                </span>
                <span className="text-xs text-zinc-500 font-mono">
                  {chapters.length} فصول متوفرة
                </span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {chapters.slice(0, 4).map((ch) => (
                  <div
                    key={ch.id}
                    onClick={() => onReadChapter(manhwa, ch)}
                    className="group relative h-28 lg:h-32 rounded-2xl overflow-hidden bg-zinc-900 border border-white/10 hover:border-white/25 cursor-pointer shadow-lg transition-all duration-300 hover:-translate-y-1"
                  >
                    <img
                      src={ch.pages?.[0] || manhwa.banner || manhwa.cover}
                      alt={ch.title}
                      className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500 brightness-[0.7]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-8 h-8 rounded-full bg-black/60 backdrop-blur-md text-white flex items-center justify-center group-hover:bg-[#e64626] transition-all group-hover:scale-110 shadow-md">
                        <Play className="w-3.5 h-3.5 fill-white text-white mr-0.5" />
                      </div>
                    </div>

                    <div className="absolute bottom-2.5 inset-x-3">
                      <span className="text-[10px] text-white font-bold block truncate">
                        {ch.title || `فصل ${ch.number}`}
                      </span>
                      <span className="text-[9px] text-zinc-400 block mt-0.5">
                        فصل {ch.number} • {ch.date}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </section>

        {/* Section 2: Choose The Chapter / Full Chapters Explorer & Comments */}
        <section className="max-w-7xl mx-auto px-6 lg:px-10 py-12 space-y-12">
          
          {/* Chapters Explorer */}
          <div>
            <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4 mb-8">
              <div>
                <h2 className="text-2xl lg:text-3xl font-black text-white tracking-tight">
                  اختر الفصل الذي ترغب بقراءته
                </h2>
                <p className="text-xs lg:text-sm text-zinc-400 max-w-xl mt-1.5">
                  تصفح جميع فصول مانهوا {manhwa.arabicTitle} المترجمة بأعلى جودة قراءة متواصلة.
                </p>
              </div>

              <div className="w-full md:w-64">
                <input
                  type="text"
                  placeholder="ابحث برقم الفصل..."
                  value={chapterSearch}
                  onChange={(e) => setChapterSearch(e.target.value)}
                  className="w-full h-10 px-4 rounded-xl apple-glass-pill text-xs text-white placeholder-zinc-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredChapters.map((ch) => (
                <div
                  key={ch.id}
                  onClick={() => onReadChapter(manhwa, ch)}
                  className="group p-4 rounded-2xl apple-glass-card hover:bg-white/[0.08] cursor-pointer transition-all duration-200 border border-white/5 hover:border-white/15 flex flex-col justify-between gap-3 shadow-md"
                >
                  <div className="flex items-center justify-between">
                    <span className="w-8 h-8 rounded-xl bg-white/5 group-hover:bg-[#e64626] text-white text-xs font-bold flex items-center justify-center transition-colors">
                      {ch.number}
                    </span>
                    <span className="text-[10px] text-zinc-400">
                      {ch.date}
                    </span>
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-white group-hover:text-zinc-200 truncate">
                      {ch.title || `الفصل ${ch.number}`}
                    </h4>
                    <p className="text-[11px] text-zinc-400 mt-1">
                      {ch.pages?.length || 4} صفحات • {ch.views || '1.2K'} قراءة
                    </p>
                  </div>

                  <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs">
                    <span className="text-white font-semibold group-hover:underline">
                      اقرأ الفصل الآن
                    </span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-zinc-400 group-hover:text-white transition-colors" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Desktop Comments Section */}
          <div id="comments-section" className="pt-8 border-t border-white/10">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-white" />
              <span>تعليقات ومناقشات القراء ({comments.length})</span>
            </h3>

            {/* Comment Form */}
            <form onSubmit={handleAddComment} className="flex gap-3 mb-8 max-w-2xl">
              <input
                type="text"
                placeholder="اكتب رأيك أو تعليقك حول هذا العمل..."
                value={newCommentText}
                onChange={(e) => setNewCommentText(e.target.value)}
                className="flex-1 h-12 px-5 rounded-2xl apple-glass-pill text-sm text-white placeholder-zinc-500 focus:outline-none"
              />
              <button
                type="submit"
                className="h-12 px-6 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs flex items-center gap-2 cursor-pointer transition-all"
              >
                <span>إرسال</span>
                <Send className="w-3.5 h-3.5 rotate-180" />
              </button>
            </form>

            {/* Comments Grid */}
            {comments.length === 0 ? (
              <p className="text-xs text-zinc-500 py-4">لا توجد تعليقات بعد، كن أول من يشارك برأيه!</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {comments.map((c) => (
                  <div key={c.id} className="p-4 rounded-2xl apple-glass-card space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-white">{c.user}</span>
                      <span className="text-zinc-500 text-[11px]">{c.date}</span>
                    </div>
                    <p className="text-xs text-zinc-300 leading-relaxed font-normal">{c.text}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

        </section>

      </div>

    </div>
  );
}
