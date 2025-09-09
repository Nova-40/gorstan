/*
  Gorstan – Copyright © 2025 Geoff Webster. All Rights Reserved.
  
  Demo state management for adventure routes and unattended demos
*/

export type DemoKind = 'short' | 'long' | 'unattended' | 'featured';

export interface DemoRoute {
  id: string; // e.g., "trials-of-gorstan"
  title: string; // UI label
  kind: DemoKind; // short, long, unattended, or featured
  durationMin: number; // target runtime for the demo
  entry: () => Promise<void>; // boot function to start sequence
  summary: string; // shown on CYA screen
}

export interface DemoState {
  activeRouteId: string | null;
  startedAt: number | null;
  unattended: boolean;
  demoMode: boolean; // flag to avoid overwriting main save
}

export const demoState: DemoState = {
  activeRouteId: null,
  startedAt: null,
  unattended: false,
  demoMode: false,
};

// Demo completion tracking
export interface DemoProgress {
  completedRoutes: Set<string>;
  currentPhase: string | null;
  phaseStartTime: number | null;
}

export const demoProgress: DemoProgress = {
  completedRoutes: new Set(),
  currentPhase: null,
  phaseStartTime: null,
};
