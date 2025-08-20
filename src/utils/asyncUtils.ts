/**
 * Async utilities for loading, error handling, and state management
 * Extracted from common patterns across components and services
 */

import { useState, useEffect, useCallback, useRef } from 'react';

// Common loading states
export interface LoadingState {
  isLoading: boolean;
  error: string | null;
  data?: unknown;
}

export interface AsyncOperationState<T> {
  isLoading: boolean;
  error: string | null;
  data: T | null;
  lastUpdated?: number;
}

/**
 * Hook for managing async operations with loading and error states
 */
export function useAsyncOperation<T>(
  asyncFn: () => Promise<T>,
  dependencies: React.DependencyList = []
): AsyncOperationState<T> & {
  retry: () => void;
  reset: () => void;
} {
  const [state, setState] = useState<AsyncOperationState<T>>({
    isLoading: false,
    error: null,
    data: null,
  });

  const abortControllerRef = useRef<AbortController | null>(null);

  const execute = useCallback(async () => {
    // Cancel previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();
    const currentController = abortControllerRef.current;

    setState(prev => ({
      ...prev,
      isLoading: true,
      error: null,
    }));

    try {
      const result = await asyncFn();
      
      if (!currentController.signal.aborted) {
        setState({
          isLoading: false,
          error: null,
          data: result,
          lastUpdated: Date.now(),
        });
      }
    } catch (error) {
      if (!currentController.signal.aborted) {
        setState(prev => ({
          ...prev,
          isLoading: false,
          error: error instanceof Error ? error.message : 'Unknown error occurred',
        }));
      }
    }
  }, dependencies);

  const retry = useCallback(() => {
    execute();
  }, [execute]);

  const reset = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setState({
      isLoading: false,
      error: null,
      data: null,
    });
  }, []);

  useEffect(() => {
    execute();
    
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, dependencies);

  return {
    ...state,
    retry,
    reset,
  };
}

/**
 * Hook for managing simple loading states
 */
export function useLoadingState(initialLoading = false) {
  const [isLoading, setIsLoading] = useState(initialLoading);
  const [error, setError] = useState<string | null>(null);

  const startLoading = useCallback(() => {
    setIsLoading(true);
    setError(null);
  }, []);

  const stopLoading = useCallback(() => {
    setIsLoading(false);
  }, []);

  const setErrorState = useCallback((error: string | Error | null) => {
    setIsLoading(false);
    setError(error instanceof Error ? error.message : error);
  }, []);

  const reset = useCallback(() => {
    setIsLoading(false);
    setError(null);
  }, []);

  return {
    isLoading,
    error,
    startLoading,
    stopLoading,
    setError: setErrorState,
    reset,
  };
}

/**
 * Debounce async operations to prevent rapid-fire calls
 */
export function useDebounceAsync<T extends unknown[], R>(
  asyncFn: (...args: T) => Promise<R>,
  delay: number
): [(...args: T) => Promise<R>, () => void] {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const resolversRef = useRef<Array<{
    resolve: (value: R) => void;
    reject: (error: Error) => void;
  }>>([]);

  const debouncedFn = useCallback((...args: T): Promise<R> => {
    return new Promise<R>((resolve, reject) => {
      // Clear existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Add this promise to the resolvers queue
      resolversRef.current.push({ resolve, reject });

      // Set new timeout
      timeoutRef.current = setTimeout(async () => {
        const currentResolvers = [...resolversRef.current];
        resolversRef.current = [];

        try {
          const result = await asyncFn(...args);
          currentResolvers.forEach(({ resolve }) => resolve(result));
        } catch (error) {
          const errorObj = error instanceof Error ? error : new Error(String(error));
          currentResolvers.forEach(({ reject }) => reject(errorObj));
        }
      }, delay);
    });
  }, [asyncFn, delay]);

  const cancel = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    resolversRef.current = [];
  }, []);

  useEffect(() => {
    return () => {
      cancel();
    };
  }, [cancel]);

  return [debouncedFn, cancel];
}

/**
 * Promise-based timeout utility
 */
export function withTimeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T> {
  return Promise.race([
    promise,
    new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error(`Operation timed out after ${timeoutMs}ms`)), timeoutMs)
    ),
  ]);
}

/**
 * Retry async operations with exponential backoff
 */
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  options: {
    maxRetries?: number;
    initialDelay?: number;
    maxDelay?: number;
    backoffFactor?: number;
    shouldRetry?: (error: Error) => boolean;
  } = {}
): Promise<T> {
  const {
    maxRetries = 3,
    initialDelay = 1000,
    maxDelay = 10000,
    backoffFactor = 2,
    shouldRetry = () => true,
  } = options;

  let lastError: Error = new Error('Unknown error');
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      const errorObj = error instanceof Error ? error : new Error(String(error));
      lastError = errorObj;
      
      if (attempt === maxRetries || !shouldRetry(errorObj)) {
        throw errorObj;
      }
      
      const delay = Math.min(initialDelay * Math.pow(backoffFactor, attempt), maxDelay);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw lastError;
}

/**
 * Cache async results with TTL
 */
export class AsyncCache<K, V> {
  private cache = new Map<K, { value: V; expires: number }>();
  private defaultTTL: number;

  constructor(defaultTTLMs = 5 * 60 * 1000) { // 5 minutes default
    this.defaultTTL = defaultTTLMs;
  }

  async get(key: K, factory: () => Promise<V>, ttlMs?: number): Promise<V> {
    const cached = this.cache.get(key);
    const now = Date.now();

    if (cached && cached.expires > now) {
      return cached.value;
    }

    const value = await factory();
    const expires = now + (ttlMs || this.defaultTTL);
    this.cache.set(key, { value, expires });

    return value;
  }

  clear(): void {
    this.cache.clear();
  }

  delete(key: K): boolean {
    return this.cache.delete(key);
  }

  size(): number {
    return this.cache.size;
  }
}

/**
 * Batch async operations to reduce overhead
 */
export class BatchProcessor<T, R> {
  private batch: T[] = [];
  private timeout: NodeJS.Timeout | null = null;
  private resolvers: Array<(results: R[]) => void> = [];
  private rejecters: Array<(error: Error) => void> = [];

  constructor(
    private processor: (items: T[]) => Promise<R[]>,
    private batchSize = 10,
    private batchTimeout = 100
  ) {}

  async add(item: T): Promise<R> {
    return new Promise<R>((resolve, reject) => {
      this.batch.push(item);
      
      const resolverIndex = this.resolvers.length;
      this.resolvers.push((results: R[]) => resolve(results[resolverIndex]));
      this.rejecters.push(reject);

      if (this.batch.length >= this.batchSize) {
        this.processBatch();
      } else if (!this.timeout) {
        this.timeout = setTimeout(() => this.processBatch(), this.batchTimeout);
      }
    });
  }

  private async processBatch(): Promise<void> {
    if (this.timeout) {
      clearTimeout(this.timeout);
      this.timeout = null;
    }

    const currentBatch = [...this.batch];
    const currentResolvers = [...this.resolvers];
    const currentRejecters = [...this.rejecters];

    this.batch = [];
    this.resolvers = [];
    this.rejecters = [];

    if (currentBatch.length === 0) return;

    try {
      const results = await this.processor(currentBatch);
      currentResolvers.forEach((resolve, _index) => {
        resolve(results);
      });
    } catch (error) {
      const errorObj = error instanceof Error ? error : new Error(String(error));
      currentRejecters.forEach(reject => reject(errorObj));
    }
  }
}
