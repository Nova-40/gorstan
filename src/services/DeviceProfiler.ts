/*
  Gorstan – Copyright © 2025 Geoff Webster. All Rights Reserved.
  
  Performance Management System - Phase 10.1
  Device capability detection and performance optimization
*/

export interface DeviceCapabilities {
  // Hardware specs
  cpuCores: number;
  memoryGB: number;
  gpuTier: 'low' | 'medium' | 'high' | 'unknown';
  tier: string; // Overall device tier description
  
  // Performance characteristics
  performanceTier: 'low' | 'medium' | 'high';
  batteryOptimized: boolean;
  networkSpeed: 'slow' | 'medium' | 'fast';
  
  // Platform info
  platform: 'mobile' | 'tablet' | 'desktop';
  browser: string;
  isTouchDevice: boolean;
  
  // Display capabilities
  screenSize: { width: number; height: number };
  pixelRatio: number;
  supportsWebGL: boolean;
  maxTextureSize: number;
}

export interface PerformanceSettings {
  // Automatic quality adjustment
  autoAdjust: boolean;
  
  // Visual quality (numeric levels 0-3 for UI compatibility)
  graphicsQuality: number;
  audioQuality: number;
  animationQuality: 'low' | 'medium' | 'high';
  textureQuality: 'low' | 'medium' | 'high';
  particleEffects: boolean;
  shadowQuality: 'off' | 'low' | 'medium' | 'high';
  
  // Game features
  backgroundProcessing: boolean;
  autoSaveFrequency: number; // seconds
  preloadDistance: number; // rooms ahead to preload
  maxCachedAssets: number;
  
  // Memory management
  memoryTargetMB: number;
  garbageCollectionThreshold: number;
  resourcePoolSize: number;
  
  // Network optimization
  imageCompression: 'none' | 'light' | 'medium' | 'heavy';
  prefetchEnabled: boolean;
  bandwidthLimit: number; // MB/s, 0 = unlimited
}

export interface PerformanceMetrics {
  fps: number;
  memoryUsageMB: number;
  loadTime: number;
  renderTime: number;
  networkLatency: number;
  
  // Performance counters
  frameDrops: number;
  memoryLeaks: number;
  slowOperations: number;
  
  // User experience
  interactionDelay: number;
  scrollSmoothness: number;
  responsiveness: number;
}

export class DeviceProfiler {
  private static instance: DeviceProfiler;
  private capabilities: DeviceCapabilities | null = null;
  private performanceHistory: PerformanceMetrics[] = [];

  static getInstance(): DeviceProfiler {
    if (!DeviceProfiler.instance) {
      DeviceProfiler.instance = new DeviceProfiler();
    }
    return DeviceProfiler.instance;
  }

  /**
   * Detect device capabilities and performance characteristics
   */
  async detectCapabilities(): Promise<DeviceCapabilities> {
    if (this.capabilities) {
      return this.capabilities;
    }

    console.log('[DeviceProfiler] Starting capability detection...');

    const capabilities: DeviceCapabilities = {
      // Hardware detection
      cpuCores: navigator.hardwareConcurrency || 4,
      memoryGB: this.estimateMemory(),
      gpuTier: await this.detectGPUTier(),
      tier: '', // Will be calculated below
      
      // Performance classification
      performanceTier: 'medium', // Will be calculated
      batteryOptimized: this.isBatteryOptimized(),
      networkSpeed: await this.detectNetworkSpeed(),
      
      // Platform detection
      platform: this.detectPlatform(),
      browser: this.detectBrowser(),
      isTouchDevice: 'ontouchstart' in window,
      
      // Display capabilities
      screenSize: {
        width: window.screen.width,
        height: window.screen.height
      },
      pixelRatio: window.devicePixelRatio || 1,
      supportsWebGL: this.checkWebGLSupport(),
      maxTextureSize: this.getMaxTextureSize()
    };

    // Calculate overall performance tier
    capabilities.performanceTier = this.calculatePerformanceTier(capabilities);
    capabilities.tier = `${capabilities.performanceTier} (${capabilities.cpuCores} cores, ${capabilities.memoryGB}GB RAM)`;

    this.capabilities = capabilities;
    console.log('[DeviceProfiler] Device capabilities detected:', capabilities);
    
    return capabilities;
  }

