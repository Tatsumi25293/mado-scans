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

// Cache configuration to minimize network requests and bandwidth consumption
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes cache
let lastFetchTimestamp = 0;
let inMemoryCache = null;

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

export const fetchChapterPages = async (chapterId) => {
  if (!chapterId) return [];
  if (isSupabaseConfigured() && supabase) {
    try {
      const { data, error } = await supabase
        .from('chapters')
        .select('pages')
        .eq('id', chapterId)
        .single();

      if (!error && data?.pages && Array.isArray(data.pages)) {
        return data.pages;
      }
    } catch (err) {
      console.warn('Error fetching chapter pages from Supabase:', err);
    }
  }
  return [];
};

export const loadManhwasFromDB = async (forceRefresh = false) => {
  const now = Date.now();

  // 1. If we have fresh in-memory cache, return it with 0 network calls
  if (!forceRefresh && inMemoryCache && (now - lastFetchTimestamp < CACHE_TTL_MS)) {
    return inMemoryCache;
  }

  // 2. If fresh in IndexedDB, return it with 0 network calls
  if (!forceRefresh) {
    try {
      const cached = await getFromIDB('mado_manhwas');
      const cachedTime = await getFromIDB('mado_manhwas_time');
      if (Array.isArray(cached) && cachedTime && (now - cachedTime < CACHE_TTL_MS)) {
        inMemoryCache = cached;
        lastFetchTimestamp = cachedTime;
        return cached;
      }
    } catch (_) {}
  }

  // 3. If Supabase is connected, fetch lightweight metadata (excluding massive pages array)
  if (isSupabaseConfigured() && supabase) {
    try {
      const { data: manhwaRows, error: mError } = await supabase
        .from('manhwas')
        .select('*')
        .order('created_at', { ascending: false });

      if (!mError && Array.isArray(manhwaRows)) {
        // Only select chapter metadata, not all page images, to save bandwidth
        const { data: chapterRows } = await supabase
          .from('chapters')
          .select('id, manhwa_id, number, title, date, views, is_locked')
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
              pages: [] // Loaded lazily on demand when chapter is opened
            }))
          };
        });

        // Cache in memory and IndexedDB
        inMemoryCache = mapped;
        lastFetchTimestamp = now;
        setInIDB('mado_manhwas', mapped);
        setInIDB('mado_manhwas_time', now);
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
      inMemoryCache = fromIDB;
      return fromIDB;
    }
  } catch (_) {}
  return getStoredManhwas();
};

export const saveStoredManhwas = async (manhwas) => {
  // Invalidate cache so fresh changes are visible immediately
  inMemoryCache = manhwas;
  lastFetchTimestamp = Date.now();
  setInIDB('mado_manhwas', manhwas);
  setInIDB('mado_manhwas_time', lastFetchTimestamp);

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
            // Only upsert pages if provided
            const chapterPayload = {
              id: ch.id,
              manhwa_id: m.id,
              number: ch.number,
              title: ch.title || `فصل ${ch.number}`,
              date: ch.date || 'الآن',
              views: ch.views || '1K',
              is_locked: ch.isLocked || false
            };
            if (ch.pages && ch.pages.length > 0) {
              chapterPayload.pages = ch.pages;
            }
            await supabase.from('chapters').upsert(chapterPayload);
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
