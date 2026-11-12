import React from 'react';
import { Home, Gem, Bookmark, User } from 'lucide-react';

export function BottomNav({ currentView, setCurrentView }) {
  const navItems = [
    {
      id: 'home',
      label: 'الرئيسية',
      icon: Home,
    },
    {
      id: 'trending',
      label: 'التريند',
      icon: Gem,
    },
    {
      id: 'library',
      label: 'مكتبتي',
      icon: Bookmark,
    },
    {
      id: 'profile',
      label: 'حسابي',
      icon: User,
    },
  ];

  return (
    <div className="fixed bottom-5 md:bottom-7 inset-x-0 z-50 flex justify-center pointer-events-none px-4">
      <nav 
        dir="rtl"
        className="pointer-events-auto apple-glass-nav h-[62px] md:h-[66px] px-7 md:px-10 rounded-full flex items-center justify-between gap-8 sm:gap-12 md:gap-14 shadow-[0_20px_50px_rgba(0,0,0,0.85)] border border-white/[0.14] transition-all hover:border-white/20"
      >
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id)}
              className="group relative flex flex-col items-center justify-center min-w-[50px] md:min-w-[56px] py-1 cursor-pointer transition-all duration-200 hover:scale-105 active:scale-95"
              title={item.label}
            >
              {/* Soft Warm Radial Glow Behind Active Icon (Exact Match to Picture) */}
              {isActive && (
                <div 
                  className="absolute inset-0 -m-2 rounded-full blur-md pointer-events-none"
                  style={{
                    background: 'radial-gradient(circle, rgba(230, 70, 38, 0.85) 0%, rgba(230, 70, 38, 0.35) 45%, transparent 75%)'
                  }}
                />
              )}

              <div className="relative z-10 flex flex-col items-center">
                <Icon 
                  className={`w-5 h-5 md:w-5.5 md:h-5.5 transition-colors duration-200 ${
                    isActive ? 'text-white' : 'text-zinc-400 group-hover:text-white'
                  }`} 
                  strokeWidth={isActive ? 2.2 : 1.7}
                />
                
                {/* Active Text Below Icon (as seen on "Home" in the picture) */}
                {isActive && (
                  <span className="text-[10px] md:text-[11px] font-medium text-white tracking-tight mt-1 leading-none drop-shadow">
                    {item.label}
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