  /**
   * Estimate available system memory
   */
  private estimateMemory(): number {
    // Modern browsers provide memory info
    if ('memory' in performance) {
      const perfMemory = (performance as any).memory;
      if (perfMemory.jsHeapSizeLimit) {
        // Convert bytes to GB, estimate total system memory
        const heapGB = perfMemory.jsHeapSizeLimit / (1024 * 1024 * 1024);
        return Math.max(2, Math.round(heapGB * 8)); // Rough estimate
      }
    }

    // Fallback estimation based on other factors
    const screenPixels = window.screen.width * window.screen.height;
    const cores = navigator.hardwareConcurrency || 4;
    
    if (screenPixels > 2073600 && cores >= 8) return 16; // 4K+ display, many cores
    if (screenPixels > 1440000 && cores >= 4) return 8;  // 1080p+ display, quad core
    if (screenPixels > 921600 && cores >= 2) return 4;   // 720p+ display, dual core
    return 2; // Conservative estimate
  }

  /**
   * Detect GPU performance tier
   */
  private async detectGPUTier(): Promise<'low' | 'medium' | 'high' | 'unknown'> {
    if (!this.checkWebGLSupport()) {
      return 'low';
    }

    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      
      if (!gl || !(gl instanceof WebGLRenderingContext)) return 'unknown';

      const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
      if (debugInfo) {
        const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
        
        // High-end GPU patterns
        if (/RTX|GTX 16|GTX 20|GTX 30|GTX 40|RX 6|RX 7|M1|M2|M3/i.test(renderer)) {
          return 'high';
        }
        
        // Medium-tier GPU patterns
        if (/GTX|RX|Intel Iris|Mali-G|Adreno 6|PowerVR/i.test(renderer)) {
          return 'medium';
        }
        
        // Low-end indicators
        if (/Intel HD|Mali-4|Adreno 3|Adreno 4/i.test(renderer)) {
          return 'low';
        }
      }

      // Performance test fallback
      const maxTextureSize = gl.getParameter(gl.MAX_TEXTURE_SIZE);
      if (maxTextureSize >= 16384) return 'high';
      if (maxTextureSize >= 8192) return 'medium';
      return 'low';

    } catch (error) {
      console.warn('[DeviceProfiler] GPU detection failed:', error);
      return 'unknown';
    }
  }

  /**
   * Detect if device is in battery optimization mode
   */
  private isBatteryOptimized(): boolean {
    // Check for battery API
    if ('getBattery' in navigator) {
      // Note: Battery API is deprecated but still useful where available
      return true; // Assume mobile devices benefit from optimization
    }
    
    // Mobile devices typically benefit from battery optimization
    return /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  }

  /**
   * Detect network speed category
   */
  private async detectNetworkSpeed(): Promise<'slow' | 'medium' | 'fast'> {
    // Modern connection API
    if ('connection' in navigator) {
      const connection = (navigator as any).connection;
      if (connection) {
        const effectiveType = connection.effectiveType;
        
        if (effectiveType === '4g' || connection.downlink > 10) return 'fast';
        if (effectiveType === '3g' || connection.downlink > 1.5) return 'medium';
        return 'slow';
      }
    }

    // Simple speed test fallback
    try {
      const start = performance.now();
      await fetch('/favicon.ico', { cache: 'no-cache' });
      const latency = performance.now() - start;
      
      if (latency < 100) return 'fast';
      if (latency < 500) return 'medium';
      return 'slow';
    } catch {
      return 'medium'; // Default assumption
    }
  }

  /**
   * Detect platform type
   */
  private detectPlatform(): 'mobile' | 'tablet' | 'desktop' {
    const userAgent = navigator.userAgent;
    const screenWidth = window.screen.width;
    
    // Mobile indicators
    if (/Android|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent)) {
      return 'mobile';
    }
    
    // Tablet indicators
    if (/iPad|Android.*Tablet|Kindle|Silk/i.test(userAgent) || 
        (screenWidth >= 768 && screenWidth <= 1024 && 'ontouchstart' in window)) {
      return 'tablet';
    }
    
    return 'desktop';
  }

  /**
   * Detect browser type
   */
  private detectBrowser(): string {
    const userAgent = navigator.userAgent;
    
    if (userAgent.includes('Chrome')) return 'Chrome';
    if (userAgent.includes('Firefox')) return 'Firefox';
    if (userAgent.includes('Safari')) return 'Safari';
    if (userAgent.includes('Edge')) return 'Edge';
    if (userAgent.includes('Opera')) return 'Opera';
    
    return 'Unknown';
  }

  /**
   * Check WebGL support
   */
  private checkWebGLSupport(): boolean {
    try {
      const canvas = document.createElement('canvas');
      return !!(canvas.getContext('webgl') || canvas.getContext('experimental-webgl'));
    } catch {
      return false;
    }
  }

  /**
   * Get maximum texture size
   */
  private getMaxTextureSize(): number {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      
      if (gl && gl instanceof WebGLRenderingContext) {
        return gl.getParameter(gl.MAX_TEXTURE_SIZE);
      }
    } catch {
      // Fallback
    }
    
    return 2048; // Conservative fallback
  }

  /**
   * Calculate overall performance tier based on capabilities
   */
  private calculatePerformanceTier(capabilities: DeviceCapabilities): 'low' | 'medium' | 'high' {
    let score = 0;
    
    // CPU score (0-3 points)
    if (capabilities.cpuCores >= 8) score += 3;
    else if (capabilities.cpuCores >= 4) score += 2;
    else if (capabilities.cpuCores >= 2) score += 1;
    
    // Memory score (0-3 points)
    if (capabilities.memoryGB >= 16) score += 3;
    else if (capabilities.memoryGB >= 8) score += 2;
    else if (capabilities.memoryGB >= 4) score += 1;
    
    // GPU score (0-3 points)
    if (capabilities.gpuTier === 'high') score += 3;
    else if (capabilities.gpuTier === 'medium') score += 2;
    else if (capabilities.gpuTier === 'low') score += 1;
    
    // Platform modifier
    if (capabilities.platform === 'desktop') score += 1;
    else if (capabilities.platform === 'mobile') score -= 1;
    
    // WebGL support
    if (capabilities.supportsWebGL && capabilities.maxTextureSize >= 8192) score += 1;
    
    // Calculate tier
    if (score >= 8) return 'high';
    if (score >= 5) return 'medium';
    return 'low';
  }

  /**
   * Get current device capabilities
   */
  getCapabilities(): DeviceCapabilities | null {
    return this.capabilities;
  }

  /**
   * Record performance metrics for analysis
   */
  recordMetrics(metrics: PerformanceMetrics): void {
    this.performanceHistory.push({
      ...metrics,
      // Add timestamp if not present
      loadTime: metrics.loadTime || performance.now()
    });
    
    // Keep only recent history (last 100 measurements)
    if (this.performanceHistory.length > 100) {
      this.performanceHistory = this.performanceHistory.slice(-100);
    }
  }

  /**
   * Get performance analysis
   */
  getPerformanceAnalysis(): { 
    averageFPS: number; 
    averageMemory: number; 
    trend: 'improving' | 'stable' | 'degrading' 
  } {
    if (this.performanceHistory.length < 2) {
      return { averageFPS: 60, averageMemory: 0, trend: 'stable' };
    }

    const recent = this.performanceHistory.slice(-10);
    const averageFPS = recent.reduce((sum, m) => sum + m.fps, 0) / recent.length;
    const averageMemory = recent.reduce((sum, m) => sum + m.memoryUsageMB, 0) / recent.length;
    
    // Simple trend analysis
    const firstHalf = recent.slice(0, 5);
    const secondHalf = recent.slice(5);
    
    const firstAvgFPS = firstHalf.reduce((sum, m) => sum + m.fps, 0) / firstHalf.length;
    const secondAvgFPS = secondHalf.reduce((sum, m) => sum + m.fps, 0) / secondHalf.length;
    
    let trend: 'improving' | 'stable' | 'degrading' = 'stable';
    if (secondAvgFPS > firstAvgFPS + 5) trend = 'improving';
    else if (secondAvgFPS < firstAvgFPS - 5) trend = 'degrading';
    
    return { averageFPS, averageMemory, trend };
  }
}

export default DeviceProfiler;
