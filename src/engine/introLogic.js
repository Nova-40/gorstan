// introLogic.js — v2.8.2
// Handles transitions from intro choices: Jump, Wait, Sip Coffee

export const handleJump = (currentState) => {
  return {
    ...currentState,
    room: "controlnexus",
    score: (currentState.score || 0) + 10,
    inventory: [...(currentState.inventory || []), "coffee"],
    log: "Player jumped into the portal. Score +10. Coffee added."
  };
};

export const handleWait = (currentState) => {
  const updatedInventory = (currentState.inventory || []).filter(item => item !== "coffee");
  return {
    ...currentState,
    room: "introreset",
    score: (currentState.score || 0) - 10,
    inventory: updatedInventory,
    log: "Player waited and got SPLAT. Score -10. Coffee lost."
  };
};

export const handleSip = (currentState) => {
  if (currentState.flags?.hasSipped) {
    return {
      ...currentState,
      log: "Sip Coffee already used — no changes applied."
    };
  }

  return {
    ...currentState,
    room: "quantumlattice",
    score: (currentState.score || 0) + 40,
    inventory: [...(currentState.inventory || []), "coffee"],
    flags: { ...currentState.flags, hasSipped: true },
    log: "Player sipped coffee and glimpsed quantum truth. Score +40. Room set to quantumlattice."
  };
};

export const getIntroResult = (action, currentState) => {
  switch (action) {
    case "jump":
      return handleJump(currentState);
    case "wait":
      return handleWait(currentState);
    case "sip":
      return handleSip(currentState);
    default:
      return {
        ...currentState,
        log: "Unknown intro action. No changes made."
      };
  }
};
