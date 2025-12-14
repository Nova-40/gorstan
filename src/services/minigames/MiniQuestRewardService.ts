import { MiniQuestResult } from "../../minigames/core/MiniQuestTypes";

// TODO: wire to real inventory/lore/flags systems
export function applyRewards(r: MiniQuestResult) {
  if (!r.reward) return;
  // Example pseudo-implementation; replace with real systems.
  // Inventory.addItems(r.reward.itemsGranted ?? []);
  // Lore.unlockMany(r.reward.loreIds ?? []);
  // Flags.setMany(r.reward.flagsSet ?? []);
  // Stats.apply(r.reward.statsDelta ?? {});
  console.info("MiniQuestRewardService: would apply rewards", r.reward);
}
