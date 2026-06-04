/*
  Gorstan – Copyright © 2025 Geoff Webster. All Rights Reserved.

  You may play Gorstan for free for personal entertainment only.
  You may NOT copy, redistribute, modify, or sell the game, its code,
  artwork, storyline, or any other part without written permission.

  Full licence terms: see EULA.md in the project root.
*/

// Shared types for Gorstan's hybrid parser / point-and-click room layer.
// This layer describes visual intent only. Game state changes must still flow
// through COMMAND_INPUT and the existing parser/engine pipeline.

export type HotspotKind =
  | 'exit'
  | 'door'
  | 'lockedDoor'
  | 'portableObject'
  | 'inventoryObject'
  | 'fixedObject'
  | 'readable'
  | 'machine'
  | 'button'
  | 'switch'
  | 'lever'
  | 'container'
  | 'character'
  | 'scenery';

export type HotspotShape = 'rect' | 'polygon';

export interface HotspotCommand {
  label: string;
  command: string;
  priority?: number;

  // Data-friendly state gates. Prefer these for room data loaded as plain JSON/TS objects.
  visibleFlag?: string;
  hiddenFlag?: string;
  requiredInventoryItem?: string;

  // Escape hatch for TypeScript-authored rooms. Keep puzzle logic in the engine where possible.
  visible?: (state: any) => boolean;
}

export interface ClickableHotspot {
  id: string;
  label: string;
  commandTarget: string;
  kind: HotspotKind;
  shape: HotspotShape;

  // rect: [leftPct, topPct, widthPct, heightPct]
  // polygon: [x1Pct, y1Pct, x2Pct, y2Pct, ...]
  coords: number[];

  zIndex?: number;
  hoverText?: string;
  defaultCommand?: string;
  commands?: HotspotCommand[];

  visibleFlag?: string;
  hiddenFlag?: string;
  requiredFlag?: string;
  requiredInventoryItem?: string;

  visible?: (state: any) => boolean;
  enabled?: (state: any) => boolean;
  disabledText?: string;
}

export interface RoomWithClickableHotspots {
  id: string;
  title?: string;
  clickHotspots?: ClickableHotspot[];
  hotspots?: ClickableHotspot[];
}
