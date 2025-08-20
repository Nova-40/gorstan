/*
  Gorstan – Copyright © 2025 Geoff Webster. All Rights Reserved.
  
  Performance Management Hook - Phase 10.1
  React integration for performance optimization system
*/

import { useState, useEffect, useCallback, useRef } from 'react';
import PerformanceManager from '../services/PerformanceManager';
import DeviceProfiler, { type DeviceCapabilities, type PerformanceSettings } from '../services/DeviceProfiler';

export interface PerformanceAlert {
  type: 'memory' | 'fps' | 'network' | 'battery';
  severity: 'info' | 'warning' | 'critical';
  message: string;
  suggestions: string[];
  timestamp: number;
}

export interface PerformanceState {
  isInitialized: boolean;
  isLoading: boolean;
  capabilities: DeviceCapabilities | null;
  settings: PerformanceSettings | null;
  alerts: PerformanceAlert[];
  currentProfile: string | null;
  summary: {
    status: 'good' | 'warning' | 'poor';
    currentFPS: number;
    cpuUsage: number;
    memoryUsage: number;
    fps: number;
    renderTime: number;
    performanceTier: string;
    activeProfile: string;
    alertCount: number;
  } | null;
}

export interface PerformanceActions {
  applyProfile: (profileName: string) => boolean;
  setOptimizationProfile: (profileName: string) => void;
  updateSettings: (settings: Partial<PerformanceSettings>) => void;
  clearAlerts: () => void;
  forceGarbageCollection: () => void;
  refreshSummary: () => void;
}

