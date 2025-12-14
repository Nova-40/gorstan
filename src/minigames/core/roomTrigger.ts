import { pickWeighted } from './selectMini';
import { canTrigger, stampTrigger } from './cooldown';
import { listMiniQuests } from '../core/MiniQuestRegistry';

export type QuantumMiniCfg = {
  mode: 'fixed' | 'random';
  ids: string[];
  seedHint?: string;
  cooldownSec?: number;
  reusable?: boolean;
};

// Attempt to launch a mini for a room according to a quantumMiniQuest config.
// Returns chosen id or undefined.
export async function maybeLaunchRoomMini(cfg: QuantumMiniCfg, roomId: string) {
  const ids = cfg.ids ?? [];
  if (!ids.length) return undefined;
  const chosen = cfg.mode === 'random' ? pickWeighted(ids, cfg.seedHint ?? roomId) : ids[0];
  if (!chosen) return undefined;
  if (!canTrigger(roomId, chosen, cfg.cooldownSec ?? 0)) return undefined;

  // Preload the module folder if possible
  try {
  // Include file extension in dynamic import so Vite can statically analyze the import path.
  void import(/* webpackPrefetch: true */ `../${chosen}/${chosen}Game.js`).catch(()=>{});
  } catch (e) {
    // ignore
  }

  // Use the global mini launcher if present
  try {
    (window as any).mini?.launch(chosen, roomId);
    stampTrigger(roomId, chosen);
  } catch (e) {
    // ignore
  }
  return chosen;
}
