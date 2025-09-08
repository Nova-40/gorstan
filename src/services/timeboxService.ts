/**
 * Timebox Service
 * Manages time-limited game sessions with warnings and progression tracking
 */

export interface TimeboxConfig {
  targetMinutes: number;
  warningThresholds: number[]; // Minutes remaining when to show warnings
  allowOvertime: boolean;
  overtimeGracePeriod?: number; // Additional minutes allowed after target
}

export interface TimeboxState {
  startTime: number;
  targetMinutes: number;
  currentMinutes: number;
  remainingMinutes: number;
  isWarning: boolean;
  isOvertime: boolean;
  isExpired: boolean;
  warningLevel: 'none' | 'early' | 'urgent' | 'critical';
}

export interface TimeboxCallbacks {
  onWarning?: (state: TimeboxState) => void;
  onOvertime?: (state: TimeboxState) => void;
  onExpired?: (state: TimeboxState) => void;
  onTick?: (state: TimeboxState) => void;
}

export class TimeboxService {
  private config: TimeboxConfig;
  private callbacks: TimeboxCallbacks;
  private startTime: number;
  private intervalId: number | null = null;
  private isActive = false;

  constructor(config: TimeboxConfig, callbacks: TimeboxCallbacks = {}) {
    this.config = config;
    this.callbacks = callbacks;
    this.startTime = Date.now();
  }

  start(): void {
    if (this.isActive) {return;}
    
    this.isActive = true;
    this.startTime = Date.now();
    
    // Update every 10 seconds for performance
    this.intervalId = window.setInterval(() => {
      this.tick();
    }, 10000);
    
    // Initial tick
    this.tick();
  }

  stop(): void {
    if (!this.isActive) {return;}
    
    this.isActive = false;
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  pause(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  resume(): void {
    if (!this.isActive) {return;}
    
    this.intervalId = window.setInterval(() => {
      this.tick();
    }, 10000);
  }

  getState(): TimeboxState {
    const now = Date.now();
    const elapsedMs = now - this.startTime;
    const currentMinutes = Math.floor(elapsedMs / 60000);
    const remainingMinutes = Math.max(0, this.config.targetMinutes - currentMinutes);
    
    const isOvertime = currentMinutes > this.config.targetMinutes;
    const overtimeMinutes = Math.max(0, currentMinutes - this.config.targetMinutes);
    const isExpired = this.config.allowOvertime 
      ? (this.config.overtimeGracePeriod ? overtimeMinutes > this.config.overtimeGracePeriod : false)
      : isOvertime;

    const warningLevel = this.getWarningLevel(remainingMinutes);
    const isWarning = warningLevel !== 'none';

    return {
      startTime: this.startTime,
      targetMinutes: this.config.targetMinutes,
      currentMinutes,
      remainingMinutes,
      isWarning,
      isOvertime,
      isExpired,
      warningLevel,
    };
  }

  private getWarningLevel(remainingMinutes: number): TimeboxState['warningLevel'] {
    const thresholds = [...this.config.warningThresholds].sort((a, b) => b - a);
    
    if (remainingMinutes <= 0) {return 'critical';}
    const threshold2 = thresholds[2];
    const threshold1 = thresholds[1];
    const threshold0 = thresholds[0];
    if (thresholds.length >= 3 && threshold2 !== undefined && remainingMinutes <= threshold2) {return 'critical';}
    if (thresholds.length >= 2 && threshold1 !== undefined && remainingMinutes <= threshold1) {return 'urgent';}
    if (thresholds.length >= 1 && threshold0 !== undefined && remainingMinutes <= threshold0) {return 'early';}
    
    return 'none';
  }

  private tick(): void {
    const state = this.getState();
    
    // Call general tick callback
    this.callbacks.onTick?.(state);
    
    // Check for state changes and call appropriate callbacks
    if (state.isExpired && this.callbacks.onExpired) {
      this.callbacks.onExpired(state);
      this.stop(); // Auto-stop when expired
      return;
    }
    
    if (state.isOvertime && this.callbacks.onOvertime) {
      this.callbacks.onOvertime(state);
    }
    
    if (state.isWarning && this.callbacks.onWarning) {
      this.callbacks.onWarning(state);
    }
  }

  // Static factory methods for common configurations
  static forDemo(callbacks?: TimeboxCallbacks): TimeboxService {
    return new TimeboxService({
      targetMinutes: 7,
      warningThresholds: [3, 1],
      allowOvertime: true,
      overtimeGracePeriod: 3,
    }, callbacks);
  }

  static forShort10(callbacks?: TimeboxCallbacks): TimeboxService {
    return new TimeboxService({
      targetMinutes: 10,
      warningThresholds: [5, 2, 1],
      allowOvertime: true,
      overtimeGracePeriod: 2,
    }, callbacks);
  }

  static forShort30(callbacks?: TimeboxCallbacks): TimeboxService {
    return new TimeboxService({
      targetMinutes: 30,
      warningThresholds: [10, 5, 2],
      allowOvertime: true,
      overtimeGracePeriod: 5,
    }, callbacks);
  }

  static forFull(callbacks?: TimeboxCallbacks): TimeboxService {
    return new TimeboxService({
      targetMinutes: 999,
      warningThresholds: [],
      allowOvertime: true,
    }, callbacks);
  }
}

// React Hook for using TimeboxService
import { useEffect, useState, useRef } from 'react';

export function useTimebox(config: TimeboxConfig, callbacks?: TimeboxCallbacks) {
  const [state, setState] = useState<TimeboxState | null>(null);
  const serviceRef = useRef<TimeboxService | null>(null);

  useEffect(() => {
    const service = new TimeboxService(config, {
      ...callbacks,
      onTick: (newState) => {
        setState(newState);
        callbacks?.onTick?.(newState);
      },
    });

    serviceRef.current = service;
    service.start();

    return () => {
      service.stop();
    };
  }, [config.targetMinutes, config.allowOvertime, config.overtimeGracePeriod]);

  const pause = () => serviceRef.current?.pause();
  const resume = () => serviceRef.current?.resume();
  const stop = () => serviceRef.current?.stop();

  return {
    state,
    pause,
    resume,
    stop,
  };
}