export function usePerformanceManager(): [PerformanceState, PerformanceActions] {
  const [state, setState] = useState<PerformanceState>({
    isInitialized: false,
    isLoading: true,
    capabilities: null,
    settings: null,
    alerts: [],
    currentProfile: null,
    summary: null
  });

  const performanceManager = useRef<PerformanceManager | null>(null);
  const deviceProfiler = useRef<DeviceProfiler | null>(null);
  
  // Refs for avoiding stale closures
  const summaryUpdateInterval = useRef<number | null>(null);

  /**
   * Initialize performance management system
   */
  const initializePerformance = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true }));

      // Get singletons
      performanceManager.current = PerformanceManager.getInstance();
      deviceProfiler.current = DeviceProfiler.getInstance();

      // Initialize the system
      await performanceManager.current.initialize();

      // Get initial state
      const capabilities = deviceProfiler.current.getCapabilities();
      const settings = performanceManager.current.getSettings();
      const alerts = performanceManager.current.getAlerts();
      const summary = performanceManager.current.getPerformanceSummary();

      // Set up settings change listener
      performanceManager.current.onSettingsChanged((newSettings) => {
        setState(prev => ({
          ...prev,
          settings: newSettings
        }));
      });

      setState({
        isInitialized: true,
        isLoading: false,
        capabilities,
        settings,
        alerts,
        currentProfile: summary.activeProfile,
        summary
      });

      console.log('[usePerformanceManager] Performance management initialized');

    } catch (error) {
      console.error('[usePerformanceManager] Initialization failed:', error);
      setState(prev => ({
        ...prev,
        isLoading: false,
        isInitialized: false
      }));
    }
  }, []);

  /**
   * Update performance summary periodically
   */
  const updateSummary = useCallback(() => {
    if (performanceManager.current) {
      const summary = performanceManager.current.getPerformanceSummary();
      const alerts = performanceManager.current.getAlerts();
      
      setState(prev => ({
        ...prev,
        summary,
        alerts
      }));
    }
  }, []);

  /**
   * Apply a performance profile
   */
  const applyProfile = useCallback((profileName: string): boolean => {
    if (!performanceManager.current) {
      console.warn('[usePerformanceManager] Performance manager not initialized');
      return false;
    }

    const success = performanceManager.current.applyProfile(profileName);
    if (success) {
      // Update state immediately
      const settings = performanceManager.current.getSettings();
      const summary = performanceManager.current.getPerformanceSummary();
      
      setState(prev => ({
        ...prev,
        settings,
        summary
      }));
    }

    return success;
  }, []);

  /**
   * Update performance settings
   */
  const updateSettings = useCallback((newSettings: Partial<PerformanceSettings>) => {
    if (!performanceManager.current) {
      console.warn('[usePerformanceManager] Performance manager not initialized');
      return;
    }

    performanceManager.current.setSettings(newSettings);
    
    // Update state
    const settings = performanceManager.current.getSettings();
    const summary = performanceManager.current.getPerformanceSummary();
    
    setState(prev => ({
      ...prev,
      settings,
      summary
    }));
  }, []);

  /**
   * Clear performance alerts
   */
  const clearAlerts = useCallback(() => {
    if (performanceManager.current) {
      performanceManager.current.clearAlerts();
      setState(prev => ({
        ...prev,
        alerts: []
      }));
    }
  }, []);

  /**
   * Force garbage collection
   */
  const forceGarbageCollection = useCallback(() => {
    if (performanceManager.current) {
      performanceManager.current.forceGarbageCollection();
      // Update memory summary after a brief delay
      setTimeout(updateSummary, 1000);
    }
  }, [updateSummary]);

  /**
   * Refresh performance summary
   */
  const refreshSummary = useCallback(() => {
    updateSummary();
  }, [updateSummary]);

  /**
   * Set optimization profile
   */
  const setOptimizationProfile = useCallback((profileName: string) => {
    if (performanceManager.current) {
      const success = performanceManager.current.applyProfile(profileName);
      if (success) {
        setState(prev => ({
          ...prev,
          currentProfile: profileName
        }));
      }
    }
  }, []);

  // Initialize on mount
  useEffect(() => {
    initializePerformance();
  }, [initializePerformance]);

  // Set up periodic summary updates
  useEffect(() => {
    if (state.isInitialized) {
      // Update summary every 10 seconds
      summaryUpdateInterval.current = window.setInterval(updateSummary, 10000);
      
      return () => {
        if (summaryUpdateInterval.current) {
          clearInterval(summaryUpdateInterval.current);
          summaryUpdateInterval.current = null;
        }
      };
    }
  }, [state.isInitialized, updateSummary]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (summaryUpdateInterval.current) {
        clearInterval(summaryUpdateInterval.current);
      }
      
      // Note: We don't shutdown the performance manager as it's a singleton
      // that might be used by other components
    };
  }, []);

  const actions: PerformanceActions = {
    applyProfile,
    setOptimizationProfile,
    updateSettings,
    clearAlerts,
    forceGarbageCollection,
    refreshSummary
  };

  return [state, actions];
}

/**
 * Simplified hook for just getting performance settings
 */
export function usePerformanceSettings(): {
  settings: PerformanceSettings | null;
  isLoading: boolean;
  updateSettings: (settings: Partial<PerformanceSettings>) => void;
} {
  const [fullState, actions] = usePerformanceManager();
  
  return {
    settings: fullState.settings,
    isLoading: fullState.isLoading,
    updateSettings: actions.updateSettings
  };
}

/**
 * Hook for performance monitoring and alerts
 */
export function usePerformanceMonitoring(): {
  alerts: PerformanceAlert[];
  summary: PerformanceState['summary'];
  clearAlerts: () => void;
  refreshSummary: () => void;
} {
  const [state, actions] = usePerformanceManager();
  
  return {
    alerts: state.alerts,
    summary: state.summary,
    clearAlerts: actions.clearAlerts,
    refreshSummary: actions.refreshSummary
  };
}

/**
 * Hook for device capabilities information
 */
export function useDeviceCapabilities(): {
  capabilities: DeviceCapabilities | null;
  isLoading: boolean;
} {
  const [state] = usePerformanceManager();
  
  return {
    capabilities: state.capabilities,
    isLoading: state.isLoading
  };
}

export default usePerformanceManager;
