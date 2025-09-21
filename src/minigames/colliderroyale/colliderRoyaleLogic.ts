export function sampleOutcome(energy:number, angle:number) {
  // TODO: implement weighted sampling table
  const roll = Math.random();
  if (roll < 0.8) return { rarity: "common" };
  if (roll < 0.98) return { rarity: "rare" };
  return { rarity: "exotic" };
}
