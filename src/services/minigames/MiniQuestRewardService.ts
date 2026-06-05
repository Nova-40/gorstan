import type { MiniQuestResult } from "../../minigames/core/MiniQuestTypes";

export function applyRewards(r: MiniQuestResult) {
  if (!r.reward) return;
  console.info("MiniQuestRewardService: would apply rewards", r.reward);
}
