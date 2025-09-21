export function spawnHazard(seed?: string) {
  // TODO: deterministic hazards
  return { lane: Math.floor(Math.random()*3), time: Date.now() };
}

export function recordEcho(path:any) { /* TODO */ }
