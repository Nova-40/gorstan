/*
  Gorstan – Copyright © 2025 Geoff Webster. All Rights Reserved.
  
  Central registry and router for demo routes and adventures
*/

import { demoState, DemoRoute } from '../engine/state/demoState';
import { startTrialsOfGorstan } from './demoScripts/trialsOfGorstan';
import { startGladeOfEchoes } from './demoScripts/gladeOfEchoes';
import { startTramlinesOfTime } from './demoScripts/tramlinesOfTime';
import { startRuinsOfStanton } from './demoScripts/ruinsOfStanton';
// Longform + consolidated showcase routes quarantined (see legacy/demo). Remove imports.
// import { startThreeRegnants } from './longform/theThreeRegnants';
// import { startFractureOfTheNine } from './longform/fractureOfTheNine';
// import { startDominicBirthdayHeist } from './longform/dominicBirthdayHeist';
// import { startMasterShowcase } from './ConsolidatedShowcase';

export const demoRoutes: DemoRoute[] = [
  // Short demos retained; longform + showcase removed during Phase 1 cleanup.
  {
    id: "trials-of-gorstan",
    title: "Enhanced Trials of Gorstan",
    kind: "short",
    durationMin: 10,
    entry: startTrialsOfGorstan,
    summary: "Experience wave-based creature combat with strategic safety rocks and enhanced AI."
  },
  {
    id: "glade-of-echoes",
    title: "Glade of Echoes",
    kind: "short",
    durationMin: 10,
    entry: startGladeOfEchoes,
    summary: "Whispering trees, mirrored choices, moral test."
  },
  {
    id: "tramlines-of-time",
    title: "Tramlines of Time",
    kind: "short",
    durationMin: 10,
    entry: startTramlinesOfTime,
    summary: "Signals, switches, and timeline sidings."
  },
  {
    id: "ruins-of-stanton",
    title: "Ruins of Stanton",
    kind: "short",
    durationMin: 10,
    entry: startRuinsOfStanton,
    summary: "Local history fractal—documents and ghosts of policy."
  }
];

export async function startDemo(id: string, unattended = false) {
  console.log(`[DemoRouter] Starting demo: ${id}, unattended: ${unattended}`);
  
  const route = demoRoutes.find(r => r.id === id);
  if (!route) {
    throw new Error(`Demo route not found: ${id}`);
  }
  
  // Set demo state
  demoState.activeRouteId = id;
  demoState.startedAt = Date.now();
  demoState.unattended = unattended;
  demoState.demoMode = true;
  
  try {
    await route.entry();
    console.log(`[DemoRouter] Demo completed: ${id}`);
  } catch (error) {
    console.error(`[DemoRouter] Demo failed: ${id}`, error);
    clearDemo();
    throw error;
  }
}

export function clearDemo() {
  console.log('[DemoRouter] Clearing demo state');
  demoState.activeRouteId = null;
  demoState.startedAt = null;
  demoState.unattended = false;
  demoState.demoMode = false;
}

export function getDemoRoute(id: string): DemoRoute | undefined {
  return demoRoutes.find(r => r.id === id);
}

export function getShortDemos(): DemoRoute[] {
  return demoRoutes.filter(r => r.kind === "short");
}

export function getLongDemos(): DemoRoute[] {
  return demoRoutes.filter(r => r.kind === "long");
}
