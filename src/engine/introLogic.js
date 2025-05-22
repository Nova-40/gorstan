// Gorstan v2.4.0 – All modules validated and standardized
// MIT License © 2025 Geoff Webster
// Handles name entry and intro choice logic in Gorstan.

/**
 * Handles player name entry and validation.
 * @param {string} name - The player's entered name.
 * @param {function} setPlayerName - Callback to set the player's name.
 * @param {function} setScreen - Callback to change the current screen.
 */
export function handleNameEntry(name, setPlayerName, setScreen) {
  if (typeof setPlayerName !== "function" || typeof setScreen !== "function") {
    console.error("❌ Invalid handlers passed to handleNameEntry");
    return;
  }

  const cleaned = name.trim();
  if (!cleaned || cleaned.length < 2) {
    alert("Please enter a valid name.");
    return;
  }

  console.log(`✅ Player name accepted: ${cleaned}`);
  setPlayerName(cleaned);
  setScreen("intro");
}

/**
 * Handles the player's intro choice and sets the appropriate start room and screen.
 * @param {string} choice - The player's choice ("jump", "wait", "coffee", etc).
 * @param {function} setScreen - Callback to change the current screen.
 * @param {function} setStartRoom - Callback to set the starting room.
 */
export function handleIntroChoice(choice, setScreen, setStartRoom) {
  if (typeof setScreen !== "function" || typeof setStartRoom !== "function") {
    console.error("❌ Invalid handlers passed to handleIntroChoice");
    return;
  }
  switch (String(choice).toLowerCase()) {
    case "jump":
      console.log("🪂 Player jumped into the portal.");
      setStartRoom("controlnexus");
      setScreen("starter");
      break;

    case "wait":
      console.log("⏳ Player waited. Multiverse rebooted.");
      setStartRoom("introreset");
      setScreen("starter");
      break;

    case "coffee":
    case "sipcoffee":
      console.log("☕ Player picked up the coffee.");
      setStartRoom("introcoffee");
      setScreen("starter");
      break;

    default:
      console.warn("❓ Unknown choice:", choice);
      alert("Unexpected choice. Starting at default location.");
      setStartRoom("controlnexus");
      setScreen("starter");
  }
}

// No default export; only named exports for clarity and tree-shaking.

/*
  === MODULE REVIEW ===
  1. 🔍 VALIDATION
     - No syntax errors or deprecated patterns.
     - No broken imports/exports or circular dependencies.
     - No unreachable code.
  2. 🔁 REFACTORING
     - Removed unused default export and variable.
     - Added defensive checks for handler arguments.
     - Accepts both "coffee" and "sipcoffee" for intro choice.
     - Improved comments and structure.
  3. 💬 COMMENTS & DOCUMENTATION
     - Module and function-level comments included.
     - MIT license and version header included.
  4. 🤝 INTEGRATION CHECK
     - Exports are safe for use in AppCore and intro UI.
     - No side effects; safe for integration.
  5. 🧰 BONUS IMPROVEMENTS
     - Could add unit tests for name validation and choice logic.
     - Could extract alert/console to a UI notification system.
*/
