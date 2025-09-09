/*
  Gorstan – Copyright © 2025 Geoff Webster. All Rights Reserved.
  
  Demo Gate - Entry point for scripted demo mode
  
  Provides environment variable and console command detection
*/

import { startDemo, setDemoDispatch } from './demoController';
import type { Dispatch } from 'react';
import type { GameAction } from '../types/GameTypes';

// Check for demo mode environment variable
export function isDemoEnvironment(): boolean {
  // Check process.env.DEMO or URL parameters
  if (typeof window !== 'undefined') {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.has('demo') || urlParams.get('demo') === 'true';
  }

  return process.env.DEMO === 'true' || process.env.NODE_ENV === 'demo';
}

// Initialize demo system with dispatch
export function initializeDemo(dispatch: Dispatch<GameAction>): void {
  setDemoDispatch(dispatch);

  // Auto-start demo if in demo environment
  if (isDemoEnvironment()) {
    console.log('[DemoGate] Demo environment detected, starting demo...');
    setTimeout(() => {
      startDemo();
    }, 1000);
  }
}

// Console command handler
export function handleDemoCommand(command: string): boolean {
  const trimmed = command.trim().toLowerCase();

  if (trimmed === 'demo') {
    console.log('[DemoGate] Starting demo via console command');
    startDemo();
    return true;
  }

  if (trimmed === 'quit demo' || trimmed === 'stop demo') {
    console.log('[DemoGate] Stopping demo via console command');
    const { stopDemo } = require('./demoController');
    stopDemo();
    return true;
  }

  return false;
}

// Check if command should start demo
export function shouldStartDemo(input: string): boolean {
  return input.trim().toLowerCase() === 'demo';
}
