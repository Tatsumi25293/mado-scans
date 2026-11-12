import React from 'react';
import { Search, Mic, Home, Gem, Bookmark, User } from 'lucide-react';

export function Header({ 
  searchQuery, 
  onOpenSearch, 
  currentView, 
  setCurrentView,
  userSession
}) {
  const navLinks = [
    { id: 'home', label: 'الرئيسية', icon: Home },
    { id: 'trending', label: 'التريند', icon: Gem },
    { id: 'library', label: 'مكتبتي', icon: Bookmark },
  ];

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-2xl bg-[#0b0c10]/80 border-b border-white/[0.06] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 md:h-16 flex items-center justify-between gap-3">
        
        {/* Right side in RTL: Brand Logo & Desktop Nav */}
        <div className="flex items-center gap-3">
          
          {/* Mobile Profile Icon / Avatar */}
          <button 
            onClick={() => setCurrentView('profile')}
            className="md:hidden relative flex-shrink-0 w-9 h-9 rounded-full overflow-hidden apple-glass-pill flex items-center justify-center text-zinc-400 hover:text-white transition-colors cursor-pointer"
            title="حسابي"
          >
            {userSession?.avatar ? (
              <img src={userSession.avatar} alt="User" className="w-full h-full object-cover" />
            ) : (
              <User className="w-4 h-4 text-zinc-300" />
            )}
          </button>

          {/* Brand Logo MADO (Double click for discreet owner admin access) */}
          <div 
            onClick={() => setCurrentView('home')} 
            onDoubleClick={() => setCurrentView('admin')}
            className="cursor-pointer flex items-center group select-none"
            title="MADO"
          >
            <span className="text-xl md:text-2xl font-black tracking-tight text-white group-hover:text-zinc-200 transition-colors">
              MADO
            </span>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1.5 mr-4 lg:mr-6">
            {navLinks.map((item) => {
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentView(item.id)}
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-white/10 text-white font-bold shadow-sm'
                      : 'text-zinc-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

        </div>

        {/* Center: Search Capsule */}
        <div className="flex-1 max-w-xs md:max-w-md lg:max-w-lg mx-2">
          <div 
            onClick={onOpenSearch}
            className="w-full h-9 md:h-10 px-3.5 md:px-4 rounded-full apple-glass-pill hover:bg-white/[0.09] cursor-pointer flex items-center justify-between text-zinc-400 transition-all shadow-inner"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <Search className="w-3.5 h-3.5 md:w-4 md:h-4 text-zinc-400 flex-shrink-0" />
              <span className="text-xs md:text-sm text-zinc-400 font-normal truncate select-none">
                {searchQuery || 'ابحث في MADO عن أي مانهوا أو مؤلف...'}
              </span>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0 text-zinc-400">
              <kbd className="hidden lg:inline-block text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-zinc-500">
                Ctrl K
              </kbd>
              <Mic className="w-3.5 h-3.5 md:w-4 md:h-4 hover:text-white transition-colors" />
            </div>
          </div>
        </div>

        {/* Left side in RTL: Desktop Profile Icon */}
        <div className="hidden md:flex items-center gap-2">
          <button 
            onClick={() => setCurrentView('profile')}
            className="w-9 h-9 rounded-full apple-glass-pill flex items-center justify-center text-zinc-300 hover:text-white transition-all cursor-pointer"
            title="حسابي"
          >
            {userSession?.avatar ? (
              <img src={userSession.avatar} alt="User" className="w-full h-full object-cover rounded-full" />
            ) : (
              <User className="w-4 h-4" />
            )}
          </button>
        </div>

      </div>
    </header>
  );
}
