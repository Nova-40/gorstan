// Gorstan Game Module — v3.0.0
export const firstAidKit = {
  id: "firstAidKit",
  name: "First Aid Kit",
  description: "A small red case with gauze, tape, and antiseptic. Limited uses.",
  uses: 3,
  heal: { health: 25, mood: 5 },
};

export const morthosCrown = {
  id: "morthosCrown",
  name: "Morthos' Crown",
  description: "A mysterious crown that absorbs part of incoming harm.",
  passiveEffect: { absorb: 0.25 },
};