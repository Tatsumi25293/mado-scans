import React, { useState } from 'react';
import { User, Bookmark, Star, ArrowLeft, Shield, Lock, LogOut } from 'lucide-react';
import { verifyAdminPassword } from '../utils/storage';

export function UserProfile({ 
  userSession, 
  bookmarksCount = 0, 
  onLogout, 
  onOpenAdmin, 
  onBack 
}) {
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [adminPin, setAdminPin] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleAdminAuth = (e) => {
    e.preventDefault();
    if (verifyAdminPassword(adminPin)) {
      onOpenAdmin();
    } else {
      setErrorMsg('رمز المرور غير صحيح. (الافتراضي: mado)');
      setTimeout(() => setErrorMsg(''), 3000);
    }
  };

  const isGuest = !userSession;

  return (
    <div className="w-full max-w-xl mx-auto px-4 sm:px-6 py-6 pb-28">
      
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={onBack}
          className="w-9 h-9 rounded-full apple-glass-pill flex items-center justify-center text-zinc-300 hover:text-white transition-all cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 rotate-180" />
        </button>
        <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">
          الملف الشخصي
        </h2>
      </div>

      {/* User / Guest Info Card */}
      <div className="p-6 md:p-8 rounded-[32px] apple-glass mb-6 flex flex-col items-center text-center">
        <div className="w-20 h-20 rounded-full overflow-hidden border border-white/15 mb-4 shadow-xl flex items-center justify-center bg-white/5 backdrop-blur-xl">
          {userSession?.avatar ? (
            <img
              src={userSession.avatar}
              alt={userSession.name || 'User'}
              className="w-full h-full object-cover"
            />
          ) : (
            <User className="w-9 h-9 text-zinc-400" />
          )}
        </div>

        <h3 className="text-lg font-bold text-white">
          {userSession ? userSession.name : 'حساب زائر'}
        </h3>
        <p className="text-xs text-zinc-400 mt-1">
          {userSession ? 'عضوية نشطة في مجتمع MADO' : 'أنت تتصفح الموقع كزائر دون تسجيل دخول'}
        </p>

        {/* Stats Row */}
        <div className="grid grid-cols-2 gap-3 w-full max-w-xs mt-6">
          <div className="p-3 rounded-2xl apple-glass-pill">
            <span className="block text-[11px] text-zinc-400">الأعمال المحفوظة</span>
            <span className="text-lg font-black text-white">{bookmarksCount}</span>
          </div>
          <div className="p-3 rounded-2xl apple-glass-pill">
            <span className="block text-[11px] text-zinc-400">الفصول المقروءة</span>
            <span className="text-lg font-black text-white">0</span>
          </div>
        </div>

        {/* Logout Button if signed in */}
        {userSession && (
          <button
            onClick={onLogout}
            className="mt-6 px-5 py-2 rounded-full apple-glass-pill hover:bg-red-500/10 text-red-400 hover:text-red-300 text-xs font-semibold flex items-center gap-2 cursor-pointer transition-all"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>تسجيل الخروج</span>
          </button>
        )}
      </div>

      {/* Discreet Admin Login for Site Owner */}
      <div className="p-5 rounded-[28px] apple-glass-card text-center">
        {!showAdminLogin ? (
          <button
            onClick={() => setShowAdminLogin(true)}
            className="text-xs text-zinc-400 hover:text-white transition-colors flex items-center justify-center gap-1.5 mx-auto cursor-pointer"
          >
            <Shield className="w-3.5 h-3.5 text-zinc-400" />
            <span>تسجيل دخول الإدارة (خاص بالمالك)</span>
          </button>
        ) : (
          <form onSubmit={handleAdminAuth} className="space-y-3 max-w-xs mx-auto">
            <div className="flex items-center gap-1.5 justify-center text-xs text-zinc-300 font-bold mb-1">
              <Lock className="w-3.5 h-3.5 text-[#e64626]" />
              <span>أدخل رمز الإدارة للمتابعة</span>
            </div>
            <input
              type="password"
              autoFocus
              placeholder="الرمز السري (الافتراضي: mado)"
              value={adminPin}
              onChange={(e) => setAdminPin(e.target.value)}
              className="w-full h-10 px-3 rounded-xl apple-glass-pill text-xs text-white text-center focus:outline-none"
            />
            {errorMsg && <p className="text-[11px] text-red-400">{errorMsg}</p>}
            <div className="flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => setShowAdminLogin(false)}
                className="px-3.5 py-1.5 rounded-full text-xs text-zinc-400 hover:text-white"
              >
                إلغاء
              </button>
              <button
                type="submit"
                className="px-5 py-1.5 rounded-full bg-[#e64626] hover:bg-[#d43d1f] text-white text-xs font-semibold shadow-md cursor-pointer transition-colors"
              >
                دخول
              </button>
            </div>
          </form>
        )}
      </div>

    </div>
  );
}
