import type { ComponentType } from "react";

export type MiniQuestId =
  | "atomWeaver"
  | "paradoxRunner"
  | "quantumMirror"
  | "colliderRoyale"
  | "doubleSlitRun";

export type MiniQuestOutcome = "win" | "loss" | "partial" | "abort";

export interface MiniQuestReward {
  loreIds?: string[];
  itemsGranted?: string[];
  flagsSet?: string[];
  statsDelta?: Record<string, number>;
}

export interface MiniQuestResult {
  questId: MiniQuestId;
  outcome: MiniQuestOutcome;
  score: number;
  durationMs: number;
  metadata?: Record<string, unknown>;
  reward?: MiniQuestReward;
}

export interface MiniQuestProps {
  onComplete: (result: MiniQuestResult) => void;
  onCancel: () => void;
  // exactOptionalPropertyTypes is enabled in tsconfig; include undefined explicitly
  seed?: string | undefined;
  roomId?: string | undefined;
  isDemo?: boolean | undefined; // minis should auto-complete gracefully if true
}

export interface MiniQuestSpec {
  id: MiniQuestId;
  displayName: string;
  mount: ComponentType<MiniQuestProps>;
  weight?: number;
  tags?: Array<"puzzle"|"reflex"|"quantum"|"casino"|"narrative">;
  defaultRoomBindings?: string[];
  difficulty: "easy" | "normal" | "hard";
}
