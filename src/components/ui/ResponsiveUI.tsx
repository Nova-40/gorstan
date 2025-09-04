/**
 * Responsive UI Manager
 * Manages responsive design and mobile-optimized UI components
 */

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { detectDevice, monitorPerformance, detectAccessibilityPreferences, type DeviceInfo, type PerformanceMetrics, type AccessibilitySettings } from '../../utils/mobileOptimization';
import { RetroModal } from '../ui/RetroModal';

// Responsive breakpoints
export const breakpoints = {
  xs: 0,
  sm: 576,
  md: 768,
  lg: 992,
  xl: 1200,
  xxl: 1400
} as const;

export type Breakpoint = keyof typeof breakpoints;

// UI adaptation settings
export interface UIAdaptation {
  layout: 'mobile' | 'tablet' | 'desktop';
  touchOptimized: boolean;
  compactMode: boolean;
  sidebarCollapsed: boolean;
  fontSize: 'small' | 'medium' | 'large' | 'xlarge';
  buttonSize: 'small' | 'medium' | 'large';
  spacing: 'tight' | 'normal' | 'loose';
  animationsEnabled: boolean;
  highPerformanceMode: boolean;
}

// Responsive context
interface ResponsiveContextType {
  deviceInfo: DeviceInfo;
  performanceMetrics: PerformanceMetrics;
  accessibilitySettings: AccessibilitySettings;
  uiAdaptation: UIAdaptation;
  currentBreakpoint: Breakpoint;
  updateUIAdaptation: (updates: Partial<UIAdaptation>) => void;
  isBreakpoint: (bp: Breakpoint) => boolean;
  isAboveBreakpoint: (bp: Breakpoint) => boolean;
  isBelowBreakpoint: (bp: Breakpoint) => boolean;
}

const ResponsiveContext = createContext<ResponsiveContextType | null>(null);

// Custom hook to use responsive context
export const useResponsive = () => {
  const context = useContext(ResponsiveContext);
  if (!context) {
    throw new Error('useResponsive must be used within a ResponsiveProvider');
  }
  return context;
};

// Responsive provider component
interface ResponsiveProviderProps {
  children: ReactNode;
}

export const ResponsiveProvider: React.FC<ResponsiveProviderProps> = ({ children }) => {
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>(detectDevice());
  const [performanceMetrics, setPerformanceMetrics] = useState<PerformanceMetrics>(monitorPerformance());
  const [accessibilitySettings, setAccessibilitySettings] = useState<AccessibilitySettings>(detectAccessibilityPreferences());
  const [uiAdaptation, setUIAdaptation] = useState<UIAdaptation>(() => getInitialUIAdaptation(deviceInfo, performanceMetrics, accessibilitySettings));

  // Get current breakpoint
  const getCurrentBreakpoint = (): Breakpoint => {
    const width = window.innerWidth;
    if (width >= breakpoints.xxl) return 'xxl';
    if (width >= breakpoints.xl) return 'xl';
    if (width >= breakpoints.lg) return 'lg';
    if (width >= breakpoints.md) return 'md';
    if (width >= breakpoints.sm) return 'sm';
    return 'xs';
  };

  const [currentBreakpoint, setCurrentBreakpoint] = useState<Breakpoint>(getCurrentBreakpoint());

  // Update device info and metrics
  useEffect(() => {
    const updateMetrics = () => {
      setDeviceInfo(detectDevice());
      setPerformanceMetrics(monitorPerformance());
      setAccessibilitySettings(detectAccessibilityPreferences());
    };

    const updateBreakpoint = () => {
      setCurrentBreakpoint(getCurrentBreakpoint());
    };

    // Update on resize
    window.addEventListener('resize', updateBreakpoint);
    window.addEventListener('orientationchange', updateMetrics);
    
    // Performance monitoring
    const metricsInterval = setInterval(updateMetrics, 5000);

    return () => {
      window.removeEventListener('resize', updateBreakpoint);
      window.removeEventListener('orientationchange', updateMetrics);
      clearInterval(metricsInterval);
    };
  }, []);

  // Auto-adapt UI based on device changes
  useEffect(() => {
    const newAdaptation = getInitialUIAdaptation(deviceInfo, performanceMetrics, accessibilitySettings);
    setUIAdaptation(prev => ({ ...prev, ...newAdaptation }));
  }, [deviceInfo, performanceMetrics, accessibilitySettings]);

  const updateUIAdaptation = (updates: Partial<UIAdaptation>) => {
    setUIAdaptation(prev => ({ ...prev, ...updates }));
  };

  const isBreakpoint = (bp: Breakpoint) => currentBreakpoint === bp;
  const isAboveBreakpoint = (bp: Breakpoint) => window.innerWidth >= breakpoints[bp];
  const isBelowBreakpoint = (bp: Breakpoint) => window.innerWidth < breakpoints[bp];

  const contextValue: ResponsiveContextType = {
    deviceInfo,
    performanceMetrics,
    accessibilitySettings,
    uiAdaptation,
    currentBreakpoint,
    updateUIAdaptation,
    isBreakpoint,
    isAboveBreakpoint,
    isBelowBreakpoint,
  };

  return (
    <ResponsiveContext.Provider value={contextValue}>
      {children}
    </ResponsiveContext.Provider>
  );
};

