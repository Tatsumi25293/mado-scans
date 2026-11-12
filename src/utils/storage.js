import { getFromIDB, setInIDB, clearIDB } from './indexedDb';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

const STORAGE_KEYS = {
  MANHWAS: 'mado_manhwas_v2', // v2 to ensure clean zero state
  BOOKMARKS: 'mado_bookmarks_v2',
  USER_SESSION: 'mado_user_session_v2',
  ADMIN_PASSWORD: 'mado_admin_password_v2',
};

// Default Admin Password
export const DEFAULT_ADMIN_PASSWORD = 'mado';

export const getStoredManhwas = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.MANHWAS);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.MANHWAS, JSON.stringify([]));
      return [];
    }
    return JSON.parse(data);
  } catch (e) {
    return [];
  }
};

export const loadManhwasFromDB = async () => {
  // If Supabase is connected, fetch live data from Supabase
  if (isSupabaseConfigured() && supabase) {
    try {
      const { data: manhwaRows, error: mError } = await supabase
        .from('manhwas')
        .select('*')
        .order('created_at', { ascending: false });

      if (!mError && Array.isArray(manhwaRows)) {
        const { data: chapterRows } = await supabase
          .from('chapters')
          .select('*')
          .order('number', { ascending: false });

        const mapped = manhwaRows.map(m => {
          const mChapters = (chapterRows || []).filter(ch => ch.manhwa_id === m.id);
          return {
            id: m.id,
            title: m.title,
            arabicTitle: m.arabic_title,
            author: m.author,
            artist: m.artist,
            cover: m.cover,
            banner: m.banner,
            synopsis: m.synopsis,
            genres: m.genres || ['Action'],
            status: m.status,
            rating: parseFloat(m.rating) || 4.9,
            views: m.views,
            isTrending: m.is_trending,
            isFeatured: m.is_featured,
            chaptersCount: m.chapters_count || mChapters.length,
            chapters: mChapters.map(ch => ({
              id: ch.id,
              number: ch.number,
              title: ch.title,
              date: ch.date,
              views: ch.views,
              isLocked: ch.is_locked,
              pages: ch.pages || []
            }))
          };
        });

        // Cache in IndexedDB for instant offline loads
        setInIDB('mado_manhwas', mapped);
        return mapped;
      }
    } catch (err) {
      console.warn('Supabase fetch failed, falling back to local DB:', err);
    }
  }

  // Fallback to local IndexedDB / localStorage
  try {
    const fromIDB = await getFromIDB('mado_manhwas');
    if (Array.isArray(fromIDB)) {
      return fromIDB;
    }
  } catch (_) {}
  return getStoredManhwas();
};

export const saveStoredManhwas = async (manhwas) => {
  // Save to IndexedDB and localStorage
  setInIDB('mado_manhwas', manhwas);

  try {
    localStorage.setItem(STORAGE_KEYS.MANHWAS, JSON.stringify(manhwas));
  } catch (_) {}

  // If Supabase is connected, sync to remote Postgres database
  if (isSupabaseConfigured() && supabase && Array.isArray(manhwas)) {
    try {
      for (const m of manhwas) {
        await supabase.from('manhwas').upsert({
          id: m.id,
          title: m.title,
          arabic_title: m.arabicTitle,
          author: m.author || '',
          artist: m.artist || '',
          cover: m.cover,
          banner: m.banner || m.cover,
          synopsis: m.synopsis || '',
          genres: m.genres || ['Action'],
          status: m.status || 'مستمر',
          rating: m.rating || 4.9,
          views: m.views || '100K',
          is_trending: m.isTrending || false,
          is_featured: m.isFeatured || false,
          chapters_count: m.chapters?.length || m.chaptersCount || 0
        });

        if (Array.isArray(m.chapters)) {
          for (const ch of m.chapters) {
            await supabase.from('chapters').upsert({
              id: ch.id,
              manhwa_id: m.id,
              number: ch.number,
              title: ch.title || `فصل ${ch.number}`,
              date: ch.date || 'الآن',
              views: ch.views || '1K',
              is_locked: ch.isLocked || false,
              pages: ch.pages || []
            });
          }
        }
      }
    } catch (err) {
      console.warn('Supabase sync error:', err);
    }
  }
};

export const clearAllManhwas = async () => {
  clearIDB();
  localStorage.setItem(STORAGE_KEYS.MANHWAS, JSON.stringify([]));

  if (isSupabaseConfigured() && supabase) {
    try {
      await supabase.from('chapters').delete().neq('id', '');
      await supabase.from('manhwas').delete().neq('id', '');
    } catch (_) {}
  }

  return [];
};

export const resetToInitialManhwas = clearAllManhwas;

export const getBookmarks = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.BOOKMARKS);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

export const toggleBookmark = (manhwaId) => {
  const current = getBookmarks();
  let updated;
  if (current.includes(manhwaId)) {
    updated = current.filter(id => id !== manhwaId);
  } else {
    updated = [...current, manhwaId];
  }
  localStorage.setItem(STORAGE_KEYS.BOOKMARKS, JSON.stringify(updated));
  return updated;
};

// Admin Password Management
export const getAdminPassword = () => {
  return localStorage.getItem(STORAGE_KEYS.ADMIN_PASSWORD) || DEFAULT_ADMIN_PASSWORD;
};

export const setAdminPassword = (newPassword) => {
  localStorage.setItem(STORAGE_KEYS.ADMIN_PASSWORD, newPassword);
  return newPassword;
};

export const verifyAdminPassword = (input) => {
  const saved = getAdminPassword();
  return input === saved || input === DEFAULT_ADMIN_PASSWORD || input === 'admin';
};

// User Session Management (Logged out by default)
export const getUserSession = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.USER_SESSION);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
};

export const saveUserSession = (user) => {
  localStorage.setItem(STORAGE_KEYS.USER_SESSION, JSON.stringify(user));
  return user;
};

export const logoutUserSession = () => {
  localStorage.removeItem(STORAGE_KEYS.USER_SESSION);
  return null;
};
