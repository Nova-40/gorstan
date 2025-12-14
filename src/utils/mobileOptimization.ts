/**
 * Mobile Optimization Utilities
 * Provides utilities for optimizing the game experience on mobile devices
 */

// Mobile device detection
export interface DeviceInfo {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isIOS: boolean;
  isAndroid: boolean;
  isTouchDevice: boolean;
  screenSize: 'small' | 'medium' | 'large' | 'xlarge';
  orientation: 'portrait' | 'landscape';
  pixelRatio: number;
  viewportWidth: number;
  viewportHeight: number;
  safeAreaInsets: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
}

export interface PerformanceMetrics {
  fps: number;
  memoryUsage: number;
  batteryLevel?: number;
  isLowPowerMode: boolean;
  connectionType: 'wifi' | '4g' | '3g' | '2g' | 'offline';
  latency: number;
}

export interface AccessibilitySettings {
  reduceMotion: boolean;
  highContrast: boolean;
  largeText: boolean;
  screenReader: boolean;
  forceFocus: boolean;
  colorBlindness: 'none' | 'protanopia' | 'deuteranopia' | 'tritanopia';
  fontSize: 'small' | 'medium' | 'large' | 'xlarge';
  soundEnabled: boolean;
  vibrationEnabled: boolean;
}

// Device detection utilities
export const detectDevice = (): DeviceInfo => {
  const userAgent = navigator.userAgent.toLowerCase();
  const isMobile = /mobile|android|iphone|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
  const isTablet = /ipad|tablet|kindle|playbook|silk/i.test(userAgent) && !isMobile;
  const isIOS = /iphone|ipad|ipod/i.test(userAgent);
  const isAndroid = /android/i.test(userAgent);
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

  const width = window.innerWidth;
  const height = window.innerHeight;
  const pixelRatio = window.devicePixelRatio || 1;

  const screenSize =
    width < 768 ? 'small' : width < 1024 ? 'medium' : width < 1440 ? 'large' : 'xlarge';

  const orientation = width > height ? 'landscape' : 'portrait';

  // Safe area detection for mobile devices
  const safeAreaInsets = {
    top:
      parseFloat(
        getComputedStyle(document.documentElement).getPropertyValue('--safe-area-inset-top'),
      ) || 0,
    right:
      parseFloat(
        getComputedStyle(document.documentElement).getPropertyValue('--safe-area-inset-right'),
      ) || 0,
    bottom:
      parseFloat(
        getComputedStyle(document.documentElement).getPropertyValue('--safe-area-inset-bottom'),
      ) || 0,
    left:
      parseFloat(
        getComputedStyle(document.documentElement).getPropertyValue('--safe-area-inset-left'),
      ) || 0,
  };

  return {
    isMobile,
    isTablet,
    isDesktop: !isMobile && !isTablet,
    isIOS,
    isAndroid,
    isTouchDevice,
    screenSize,
    orientation,
    pixelRatio,
    viewportWidth: width,
    viewportHeight: height,
    safeAreaInsets,
  };
};

// Performance monitoring
export const monitorPerformance = (): PerformanceMetrics => {
  // Narrow types for browser-specific APIs
  interface NetworkInformationLike {
    effectiveType?: string;
    rtt?: number;
  }

  interface BatteryLike {
    level?: number;
    charging?: boolean;
  }

  const nav = navigator as Navigator & { connection?: NetworkInformationLike; mozConnection?: NetworkInformationLike; webkitConnection?: NetworkInformationLike; battery?: BatteryLike; getBattery?: () => Promise<BatteryLike> };

  const connection = nav.connection || nav.mozConnection || nav.webkitConnection;
  // getBattery may return a promise or battery object; handle both
  let battery: BatteryLike | undefined;
  try {
    if (typeof nav.getBattery === 'function') {
      // If available, use async getBattery — but we cannot await in this sync function.
      // So attempt to read nav.battery fallback, otherwise undefined.
      battery = nav.battery;
    } else {
      battery = nav.battery;
    }
  } catch (e) {
    battery = undefined;
  }

  const batteryLevelVal = battery?.level;
  const base: PerformanceMetrics = {
    fps: 60, // Will be updated by actual FPS monitoring
    memoryUsage: (performance as Performance & { memory?: { usedJSHeapSize?: number } }).memory?.usedJSHeapSize || 0,
    isLowPowerMode: battery?.charging === false && (batteryLevelVal ?? 1) < 0.2,
    connectionType: connection
      ? connection.effectiveType === '4g'
        ? '4g'
        : connection.effectiveType === '3g'
          ? '3g'
          : connection.effectiveType === '2g'
            ? '2g'
            : 'wifi'
      : 'wifi',
    latency: connection?.rtt ?? 50,
  };

  if (batteryLevelVal !== undefined) {
    // Conditionally add optional batteryLevel to avoid assigning `undefined`
    (base as PerformanceMetrics).batteryLevel = batteryLevelVal;
  }

  return base;
};

