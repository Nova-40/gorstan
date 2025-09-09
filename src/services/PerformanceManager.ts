/*
  Gorstan – Copyright © 2025 Geoff Webster. All Rights Reserved.
  
  Performance Management Sy      settings: {
        autoAdjust: false,      settings: {
        autoAdjust: false,
        graphicsQuality: 0,
        audioQuality: 0,
        animationQuality: 'low',
        textureQuality: 'low',
        particleEffects: false,
        shadowQuality: 'off',
        backgroundProcessing: false,
        autoSaveFrequency: 180,
        preloadDistance: 1,
        maxCachedAssets: 25,
        memoryTargetMB: 100,
        garbageCollectionThreshold: 0.5,
        resourcePoolSize: 10,
        imageCompression: 'heavy',
        prefetchEnabled: false,
        bandwidthLimit: 2
      },sQuality: 1,
        audioQuality: 1,
        animationQuality: 'low',
        textureQuality: 'low',
        particleEffects: false,
        shadowQuality: 'off',
        backgroundProcessing: false,
        autoSaveFrequency: 120,
        preloadDistance: 1,
        maxCachedAssets: 50,
        memoryTargetMB: 200,
        garbageCollectionThreshold: 0.6,
        resourcePoolSize: 25,
        imageCompression: 'medium',
        prefetchEnabled: false,
        bandwidthLimit: 5
      },1
  Central coordination of performance optimization features
*/

import DeviceProfiler, {
  type DeviceCapabilities,
  type PerformanceSettings,
  type PerformanceMetrics,
} from './DeviceProfiler';

export interface OptimizationProfile {
  name: string;
  description: string;
  settings: PerformanceSettings;
  deviceTargets: {
    minPerformanceTier: 'low' | 'medium' | 'high';
    platforms: ('mobile' | 'tablet' | 'desktop')[];
    memoryRange: [number, number]; // [min, max] GB
  };
}

export interface PerformanceAlert {
  type: 'memory' | 'fps' | 'network' | 'battery';
  severity: 'info' | 'warning' | 'critical';
  message: string;
  suggestions: string[];
  timestamp: number;
}

export class PerformanceManager {
  private static instance: PerformanceManager;
  private deviceProfiler: DeviceProfiler;
  private currentSettings: PerformanceSettings;
  private isMonitoring: boolean = false;
  private monitoringInterval: number | null = null;
  private alerts: PerformanceAlert[] = [];
  private onSettingsChange?: (settings: PerformanceSettings) => void;

