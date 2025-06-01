
// resetSystem.js — v2.8.2
// Handles multiverse resets with quantum Linux-style boot output

export const performReset = (state, dispatch) => {
  displayQuantumBootSequence(dispatch);

  const newState = {
    ...state,
    traits: [],
    flags: { resetCount: (state.flags?.resetCount || 0) + 1 },
    milestones: [],
    inventory: [],
    score: 0,
    room: "controlnexus",
    log: ["🔄 Multiverse reset complete."]
  };

  return newState;
};

const displayQuantumBootSequence = (dispatch) => {
  const messages = [
    "[ 0.000000] Initializing quantum kernel...",
    "[ 0.000001] Loading quark drivers: up, down, charm, strange, top, bottom",
    "[ 0.000002] Entangling leptons: electron, muon, tau",
    "[ 0.000003] Calibrating boson fields: photon, gluon, W±, Z⁰, Higgs",
    "[ 0.000004] Synchronizing with Higgs field... mass acquisition complete",
    "[ 0.000005] Engaging spacetime lattice framework...",
    "[ 0.000006] Layering atomic structure... base elements initialized",
    "[ 0.000007] Combining synthesized elements: carbon, silicon, xenon, vibranium*",
    "[ 0.000008] Binding matter, gravity, and entropy parameters...",
    "[ 0.000009] Now recreating suns and planets across all layers...",
    "[ 0.000010] Layer 1 universe complete.",
    "[ 0.000011] Layer 2 universe complete.",
    "[ 0.000012] Layer 3 universe complete.",
    "[ 0.000013] Layer 4 universe complete.",
    "[ 0.000014] Multiversal harmonics stabilizing...",
    "[ 0.000015] Boot sequence complete. Welcome to the quantum realm."
  ];

  messages.forEach((msg, index) => {
    setTimeout(() => {
      dispatch({ type: "LOG", payload: msg });
    }, index * 500);
  });
};
