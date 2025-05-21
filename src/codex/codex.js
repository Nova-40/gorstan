
// Gorstan Game v2.4.0
// MIT License
// Gorstan, its characters and storyline © Geoff Webster 2025
// Description: Codex unlock and display logic

const codexEntries = {
  loopwalker: {
    id: "loopwalker",
    title: "The Loopwalker",
    text: "Some do not rely on tokens or allies. They endure. Alone. The maze remembers them.",
    discovered: false,
  },
  morthos: {
    id: "morthos",
    title: "Morthos",
    text: "Once a builder of the Lattice. Now a reluctant guardian.",
    discovered: false,
  },
  al: {
    id: "al",
    title: "Al",
    text: "He sees the pattern behind the pattern. Trust, calculated.",
    discovered: false,
  },
  polly: {
    id: "polly",
    title: "Polly",
    text: "She always lies. But this time, she let you go.",
    discovered: false,
  }
};

export function unlock(id) {
  if (codexEntries[id]) codexEntries[id].discovered = true;
}

export function getDiscovered() {
  return Object.values(codexEntries).filter(e => e.discovered);
}
