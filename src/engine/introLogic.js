// File: src/engine/introLogic.js
// MIT License
// © 2025 Geoff Webster – Gorstan Game Project
// Purpose: Contains logic for Jump, Wait, and Sip actions.


// Gorstan Game Module — v2.8.0
// MIT License © 2025 Geoff Webster
// introLogic.js — Handles pre-game choices and sets initial room logic

/**
 * handleIntroChoice
 * Handles the player's intro choice and sets up the initial game state.
 * @param {string} choice - The player's choice ("jump", "wait", "sip", etc).
 * @param {function} setStartGame - Callback to trigger the start of the game.
 * @param {function} setStartingRoom - Callback to set the initial room.
 * @param {function} addToOutput - Callback to log output/messages.
 */
export function handleIntroChoice(choice, setStartGame, setStartingRoom, addToOutput) {
  switch (choice) {
    case "jump":
      addToOutput("🪂 Player jumped into the portal.");
      setStartingRoom("Control Room 1");
      setStartGame(true);
      break;
    case "wait":
      addToOutput("⏳ Player waited. Multiverse rebooted.");
      setStartingRoom("introreset");
      setStartGame(true);
      break;
    case "sip":
      addToOutput("☕ Player sipped the Gorstan coffee. Something… shifted.");
      setStartingRoom("latticeroom");
      setStartGame(true);
      break;
    default:
      // Defensive: fallback for unknown choices
      addToOutput(`❓ Unknown choice: ${choice}`);
      setStartingRoom("Control Room 1");
      setStartGame(true);
  }
}

/*
Review summary:
- ✅ Syntax is correct and all logic is preserved.
- ✅ No unused or broken imports.
- ✅ Function is documented and named descriptively.
- ✅ Comments clarify intent and behaviour.
- ✅ Module is ready for build and production integration.
*/