  // Predefined optimization profiles
  private readonly optimizationProfiles: OptimizationProfile[] = [
    {
      name: 'Ultra Performance',
      description: 'Maximum performance for high-end devices',
      settings: {
        autoAdjust: false,
        graphicsQuality: 3,
        audioQuality: 3,
        animationQuality: 'high',
        textureQuality: 'high',
        particleEffects: true,
        shadowQuality: 'high',
        backgroundProcessing: true,
        autoSaveFrequency: 30,
        preloadDistance: 3,
        maxCachedAssets: 200,
        memoryTargetMB: 800,
        garbageCollectionThreshold: 0.8,
        resourcePoolSize: 100,
        imageCompression: 'none',
        prefetchEnabled: true,
        bandwidthLimit: 0,
      },
      deviceTargets: {
        minPerformanceTier: 'high',
        platforms: ['desktop'],
        memoryRange: [8, 64],
      },
    },
    {
      name: 'Balanced',
      description: 'Good balance of performance and quality',
      settings: {
        autoAdjust: false,
        graphicsQuality: 2,
        audioQuality: 2,
        animationQuality: 'medium',
        textureQuality: 'medium',
        particleEffects: true,
        shadowQuality: 'medium',
        backgroundProcessing: true,
        autoSaveFrequency: 60,
        preloadDistance: 2,
        maxCachedAssets: 100,
        memoryTargetMB: 400,
        garbageCollectionThreshold: 0.7,
        resourcePoolSize: 50,
        imageCompression: 'light',
        prefetchEnabled: true,
        bandwidthLimit: 0,
      },
      deviceTargets: {
        minPerformanceTier: 'medium',
        platforms: ['desktop', 'tablet'],
        memoryRange: [4, 16],
      },
    },
    {
      name: 'Battery Saver',
      description: 'Optimized for mobile devices and battery life',
      settings: {
        autoAdjust: false,
        graphicsQuality: 1,
        audioQuality: 1,
        animationQuality: 'low',
        textureQuality: 'low',
        particleEffects: false,
        shadowQuality: 'off',
        backgroundProcessing: false,
        autoSaveFrequency: 120,
        preloadDistance: 1,
        maxCachedAssets: 50,
        memoryTargetMB: 200,
        garbageCollectionThreshold: 0.6,
        resourcePoolSize: 25,
        imageCompression: 'medium',
        prefetchEnabled: false,
        bandwidthLimit: 5,
      },
      deviceTargets: {
        minPerformanceTier: 'low',
        platforms: ['mobile', 'tablet'],
        memoryRange: [1, 8],
      },
    },
    {
      name: 'Ultra Low-End',
      description: 'For very limited devices',
      settings: {
        autoAdjust: false,
        graphicsQuality: 0,
        audioQuality: 0,
        animationQuality: 'low',
        textureQuality: 'low',
        particleEffects: false,
        shadowQuality: 'off',
        backgroundProcessing: false,
        autoSaveFrequency: 300,
        preloadDistance: 0,
        maxCachedAssets: 20,
        memoryTargetMB: 100,
        garbageCollectionThreshold: 0.5,
        resourcePoolSize: 10,
        imageCompression: 'heavy',
        prefetchEnabled: false,
        bandwidthLimit: 2,
      },
      deviceTargets: {
        minPerformanceTier: 'low',
        platforms: ['mobile'],
        memoryRange: [1, 4],
      },
    },
  ];

  private constructor() {
    this.deviceProfiler = DeviceProfiler.getInstance();
    this.currentSettings = this.optimizationProfiles[1].settings; // Default to balanced
  }

  static getInstance(): PerformanceManager {
    if (!PerformanceManager.instance) {
      PerformanceManager.instance = new PerformanceManager();
    }
    return PerformanceManager.instance;
  }

  /**
   * Initialize performance management system
   */
  async initialize(): Promise<void> {
    console.log('[PerformanceManager] Initializing performance management...');

    try {
      // Detect device capabilities
      const capabilities = await this.deviceProfiler.detectCapabilities();

      // Auto-select optimal profile
      const optimalProfile = this.selectOptimalProfile(capabilities);
      this.currentSettings = { ...optimalProfile.settings };

      console.log(`[PerformanceManager] Selected profile: ${optimalProfile.name}`);
      console.log('[PerformanceManager] Settings:', this.currentSettings);

      // Start monitoring
      this.startMonitoring();

      // Notify of settings
      if (this.onSettingsChange) {
        this.onSettingsChange(this.currentSettings);
      }
    } catch (error) {
      console.error('[PerformanceManager] Initialization failed:', error);
      // Fall back to safe defaults
      this.currentSettings = this.optimizationProfiles[2].settings; // Battery saver
    }
  }

