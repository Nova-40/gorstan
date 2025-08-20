import { STORAGE_PREFIX } from '../config/mode';

/**
 * Storage utility that automatically applies mode-specific prefixes
 */
export class Storage {
  static setItem(key: string, value: string): void {
    localStorage.setItem(`${STORAGE_PREFIX}${key}`, value);
  }

  static getItem(key: string): string | null {
    return localStorage.getItem(`${STORAGE_PREFIX}${key}`);
  }

  static removeItem(key: string): void {
    localStorage.removeItem(`${STORAGE_PREFIX}${key}`);
  }

  static clear(): void {
    // Only clear items with our prefix
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith(STORAGE_PREFIX)) {
        localStorage.removeItem(key);
      }
    });
  }

  static getAllKeys(): string[] {
    const keys = Object.keys(localStorage);
    return keys
      .filter(key => key.startsWith(STORAGE_PREFIX))
      .map(key => key.substring(STORAGE_PREFIX.length));
  }
}

// Legacy compatibility functions
export const prefixedLocalStorage = {
  setItem: Storage.setItem,
  getItem: Storage.getItem,
  removeItem: Storage.removeItem,
  clear: Storage.clear,
};
