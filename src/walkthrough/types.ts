import type { Room } from '../types/Room';
import type { GameMessage } from '../types/GameTypes';

export type WalkthroughOutcome = 'pass' | 'warning' | 'fail';
export type WalkthroughStatus = 'idle' | 'running' | 'paused' | 'stopped' | 'completed';

export interface WalkthroughStep {
  id: string;
  label: string;
  command: string;
  expectedRoom?: string;
  expectedText?: string | string[];
  notePrompt?: string;
  delayMs?: number;
  stopOnFailure?: boolean;
}

export interface WalkthroughScript {
  id: string;
  title: string;
  description: string;
  defaultDelayMs: number;
  steps: WalkthroughStep[];
}

export interface WalkthroughContext {
  currentRoomId: string;
  roomMap: Record<string, Room>;
}

export interface WalkthroughLogEntry {
  stepNumber: number;
  stepId: string;
  label: string;
  command: string;
  roomBefore: string;
  roomAfter: string;
  outputSummary: string;
  outcome: WalkthroughOutcome;
  warnings: string[];
  timestamp: string;
  notePrompt?: string;
}

export interface WalkthroughSummary {
  totalSteps: number;
  passedSteps: number;
  warningSteps: number;
  failedSteps: number;
  roomsVisited: string[];
  commandsRun: string[];
  warnings: string[];
  suggestedAreasForManualReview: string[];
}

export interface WalkthroughReport {
  script: Pick<WalkthroughScript, 'id' | 'title' | 'description'>;
  status: WalkthroughStatus;
  summary: WalkthroughSummary;
  entries: WalkthroughLogEntry[];
}

export interface WalkthroughRunnerSnapshot {
  currentRoomId: string;
  history: GameMessage[];
}