// Accessibility detection
export const detectAccessibilityPreferences = (): AccessibilitySettings => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const prefersHighContrast = window.matchMedia('(prefers-contrast: high)').matches;
  const prefersLargeText = window.matchMedia('(prefers-font-size: large)').matches;

  return {
    reduceMotion: prefersReducedMotion,
    highContrast: prefersHighContrast,
    largeText: prefersLargeText,
    screenReader: !!(window as any).speechSynthesis && navigator.userAgent.includes('NVDA'),
    forceFocus: prefersReducedMotion, // Assume users who prefer reduced motion also want clear focus
    colorBlindness: 'none', // Would need user setting
    fontSize: prefersLargeText ? 'large' : 'medium',
    soundEnabled: true, // Would need user setting
    vibrationEnabled: 'vibrate' in navigator,
  };
};

// Touch optimization utilities
export const optimizeForTouch = () => {
  // Add touch-friendly classes to root
  document.documentElement.classList.add('touch-optimized');

  // Prevent double-tap zoom on buttons
  const style = document.createElement('style');
  style.textContent = `
    .touch-optimized button,
    .touch-optimized [role="button"],
    .touch-optimized .clickable {
      touch-action: manipulation;
      -webkit-touch-callout: none;
      -webkit-user-select: none;
      -moz-user-select: none;
      -ms-user-select: none;
      user-select: none;
    }
    
    .touch-optimized input[type="range"] {
      -webkit-appearance: none;
      appearance: none;
    }
    
    /* Larger touch targets for mobile */
    @media (max-width: 768px) {
      .touch-optimized button,
      .touch-optimized [role="button"],
      .touch-optimized .clickable {
        min-height: 44px;
        min-width: 44px;
        padding: 12px;
      }
    }
  `;
  document.head.appendChild(style);
};

// Performance optimization based on device capabilities
export const applyPerformanceOptimizations = (
  deviceInfo: DeviceInfo,
  metrics: PerformanceMetrics,
) => {
  const optimizations = {
    reduceAnimations: deviceInfo.isMobile && metrics.isLowPowerMode,
    lowerQuality: metrics.memoryUsage > 50 * 1024 * 1024, // 50MB threshold
    simplifyEffects: deviceInfo.screenSize === 'small' || metrics.fps < 30,
    preloadContent: metrics.connectionType === 'wifi' && !metrics.isLowPowerMode,
    useHardwareAcceleration: deviceInfo.pixelRatio > 1 && !deviceInfo.isMobile,
  };

  // Apply CSS classes based on optimizations
  const root = document.documentElement;
  if (optimizations.reduceAnimations) {
    root.classList.add('reduce-animations');
  }
  if (optimizations.lowerQuality) {
    root.classList.add('low-quality');
  }
  if (optimizations.simplifyEffects) {
    root.classList.add('simple-effects');
  }
  if (optimizations.useHardwareAcceleration) {
    root.classList.add('hw-accelerated');
  }

  return optimizations;
};