  /**
   * Select optimal performance profile based on device capabilities
   */
  private selectOptimalProfile(capabilities: DeviceCapabilities): OptimizationProfile {
    // Sort profiles by how well they match the device
    const scoredProfiles = this.optimizationProfiles.map((profile) => {
      let score = 0;

      // Performance tier match
      const tierScore = {
        low:
          capabilities.performanceTier === 'low'
            ? 3
            : capabilities.performanceTier === 'medium'
              ? 1
              : 0,
        medium:
          capabilities.performanceTier === 'medium'
            ? 3
            : capabilities.performanceTier === 'high'
              ? 2
              : 1,
        high:
          capabilities.performanceTier === 'high'
            ? 3
            : capabilities.performanceTier === 'medium'
              ? 1
              : 0,
      };
      score += tierScore[profile.deviceTargets.minPerformanceTier];

      // Platform match
      if (profile.deviceTargets.platforms.includes(capabilities.platform)) {
        score += 2;
      }

      // Memory range match
      const [minMem, maxMem] = profile.deviceTargets.memoryRange;
      if (capabilities.memoryGB >= minMem && capabilities.memoryGB <= maxMem) {
        score += 2;
      }

      // Battery optimization bonus for mobile
      if (capabilities.batteryOptimized && profile.name.includes('Battery')) {
        score += 2;
      }

      // Network speed consideration
      if (capabilities.networkSpeed === 'slow' && profile.settings.prefetchEnabled === false) {
        score += 1;
      }

      return { profile, score };
    });

    // Return the highest scoring profile
    scoredProfiles.sort((a, b) => b.score - a.score);
    return scoredProfiles[0].profile;
  }

  /**
   * Start performance monitoring
   */
  startMonitoring(): void {
    if (this.isMonitoring) {
      return;
    }

    this.isMonitoring = true;
    console.log('[PerformanceManager] Starting performance monitoring...');

    // Monitor every 5 seconds
    this.monitoringInterval = window.setInterval(() => {
      this.collectPerformanceMetrics();
    }, 5000);

    // Initial metrics collection
    this.collectPerformanceMetrics();
  }

  /**
   * Stop performance monitoring
   */
  stopMonitoring(): void {
    if (!this.isMonitoring) {
      return;
    }

    this.isMonitoring = false;

    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = null;
    }

