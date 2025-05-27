// Gorstan Game (c) Geoff Webster 2025 – MIT License
// Module: introLogic.js – v2.4.1

// MIT License © 2025 Geoff Webster
// Gorstan v2.5
// introLogic.js — Handles pre-game choices and sets initial room logic

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
      addToOutput(`❓ Unknown choice: ${choice}`);
      setStartingRoom("Control Room 1");
      setStartGame(true);
  }
}
