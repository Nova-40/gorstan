import { MINI_QUESTS } from "./MiniQuestRegistry";
import { hashString, mulberry32 } from "./rng";

/**
 * Pick an id from candidates using seeded weighted random.
 * weights param can override per-id weights.
 */
export function pickWeighted(ids: string[], seedHint?: string, weights?: Partial<Record<string, number>>) {
  const rng = mulberry32(hashString(ids.join(",") + "|" + (seedHint ?? "")));
  const pool = ids.map(id => {
    const spec = MINI_QUESTS.find(m => m.id === id);
    const w = (weights?.[id] ?? spec?.weight ?? 1) as number;
    return { id, w };
  });
  const total = pool.reduce((a,b)=>a+b.w,0);
  let r = rng()*total;
  for (const p of pool) { r -= p.w; if (r <= 0) return p.id; }
  return pool[pool.length-1]?.id ?? ids[0];
}