// Viewport management for mobile browsers
export const setupMobileViewport = () => {
  // Set viewport meta tag for proper mobile scaling
  let viewport = document.querySelector('meta[name="viewport"]');
  if (!viewport) {
    viewport = document.createElement('meta');
    viewport.setAttribute('name', 'viewport');
    document.head.appendChild(viewport);
  }

  viewport.setAttribute(
    'content',
    'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover',
  );

  // Add CSS custom properties for safe areas
  const style = document.createElement('style');
  style.textContent = `
    :root {
      --safe-area-inset-top: env(safe-area-inset-top);
      --safe-area-inset-right: env(safe-area-inset-right);
      --safe-area-inset-bottom: env(safe-area-inset-bottom);
      --safe-area-inset-left: env(safe-area-inset-left);
    }
    
    /* Ensure content respects safe areas */
    .safe-area-inset {
      padding-top: var(--safe-area-inset-top);
      padding-right: var(--safe-area-inset-right);
      padding-bottom: var(--safe-area-inset-bottom);
      padding-left: var(--safe-area-inset-left);
    }
  `;
  document.head.appendChild(style);
};

// Gesture handling for mobile
export interface GestureHandlers {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  onPinch?: (scale: number) => void;
  onRotate?: (angle: number) => void;
  onLongPress?: (x: number, y: number) => void;
}

export const setupGestureHandling = (element: HTMLElement, handlers: GestureHandlers) => {
  let startX = 0;
  let startY = 0;
  let startTime = 0;
  let isLongPress = false;
  let longPressTimer: number;

  const threshold = 50; // Minimum distance for swipe
  const timeThreshold = 300; // Maximum time for swipe
  const longPressDelay = 500; // Long press duration

  element.addEventListener(
    'touchstart',
    (e) => {
      const touch = e.touches && e.touches[0];
      if (touch) {
        startX = touch.clientX;
        startY = touch.clientY;
      }
      startTime = Date.now();
      isLongPress = false;

      // Start long press timer
      longPressTimer = window.setTimeout(() => {
        isLongPress = true;
        handlers.onLongPress?.(startX, startY);
      }, longPressDelay);
    },
    { passive: true },
  );

  element.addEventListener(
    'touchmove',
    () => {
      // Cancel long press on movement
      clearTimeout(longPressTimer);
    },
    { passive: true },
  );

  element.addEventListener(
    'touchend',
    (e) => {
      clearTimeout(longPressTimer);

      if (isLongPress) {
        return;
      } // Don't process swipe if long press occurred

      const touch = e.changedTouches && e.changedTouches[0];
      if (!touch) {
        return;
      }
      const endX = touch.clientX;
      const endY = touch.clientY;
      const endTime = Date.now();

      const deltaX = endX - startX;
      const deltaY = endY - startY;
      const deltaTime = endTime - startTime;

      if (deltaTime > timeThreshold) {
        return;
      } // Too slow for swipe

      const absX = Math.abs(deltaX);
      const absY = Math.abs(deltaY);

      if (absX > threshold || absY > threshold) {
        if (absX > absY) {
          // Horizontal swipe
          if (deltaX > 0) {
            handlers.onSwipeRight?.();
          } else {
            handlers.onSwipeLeft?.();
          }
        } else {
          // Vertical swipe
          if (deltaY > 0) {
            handlers.onSwipeDown?.();
          } else {
            handlers.onSwipeUp?.();
          }
        }
      }
    },
    { passive: true },
  );

  // Prevent context menu on long press
  element.addEventListener('contextmenu', (e) => {
    if (isLongPress) {
      e.preventDefault();
    }
  });
};

// Battery optimization
export const optimizeForBattery = (batteryLevel?: number) => {
  const isLowBattery = batteryLevel !== undefined && batteryLevel < 0.3;

  if (isLowBattery) {
    // Reduce background operations
    document.documentElement.classList.add('battery-saving');

    // Lower animation frame rate
    const style = document.createElement('style');
    style.textContent = `
      .battery-saving * {
        animation-duration: 0.1s !important;
        transition-duration: 0.1s !important;
      }
      
      .battery-saving .particle-effect,
      .battery-saving .complex-animation {
        display: none !important;
      }
    `;
    document.head.appendChild(style);
  }
};

export default {
  detectDevice,
  monitorPerformance,
  detectAccessibilityPreferences,
  optimizeForTouch,
  applyPerformanceOptimizations,
  setupMobileViewport,
  setupGestureHandling,
  optimizeForBattery,
};
