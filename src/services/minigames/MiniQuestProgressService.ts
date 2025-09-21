import { MiniQuestResult } from "../../minigames/core/MiniQuestTypes";
const KEY = "gorstan.miniquest.progress";
export type ProgressMap = Record<string, { runs: number; bestScore: number; last: number }>;

export function recordResult(r: MiniQuestResult) {
  try {
    const raw = localStorage.getItem(KEY);
    const map: ProgressMap = raw ? JSON.parse(raw) : {};
    const prev = map[r.questId] ?? { runs: 0, bestScore: 0, last: 0 };
    map[r.questId] = { runs: prev.runs + 1, bestScore: Math.max(prev.bestScore, r.score), last: Date.now() };
    localStorage.setItem(KEY, JSON.stringify(map));
  } catch (e) {
    // no secrets in logs
    console.warn("MiniQuestProgressService: failed to persist progress", e);
  }
}

export function getProgress(): ProgressMap {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    return {};
  }
}
