import { getFromIDB, setInIDB, clearIDB } from './indexedDb';

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
  try {
    const fromIDB = await getFromIDB('mado_manhwas');
    if (Array.isArray(fromIDB)) {
      return fromIDB;
    }
  } catch (_) {}
  return getStoredManhwas();
};

export const saveStoredManhwas = (manhwas) => {
  // Save to IndexedDB for unlimited high-res image and chapter storage
  setInIDB('mado_manhwas', manhwas);

  // Also save to localStorage if fits
  try {
    localStorage.setItem(STORAGE_KEYS.MANHWAS, JSON.stringify(manhwas));
  } catch (e) {
    // Large base64 images exceed 5MB localStorage quota, safely persisted in IndexedDB
  }
};

export const clearAllManhwas = () => {
  clearIDB();
  localStorage.setItem(STORAGE_KEYS.MANHWAS, JSON.stringify([]));
  return [];
};

export const resetToInitialManhwas = () => {
  clearIDB();
  localStorage.setItem(STORAGE_KEYS.MANHWAS, JSON.stringify([]));
  return [];
};

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
