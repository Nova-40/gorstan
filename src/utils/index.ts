/**
 * Shared utilities index
 * Consolidated exports for common utility functions
 */

// Object manipulation utilities
export * from './objectUtils';

// Async operation utilities
export * from './asyncUtils';

// Validation utilities
export * from './validationUtils';

// React hook utilities
export * from './hookUtils';

// String processing utilities
export * from './stringUtils';

// Quantum magic utilities
export * from './quantumMagicHelpers';

// Re-export existing performance optimizations
export * from './performanceOptimization';

// Re-export lazy loading utilities
export * from './lazyLoading';

// Asset optimization utilities (with explicit naming to avoid conflicts)
export {
  preloadImage,
  preloadImages,
  useLazyImage,
  preloadAudio,
  LazyImage,
  preloadCriticalAssets,
  useIntersectionObserver as useAssetIntersectionObserver
} from './assetOptimization';
