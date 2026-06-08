export type StorageArea = 'localStorage' | 'sessionStorage';

function getStorage(area: StorageArea): Storage | null {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    return window[area] ?? null;
  } catch {
    return null;
  }
}

export function safeGetStorageItem(key: string, area: StorageArea = 'localStorage'): string | null {
  const storage = getStorage(area);
  if (!storage) {
    return null;
  }

  try {
    return storage.getItem(key);
  } catch {
    return null;
  }
}

export function safeSetStorageItem(
  key: string,
  value: string,
  area: StorageArea = 'localStorage',
): boolean {
  const storage = getStorage(area);
  if (!storage) {
    return false;
  }

  try {
    storage.setItem(key, value);
    return true;
  } catch {
    return false;
  }
}

export function safeRemoveStorageItem(key: string, area: StorageArea = 'localStorage'): boolean {
  const storage = getStorage(area);
  if (!storage) {
    return false;
  }

  try {
    storage.removeItem(key);
    return true;
  } catch {
    return false;
  }
}
