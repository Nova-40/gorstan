import { pickWeighted } from './selectMini';
import { canTrigger, stampTrigger } from './cooldown';

export type QuantumMiniCfg = {
  mode: 'fixed' | 'random';
  ids: string[];
  seedHint?: string;
  cooldownSec?: number;
  reusable?: boolean;
};

const MINI_PRELOADERS: Record<string, () => Promise<unknown>> = {
  atomWeaver: () => import('../atomweaver/AtomWeaverGame'),
  paradoxRunner: () => import('../paradoxrunner/ParadoxRunnerGame'),
  quantumMirror: () => import('../quantummirror/QuantumMirrorGame'),
  colliderRoyale: () => import('../colliderroyale/ColliderRoyaleGame'),
  doubleSlitRun: () => import('../doubleslitrun/DoubleSlitRunGame'),
};

// Attempt to launch a mini for a room according to a quantumMiniQuest config.
// Returns chosen id or undefined.
export async function maybeLaunchRoomMini(cfg: QuantumMiniCfg, roomId: string) {
  const ids = cfg.ids ?? [];
  if (!ids.length) return undefined;
  const chosen = cfg.mode === 'random' ? pickWeighted(ids, cfg.seedHint ?? roomId) : ids[0];
  if (!chosen) return undefined;
  if (!canTrigger(roomId, chosen, cfg.cooldownSec ?? 0)) return undefined;

  const preload = MINI_PRELOADERS[chosen];
  if (preload) {
    void preload().catch(() => {});
  }

  try {
    (window as any).mini?.launch(chosen, roomId);
    stampTrigger(roomId, chosen);
  } catch {
    // ignore
  }

  return chosen;
}
