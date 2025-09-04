import { useCallback, useEffect, useRef, useState } from 'react';

/** Combined idle demo + Ayla guidance timers hook */
export interface IdleGuidanceConfig {
  demoTotalMs: number;      // e.g. 150000 (2.5m)
  guidanceTotalMs: number;  // e.g. 120000 (2m)
  onDemoTrigger?: () => void;
  onGuidanceTrigger?: () => void;
}

export interface IdleGuidanceState {
  showDemoCountdown: boolean;
  demoSecondsRemaining: number;
  guidanceProgress: number; // 0..1
  showGuidanceModal: boolean;
  resetAll: () => void;
  dismissGuidance: () => void;
}

export function useIdleGuidanceTimers(cfg: IdleGuidanceConfig): IdleGuidanceState {
  const { demoTotalMs, guidanceTotalMs, onDemoTrigger, onGuidanceTrigger } = cfg;
  const [showDemoCountdown, setShowDemoCountdown] = useState(false);
  const [demoSecondsRemaining, setDemoSecondsRemaining] = useState(demoTotalMs / 1000);
  const [guidanceProgress, setGuidanceProgress] = useState(0);
  const [showGuidanceModal, setShowGuidanceModal] = useState(false);

  const demoStartRef = useRef<number | null>(null);
  const guidanceStartRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);
  const guidanceIntervalRef = useRef<number | null>(null);

  // Store external callbacks in refs to avoid changing hook dependencies every render
  const demoTriggerRef = useRef<typeof onDemoTrigger>(onDemoTrigger);
  const guidanceTriggerRef = useRef<typeof onGuidanceTrigger>(onGuidanceTrigger);
  useEffect(() => { demoTriggerRef.current = onDemoTrigger; }, [onDemoTrigger]);
  useEffect(() => { guidanceTriggerRef.current = onGuidanceTrigger; }, [onGuidanceTrigger]);

  const frame = useCallback((t: number) => {
    if (demoStartRef.current == null) demoStartRef.current = t;
    const elapsed = t - demoStartRef.current;
    const remaining = Math.max(0, demoTotalMs - elapsed);
    setDemoSecondsRemaining(remaining / 1000);
    setShowDemoCountdown(remaining < demoTotalMs && remaining > 0);
    if (remaining <= 0) {
      if (demoTriggerRef.current) demoTriggerRef.current();
    } else {
      rafRef.current = requestAnimationFrame(frame);
    }
  }, [demoTotalMs]);

  const resetAll = useCallback(() => {
    // Demo
    demoStartRef.current = null;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(frame);
    setDemoSecondsRemaining(demoTotalMs / 1000);
    setShowDemoCountdown(false);
    // Guidance
    if (guidanceIntervalRef.current) clearInterval(guidanceIntervalRef.current);
    guidanceStartRef.current = Date.now();
    setGuidanceProgress(0);
    setShowGuidanceModal(false);
    guidanceIntervalRef.current = window.setInterval(() => {
      if (!guidanceStartRef.current) return;
      const elapsed = Date.now() - guidanceStartRef.current;
      const p = Math.min(1, elapsed / guidanceTotalMs);
      setGuidanceProgress(p);
      if (p >= 1) {
        clearInterval(guidanceIntervalRef.current!);
        setShowGuidanceModal(true);
    if (guidanceTriggerRef.current) guidanceTriggerRef.current();
      }
    }, 150);
  }, [demoTotalMs, frame, guidanceTotalMs]);

  const dismissGuidance = useCallback(() => {
    setShowGuidanceModal(false);
    resetAll();
  }, [resetAll]);

  // User activity resets everything
  useEffect(() => {
    resetAll();
    const events = ['mousedown','mousemove','keypress','scroll','touchstart','click'];
    const handler = () => dismissGuidance();
    events.forEach(e => document.addEventListener(e, handler, true));
    return () => {
      events.forEach(e => document.removeEventListener(e, handler, true));
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (guidanceIntervalRef.current) clearInterval(guidanceIntervalRef.current);
    };
  }, [resetAll, dismissGuidance]);

  return { showDemoCountdown, demoSecondsRemaining, guidanceProgress, showGuidanceModal, resetAll, dismissGuidance };
}