    console.log('[PerformanceManager] Stopped performance monitoring');
  }

  /**
   * Collect current performance metrics
   */
  private collectPerformanceMetrics(): void {
    try {
      const metrics: PerformanceMetrics = {
        fps: this.measureFPS(),
        memoryUsageMB: this.measureMemoryUsage(),
        loadTime: performance.now(),
        renderTime: this.measureRenderTime(),
        networkLatency: 0, // Will be updated by network requests

        frameDrops: 0, // Calculated from FPS history
        memoryLeaks: 0, // Detected from memory growth
        slowOperations: 0, // Tracked by operation timing

        interactionDelay: this.measureInteractionDelay(),
        scrollSmoothness: 1.0, // Measured during scroll events
        responsiveness: this.calculateResponsiveness(),
      };

      // Record metrics
      this.deviceProfiler.recordMetrics(metrics);

      // Check for performance issues
      this.checkPerformanceThresholds(metrics);

      // Auto-adjust settings if needed
      this.autoAdjustSettings(metrics);
    } catch (error) {
      console.warn('[PerformanceManager] Failed to collect metrics:', error);
    }
  }

  /**
   * Measure current FPS
   */
  private measureFPS(): number {
    // This is a simplified FPS measurement
    // In production, you'd want a more sophisticated measurement
    return 60; // Placeholder - implement actual FPS measurement
  }

  /**
   * Measure memory usage
   */
  private measureMemoryUsage(): number {
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      if (memory.usedJSHeapSize) {
        return memory.usedJSHeapSize / (1024 * 1024); // Convert to MB
      }
    }
    return 0; // Unknown
  }

  /**
   * Measure render time
   */
  private measureRenderTime(): number {
    // Simplified render time measurement
    return performance.now() % 16.67; // Placeholder
  }

  /**
   * Measure interaction delay
   */
  private measureInteractionDelay(): number {
    // This would be measured during actual interactions
    return 50; // Placeholder milliseconds
  }

  /**
   * Calculate overall responsiveness score
   */
  private calculateResponsiveness(): number {
    const analysis = this.deviceProfiler.getPerformanceAnalysis();

    // Simple responsiveness calculation based on FPS and memory
    let score = 1.0;

    if (analysis.averageFPS < 30) {
      score -= 0.3;
    } else if (analysis.averageFPS < 45) {
      score -= 0.1;
    }

    if (analysis.averageMemory > this.currentSettings.memoryTargetMB) {
      score -= 0.2;
    }

    if (analysis.trend === 'degrading') {
      score -= 0.2;
    } else if (analysis.trend === 'improving') {
      score += 0.1;
    }

    return Math.max(0, Math.min(1, score));
  }

  /**
   * Check performance metrics against thresholds and generate alerts
   */
  private checkPerformanceThresholds(metrics: PerformanceMetrics): void {
    const alerts: PerformanceAlert[] = [];

    // FPS alerts
    if (metrics.fps < 20) {
      alerts.push({
        type: 'fps',
        severity: 'critical',
        message: 'Very low frame rate detected',
        suggestions: [
          'Reduce animation quality',
          'Disable particle effects',
          'Lower texture quality',
        ],
        timestamp: Date.now(),
      });
    } else if (metrics.fps < 30) {
      alerts.push({
        type: 'fps',
        severity: 'warning',
        message: 'Low frame rate detected',
        suggestions: ['Consider reducing graphics quality', 'Close other browser tabs'],
        timestamp: Date.now(),
      });
    }

    // Memory alerts
    if (metrics.memoryUsageMB > this.currentSettings.memoryTargetMB * 1.5) {
      alerts.push({
        type: 'memory',
        severity: 'critical',
        message: 'High memory usage detected',
        suggestions: ['Reduce cache size', 'Clear unused assets', 'Force garbage collection'],
        timestamp: Date.now(),
      });
    } else if (metrics.memoryUsageMB > this.currentSettings.memoryTargetMB * 1.2) {
      alerts.push({
        type: 'memory',
        severity: 'warning',
        message: 'Memory usage above target',
        suggestions: ['Monitor memory usage', 'Reduce preloading'],
        timestamp: Date.now(),
      });
    }

    // Add new alerts
    this.alerts.push(...alerts);

    // Keep only recent alerts (last 50)
    if (this.alerts.length > 50) {
      this.alerts = this.alerts.slice(-50);
    }

    // Log critical alerts
    alerts
      .filter((a) => a.severity === 'critical')
      .forEach((alert) => {
        console.warn(`[PerformanceManager] ${alert.type.toUpperCase()}: ${alert.message}`);
      });
  }

  /**
   * Automatically adjust settings based on performance
   */
  private autoAdjustSettings(metrics: PerformanceMetrics): void {
    const analysis = this.deviceProfiler.getPerformanceAnalysis();
    let settingsChanged = false;

    // Auto-reduce quality if FPS is consistently low
    if (analysis.averageFPS < 25 && analysis.trend === 'degrading') {
      if (this.currentSettings.animationQuality === 'high') {
        this.currentSettings.animationQuality = 'medium';
        settingsChanged = true;
      } else if (this.currentSettings.animationQuality === 'medium') {
        this.currentSettings.animationQuality = 'low';
        settingsChanged = true;
      }

      if (this.currentSettings.particleEffects) {
        this.currentSettings.particleEffects = false;
        settingsChanged = true;
      }
    }

    // Auto-reduce memory usage if exceeding targets
    if (metrics.memoryUsageMB > this.currentSettings.memoryTargetMB * 1.3) {
      if (this.currentSettings.maxCachedAssets > 20) {
        this.currentSettings.maxCachedAssets = Math.max(
          20,
          this.currentSettings.maxCachedAssets - 10,
        );
        settingsChanged = true;
      }

      if (this.currentSettings.preloadDistance > 0) {
        this.currentSettings.preloadDistance = Math.max(
          0,
          this.currentSettings.preloadDistance - 1,
        );
        settingsChanged = true;
      }
    }

    // Auto-improve quality if performance is consistently good
    if (
      analysis.averageFPS > 55 &&
      analysis.trend === 'improving' &&
      metrics.memoryUsageMB < this.currentSettings.memoryTargetMB * 0.7
    ) {
      if (this.currentSettings.animationQuality === 'low') {
        this.currentSettings.animationQuality = 'medium';
        settingsChanged = true;
      } else if (this.currentSettings.animationQuality === 'medium') {
        this.currentSettings.animationQuality = 'high';
        settingsChanged = true;
      }
    }

    // Notify of setting changes
    if (settingsChanged && this.onSettingsChange) {
      console.log('[PerformanceManager] Auto-adjusted settings based on performance');
      this.onSettingsChange(this.currentSettings);
    }
  }

  /**
   * Manually set performance settings
   */
  setSettings(settings: Partial<PerformanceSettings>): void {
    this.currentSettings = { ...this.currentSettings, ...settings };

    if (this.onSettingsChange) {
      this.onSettingsChange(this.currentSettings);
    }
  }

  /**
   * Get current performance settings
   */
  getSettings(): PerformanceSettings {
    return { ...this.currentSettings };
  }

  /**
   * Get available optimization profiles
   */
  getOptimizationProfiles(): OptimizationProfile[] {
    return [...this.optimizationProfiles];
  }

  /**
   * Apply a specific optimization profile
   */
  applyProfile(profileName: string): boolean {
    const profile = this.optimizationProfiles.find((p) => p.name === profileName);
    if (!profile) {
      console.warn(`[PerformanceManager] Profile not found: ${profileName}`);
      return false;
    }

    this.currentSettings = { ...profile.settings };

    if (this.onSettingsChange) {
      this.onSettingsChange(this.currentSettings);
    }

    console.log(`[PerformanceManager] Applied profile: ${profileName}`);
    return true;
  }

  /**
   * Get recent performance alerts
   */
  getAlerts(): PerformanceAlert[] {
    return [...this.alerts];
  }

  /**
   * Clear alerts
   */
  clearAlerts(): void {
    this.alerts = [];
  }

  /**
   * Set callback for settings changes
   */
  onSettingsChanged(callback: (settings: PerformanceSettings) => void): void {
    this.onSettingsChange = callback;
  }

  /**
   * Get performance summary
   */
  getPerformanceSummary(): {
    status: 'good' | 'warning' | 'poor';
    currentFPS: number;
    cpuUsage: number;
    memoryUsage: number;
    fps: number;
    renderTime: number;
    performanceTier: string;
    activeProfile: string;
    alertCount: number;
  } {
    const capabilities = this.deviceProfiler.getCapabilities();
    const analysis = this.deviceProfiler.getPerformanceAnalysis();

    // Find active profile name
    const activeProfile =
      this.optimizationProfiles.find(
        (p) => JSON.stringify(p.settings) === JSON.stringify(this.currentSettings),
      )?.name || 'Custom';

    // Determine overall status
    const alertCount = this.alerts.filter(
      (a) => a.severity === 'warning' || a.severity === 'critical',
    ).length;
    const criticalCount = this.alerts.filter((a) => a.severity === 'critical').length;
    const status: 'good' | 'warning' | 'poor' =
      criticalCount > 0 ? 'poor' : alertCount > 0 ? 'warning' : 'good';

    return {
      status,
      currentFPS: analysis.averageFPS,
      cpuUsage: 0, // Mock value - would need real CPU monitoring
      memoryUsage: analysis.averageMemory,
      fps: analysis.averageFPS,
      renderTime: analysis.averageMemory > 0 ? 1000 / Math.max(analysis.averageFPS, 1) : 16.67,
      performanceTier: capabilities?.performanceTier || 'unknown',
      activeProfile,
      alertCount,
    };
  }

  /**
   * Force garbage collection (if available)
   */
  forceGarbageCollection(): void {
    if ('gc' in window && typeof (window as any).gc === 'function') {
      (window as any).gc();
      console.log('[PerformanceManager] Forced garbage collection');
    }
  }

  /**
   * Cleanup and shutdown
   */
  shutdown(): void {
    this.stopMonitoring();
    this.alerts = [];
    console.log('[PerformanceManager] Shutdown complete');
  }
}

export default PerformanceManager;
