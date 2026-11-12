import React, { useState } from 'react';
import { 
  Shield, Plus, Trash2, Edit3, Eye, BookOpen, 
  Layers, Settings, ArrowLeft, RefreshCw, Lock, Sparkles,
  UploadCloud, ImagePlus, X, CheckCircle, Loader2
} from 'lucide-react';
import { getAdminPassword, setAdminPassword, clearAllManhwas } from '../utils/storage';
import { processImageFile, processChapterFiles } from '../utils/imageUpload';

export function AdminDashboard({ 
  manhwas, 
  setManhwas, 
  onBackToSite, 
  onResetData, 
  lang 
}) {
  const [activeTab, setActiveTab] = useState('manhwas'); // 'manhwas', 'add', 'chapters', 'settings'
  const [searchFilter, setSearchFilter] = useState('');
  const [selectedManhwaForChapters, setSelectedManhwaForChapters] = useState(manhwas[0]?.id || '');
  const [editingManhwa, setEditingManhwa] = useState(null);
  const [feedbackMsg, setFeedbackMsg] = useState('');
  const [currentAdminPass, setCurrentAdminPass] = useState(() => getAdminPassword());
  const [newPassInput, setNewPassInput] = useState('');
  const [isProcessingCover, setIsProcessingCover] = useState(false);
  const [isProcessingBanner, setIsProcessingBanner] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [uploadedChapterPages, setUploadedChapterPages] = useState([]);
  const [chapterUploadProgress, setChapterUploadProgress] = useState(null);
  const isArabic = lang === 'ar';

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    arabicTitle: '',
    author: '',
    artist: '',
    cover: '',
    banner: '',
    synopsis: '',
    genres: ['Action', 'Fantasy'],
    status: 'مستمر',
    rating: 4.9,
    views: '100K',
    isTrending: true,
    isFeatured: false,
  });

  // Chapter Form State
  const [chapterForm, setChapterForm] = useState({
    number: '',
    title: '',
    date: 'الآن',
    isLocked: false,
    pagesText: ''
  });

  const showFeedback = (msg) => {
    setFeedbackMsg(msg);
    setTimeout(() => setFeedbackMsg(''), 3000);
  };

  const handleCoverFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setIsProcessingCover(true);
      const dataUrl = await processImageFile(file, 1200, 1600, 0.88);
      setFormData(prev => ({ ...prev, cover: dataUrl }));
      showFeedback(isArabic ? 'تم رفع صورة الغلاف بنجاح' : 'Cover uploaded');
    } catch (err) {
      alert(isArabic ? 'حدث خطأ أثناء قراءة ملف الصورة' : 'Error reading image file');
    } finally {
      setIsProcessingCover(false);
    }
  };

  const handleBannerFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setIsProcessingBanner(true);
      const dataUrl = await processImageFile(file, 1920, 1080, 0.85);
      setFormData(prev => ({ ...prev, banner: dataUrl }));
      showFeedback(isArabic ? 'تم رفع صورة البانر بنجاح' : 'Banner uploaded');
    } catch (err) {
      alert(isArabic ? 'حدث خطأ أثناء قراءة ملف الصورة' : 'Error reading image file');
    } finally {
      setIsProcessingBanner(false);
    }
  };

  const handleChapterFilesUpload = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    try {
      setChapterUploadProgress({ current: 0, total: files.length });
      const pages = await processChapterFiles(files, (current, total) => {
        setChapterUploadProgress({ current, total });
      });
      setUploadedChapterPages(pages);
      showFeedback(isArabic ? `تم رفع ${pages.length} صفحة للفصل بنجاح` : `Uploaded ${pages.length} pages`);
    } catch (err) {
      alert(isArabic ? 'حدث خطأ أثناء رفع صفحات الفصل' : 'Error uploading pages');
    } finally {
      setChapterUploadProgress(null);
    }
  };

  const handleSaveManhwa = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.arabicTitle) {
      alert(isArabic ? 'يرجى كتابة اسم المانهوا' : 'Please provide title');
      return;
    }

    if (!formData.cover) {
      alert(isArabic ? 'يرجى رفع صورة الغلاف من ملفات جهازك' : 'Please upload cover image');
      return;
    }

    const defaultCover = formData.cover;
    const defaultBanner = formData.banner || defaultCover;

    if (editingManhwa) {
      const updated = manhwas.map(m => {
        if (m.id === editingManhwa.id) {
          return { ...m, ...formData, cover: defaultCover, banner: defaultBanner };
        }
        return m;
      });
      setManhwas(updated);
      setEditingManhwa(null);
      showFeedback(isArabic ? 'تم تحديث المانهوا' : 'Manhwa updated');
    } else {
      const newId = formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now();
      const newManhwa = {
        id: newId,
        ...formData,
        cover: defaultCover,
        banner: defaultBanner,
        chaptersCount: 0,
        chapters: []
      };
      setManhwas([newManhwa, ...manhwas]);
      showFeedback(isArabic ? 'تمت إضافة المانهوا بنجاح' : 'Manhwa added');
    }

    setFormData({
      title: '',
      arabicTitle: '',
      author: '',
      artist: '',
      cover: '',
      banner: '',
      synopsis: '',
      genres: ['Action', 'Fantasy'],
      status: 'مستمر',
      rating: 4.9,
      views: '0',
      isTrending: true,
      isFeatured: false,
    });
    setActiveTab('manhwas');
  };

  const handleDeleteManhwa = (id) => {
    if (window.confirm(isArabic ? 'هل تريد حذف هذا العمل؟' : 'Delete this manhwa?')) {
      setManhwas(manhwas.filter(m => m.id !== id));
      showFeedback(isArabic ? 'تم الحذف' : 'Deleted');
    }
  };

  const handleStartEdit = (manhwa) => {
    setEditingManhwa(manhwa);
    setFormData({
      title: manhwa.title,
      arabicTitle: manhwa.arabicTitle,
      author: manhwa.author || '',
      artist: manhwa.artist || '',
      cover: manhwa.cover || '',
      banner: manhwa.banner || '',
      synopsis: manhwa.synopsis || '',
      genres: manhwa.genres || ['Action'],
      status: manhwa.status || 'مستمر',
      rating: manhwa.rating || 4.9,
      views: manhwa.views || '100K',
      isTrending: manhwa.isTrending || false,
      isFeatured: manhwa.isFeatured || false,
    });
    setActiveTab('add');
  };

  const handleAddChapter = (e) => {
    e.preventDefault();
    if (!chapterForm.number) return;

    const currentManhwa = manhwas.find(m => m.id === selectedManhwaForChapters);
    if (!currentManhwa) return;

    let pagesArray = [];
    if (uploadedChapterPages.length > 0) {
      pagesArray = [...uploadedChapterPages];
    } else if (chapterForm.pagesText.trim()) {
      pagesArray = chapterForm.pagesText.split('\n').map(s => s.trim()).filter(Boolean);
    }
    if (pagesArray.length === 0) {
      pagesArray = [currentManhwa.cover, currentManhwa.banner || currentManhwa.cover];
    }

    const newChapterObj = {
      id: `${currentManhwa.id}-ch-${chapterForm.number}-${Date.now()}`,
      number: parseFloat(chapterForm.number),
      title: chapterForm.title || `فصل ${chapterForm.number}`,
      date: chapterForm.date || 'الآن',
      views: '1K',
      isLocked: chapterForm.isLocked,
      pages: pagesArray
    };

    const updated = manhwas.map(m => {
      if (m.id === selectedManhwaForChapters) {
        return {
          ...m,
          chaptersCount: (m.chapters?.length || 0) + 1,
          chapters: [newChapterObj, ...(m.chapters || [])]
        };
      }
      return m;
    });

    setManhwas(updated);
    setChapterForm({ number: '', title: '', date: 'الآن', isLocked: false, pagesText: '' });
    setUploadedChapterPages([]);
    showFeedback(isArabic ? 'تمت إضافة الفصل بنجاح' : 'Chapter added');
  };

  const selectedManhwaObj = manhwas.find(m => m.id === selectedManhwaForChapters) || manhwas[0];

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-28">
      
      {/* Toast Feedback */}
      {feedbackMsg && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 px-5 py-2.5 rounded-full bg-[#e64626] text-white text-xs font-medium shadow-2xl animate-in fade-in">
          {feedbackMsg}
        </div>
      )}

      {/* Admin Header (Apple Style) */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-[28px] apple-glass mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl apple-glass-pill flex items-center justify-center text-white">
            <Shield className="w-5 h-5 text-[#e64626]" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
              <span>MADO</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-zinc-400">
                Admin Console
              </span>
            </h1>
            <p className="text-xs text-zinc-400">
              {isArabic ? 'إدارة الأعمال والفصول المنشورة في منصة MADO' : 'Manage manhwa titles, chapters, and platform configuration'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <button
            onClick={() => {
              setEditingManhwa(null);
              setActiveTab('add');
            }}
            className="flex-1 sm:flex-initial px-4 py-2 rounded-full bg-[#e64626] hover:bg-[#d43d1f] text-white text-xs font-semibold transition-all flex items-center justify-center gap-1.5 shadow-md cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>{isArabic ? 'إضافة مانهوا جديدة' : 'Add Manhwa'}</span>
          </button>

          <button
            onClick={onBackToSite}
            className="px-4 py-2 rounded-full apple-glass-pill hover:bg-white/[0.12] text-zinc-300 hover:text-white text-xs font-medium transition-all cursor-pointer"
          >
            {isArabic ? 'عرض الموقع' : 'Back to Site'}
          </button>
        </div>
      </div>

      {/* Stats Cards Row (Apple Glass) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6">
        <div className="p-4 rounded-2xl apple-glass-card">
          <span className="text-[11px] text-zinc-400 font-medium block mb-1">{isArabic ? 'إجمالي المانهوا' : 'Total Manhwas'}</span>
          <span className="text-2xl font-black text-white">{manhwas.length}</span>
        </div>
        <div className="p-4 rounded-2xl apple-glass-card">
          <span className="text-[11px] text-zinc-400 font-medium block mb-1">{isArabic ? 'إجمالي الفصول' : 'Total Chapters'}</span>
          <span className="text-2xl font-black text-white">
            {manhwas.reduce((acc, m) => acc + (m.chapters?.length || m.chaptersCount || 0), 0)}
          </span>
        </div>
        <div className="p-4 rounded-2xl apple-glass-card">
          <span className="text-[11px] text-zinc-400 font-medium block mb-1">{isArabic ? 'المشاهدات' : 'Total Views'}</span>
          <span className="text-2xl font-black text-white">
            {manhwas.length === 0 ? '0' : manhwas.reduce((acc, m) => acc + (parseFloat(m.views) || 0), 0) + 'K'}
          </span>
        </div>
        <div className="p-4 rounded-2xl apple-glass-card">
          <span className="text-[11px] text-zinc-400 font-medium block mb-1">{isArabic ? 'الحالة' : 'Platform Status'}</span>
          <span className="text-sm font-bold text-emerald-400 flex items-center gap-1.5 mt-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            {isArabic ? 'نشط أونلاين' : 'Operational'}
          </span>
        </div>
      </div>

      {/* Tabs Switcher Navigation */}
      <div className="flex items-center gap-2 p-1.5 rounded-2xl apple-glass-pill mb-6 text-xs font-medium w-full sm:w-max">
        <button
          onClick={() => setActiveTab('manhwas')}
          className={`px-4 py-2 rounded-xl transition-all cursor-pointer ${
            activeTab === 'manhwas' ? 'bg-white/10 text-white font-bold' : 'text-zinc-400 hover:text-white'
          }`}
        >
          {isArabic ? `المانهوا (${manhwas.length})` : `Manhwas (${manhwas.length})`}
        </button>

        <button
          onClick={() => setActiveTab('chapters')}
          className={`px-4 py-2 rounded-xl transition-all cursor-pointer ${
            activeTab === 'chapters' ? 'bg-white/10 text-white font-bold' : 'text-zinc-400 hover:text-white'
          }`}
        >
          {isArabic ? 'إدارة الفصول' : 'Chapters'}
        </button>

        <button
          onClick={() => {
            setEditingManhwa(null);
            setActiveTab('add');
          }}
          className={`px-4 py-2 rounded-xl transition-all cursor-pointer ${
            activeTab === 'add' ? 'bg-white/10 text-white font-bold' : 'text-zinc-400 hover:text-white'
          }`}
        >
          {editingManhwa ? (isArabic ? 'تعديل عمل' : 'Edit') : (isArabic ? 'إضافة مانهوا' : 'Add Manhwa')}
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`px-4 py-2 rounded-xl transition-all cursor-pointer ${
            activeTab === 'settings' ? 'bg-white/10 text-white font-bold' : 'text-zinc-400 hover:text-white'
          }`}
        >
          {isArabic ? 'الإعدادات' : 'Settings'}
        </button>
      </div>

      {/* TAB 1: MANHWAS LIST */}
      {activeTab === 'manhwas' && (
        <div className="space-y-4">
          <div className="w-full">
            <input
              type="text"
              placeholder={isArabic ? 'بحث في المانهوا بالاسم أو التصنيف...' : 'Search manhwas in admin...'}
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className="w-full h-10 px-4 rounded-2xl apple-glass-card text-xs text-white placeholder-zinc-500 focus:outline-none"
            />
          </div>

          {manhwas.length === 0 ? (
            <div className="p-12 text-center rounded-[32px] apple-glass-card space-y-3">
              <div className="w-12 h-12 rounded-full apple-glass-pill flex items-center justify-center text-white mx-auto">
                <Sparkles className="w-5 h-5 text-[#e64626]" />
              </div>
              <h3 className="text-base font-bold text-white">المنصة نظيفة تماماً (0 أعمال)</h3>
              <p className="text-xs text-zinc-400 max-w-md mx-auto leading-relaxed">
                تم تصفير جميع الأعمال والفصول والبيانات التجريبية بنجاح. يمكنك الآن إضافة أول عمل رسمي من خلال زر "إضافة مانهوا جديدة" بالأعلى.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
              {manhwas
                .filter(m => 
                  !searchFilter || 
                  m.title.toLowerCase().includes(searchFilter.toLowerCase()) || 
                  m.arabicTitle.includes(searchFilter)
                )
                .map((manhwa) => (
                  <div
                    key={manhwa.id}
                    className="flex gap-3.5 p-3.5 rounded-2xl apple-glass-card hover:bg-white/[0.06] transition-all"
                  >
                    <img
                      src={manhwa.cover}
                      alt={manhwa.title}
                      className="w-16 h-22 rounded-xl object-cover flex-shrink-0 border border-white/10"
                    />

                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <h4 className="text-sm font-bold text-white truncate">
                          {isArabic ? manhwa.arabicTitle : manhwa.title}
                        </h4>
                        <p className="text-[11px] text-zinc-400 truncate mt-0.5">
                          {manhwa.chapters?.length || manhwa.chaptersCount || 0} {isArabic ? 'فصل' : 'chs'} • {manhwa.views}
                        </p>
                        <div className="flex items-center gap-1.5 mt-1.5">
                          {manhwa.isTrending && (
                            <span className="text-[10px] px-2 py-0.5 rounded-md bg-[#e64626]/20 text-[#e64626] font-bold">
                              Trending
                            </span>
                          )}
                          {manhwa.isFeatured && (
                            <span className="text-[10px] px-2 py-0.5 rounded-md bg-white/10 text-zinc-300 font-bold">
                              Hero
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 pt-2 border-t border-white/5">
                        <button
                          onClick={() => {
                            setSelectedManhwaForChapters(manhwa.id);
                            setActiveTab('chapters');
                          }}
                          className="text-[11px] text-zinc-300 hover:text-white px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                        >
                          {isArabic ? 'الفصول' : 'Chapters'}
                        </button>

                        <button
                          onClick={() => handleStartEdit(manhwa)}
                          className="text-[11px] text-zinc-300 hover:text-white px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                        >
                          {isArabic ? 'تعديل' : 'Edit'}
                        </button>

                        <button
                          onClick={() => handleDeleteManhwa(manhwa.id)}
                          className="text-[11px] text-red-400 hover:text-red-300 px-2 py-1 rounded-lg bg-white/5 hover:bg-red-500/20 transition-colors"
                        >
                          {isArabic ? 'حذف' : 'Del'}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: ADD / EDIT MANHWA FORM */}
      {activeTab === 'add' && (
        <form onSubmit={handleSaveManhwa} className="max-w-2xl mx-auto space-y-4 p-6 md:p-8 rounded-[32px] apple-glass">
          <h3 className="text-base font-bold text-white mb-2">
            {editingManhwa ? (isArabic ? 'تعديل المانهوا' : 'Edit Manhwa') : (isArabic ? 'إضافة مانهوا جديدة' : 'Add New Manhwa')}
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-zinc-400 mb-1.5">{isArabic ? 'العنوان بالعربية *' : 'Arabic Title *'}</label>
              <input
                type="text"
                required
                placeholder="مثال: سولو ليفلينغ: راغناروك"
                value={formData.arabicTitle}
                onChange={(e) => setFormData({ ...formData, arabicTitle: e.target.value })}
                className="w-full h-9 px-3.5 rounded-xl apple-glass-pill text-xs text-white placeholder-zinc-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs text-zinc-400 mb-1.5">{isArabic ? 'العنوان بالإنجليزية *' : 'English Title *'}</label>
              <input
                type="text"
                required
                placeholder="e.g. Solo Leveling: Ragnarok"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full h-9 px-3.5 rounded-xl apple-glass-pill text-xs text-white placeholder-zinc-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-zinc-400 mb-1.5">{isArabic ? 'المؤلف' : 'Author'}</label>
              <input
                type="text"
                placeholder="Chugong"
                value={formData.author}
                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                className="w-full h-9 px-3.5 rounded-xl apple-glass-pill text-xs text-white placeholder-zinc-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs text-zinc-400 mb-1.5">{isArabic ? 'الرسام / الاستوديو' : 'Artist / Studio'}</label>
              <input
                type="text"
                placeholder="Redice Studio"
                value={formData.artist}
                onChange={(e) => setFormData({ ...formData, artist: e.target.value })}
                className="w-full h-9 px-3.5 rounded-xl apple-glass-pill text-xs text-white placeholder-zinc-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Cover Image Upload (From Device) */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-white">
              {isArabic ? 'صورة الغلاف (من ملفات جهازك) *' : 'Cover Image (From Device) *'}
            </label>

            {formData.cover ? (
              <div className="flex items-center gap-4 p-3 rounded-2xl apple-glass-card border border-white/10">
                <div className="relative w-20 h-28 rounded-xl overflow-hidden bg-zinc-900 border border-white/10 flex-shrink-0">
                  <img
                    src={formData.cover}
                    alt="Cover Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0 space-y-1.5">
                  <span className="text-xs font-bold text-white block">تم تحديد صورة الغلاف</span>
                  <p className="text-[11px] text-zinc-400">الصورة جاهزة وستحفظ مباشرة مع المانهوا</p>
                  <div className="flex items-center gap-2 pt-1">
                    <label
                      htmlFor="cover-file-input"
                      className="px-3 py-1.5 rounded-lg apple-glass-pill hover:bg-white/10 text-xs text-white font-medium cursor-pointer transition-colors"
                    >
                      تغيير الصورة
                    </label>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, cover: '' })}
                      className="px-3 py-1.5 rounded-lg apple-glass-pill text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10 cursor-pointer transition-colors"
                    >
                      حذف
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <label
                htmlFor="cover-file-input"
                className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-white/20 hover:border-[#e64626] rounded-2xl apple-glass-pill hover:bg-white/[0.04] cursor-pointer transition-all group"
              >
                {isProcessingCover ? (
                  <div className="flex items-center gap-2 text-xs text-zinc-400">
                    <Loader2 className="w-5 h-5 text-[#e64626] animate-spin" />
                    <span>جاري معالجة ورفع الصورة...</span>
                  </div>
                ) : (
                  <>
                    <div className="w-12 h-12 rounded-2xl apple-glass-pill flex items-center justify-center text-zinc-400 group-hover:text-[#e64626] transition-colors mb-2">
                      <UploadCloud className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-bold text-white group-hover:text-[#e64626] transition-colors">
                      {isArabic ? 'اضغط لاختيار صورة الغلاف من ملفات جهازك' : 'Choose Cover Image from Device'}
                    </span>
                    <span className="text-[11px] text-zinc-400 mt-1">
                      يدعم صيغ PNG, JPG, WEBP
                    </span>
                  </>
                )}
              </label>
            )}

            <input
              id="cover-file-input"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleCoverFileUpload}
            />

            {/* Optional URL Toggle */}
            <div className="pt-1">
              {!showUrlInput ? (
                <button
                  type="button"
                  onClick={() => setShowUrlInput(true)}
                  className="text-[11px] text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer"
                >
                  {isArabic ? 'أو كتابة رابط صورة خارجي (URL)...' : 'Or enter an external image URL...'}
                </button>
              ) : (
                <div className="space-y-1.5 pt-1">
                  <input
                    type="url"
                    placeholder="https://..."
                    value={formData.cover}
                    onChange={(e) => setFormData({ ...formData, cover: e.target.value })}
                    className="w-full h-9 px-3.5 rounded-xl apple-glass-pill text-xs text-white placeholder-zinc-500 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowUrlInput(false)}
                    className="text-[10px] text-zinc-500 hover:text-zinc-300 cursor-pointer"
                  >
                    إخفاء الرابط
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Banner Image Upload (Optional) */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-white">
              {isArabic ? 'صورة البانر العريض (اختياري - كخلفية لصفحة المانهوا)' : 'Banner Image (Optional)'}
            </label>

            {formData.banner ? (
              <div className="relative w-full h-28 rounded-2xl overflow-hidden apple-glass-card border border-white/10 group">
                <img
                  src={formData.banner}
                  alt="Banner Preview"
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, banner: '' })}
                  className="absolute top-2 right-2 p-1.5 rounded-full bg-black/70 text-red-400 hover:text-red-300 transition-colors cursor-pointer"
                  title="حذف البانر"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <label
                htmlFor="banner-file-input"
                className="flex items-center justify-center gap-2 p-3 border border-white/10 hover:border-white/20 rounded-xl apple-glass-pill hover:bg-white/[0.04] cursor-pointer text-xs text-zinc-300 transition-all"
              >
                {isProcessingBanner ? (
                  <Loader2 className="w-4 h-4 text-[#e64626] animate-spin" />
                ) : (
                  <ImagePlus className="w-4 h-4 text-zinc-400" />
                )}
                <span>{isArabic ? 'اختيار بانر من ملفات جهازك (اختياري)' : 'Upload Banner from Device'}</span>
              </label>
            )}

            <input
              id="banner-file-input"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleBannerFileUpload}
            />
          </div>

          <div>
            <label className="block text-xs text-zinc-400 mb-1.5">{isArabic ? 'قصة المانهوا' : 'Synopsis'}</label>
            <textarea
              rows={3}
              placeholder="قصة العمل..."
              value={formData.synopsis}
              onChange={(e) => setFormData({ ...formData, synopsis: e.target.value })}
              className="w-full p-3 rounded-xl apple-glass-pill text-xs text-white placeholder-zinc-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-6 py-2 text-xs text-zinc-300">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isTrending}
                onChange={(e) => setFormData({ ...formData, isTrending: e.target.checked })}
              />
              <span>Top Trending (قسم المتصدرة)</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isFeatured}
                onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
              />
              <span>Hero Banner (البانر الرئيسي)</span>
            </label>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3">
            <button
              type="button"
              onClick={() => setActiveTab('manhwas')}
              className="px-4 py-2 rounded-full text-xs text-zinc-400 hover:text-white"
            >
              {isArabic ? 'إلغاء' : 'Cancel'}
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-full bg-[#e64626] hover:bg-[#d43d1f] text-white text-xs font-semibold shadow-md cursor-pointer"
            >
              {isArabic ? 'حفظ ونشر العمل' : 'Save and Publish'}
            </button>
          </div>
        </form>
      )}

      {/* TAB 3: CHAPTERS */}
      {activeTab === 'chapters' && (
        <div className="max-w-3xl mx-auto space-y-5">
          <div className="p-4 rounded-2xl apple-glass">
            <label className="block text-xs text-zinc-400 mb-2">{isArabic ? 'اختر العمل لإدارة ونشر فصوله:' : 'Select Manhwa:'}</label>
            <select
              value={selectedManhwaForChapters}
              onChange={(e) => setSelectedManhwaForChapters(e.target.value)}
              className="w-full h-10 px-3 rounded-xl bg-zinc-900 border border-white/10 text-xs sm:text-sm text-white focus:outline-none cursor-pointer"
            >
              {manhwas.map((m) => (
                <option key={m.id} value={m.id}>
                  {isArabic ? m.arabicTitle : m.title} ({m.chapters?.length || 0} فصول)
                </option>
              ))}
            </select>
          </div>

          <form onSubmit={handleAddChapter} className="p-5 md:p-6 rounded-2xl apple-glass space-y-4">
            <h4 className="text-sm font-bold text-white">
              {isArabic ? `إضافة فصل جديد لـ ${selectedManhwaObj?.arabicTitle}` : `Add Chapter to ${selectedManhwaObj?.title}`}
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <input
                type="number"
                step="0.5"
                required
                placeholder={isArabic ? 'رقم الفصل (مثال: 43)' : 'Chapter # (e.g. 43)'}
                value={chapterForm.number}
                onChange={(e) => setChapterForm({ ...chapterForm, number: e.target.value })}
                className="h-9 px-3 rounded-xl apple-glass-pill text-xs text-white focus:outline-none"
              />
              <input
                type="text"
                placeholder={isArabic ? 'عنوان الفصل (اختياري)' : 'Chapter Title'}
                value={chapterForm.title}
                onChange={(e) => setChapterForm({ ...chapterForm, title: e.target.value })}
                className="h-9 px-3 rounded-xl apple-glass-pill text-xs text-white focus:outline-none"
              />
              <input
                type="text"
                placeholder={isArabic ? 'تاريخ النشر (مثال: الآن)' : 'Release Date'}
                value={chapterForm.date}
                onChange={(e) => setChapterForm({ ...chapterForm, date: e.target.value })}
                className="h-9 px-3 rounded-xl apple-glass-pill text-xs text-white focus:outline-none"
              />
            </div>

            {/* Chapter Pages Upload Zone */}
            <div className="space-y-2 pt-2 border-t border-white/10">
              <label className="block text-xs font-semibold text-white">
                {isArabic ? 'صفحات الفصل (اختر صور الفصل من جهازك) *' : 'Chapter Pages *'}
              </label>

              <label
                htmlFor="chapter-pages-input"
                className="flex flex-col items-center justify-center p-5 border-2 border-dashed border-white/20 hover:border-[#e64626] rounded-2xl apple-glass-pill hover:bg-white/[0.04] cursor-pointer transition-all group"
              >
                {chapterUploadProgress ? (
                  <div className="flex flex-col items-center gap-2 text-xs text-zinc-300">
                    <Loader2 className="w-6 h-6 text-[#e64626] animate-spin" />
                    <span>
                      {isArabic 
                        ? `جاري معالجة الصفحات: ${chapterUploadProgress.current} من ${chapterUploadProgress.total}`
                        : `Processing pages: ${chapterUploadProgress.current} of ${chapterUploadProgress.total}`}
                    </span>
                  </div>
                ) : (
                  <>
                    <UploadCloud className="w-7 h-7 text-zinc-400 group-hover:text-[#e64626] transition-colors mb-1.5" />
                    <span className="text-xs font-bold text-white group-hover:text-[#e64626] transition-colors">
                      {isArabic ? 'اضغط لاختيار كافة صفحات الفصل دفعة واحدة من جهازك' : 'Upload Chapter Pages from Device'}
                    </span>
                    <span className="text-[11px] text-zinc-400 mt-1">
                      {isArabic ? 'يمكنك تحديد 10 أو 50 أو 100 صورة وسيتم ترتيبها تلقائياً' : 'Select all image pages, sorted automatically'}
                    </span>
                  </>
                )}
              </label>

              <input
                id="chapter-pages-input"
                type="file"
                multiple
                accept="image/*"
                className="hidden"
                onChange={handleChapterFilesUpload}
              />

              {uploadedChapterPages.length > 0 && (
                <div className="p-3.5 rounded-2xl apple-glass-card space-y-2.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-emerald-400 flex items-center gap-1.5">
                      <CheckCircle className="w-4 h-4" />
                      {isArabic ? `تم تجهيز ${uploadedChapterPages.length} صفحة لهذا الفصل` : `${uploadedChapterPages.length} pages ready`}
                    </span>
                    <button
                      type="button"
                      onClick={() => setUploadedChapterPages([])}
                      className="text-[11px] text-red-400 hover:text-red-300 underline cursor-pointer"
                    >
                      {isArabic ? 'حذف وإلغاء' : 'Clear'}
                    </button>
                  </div>

                  {/* Thumbnail Previews of uploaded pages */}
                  <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar py-1">
                    {uploadedChapterPages.slice(0, 10).map((pageUrl, idx) => (
                      <div key={idx} className="relative w-12 h-16 rounded-lg overflow-hidden bg-zinc-900 border border-white/10 flex-shrink-0">
                        <img src={pageUrl} alt={`Page ${idx + 1}`} className="w-full h-full object-cover" />
                        <span className="absolute bottom-0 inset-x-0 bg-black/75 text-[9px] text-center text-zinc-300 font-mono">
                          {idx + 1}
                        </span>
                      </div>
                    ))}
                    {uploadedChapterPages.length > 10 && (
                      <span className="text-[11px] text-zinc-400 font-semibold px-2">
                        +{uploadedChapterPages.length - 10} {isArabic ? 'صفحة أخرى' : 'more'}
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Optional Textarea Fallback for URLs */}
              <details className="text-xs text-zinc-400 pt-1">
                <summary className="cursor-pointer hover:text-white transition-colors">
                  {isArabic ? 'أو إدخال روابط الصفحات يدوياً (URL)...' : 'Or paste page image URLs...'}
                </summary>
                <textarea
                  rows={3}
                  placeholder="https://...&#10;https://..."
                  value={chapterForm.pagesText}
                  onChange={(e) => setChapterForm({ ...chapterForm, pagesText: e.target.value })}
                  className="w-full p-3 mt-2 rounded-xl apple-glass-pill text-xs text-white placeholder-zinc-500 focus:outline-none"
                />
              </details>
            </div>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-full bg-[#e64626] hover:bg-[#d43d1f] text-white text-xs font-semibold cursor-pointer shadow-md"
            >
              {isArabic ? 'نشر الفصل الآن' : 'Publish Chapter'}
            </button>
          </form>

          {/* Chapters List */}
          <div className="space-y-2">
            {(selectedManhwaObj?.chapters || []).map((ch) => (
              <div key={ch.id} className="p-3 rounded-2xl apple-glass-pill flex items-center justify-between text-xs">
                <span className="font-bold text-white">
                  فصل {ch.number}: {ch.title}
                </span>
                <span className="text-[11px] text-zinc-400">{ch.date}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: SETTINGS */}
      {activeTab === 'settings' && (
        <div className="max-w-2xl mx-auto p-6 md:p-8 rounded-[32px] apple-glass space-y-6 text-xs">
          <div>
            <span className="block text-zinc-400 mb-1">{isArabic ? 'اسم المنصة' : 'Platform'}</span>
            <span className="text-white font-bold text-base">MADO</span>
          </div>

          {/* Admin Password Configuration */}
          <div className="pt-4 border-t border-white/10 space-y-3">
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-[#e64626]" />
              <h4 className="text-sm font-bold text-white">
                {isArabic ? 'كلمة مرور لوحة الإدارة' : 'Admin Password'}
              </h4>
            </div>
            <p className="text-zinc-400">
              {isArabic ? 'كلمة المرور الحالية هي: ' : 'Current password: '}
              <span className="font-mono font-bold text-white bg-white/10 px-2 py-0.5 rounded-md mx-1">
                {currentAdminPass}
              </span>
            </p>

            <div className="flex gap-2 max-w-sm pt-1">
              <input
                type="text"
                placeholder={isArabic ? 'اكتب كلمة مرور جديدة...' : 'New password...'}
                value={newPassInput}
                onChange={(e) => setNewPassInput(e.target.value)}
                className="flex-1 h-9 px-3 rounded-xl apple-glass-pill text-xs text-white focus:outline-none"
              />
              <button
                type="button"
                onClick={() => {
                  if (!newPassInput.trim()) return;
                  setAdminPassword(newPassInput.trim());
                  setCurrentAdminPass(newPassInput.trim());
                  setNewPassInput('');
                  showFeedback(isArabic ? 'تم تغيير كلمة المرور بنجاح' : 'Password updated');
                }}
                className="px-4 py-2 rounded-full bg-[#e64626] hover:bg-[#d43d1f] text-white font-semibold cursor-pointer transition-colors"
              >
                {isArabic ? 'تحديث' : 'Update'}
              </button>
            </div>
          </div>

          {/* Clear all data button */}
          <div className="pt-4 border-t border-white/10 space-y-2">
            <h4 className="text-sm font-bold text-white">{isArabic ? 'تصفير البيانات بالكامل' : 'Reset Platform'}</h4>
            <p className="text-zinc-400">
              {isArabic ? 'حذف جميع الأعمال والفصول نهائياً وجعل الموقع خالي تماماً 0% أعمال.' : 'Clear all manhwas and reset to zero.'}
            </p>
            <button
              type="button"
              onClick={() => {
                if (window.confirm(isArabic ? 'هل أنت متأكد من تصفير كافة الأعمال والفصول في الموقع؟' : 'Clear all manhwas?')) {
                  clearAllManhwas();
                  setManhwas([]);
                  showFeedback(isArabic ? 'تم تصفير جميع الأعمال والبيانات' : 'All manhwas cleared');
                }
              }}
              className="px-4 py-2 rounded-full apple-glass-pill text-red-400 hover:bg-red-500/10 hover:text-red-300 flex items-center gap-2 cursor-pointer transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>{isArabic ? 'تصفير جميع الأعمال والفصول (0)' : 'Clear All Manhwas'}</span>
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