// Helper function to determine initial UI adaptation
function getInitialUIAdaptation(
  deviceInfo: DeviceInfo, 
  performanceMetrics: PerformanceMetrics, 
  accessibilitySettings: AccessibilitySettings
): UIAdaptation {
  const layout = deviceInfo.isMobile ? 'mobile' : 
                deviceInfo.isTablet ? 'tablet' : 'desktop';

  const touchOptimized = deviceInfo.isTouchDevice;
  const compactMode = deviceInfo.screenSize === 'small' || performanceMetrics.isLowPowerMode;
  const sidebarCollapsed = deviceInfo.isMobile || deviceInfo.screenSize === 'small';
  
  const fontSize = accessibilitySettings.largeText ? 'large' : 
                  deviceInfo.isMobile ? 'medium' : 'medium';
  
  const buttonSize = deviceInfo.isMobile ? 'large' : 'medium';
  const spacing = compactMode ? 'tight' : 'normal';
  
  const animationsEnabled = !accessibilitySettings.reduceMotion && 
                           !performanceMetrics.isLowPowerMode && 
                           performanceMetrics.fps >= 30;
  
  const highPerformanceMode = performanceMetrics.isLowPowerMode || 
                             performanceMetrics.memoryUsage > 100 * 1024 * 1024;

  return {
    layout,
    touchOptimized,
    compactMode,
    sidebarCollapsed,
    fontSize,
    buttonSize,
    spacing,
    animationsEnabled,
    highPerformanceMode
  };
}

// Responsive image component
interface ResponsiveImageProps {
  src: string;
  alt: string;
  className?: string;
  sizes?: {
    mobile?: string;
    tablet?: string;
    desktop?: string;
  };
  lazy?: boolean;
}

export const ResponsiveImage: React.FC<ResponsiveImageProps> = ({
  src,
  alt,
  className = '',
  sizes,
  lazy = true
}) => {
  const { deviceInfo } = useResponsive();
  
  const getCurrentSrc = () => {
    if (sizes) {
      if (deviceInfo.isMobile && sizes.mobile) return sizes.mobile;
      if (deviceInfo.isTablet && sizes.tablet) return sizes.tablet;
      if (deviceInfo.isDesktop && sizes.desktop) return sizes.desktop;
    }
    return src;
  };

  return (
    <img
      src={getCurrentSrc()}
      alt={alt}
      className={className}
      loading={lazy ? 'lazy' : 'eager'}
      style={{
        maxWidth: '100%',
        height: 'auto'
      }}
    />
  );
};

