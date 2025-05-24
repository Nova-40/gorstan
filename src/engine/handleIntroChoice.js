// handleIntroChoice.js
// Gorstan v2.4.1 – Resilient intro logic
// MIT License © 2025 Geoff Webster

/**
 * Handles player decision at intro and transitions to game.
 * @param {string} choice - The player's selection ("jump", "wait", "sip").
 * @param {Function} setScreen - React state setter for screen.
 * @param {Function} setStartRoom - React state setter for room.
 */
export function handleIntroChoice(choice, setScreen, setStartRoom) {
  const DELAY = 4000;

  const transition = (screen, room) => {
    try {
      setScreen(screen);
      setTimeout(() => {
        setStartRoom(room);
        setScreen("game");
      }, DELAY);
    } catch (err) {
      console.error(`[IntroChoice] Transition error for choice "${choice}":`, err);
    }
  };

  switch (choice) {
    case "jump":
      transition("introjump", "controlnexus");
      break;
    case "wait":
      transition("splat", "introreset");
      break;
    case "sip":
      transition("introjump", "latticeroom");
      break;
    default:
      console.warn(`[IntroChoice] Unknown choice: ${choice}`);
      setScreen("error");
      break;
  }
}

