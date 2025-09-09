/**
 * Object iteration and manipulation utilities
 * Extracted from common patterns across the codebase
 */

/**
 * Type-safe Object.entries wrapper that preserves key types
 */
export function typedEntries<T extends Record<string, any>>(obj: T): Array<[keyof T, T[keyof T]]> {
  return Object.entries(obj) as Array<[keyof T, T[keyof T]]>;
}

/**
 * Type-safe Object.keys wrapper
 */
export function typedKeys<T extends Record<string, any>>(obj: T): Array<keyof T> {
  return Object.keys(obj) as Array<keyof T>;
}

/**
 * Type-safe Object.values wrapper
 */
export function typedValues<T extends Record<string, any>>(obj: T): Array<T[keyof T]> {
  return Object.values(obj);
}

/**
 * Safe object iteration with error handling
 * Commonly used pattern in validators and loaders
 */
export function safeObjectIteration<T extends Record<string, any>, R>(
  obj: T,
  callback: (key: keyof T, value: T[keyof T], index: number) => R,
  errorHandler?: (error: Error, key: keyof T) => void,
): R[] {
  const results: R[] = [];
  const entries = typedEntries(obj);

  for (let i = 0; i < entries.length; i++) {
    const [key, value] = entries[i];
    try {
      const result = callback(key, value, i);
      results.push(result);
    } catch (error) {
      if (errorHandler && error instanceof Error) {
        errorHandler(error, key);
      } else {
        console.error(`Error processing key "${String(key)}":`, error);
      }
    }
  }

  return results;
}

/**
 * Filter object by predicate, preserving types
 */
export function filterObject<T extends Record<string, any>>(
  obj: T,
  predicate: (key: keyof T, value: T[keyof T]) => boolean,
): Partial<T> {
  const filtered: Partial<T> = {};

  for (const [key, value] of typedEntries(obj)) {
    if (predicate(key, value)) {
      filtered[key] = value;
    }
  }

  return filtered;
}

/**
 * Map object values while preserving keys and types
 */
export function mapObjectValues<T extends Record<string, any>, U>(
  obj: T,
  mapper: (value: T[keyof T], key: keyof T) => U,
): Record<keyof T, U> {
  const mapped = {} as Record<keyof T, U>;

  for (const [key, value] of typedEntries(obj)) {
    mapped[key] = mapper(value, key);
  }

  return mapped;
}

/**
 * Group array items by a key function
 */
export function groupBy<T, K extends string | number | symbol>(
  items: T[],
  keyFn: (item: T) => K,
): Record<K, T[]> {
  const groups = {} as Record<K, T[]>;

  for (const item of items) {
    const key = keyFn(item);
    if (!groups[key]) {
      groups[key] = [];
    }
    groups[key].push(item);
  }

  return groups;
}

/**
 * Deep clone an object (for game state snapshots)
 */
export function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  if (obj instanceof Date) {
    return new Date(obj.getTime()) as unknown as T;
  }

  if (obj instanceof Array) {
    return obj.map((item) => deepClone(item)) as unknown as T;
  }

  if (typeof obj === 'object') {
    const cloned = {} as T;
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        cloned[key] = deepClone(obj[key]);
      }
    }
    return cloned;
  }

  return obj;
}

/**
 * Safely get nested object property
 */
export function safeGet<T>(obj: any, path: string, defaultValue?: T): T | undefined {
  const keys = path.split('.');
  let current = obj;

  for (const key of keys) {
    if (current == null || typeof current !== 'object') {
      return defaultValue;
    }
    current = current[key];
  }

  return current !== undefined ? current : defaultValue;
}

/**
 * Count object entries matching a predicate
 */
export function countMatching<T extends Record<string, any>>(
  obj: T,
  predicate: (key: keyof T, value: T[keyof T]) => boolean,
): number {
  let count = 0;
  for (const [key, value] of typedEntries(obj)) {
    if (predicate(key, value)) {
      count++;
    }
  }
  return count;
}

/**
 * Check if object is empty
 */
export function isEmpty(obj: any): boolean {
  if (obj == null) return true;
  if (Array.isArray(obj)) return obj.length === 0;
  if (typeof obj === 'object') return Object.keys(obj).length === 0;
  return false;
}

/**
 * Merge objects deeply (for configuration merging)
 */
export function deepMerge<T extends Record<string, any>>(target: T, ...sources: Partial<T>[]): T {
  if (!sources.length) return target;
  const source = sources.shift();

  if (isObject(target) && isObject(source)) {
    for (const key in source) {
      if (isObject(source[key])) {
        if (!target[key]) Object.assign(target, { [key]: {} });
        deepMerge(target[key] as Record<string, any>, source[key] as Record<string, any>);
      } else {
        Object.assign(target, { [key]: source[key] });
      }
    }
  }

  return deepMerge(target, ...sources);
}

function isObject(item: any): item is Record<string, any> {
  return item && typeof item === 'object' && !Array.isArray(item);
}
