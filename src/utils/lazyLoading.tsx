/*
  Lazy Loading Utilities for Performance Optimization
*/

import React, { Suspense, ComponentType, LazyExoticComponent } from 'react';

// Generic lazy feature loader with error boundary and suspense
export function lazyFeature<T extends ComponentType<any>>(
  loader: () => Promise<{ default: T }>
): LazyExoticComponent<T> {
  return React.lazy(loader);
}

// Fallback component for loading states
export const LoadingFallback: React.FC<{ message?: string }> = ({ 
  message = 'Loading...' 
}) => (
  <div className="flex items-center justify-center p-4">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
    <span className="ml-2 text-gray-600">{message}</span>
  </div>
);

// Wrapper for lazy components with suspense and error boundary
export const LazyWrapper: React.FC<{
  children: React.ReactNode;
  fallback?: React.ReactNode;
}> = ({ children, fallback = <LoadingFallback /> }) => (
  <Suspense fallback={fallback}>
    {children}
  </Suspense>
);

// Error boundary for lazy loaded components
export class LazyErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback?: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode; fallback?: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): { hasError: boolean } {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Lazy loading error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="p-4 text-red-600">
          Failed to load component. Please refresh the page.
        </div>
      );
    }

    return this.props.children;
  }
}
