import type { MiniQuestSpec, MiniQuestId } from "./MiniQuestTypes";
import { AtomWeaverGame } from "../atomweaver/AtomWeaverGame";
import { ParadoxRunnerGame } from "../paradoxrunner/ParadoxRunnerGame";
import QuantumMirrorGame from "../quantummirror/QuantumMirrorGame";
import { ColliderRoyaleGame } from "../colliderroyale/ColliderRoyaleGame";
import { DoubleSlitRunGame } from "../doubleslitrun/DoubleSlitRunGame";

export const MINI_QUESTS: MiniQuestSpec[] = [
  { id: "atomWeaver", displayName: "Atom Weaver (Fusion Rush)", mount: AtomWeaverGame, defaultRoomBindings: ["faeglade.lab"], difficulty: "normal" },
  { id: "paradoxRunner", displayName: "Paradox Runner", mount: ParadoxRunnerGame, defaultRoomBindings: ["glitchrealm.hall"], difficulty: "hard" },
  { id: "quantumMirror", displayName: "Quantum Mirror", mount: QuantumMirrorGame, defaultRoomBindings: ["trentpark.dawn"], difficulty: "normal" },
  { id: "colliderRoyale", displayName: "Collider Royale", mount: ColliderRoyaleGame, defaultRoomBindings: ["controlnexus.core"], difficulty: "normal" },
  { id: "doubleSlitRun", displayName: "Double-Slit Run", mount: DoubleSlitRunGame, defaultRoomBindings: ["maze.zone1"], difficulty: "hard" },
];

export function getMiniQuestById(id: string): MiniQuestSpec | undefined {
  return MINI_QUESTS.find(q => q.id === id as MiniQuestId);
}

export function listMiniQuests() {
  return MINI_QUESTS.map(q => ({ id: q.id, displayName: q.displayName, difficulty: q.difficulty }));
}

export const registerMini = (spec: MiniQuestSpec) => { MINI_QUESTS.push(spec); };
export const getMini = (id: string) => MINI_QUESTS.find(m => m.id === id);
