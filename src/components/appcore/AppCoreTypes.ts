/*
  Gorstan – Copyright © 2025 Geoff Webster. All Rights Reserved.

  Shared AppCore-facing types for the incremental AppCore modularisation.
*/

export type GameStage =
  | 'splash'
  | 'welcome'
  | 'nameCapture'
  | 'routeSelect'
  | 'intro'
  | 'demo'
  | 'demoList'
  | 'game'
  | 'trialsGame'
  | 'transition_jump'
  | 'transition_sip'
  | 'transition_wait'
  | 'transition_dramatic_wait';

export type OpenModalType =
  | 'inventory'
  | 'useItem'
  | 'look'
  | 'pickUp'
  | 'saveGame'
  | 'npcConsole'
  | 'npcSelection'
  | 'trapManagement'
  | null;

export type TeleportType = 'fractal' | 'trek' | null;

export interface IntroCompletionData {
  route: string;
  targetRoom?: string;
  inventoryBonus?: string[];
}

export interface AppCoreSaveSlot {
  id: string;
  name: string;
  playerName: string;
  currentRoom: string;
  timestamp: number;
  score: number;
  playTime: number;
}

export interface AppCoreDirectionAvailability {
  north: boolean;
  south: boolean;
  east: boolean;
  west: boolean;
  jump: boolean;
  sit: boolean;
  up: boolean;
  down: boolean;
}

export interface AppCoreDirectionTitles {
  north: string;
  south: string;
  east: string;
  west: string;
  jump: string;
  sit: string;
  up: string;
  down: string;
  back: string;
  out: string;
}