// Responsive grid component
interface ResponsiveGridProps {
  children: ReactNode;
  columns?: {
    xs?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
    xxl?: number;
  };
  gap?: string;
  className?: string;
}

export const ResponsiveGrid: React.FC<ResponsiveGridProps> = ({
  children,
  columns = { xs: 1, sm: 2, md: 3, lg: 4, xl: 5, xxl: 6 },
  gap = '1rem',
  className = ''
}) => {
  const { currentBreakpoint } = useResponsive();
  
  const getCurrentColumns = () => {
    const breakpointOrder: Breakpoint[] = ['xxl', 'xl', 'lg', 'md', 'sm', 'xs'];
    const currentIndex = breakpointOrder.indexOf(currentBreakpoint);
    
    if (currentIndex === -1) {
      // Fallback if currentBreakpoint not recognized
      const defaultVal = columns.md ?? columns.sm ?? columns.xs;
      return defaultVal ?? 1;
    }
    for (let i = currentIndex; i < breakpointOrder.length; i++) {
      const bp = breakpointOrder[i];
      if (bp && Object.prototype.hasOwnProperty.call(columns, bp)) {
        const val = columns[bp];
        if (typeof val === 'number') return val;
      }
    }
    return columns.xs ?? 1;
  };

  const columnCount = getCurrentColumns();

  return (
    <div
      className={`responsive-grid ${className}`}
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${columnCount}, 1fr)`,
        gap,
      }}
    >
      {children}
    </div>
  );
};

// Responsive button component
interface ResponsiveButtonProps {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'danger';
  className?: string;
  size?: 'auto' | 'small' | 'medium' | 'large';
  fullWidth?: boolean;
}

export const ResponsiveButton: React.FC<ResponsiveButtonProps> = ({
  children,
  onClick,
  disabled = false,
  variant = 'primary',
  className = '',
  size = 'auto',
  fullWidth = false
}) => {
  const { uiAdaptation, deviceInfo } = useResponsive();
  
  const getButtonSize = () => {
    if (size !== 'auto') return size;
    return uiAdaptation.buttonSize;
  };

  const buttonSize = getButtonSize();
  const isTouch = deviceInfo.isTouchDevice;

  const baseClasses = `
    responsive-button
    ${variant}
    size-${buttonSize}
    ${fullWidth ? 'full-width' : ''}
    ${isTouch ? 'touch-optimized' : ''}
    ${uiAdaptation.touchOptimized ? 'large-touch-target' : ''}
    ${className}
  `;

  const styles: React.CSSProperties = {
    minHeight: isTouch ? '44px' : undefined,
    minWidth: isTouch ? '44px' : undefined,
    touchAction: 'manipulation',
    userSelect: 'none',
    WebkitTouchCallout: 'none',
  };

  return (
    <button
      className={baseClasses.trim()}
      onClick={onClick}
      disabled={disabled}
      style={styles}
    >
      {children}
    </button>
  );
};

// Responsive modal component
interface ResponsiveModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  size?: 'small' | 'medium' | 'large' | 'fullscreen';
  className?: string;
}

export const ResponsiveModal: React.FC<ResponsiveModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'medium',
  className = ''
}) => {
  const { deviceInfo } = useResponsive();

  if (!isOpen) return null;

  const modalSize = deviceInfo.isMobile ? 'fullscreen' : size;
  const useFullscreen = modalSize === 'fullscreen' || deviceInfo.screenSize === 'small';

  // removed modalStyles (unused after refactor)

  return (
    <RetroModal
      isOpen
      onClose={onClose}
      title={title}
  subtitle={useFullscreen ? 'Fullscreen view' : null}
      widthClass={useFullscreen ? 'max-w-full' : size === 'small' ? 'max-w-md' : size === 'large' ? 'max-w-4xl' : 'max-w-2xl'}
      className={className}
    >
      {children}
    </RetroModal>
  );
};

// Responsive text component
interface ResponsiveTextProps {
  children: ReactNode;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span';
  size?: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl';
  className?: string;
  responsive?: boolean;
}

export const ResponsiveText: React.FC<ResponsiveTextProps> = ({
  children,
  as: Component = 'p',
  size,
  className = '',
  responsive = true
}) => {
  const { uiAdaptation, deviceInfo } = useResponsive();
  
  const getResponsiveSize = () => {
    if (!responsive || size) return size;
    
    // Auto-adjust based on device and settings
    if (uiAdaptation.fontSize === 'large') return 'lg';
    if (uiAdaptation.fontSize === 'xlarge') return 'xl';
    if (deviceInfo.isMobile) return 'sm';
    return 'base';
  };

  const finalSize = getResponsiveSize();
  const textClasses = `responsive-text ${finalSize ? `text-${finalSize}` : ''} ${className}`;

  return (
    <Component className={textClasses.trim()}>
      {children}
    </Component>
  );
};

// CSS for responsive components
export const responsiveCSS = `
  /* Responsive Button Styles */
  .responsive-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border: none;
    border-radius: 4px;
    font-weight: 500;
    text-decoration: none;
    cursor: pointer;
    transition: all 0.2s ease;
    font-family: inherit;
  }
  
  .responsive-button:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
  
  .responsive-button.primary {
    background-color: #3B82F6;
    color: white;
  }
  
  .responsive-button.secondary {
    background-color: #6B7280;
    color: white;
  }
  
  .responsive-button.danger {
    background-color: #EF4444;
    color: white;
  }
  
  .responsive-button.size-small {
    padding: 6px 12px;
    font-size: 0.875rem;
  }
  
  .responsive-button.size-medium {
    padding: 8px 16px;
    font-size: 1rem;
  }
  
  .responsive-button.size-large {
    padding: 12px 24px;
    font-size: 1.125rem;
  }
  
  .responsive-button.full-width {
    width: 100%;
  }
  
  .responsive-button.large-touch-target {
    min-height: 44px;
    min-width: 44px;
  }
  
  /* Responsive Modal Styles */
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.7);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
  }
  
  .responsive-modal {
    background: white;
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }
  
  .modal-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 24px;
    border-bottom: 1px solid #E5E7EB;
  }
  
  .modal-title {
    margin: 0;
    font-size: 1.25rem;
    font-weight: 600;
  }
  
  .modal-close {
    background: none;
    border: none;
    cursor: pointer;
    font-size: 1.5rem;
    color: #6B7280;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .modal-content {
    padding: 24px;
    overflow-y: auto;
    flex: 1;
  }
  
  /* Responsive Text Styles */
  .responsive-text.text-xs { font-size: 0.75rem; }
  .responsive-text.text-sm { font-size: 0.875rem; }
  .responsive-text.text-base { font-size: 1rem; }
  .responsive-text.text-lg { font-size: 1.125rem; }
  .responsive-text.text-xl { font-size: 1.25rem; }
  .responsive-text.text-2xl { font-size: 1.5rem; }
  .responsive-text.text-3xl { font-size: 1.875rem; }
  
  /* Mobile optimizations */
  @media (max-width: 768px) {
    .responsive-modal:not(.modal-fullscreen) {
      margin: 16px;
      max-height: calc(100vh - 32px);
    }
    
    .modal-content {
      padding: 16px;
    }
    
    .responsive-button {
      min-height: 44px;
    }
  }
  
  /* High contrast mode support */
  @media (prefers-contrast: high) {
    .responsive-button {
      border: 2px solid;
    }
    
    .responsive-modal {
      border: 2px solid;
    }
  }
  
  /* Reduced motion support */
  @media (prefers-reduced-motion: reduce) {
    .responsive-button,
    .responsive-modal {
      transition: none;
    }
  }
`;

export default {
  ResponsiveProvider,
  useResponsive,
  ResponsiveImage,
  ResponsiveGrid,
  ResponsiveButton,
  ResponsiveModal,
  ResponsiveText,
  responsiveCSS
};
