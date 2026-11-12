import React, { useState, useEffect } from 'react';
import { 
  getStoredManhwas, 
  loadManhwasFromDB,
  saveStoredManhwas, 
  resetToInitialManhwas, 
  getBookmarks, 
  toggleBookmark,
  getUserSession,
  logoutUserSession
} from './utils/storage';

// Components
import { Header } from './components/Header';
import { HeroSuggestions } from './components/HeroSuggestions';
import { TrendingStack } from './components/TrendingStack';
import { LatestReleases } from './components/LatestReleases';
import { CategoryBar } from './components/CategoryBar';
import { TopTrendingView } from './components/TopTrendingView';
import { BottomNav } from './components/BottomNav';
import { ManhwaDetails } from './components/ManhwaDetails';
import { ChapterReader } from './components/ChapterReader';
import { AdminDashboard } from './components/AdminDashboard';
import { LibraryView } from './components/LibraryView';
import { UserProfile } from './components/UserProfile';
import { SearchModal } from './components/SearchModal';

export default function App() {
  const [manhwas, setManhwasState] = useState(() => getStoredManhwas());
  const [bookmarks, setBookmarks] = useState(() => getBookmarks());
  const [userSession, setUserSession] = useState(() => getUserSession());

  // Views: 'home', 'trending', 'library', 'profile', 'admin', 'details', 'reader'
  const [currentView, setCurrentView] = useState('home');
  const [selectedManhwa, setSelectedManhwa] = useState(null);
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [activeCategory, setActiveCategory] = useState('all');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Load high-res manhwas from IndexedDB
  useEffect(() => {
    loadManhwasFromDB().then((data) => {
      if (Array.isArray(data) && data.length > 0) {
        setManhwasState(data);
      }
    });
  }, []);

  // Check URL hash for secure discreet admin access (e.g. #admin)
  useEffect(() => {
    const handleHash = () => {
      if (window.location.hash === '#admin') {
        setCurrentView('admin');
      }
    };
    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const setManhwas = (newManhwas) => {
    setManhwasState(newManhwas);
    saveStoredManhwas(newManhwas);
  };

  const handleToggleBookmark = (manhwaId) => {
    const updated = toggleBookmark(manhwaId);
    setBookmarks(updated);
  };

  const handleResetData = () => {
    const initial = resetToInitialManhwas();
    setManhwasState(initial);
  };

  const handleSelectManhwa = (manhwa) => {
    setSelectedManhwa(manhwa);
    setCurrentView('details');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleReadChapter = (manhwa, chapter) => {
    setSelectedManhwa(manhwa);
    setSelectedChapter(chapter);
    setCurrentView('reader');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div 
      dir="rtl" 
      className="min-h-screen bg-[#07080b] text-[#e5e7eb] flex flex-col font-sans selection:bg-[#e64626] selection:text-white"
    >
      
      {/* Real Top Header (No public admin or language switcher, purely clean Arabic) */}
      {currentView !== 'reader' && (
        <Header
          userSession={userSession}
          onOpenSearch={() => setIsSearchOpen(true)}
          currentView={currentView}
          setCurrentView={(v) => {
            setCurrentView(v);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />
      )}

      {/* Main Body Content */}
      <main className="flex-1 w-full pb-28 md:pb-36">
        
        {/* VIEW 1: HOME */}
        {currentView === 'home' && (() => {
          const filteredReleases = activeCategory === 'all'
            ? manhwas
            : manhwas.filter(m => {
                if (activeCategory === 'popular') return m.isPopular || m.rating >= 4.9;
                if (activeCategory === 'trending') return m.isTrending;
                if (activeCategory === 'action') return m.genres?.includes('أكشن') || m.genres?.includes('Action');
                if (activeCategory === 'fantasy') return m.genres?.includes('فانتازيا') || m.genres?.includes('Fantasy');
                if (activeCategory === 'murim') return m.genres?.includes('موريم') || m.genres?.includes('Murim');
                if (activeCategory === 'romance') return m.genres?.includes('رومانسي') || m.genres?.includes('Romance');
                if (activeCategory === 'comedy') return m.genres?.includes('كوميديا') || m.genres?.includes('Comedy');
                if (activeCategory === 'drama') return m.genres?.includes('دراما') || m.genres?.includes('Drama');
                return true;
              });

          return (
            <div className="space-y-4 md:space-y-6">
              
              {/* 1. Featured Work Suggestions at beginning of site (Clean Luxury Showcase without Top Header Bar) */}
              <HeroSuggestions
                manhwas={manhwas}
                onSelectManhwa={handleSelectManhwa}
                lang="ar"
              />

              {/* 2. Top Trending Section (Vertical 10 Items + Stacked Cards) */}
              <TrendingStack
                manhwas={manhwas}
                onSelectManhwa={handleSelectManhwa}
                lang="ar"
                onSeeAll={() => {
                  setCurrentView('trending');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />

              {/* 3. Latest Releases Grid */}
              <LatestReleases
                manhwas={filteredReleases}
                onSelectManhwa={handleSelectManhwa}
                lang="ar"
                onToggleBookmark={handleToggleBookmark}
                bookmarks={bookmarks}
                activeCategory={activeCategory}
                onResetCategory={() => setActiveCategory('all')}
              />

              {/* 4. Category Bar at bottom of Home Page */}
              <CategoryBar
                activeCategory={activeCategory}
                onSelectCategory={setActiveCategory}
                lang="ar"
              />

            </div>
          );
        })()}

        {/* VIEW 2: TOP 10 TRENDING VIEW */}
        {currentView === 'trending' && (
          <TopTrendingView
            manhwas={manhwas}
            onSelectManhwa={handleSelectManhwa}
            onBack={() => setCurrentView('home')}
            lang="ar"
          />
        )}

        {/* VIEW 3: LIBRARY / STORE */}
        {currentView === 'library' && (
          <LibraryView
            manhwas={manhwas}
            bookmarks={bookmarks}
            onSelectManhwa={handleSelectManhwa}
            onToggleBookmark={handleToggleBookmark}
            onBack={() => setCurrentView('home')}
            lang="ar"
          />
        )}

        {/* VIEW 4: USER PROFILE */}
        {currentView === 'profile' && (
          <UserProfile
            userSession={userSession}
            bookmarksCount={bookmarks.length}
            onLogout={() => {
              logoutUserSession();
              setUserSession(null);
            }}
            onOpenAdmin={() => setCurrentView('admin')}
            onBack={() => setCurrentView('home')}
          />
        )}

        {/* VIEW 5: SECURE ADMIN DASHBOARD (Accessible via #admin, double click logo, or profile PIN) */}
        {currentView === 'admin' && (
          <AdminDashboard
            manhwas={manhwas}
            setManhwas={setManhwas}
            onBackToSite={() => {
              window.location.hash = '';
              setCurrentView('home');
            }}
            onResetData={handleResetData}
            lang="ar"
          />
        )}

        {/* VIEW 6: MANHWA DETAILS */}
        {currentView === 'details' && selectedManhwa && (
          <ManhwaDetails
            manhwa={selectedManhwa}
            onBack={() => setCurrentView('home')}
            onReadChapter={handleReadChapter}
            onToggleBookmark={handleToggleBookmark}
            isBookmarked={bookmarks.includes(selectedManhwa.id)}
            lang="ar"
          />
        )}

        {/* VIEW 7: WEBTOON STRIP READER */}
        {currentView === 'reader' && selectedManhwa && selectedChapter && (
          <ChapterReader
            manhwa={selectedManhwa}
            chapter={selectedChapter}
            onBack={() => setCurrentView('details')}
            onSelectChapter={handleReadChapter}
            lang="ar"
          />
        )}

      </main>

      {/* Floating Apple Liquid Glass Bottom Navigation Bar */}
      {currentView !== 'reader' && (
        <BottomNav
          currentView={currentView}
          setCurrentView={(v) => {
            setCurrentView(v);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />
      )}

      {/* Minimal Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        manhwas={manhwas}
        onSelectManhwa={handleSelectManhwa}
        lang="ar"
      />

    </div>
  );
}
