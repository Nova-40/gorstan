
// score.js — v2.8.2
// Centralized score handling with logging and trait integration

export const updateScore = (currentScore, delta, reason, state, dispatch) => {
  let finalDelta = delta;

  if (state.traits?.includes("ambitious")) {
    finalDelta += Math.floor(delta * 0.2); // +20% bonus
  }

  const newScore = (currentScore || 0) + finalDelta;
  const sign = finalDelta >= 0 ? "+" : "";

  dispatch({
    type: "LOG",
    payload: `🧮 Score ${sign}${finalDelta}: ${reason}`
  });

  return newScore;
};

export const calculatePuzzleBonus = (basePoints, hasTreasure, milestoneUnlocked = false) => {
  let bonus = basePoints;

  if (hasTreasure) bonus += 20;
  if (milestoneUnlocked) bonus *= 2;

  return bonus;
};
