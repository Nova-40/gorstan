/*
  Gorstan – Copyright © 2025 Geoff Webster. All Rights Reserved.
  
  Idle autostart system for unattended demo after 2.5 minutes
*/

import { startDemo } from '../demo/demoRouter';
import { demoService } from '../demo/DemoModeService';

const IDLE_MS = 150_000; // 2.5 minutes
let idleTimer: number | null = null;
let countdownTimer: number | null = null;
let onWelcome = false;

const activityEvents = [
  'mousemove',
  'mousedown',
  'keydown',
  'touchstart',
  'wheel',
  'pointerdown',
  'gamepadconnected',
  'focus',
  'click',
];

function startCountdown() {
  const startTime = Date.now();

  // Clear any existing countdown
  if (countdownTimer) {
    clearInterval(countdownTimer);
  }

  // Update countdown every 100ms
  countdownTimer = window.setInterval(() => {
    const elapsed = Date.now() - startTime;
    const remaining = Math.max(0, IDLE_MS - elapsed);

    // Dispatch countdown update event
    const ev = new CustomEvent('idle-countdown-reset', {
      detail: { total: IDLE_MS, remaining },
    });
    window.dispatchEvent(ev);

    if (remaining <= 0) {
      clearInterval(countdownTimer!);
      countdownTimer = null;
    }
  }, 100);
}

function resetTimer() {
  if (!onWelcome) {
    return;
  }

  if (idleTimer) {
    window.clearTimeout(idleTimer);
  }

  if (countdownTimer) {
    clearInterval(countdownTimer);
    countdownTimer = null;
  }

  idleTimer = window.setTimeout(() => {
    console.log('[IdleAutostart] Starting unattended demo after 150s idle');

    // Dispatch demo start event
    const demoEvent = new CustomEvent('demo-start');
    window.dispatchEvent(demoEvent);

  demoService.start('trials-of-gorstan');
  }, IDLE_MS);

  // Start the visual countdown
  startCountdown();
}

export function attachWelcomeIdleAutostart() {
  console.log('[IdleAutostart] Attaching idle watcher for Welcome screen');
  onWelcome = true;

  activityEvents.forEach((eventType) => {
    window.addEventListener(eventType, resetTimer, { passive: true });
  });

  resetTimer(); // Start initial timer
}

export function detachWelcomeIdleAutostart() {
  console.log('[IdleAutostart] Detaching idle watcher');
  onWelcome = false;

  if (idleTimer) {
    window.clearTimeout(idleTimer);
    idleTimer = null;
  }

  if (countdownTimer) {
    clearInterval(countdownTimer);
    countdownTimer = null;
  }

  activityEvents.forEach((eventType) => {
    window.removeEventListener(eventType, resetTimer);
  });
}

// Force trigger for testing
export function triggerUnattendedDemo() {
  if (idleTimer) {
    window.clearTimeout(idleTimer);
  }
  demoService.start('trials-of-gorstan');
}
