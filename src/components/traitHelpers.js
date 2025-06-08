// Gorstan Game Module — v3.0.0
export function playerHasTrait(traitName, state) {
  return (state.traits || []).includes(traitName);
}