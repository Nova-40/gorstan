// /src/engine/introLogic.js
// MIT License © 2025 Geoff Webster
// Handles name entry and intro choice logic in Gorstan.

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

export function handleIntroChoice(choice, setScreen, setStartRoom) {
  switch (choice.toLowerCase()) {
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
