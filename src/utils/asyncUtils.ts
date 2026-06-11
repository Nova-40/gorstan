/**
 * Async utilities for Gorstan — compact, dependency-light implementations
 * used by components and services. Kept intentionally minimal to ease
 * testing and typechecking in CI.
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';

export interface AsyncOperationState<T> {
  isLoading: boolean;
  error: string | null;
  data: T | null;
  lastUpdated?: number;
}

/**
 * useAsyncOperation
 * - Runs an async function and provides a simple loading/error/data state
 * - Returns retry and reset helpers
 */
export function useAsyncOperation<T>(
  asyncFn: () => Promise<T>,
  dependencies: React.DependencyList = [],
): AsyncOperationState<T> & { retry: () => void; reset: () => void } {
  const [state, setState] = useState<AsyncOperationState<T>>({ isLoading: false, error: null, data: null });
  const abortRef = useRef<AbortController | null>(null);
  const mountedRef = useRef(true);

  const execute = useCallback(async () => {
    if (abortRef.current) abortRef.current.abort();
    abortRef.current = new AbortController();
    const ctrl = abortRef.current;

    setState((s) => ({ ...s, isLoading: true, error: null }));
    try {
      const res = await asyncFn();
      if (!ctrl.signal.aborted && mountedRef.current) {
        setState({ isLoading: false, error: null, data: res, lastUpdated: Date.now() });
      }
    } catch (err) {
      if (!ctrl.signal.aborted && mountedRef.current) {
        setState((s) => ({ ...s, isLoading: false, error: err instanceof Error ? err.message : String(err) }));
      }
    }
  }, // eslint-disable-next-line react-hooks/exhaustive-deps
  dependencies);

  useEffect(() => {
    mountedRef.current = true;
    execute();
    return () => {
      mountedRef.current = false;
      if (abortRef.current) abortRef.current.abort();
    };
  }, [execute]);

  const retry = useCallback(() => {
    execute();
  }, [execute]);

  const reset = useCallback(() => {
    if (abortRef.current) abortRef.current.abort();
    setState({ isLoading: false, error: null, data: null });
  }, []);

  return { ...state, retry, reset };
}

/**
 * Simple in-memory async cache with TTL.
 */
export class AsyncCache<K, V> {
  private cache = new Map<K, { value: V; expiresAt: number }>();
  constructor(private ttlMs = 5 * 60 * 1000) {}

  async get(key: K, factory: () => Promise<V>): Promise<V> {
    const now = Date.now();
    const entry = this.cache.get(key);
    if (entry && entry.expiresAt > now) return entry.value;
    const value = await factory();
    this.cache.set(key, { value, expiresAt: now + this.ttlMs });
    return value;
  }

  clear() {
    this.cache.clear();
  }

  delete(k: K) {
    return this.cache.delete(k);
  }
}

/**
 * BatchProcessor batches multiple add() calls into a single processor invocation.
 * The processor must return an array of results matching the input order.
 */
export class BatchProcessor<T, R> {
  private batch: T[] = [];
  private resolvers: Array<{ resolve: (r: R) => void; reject: (e: unknown) => void }> = [];
  private timeout: ReturnType<typeof setTimeout> | null = null;

  constructor(private processor: (items: T[]) => Promise<R[]>, private batchTimeout = 50, private batchSize = 50) {}

  add(item: T): Promise<R> {
    return new Promise<R>((resolve, reject) => {
      this.batch.push(item);
      this.resolvers.push({ resolve, reject });
      if (this.batch.length >= this.batchSize) this.flush();
      else if (!this.timeout) this.timeout = setTimeout(() => this.flush(), this.batchTimeout);
    });
  }

  private async flush() {
    if (this.timeout) {
      clearTimeout(this.timeout);
      this.timeout = null;
    }
    const items = this.batch.splice(0);
    const resolvers = this.resolvers.splice(0);
    if (items.length === 0) return;
    try {
      const results = await this.processor(items);
      for (let i = 0; i < resolvers.length; i++) {
        const r = resolvers[i];
        if (!r) continue;
        // Resolve with the corresponding result. If the processor returned fewer
        // results than expected the value may be undefined — cast to R to satisfy
        // the type system while preserving runtime behaviour.
        // If callers rely on non-undefined values they should validate accordingly.
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        r.resolve((results as any)[i] as R);
      }
    } catch (err) {
      for (const r of resolvers) r.reject(err);
    }
  }

  clearPending() {
    if (this.timeout) {
      clearTimeout(this.timeout);
      this.timeout = null;
    }
    this.batch = [];
    this.resolvers = [];
  }
}
